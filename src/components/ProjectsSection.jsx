export default function ProjectsSection({ projects, onSelectProject }) {
  return (
    <section id="projects" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark coral"></div>
          <div className="section-heading">
            <span className="section-kicker">Projects</span>
            <h2>Built with curiosity</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={`${project.name}-${index}`}
                className="sticker-card project-card flex flex-col justify-between p-4"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.8 : 1.6}deg)` }}
              >
                <div>
                  <div className="tag-label" style={{ background: project.accent }}>
                    {project.type}
                  </div>
                  <h3 className="mb-2 text-xl font-black text-[#1A1A1A]">{project.name}</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#373431]">{project.stack}</p>
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="mt-5 inline-flex w-fit items-center border-3 border-black bg-[#FFC72C] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5"
                >
                  Explore
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
