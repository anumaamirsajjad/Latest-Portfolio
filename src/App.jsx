import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import JourneySection from './components/JourneySection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import EducationSection from './components/EducationSection'
import AchievementsSection from './components/AchievementsSection'
import ContactSection from './components/ContactSection'
import ProjectDetailView from './components/ProjectDetailView'
import initialContent from './content.json'

// Loaded only when the editor is opened, so visitors never download it.
const AdminPanel = lazy(() => import('./admin/AdminPanel'))

const ADMIN_HASH = '#admin'

function App() {
  const [content, setContent] = useState(initialContent)
  const [selectedProject, setSelectedProject] = useState(null)
  const [adminOpen, setAdminOpen] = useState(() => window.location.hash === ADMIN_HASH)
  const logoClicks = useRef([])

  useEffect(() => {
    const handlePopState = (event) => {
      if (window.location.hash === ADMIN_HASH) return

      setSelectedProject(event.state?.project ?? null)

      if (!event.state?.project) {
        window.requestAnimationFrame(() => {
          const projectsSection = document.getElementById('projects')
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    }

    const handleHashChange = () => {
      if (window.location.hash === ADMIN_HASH) setAdminOpen(true)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Hidden entry point: triple-click (or triple-tap) the logo.
  const handleLogoClick = () => {
    const now = Date.now()
    logoClicks.current = [...logoClicks.current.filter((time) => now - time < 800), now]
    if (logoClicks.current.length >= 3) {
      logoClicks.current = []
      setAdminOpen(true)
    }
  }

  const handleCloseAdmin = () => {
    setAdminOpen(false)
    if (window.location.hash === ADMIN_HASH) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
    }
  }

  const handleSelectProject = (project) => {
    setSelectedProject(project)

    const projectSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    window.history.pushState({ project }, '', `#project-${projectSlug}`)
  }

  const handleBackToProjects = () => {
    if (window.history.state?.project) {
      window.history.back()
      return
    }

    setSelectedProject(null)

    window.requestAnimationFrame(() => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  const initials = content.hero.name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#FDF6E9] text-[#1A1A1A] selection:bg-[#FFC72C] selection:text-[#1A1A1A]">
      <div className="background-grid"></div>
      <header className="sticky top-0 z-40 border-b-3 border-black bg-[#FFC72C] shadow-[6px_6px_0_rgba(0,0,0,0.95)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div onClick={handleLogoClick} className="cursor-default select-none font-mono text-lg font-black tracking-[0.2em]">{initials}</div>
          <nav className="hidden gap-6 text-sm font-black uppercase tracking-[0.08em] text-[#1A1A1A] md:flex">
            <a href="#hero" className="transition hover:translate-x-[-1px]">Home</a>
            <a href="#about" className="transition hover:translate-x-[-1px]">About</a>
            <a href="#journey" className="transition hover:translate-x-[-1px]">Journey</a>
            <a href="#skills" className="transition hover:translate-x-[-1px]">Skills</a>
            <a href="#projects" className="transition hover:translate-x-[-1px]">Projects</a>
            <a href="#education" className="transition hover:translate-x-[-1px]">Education</a>
            <a href="#contact" className="transition hover:translate-x-[-1px]">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {selectedProject ? (
          <ProjectDetailView project={selectedProject} onBack={handleBackToProjects} />
        ) : (
          <>
            <HeroSection hero={content.hero} />
            <AboutSection about={content.about} />
            <JourneySection experiences={content.experience} />
            <SkillsSection skillGroups={content.skills} />
            <ProjectsSection projects={content.projects} onSelectProject={handleSelectProject} />
            <EducationSection education={content.education} />
            <AchievementsSection achievements={content.achievements} />
            <ContactSection contact={content.contact} />
          </>
        )}
      </main>

      {adminOpen && (
        <Suspense fallback={null}>
          <AdminPanel content={content} onChange={setContent} onClose={handleCloseAdmin} />
        </Suspense>
      )}
    </div>
  )
}

export default App
