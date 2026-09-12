// Talks to the dev-only endpoints in plugins/content-editor.js.
// Nothing here runs on the deployed site — the editor ships only in dev.

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

async function post(endpoint, body) {
  let response
  try {
    response = await fetch(`/__editor${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Could not reach the dev server. Is "npm run dev" still running in your terminal?')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`)
  return data
}

function bytesToBase64(bytes) {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

export function saveContent(content) {
  return post('/save', { content })
}

export async function uploadFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const result = await post('/upload', { name: file.name, data: bytesToBase64(bytes) })
  return result.path
}

export const describeError = (error) => error?.message || 'Something went wrong.'
