import './Hero3D.css'

/**
 * High-fidelity isometric software system model in dark metal and forest glass.
 * Displays the exact system architecture with responsive scaling and ambient glow.
 */
export default function Hero3D() {
  return (
    <div className="stack3d-wrap">
      <div
        className="hero-system is-ready"
        role="img"
        aria-label="An isometric software system in dark metal and forest glass: a monitor connects through an API tower to a database, servers, and a deployment cloud with glowing lime conduits."
      >
        <div className="hero-system-glow" aria-hidden="true" />
        <img
          className="hero-system-exact"
          src="/images/hero-system-exact.png"
          alt="Isometric system architecture model: Frontend web apps monitor, API backend servers, Deploy Anywhere cloud with AWS and Kubernetes, database, and container orchestration."
          fetchPriority="high"
          loading="eager"
        />
      </div>
    </div>
  )
}
