import React, { useEffect, useState, useRef } from 'react';

export default function FlashlightReveal() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const posRef = useRef({ x: -1000, y: -1000 });
  const isLockedRef = useRef(false);

  useEffect(() => {
    // Start at center
    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setPos({ ...posRef.current });

    const handleMouseMove = (e: MouseEvent) => {
      if (isLockedRef.current) {
        posRef.current.x += e.movementX;
        posRef.current.y += e.movementY;
        
        // Clamp to window bounds
        posRef.current.x = Math.max(0, Math.min(window.innerWidth, posRef.current.x));
        posRef.current.y = Math.max(0, Math.min(window.innerHeight, posRef.current.y));
      } else {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
      
      setPos({ ...posRef.current });
      
      // Dispatch virtual mouse event so other components can track the locked pointer
      if (isLockedRef.current) {
        const virtualEvent = new CustomEvent('virtualmousemove', {
          detail: { x: posRef.current.x, y: posRef.current.y, originalEvent: e }
        });
        window.dispatchEvent(virtualEvent);
      }
    };

    const handlePointerLockChange = () => {
      isLockedRef.current = !!document.pointerLockElement;
    };

    const handleDoubleClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock();
      } else {
        document.exitPointerLock();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('dblclick', handleDoubleClick);
    };
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
      <div className="absolute top-12 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.4em] text-luxury-gold uppercase opacity-50 z-50">
         {isLockedRef.current ? "FOCUS LOCKED (ESC TO RELEASE)" : "DBL-CLICK TO LOCK FOCUS"}
      </div>
    </div>
  );
}
