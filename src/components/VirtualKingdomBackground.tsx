import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface VirtualKingdomBackgroundProps {
  theme: 'imperial' | 'alabaster' | 'chrome';
}

export default function VirtualKingdomBackground({ theme }: VirtualKingdomBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get scroll progress of the entire window
  const { scrollYProgress } = useScroll();

  // Define scale/opacity transforms for the portal camera flythrough
  const portalScale = useTransform(scrollYProgress, [0, 0.45], [1, 2.2]);
  const portalOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [0.9, 0.4, 0]);
  const portalBlur = useTransform(scrollYProgress, [0, 0.35], ['0px', '4px']);

  // Dark marble background plate parallax
  const marbleScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const marbleY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // Staged 3D pillars/architectural layers pushing outwards
  const pillarLeftX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-15%"]);
  const pillarRightX = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);
  const pillarScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const pillarOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [0.18, 0.08, 0]);

  // Inner Chamber (reveals itself and scales up to full focus as we go deeper)
  const innerRoomScale = useTransform(scrollYProgress, [0.1, 0.65], [0.85, 1.15]);
  const innerRoomOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75], [0.15, 0.45, 0.9]);
  const innerRoomY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Light sweeps
  const lightSweepX = useTransform(scrollYProgress, [0, 1], ['-50%', '150%']);
  const lightSweepOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.25, 0.05]);

  // Canvas-based drifting dust motes / glowing gold ash particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = -(Math.random() * 0.3 + 0.05); // Extremely slow rise
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update(scrollVelocity: number) {
        this.y += this.speedY - scrollVelocity * 3;
        this.x += this.speedX;

        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
        if (this.y > height) {
          this.y = 0;
        }
        if (this.x < 0 || this.x > width) {
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        // Severe rectangular particles instead of circular orbs to match the strict 90-degree look
        c.rect(this.x, this.y, this.size, this.size * 1.5);
        if (theme === 'imperial') {
          c.fillStyle = `rgba(220, 197, 123, ${this.opacity})`; // Muted gold
        } else if (theme === 'alabaster') {
          c.fillStyle = `rgba(147, 0, 10, ${this.opacity * 0.6})`; // Deep oxblood red particles
        } else {
          c.fillStyle = `rgba(34, 211, 238, ${this.opacity})`; // Cyan future digital particles
        }
        c.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 40 }, () => new Particle());
    let lastScrollY = window.scrollY;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollVelocity = Math.max(-5, Math.min(5, (currentScrollY - lastScrollY) * 0.04));
      lastScrollY = currentScrollY;

      // Dark fog gradient responsive to theme
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.05,
        width / 2,
        height / 2,
        width * 0.75
      );

      if (theme === 'imperial') {
        gradient.addColorStop(0, 'rgba(5, 5, 5, 0)');
        gradient.addColorStop(0.4, 'rgba(147, 0, 10, 0.04)'); // Subtle Oxblood fog hint
        gradient.addColorStop(1, 'rgba(5, 5, 5, 0.98)');
      } else if (theme === 'alabaster') {
        gradient.addColorStop(0, 'rgba(244, 244, 242, 0)');
        gradient.addColorStop(0.4, 'rgba(147, 0, 10, 0.015)'); // Extremely soft ruby glow
        gradient.addColorStop(1, 'rgba(244, 244, 242, 0.96)');
      } else {
        gradient.addColorStop(0, 'rgba(2, 2, 4, 0)');
        gradient.addColorStop(0.4, 'rgba(6, 182, 212, 0.03)'); // Cyber cyan glow
        gradient.addColorStop(1, 'rgba(2, 2, 4, 0.98)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update(scrollVelocity);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden bg-luxury-void z-[-10] select-none pointer-events-none"
      id="virtual-kingdom-bg"
    >
      {/* 1. Deep Space Base Background Gradient */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--color-luxury-oxblood-dark)_0%,_var(--color-luxury-void)_85%]" />

      {/* 1b. Premium Dark Marble Environment Plate (Cinematic backplate) */}
      <motion.div
        style={{
          backgroundImage: theme === 'imperial' 
            ? `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop')` 
            : theme === 'alabaster' 
              ? `url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop')`
              : `url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop')`,
          scale: marbleScale,
          y: marbleY,
        }}
        className={`absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-[0.05] pointer-events-none transition-all duration-1000`}
      />

      {/* 1c. Parallax Columns/Pillars representing entry portal depth (Left & Right Gates) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Left Gate Column */}
        <motion.div
          style={{
            x: pillarLeftX,
            scale: pillarScale,
            opacity: pillarOpacity,
          }}
          className="absolute left-[-10vw] top-[-5vh] bottom-[-5vh] w-[25vw] bg-gradient-to-r from-luxury-void/90 via-luxury-dark/45 to-transparent border-r border-luxury-platinum/5 flex flex-col justify-between p-12"
        >
          <div className="border-t border-l border-luxury-gold/20 h-24 w-12" />
          <div className="font-mono text-[7px] text-luxury-gold/30 tracking-[0.3em] uppercase [writing-mode:vertical-lr]">
            CHAMBER_SECURED // GATEWAY_01
          </div>
          <div className="border-b border-l border-luxury-gold/20 h-24 w-12" />
        </motion.div>

        {/* Right Gate Column */}
        <motion.div
          style={{
            x: pillarRightX,
            scale: pillarScale,
            opacity: pillarOpacity,
          }}
          className="absolute right-[-10vw] top-[-5vh] bottom-[-5vh] w-[25vw] bg-gradient-to-l from-luxury-void/90 via-luxury-dark/45 to-transparent border-l border-luxury-platinum/5 flex flex-col justify-between items-end p-12"
        >
          <div className="border-t border-r border-luxury-gold/20 h-24 w-12" />
          <div className="font-mono text-[7px] text-luxury-gold/30 tracking-[0.3em] uppercase [writing-mode:vertical-lr]">
            CHAMBER_SECURED // GATEWAY_02
          </div>
          <div className="border-b border-r border-luxury-gold/20 h-24 w-12" />
        </motion.div>
      </div>

      {/* 2. Inner Chamber: Severe nested squares instead of circular orbits */}
      <motion.div
        style={{
          scale: innerRoomScale,
          opacity: innerRoomOpacity,
          y: innerRoomY,
        }}
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
      >
        {/* Absolute square wireframe chambers representing minimalist luxury galleries */}
        <div className="absolute w-[75vw] h-[75vw] border border-luxury-platinum/5 scale-90 rounded-none" />
        <div className="absolute w-[55vw] h-[55vw] border border-luxury-platinum/5 scale-75 rounded-none" />
        <div className="absolute w-[35vw] h-[35vw] border border-luxury-gold/10 scale-50 rounded-none" />

        {/* Deep chamber back wall light source (faint gold embers) */}
        <div className="absolute w-80 h-80 bg-radial-[circle,_var(--color-luxury-gold)_0%,_transparent_75%] opacity-15 filter blur-3xl rounded-none" />

        {/* Elegant structural vector elements (lines and grids) */}
        <svg className="absolute w-full h-full stroke-luxury-platinum/10 fill-none" viewBox="0 0 1920 1080">
          <line x1="200" y1="0" x2="200" y2="1080" strokeWidth="0.5" />
          <line x1="1720" y1="0" x2="1720" y2="1080" strokeWidth="0.5" />
          <path d="M 300 0 L 960 540 L 1620 0" strokeWidth="0.5" strokeDasharray="6,6" />
          <path d="M 300 1080 L 960 540 L 1620 1080" strokeWidth="0.5" strokeDasharray="6,6" />
          <rect x="660" y="240" width="600" height="600" strokeWidth="0.5" />
          <rect x="810" y="390" width="300" height="300" strokeWidth="0.5" strokeDasharray="12,6" />
        </svg>
      </motion.div>

      {/* 3. Outer Portal/Gallery Frame - Zero Rounded Corners */}
      <motion.div
        style={{
          scale: portalScale,
          opacity: portalOpacity,
          filter: `blur(${portalBlur})`,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-[85vw] h-[85vh] border border-luxury-gold/20 rounded-none flex items-center justify-center">
          {/* Accent corners: Right angles only */}
          <div className="absolute -top-[1px] -left-[1px] w-12 h-12 border-t border-l border-luxury-platinum" />
          <div className="absolute -top-[1px] -right-[1px] w-12 h-12 border-t border-r border-luxury-platinum" />
          <div className="absolute -bottom-[1px] -left-[1px] w-12 h-12 border-b border-l border-luxury-platinum" />
          <div className="absolute -bottom-[1px] -right-[1px] w-12 h-12 border-b border-r border-luxury-platinum" />

          {/* Subtly lit inner frames */}
          <div className="absolute inset-6 border border-luxury-platinum/10 rounded-none" />
          <div className="absolute inset-16 border border-luxury-platinum/5 rounded-none" />

          {/* Vertical gold hair lines */}
          <div className="absolute top-16 bottom-16 left-8 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent" />
          <div className="absolute top-16 bottom-16 right-8 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent" />

          {/* Golden inscription details inside the portal border */}
          <div className="absolute top-8 left-16 right-16 text-center">
            <span className="font-sans text-[8px] tracking-[0.5em] text-luxury-gold/45 uppercase">
              • THE VERSE • LIVING ARCHIVE • KINGSHADP SOVEREIGN ATELIER •
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4. Drifting Fog & Glowing Ashes Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

      {/* 5. Gold light sweep layer (Dynamic glare) */}
      <motion.div
        style={{
          x: lightSweepX,
          opacity: lightSweepOpacity,
        }}
        className="absolute top-0 bottom-0 w-[45vw] bg-gradient-to-r from-transparent via-luxury-gold/10 to-transparent skew-x-12 mix-blend-overlay pointer-events-none filter blur-2xl"
      />

      {/* 6. Realistic Animated Film Grain Layer */}
      <div className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none bg-repeat bg-center mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 7. Bottom shadow anchor */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-luxury-void via-luxury-void/60 to-transparent pointer-events-none" />
    </div>
  );
}
