export default function SkillsSection({ skillGroups }) {
  return (
    <section id="skills" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">Skills</span>
            <h2>What I bring</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {skillGroups.map((group, index) => (
              <div
                key={`${group.title}-${index}`}
                className="sticker-card p-4"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.4 : 1.2}deg)` }}
              >
                <div className="tag-label" style={{ background: group.accent }}>
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {group.items.map((item, itemIndex) => (
                    <span key={`${item}-${itemIndex}`} className="badge-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
