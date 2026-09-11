import { motion } from 'framer-motion'

export default function AboutSection({ about }) {
  return (
    <section id="about" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section about-card">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">About</span>
            <h2>Who I am</h2>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="space-y-4 text-base leading-8 text-[#2D2A28] md:text-lg"
            >
              {(about.paragraphs ?? []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="sticker-card p-4"
            >
              <div className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                <span>tech-stack</span>
                <span>live</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(about.techList ?? []).map((item, index) => (
                  <motion.div
                    key={`${item}-${index}`}
                    whileHover={{ rotate: index % 2 === 0 ? -2 : 2, scale: 1.02 }}
                    className={[
                      'border-3 border-black px-3 py-3 text-center text-sm font-bold text-[#1A1A1A]',
                      index % 2 === 0 ? 'bg-[#A8D8EA]' : 'bg-[#F4A6A0]',
                    ].join(' ')}
                    style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.95)' }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
