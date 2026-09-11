import { CONTENT_PATH, GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO, UPLOADS_DIR } from './config'

const API = 'https://api.github.com'
const REPO_PATH = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/')

async function request(token, path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(body.message || `GitHub request failed (${response.status})`)
    error.status = response.status
    throw error
  }

  return body
}

function bytesToBase64(bytes) {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToText(base64) {
  const binary = atob(base64.replace(/\s/g, ''))
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

export async function verifyToken(token) {
  const repo = await request(token, REPO_PATH)
  if (!repo.permissions?.push) {
    const error = new Error('This token cannot write to the portfolio repo.')
    error.status = 403
    throw error
  }
  const user = await request(token, '/user').catch(() => null)
  return { login: user?.login ?? GITHUB_OWNER }
}

export async function fetchContent(token) {
  const file = await request(token, `${REPO_PATH}/contents/${encodePath(CONTENT_PATH)}?ref=${GITHUB_BRANCH}`)
  return { content: JSON.parse(base64ToText(file.content)), sha: file.sha }
}

export async function saveContent(token, content, sha, message) {
  const text = `${JSON.stringify(content, null, 2)}\n`
  const result = await request(token, `${REPO_PATH}/contents/${encodePath(CONTENT_PATH)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: bytesToBase64(new TextEncoder().encode(text)),
      sha,
      branch: GITHUB_BRANCH,
    }),
  })
  return result.content.sha
}

// Commits a file into public/uploads and returns the URL path the site serves it from.
export async function uploadFile(token, file) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'file'
  const path = `${UPLOADS_DIR}/${Date.now()}-${safeName}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  await request(token, `${REPO_PATH}/contents/${encodePath(path)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Upload ${file.name}`,
      content: bytesToBase64(bytes),
      branch: GITHUB_BRANCH,
    }),
  })

  return `/${path.replace(/^public\//, '')}`
}

export function describeError(error) {
  if (error instanceof TypeError) return 'Could not reach GitHub. Check your internet connection and try again.'
  switch (error.status) {
    case 401:
      return 'GitHub rejected this token. Check that it was copied fully and has not expired.'
    case 403:
      return 'This token does not have write access. Give it "Contents: Read and write" permission on the repo.'
    case 404:
      return `Could not find ${GITHUB_OWNER}/${GITHUB_REPO} (or ${CONTENT_PATH} on ${GITHUB_BRANCH}). Make sure the token can access the repo and the latest code is pushed.`
    case 409:
    case 422:
      return 'The content changed on GitHub since you loaded it (maybe from another device). Reload the latest version, then make your edits again.'
    default:
      return error.message || 'Something went wrong.'
  }
}
