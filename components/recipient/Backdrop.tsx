'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { makeRng } from '@/lib/random';

interface BackdropProps {
  step: number;
}

export function Backdrop({ step }: BackdropProps) {
  const PARTICLE_COUNT = 14;
  const PARTICLE_COUNT_MOBILE = 8;

  const [particles, setParticles] = useState<Array<{ top: number; left: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const count = window.innerWidth <= 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
    const rng = makeRng(42);
    const newParticles = Array.from({ length: count }, () => ({
      top: rng() * 100,
      left: rng() * 100,
      size: 3 + rng() * 4,
      delay: -rng() * 8,
      duration: 14 + rng() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="background-particles">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
          animate={{ opacity: document.hidden ? 0 : 0.6 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
