const skillGroups = [
  {
    title: 'Languages',
    items: ['C', 'C++', 'Python', 'JavaScript', 'Assembly', 'SQL'],
    accent: 'bg-[#2A9D8F]',
  },
  {
    title: 'Web & Backend',
    items: ['Node.js', 'Express.js', 'React', 'REST APIs', 'JWT Auth', 'RBAC'],
    accent: 'bg-[#A8D8EA]',
  },
  {
    title: 'Testing & QA',
    items: ['Test Planning', 'Automation Testing', 'API Testing', 'Regression Testing', 'UI Testing', 'Page Object Model'],
    accent: 'bg-[#F4A6A0]',
  },
  {
    title: 'Automation & Scraping',
    items: ['BeautifulSoup', 'Requests', 'Selenium', 'Playwright', 'Cypress'],
    accent: 'bg-[#F4845F]',
  },
  {
    title: 'AI & ML',
    items: ['Deep Learning', 'LSTM Architectures', 'CNN Pipelines', 'TensorFlow/Keras', 'Model Benchmarking'],
    accent: 'bg-[#FFC72C]',
  },
  {
    title: 'Tools',
    items: ['VS Code', 'Git', 'Postman', 'Jira', 'Figma', 'FFmpeg'],
    accent: 'bg-[#A8D8EA]',
  },
]

export default function SkillsSection() {
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
                key={group.title}
                className="sticker-card p-4"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.4 : 1.2}deg)` }}
              >
                <div className={`tag-label ${group.accent}`}>
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {group.items.map((item) => (
                    <span key={item} className="badge-pill">
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
