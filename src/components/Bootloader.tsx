import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BootloaderProps {
  onComplete: () => void;
}

export default function Bootloader({ onComplete }: BootloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    // Check repeat visit
    const hasVisited = sessionStorage.getItem('hasVisitedKSP');
    if (hasVisited) {
      setIsShort(true);
    } else {
      sessionStorage.setItem('hasVisitedKSP', 'true');
    }

    const duration = isShort ? 1200 : 2800;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 400); // Wait for exit animation
          }, 200);
          return 100;
        }
        return Math.min(100, prev + (100 / steps));
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, isShort]);

  const p1 = progress > 10;
  const p2 = progress > 25;
  const p3 = progress > 40;
  const p4 = progress > 55;
  const p5 = progress > 70;
  const p6 = progress > 85;
  const p7 = progress > 95;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="bootloader-container"
          initial={{ opacity: 1, scaleY: 1 }}
          exit={{ scaleY: 0, opacity: 0 }} // horizontal aperture exit
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-boot-offwhite origin-center"
        >
          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: progress > 15 ? 1 : 0, filter: progress > 15 ? 'blur(0px)' : 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-serif text-[clamp(38px,12vw,102px)] font-extralight text-deep-obsidian tracking-[-0.02em] uppercase text-center select-none max-w-[620px]"
          >
            KingShadP
          </motion.h1>

          {/* Loading Bar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[44px] w-[148px] md:w-[220px] h-[1px] bg-obsidian/15 overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-obsidian"
            />
          </div>

          {/* Disclaimer Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 0 && progress < 90 ? 0.6 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[80px] text-center w-full"
          >
            <span className="font-sans text-[9px] md:text-[10px] text-deep-obsidian tracking-[0.3em] uppercase opacity-75">
              Entering KingShadP's Space
            </span>
          </motion.div>

          {!isShort && (
            <>
              {/* Top Left */}
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                className="absolute top-6 left-6 font-mono text-[9px] md:text-[11px] leading-[1.45] tracking-[0.08em] opacity-60 text-obsidian text-left"
              >
                <div>SYSTEM / COORDINATE MATRIX</div>
                <div>AXIS CALIBRATION: {progress > 20 ? 'ACTIVE' : 'CHECKING'}</div>
                {progress > 30 && <div>X VECTOR: +004.219</div>}
                {progress > 40 && <div>Y VECTOR: -002.740</div>}
                {progress > 50 && <div>Z DEPTH: +018.402</div>}
              </motion.div>

              {/* Top Right */}
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                className="absolute top-6 right-6 font-mono text-[9px] md:text-[11px] leading-[1.45] tracking-[0.08em] opacity-60 text-obsidian text-right"
              >
                <div>COVENANT STRUCTURE</div>
                <div>PILLAR 01: {p1 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 02: {p2 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 03: {p3 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 04: {p4 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 05: {p5 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 06: {p6 ? 'VERIFIED' : 'CHECKING'}</div>
                <div>PILLAR 07: {p7 ? 'VERIFIED' : 'CHECKING'}</div>
              </motion.div>

              {/* Bottom Left */}
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                className="absolute bottom-6 left-6 font-mono text-[9px] md:text-[11px] leading-[1.45] tracking-[0.08em] opacity-60 text-obsidian text-left"
              >
                <div>SUBHARMONIC ARRAY</div>
                <div>OSC A: {progress > 40 ? '27.5 HZ' : 'CALIBRATING'}</div>
                <div>OSC B: {progress > 60 ? '55.0 HZ' : 'CALIBRATING'}</div>
                <div>OSC C: {progress > 80 ? '110.0 HZ' : 'CALIBRATING'}</div>
                <div>PHASE ALIGNMENT: {progress > 90 ? 'STABLE' : 'CHECKING'}</div>
              </motion.div>

              {/* Bottom Right */}
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                className="absolute bottom-6 right-6 font-mono text-[9px] md:text-[11px] leading-[1.45] tracking-[0.08em] opacity-60 text-obsidian text-right"
              >
                <div>ARCHIVE ACCESS</div>
                <div>IDENTITY LAYER: {progress > 30 ? 'MOUNTED' : 'CHECKING'}</div>
                <div>VISUAL MATRIX: {progress > 50 ? 'MOUNTED' : 'CHECKING'}</div>
                <div>AUDIO ENGINE: {progress > 70 ? 'STANDBY' : 'CHECKING'}</div>
                <div>MYTH SYSTEM: {progress > 95 ? 'SEALED' : 'CHECKING'}</div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
