// Navlink

import type { AboutData, NavLinkItem, Project, SkillCategory } from "@/types";

export const NAV_LINKS: NavLinkItem[] = [
    {label: 'about', sectionId: 'about'},
    {label: 'projects', sectionId: 'projects'},
    {label: 'skills', sectionId: 'skills'},
    {label: 'contact', sectionId: 'contact'},
]

// About

export const ABOUT_DATA: AboutData = {
    name: 'Oktaviano',
    title: 'Full-stack Developer',
    bio: 'Building things for the web since the internet was cool. Passionate about clean code, pixel-perfect design, and retro aesthetics.',
    location: 'Malang, Indonesia',
    availableForWork: false,
    socials: [
        {platform: 'github', url: 'https://github.com/oktavianosr', label: 'GitHub'},
        {platform: 'linkedin', url: 'https://www.linkedin.com/in/oktaviano-sahru-romadhon-900242335', label: 'LinkedIn'},
        {platform: 'email', url: 'oktavianosahru.r@gmail.com', label: 'Email'},
    ]
}

// Projects

export const PROJECTS: Project[] = [
    {
        id: 'proj-1',
        title: 'Portofolio Website',
        description: 'Personal portofolio dengan Y2K aesthetic, Notion Integration, dan Vercel serverless functions.',
        techStack: ['React', 'TypeScript', 'Vite', 'Notion API'],
        githubUrl: 'https://github.com/oktavianosr/oktaviano-porfotolio',
        liveUrl: 'https://oktaviano-porfotolio.vercel.app',
        category: 'web',
        status: 'in-progress',
        year: 2026,
        featured: true
    }
]

export const SKILLS: SkillCategory[] = [
    {
        category: 'Frontend',
        icon: '⌨',
        skills: [
            {name:'React', level: 'beginner'},
            {name:'Typescript', level: 'beginner'},
            {name:'CSS', level: 'intermediate'},
            {name: 'Javascript', level: 'intermediate'}
        ],
    },
    {
        category: 'Backend',
        icon: '⚙',
        skills: [
            { name: 'Node.js',     level:  'beginner' },
            { name: 'Express',     level:  'beginner' },
            { name: 'Laravel',     level: 'intermediate'},
            { name: 'REST API',    level:  'intermediate'},
            { name: 'PHP',    level:  'intermediate'}, 
        ]
    },
    {
        category: 'Tools',
        icon: '◈',
        skills: [
            { name: 'Git',         level: 'intermediate' },
            { name: 'Vite',        level: 'beginner' },
            { name: 'Vercel',      level: 'beginner' },
            { name: 'Figma',       level: 'beginner' },
            { name: 'Visual Code Editor', level: 'intermediate'},
        ],
    }
]

