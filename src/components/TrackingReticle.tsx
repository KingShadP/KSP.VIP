import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function getLuminance(rgbString: string) {
  const match = rgbString.match(/\d+/g);
  if (!match || match.length < 3) return 0;
  const r = parseInt(match[0], 10);
  const g = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

interface TrailElement {
  id: number;
  x: number;
  y: number;
  hoverType: string;
  scale: number;
  rotate: number;
}

export default function TrackingReticle() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [sector, setSector] = useState('S05');
  const [status, setStatus] = useState('ACTIVE');
  const [hoverType, setHoverType] = useState<'default' | 'interactive' | 'text' | 'bright'>('default');
  const [luminance, setLuminance] = useState(0);
  const [trails, setTrails] = useState<TrailElement[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const lastCheckTimeRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    let lastEvent: MouseEvent | null = null;

    const updateReticle = () => {
      if (!lastEvent) return;
      const e = lastEvent;
      
      setPos({ x: e.clientX, y: e.clientY });
      if (!active) setActive(true);
      
      const now = Date.now();
      let newHoverType = hoverType;
      let newLum = luminance;

      // Throttle heavy DOM checks to every 50ms
      if (now - lastCheckTimeRef.current > 50) {
        lastCheckTimeRef.current = now;
        
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        const col = e.clientX < w / 3 ? 1 : e.clientX < (w * 2) / 3 ? 2 : 3;
        const row = e.clientY < h / 3 ? 1 : e.clientY < (h * 2) / 3 ? 2 : 3;
        
        const sectorMap: Record<number, Record<number, string>> = {
          1: { 1: 'S01', 2: 'S04', 3: 'S07' },
          2: { 1: 'S02', 2: 'S05', 3: 'S08' },
          3: { 1: 'S03', 2: 'S06', 3: 'S09' },
        };
        
        setSector(sectorMap[col][row]);
        newHoverType = 'default';
        
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
          const style = window.getComputedStyle(el);
          let colorStr = style.backgroundColor;
          if (colorStr === 'rgba(0, 0, 0, 0)' || colorStr === 'transparent') {
             colorStr = style.color;
          }
          
          newLum = getLuminance(colorStr);
          setLuminance(newLum);

          const tag = el.tagName.toLowerCase();
          const isInteractive = ['a', 'button', 'input'].includes(tag) || el.closest('a') || el.closest('button') || el.closest('.cursor-pointer');
          const isText = ['h1', 'h2', 'h3', 'p', 'span'].includes(tag) || el.closest('h1') || el.closest('h2') || el.closest('h3') || el.closest('p');
          
          if (isInteractive) {
            newHoverType = 'interactive';
          } else if (newLum > 0.8) {
            newHoverType = 'bright';
          } else if (isText) {
            newHoverType = 'text';
          }
          
          setHoverType(newHoverType);
          setStatus(newLum > 0.8 ? 'OVEREXPOSED' : 'ACTIVE');
        }
      }

      const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
      
      if (dist > 35) { // Spawn trails when moving fast
        const currentScale = newHoverType === 'interactive' ? 1.5 : newHoverType === 'text' ? 0.8 : newHoverType === 'bright' ? 1.2 : 1;
        const currentRotate = newHoverType === 'interactive' ? 45 : newHoverType === 'bright' ? 90 : 0;
        
        const id = now + Math.random();
        setTrails(prev => [...prev.slice(-10), { 
            id, 
            x: e.clientX, 
            y: e.clientY, 
            hoverType: newHoverType, 
            scale: currentScale + (newLum * 0.2), 
            rotate: currentRotate 
        }]);
        
        lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
        
        setTimeout(() => {
            setTrails(prev => prev.filter(t => t.id !== id));
        }, 400); // fade out duration
      } else if (now - lastPosRef.current.time > 50) {
        lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      }

      ticking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastEvent = e;
      if (!ticking) {
        requestAnimationFrame(updateReticle);
        ticking = true;
      }
    };

    const handleVirtualMouseMove = (e: Event) => {
      const customEvent = e as CustomEvent;
      // Synthesize a mouse event look-alike using the detail
      const virtualE = {
        clientX: customEvent.detail.x,
        clientY: customEvent.detail.y,
      } as MouseEvent;
      lastEvent = virtualE;
      if (!ticking) {
        requestAnimationFrame(updateReticle);
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('virtualmousemove', handleVirtualMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('virtualmousemove', handleVirtualMouseMove);
    };
  }, [active, hoverType, luminance]);

  if (!active) return null;

  const baseScale = hoverType === 'interactive' ? 1.5 : hoverType === 'text' ? 0.8 : hoverType === 'bright' ? 1.2 : 1;
  const baseOpacity = hoverType === 'default' ? 0.6 : hoverType === 'bright' ? 0.3 : 1;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden mix-blend-difference"
    >
      <AnimatePresence>
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.4, scale: trail.scale }}
            animate={{ opacity: 0, scale: trail.scale * 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-0 left-0"
            style={{
              x: trail.x - 37,
              y: trail.y - 37,
            }}
          >
            <div 
              className="relative w-[74px] h-[74px] flex items-center justify-center"
              style={{
                transform: `rotate(${trail.rotate}deg)`,
              }}
            >
              {trail.hoverType !== 'interactive' && trail.hoverType !== 'bright' && (
                <>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[31px] bg-white/50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-[31px] bg-white/50" />
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] w-[31px] bg-white/50" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[2px] w-[31px] bg-white/50" />
                </>
              )}
              {trail.hoverType === 'interactive' && (
                <div className="w-[40px] h-[40px] border-[2px] border-white/50 rounded-none" />
              )}
              {trail.hoverType === 'bright' && (
                <div className="w-[50px] h-[50px] border-[1px] border-white/50 rounded-full flex items-center justify-center">
                   <div className="w-[4px] h-[4px] bg-white/50 rounded-full" />
                </div>
              )}
              {trail.hoverType === 'text' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[40px] bg-white/50" />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: pos.x - 37,
          y: pos.y - 37,
        }}
        transition={{ type: 'tween', duration: 0 }}
      >
        <motion.div 
          className="relative w-[74px] h-[74px] flex items-center justify-center"
          animate={{
            scale: baseScale + (luminance * 0.2), 
            rotate: hoverType === 'interactive' ? 45 : hoverType === 'bright' ? 90 : 0,
            opacity: baseOpacity - (luminance * 0.2)
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {hoverType !== 'interactive' && hoverType !== 'bright' && (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[31px] bg-white" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-[31px] bg-white" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] w-[31px] bg-white" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[2px] w-[31px] bg-white" />
            </>
          )}

          {hoverType === 'interactive' && (
            <div className="w-[40px] h-[40px] border-[2px] border-white rounded-none" />
          )}

          {hoverType === 'bright' && (
            <div className="w-[50px] h-[50px] border-[1px] border-white rounded-full flex items-center justify-center">
               <div className="w-[4px] h-[4px] bg-white rounded-full" />
            </div>
          )}
          
          {hoverType === 'text' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[40px] bg-white opacity-80" />
          )}

          <AnimatePresence>
            {(hoverType === 'default' || hoverType === 'bright') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-[49px] left-[49px] font-mono text-[9px] text-white tracking-widest whitespace-nowrap opacity-60"
              >
                <div>X +{pos.x.toString().padStart(4, '0')}</div>
                <div>Y -{pos.y.toString().padStart(4, '0')}</div>
                <div>{sector}</div>
                <div>{status}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
