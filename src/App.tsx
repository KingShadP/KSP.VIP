import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Bootloader from './components/Bootloader';
import TrackingReticle from './components/TrackingReticle';
import FlashlightReveal from './components/FlashlightReveal';
import DiagnosticHUD from './components/DiagnosticHUD';
import VirtualKingdomBackground from './components/VirtualKingdomBackground';
import TarotReveal from './components/TarotReveal';
import TiltCard from './components/TiltCard';
import SceneTransitionDust from './components/SceneTransitionDust';
import SceneLayer from './components/SceneLayer';
import MagneticButton from './components/MagneticButton';
import ParallaxBackground from './components/ParallaxBackground';
import GlitchText from './components/GlitchText';
import SpotlightToggle from './components/SpotlightToggle';
import ArchiveTerminal from './components/ArchiveTerminal';
import { Terminal } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [bootloaded, setBootloaded] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [spotlightEnabled, setSpotlightEnabled] = useState(() => {
    const stored = localStorage.getItem('spotlight_enabled');
    return stored !== 'false';
  });

  const [gridMomentum, setGridMomentum] = useState(64);
  const [rotationMass, setRotationMass] = useState(17);
  const [depthCompression, setDepthCompression] = useState(78);

  useEffect(() => {
    localStorage.setItem('spotlight_enabled', String(spotlightEnabled));
  }, [spotlightEnabled]);
  
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeScene, setActiveScene] = useState(1);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const scene = Math.min(8, Math.max(1, Math.ceil(latest * 8)));
      setActiveScene(scene);
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bootloaded) return;
      const vh = window.innerHeight;
      // scroll height is 800vh. total scenes is 8.
      // each scene boundary is at index * vh approx
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextScene = Math.min(activeScene + 1, 8);
        window.scrollTo({ top: (nextScene - 1) * vh, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevScene = Math.max(activeScene - 1, 1);
        window.scrollTo({ top: (prevScene - 1) * vh, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootloaded, activeScene]);

  return (
    <div className="min-h-[800vh] text-luxury-platinum bg-luxury-void selection:bg-luxury-oxblood selection:text-luxury-platinum overflow-x-hidden relative">
      <div className="halftone" />
      <Bootloader onComplete={() => setBootloaded(true)} />
      
      {bootloaded && (
        <>
          {/* Scroll snap anchor points to prevent rapid overscrolling */}
          <div className="absolute top-0 left-0 w-full flex flex-col pointer-events-none z-0">
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
            <div className="h-screen snap-section" />
          </div>

          <VirtualKingdomBackground theme="imperial" gridMomentum={gridMomentum} depthCompression={depthCompression} />
          <FlashlightReveal enabled={spotlightEnabled} />
          <TrackingReticle />

          {/* Top Navigation */}
          <div className="fixed top-0 left-0 right-0 h-16 border-b border-luxury-platinum/10 bg-luxury-void/80 backdrop-blur-md flex items-center justify-between px-10 z-[60] select-none pointer-events-auto">
            <div className="font-mono text-[10px] tracking-[0.2em] text-luxury-platinum uppercase">KingShadP // Archive</div>
            <div className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-luxury-gold uppercase font-semibold">Sovereign Atelier Establishing Sig.</div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-[10px] tracking-[0.2em] text-luxury-platinum/60 uppercase hidden sm:block">Vol. 07</div>
              <button 
                onClick={() => setTerminalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold/10 transition-colors font-mono text-[10px] tracking-widest uppercase cursor-pointer"
              >
                <Terminal className="w-3 h-3" /> Terminal
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-luxury-platinum/10 bg-luxury-void/80 backdrop-blur-md flex items-center justify-between px-10 z-[60] select-none pointer-events-auto">
            <div className="font-mono text-[10px] tracking-[0.2em] text-luxury-platinum/60 uppercase">
              COORD: X+{Math.floor(smoothProgress.get() * 1000)} / Y-{(activeScene * 100) + Math.floor(smoothProgress.get() * 80)}
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-luxury-gold uppercase text-center truncate px-4">
              0{activeScene} // {['THE ARTIST', 'THE HEARTBEAT', 'THE WORLD', 'THE MARK', 'THE PACING', 'THE ARTIFACTS', 'THE SEAL', 'THE GATEWAY'][activeScene - 1]} // Waveforms Restored
            </div>
            <div className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-luxury-platinum/60 uppercase text-right">
              Giragon Seal © 2026
            </div>
          </div>

          <AnimatePresence>
            {terminalOpen && <ArchiveTerminal onClose={() => setTerminalOpen(false)} />}
          </AnimatePresence>


          <DiagnosticHUD 
            spotlightEnabled={spotlightEnabled} 
            onToggleSpotlight={() => setSpotlightEnabled(prev => !prev)} 
            gridMom={gridMomentum}
            setGridMom={setGridMomentum}
            rotMass={rotationMass}
            setRotMass={setRotationMass}
            depthComp={depthCompression}
            setDepthComp={setDepthCompression}
          />
          <SpotlightToggle 
            enabled={spotlightEnabled} 
            onToggle={() => setSpotlightEnabled(prev => !prev)} 
          />
          <TarotReveal />
          <SceneTransitionDust activeScene={activeScene} />

          <div className="fixed inset-0 pointer-events-none z-[10]">
            
            {/* SCENE 01 — THE ARTIST (Imagery Dominance 35%) */}
            <SceneLayer index={1} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center lg:pl-80">
              <ParallaxBackground imageUrl="/KingShadP_%20The%20Artist's%20Vision.png" />
              <div className="absolute inset-0 bg-gradient-to-b from-luxury-void/20 via-transparent to-luxury-void" />
              <h1 className="font-serif text-6xl md:text-9xl text-luxury-platinum uppercase tracking-widest font-extralight mix-blend-difference z-10 text-center drop-shadow-2xl mt-48">
                <GlitchText text="KingShadP" isActive={activeScene === 1} />
              </h1>
            </SceneLayer>

            {/* SCENE 02 — THE HEARTBEAT (Music 25%) */}
            <SceneLayer index={2} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col md:flex-row items-center justify-center px-10 md:px-32 gap-12 md:gap-32 lg:pl-80">
              <div 
                className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-luxury-gold/30 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(168,135,74,0.1)] animate-[spin_10s_linear_infinite]"
                style={{ animationDuration: `${Math.max(1, (105 - rotationMass) / 8)}s` }}
              >
                 <div className="absolute inset-0 bg-[url('/07_dynamic_fashion_in_motion.png')] bg-cover mix-blend-overlay opacity-60 grayscale" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_70%)]" />
                 <div className="w-1/4 h-1/4 border-[2px] border-luxury-gold rounded-full bg-luxury-void flex items-center justify-center z-10 shadow-2xl">
                    <span className="font-serif text-[10px] text-luxury-gold tracking-widest">KSP</span>
                 </div>
                 <div className="absolute inset-4 border border-luxury-platinum/10 rounded-full pointer-events-none" />
                 <div className="absolute inset-10 border border-luxury-platinum/10 rounded-full pointer-events-none" />
                 <div className="absolute inset-16 border border-luxury-platinum/10 rounded-full pointer-events-none" />
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
                <h2 className="font-sans text-[10px] tracking-[0.5em] text-luxury-gold uppercase mb-6">
                  <GlitchText text="The Heartbeat" isActive={activeScene === 2} />
                </h2>
                <h3 className="font-serif text-4xl md:text-6xl text-luxury-platinum uppercase tracking-widest font-light">
                  <GlitchText text="Music" isActive={activeScene === 2} delay={150} />
                </h3>
                <p className="font-sans text-[10px] md:text-xs text-luxury-platinum/50 mt-6 leading-loose tracking-[0.3em] uppercase">
                  Studio sessions. Waveforms. The sovereign state of sound.
                </p>
              </div>
            </SceneLayer>

            {/* SCENE 03 — THE WORLD (Fashion Campaigns 15%) */}
            <SceneLayer index={3} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex items-center justify-center px-10 lg:pl-80">
              <div className="flex w-full max-w-6xl h-[70vh] gap-4 md:gap-12 relative">
                <div className="hidden md:block w-1/3 h-full relative border border-luxury-gold/10 p-2 bg-luxury-void/50 backdrop-blur-md">
                   <img src="/03_bold_fashion_with_motion_blur_effect.png" alt="Fashion Editorial 1" className="w-full h-full object-cover grayscale opacity-80" />
                   <div className="absolute bottom-6 left-6 font-mono text-[8px] text-luxury-gold tracking-[0.4em]">ARCHIVE / 01</div>
                </div>
                <div className="w-full md:w-2/3 h-full relative border border-luxury-gold/30 p-4 bg-luxury-void/80 backdrop-blur-xl shadow-2xl overflow-hidden pointer-events-auto cursor-pointer group">
                   <img src="/11_styled_motion_blur_fashion_portrait.png" alt="Fashion Editorial 2" className="w-full h-full object-cover grayscale sepia-[0.1] opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                   <div className="absolute bottom-10 left-10 text-luxury-platinum mix-blend-difference pointer-events-none">
                     <div className="font-serif text-4xl md:text-6xl uppercase tracking-widest drop-shadow-lg"><GlitchText text="FW / 25" isActive={activeScene === 3} /></div>
                     <div className="font-sans text-[10px] tracking-[0.5em] mt-4 text-luxury-gold drop-shadow-md"><GlitchText text="CAMPAIGN EDITORIAL" isActive={activeScene === 3} delay={150} /></div>
                   </div>
                </div>
              </div>
            </SceneLayer>

            {/* SCENE 04 — THE MARKS (Typography & Signature 14%) */}
            <SceneLayer index={4} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center lg:pl-80">
              <div className="font-serif text-[25vw] leading-none text-luxury-platinum/5 tracking-tighter mix-blend-screen pointer-events-none select-none">
                KSP
              </div>
              <div className="absolute flex flex-col items-center">
                <div className="w-16 h-16 border-t-[1px] border-l-[1px] border-luxury-gold mb-12 opacity-50" />
                <h2 className="font-serif text-3xl md:text-5xl text-luxury-platinum uppercase tracking-[0.4em] font-light text-center leading-relaxed flex flex-col items-center">
                  <GlitchText text="A Signature" isActive={activeScene === 4} />
                  <GlitchText text="Established" isActive={activeScene === 4} className="text-luxury-gold italic mt-2" delay={150} />
                </h2>
                <div className="w-16 h-16 border-b-[1px] border-r-[1px] border-luxury-gold mt-12 opacity-50" />
              </div>
            </SceneLayer>

            {/* SCENE 05 — THE PACING (Light vs Dark 5%) */}
            <SceneLayer index={5} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10 lg:pl-80">
              <div className="absolute inset-0 bg-luxury-platinum transition-opacity duration-1000 mix-blend-difference opacity-90" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl">
                <h2 className="font-serif text-4xl md:text-7xl uppercase tracking-[0.2em] text-center text-luxury-void leading-tight">
                  <GlitchText text="The Polish Matters" isActive={activeScene === 5} />
                </h2>
                <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] mt-12 text-center uppercase font-bold text-luxury-void">
                  <GlitchText text="Because the pulse beneath it is real." isActive={activeScene === 5} delay={150} />
                </p>
              </div>
            </SceneLayer>

            {/* SCENE 06 — THE ARTIFACTS (Real Artifacts 2%) */}
            <SceneLayer index={6} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10 md:px-20 pointer-events-auto lg:pl-80">
              <h2 className="font-sans text-[10px] tracking-[0.5em] text-luxury-gold uppercase mb-16 text-center absolute top-24">
                <GlitchText text="Real Artifacts" isActive={activeScene === 6} />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-6xl mt-24" style={{ perspective: 1200 }}>
                <TiltCard title="Lyric Sheets" />
                <TiltCard title="Polaroids" />
                <TiltCard title="Cassette Tapes" />
              </div>
            </SceneLayer>

            {/* SCENE 07 — THE SEAL (Giragon 1%) */}
            <SceneLayer index={7} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center pointer-events-auto lg:pl-80">
              <div className="w-20 h-20 border-[1px] border-luxury-gold/40 rounded-full flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-2 bg-luxury-gold/10 rounded-full animate-pulse group-hover:bg-luxury-gold/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center font-serif text-lg text-luxury-gold group-hover:scale-110 transition-transform">G</div>
              </div>
              <div className="mt-12 font-sans text-[8px] text-luxury-platinum/40 tracking-[0.5em] uppercase">
                <GlitchText text="The Giragon Seal" isActive={activeScene === 7} />
              </div>
            </SceneLayer>

            {/* SCENE 08 — THE GATEWAY (Final Action 1%) */}
            <SceneLayer index={8} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10 lg:pl-80">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,135,74,0.05)_0%,transparent_60%)]" />
              <h2 className="font-serif text-4xl md:text-6xl text-luxury-platinum uppercase tracking-widest mb-16 text-center">
                <GlitchText text="Enter The Archive" isActive={activeScene === 8} />
              </h2>
              <div className="flex flex-col sm:flex-row gap-8">
                <MagneticButton glowColor="gold" className="px-12 py-5">
                  Listen Now
                </MagneticButton>
                <MagneticButton glowColor="platinum" className="px-12 py-5">
                  Join The World
                </MagneticButton>
              </div>
              <div className="absolute bottom-12 font-mono text-[9px] text-luxury-gold/50 tracking-[0.5em] uppercase text-center">
                Access Granted
              </div>
            </SceneLayer>

          </div>
          
          {/* Chapter Indicator */}
          <div className="fixed bottom-12 left-12 font-sans text-[9px] tracking-[0.3em] text-luxury-platinum uppercase z-[50]">
            0{activeScene} / {
              ['THE ARTIST', 'THE HEARTBEAT', 'THE WORLD', 'THE MARK', 'THE PACING', 'THE ARTIFACTS', 'THE SEAL', 'THE GATEWAY'][activeScene - 1]
            }
          </div>
        </>
      )}
    </div>
  );
}
