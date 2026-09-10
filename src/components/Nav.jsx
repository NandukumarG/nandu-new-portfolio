import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './Nav.css'

const LINKS = [
  { href: '#profile', label: 'Profile' },
  { href: '#stack', label: 'Stack' },
  { href: '#work', label: 'Work' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
        <a className="nav-mark" href="#top">
          NK<span className="nav-mark-dot">.</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#connect">
          <span>Let&rsquo;s talk</span>
          <ArrowUpRight size={15} aria-hidden="true" className="nav-cta-arrow" />
        </a>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' nav-toggle-active' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`nav-overlay${menuOpen ? ' nav-overlay-open' : ''}`}>
        <button type="button" className="nav-overlay-close" aria-label="Close menu" onClick={closeMenu}>
          <X size={22} aria-hidden="true" />
        </button>
        <nav className="nav-overlay-links" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#connect"
            onClick={closeMenu}
            className="nav-overlay-cta"
            style={{ transitionDelay: menuOpen ? `${80 + LINKS.length * 60}ms` : '0ms' }}
          >
            Let&rsquo;s talk <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </>
  )
}
