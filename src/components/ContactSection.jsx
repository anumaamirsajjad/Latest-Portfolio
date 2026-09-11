import { useState } from 'react'

export default function ContactSection({ contact }) {
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const contactDetails = contact.details ?? []

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: 'sending', message: 'Sending your message...' })

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          _subject: 'Portfolio contact form submission',
          _captcha: 'false',
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      form.reset()
      setStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon.' })
    } catch (error) {
      setStatus({ type: 'error', message: `Something went wrong. Please email me directly at ${contact.email}.` })
    }
  }

  return (
    <section id="contact" className="w-full pb-16 pt-8 md:pt-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">Contact</span>
            <h2>Let’s connect</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contactDetails.map((item, index) => (
              <a
                key={`${item.label}-${index}`}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className="sticker-card block p-4 text-left transition duration-200 hover:-translate-y-1 hover:rotate-[-1deg]"
                style={{ transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)', background: item.accent }}
              >
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">{item.label}</p>
                <p className="text-lg font-black text-[#1A1A1A]">{item.value}</p>
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 rounded-[24px] border-3 border-black bg-[#fffaf0] p-4 shadow-[6px_6px_0_rgba(0,0,0,0.95)] md:p-6">
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full border-3 border-black bg-white px-3 py-3 text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-[#5d5954]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border-3 border-black bg-white px-3 py-3 text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-[#5d5954]"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="message" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="Tell me about your project or opportunity..."
                className="w-full resize-none border-3 border-black bg-white px-3 py-3 text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-[#5d5954]"
              />
            </div>

            <button
              type="submit"
              disabled={status.type === 'sending'}
              className="inline-flex items-center border-3 border-black bg-[#FFC72C] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.type === 'sending' ? 'Sending...' : 'Send message'}
            </button>

            {status.message && (
              <p
                className={`mt-4 text-sm font-bold ${
                  status.type === 'success' ? 'text-[#2A9D8F]' : status.type === 'error' ? 'text-[#B42318]' : 'text-[#1A1A1A]'
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
