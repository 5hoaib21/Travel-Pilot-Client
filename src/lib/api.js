const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api'

import { authClient } from '@/lib/auth-client'

const AI_ERROR_MESSAGES = {
  AI_RATE_LIMIT: 'AI rate limit exceeded. Please wait a moment and try again.',
  AI_TIMEOUT: 'AI request timed out. Please try again.',
  AI_SAFETY_BLOCK: 'Request blocked by AI safety filters.',
  AI_INVALID_KEY: 'AI service configuration error. Please contact support.',
  AI_BILLING_DISABLED: 'AI service billing is not enabled. Please contact support.',
  AI_MODEL_UNAVAILABLE: 'AI model is currently unavailable. Please try again later.',
  AI_NETWORK_ERROR: 'Unable to reach the AI service. Please check your internet connection.',
}

function showToast(message, type = 'info', duration = 4000) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api:toast', { detail: { message, type, duration } }))
  }
}

class ApiError extends Error {
  constructor(message, status, code, details, provider) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.provider = provider
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const { headers: extraHeaders, ...rest } = options

  // Get Better Auth session to attach user identity for Express backend
  let userId = null
  try {
    const session = await authClient.getSession()
      console.log("SESSION =>", session)
      
      if (session?.data?.user?.id) {
        userId = session.data.user.id
      }
      console.log("User Id =>", userId)
  } catch {
    // Session not available, proceed without user ID
  }

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(userId && { 'x-user-id': userId }),
    ...extraHeaders,
  }
  console.log("REQUEST HEADERS =>", requestHeaders)


  let res
  try {
    res = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    })
  } catch (err) {
    showToast('Network error. Check your connection.', 'network')
    throw new ApiError('Network error. Check your connection.', 0, 'NETWORK_ERROR')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } else if (res.status === 429) {
      showToast(AI_ERROR_MESSAGES[data?.code] || 'Too many requests. Please wait.', 'warning')
    }
    throw new ApiError(
      AI_ERROR_MESSAGES[data?.code] || data?.error || `Request failed with status ${res.status}`,
      res.status,
      data?.code,
      data?.details,
      data?.provider
    )
  }

  return data
}

const api = {
  get(path, options) {
    return request(path, { method: 'GET', ...options })
  },
  post(path, body, options) {
    return request(path, { method: 'POST', body: JSON.stringify(body), ...options })
  },
  patch(path, body, options) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body), ...options })
  },
  delete(path, options) {
    return request(path, { method: 'DELETE', ...options })
  },
}

export { api, ApiError, showToast }
