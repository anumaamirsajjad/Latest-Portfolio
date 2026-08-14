import { motion } from 'framer-motion'

export default function ProjectDetailView({ project, onBack }) {
  const hasVideo = !!project.video && /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(project.video)

  return (
    <section className="w-full py-8 md:py-12">
      <button
        onClick={onBack}
        className="fixed left-4 top-24 z-50 inline-flex items-center border-3 border-black bg-[#fffdf9] px-4 py-2 font-black uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 md:left-6"
      >
        ← Back to projects
      </button>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="scrapbook-section"
        >
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">Project</span>
            <h2>{project.name}</h2>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="self-start overflow-hidden border-3 border-black bg-[#111111] shadow-[6px_6px_0_rgba(0,0,0,0.95)]">
              <div className="aspect-video w-full bg-[#111111]">
                {hasVideo ? (
                  <video
                    controls
                    className="h-full w-full object-contain"
                    poster={project.poster}
                    src={project.video}
                  />
                ) : (
                  <img
                    src={project.poster || project.video}
                    alt={project.name}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className={`tag-label ${project.accent}`}>
                {project.type}
              </div>

              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C3633]">
                {project.stack}
              </p>

              <p className="text-lg leading-8 text-[#2D2A28]">{project.summary}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge-pill">
                    {tag}
                  </span>
                ))}
              </div>

              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center border-3 border-black bg-[#FFC72C] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              <div className="border-3 border-black bg-[#FDF6E9] p-4 shadow-[6px_6px_0_rgba(0,0,0,0.95)]">
                <h3 className="mb-3 text-lg font-black uppercase tracking-[0.12em] text-[#1A1A1A]">
                  What I built
                </h3>
                <ul className="space-y-2 text-base leading-7 text-[#2D2A28]">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 bg-[#FFC72C] ring-2 ring-black"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
