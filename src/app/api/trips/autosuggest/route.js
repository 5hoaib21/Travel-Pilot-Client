const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('q') || ''
    const res = await fetch(`${API_URL}/trips/autosuggest?q=${encodeURIComponent(q)}`, {
      headers: { 'x-user-id': req.headers.get('x-user-id') || '' },
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ suggestions: [] })
  }
}
