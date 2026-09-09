import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCallback, useRef } from 'react'
import Carousel from './Carousel'
import Reveal from './Reveal'
import './Work.css'

const SITES = [
  {
    title: 'Form Studio',
    copy: 'Architecture for a more human tomorrow.',
    image: '/images/house-formstudio.jpg',
  },
  {
    title: 'Field Notes',
    copy: 'Stories from a more conscious world.',
    image: '/images/lake-fieldnotes.jpg',
  },
  { title: 'Trail Index', copy: 'A quiet catalog for slow travel.' },
  { title: 'Paper Weight', copy: 'Print-first branding, web-second.' },
]

export default function Work() {
  const trackRef = useRef(null)
  const dragState = useRef(null)
  const draggedRef = useRef(false)

  const onPointerDown = useCallback((event) => {
    const track = trackRef.current
    if (!track) return
    dragState.current = { startX: event.clientX, startScroll: track.scrollLeft }
    draggedRef.current = false
    track.setPointerCapture?.(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event) => {
    const track = trackRef.current
    if (!track || !dragState.current) return
    const dx = event.clientX - dragState.current.startX
    if (Math.abs(dx) > 4) draggedRef.current = true
    track.scrollLeft = dragState.current.startScroll - dx
  }, [])

  const endDrag = useCallback(() => {
    dragState.current = null
  }, [])

  const onSiteClick = useCallback((event) => {
    if (draggedRef.current) {
      event.preventDefault()
      draggedRef.current = false
    }
  }, [])

  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.work-site')
    const amount = (card?.offsetWidth || 300) + 20
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }, [])

  return (
    <section id="work" className="work">
      <div className="work-corner-label" aria-hidden="true">
        <span>Ideas</span>
        <span>Into</span>
        <span>Reality</span>
      </div>

      <Reveal as="p" className="section-kicker">
        02 / Selected work — sample projects
      </Reveal>
      <Reveal as="h2" className="section-heading">
        Explore what&rsquo;s possible.
      </Reveal>
      <Reveal as="p" className="work-eyebrow work-eyebrow-highlight" delay={100}>
        Full stack projects
      </Reveal>

      <Carousel />

      <Reveal as="p" className="work-eyebrow work-eyebrow-highlight" delay={100}>
        Static websites
      </Reveal>

      <div className="work-sites-row">
        <div
          className="work-sites"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {SITES.map((site, index) => (
            <Reveal
              as="a"
              href="#connect"
              className="work-site"
              key={site.title}
              delay={index * 80}
              onClick={onSiteClick}
            >
              <div
                className={`work-site-preview${site.image ? ' has-photo' : ''}`}
                aria-hidden="true"
                style={site.image ? { '--site-photo': `url(${site.image})` } : undefined}
              />
              <div className="work-site-copy">
                <h3>{site.title}</h3>
                <p>{site.copy}</p>
                <span>
                  Live site <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="work-sites-side">
          <button
            type="button"
            className="work-sites-next"
            onClick={() => scrollByCard(1)}
            aria-label="Scroll to next site"
          >
            <ArrowRight size={18} />
          </button>
          <div className="work-corner-label work-corner-label-small" aria-hidden="true">
            <span>Small sites</span>
            <span>Big ideas</span>
          </div>
        </div>
      </div>
    </section>
  )
}
