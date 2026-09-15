import { Lightbulb, BookOpen, Box, Users, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaGithub as Github, FaLinkedinIn as Linkedin } from 'react-icons/fa';
import { ReactIcon, TypeScriptIcon, ViteIcon, TailwindIcon, PythonIcon, FastApiIcon, PostgresIcon, MongoIcon, AwsIcon, DockerIcon, KubernetesIcon, NginxIcon, VsCodeIcon, GitIcon, GithubIcon, PostmanIcon } from '../components/icons';
export const navLinks = [['top', 'Home'], ['about', 'About'], ['stack', 'Stack'], ['work', 'Projects'], ['connect', 'Contact']];
export const capabilities = [
  { Icon: Lightbulb, title: 'Problem Solver', copy: 'Break complexity into clear, useful solutions.' },
  { Icon: BookOpen, title: 'Continuous Learner', copy: 'Stay curious. Keep exploring better ways to build.' },
  { Icon: Box, title: 'Build & Deploy', copy: 'Connect every layer, from interface to infrastructure.' },
  { Icon: Users, title: 'Collaborate', copy: 'Work closely with people to solve the right problem.' },
];
export const technologies = [
  { title: 'Frontend', items: [[ReactIcon, 'React'], [TypeScriptIcon, 'TypeScript'], [ViteIcon, 'Vite'], [TailwindIcon, 'Tailwind CSS']] },
  { title: 'Backend', items: [[PythonIcon, 'Python'], [FastApiIcon, 'FastAPI']] },
  { title: 'Database', items: [[PostgresIcon, 'PostgreSQL'], [MongoIcon, 'MongoDB']] },
  { title: 'DevOps & Cloud', items: [[AwsIcon, 'AWS'], [DockerIcon, 'Docker'], [KubernetesIcon, 'Kubernetes'], [NginxIcon, 'Nginx']] },
  { title: 'Tools', items: [[VsCodeIcon, 'VS Code'], [GitIcon, 'Git'], [GithubIcon, 'GitHub'], [PostmanIcon, 'Postman']] },
];
// Existing concepts from Work.jsx, Carousel.jsx and Portfolio.jsx.
// Imagery is illustrative; no live URLs or shipped-product claims are added.
export const staticProjects = [
  { id: 'form-studio', name: 'Form Studio', category: 'Websites', description: 'Architecture for a more human tomorrow.', image: '/images/form-studio.webp', alt: 'Architecture surrounded by a quiet landscape', tags: ['React', 'Vite'], visual: 'studio', type: 'Space for a different perspective.', challenge: 'An architecture practice needs a digital presence that gives its work room to breathe. This visual concept translates the rhythm of an editorial publication to the web.', approach: 'Large imagery, a restrained type system, and responsive compositions put the work first. Motion supports orientation while respecting reduced-motion preferences.' },
  { id: 'field-notes', name: 'Field Notes', category: 'Websites', description: 'Stories from a more conscious world.', image: '/images/field-notes.webp', alt: 'Mountain lake landscape used in the Field Notes concept', tags: ['Editorial design', 'Responsive design'], type: 'Stories from a more conscious world.', challenge: 'An editorial website concept exploring stories from a more conscious world.', approach: 'The existing visual study pairs landscape imagery with a quiet editorial layout.' },
  { id: 'civic-maps', name: 'CivicMaps', category: 'UI/UX', description: 'Data for stronger communities.', image: '/images/civic-maps.webp', alt: 'Landscape imagery used in the CivicMaps interface study', tags: ['React', 'FastAPI'], type: 'Data for stronger communities.', challenge: 'A sample project exploring how a clear interface can help people understand community data.', approach: 'The original project lists React and FastAPI. This preview presents its interface concept; a deployed service is not linked.' },
  { id: 'trail-index', name: 'Trail Index', category: 'Websites', description: 'A quiet catalog for slow travel.', image: '/images/trail-index.webp', alt: 'Forest landscape illustrating the Trail Index travel concept', tags: ['Web design', 'Responsive design'], type: 'A quiet catalog for slow travel.', challenge: 'A website concept for a quiet catalog of slow travel.', approach: 'A landscape-led visual direction adapted from the existing project concept and local image library.' },
  { id: 'paper-weight', name: 'Paper Weight', category: 'UI/UX', description: 'Print-first branding, web-second.', tags: ['Branding', 'Web design'], type: 'Print-first branding, web-second.', challenge: 'An existing branding concept with a print-first, web-second point of view.', approach: 'An editorial typography study brings the original project idea into a responsive digital composition.' },
];
const email = import.meta.env.VITE_CONTACT_EMAIL?.trim() || '';
export const contactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
const phone = import.meta.env.VITE_CONTACT_PHONE?.trim() || '';
function profileUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } }
export const socialLinks = [
  { Icon: Phone, label: 'Mobile', value: phone, href: /^[+\d()\s-]{7,25}$/.test(phone) ? `tel:${phone.replace(/[^+\d]/g, '')}` : '' },
  { Icon: Mail, label: 'Email', value: contactEmail, href: contactEmail ? `mailto:${contactEmail}` : '' },
  ...[['GitHub', Github, import.meta.env.VITE_GITHUB_URL], ['LinkedIn', Linkedin, import.meta.env.VITE_LINKEDIN_URL], ['Reddit', MessageCircle, import.meta.env.VITE_REDDIT_URL]].map(([label, Icon, value]) => ({ Icon, label, value: profileUrl(value).replace('https://', '').replace(/\/$/, ''), href: profileUrl(value) })),
].filter(link => link.href);
