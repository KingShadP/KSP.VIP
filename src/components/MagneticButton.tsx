import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'platinum';
}

export default function MagneticButton({ children, className, glowColor = 'gold', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Create a pull effect toward the cursor (20% strength)
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative flex items-center justify-center font-sans text-[10px] tracking-[0.4em] uppercase transition-all duration-300 pointer-events-auto hover-signal-jitter group";
  const glowClasses = glowColor === 'gold' 
    ? "border border-luxury-gold bg-luxury-gold/5 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-void hover:shadow-[0_0_30px_rgba(168,135,74,0.4)]"
    : "border border-luxury-platinum/30 text-luxury-platinum hover:bg-luxury-platinum hover:text-luxury-void";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseClasses} ${glowClasses} ${className || ''}`}
      {...props}
    >
      <span className="relative z-10 transition-colors">
        {children}
      </span>
      {/* Glitch sub-layers */}
      <span className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 mix-blend-difference pointer-events-none aria-hidden" style={{ color: 'red', textShadow: '2px 0 blue' }}>
        {children}
      </span>
    </motion.button>
  );
}
