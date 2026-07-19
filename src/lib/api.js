const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api'

function showToast(message, type = 'info', duration = 4000) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api:toast', { detail: { message, type, duration } }))
  }
}

class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const { headers: extraHeaders, ...rest } = options

  let res
  try {
    res = await fetch(url, {
      ...rest,
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
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
      showToast('Too many requests. Please wait.', 'warning')
    }
    throw new ApiError(
      data?.error || `Request failed with status ${res.status}`,
      res.status,
      data?.code,
      data?.details
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
