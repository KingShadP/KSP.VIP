import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TAROT_CARDS = [
  { name: "THE FOOL", desc: "Infinite Potential" },
  { name: "THE MAGICIAN", desc: "Willpower & Creation" },
  { name: "THE HIGH PRIESTESS", desc: "Intuition & Mystery" },
  { name: "THE EMPEROR", desc: "Authority & Structure" },
  { name: "THE TOWER", desc: "Sudden Upheaval" },
  { name: "THE STAR", desc: "Hope & Inspiration" },
  { name: "THE WORLD", desc: "Completion & Wholeness" },
  { name: "THE CHARIOT", desc: "Victory & Will" },
  { name: "STRENGTH", desc: "Courage & Focus" },
  { name: "DEATH", desc: "Endings & Beginnings" },
];

export default function TarotReveal() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [asking, setAsking] = useState(false);
  const [sequence, setSequence] = useState<'idle' | 'blackout' | 'spotlight' | 'title1' | 'title2' | 'drumroll' | 'reveal'>('idle');
  const [card, setCard] = useState(TAROT_CARDS[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedCardName, setSavedCardName] = useState<string | null>(null);

  useEffect(() => {
    const revealed = sessionStorage.getItem('tarotRevealed');
    const name = sessionStorage.getItem('tarotCardName');
    if (revealed) {
      setHasRevealed(true);
      if (name) setSavedCardName(name);
    }
  }, []);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    sessionStorage.setItem('tarotRevealed', 'true');
    sessionStorage.setItem('tarotCardName', card.name);
    setSavedCardName(card.name);
    setHasRevealed(true);
  };

  const handleHover = () => {
    if (hasRevealed || sequence !== 'idle') return;
    setIsHovered(true);
  };

  const handleLeave = () => {
    if (sequence === 'idle' && !asking) {
      setIsHovered(false);
    }
  };

  const audioCtxRef = useRef<AudioContext | null>(null);

  const startSequence = () => {
    // Initialize Audio Context on user gesture to avoid autoplay block
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {}

    setAsking(false);
    setIsHovered(false);
    setCard(TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)]);
    setSequence('blackout');
    
    // Play sequence
    setTimeout(() => {
      setSequence('spotlight');
      setTimeout(() => {
        setSequence('title1');
        setTimeout(() => {
          setSequence('title2');
          setTimeout(() => {
            setSequence('drumroll');
            playDrumroll();
            setTimeout(() => {
              setSequence('reveal');
              playBoom();
            }, 6000); // drumroll duration
          }, 4000); // title2 duration
        }, 5000); // title1 duration
      }, 4000); // spotlight duration
    }, 4000); // blackout duration
  };

  const playDrumroll = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(30, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 6);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 6);
    } catch (e) {}
  };

  const playBoom = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 2);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 2);
    } catch (e) {}
  };

  return (
    <>
      <div 
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div className="font-serif text-[12px] md:text-[14px] text-platinum tracking-[0.4em] uppercase font-bold opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap">
          {savedCardName || "KingShadP"}
        </div>
        
        <AnimatePresence>
          {isHovered && !hasRevealed && sequence === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-8 flex flex-col items-center bg-obsidian/95 border border-antique-gold/30 p-4 w-[200px]"
            >
              <span className="font-sans text-[9px] text-antique-gold tracking-widest uppercase mb-4 text-center">
                A reading awaits.
              </span>
              <button 
                onClick={startSequence}
                className="border border-platinum/40 px-4 py-2 font-serif text-[10px] text-platinum hover:bg-platinum hover:text-obsidian transition-colors uppercase tracking-[0.2em]"
              >
                Unseal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sequence !== 'idle' && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Blackout base */}
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: sequence === 'reveal' ? 0.8 : 1 }}
            transition={{ duration: 2 }}
          />

          <AnimatePresence mode="wait">
            {sequence === 'spotlight' && (
              <motion.div
                key="spotlight"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-radial-[circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_40%]"
              />
            )}

            {sequence === 'title1' && (
              <motion.div
                key="title1"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 2 }}
                className="absolute text-center"
              >
                <h1 className="font-serif text-5xl md:text-7xl text-antique-gold uppercase tracking-[0.3em] font-extrabold shadow-[0_0_40px_rgba(168,135,74,0.3)]">
                  Before We Reveal
                </h1>
              </motion.div>
            )}

            {sequence === 'title2' && (
              <motion.div
                key="title2"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 2 }}
                className="absolute text-center"
              >
                <h1 className="font-serif text-4xl md:text-6xl text-platinum uppercase tracking-[0.4em] font-light shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Allow The Universe To Unseal
                </h1>
              </motion.div>
            )}

            {sequence === 'drumroll' && (
              <motion.div
                key="drumroll"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] }}
                transition={{ opacity: { duration: 1 }, x: { repeat: Infinity, duration: 0.1 }, y: { repeat: Infinity, duration: 0.15 } }}
                className="absolute inset-0 bg-radial-[circle_at_center,_rgba(147,0,10,0.2)_0%,_transparent_70%]"
              />
            )}

            {sequence === 'reveal' && (
              <motion.div
                key="reveal"
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
              >
                {/* Kuzco Boom Flash */}
                <motion.div
                  className="absolute inset-0 bg-white z-0"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  pointerEvents="none"
                />

                <div className="relative z-10 flex flex-col items-center justify-center" style={{ perspective: 1000 }}>
                  <div className="absolute inset-0 bg-antique-gold/20 filter blur-[100px] rounded-full w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] pointer-events-none" />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.1, rotateY: 180, rotateZ: -10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isFlipped ? 1.05 : 1, 
                      rotateY: isFlipped ? 180 : 0, 
                      rotateZ: isFlipped ? 0 : 0 
                    }}
                    transition={isFlipped ? { type: 'spring', stiffness: 40, damping: 20, duration: 2 } : { type: 'spring', stiffness: 50, damping: 10, duration: 2 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-64 md:w-80 h-96 md:h-[450px] cursor-pointer shadow-[0_0_50px_rgba(168,135,74,0.5)]"
                    onClick={handleFlip}
                  >
                    {/* BACK OF CARD (Visually front before flip) */}
                    <div 
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 bg-obsidian border-[3px] border-antique-gold p-4 flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen"
                    >
                      <div className="absolute inset-0 bg-obsidian/90 mix-blend-multiply" />
                      <div className="relative z-10 w-24 h-24 border-2 border-antique-gold/50 rotate-45 flex items-center justify-center">
                        <div className="w-16 h-16 border border-antique-gold/30" />
                      </div>
                      <div className="absolute bottom-12 font-sans text-[9px] text-antique-gold tracking-[0.4em] uppercase animate-pulse">
                        Click to Reveal
                      </div>
                    </div>

                    {/* FRONT OF CARD (Visually back before flip) */}
                    <div 
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      className="absolute inset-0 bg-obsidian border-[3px] border-antique-gold p-4 flex flex-col justify-between items-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-obsidian/80 mix-blend-multiply" />
                      
                      <div className="relative z-10 w-full flex justify-between border-b border-antique-gold/50 pb-2">
                        <span className="font-serif text-antique-gold text-lg">XI</span>
                        <span className="font-serif text-antique-gold text-lg">XI</span>
                      </div>

                      <div className="relative z-10 flex-1 w-full flex items-center justify-center border-x border-antique-gold/20 my-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="w-32 h-32 border border-platinum/40 rounded-full flex items-center justify-center"
                        >
                          <div className="w-24 h-24 border border-antique-gold/60 rounded-none rotate-45" />
                        </motion.div>
                      </div>

                      <div className="relative z-10 w-full flex flex-col items-center border-t border-antique-gold/50 pt-4">
                        <h2 className="font-serif text-2xl md:text-3xl text-platinum tracking-widest uppercase mb-1">
                          {card.name}
                        </h2>
                        <p className="font-sans text-[10px] text-antique-gold tracking-[0.3em] uppercase">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {isFlipped && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={() => setSequence('idle')}
                        className="mt-12 font-sans text-[10px] text-platinum border border-platinum/30 px-8 py-3 uppercase tracking-[0.4em] hover:bg-platinum hover:text-obsidian transition-colors"
                      >
                        Return to Reality
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
