import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function ParallaxBackground({ imageUrl, className }: { imageUrl: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const translateX = useTransform(springX, [-0.5, 0.5], ['-3%', '3%']);
  const translateY = useTransform(springY, [-0.5, 0.5], ['-3%', '3%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set(e.clientX / w - 0.5);
      mouseY.set(e.clientY / h - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className || ''}`} ref={ref}>
      <motion.div
        className="absolute inset-[-5%] bg-cover bg-[center_top] opacity-60 mix-blend-luminosity"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          x: translateX,
          y: translateY,
          scale: 1.05
        }}
      />
    </div>
  );
}
