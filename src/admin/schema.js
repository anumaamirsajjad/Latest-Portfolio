// Describes what the editor shows for each part of content.json.

export const PALETTE = ['#FFC72C', '#2A9D8F', '#A8D8EA', '#F4A6A0', '#F4845F', '#D8B4FE', '#BEE3DB', '#FFFDF9']

const linkFields = [
  { key: 'label', label: 'Button text', type: 'text' },
  { key: 'href', label: 'URL', type: 'text' },
]

export const TABS = [
  {
    key: 'profile',
    label: 'Profile',
    groups: [
      {
        title: 'Intro',
        path: 'hero',
        fields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'availability', label: 'Availability sticker', type: 'text', hint: 'Leave empty to hide it.' },
          { key: 'tagline', label: 'Short intro', type: 'textarea', rows: 3 },
          { key: 'photo', label: 'Profile photo', type: 'asset', accept: 'image/*' },
          { key: 'resumeUrl', label: 'Resume (PDF)', type: 'asset', accept: 'application/pdf', hint: 'Leave empty to hide the "View Resume" button.' },
          { key: 'badges', label: 'Photo stickers', type: 'lines', rows: 2, hint: 'One per line — the first two are shown.' },
          {
            key: 'socials',
            label: 'Social links',
            type: 'list',
            addLabel: 'Add social link',
            template: { label: '', value: '', href: '' },
            fields: [
              { key: 'label', label: 'Name', type: 'text' },
              { key: 'value', label: 'Displayed text', type: 'text' },
              { key: 'href', label: 'URL', type: 'text' },
            ],
          },
        ],
      },
      {
        title: 'About',
        path: 'about',
        fields: [
          { key: 'paragraphs', label: 'About me', type: 'lines', rows: 8, hint: 'One paragraph per line.' },
          { key: 'techList', label: 'Tech-stack tiles', type: 'lines', rows: 6, hint: 'One tile per line.' },
        ],
      },
    ],
  },
  {
    key: 'experience',
    label: 'Experience',
    path: 'experience',
    addLabel: 'Add experience',
    titleOf: (item) => [item.title, item.company].filter(Boolean).join(' · '),
    template: { title: 'New role', company: '', period: '', description: '', color: '#FFC72C' },
    fields: [
      { key: 'title', label: 'Role', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'period', label: 'Dates', type: 'text', hint: 'e.g. Jun–Aug 2026 or Aug 2026–Present' },
      { key: 'description', label: 'What you did', type: 'textarea' },
      { key: 'color', label: 'Number colour', type: 'color' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    path: 'projects',
    addLabel: 'Add project',
    titleOf: (item) => item.name,
    template: {
      name: 'New project',
      type: 'Category',
      stack: '',
      summary: '',
      accent: '#FFC72C',
      video: '',
      poster: '',
      tags: [],
      links: [],
      highlights: [],
    },
    fields: [
      { key: 'name', label: 'Project name', type: 'text' },
      { key: 'type', label: 'Category label', type: 'text' },
      { key: 'accent', label: 'Label colour', type: 'color' },
      { key: 'stack', label: 'Tech stack', type: 'text', hint: 'e.g. React • Node.js • SQL' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'poster', label: 'Cover image', type: 'asset', accept: 'image/*' },
      { key: 'video', label: 'Video URL (.mp4)', type: 'text', hint: 'Optional. Paste a hosted .mp4 link (e.g. Cloudinary). Empty shows the cover image instead.' },
      { key: 'tags', label: 'Tags', type: 'lines', rows: 4, hint: 'One per line.' },
      { key: 'highlights', label: 'What I built', type: 'lines', rows: 6, hint: 'One bullet point per line.' },
      { key: 'links', label: 'Buttons', type: 'list', addLabel: 'Add button', template: { label: '', href: '' }, fields: linkFields },
    ],
  },
  {
    key: 'education',
    label: 'Education',
    path: 'education',
    addLabel: 'Add education',
    titleOf: (item) => item.school,
    template: { school: 'New school', degree: '', period: '', extra: '', accent: '#FFC72C' },
    fields: [
      { key: 'school', label: 'School', type: 'text' },
      { key: 'degree', label: 'Degree / qualification', type: 'text' },
      { key: 'period', label: 'Dates', type: 'text' },
      { key: 'accent', label: 'Date sticker colour', type: 'color' },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    path: 'skills',
    addLabel: 'Add skill group',
    titleOf: (item) => item.title,
    template: { title: 'New group', items: [], accent: '#FFC72C' },
    fields: [
      { key: 'title', label: 'Group name', type: 'text' },
      { key: 'accent', label: 'Label colour', type: 'color' },
      { key: 'items', label: 'Skills', type: 'lines', rows: 6, hint: 'One per line.' },
    ],
  },
  {
    key: 'achievements',
    label: 'Achievements',
    path: 'achievements',
    addLabel: 'Add achievement',
    titleOf: (item) => item,
    template: '',
    fields: null,
  },
  {
    key: 'contact',
    label: 'Contact',
    groups: [
      {
        title: 'Contact',
        path: 'contact',
        fields: [
          { key: 'email', label: 'Contact-form inbox', type: 'text', hint: 'Messages from the contact form are sent to this email.' },
          {
            key: 'details',
            label: 'Contact cards',
            type: 'list',
            addLabel: 'Add contact card',
            template: { label: '', value: '', href: '', accent: '#FFC72C' },
            fields: [
              { key: 'label', label: 'Label', type: 'text' },
              { key: 'value', label: 'Displayed text', type: 'text' },
              { key: 'href', label: 'Link', type: 'text', hint: 'Use mailto:you@example.com for email.' },
              { key: 'accent', label: 'Card colour', type: 'color' },
            ],
          },
        ],
      },
    ],
  },
]
