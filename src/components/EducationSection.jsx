export default function EducationSection({ education }) {
  return (
    <section id="education" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">Education</span>
            <h2>Academic path</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {education.map((item, index) => (
              <div key={`${item.school}-${index}`} className="sticker-card p-5" style={{ transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }}>
                <div
                  className="mb-3 inline-block border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]"
                  style={{ background: item.accent }}
                >
                  {item.period}
                </div>
                <h3 className="text-2xl font-black text-[#1A1A1A]">{item.school}</h3>
                <p className="mt-2 text-lg font-bold text-[#2D2A28]">{item.degree}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
