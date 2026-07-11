import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function TiltCard({ title, key }: { title: string, key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group cursor-pointer relative flex flex-col items-center justify-center p-8 border border-luxury-platinum/10 hover:border-luxury-gold/30 bg-luxury-void/30 backdrop-blur-sm transition-colors duration-500 w-full h-32 md:h-40"
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="w-full h-[1px] bg-luxury-platinum/20 mb-4 group-hover:bg-luxury-gold transition-colors duration-500" 
      />
      <span 
        style={{ transform: "translateZ(50px)" }}
        className="font-serif text-sm md:text-lg uppercase tracking-[0.3em] text-luxury-platinum group-hover:text-luxury-gold transition-colors duration-500"
      >
        {title}
      </span>
    </motion.div>
  );
}
