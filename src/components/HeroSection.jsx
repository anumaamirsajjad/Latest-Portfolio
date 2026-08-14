import { motion } from 'framer-motion'

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/anumaamirsajjad', value: 'linkedin.com/in/anumaamirsajjad' },
  { label: 'GitHub', href: 'https://github.com/anumaamirsajjad', value: 'github.com/anumaamirsajjad' },
]

export default function HeroSection() {

  return (
    <section id="hero" className="relative overflow-hidden pb-10 pt-6 md:pt-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,199,44,0.22),transparent_42%)]"></div>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="paper-card hero-card relative"
        >
          <div className="hero-tape tape-left"></div>
          <div className="hero-tape tape-right"></div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <div className="space-y-6">
              <div className="inline-block border-3 border-black bg-[#FFC72C] px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)]">
                Available for opportunities
              </div>

              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#2F2A28]">Lahore, Pakistan</p>
                <h1 className="text-4xl font-black leading-tight text-[#1A1A1A] md:text-5xl xl:text-6xl">
                  Anum Aamir
                </h1>
                <h2 className="max-w-xl text-lg font-bold text-[#2F2A28] md:text-2xl">
                  Final-Year CS Student | Full-Stack Developer & QA Engineer
                </h2>
              </div>

              <p className="max-w-xl text-base leading-7 text-[#2D2A28] md:text-lg">
                Computer Science undergraduate building thoughtful digital experiences, testing products with a QA mindset, and crafting scalable full-stack solutions.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="btn-primary">View projects</a>
                <a href="#contact" className="btn-secondary">Let&apos;s connect</a>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 border-3 border-black bg-[#fffdf9] px-2.5 py-2 text-sm font-bold text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 hover:rotate-[-1deg]"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center border-2 border-black bg-[#A8D8EA] text-[10px] font-black uppercase">
                      {link.label.slice(0, 1)}
                    </span>
                    <span>{link.value}</span>
                  </a>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="photo-card">
                <div className="photo-card-inner">
                  <div className="photo-frame">
                    <img
                      src="/profile.jpeg"
                      alt="Anum Aamir"
                      className="avatar-photo"
                    />
                  </div>
                </div>
              </div>

              <div className="badge badge-top-left">Developer</div>
              <div className="badge badge-bottom-right">QA + Automation</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
