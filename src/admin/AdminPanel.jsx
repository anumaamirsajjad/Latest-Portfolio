import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { describeError, MAX_UPLOAD_BYTES, saveContent, uploadFile } from './localApi'
import { PALETTE, TABS } from './schema'


const inputClass =
  'w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-[#8a847d] focus:ring-2 focus:ring-[#FFC72C]'
const labelClass = 'block text-[10px] font-black uppercase tracking-[0.18em] text-[#1A1A1A]'
const buttonClass =
  'inline-flex items-center justify-center gap-1 rounded-lg border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#1A1A1A] shadow-[3px_3px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'
const iconButtonClass =
  'inline-flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-xs font-black text-[#1A1A1A] transition hover:bg-[#FFC72C] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white'

const UploadContext = createContext(null)

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

    setStatus({ type: 'working', message: `Copying ${file.name} into the project…` })
    try {
      const path = await upload(file)
      setPreviewFailed(false)
      onChange(path)
      setStatus({ type: 'success', message: `Saved to public${path}`  })
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
          Choose file
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

export default function AdminPanel({ content, onChange, onClose }) {
  const [savedContent, setSavedContent] = useState(content)
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(savedContent), [content, savedContent])
  const tab = TABS.find((item) => item.key === activeTab) ?? TABS[0]

  const save = async () => {
    const snapshot = content
    setSaving(true)
    setStatus({ type: 'working', message: 'Saving…' })
    try {
      await saveContent(snapshot)
      setSavedContent(snapshot)
      setStatus({ type: 'success', message: 'Saved to src/content.json. Run "npm run publish" to put it online.' })
    } catch (error) {
      setStatus({ type: 'error', message: describeError(error) })
    } finally {
      setSaving(false)
    }
  }

  // Ctrl/Cmd+S saves, like any editor.
  const saveRef = useRef(save)
  saveRef.current = save
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const confirmDiscard = () => !dirty || window.confirm('Discard your unsaved changes?')

  const handleDiscard = () => {
    if (!confirmDiscard()) return
    onChange(savedContent)
    setStatus(null)
  }

  const handleClose = () => {
    if (!confirmDiscard()) return
    if (dirty) onChange(savedContent)
    onClose()
  }

  return (
    <UploadContext.Provider value={uploadFile}>
      <aside
        role="dialog"
        aria-label="Portfolio editor"
        className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l-2 border-black bg-[#FDF6E9] font-sans text-[#1A1A1A] shadow-[-8px_0_0_rgba(0,0,0,0.9)] sm:max-w-xl"
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#FFC72C] px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Portfolio editor</p>
            <p className="truncate text-sm font-bold">
              Editing src/content.json
              {dirty && <span className="ml-2 rounded-full border-2 border-black bg-white px-2 text-[10px] font-black uppercase">Unsaved</span>}
            </p>
          </div>
          <button type="button" aria-label="Close editor" className={`${iconButtonClass} h-9 w-9 text-base`} onClick={handleClose}>
            ✕
          </button>
        </header>

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
          <div className="flex gap-2">
            <button type="button" className={`${buttonClass} flex-1 bg-white`} disabled={!dirty || saving} onClick={handleDiscard}>
              Discard
            </button>
            <button type="button" className={`${buttonClass} flex-[2] bg-[#2A9D8F] py-3 !text-white`} disabled={!dirty || saving} onClick={save}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </footer>
      </aside>
    </UploadContext.Provider>
  )
}
