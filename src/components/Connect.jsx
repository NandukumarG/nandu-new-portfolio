import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import './Connect.css'

const RING_TEXT = 'SAY HELLO • SAY HELLO • SAY HELLO • SAY HELLO • '

export default function Connect() {
  return (
    <section id="connect" className="connect">
      <div className="connect-inner">
        <Reveal as="div" className="connect-copy">
          <p className="section-kicker connect-kicker">03 / Connect</p>
          <h2 className="connect-heading">
            Let&rsquo;s build
            <br />
            something that matters.
          </h2>
          <p className="connect-sub">Bring the problem. We&rsquo;ll find the next step.</p>
        </Reveal>

        <Reveal as="div" className="connect-button-wrap" delay={120}>
          <a className="connect-button" href="mailto:hello@example.com" aria-label="Start a conversation">
            <svg className="connect-ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="connect-ring-path" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
              </defs>
              <text fontSize="11.5" letterSpacing="3" fill="#0e1509">
                <textPath href="#connect-ring-path">{RING_TEXT}</textPath>
              </text>
            </svg>
            <span className="connect-button-center">
              <ArrowUpRight size={20} aria-hidden="true" />
              Start a conversation
            </span>
          </a>
        </Reveal>

        <Reveal as="div" className="connect-links" delay={200}>
          <a href="mailto:hello@example.com">
            Email <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
      </div>

      <footer className="connect-footer">
        <span className="footer-mark">NK.</span>
        <span className="footer-tagline">From real needs to working systems.</span>
        <span className="footer-words">People / Solve / Build / Together</span>
      </footer>
    </section>
  )
}
