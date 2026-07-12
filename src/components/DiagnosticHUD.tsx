import React, { useState } from 'react';
import { motion } from 'motion/react';

interface DiagnosticHUDProps {
  spotlightEnabled: boolean;
  onToggleSpotlight: () => void;
}

export default function DiagnosticHUD({ spotlightEnabled, onToggleSpotlight }: DiagnosticHUDProps) {
  const [active, setActive] = useState(false);

  const [gridMom, setGridMom] = useState(64);
  const [rotMass, setRotMass] = useState(42);
  const [depthComp, setDepthComp] = useState(78);
  const [revealRad, setRevealRad] = useState(300);
  const [undCont, setUndCont] = useState(85);

  const renderSlider = (val: number, setVal: (v: number) => void, max: number = 100, isRight = false) => {
    const chars = 14;
    const pos = Math.round((val / max) * chars);
    let str = '[';
    for (let i = 0; i <= chars; i++) {
      if (i === pos) str += '│';
      else str += '─';
    }
    str += ']';

    return (
      <div className={`flex items-center gap-2 text-platinum/50 relative ${isRight ? 'justify-end' : ''}`}>
        <input 
          type="range" 
          min="0" 
          max={max} 
          value={val} 
          onChange={(e) => setVal(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Calibration slider"
        />
        {isRight ? (
          <><span>{val.toString().padStart(3, '0')}</span><span>{str}</span></>
        ) : (
          <><span>{str}</span><span>{val.toString().padStart(3, '0')}</span></>
        )}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[50]"
    >
      {/* Left HUD */}
      <motion.div 
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        animate={{ opacity: active ? 1 : 0.3 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-[148px] font-mono text-[9px] text-platinum tracking-widest space-y-6 pointer-events-auto"
      >
        <div>
          <div className="mb-1">GRID MOMENTUM</div>
          {renderSlider(gridMom, setGridMom)}
        </div>
        <div>
          <div className="mb-1">ROTATION MASS</div>
          {renderSlider(rotMass, setRotMass)}
        </div>
        <div>
          <div className="mb-1">DEPTH COMPRESSION</div>
          {renderSlider(depthComp, setDepthComp)}
        </div>
      </motion.div>

      {/* Right HUD */}
      <motion.div 
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        animate={{ opacity: active ? 1 : 0.3 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-[156px] font-mono text-[9px] text-platinum tracking-widest space-y-6 pointer-events-auto text-right flex flex-col items-end"
      >
        <div className="w-full">
          <div className="mb-1">REVEAL MASK</div>
          <div className="text-platinum/50 flex justify-end">
            <button
              onClick={onToggleSpotlight}
              className={`border px-2 py-0.5 transition-colors cursor-pointer ${
                spotlightEnabled
                  ? 'border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-void font-bold'
                  : 'border-platinum/20 text-platinum/40 hover:bg-platinum hover:text-luxury-void'
              }`}
            >
              {spotlightEnabled ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-1">SPOTLIGHT RADIUS</div>
          {renderSlider(revealRad, setRevealRad, 500, true)}
        </div>
        <div className="w-full">
          <div className="mb-1">UNDERLAY CONTRAST</div>
          {renderSlider(undCont, setUndCont, 100, true)}
        </div>
      </motion.div>
    </div>
  );
}
