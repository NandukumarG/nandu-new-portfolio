import { Pencil, RefreshCw, Settings } from 'lucide-react'
import Reveal from './Reveal'
import './Profile.css'

const FEATURES = [
  { Icon: Pencil, label: 'Discover together' },
  { Icon: Settings, label: 'Build end to end' },
  { Icon: RefreshCw, label: 'Deploy & iterate' },
]

export default function Profile() {
  return (
    <section id="profile" className="profile">
      <div className="profile-inner">
        <Reveal className="profile-mark" as="div">
          <span>NK</span>
        </Reveal>

        <div className="profile-content">
          <Reveal as="h2" className="profile-heading">
            Close to the people.
            <br />
            Deep in the engineering.
          </Reveal>

          <Reveal as="p" className="profile-copy" delay={100}>
            I turn real workflows into useful products, connecting customer needs
            with interfaces, APIs, databases and dependable deployments.
          </Reveal>
        </div>
      </div>

      <Reveal as="div" className="profile-features" delay={150}>
        {FEATURES.map(({ Icon, label }) => (
          <span className="profile-feature" key={label}>
            <span className="profile-feature-icon" aria-hidden="true">
              <Icon size={15} />
            </span>
            {label}
          </span>
        ))}
      </Reveal>
    </section>
  )
}
