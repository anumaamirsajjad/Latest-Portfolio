export default function AchievementsSection({ achievements }) {
  return (
    <section id="achievements" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">Achievements</span>
            <h2>Recognition</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item, index) => (
              <div key={`${item}-${index}`} className="sticker-card p-4 text-base font-bold text-[#1A1A1A]" style={{ transform: index % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)', background: index % 2 === 0 ? '#F4A6A0' : '#A8D8EA' }}>
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-[#fffdf9] text-sm font-black">{index + 1}</div>
                <p className="leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
