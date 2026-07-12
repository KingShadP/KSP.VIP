import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function TiltCard({ title, key }: { title: string, key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const [isHovered, setIsHovered] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springPointerX = useSpring(pointerX, { stiffness: 300, damping: 25 });
  const springPointerY = useSpring(pointerY, { stiffness: 300, damping: 25 });

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
    
    pointerX.set(mouseX);
    pointerY.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group cursor-pointer relative flex flex-col items-center justify-center p-8 border border-luxury-platinum/10 hover:border-luxury-gold/50 bg-luxury-void/30 backdrop-blur-md transition-colors duration-500 w-full h-32 md:h-48 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: useTransform(
            [springPointerX, springPointerY],
            ([px, py]) => `radial-gradient(circle 120px at ${px}px ${py}px, rgba(168,135,74,0.15), transparent 70%)`
          ),
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="w-full h-[1px] bg-luxury-platinum/20 mb-4 group-hover:bg-luxury-gold transition-colors duration-500 z-10" 
      />
      <span 
        style={{ transform: "translateZ(50px)" }}
        className="font-serif text-sm md:text-xl uppercase tracking-[0.3em] text-luxury-platinum group-hover:text-luxury-gold transition-colors duration-500 z-10 drop-shadow-md"
      >
        {title}
      </span>
      <div 
        style={{ transform: "translateZ(20px)" }}
        className="absolute bottom-6 font-mono text-[8px] tracking-widest text-luxury-gold/0 group-hover:text-luxury-gold/60 transition-colors duration-700 z-10"
      >
        EXAMINE // 00{Math.floor(Math.random() * 9) + 1}
      </div>
    </motion.div>
  );
}
