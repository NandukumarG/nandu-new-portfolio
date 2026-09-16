import './portfolio.css';
import { lazy, Suspense, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Tools from './components/Tools';
import Work from './components/Work';
import FullStackSection from './components/FullStackSection';
import Connect from './components/Connect';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { useAmbientMotion } from './hooks/useAmbientMotion';
import { MotionContext } from './hooks/useMotion';
const PortfolioDialog = lazy(() => import('./components/PortfolioDialog'));
export default function Portfolio() {
  const [modal, setModal] = useState(null);
  const [motionPaused, setMotionPaused] = useState(false);
  useAmbientMotion(motionPaused);
  return <MotionContext.Provider value={motionPaused}><div className={`portfolio${motionPaused ? ' motion-paused' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Nav onContact={() => setModal('contact')} />
    <main id="main" tabIndex={-1}>
      <Hero motionPaused={motionPaused} /><Profile /><Tools /><Work onProject={setModal} suspended={Boolean(modal)} />
      <FullStackSection onProject={setModal} />
      <Connect onContact={() => setModal('contact')} motionPaused={motionPaused} />
    </main>
    <Footer motionPaused={motionPaused} onToggleMotion={() => setMotionPaused(v => !v)} />
    <Cursor paused={motionPaused} />
    {modal && <Suspense fallback={<div className="dialog-loading" role="status">Opening…</div>}><PortfolioDialog key={typeof modal === 'string' ? modal : modal.id} modal={modal} onClose={() => setModal(null)} /></Suspense>}
  </div></MotionContext.Provider>;
}
