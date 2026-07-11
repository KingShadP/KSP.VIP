import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface SceneLayerProps {
  index: number;
  scrollYProgress: MotionValue<number>;
  activeScene: number;
  className?: string;
  children: React.ReactNode;
}

export default function SceneLayer({ index, scrollYProgress, activeScene, className = "", children }: SceneLayerProps) {
  const start = (index - 1) / 8;
  const end = index / 8;
  
  const fadeInStart = Math.max(0, start - 0.02);
  const fadeInEnd = start + 0.06;
  const fadeOutStart = end - 0.06;
  const fadeOutEnd = Math.min(1, end + 0.02);

  const opacity = useTransform(
    scrollYProgress, 
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], 
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    scrollYProgress, 
    [fadeInStart, fadeOutEnd], 
    [0.95, 1.05]
  );

  return (
    <motion.div 
      style={{ opacity, scale }}
      className={`absolute inset-0 ${className} ${activeScene === index ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'}`}
    >
      {children}
    </motion.div>
  );
}
