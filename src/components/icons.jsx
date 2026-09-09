import {
  SiDocker,
  SiFastapi,
  SiGit,
  SiGithub,
  SiKubernetes,
  SiMongodb,
  SiNginx,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'

export function ReactIcon() {
  return <SiReact size={20} color="#61dafb" />
}

export function TypeScriptIcon() {
  return <SiTypescript size={20} color="#3178c6" />
}

export function ViteIcon() {
  return <SiVite size={20} color="#8c67e6" />
}

export function TailwindIcon() {
  return <SiTailwindcss size={20} color="#38bdf8" />
}

export function PythonIcon() {
  return <SiPython size={20} color="#3776ab" />
}

export function FastApiIcon() {
  return <SiFastapi size={20} color="#009688" />
}

export function PostgresIcon() {
  return <SiPostgresql size={20} color="#336791" />
}

export function MongoIcon() {
  return <SiMongodb size={20} color="#47a248" />
}

export function DockerIcon() {
  return <SiDocker size={20} color="#2496ed" />
}

export function KubernetesIcon() {
  return <SiKubernetes size={20} color="#326ce5" />
}

export function NginxIcon() {
  return <SiNginx size={20} color="#009639" />
}

export function GitIcon() {
  return <SiGit size={20} color="#f05033" />
}

export function GithubIcon() {
  return <SiGithub size={20} color="#111111" />
}

export function PostmanIcon() {
  return <SiPostman size={20} color="#ff6c37" />
}

// AWS and VS Code brand marks aren't in the simple-icons set (trademark
// restrictions), so these two stay hand-drawn approximations.
export function AwsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff9900">
      <path d="M3 16.5c4.5 3 13.5 3 18 0l-1 1.6c-4.8 2.6-11.2 2.6-16 0Z" />
      <path d="M7 8.5c0-1.9 1.8-3 4-3s4 1.1 4 3v4.6c0 .5.2.9.7 1.3l-1.2 1.1c-.5-.3-.9-.6-1.2-1-1 .8-2.2 1.2-3.3 1.2-2.1 0-3.5-1.3-3.5-3.2 0-1.9 1.6-3.1 4-3.2l1.5-.1v-.4c0-1-.5-1.5-1.6-1.5-1 0-1.7.4-1.9 1.2Zm4.5 3.4-1.2.1c-1.2.1-1.8.6-1.8 1.5 0 .8.6 1.3 1.4 1.3.8 0 1.5-.4 2-1.1a2 2 0 0 1-.4-1.3Z" />
    </svg>
  )
}

export function VsCodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#007acc">
      <path d="m16.5 2.5 5 2.3v14.4l-5 2.3-8-7.3-4.5 3.4-2-1.5V8.9l2-1.5L8.5 10Z" />
      <path d="m16.5 21.5-8-7.3 8-7.7Z" fill="#fff" fillOpacity=".25" />
    </svg>
  )
}
