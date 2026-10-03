import { Lightbulb, BookOpen, Box, Users, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaGithub as Github, FaLinkedinIn as Linkedin } from 'react-icons/fa';
import { ReactIcon, JavaScriptIcon, Html5Icon, CssIcon, BootstrapIcon, ViteIcon, NodeIcon, PythonIcon, RestApiIcon, MicroservicesIcon, JsonIcon, MysqlIcon, PostgresIcon, AwsIcon, DockerIcon, DockerComposeIcon, KubernetesIcon, NginxIcon, LinuxIcon, GithubActionsIcon, BashIcon, VsCodeIcon, GitIcon, GithubIcon, NpmIcon, FigmaIcon, CopilotIcon, ClaudeIcon, AntigravityIcon, PostmanIcon, VercelIcon, McpIcon, ConnectedToolsIcon } from '../components/icons';
export const navLinks = [['top', 'Home'], ['about', 'About'], ['stack', 'Stack'], ['work', 'Work'], ['connect', 'Contact']];
export const capabilities = [
  { Icon: Lightbulb, title: 'Problem Solver', copy: 'Break complexity into clear, useful solutions.' },
  { Icon: BookOpen, title: 'Continuous Learner', copy: 'Stay curious. Keep exploring better ways to build.' },
  { Icon: Box, title: 'Build & Deploy', copy: 'Connect every layer, from interface to infrastructure.' },
  { Icon: Users, title: 'Collaborate', copy: 'Work closely with people to solve the right problem.' },
];
// Database sits before Cloud so the two short groups share a row in the stack grid.
export const technologies = [
  { title: 'Frontend', items: [[ReactIcon, 'React.js'], [JavaScriptIcon, 'JavaScript'], [Html5Icon, 'HTML5'], [CssIcon, 'CSS3'], [BootstrapIcon, 'Bootstrap'], [ViteIcon, 'Vite']] },
  { title: 'Backend', items: [[NodeIcon, 'Node.js'], [PythonIcon, 'Python'], [RestApiIcon, 'REST APIs'], [MicroservicesIcon, 'Microservices'], [JsonIcon, 'JSON']] },
  { title: 'Database', items: [[MysqlIcon, 'MySQL'], [PostgresIcon, 'PostgreSQL']] },
  { title: 'Cloud', items: [[AwsIcon, 'AWS'], [DockerIcon, 'Docker'], [DockerComposeIcon, 'Docker Compose'], [KubernetesIcon, 'Kubernetes'], [NginxIcon, 'Nginx'], [LinuxIcon, 'Linux'], [GithubActionsIcon, 'GitHub Actions'], [BashIcon, 'Bash'], [PythonIcon, 'Python Scripting']] },
  { title: 'Tools', items: [[GitIcon, 'Git'], [GithubIcon, 'GitHub'], [VsCodeIcon, 'VS Code'], [NpmIcon, 'npm'], [FigmaIcon, 'Figma'], [CopilotIcon, 'GitHub Copilot'], [ClaudeIcon, 'Claude Code'], [AntigravityIcon, 'Antigravity'], [PostmanIcon, 'Postman'], [VercelIcon, 'Vercel'], [McpIcon, 'MCP Servers'], [ConnectedToolsIcon, 'Claude → Figma'], [ConnectedToolsIcon, 'Claude → VS Code']] },
];
export const workFilters = ['All', 'Web', 'Full Stack', 'DevOps', 'AI', 'UI/UX'];
export const practices = [
  { id: 'development', label: 'DEVELOPMENT', aside: 'IDEA → PRODUCTION', heading: ['From code', 'to production.'],
    intro: ['I take applications from interface to deployment.'],
    steps: [['Build', 'Create responsive interfaces and useful web apps.'], ['Connect', 'Link APIs, databases, and external services.'], ['Deploy', 'Ship with Docker, Kubernetes, AWS, and hosting platforms.'], ['Monitor', 'Track logs, resources, and service health.'], ['Automate', 'Simplify repeatable work with scripts and AI tools.']] },
  { id: 'devops', label: 'DEVOPS', aside: 'DEPLOYABLE · MAINTAINABLE · RELIABLE', heading: ['I don’t just build it.', 'I help keep it running.'],
    intro: ['I build for reliable delivery, maintenance, and growth.'],
    steps: [['Containerize', 'Package apps consistently with Docker.'], ['Deploy', 'Release through AWS, Kubernetes, Nginx, or Vercel.'], ['Automate', 'Repeat workflows with GitHub Actions and scripts.'], ['Connect', 'Bring services and infrastructure together.']] },
  { id: 'ai', label: 'AI & MODERN WORKFLOWS', aside: 'WHERE IT GENUINELY HELPS', heading: ['Building with AI', 'without losing the human touch.'],
    intro: ['I use AI to explore and build faster, while keeping decisions human-led.'],
    steps: [['Explore', 'Move from ideas to prototypes quickly.'], ['Develop', 'Use AI to assist implementation and debugging.'], ['Connect', 'Link AI tools with design and development workflows.'], ['Review', 'Keep engineering decisions human-led.']] },
  { id: 'design', label: 'DESIGN', aside: 'SIMPLE. CLEAR. INTENTIONAL.', heading: ['Where engineering', 'meets design.'],
    intro: ['I turn clear ideas into thoughtful, responsive interfaces.'],
    tags: ['Figma', 'UI/UX', 'Prototyping', 'Responsive Design', 'Interaction Design'] },
  { id: 'approach', label: 'APPROACH', aside: 'UNDERSTAND → IMPROVE', heading: ['Think. Build.', 'Improve.'],
    steps: [['Understand', 'Define the problem first.'], ['Explore', 'Compare ideas and approaches.'], ['Build', 'Make the solution work.'], ['Test', 'Find gaps and failures.'], ['Improve', 'Refine quality and reliability.']] },
];
// Existing concepts from Work.jsx, Carousel.jsx and Portfolio.jsx.
// Imagery is illustrative; no live URLs or shipped-product claims are added.
export const staticProjects = [
  { id: 'form-studio', name: 'Form Studio', category: 'Web', description: 'Architecture for a more human tomorrow.', image: '/images/form-studio.webp', alt: 'Architecture surrounded by a quiet landscape', tags: ['React', 'Vite'], visual: 'studio', type: 'Space for a different perspective.', challenge: 'An architecture practice needs a digital presence that gives its work room to breathe. This visual concept translates the rhythm of an editorial publication to the web.', approach: 'Large imagery, a restrained type system, and responsive compositions put the work first. Motion supports orientation while respecting reduced-motion preferences.' },
  { id: 'field-notes', name: 'Field Notes', category: 'Web', description: 'Stories from a more conscious world.', image: '/images/field-notes.webp', alt: 'Mountain lake landscape used in the Field Notes concept', tags: ['Editorial design', 'Responsive design'], type: 'Stories from a more conscious world.', challenge: 'An editorial website concept exploring stories from a more conscious world.', approach: 'The existing visual study pairs landscape imagery with a quiet editorial layout.' },
  { id: 'civic-maps', name: 'CivicMaps', category: 'Full Stack', description: 'Data for stronger communities.', image: '/images/civic-maps.webp', alt: 'Landscape imagery used in the CivicMaps interface study', tags: ['React', 'FastAPI'], type: 'Data for stronger communities.', challenge: 'A sample project exploring how a clear interface can help people understand community data.', approach: 'The original project lists React and FastAPI. This preview presents its interface concept; a deployed service is not linked.' },
  { id: 'trail-index', name: 'Trail Index', category: 'Web', description: 'A quiet catalog for slow travel.', image: '/images/trail-index.webp', alt: 'Forest landscape illustrating the Trail Index travel concept', tags: ['Web design', 'Responsive design'], type: 'A quiet catalog for slow travel.', challenge: 'A website concept for a quiet catalog of slow travel.', approach: 'A landscape-led visual direction adapted from the existing project concept and local image library.' },
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
