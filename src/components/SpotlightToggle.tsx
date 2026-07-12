import React from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

interface SpotlightToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SpotlightToggle({ enabled, onToggle }: SpotlightToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed top-6 right-6 z-[100] pointer-events-auto"
    >
      <button
        onClick={onToggle}
        className="group relative flex items-center gap-3 bg-luxury-void/80 backdrop-blur-xl border border-luxury-gold/30 hover:border-luxury-gold px-4 py-2.5 rounded-none transition-all duration-300 shadow-[0_0_20px_rgba(168,135,74,0.05)] hover:shadow-[0_0_25px_rgba(168,135,74,0.15)] cursor-pointer select-none"
        aria-label="Toggle Spotlight Reveal Effect"
      >
        {/* Decorative thin borders/corners for high-end look */}
        <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-luxury-gold opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-luxury-gold opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Dynamic Indicator Dot */}
        <div className="relative flex h-2 w-2">
          {enabled ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-gold"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-platinum/40"></span>
          )}
        </div>

        {/* Icon & Label */}
        <div className="flex items-center gap-2">
          {enabled ? (
            <Eye className="w-3.5 h-3.5 text-luxury-gold transition-colors duration-300" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-luxury-platinum/40 transition-colors duration-300" />
          )}
          
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-luxury-platinum/70 group-hover:text-luxury-platinum transition-colors duration-300">
            {enabled ? "Spotlight: Active" : "Spotlight: Off"}
          </span>
        </div>

        {/* Mini status hint inside the button */}
        <span className="hidden md:inline font-mono text-[7px] text-luxury-gold/50 tracking-widest pl-2 border-l border-luxury-gold/20 uppercase group-hover:text-luxury-gold transition-colors duration-300">
          {enabled ? "ESC to lock focus" : "Vibe restored"}
        </span>
      </button>
    </motion.div>
  );
}
