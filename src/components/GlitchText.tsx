import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface GlitchTextProps {
  text: string;
  isActive: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  delay?: number; // optional delay before starting the effect in ms
}

const GLYPHS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '✦', '⌘', 'Ø', '█', '░', '▒', '▓', '■', '▲', '▼', '•', '⚜', '♔'
];

export default function GlitchText({
  text,
  isActive,
  className = '',
  as = 'span',
  delay = 0,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Split text into individual characters for precise control
  const targetChars = text.split('');

  useEffect(() => {
    // Clear any previous animations
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isActive) {
      // Reset text if it becomes inactive
      setDisplayText(text);
      setIsGlitching(false);
      return;
    }

    const startEffect = () => {
      setIsGlitching(true);
      let step = 0;
      const totalSteps = 25; // 25 animation updates
      const stepInterval = 30; // 30ms per step (~750ms total)

      intervalRef.current = window.setInterval(() => {
        step++;
        const progress = step / totalSteps;

        const updated = targetChars.map((char, index) => {
          if (char === ' ') return ' ';
          
          // Organic lock-in pattern (mix of left-to-right and random chance)
          const charProgress = index / targetChars.length;
          const isLocked = progress > charProgress + (Math.random() * 0.2 - 0.1);

          if (isLocked || progress >= 0.95) {
            return char;
          }

          // Return random glyph
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join('');

        setDisplayText(updated);

        if (step >= totalSteps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayText(text);
          setIsGlitching(false);
        }
      }, stepInterval);
    };

    if (delay > 0) {
      timeoutRef.current = window.setTimeout(startEffect, delay);
    } else {
      startEffect();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, text, delay]);

  const Component = as;

  // Keyframes for the glitching duplicate layers
  const glitchYKeyframes = [0, -2, 2, -1, 1, 0];
  const glitchXKeyframes1 = [0, -4, 3, -2, 4, 0];
  const glitchXKeyframes2 = [0, 4, -3, 2, -4, 0];
  const skewKeyframes = [0, -5, 5, -2, 3, 0];

  return (
    <Component className={`relative inline-block select-none ${className}`}>
      {/* Main Text Base */}
      <span className={isGlitching ? 'opacity-90' : 'opacity-100'}>
        {displayText}
      </span>

      {/* Cyber/Luxury Aberration Layers (Only visible while actively glitching) */}
      {isGlitching && (
        <>
          {/* Gold aberration layer */}
          <motion.span
            className="absolute top-0 left-0 text-luxury-gold pointer-events-none mix-blend-screen opacity-70"
            animate={{
              x: glitchXKeyframes1,
              y: glitchYKeyframes,
              skewX: skewKeyframes,
              clipPath: [
                'inset(0% 0% 0% 0%)',
                'inset(20% 0% 40% 0%)',
                'inset(60% 0% 10% 0%)',
                'inset(40% 0% 50% 0%)',
                'inset(80% 0% 5% 0%)',
                'inset(0% 0% 0% 0%)',
              ],
            }}
            transition={{
              duration: 0.6,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
            }}
          >
            {displayText}
          </motion.span>

          {/* Platinum / Light aberration layer */}
          <motion.span
            className="absolute top-0 left-0 text-luxury-platinum/40 pointer-events-none mix-blend-screen opacity-60"
            animate={{
              x: glitchXKeyframes2,
              y: glitchYKeyframes.map(v => -v),
              skewX: skewKeyframes.map(v => -v),
              clipPath: [
                'inset(10% 0% 80% 0%)',
                'inset(50% 0% 20% 0%)',
                'inset(30% 0% 60% 0%)',
                'inset(70% 0% 30% 0%)',
                'inset(15% 0% 45% 0%)',
                'inset(0% 0% 0% 0%)',
              ],
            }}
            transition={{
              duration: 0.5,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
            }}
          >
            {displayText}
          </motion.span>
        </>
      )}
    </Component>
  );
}
