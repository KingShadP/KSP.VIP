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

export default function App() {
  const [bootloaded, setBootloaded] = useState(false);
  
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
      <Bootloader onComplete={() => setBootloaded(true)} />
      
      {bootloaded && (
        <>
          <VirtualKingdomBackground theme="imperial" />
          <FlashlightReveal />
          <TrackingReticle />
          <DiagnosticHUD />
          <TarotReveal />
          <SceneTransitionDust activeScene={activeScene} />

          <div className="fixed inset-0 pointer-events-none z-[10]">
            
            {/* SCENE 01 — THE ARTIST (Imagery Dominance 35%) */}
            <SceneLayer index={1} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-[center_top] opacity-60 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-b from-luxury-void/20 via-transparent to-luxury-void" />
              <h1 className="font-serif text-6xl md:text-9xl text-luxury-platinum uppercase tracking-widest font-extralight mix-blend-difference z-10 text-center drop-shadow-2xl mt-48">
                KingShadP
              </h1>
            </SceneLayer>

            {/* SCENE 02 — THE HEARTBEAT (Music 25%) */}
            <SceneLayer index={2} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col md:flex-row items-center justify-center px-10 md:px-32 gap-12 md:gap-32">
              <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-luxury-gold/30 flex items-center justify-center overflow-hidden animate-[spin_10s_linear_infinite] shadow-[0_0_40px_rgba(168,135,74,0.1)]">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop')] bg-cover mix-blend-overlay opacity-60 grayscale" />
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
                  The Heartbeat
                </h2>
                <h3 className="font-serif text-4xl md:text-6xl text-luxury-platinum uppercase tracking-widest font-light">
                  Music
                </h3>
                <p className="font-sans text-[10px] md:text-xs text-luxury-platinum/50 mt-6 leading-loose tracking-[0.3em] uppercase">
                  Studio sessions. Waveforms. The sovereign state of sound.
                </p>
              </div>
            </SceneLayer>

            {/* SCENE 03 — THE WORLD (Fashion Campaigns 15%) */}
            <SceneLayer index={3} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex items-center justify-center px-10">
              <div className="flex w-full max-w-6xl h-[70vh] gap-4 md:gap-12 relative">
                <div className="hidden md:block w-1/3 h-full relative border border-luxury-gold/10 p-2 bg-luxury-void/50 backdrop-blur-md">
                   <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" alt="Fashion Editorial 1" className="w-full h-full object-cover grayscale opacity-80" />
                   <div className="absolute bottom-6 left-6 font-mono text-[8px] text-luxury-gold tracking-[0.4em]">ARCHIVE / 01</div>
                </div>
                <div className="w-full md:w-2/3 h-full relative border border-luxury-gold/30 p-4 bg-luxury-void/80 backdrop-blur-xl shadow-2xl overflow-hidden pointer-events-auto cursor-pointer group">
                   <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop" alt="Fashion Editorial 2" className="w-full h-full object-cover grayscale sepia-[0.1] opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                   <div className="absolute bottom-10 left-10 text-luxury-platinum mix-blend-difference pointer-events-none">
                     <div className="font-serif text-4xl md:text-6xl uppercase tracking-widest drop-shadow-lg">FW / 25</div>
                     <div className="font-sans text-[10px] tracking-[0.5em] mt-4 text-luxury-gold drop-shadow-md">CAMPAIGN EDITORIAL</div>
                   </div>
                </div>
              </div>
            </SceneLayer>

            {/* SCENE 04 — THE MARKS (Typography & Signature 14%) */}
            <SceneLayer index={4} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center">
              <div className="font-serif text-[25vw] leading-none text-luxury-platinum/5 tracking-tighter mix-blend-screen pointer-events-none select-none">
                KSP
              </div>
              <div className="absolute flex flex-col items-center">
                <div className="w-16 h-16 border-t-[1px] border-l-[1px] border-luxury-gold mb-12 opacity-50" />
                <h2 className="font-serif text-3xl md:text-5xl text-luxury-platinum uppercase tracking-[0.4em] font-light text-center leading-relaxed">
                  A Signature <br/><span className="text-luxury-gold italic">Established</span>
                </h2>
                <div className="w-16 h-16 border-b-[1px] border-r-[1px] border-luxury-gold mt-12 opacity-50" />
              </div>
            </SceneLayer>

            {/* SCENE 05 — THE PACING (Light vs Dark 5%) */}
            <SceneLayer index={5} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10">
              <div className="absolute inset-0 bg-luxury-platinum transition-opacity duration-1000 mix-blend-difference opacity-90" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl">
                <h2 className="font-serif text-4xl md:text-7xl uppercase tracking-[0.2em] text-center text-luxury-void leading-tight">
                  The Polish Matters
                </h2>
                <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] mt-12 text-center uppercase font-bold text-luxury-void">
                  Because the pulse beneath it is real.
                </p>
              </div>
            </SceneLayer>

            {/* SCENE 06 — THE ARTIFACTS (Real Artifacts 2%) */}
            <SceneLayer index={6} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10 md:px-20 pointer-events-auto">
              <h2 className="font-sans text-[10px] tracking-[0.5em] text-luxury-gold uppercase mb-16 text-center absolute top-24">
                Real Artifacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-6xl mt-24" style={{ perspective: 1200 }}>
                <TiltCard title="Lyric Sheets" />
                <TiltCard title="Polaroids" />
                <TiltCard title="Cassette Tapes" />
              </div>
            </SceneLayer>

            {/* SCENE 07 — THE SEAL (Giragon 1%) */}
            <SceneLayer index={7} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center pointer-events-auto">
              <div className="w-20 h-20 border-[1px] border-luxury-gold/40 rounded-full flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-2 bg-luxury-gold/10 rounded-full animate-pulse group-hover:bg-luxury-gold/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center font-serif text-lg text-luxury-gold group-hover:scale-110 transition-transform">G</div>
              </div>
              <div className="mt-12 font-sans text-[8px] text-luxury-platinum/40 tracking-[0.5em] uppercase">
                The Giragon Seal
              </div>
            </SceneLayer>

            {/* SCENE 08 — THE GATEWAY (Final Action 1%) */}
            <SceneLayer index={8} scrollYProgress={smoothProgress} activeScene={activeScene} className="flex flex-col items-center justify-center px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,135,74,0.05)_0%,transparent_60%)]" />
              <h2 className="font-serif text-4xl md:text-6xl text-luxury-platinum uppercase tracking-widest mb-16 text-center">
                Enter The Archive
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
