import { motion } from 'framer-motion'

export default function SectionShell({ title, eyebrow, children, className = '', accent = 'yellow' }) {
  const accentClasses = {
    yellow: 'bg-[#f5d67a]',
    blue: 'bg-[#dfeefb]',
    mint: 'bg-[#d9f3d7]',
    peach: 'bg-[#f7d1b1]',
    lilac: 'bg-[#e7e0ff]',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={`scrapbook-section ${className}`}
    >
      <div className="tape-mark ${accentClasses[accent]}"></div>
      <div className="section-heading">
        <span className="section-kicker">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}
