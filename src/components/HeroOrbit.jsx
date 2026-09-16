import HeroPlanet3D from './HeroPlanet3D';
import './HeroOrbit.css';

export default function HeroOrbit({ paused = false }) {
  return (
    <div className="hero-orbit-window" aria-hidden="true">
      {/* 3D Celestial Orbital System with hardware acceleration */}
      <HeroPlanet3D paused={paused} />
    </div>
  );
}
