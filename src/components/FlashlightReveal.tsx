import React, { useEffect, useState } from 'react';

export default function FlashlightReveal() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[40]">
      {/* 
        We use a clip-path or a mask to reveal the gold-circuit underlay.
        We'll use standard CSS radial-gradient mask.
      */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1600&auto=format&fit=crop')`, // gold circuit texture approximation
          maskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, black 0%, transparent 100%)`,
          filter: 'contrast(1.5) sepia(1) hue-rotate(5deg) saturate(2) brightness(0.6)',
        }}
      />
    </div>
  );
}
