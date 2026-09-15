import { ArrowUpRight, Terminal, GitBranch, Check, CheckCircle2 } from "lucide-react";
import "./ProjectVisual.css";
export default function ProjectVisual({ kind }) {
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

