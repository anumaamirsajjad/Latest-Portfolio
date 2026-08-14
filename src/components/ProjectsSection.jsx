const projects = [
  {
    name: 'Kebabistan',
    type: 'Restaurant Platform',
    stack: 'React • Node.js • SQLite',
    summary: 'Animated ordering experience with live menu, cart flow, reservations, and secure admin controls for stock and revenue.',
    accent: 'bg-[#FFC72C]',
    video: 'https://res.cloudinary.com/wquyyo8n/video/upload/v1786720288/kebabistan.mp4',
    poster: '/K.jpg',
    tags: ['Responsive UI', 'Admin Dashboard', 'Inventory Logic', 'Reservations'],
    highlights: [
      'Built a restaurant landing page with motion-rich sections and add-to-cart flows.',
      'Designed an admin dashboard for orders, stock visibility, and revenue insights.',
      'Used a Node.js backend to support menu and reservation workflows.',
    ],
  },
  {
    name: 'Reelify',
    type: 'AI Video Generator',
    stack: 'React • Express • FFmpeg',
    summary: 'Generated captioned reels from AI-created visuals, with fallback image generation and automated video stitching.',
    accent: 'bg-[#2A9D8F]',
    video: 'https://res.cloudinary.com/wquyyo8n/video/upload/v1786723947/reelgenerator_1_1.mp4',
    poster: '/reelifywallpaper.png',
    tags: ['Gemini API', 'FFmpeg', 'Video Rendering', 'Automation'],
    highlights: [
      'Combined AI image generation with automated video assembly for reel creation.',
      'Added caption styling and sound layering to turn stills into social-ready content.',
      'Built the workflow to make repetitive video generation faster and more scalable.',
    ],
  },
  {
    name: 'Societies Management App',
    type: 'University Portal',
    stack: 'Node.js • React • SQL',
    summary: 'Built a full-stack system for managing memberships, events, budgets, and role-based access for student communities.',
    accent: 'bg-[#A8D8EA]',
    video: 'https://res.cloudinary.com/wquyyo8n/video/upload/v1786724396/society_management_system_1_1_1.mp4',
    poster: '/societywallpaper.png',
    tags: ['Membership System', 'Budget Tracking', 'JWT Auth', 'Event Handling'],
    highlights: [
      'Created a relational data model for members, events, and society operations.',
      'Implemented secure authentication and access flow for different admin roles.',
      'Built dashboards for managing activities, budgets, and event records.',
    ],
  },
  {
    name: 'Library Management System',
    type: 'C++ Desktop App',
    stack: 'C++ • SQL',
    summary: 'Created a librarian/user dashboard for book search, borrowing, returns, and authentication workflows.',
    accent: 'bg-[#F4A6A0]',
    video: 'https://res.cloudinary.com/wquyyo8n/video/upload/v1786720306/lib_management_system.mp4',
    poster: '/libwallpaper.png',
    tags: ['Database Design', 'User Roles', 'Authentication', 'Inventory'],
    highlights: [
      'Developed separate interfaces for librarians and users with different access levels.',
      'Handled borrowing, return, and search workflows with SQL-backed storage.',
      'Focused on secure access and efficient library record management.',
    ],
  },
  {
    name: 'Fooji',
    type: 'Smart Recipe & Meal Planning Platform',
    stack: 'UI/UX Design (Figma)',
    summary: 'Designed a recipe and meal-planning app for diverse households, with step-by-step cooking guidance, ingredient substitution suggestions, and pantry-based recommendations tailored to what users already have on hand.',
    accent: 'bg-[#D8B4FE]',
    video: '',
    poster: '/fooji.jpg',
    tags: ['UX Research', 'Meal Planning', 'Accessibility', 'Dietary Profiles'],
    links: [
      {
        label: 'Click to view prototype',
        href: 'https://www.figma.com/design/22y3McjDKNtBUeUSwO6OkT/Fooji?node-id=0-1&t=QNnHJsGIXb5Ubi7f-1',
      },
    ],
    highlights: [
      'Planned offline access, voice-assisted navigation, and serving-size adjustments to support students, busy parents, and dietary-conscious cooks as core user groups.',
      'Included automated grocery list generation, weekly meal planning, allergen warnings, and personalised dietary profiles in a clean, minimal interface.',
      'Built as a group HCI course project (team of 5) across three phases — proposal, research, and design/prototyping — under instructor guidance at FAST NUCES Lahore.',
    ],
  },
  {
    name: 'Terrarium',
    type: 'Neighbourhood-Scale Climate Intervention Simulator for Lahore',
    stack: 'Python • FastAPI • React • TypeScript • LightGBM • MapLibre',
    summary: 'An interactive climate simulator letting city officers and residents test real interventions — planting trees, restricting traffic — on an actual 20km × 20km tile of Lahore at 100m resolution (40,602 cells), and see the modeled result rather than a vague estimate.',
    accent: 'bg-[#BEE3DB]',
    video: '',
    poster: '/terrarium.png',
    tags: ['Climate Modeling', 'Digital Twin', 'Lahore', 'Environmental Data'],
    links: [
      {
        label: 'Click to view demo',
        href: 'https://terrarium-live.vercel.app/',
      },
      {
        label: 'Click to view artifact',
        href: 'https://claude.ai/code/artifact/f6654fbc-0c07-4ea9-bdc7-06cbfb36c934',
      },
    ],
    highlights: [
      'Built a three-layer architecture: a unified state cube merging satellite and population datasets into one aligned data cube; physics cores including a LightGBM model for surface temperature change, an FFT-based air dispersion model for PM2.5, and an equity core mapping cooling impact by population decile; and a FastAPI backend serving a React/MapLibre/deck.gl frontend for live visualization.',
      'Supports natural-language plan input (e.g. “plant 5,000 trees here”), generates council-ready PDF briefs with uncertainty disclosure, and explicitly refuses infeasible interventions with the underlying arithmetic rather than silently approximating them.',
      'Achieved a hindcast accuracy of 0.91–1.24°C mean absolute error with positive spatial skill after correcting for offset errors, and validated the air quality model against 53 independent monitoring stations.',
    ],
  },
  {
    name: 'Flappy Bird Clone',
    type: 'Assembly Game',
    stack: 'Assembly • Interrupts',
    summary: 'Implemented collision logic, score tracking, keyboard input, and optimized memory usage in a classic arcade clone.',
    accent: 'bg-[#F4845F]',
    video: '/flappywallpaper.jpg',
    poster: '/flappywallpaper.jpg',
    tags: ['Game Physics', 'Collision Detection', 'Interrupts', 'Optimization'],
    highlights: [
      'Built game mechanics for gravity, collisions, and real-time score updates.',
      'Used keyboard interrupts to handle responsive controls and smooth gameplay.',
      'Optimized the program for memory and interaction constraints in assembly.',
    ],
  },
  {
    name: 'Research Paper Implementation',
    type: 'Deep Learning',
    stack: 'Python • TensorFlow/Keras • Deep Learning • LSTM • CNN',
    summary: 'Two deep learning classifiers benchmarked against published research — an LSTM for human activity recognition and a VGG-16 CNN for image classification.',
    accent: 'bg-[#A8D8EA]',
    video: '',
    poster: '/research.png',
    tags: ['Python', 'TensorFlow/Keras', 'Deep Learning', 'LSTM', 'CNN'],
    highlights: [
      'LSTM on UCI-HAR: 93.32% test accuracy (within 92–95% published benchmark range), 561 sensor features, 6 activity classes',
      'VGG-16 on CIFAR-10 (from scratch): 88.38% Top-1 / 99.12% Top-5 accuracy, beating the original paper\'s Top-5 by 0.12%',
      'Stacked LSTM (128→64 units) with dropout, Adam optimizer, sparse categorical cross-entropy',
      'VGG-16 adapted for 32×32 input: reduced FC width (4096→512), batch norm after conv blocks, dropout at 0.25/0.5',
      'Interesting finding: Sitting/Standing and Cat/Dog were the hardest class pairs, consistent with literature, showing analytical thinking beyond just running the model.',
    ],
  },
]

export default function ProjectsSection({ onSelectProject }) {
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
                key={project.name}
                className="sticker-card project-card flex flex-col justify-between p-4"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.8 : 1.6}deg)` }}
              >
                <div>
                  <div className={`tag-label ${project.accent}`}>
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
