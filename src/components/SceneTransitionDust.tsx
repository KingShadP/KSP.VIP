import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SceneTransitionDust({ activeScene }: { activeScene: number }) {
  const [bursts, setBursts] = useState<{ id: number, scene: number, direction: number }[]>([]);
  const [prevScene, setPrevScene] = useState(activeScene);

  useEffect(() => {
    if (activeScene !== prevScene) {
      const id = Date.now();
      const direction = activeScene > prevScene ? 1 : -1;
      setBursts(prev => [...prev, { id, scene: activeScene, direction }]);
      setPrevScene(activeScene);
      
      const timeout = setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [activeScene, prevScene]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[35] overflow-hidden">
      <AnimatePresence>
        {bursts.map(burst => (
          <Burst key={burst.id} direction={burst.direction} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Burst({ direction, key }: { direction: number, key?: React.Key }) {
  const particles = Array.from({ length: 45 });
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
    >
      {particles.map((_, i) => {
        const size = Math.random() * 2 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        const yDrift = -direction * (20 + Math.random() * 40);
        const xDrift = (Math.random() - 0.5) * 20;

        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: `${startX}vw`, 
              y: `${startY}vh`,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 0.8, 0.8, 0], 
              x: `${startX + xDrift}vw`,
              y: `${startY + yDrift}vh`,
              scale: [0, 1, 1, 0],
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 2.5 + Math.random() * 1.5, 
              ease: "easeOut" 
            }}
            className="absolute rounded-full"
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: '#A8874A',
              boxShadow: '0 0 4px rgba(168,135,74,0.5)',
              filter: 'blur(0.5px)'
            }}
          />
        );
      })}
    </motion.div>
  );
}
