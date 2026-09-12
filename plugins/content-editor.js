import fs from 'node:fs/promises'
import path from 'node:path'

const CONTENT_FILE = 'src/content.json'
const UPLOADS_DIR = 'public/uploads'
const MAX_JSON_BYTES = 5 * 1024 * 1024
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

const LOCAL_ADDRESSES = new Set(['::1', '127.0.0.1', '::ffff:127.0.0.1'])
const isLocalRequest = (req) => LOCAL_ADDRESSES.has(req.socket?.remoteAddress ?? '')

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('That file is too large.'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/**
 * Dev-only endpoints that let the hidden editor write to the project.
 * `apply: 'serve'` keeps this out of production builds entirely.
 */
export function contentEditor({ allowRemote = false } = {}) {
  return {
    name: 'portfolio-content-editor',
    apply: 'serve',

    // Writing content.json would otherwise trigger a full page reload; the
    // editor already holds the saved content in memory, so keep the page put.
    handleHotUpdate(ctx) {
      if (ctx.file.split(path.sep).join('/').endsWith(CONTENT_FILE)) return []
      return undefined
    },

    configureServer(server) {
      const root = server.config.root

      const guard = (req, res) => {
        if (req.method !== 'POST') {
          send(res, 405, { error: 'Use POST.' })
          return false
        }
        if (!allowRemote && !isLocalRequest(req)) {
          send(res, 403, { error: 'The editor only works on the computer running the dev server.' })
          return false
        }
        return true
      }

      server.middlewares.use('/__editor/save', async (req, res, next) => {
        if (req.originalUrl?.split('?')[0] !== '/__editor/save') return next()
        if (!guard(req, res)) return
        try {
          const body = JSON.parse(await readBody(req, MAX_JSON_BYTES))
          if (!body?.content || typeof body.content !== 'object') {
            return send(res, 400, { error: 'No content was sent.' })
          }
          const file = path.join(root, CONTENT_FILE)
          await fs.writeFile(file, `${JSON.stringify(body.content, null, 2)}\n`, 'utf8')
          server.config.logger.info(`  content saved → ${CONTENT_FILE}`)
          send(res, 200, { ok: true, file: CONTENT_FILE })
        } catch (error) {
          send(res, 500, { error: error.message })
        }
      })

      server.middlewares.use('/__editor/upload', async (req, res, next) => {
        if (req.originalUrl?.split('?')[0] !== '/__editor/upload') return next()
        if (!guard(req, res)) return
        try {
          const body = JSON.parse(await readBody(req, MAX_UPLOAD_BYTES))
          const safeName = String(body?.name ?? '')
            .toLowerCase()
            .replace(/[^a-z0-9.]+/g, '-')
            .replace(/^[-.]+|-+$/g, '')
          if (!safeName || !body?.data) return send(res, 400, { error: 'No file was sent.' })

          const fileName = `${Date.now()}-${safeName}`
          const target = path.join(root, UPLOADS_DIR, fileName)
          await fs.mkdir(path.dirname(target), { recursive: true })
          await fs.writeFile(target, Buffer.from(body.data, 'base64'))
          server.config.logger.info(`  uploaded → ${UPLOADS_DIR}/${fileName}`)
          send(res, 200, { ok: true, path: `/uploads/${fileName}` })
        } catch (error) {
          send(res, 500, { error: error.message })
        }
      })
    },
  }
}
