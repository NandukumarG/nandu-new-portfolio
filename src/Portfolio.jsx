import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Plus,
  Minus,
  X,
  Check,
  Copy,
  Menu,
  Code2,
  Layers3,
  Globe2,
  Terminal,
  GitBranch,
  CheckCircle2,
  Send,
  Infinity as InfinityIcon,
  Zap,
  Target,
  Search,
  Rocket,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiDocker,
  SiPostgresql,
  SiGit,
  SiFastapi,
} from "react-icons/si";
import { AwsIcon } from "./components/icons";
import Hero3D from "./components/Hero3D";
import Reveal from "./components/Reveal";
import heroBg from "./assets/hero-bg.jpg";
import "./portfolio.css";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();

const FOREST_PARTICLES = [
  { left: "13%", top: "40%", size: 2, duration: 26, delay: 3 },
  { left: "34%", top: "24%", size: 3, duration: 30, delay: 1 },
  { left: "48%", top: "62%", size: 2, duration: 24, delay: 9 },
  { left: "68%", top: "75%", size: 3, duration: 28, delay: 2 },
  { left: "88%", top: "60%", size: 2, duration: 25, delay: 6 },
];

const METEORS = [
  {
    kind: "meteor",
    top: "8%",
    left: "30%",
    angle: -32,
    dx: -360,
    dy: 240,
    size: 2,
    duration: 9,
    delay: 2,
  },
  {
    kind: "meteor",
    top: "4%",
    left: "62%",
    angle: -28,
    dx: -300,
    dy: 220,
    size: 2,
    duration: 11,
    delay: 14,
  },
  {
    kind: "comet",
    top: "14%",
    left: "80%",
    angle: -22,
    dx: -520,
    dy: 260,
    size: 3,
    duration: 22,
    delay: 6,
  },
  {
    kind: "comet",
    top: "2%",
    left: "45%",
    angle: -18,
    dx: -460,
    dy: 190,
    size: 3,
    duration: 26,
    delay: 20,
  },
];

const PHILOSOPHY = [
  ["Ideas", "Products"],
  ["Code", "Impact"],
  ["Coffee", "Progress"],
];

const MONOGRAM_LAYERS = Array.from({ length: 9 }, (_, i) => i);

const CAPABILITIES = [
  [InfinityIcon, "Curiosity"],
  [Zap, "Problem Solver"],
  [Target, "Product Mindset"],
  [ArrowUpRight, "Real World Impact"],
];

const PROCESS = [
  [Search, "DISCOVER TOGETHER"],
  [Layers3, "BUILD END TO END"],
  [Rocket, "DEPLOY & ITERATE"],
];

const projects = [
  {
    id: "01",
    name: "FieldOps",
    category: "Full stack",
    type: "Operations, without the friction.",
    description:
      "A considered workspace that brings people, resources, and everyday operations together.",
    tags: ["React", "FastAPI", "PostgreSQL"],
    visual: "operations",
    challenge:
      "Field teams need a clear shared picture of their work. This concept explores how tasks, people, and activity can live in one focused workspace.",
    approach:
      "A React interface pairs with a proposed FastAPI service and PostgreSQL data model. Role-based access, optimistic updates, and an auditable activity stream shape the architecture.",
  },
  {
    id: "02",
    name: "Launchpad",
    category: "Deployment",
    type: "From commit to confidence.",
    description:
      "An exploration of a quieter, more transparent path from source code to production.",
    tags: ["Docker", "GitHub Actions", "AWS"],
    visual: "deployment",
    challenge:
      "Shipping should be repeatable and easy to understand. This concept makes every deployment stage visible, from a new commit to a healthy production service.",
    approach:
      "The proposed pipeline builds an immutable container, runs checks, and promotes the same artifact through staging and production, with health checks and a rollback path.",
  },
  {
    id: "03",
    name: "Form Studio",
    category: "Web experiences",
    type: "Space for a different perspective.",
    description:
      "An editorial web concept for architecture, shaped by space, material, and simplicity.",
    tags: ["React", "Responsive design", "Vite"],
    visual: "studio",
    challenge:
      "An architecture practice needs a digital presence that gives its work room to breathe. This visual concept translates the rhythm of an editorial publication to the web.",
    approach:
      "Large imagery, a restrained type system, and responsive compositions put the work first. Motion supports orientation while respecting reduced-motion preferences.",
  },
];
const stacks = [
  {
    title: "The experience",
    subtitle: "Interfaces that feel right.",
    icon: Code2,
    items: [
      [SiReact, "React"],
      [SiTypescript, "TypeScript"],
    ],
  },
  {
    title: "The engine",
    subtitle: "A solid foundation underneath.",
    icon: Layers3,
    items: [
      [SiPython, "Python"],
      [SiFastapi, "FastAPI"],
      [SiPostgresql, "PostgreSQL"],
    ],
  },
  {
    title: "The delivery",
    subtitle: "Built to run in the real world.",
    icon: Globe2,
    items: [
      [SiDocker, "Docker"],
      [AwsIcon, "AWS"],
      [SiGit, "Git"],
    ],
  },
];
const stages = [
  [
    "Understand the real problem.",
    "Good software begins with good questions. I map the people, constraints, and workflows before choosing the technology.",
  ],
  [
    "Make the complex feel simple.",
    "I turn the problem into a clear interface and a practical architecture, then build a small, useful version to test the idea.",
  ],
  [
    "Build it. Ship it. Own it.",
    "From the first component to the deployment pipeline, I connect the details so the whole system works together.",
  ],
  [
    "Keep making it better.",
    "Observe how the product behaves, listen to the people using it, and turn what we learn into the next useful iteration.",
  ],
];

function useSpringLight(ref) {
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches
    )
      return;
    let frame = 0;
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        el.style.setProperty(
          "--scroll-shift",
          `${Math.min(window.scrollY, el.offsetHeight) * 0.065}px`,
        );
        scrollFrame = 0;
      });
    };
    const position = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    const animate = () => {
      for (const axis of ["x", "y"]) {
        position[`v${axis}`] =
          (position[`v${axis}`] +
            (position[`t${axis}`] - position[axis]) * 0.075) *
          0.76;
        position[axis] += position[`v${axis}`];
      }
      el.style.setProperty("--rx", `${-position.y * 4}deg`);
      el.style.setProperty("--ry", `${position.x * 5.5}deg`);
      el.style.setProperty("--light-x", `${50 + position.x * 35}%`);
      el.style.setProperty("--light-y", `${45 + position.y * 30}%`);
      el.style.setProperty("--px", `${position.x * 40}px`);
      el.style.setProperty("--py", `${position.y * 26}px`);
      frame =
        Math.abs(position.tx - position.x) +
          Math.abs(position.ty - position.y) >
        0.001
          ? requestAnimationFrame(animate)
          : 0;
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      position.tx = (e.clientX - r.left) / r.width - 0.5;
      position.ty = (e.clientY - r.top) / r.height - 0.5;
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => {
      position.tx = 0;
      position.ty = 0;
      if (!frame) frame = requestAnimationFrame(animate);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}

function ProjectVisual({ kind }) {
  if (kind === "studio")
    return (
      <div className="project-visual studio-visual">
        <img
          src="/images/house-formstudio.jpg"
          alt="Modern architecture surrounded by a quiet landscape"
          loading="lazy"
        />
        <div className="studio-overlay">
          <span>
            FORM®<small>ARCHITECTURE & INTERIORS</small>
          </span>
          <strong>
            Considered spaces.
            <br />
            <em>Extraordinary living.</em>
          </strong>
          <span className="studio-bottom">
            A practice in possibility. <ArrowUpRight size={20} />
          </span>
        </div>
      </div>
    );
  if (kind === "deployment")
    return (
      <div className="project-visual deployment-visual">
        <div className="deploy-orbit" />
        <div className="terminal-window">
          <div className="window-bar">
            <span className="window-dots">● ● ●</span>
            <span>launchpad / production</span>
            <Terminal size={12} />
          </div>
          <div className="terminal-content">
            <p>
              <span className="lime">❯</span> git push origin main
            </p>
            <p className="terminal-muted">Starting deployment pipeline…</p>
            {[
              "Build image",
              "Run checks",
              "Push to registry",
              "Deploy to production",
            ].map((t, i) => (
              <div className="terminal-stage" key={t}>
                <Check size={12} />
                <span>{t}</span>
                <small>{[12, 8, 4, 16][i]}s</small>
              </div>
            ))}
            <div className="deployed">
              <span className="status-dot" /> Successfully deployed{" "}
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
        <span className="visual-caption">
          <GitBranch size={12} /> main <span>→</span> production
        </span>
      </div>
    );
  return (
    <div className="project-visual operations-visual">
      <div className="app-preview">
        <aside>
          <span className="app-logo">
            f<span>o</span>
          </span>
          <i />
          <i />
          <i />
          <i />
          <span className="app-avatar">NK</span>
        </aside>
        <div className="app-content">
          <div className="app-top">
            <span>
              Workspace <span className="muted">/ Overview</span>
            </span>
            <span className="mini-avatar">N</span>
          </div>
          <div className="app-heading">
            <div>
              <small>MONDAY, MAY 18</small>
              <h4>Make room for good work.</h4>
            </div>
            <span className="mini-button">+ New project</span>
          </div>
          <div className="app-metrics">
            {[
              ["12", "Active projects"],
              ["84", "Tasks completed"],
              ["08", "Team members"],
            ].map(([n, l]) => (
              <div key={l}>
                <small>{l}</small>
                <strong>
                  {n}
                  <span>↗</span>
                </strong>
              </div>
            ))}
          </div>
          <div className="app-chart">
            <div>
              Project activity <small>This week ↗</small>
            </div>
            <div className="chart-bars">
              {[
                28, 52, 40, 68, 56, 85, 73, 90, 68, 98, 83, 112, 100, 126, 113,
                145, 134, 155,
              ].map((h, i) => (
                <i key={i} style={{ height: `${h / 1.9}px` }} />
              ))}
            </div>
          </div>
          <div className="app-task">
            <CheckCircle2 size={12} />
            <span>Design system update</span>
            <small>In progress</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ modal, onClose }) {
  const dialog = useRef(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  const copyBrief = async (e) => {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    const brief = `Project inquiry\n\nName: ${values.get("name")}\nEmail: ${values.get("email")}\n\n${values.get("message")}`;
    if (contactEmail) {
      window.location.href = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(`Project inquiry from ${values.get("name")}`)}&body=${encodeURIComponent(brief)}`;
      setCopied(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Clipboard access is unavailable. You can select and copy your message below.",
      );
    }
  };
  const isContact = modal === "contact";
  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <button
        className="close-dialog icon-button"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <X size={20} />
      </button>
      {isContact ? (
        <>
          <p className="eyebrow">A GOOD PLACE TO START</p>
          <h2 id="dialog-title">
            Tell me what
            <br />
            you’re <em>imagining.</em>
          </h2>
          <p className="dialog-intro">
            A new product, a tricky integration, or a better way to ship. Put
            the idea into words.
          </p>
          <form onSubmit={copyBrief} onChange={() => setCopied(false)}>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Taylor"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@company.com"
                  required
                />
              </label>
            </div>
            <label>
              What would you like to build?
              <textarea
                name="message"
                placeholder="A little about your idea, timeline, and what you need…"
                required
                rows={4}
                maxLength={5000}
              />
            </label>
            <button className="button button-lime" type="submit">
              {contactEmail
                ? "Continue to email"
                : copied
                  ? "Brief copied"
                  : "Copy project brief"}
              {contactEmail ? (
                <Send size={16} />
              ) : copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
            <p className="form-note" role="status">
              {error ||
                (contactEmail
                  ? "Opens a draft in your email app. Review it there before sending."
                  : copied
                    ? "Your brief is ready to paste into an email or message. Nothing has been sent."
                    : "Contact details are being configured. Save your brief to share later.")}
            </p>
          </form>
        </>
      ) : (
        <>
          <p className="eyebrow">
            {modal.category.toUpperCase()} / CONCEPT PROJECT
          </p>
          <h2 id="dialog-title">
            {modal.name}
            <span className="lime">.</span>
          </h2>
          <p className="dialog-intro">{modal.type}</p>
          <ProjectVisual kind={modal.visual} />
          <div className="dialog-detail">
            <h3>The idea</h3>
            <p>{modal.challenge}</p>
            <h3>The architecture</h3>
            <p>{modal.approach}</p>
            <div className="project-tags">
              {modal.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

const NAV_LINKS = [
  ["about", "Profile"],
  ["stack", "Stack"],
  ["work", "Work"],
];

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("All work");
  const [stage, setStage] = useState(0);
  const [modal, setModal] = useState(null);
  const hero = useRef(null);
  const about = useRef(null);
  useSpringLight(hero);
  useSpringLight(about);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", menu);
    return () => document.body.classList.remove("nav-menu-open");
  }, [menu]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <a className="wordmark" href="#top" aria-label="Nandu home">
          NK<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {NAV_LINKS.map(([id, label]) => (
            <a
              className={active === id ? "active" : ""}
              key={id}
              href={`#${id}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-right">
          <button className="header-cta" onClick={() => setModal("contact")}>
            Let’s talk <ArrowUpRight size={15} className="header-cta-arrow" />
          </button>
          <button
            className="menu-toggle icon-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div className={menu ? "nav-overlay nav-overlay-open" : "nav-overlay"}>
        <nav className="nav-overlay-links" aria-label="Mobile navigation">
          {NAV_LINKS.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenu(false)}
              style={{ transitionDelay: menu ? `${80 + i * 60}ms` : "0ms" }}
            >
              {label}
            </a>
          ))}
          <button
            className="nav-overlay-cta"
            onClick={() => {
              setMenu(false);
              setModal("contact");
            }}
            style={{
              transitionDelay: menu ? `${80 + NAV_LINKS.length * 60}ms` : "0ms",
            }}
          >
            Let’s talk <ArrowUpRight size={16} />
          </button>
        </nav>
      </div>
      <main id="main">
        <section className="cinema-hero" id="top" ref={hero}>
          <div className="forest-atmosphere" aria-hidden="true">
            <div
              className="hero-bg-photo"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="hero-bg-scrim" />
            <div className="hero-moon">
              <div className="hero-moon-glow" />
              <div className="hero-moon-surface">
                <img
                  className="hero-moon-texture"
                  src="/images/moon-detailed.png"
                  alt=""
                  aria-hidden="true"
                />
                <div className="hero-moon-shading" />
              </div>
            </div>
            <div className="hero-meteors">
              {METEORS.map((m, i) => (
                <span
                  key={i}
                  className={`meteor meteor-${m.kind}`}
                  style={{
                    top: m.top,
                    left: m.left,
                    width: m.size,
                    height: m.size,
                    "--angle": `${m.angle}deg`,
                    "--dx": `${m.dx}px`,
                    "--dy": `${m.dy}px`,
                    animationDuration: `${m.duration}s`,
                    animationDelay: `${m.delay}s`,
                  }}
                />
              ))}
            </div>
            <div className="forest-fog forest-fog-1" />
            <div className="forest-fog forest-fog-2" />
            <div className="forest-glow" />
            <div className="forest-particles">
              {FOREST_PARTICLES.map((p, i) => (
                <span
                  key={i}
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-corner-tag" aria-hidden="true">
            <span>Build</span>
            <span>Deploy</span>
            <span>Iterate</span>
          </div>
          <div className="hero-container">
            <div className="hero-text">
              <Reveal>
                <p className="eyebrow">
                  <span className="little-cross">+</span> FULL STACK DEVELOPER &
                  DEPLOYMENT ENGINEER
                </p>
                <h1>
                  Complex problems.
                  <br />
                  <em>Elegant software.</em>
                  <br />
                  Real impact<span className="lime">.</span>
                </h1>
                <p className="hero-description">
                  I work with people, build across the stack,
                  <br className="desktop-break" /> and bring solutions into
                  production.
                </p>
                <div className="hero-buttons">
                  <a href="#work" className="button button-lime">
                    Explore my work <ArrowUpRight size={17} />
                  </a>
                  <a href="#about" className="text-button">
                    Meet the engineer <ArrowUpRight size={16} />
                  </a>
                </div>
                <div className="hero-philosophy">
                  {PHILOSOPHY.map(([a, b]) => (
                    <div className="philosophy-item" key={a}>
                      <span>{a}</span>
                      <span className="philosophy-sub">
                        <ArrowRight size={11} /> {b}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="system-art">
              <div className="scene-coordinate">
                <span className="tiny-square" /> SYSTEM ARCHITECTURE{" "}
                <span>— 001</span>
              </div>
              <div className="scene-model">
                <Hero3D />
              </div>
              <div className="scene-caption">
                <span className="plus-symbol">+</span> ONE CONNECTED SYSTEM.
                <br />
                <span className="caption-second">ENDLESS POSSIBILITIES.</span>
              </div>
              <span className="scene-axis">X ↗ &nbsp; Y ↑ &nbsp; Z ↘</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              <span className="status-dot" /> BASED IN INDIA · BUILDING
              EVERYWHERE
            </span>
            <a href="#work">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </a>
            <span>SYSTEMS FOR A BRIGHTER TOMORROW.</span>
          </div>
          <div className="hero-divider-glow" aria-hidden="true" />
        </section>
        <div className="principles-strip">
          <span>THINK DEEPLY.</span>
          <Plus />
          <span>BUILD THOUGHTFULLY.</span>
          <Plus />
          <span>SHIP CONFIDENTLY.</span>
          <Plus />
          <span>KEEP EVOLVING.</span>
          <Plus />
        </div>
        <section id="work" className="section work-section">
          <Reveal>
            <div className="section-topline">
              <p className="eyebrow">
                <span className="section-number">01 /</span> SELECTED WORK
              </p>
              <span className="section-aside">
                A FEW IDEAS, BROUGHT TO LIFE
              </span>
            </div>
            <div className="section-title-row">
              <h2>
                Less talk.
                <br />
                <em>More built.</em>
              </h2>
              <p>
                A selection of product and engineering concepts.
                <br />
                Thoughtful on the surface. Solid underneath.
              </p>
            </div>
            <div className="work-filter" aria-label="Filter projects">
              {["All work", "Full stack", "Deployment", "Web experiences"].map(
                (f) => (
                  <button
                    aria-pressed={filter === f}
                    key={f}
                    className={filter === f ? "selected" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    {f === "All work" && <span>03</span>}
                  </button>
                ),
              )}
            </div>
          </Reveal>
          <div className="projects-grid">
            {projects
              .filter((p) => filter === "All work" || p.category === filter)
              .map((project) => (
                <article className="project-card" key={project.id}>
                  <button
                    className="project-open"
                    onClick={() => setModal(project)}
                    aria-label={`Explore ${project.name} concept`}
                  >
                    <ProjectVisual kind={project.visual} />
                    <span className="project-view">
                      <ArrowUpRight size={22} />
                    </span>
                  </button>
                  <div className="project-meta">
                    <span>{project.category.toUpperCase()}</span>
                    <span>CONCEPT / {project.id}</span>
                  </div>
                  <button
                    className="project-title"
                    onClick={() => setModal(project)}
                  >
                    {project.name}
                    <ArrowUpRight size={21} />
                  </button>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
          </div>
          <div className="work-footnote">
            <span>Every good project starts with a real problem.</span>
            <button className="text-button" onClick={() => setModal("contact")}>
              Have one in mind? <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
        <section id="about" className="about-section section" ref={about}>
          <div className="about-atmosphere" aria-hidden="true">
            <div className="about-particles">
              {FOREST_PARTICLES.slice(0, 4).map((p, i) => (
                <span
                  key={i}
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <Reveal>
            <div className="section-topline">
              <p className="eyebrow">
                <span className="section-number">01 /</span> ABOUT
              </p>
              <span className="little-cross">+</span>
            </div>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-left">
              <div className="monogram-scene">
                <div className="monogram-orbit-wrap">
                  <div className="monogram-orbit monogram-orbit-1" />
                  <div className="monogram-orbit monogram-orbit-2" />
                </div>
                <div className="monogram-rock" />
                <div className="monogram-3d">
                  <div className="monogram-spin">
                    <div className="monogram-stack">
                      {MONOGRAM_LAYERS.map((i) => (
                        <span
                          key={i}
                          className={
                            i === 0 ? "monogram-layer monogram-face" : "monogram-layer"
                          }
                          style={{
                            transform: `translateZ(${-i * 3.2}px)`,
                            opacity: i === 0 ? 1 : Math.max(0.16, 1 - i * 0.11),
                          }}
                        >
                          NK.
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="monogram-engraving">
                  <span>PEOPLE</span>
                  <span>SOLVE</span>
                  <span>BUILD</span>
                  <span>TOGETHER</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="about-copy">
              <div className="about-copy-main">
                <h2>
                  Close to the people.
                  <br />
                  Deep in the <em>engineering.</em>
                </h2>
                <p>
                  I turn real workflows into useful products, connecting
                  customer needs with interfaces, APIs, databases and
                  dependable deployments.
                </p>
              </div>
              <span className="about-divider" aria-hidden="true" />
              <div className="about-capabilities">
                {CAPABILITIES.map(([Icon, label]) => (
                  <span key={label}>
                    <Icon size={13} /> {label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal className="about-process">
            {PROCESS.map(([Icon, label]) => (
              <div className="process-item" key={label}>
                <span className="process-icon">
                  <Icon size={16} />
                </span>
                <span className="process-label">{label}</span>
              </div>
            ))}
          </Reveal>
          <div className="section-divider-glow" aria-hidden="true" />
        </section>
        <section id="stack" className="section stack-section">
          <Reveal>
            <div className="section-topline">
              <p className="eyebrow">
                <span className="section-number">03 /</span> MY TOOLKIT
              </p>
              <span className="section-aside">
                THE RIGHT TOOLS. THE RIGHT REASONS.
              </span>
            </div>
            <div className="section-title-row">
              <h2>
                From code
                <br />
                <em>to cloud.</em>
              </h2>
              <p>
                One connected workflow, across the entire stack.
                <br />
                Chosen for the problem. Built for what comes next.
              </p>
            </div>
          </Reveal>
          <div className="stack-grid">
            {stacks.map((s, i) => (
              <Reveal className="stack-card" key={s.title} delay={i * 80}>
                <div className="stack-card-top">
                  <s.icon size={28} strokeWidth={1.2} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.subtitle}</p>
                <div className="stack-items">
                  {s.items.map(([Icon, label]) => (
                    <span key={label}>
                      <Icon size={19} />
                      {label}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="pipeline">
            <span>
              <GitBranch size={15} /> idea
            </span>
            <i />
            <span>
              <Code2 size={15} /> develop
            </span>
            <i />
            <span>
              <CheckCircle2 size={15} /> validate
            </span>
            <i />
            <span className="lime">
              <Globe2 size={15} /> deploy
            </span>
            <span className="pipeline-end">
              <span className="status-dot" /> AND KEEP IMPROVING
            </span>
          </Reveal>
        </section>
        <section className="section process-section" id="process">
          <Reveal className="process-intro">
            <p className="eyebrow">
              <span className="section-number">04 /</span> HOW I WORK
            </p>
            <h2>
              Intent in
              <br />
              <em>every step.</em>
            </h2>
            <p>
              A collaborative process.
              <br />
              An engineer’s attention to detail.
            </p>
            <span className="process-asterisk" aria-hidden="true">
              ✳
            </span>
          </Reveal>
          <div className="process-steps">
            {stages.map(([title, text], i) => (
              <div
                className={`process-step ${stage === i ? "expanded" : ""}`}
                key={title}
              >
                <button
                  onClick={() => setStage(stage === i ? -1 : i)}
                  aria-expanded={stage === i}
                  aria-controls={`stage-${i}`}
                >
                  <span className="step-index">0{i + 1}</span>
                  <span>{title}</span>
                  {stage === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <div
                  className="step-content"
                  id={`stage-${i}`}
                  hidden={stage !== i}
                >
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="contact-section section" id="connect">
          <div className="contact-orbit" aria-hidden="true" />
          <Reveal>
            <p className="eyebrow">
              <span className="status-dot" /> GOOD THINGS START WITH A
              CONVERSATION
            </p>
            <div className="contact-row">
              <h2>
                Let’s build
                <br />
                something <em>that matters.</em>
              </h2>
              <button
                className="contact-circle"
                aria-label="Start a conversation"
                onClick={() => setModal("contact")}
              >
                <ArrowUpRight size={43} strokeWidth={1.2} />
                <span>SAY HELLO</span>
              </button>
            </div>
            <div className="contact-bottom">
              <p>
                Have an idea, a challenge, or a role in mind?
                <br />
                I’d love to hear about it.
              </p>
              <button
                className="text-button"
                onClick={() => setModal("contact")}
              >
                Start a conversation <Send size={15} />
              </button>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#top">
          nandu<span>®</span>
        </a>
        <span>© {new Date().getFullYear()} Nandu. Crafted with care.</span>
        <a href="#top">
          BACK TO TOP <ArrowUpRight size={14} />
        </a>
      </footer>
      {modal && (
        <Modal
          key={typeof modal === "string" ? modal : modal.id}
          modal={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
