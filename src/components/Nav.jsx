import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import './Nav.css'

const LINKS = [
  { href: '#profile', label: 'Profile' },
  { href: '#stack', label: 'Tools' },
  { href: '#work', label: 'Work' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <a className="nav-mark" href="#top">
        NK.
      </a>

      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a className="nav-cta" href="#connect">
        Let&rsquo;s talk <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </header>
  )
}
