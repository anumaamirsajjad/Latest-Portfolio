import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO, MAX_UPLOAD_BYTES } from './config'
import { describeError, fetchContent, saveContent, uploadFile, verifyToken } from './github'
import { PALETTE, TABS } from './schema'

const TOKEN_KEY = 'portfolio-admin-token'
const TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new'

const inputClass =
  'w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-[#8a847d] focus:ring-2 focus:ring-[#FFC72C]'
const labelClass = 'block text-[10px] font-black uppercase tracking-[0.18em] text-[#1A1A1A]'
const buttonClass =
  'inline-flex items-center justify-center gap-1 rounded-lg border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#1A1A1A] shadow-[3px_3px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'
const iconButtonClass =
  'inline-flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-xs font-black text-[#1A1A1A] transition hover:bg-[#FFC72C] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white'

const UploadContext = createContext(null)

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function storeToken(token, remember) {
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  } catch {
    // Storage can be unavailable (private mode); the session still works until the tab closes.
  }
}

function StatusText({ status }) {
  if (!status) return null
  const color = status.type === 'error' ? 'text-[#B42318]' : status.type === 'success' ? 'text-[#1F7A6F]' : 'text-[#1A1A1A]'
  return (
    <p role={status.type === 'error' ? 'alert' : 'status'} className={`text-xs font-bold leading-5 ${color}`}>
      {status.message}
    </p>
  )
}

function LinesField({ id, value, rows, onChange }) {
  const toLines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean)
  const joined = value.join('\n')
  const [text, setText] = useState(joined)

  // Re-sync when the list changed from outside (reorder, reload), not from typing here.
  if (toLines(text).join('\n') !== joined) setText(joined)

  return (
    <textarea
      id={id}
      rows={rows ?? 4}
      className={`${inputClass} resize-y leading-6`}
      value={text}
      onChange={(event) => {
        setText(event.target.value)
        onChange(toLines(event.target.value))
      }}
    />
  )
}

function ColorField({ id, value, onChange }) {
  const current = (value || '').toLowerCase()
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Use colour ${color}`}
          aria-pressed={current === color.toLowerCase()}
          onClick={() => onChange(color)}
          className={`h-7 w-7 rounded-full border-2 border-black ${current === color.toLowerCase() ? 'ring-2 ring-black ring-offset-2' : ''}`}
          style={{ background: color }}
        />
      ))}
      <label className="ml-1 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
        Custom
        <input
          id={id}
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#FFC72C'}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-7 w-10 cursor-pointer rounded-md border-2 border-black bg-white p-0.5"
        />
      </label>
    </div>
  )
}

function AssetField({ id, value, accept, onChange }) {
  const upload = useContext(UploadContext)
  const fileInput = useRef(null)
  const [status, setStatus] = useState(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const isImage = accept?.startsWith('image')

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus({ type: 'error', message: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. Keep uploads under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` })
      return
    }

    setStatus({ type: 'working', message: `Uploading ${file.name}…` })
    try {
      const path = await upload(file)
      setPreviewFailed(false)
      onChange(path)
      setStatus({ type: 'success', message: 'Uploaded. It appears on the live site after the next redeploy.' })
    } catch (error) {
      setStatus({ type: 'error', message: describeError(error) })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {isImage && value && !previewFailed && (
          <img
            src={value}
            alt=""
            onError={() => setPreviewFailed(true)}
            className="h-10 w-14 shrink-0 rounded-md border-2 border-black object-cover"
          />
        )}
        <input
          id={id}
          type="text"
          className={inputClass}
          value={value}
          placeholder="/image.png or https://…"
          onChange={(event) => {
            setPreviewFailed(false)
            onChange(event.target.value)
          }}
        />
        <button
          type="button"
          className={`${buttonClass} shrink-0 bg-[#A8D8EA]`}
          disabled={status?.type === 'working'}
          onClick={() => fileInput.current?.click()}
        >
          Upload
        </button>
        <input ref={fileInput} type="file" accept={accept} hidden onChange={handleFile} />
      </div>
      <StatusText status={status} />
    </div>
  )
}

function Field({ field, value, onChange }) {
  const id = useId()
  let control

  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          id={id}
          rows={field.rows ?? 4}
          className={`${inputClass} resize-y leading-6`}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
      break
    case 'lines':
      control = <LinesField id={id} rows={field.rows} value={value ?? []} onChange={onChange} />
      break
    case 'color':
      control = <ColorField id={id} value={value} onChange={onChange} />
      break
    case 'asset':
      control = <AssetField id={id} value={value ?? ''} accept={field.accept} onChange={onChange} />
      break
    case 'list':
      control = (
        <ItemList
          compact
          items={value ?? []}
          fields={field.fields}
          template={field.template}
          addLabel={field.addLabel}
          onChange={onChange}
        />
      )
      break
    default:
      control = (
        <input id={id} type="text" className={inputClass} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      )
  }

  const LabelTag = field.type === 'list' ? 'p' : 'label'

  return (
    <div className="space-y-1.5">
      <LabelTag {...(LabelTag === 'label' ? { htmlFor: id } : {})} className={labelClass}>
        {field.label}
      </LabelTag>
      {control}
      {field.hint && <p className="text-[11px] leading-4 text-[#5d5954]">{field.hint}</p>}
    </div>
  )
}

function ObjectFields({ fields, value, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Field key={field.key} field={field} value={value?.[field.key]} onChange={(next) => onChange({ ...value, [field.key]: next })} />
      ))}
    </div>
  )
}

function ItemControls({ index, count, title, onMove, onRemove }) {
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" className={iconButtonClass} aria-label={`Move ${title} up`} disabled={index === 0} onClick={() => onMove(index, -1)}>
        ↑
      </button>
      <button type="button" className={iconButtonClass} aria-label={`Move ${title} down`} disabled={index === count - 1} onClick={() => onMove(index, 1)}>
        ↓
      </button>
      <button type="button" className={`${iconButtonClass} hover:!bg-[#F4A6A0]`} aria-label={`Remove ${title}`} onClick={() => onRemove(index)}>
        ✕
      </button>
    </div>
  )
}

// Editable, reorderable list. Top-level lists are an accordion; `compact` lists (links etc.) stay expanded.
function ItemList({ items, fields, template, titleOf = () => '', addLabel, compact = false, onChange }) {
  const [openIndex, setOpenIndex] = useState(null)
  const titleFor = (item, index) => titleOf(item) || `Item ${index + 1}`

  const update = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)))

  const add = () => {
    const fresh = structuredClone(template)
    if (compact) {
      onChange([...items, fresh])
    } else {
      onChange([fresh, ...items])
      setOpenIndex(0)
    }
  }

  const remove = (index) => {
    if (!compact && !window.confirm(`Remove “${titleFor(items[index], index)}”?`)) return
    onChange(items.filter((_, i) => i !== index))
    setOpenIndex((open) => (open === index ? null : open !== null && open > index ? open - 1 : open))
  }

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
    setOpenIndex((open) => (open === index ? target : open === target ? index : open))
  }

  const addButton = (
    <button type="button" className={`${buttonClass} ${compact ? 'bg-white' : 'w-full bg-[#FFC72C]'}`} onClick={add}>
      + {addLabel}
    </button>
  )

  return (
    <div className="space-y-3">
      {!compact && addButton}

      {items.map((item, index) => {
        const title = titleFor(item, index)

        // Plain strings (e.g. achievements) edit inline.
        if (!fields) {
          return (
            <div key={index} className="flex items-start gap-2">
              <textarea
                rows={2}
                aria-label={`Item ${index + 1}`}
                className={`${inputClass} resize-y`}
                value={item}
                onChange={(event) => update(index, event.target.value)}
              />
              <ItemControls index={index} count={items.length} title={title} onMove={move} onRemove={remove} />
            </div>
          )
        }

        if (compact) {
          return (
            <div key={index} className="space-y-3 rounded-lg border-2 border-dashed border-black bg-[#FFFDF9] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-[#5d5954]">#{index + 1}</span>
                <ItemControls index={index} count={items.length} title={title} onMove={move} onRemove={remove} />
              </div>
              <ObjectFields fields={fields} value={item} onChange={(value) => update(index, value)} />
            </div>
          )
        }

        const isOpen = openIndex === index
        return (
          <div key={index} className="rounded-xl border-2 border-black bg-[#FFFDF9] shadow-[3px_3px_0_rgba(0,0,0,0.95)]">
            <div className="flex items-center gap-2 p-2 pl-3">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="text-xs">{isOpen ? '▾' : '▸'}</span>
                <span className="truncate text-sm font-black text-[#1A1A1A]">{title}</span>
              </button>
              <ItemControls index={index} count={items.length} title={title} onMove={move} onRemove={remove} />
            </div>
            {isOpen && (
              <div className="border-t-2 border-black p-3">
                <ObjectFields fields={fields} value={item} onChange={(value) => update(index, value)} />
              </div>
            )}
          </div>
        )
      })}

      {items.length === 0 && <p className="text-xs font-bold text-[#5d5954]">Nothing here yet.</p>}
      {compact && addButton}
    </div>
  )
}

function TabEditor({ tab, content, onChange }) {
  if (tab.groups) {
    return (
      <div className="space-y-6">
        {tab.groups.map((group) => (
          <section key={group.path} className="space-y-4">
            <h3 className="inline-block rounded-md border-2 border-black bg-[#FFC72C] px-2 py-1 text-xs font-black uppercase tracking-[0.18em]">
              {group.title}
            </h3>
            <ObjectFields
              fields={group.fields}
              value={content[group.path]}
              onChange={(value) => onChange({ ...content, [group.path]: value })}
            />
          </section>
        ))}
      </div>
    )
  }

  return (
    <ItemList
      key={tab.key}
      items={content[tab.path] ?? []}
      fields={tab.fields}
      template={tab.template}
      titleOf={tab.titleOf}
      addLabel={tab.addLabel}
      onChange={(value) => onChange({ ...content, [tab.path]: value })}
    />
  )
}

function LoginView({ onSubmit, status, working }) {
  const [token, setToken] = useState('')
  const [remember, setRemember] = useState(true)

  return (
    <form
      className="space-y-5 p-5"
      onSubmit={(event) => {
        event.preventDefault()
        if (token.trim()) onSubmit(token.trim(), remember)
      }}
    >
      <div className="space-y-2">
        <h3 className="text-2xl font-black">Owner sign-in</h3>
        <p className="text-sm leading-6 text-[#2D2A28]">
          Only a GitHub token with write access to <strong>{GITHUB_OWNER}/{GITHUB_REPO}</strong> can edit this portfolio. Changes are committed to the{' '}
          <strong>{GITHUB_BRANCH}</strong> branch and go live when the site redeploys.
        </p>
      </div>

      <ol className="list-decimal space-y-1 rounded-lg border-2 border-dashed border-black bg-white p-3 pl-8 text-xs leading-5 text-[#2D2A28]">
        <li>
          Open{' '}
          <a href={TOKEN_URL} target="_blank" rel="noreferrer" className="font-bold underline">
            GitHub → Fine-grained tokens → Generate new token
          </a>
          .
        </li>
        <li>
          Repository access: <strong>Only select repositories</strong> → {GITHUB_REPO}.
        </li>
        <li>
          Permissions → Repository → <strong>Contents: Read and write</strong>.
        </li>
        <li>Generate, copy the token and paste it below.</li>
      </ol>

      <div className="space-y-1.5">
        <label htmlFor="admin-token" className={labelClass}>
          GitHub token
        </label>
        <input
          id="admin-token"
          type="password"
          autoComplete="off"
          spellCheck={false}
          className={inputClass}
          placeholder="github_pat_…"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-xs font-bold">
        <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-black" />
        Remember on this device
      </label>

      <button type="submit" className={`${buttonClass} w-full bg-[#FFC72C] py-3`} disabled={working || !token.trim()}>
        {working ? 'Checking…' : 'Unlock editor'}
      </button>

      <StatusText status={status} />
    </form>
  )
}

export default function AdminPanel({ content, onChange, onClose }) {
  const [token, setToken] = useState(readStoredToken)
  const [login, setLogin] = useState('')
  // locked → working → ready | failed
  const [phase, setPhase] = useState(() => (readStoredToken() ? 'working' : 'locked'))
  const [published, setPublished] = useState(null)
  const [sha, setSha] = useState(null)
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const [status, setStatus] = useState(null)
  const [commitMessage, setCommitMessage] = useState('')
  const [publishing, setPublishing] = useState(false)

  const dirty = useMemo(() => published !== null && JSON.stringify(content) !== JSON.stringify(published), [content, published])

  const loadLatest = useCallback(
    async (activeToken) => {
      setPhase('working')
      const latest = await fetchContent(activeToken)
      setPublished(latest.content)
      setSha(latest.sha)
      onChange(latest.content)
      setPhase('ready')
    },
    [onChange],
  )

  const connect = useCallback(
    async (candidate, remember) => {
      setPhase('working')
      setStatus(null)
      try {
        const user = await verifyToken(candidate)
        if (remember !== undefined) storeToken(candidate, remember)
        setToken(candidate)
        setLogin(user.login)
        await loadLatest(candidate)
      } catch (error) {
        const rejected = error.status === 401 || error.status === 403
        if (rejected) {
          storeToken('', false)
          setToken('')
        }
        // A fresh sign-in (remember given) goes back to the form; a resumed session can retry.
        setPhase(rejected || remember !== undefined ? 'locked' : 'failed')
        setStatus({ type: 'error', message: describeError(error) })
      }
    },
    [loadLatest],
  )

  // Resume a remembered session.
  const resumed = useRef(false)
  useEffect(() => {
    if (resumed.current || !token) return
    resumed.current = true
    connect(token)
  }, [connect, token])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const confirmDiscard = () => !dirty || window.confirm('Discard your unpublished changes?')

  const handleClose = () => {
    if (!confirmDiscard()) return
    if (dirty) onChange(published)
    onClose()
  }

  const handleSignOut = () => {
    if (!confirmDiscard()) return
    if (dirty) onChange(published)
    storeToken('', false)
    setToken('')
    setLogin('')
    setPublished(null)
    setSha(null)
    setStatus(null)
    setPhase('locked')
  }

  const handleReload = async () => {
    if (!confirmDiscard()) return
    setStatus(null)
    try {
      await loadLatest(token)
      setStatus({ type: 'success', message: 'Loaded the latest version from GitHub.' })
    } catch (error) {
      setPhase('failed')
      setStatus({ type: 'error', message: describeError(error) })
    }
  }

  const handleDiscard = () => {
    if (!confirmDiscard()) return
    onChange(published)
    setStatus(null)
  }

  const handlePublish = async () => {
    const snapshot = content
    setPublishing(true)
    setStatus({ type: 'working', message: 'Publishing to GitHub…' })
    try {
      const newSha = await saveContent(token, snapshot, sha, commitMessage.trim() || 'Update portfolio content')
      setSha(newSha)
      setPublished(snapshot)
      setCommitMessage('')
      setStatus({ type: 'success', message: 'Published! The live site updates once it redeploys (usually a minute or two).' })
    } catch (error) {
      setStatus({ type: 'error', message: describeError(error) })
    } finally {
      setPublishing(false)
    }
  }

  const upload = useCallback((file) => uploadFile(token, file), [token])
  const tab = TABS.find((item) => item.key === activeTab) ?? TABS[0]

  return (
    <UploadContext.Provider value={upload}>
      <aside
        role="dialog"
        aria-label="Portfolio editor"
        className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l-2 border-black bg-[#FDF6E9] font-sans text-[#1A1A1A] shadow-[-8px_0_0_rgba(0,0,0,0.9)] sm:max-w-xl"
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#FFC72C] px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Portfolio editor</p>
            <p className="truncate text-sm font-bold">
              {phase === 'ready' ? (
                <>
                  Signed in as <strong>{login}</strong>
                  {dirty && <span className="ml-2 rounded-full border-2 border-black bg-white px-2 text-[10px] font-black uppercase">Unsaved</span>}
                </>
              ) : (
                'Locked'
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {(phase === 'ready' || phase === 'failed') && (
              <>
                <button type="button" className={`${buttonClass} bg-white px-2 py-1`} onClick={handleReload}>
                  Reload
                </button>
                <button type="button" className={`${buttonClass} bg-white px-2 py-1`} onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            )}
            <button type="button" aria-label="Close editor" className={`${iconButtonClass} h-9 w-9 text-base`} onClick={handleClose}>
              ✕
            </button>
          </div>
        </header>

        {phase === 'locked' && (
          <div className="flex-1 overflow-y-auto">
            <LoginView onSubmit={connect} status={status} working={false} />
          </div>
        )}

        {phase === 'working' && (
          <div className="flex flex-1 items-center justify-center p-6 text-sm font-black uppercase tracking-[0.16em]">Loading latest content…</div>
        )}

        {phase === 'failed' && (
          <div className="flex-1 space-y-4 p-5">
            <StatusText status={status} />
            <button type="button" className={`${buttonClass} bg-[#FFC72C]`} onClick={() => connect(token)}>
              Try again
            </button>
          </div>
        )}

        {phase === 'ready' && (
          <>
            <nav className="flex gap-2 overflow-x-auto border-b-2 border-black px-4 py-3" aria-label="Sections">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-current={item.key === activeTab ? 'page' : undefined}
                  onClick={() => setActiveTab(item.key)}
                  className={`${buttonClass} shrink-0 px-2.5 py-1.5 ${item.key === activeTab ? 'bg-[#1A1A1A] !text-white' : 'bg-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 overflow-y-auto p-4">
              <TabEditor key={tab.key} tab={tab} content={content} onChange={onChange} />
            </div>

            <footer className="space-y-3 border-t-2 border-black bg-[#FFFDF9] p-4">
              <StatusText status={status} />
              <input
                type="text"
                aria-label="Describe your change (optional)"
                className={inputClass}
                placeholder="What changed? (optional)"
                value={commitMessage}
                onChange={(event) => setCommitMessage(event.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" className={`${buttonClass} flex-1 bg-white`} disabled={!dirty || publishing} onClick={handleDiscard}>
                  Discard
                </button>
                <button type="button" className={`${buttonClass} flex-[2] bg-[#2A9D8F] py-3 !text-white`} disabled={!dirty || publishing} onClick={handlePublish}>
                  {publishing ? 'Publishing…' : 'Publish changes'}
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </UploadContext.Provider>
  )
}
