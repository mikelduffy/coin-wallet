import { stringify } from 'query-string'

export default async ({ url, params, method = 'GET', body }) => {
  const response = await fetch(
    `${url}${params ? `?${stringify(params)}` : ''}`,
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) {
    const error = new Error(`${response.status} ${response.statusText}`)
    error.response = response
    throw error
  }
  const data = await response.json()
  return data
}
