const experiences = [
  {
    title: 'Software Development Intern',
    company: 'Pentaloop (Piron Labs), Lahore',
    period: 'Jul 2025',
    description: 'Built REST APIs and backend routes in Node.js/Express, and created Python automation for scraping and data collection workflows.',
    color: 'bg-[#FFC72C]',
  },
  {
    title: 'Offensive Security Intern',
    company: 'Itsolera, Lahore',
    period: 'Jun–Aug 2026',
    description: 'Worked on a Python security tooling stack for recon, DNS, and web testing, contributing to reports, pytest coverage, and Docker deployment.',
    color: 'bg-[#2A9D8F]',
  },
  {
    title: 'SQA Intern',
    company: 'Dafi Labs, Lahore',
    period: 'Jul–Aug 2026',
    description: 'Designed and executed manual and automation tests, built Playwright/Cypress suites, and created Postman API collections for validation.',
    color: 'bg-[#F4A6A0]',
  },
  {
    title: 'Flutter Development Intern',
    company: 'NextGen',
    period: 'Aug 2026–Present',
    description: 'Building reusable Flutter UI components, screen navigation, and state-based apps with Provider and REST API integration.',
    color: 'bg-[#A8D8EA]',
  },
]

export default function JourneySection() {
  return (
    <section id="journey" className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="scrapbook-section">
          <div className="tape-mark yellow"></div>
          <div className="section-heading">
            <span className="section-kicker">My Journey</span>
            <h2>Where I’ve grown</h2>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-4 top-0 hidden h-full w-1 bg-black md:block"></div>
            <div className="space-y-6">
              {experiences.map((job, index) => (
                <div key={job.title} className="relative grid gap-4 md:grid-cols-[70px_1fr] md:items-start">
                  <div className="relative z-10 flex justify-center md:justify-start">
                    <div className={`flex h-12 w-12 items-center justify-center border-3 border-black text-sm font-black shadow-[4px_4px_0_rgba(0,0,0,0.95)] ${job.color}`}>
                      {index + 1}
                    </div>
                  </div>

                  <div className="sticker-card p-4 md:p-5" style={{ transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }}>
                    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#1A1A1A] md:text-2xl">{job.title}</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#3F3A38]">{job.company}</p>
                      </div>
                      <span className="inline-block border-2 border-black bg-[#fffdf9] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#1A1A1A] shadow-[4px_4px_0_rgba(0,0,0,0.95)]">
                        {job.period}
                      </span>
                    </div>
                    <p className="text-base leading-7 text-[#2D2A28]">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
