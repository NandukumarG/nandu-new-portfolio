import { Lightbulb, BookOpen, Box, Users, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaGithub as Github, FaLinkedinIn as Linkedin } from 'react-icons/fa';
import { ReactIcon, JavaScriptIcon, Html5Icon, CssIcon, BootstrapIcon, ViteIcon, NodeIcon, PythonIcon, RestApiIcon, MicroservicesIcon, JsonIcon, MysqlIcon, PostgresIcon, AwsIcon, DockerIcon, DockerComposeIcon, KubernetesIcon, NginxIcon, LinuxIcon, GithubActionsIcon, BashIcon, VsCodeIcon, GitIcon, GithubIcon, NpmIcon, FigmaIcon, CopilotIcon, ClaudeIcon, AntigravityIcon, PostmanIcon, VercelIcon, McpIcon, ConnectedToolsIcon } from '../components/icons';
import fish3dImage from '../assets/fish-3d-thumb.webp';
import bambooBazarImage from '../assets/bamboobazar-thumb.webp';
import bachelorsDhobiImage from '../assets/bachelors-dhobi-thumb.webp';
import animeImage from '../assets/24hrs-anime-thumb.webp';
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
export const staticProjects = [
  {
    id: 'fish-3d', name: 'Fish 3D', category: 'Web', description: 'An immersive website built around a 3D fish experience.',
    image: fish3dImage, alt: 'Fish 3D website homepage', headline: 'An immersive 3D experience', tags: ['3D', 'Interactive'],
    url: 'https://fish3dwebsite.vercel.app/',
  },
  {
    id: 'bamboo-bazar', name: 'BambooBazar', category: 'Web', description: 'A storefront for thoughtfully designed bamboo home goods.',
    image: bambooBazarImage, alt: 'BambooBazar storefront homepage', headline: 'Natural living, online', tags: ['Storefront', 'E-commerce'],
    url: 'https://bamboobazar.vercel.app/',
  },
  {
    id: 'bachelors-dhobi', name: 'Bachelor’s Dhobi', category: 'Web', description: 'A laundry service website for convenient pickup and care.',
    image: bachelorsDhobiImage, alt: 'Bachelor’s Dhobi laundry service homepage', headline: 'Laundry, made simpler', tags: ['Services', 'Booking'],
    url: 'https://bachelors-dhobi-two.vercel.app/',
  },
  {
    id: '24hrs-anime', name: '24hrs Anime', category: 'Web', description: 'An anime discovery experience for finding the next series to watch.',
    image: animeImage, alt: '24hrs Anime discovery homepage', headline: 'Find your next obsession', tags: ['Anime', 'Discovery'],
    url: 'https://24hrs-anime.vercel.app/',
  },
];
const name = 'Nanda Kumar G';
const email = import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'mr.nandu22197@gmail.com';
export const contactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
const phone = import.meta.env.VITE_CONTACT_PHONE?.trim() || '+91 7795711896';
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL?.trim() || 'https://www.linkedin.com/in/nanda-kumar-7220972b5';
function profileUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } }
export const socialLinks = [
  { Icon: Users, label: 'Name', value: name, href: '#' },
  { Icon: Phone, label: 'Mobile', value: phone, href: /^[+\d()\s-]{7,25}$/.test(phone) ? `tel:${phone.replace(/[^+\d]/g, '')}` : '' },
  { Icon: Mail, label: 'Email', value: contactEmail, href: contactEmail ? `mailto:${contactEmail}` : '' },
  { Icon: Linkedin, label: 'LinkedIn', value: profileUrl(linkedinUrl).replace('https://', '').replace(/\/$/, ''), href: profileUrl(linkedinUrl) },
  ...[['GitHub', Github, import.meta.env.VITE_GITHUB_URL], ['Reddit', MessageCircle, import.meta.env.VITE_REDDIT_URL]].map(([label, Icon, value]) => ({ Icon, label, value: profileUrl(value)?.replace('https://', '').replace(/\/$/, ''), href: profileUrl(value) })),
].filter(link => link.href && link.value);
