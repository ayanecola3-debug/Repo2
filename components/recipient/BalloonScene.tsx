'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_OUT, EASE_INOUT, SPRING_SOFT } from '@/lib/motion';
import { makeRng } from '@/lib/random';
import { useTimeouts } from '@/lib/hooks';
import { Balloon, getBalloonColor } from './Balloon';
import { PopEffects } from './PopEffects';
import confetti from 'canvas-confetti';

interface BalloonSceneProps {
  wishes: string[];
  poppedBalloons: number[];
  onPopBalloon: (index: number) => void;
  onNext: () => void;
}

const TOP_OFFSETS = [0, 28, 8, 34, 14, 40];
const SCALES = [1, 0.9, 1.05, 0.88, 1, 0.92];
const ROTATIONS = [-4, 3, -2, 4, -3, 2];

export function BalloonScene({ wishes, poppedBalloons, onPopBalloon, onNext }: BalloonSceneProps) {
  const { later, clearAll } = useTimeouts();
  const isReducedMotion = useReducedMotion();
  const [activeWish, setActiveWish] = useState<{ wish: string; origin: { x: number; y: number } } | null>(null);
  const [showContinue, setShowContinue] = useState(false);
  const [popping, setPopping] = useState(false);
  const [stretching, setStretching] = useState<number | null>(null);
  const [pops, setPops] = useState<Array<{ id: number; x: number; y: number; color: string; seed: number }>>([]);
  const balloonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const popId = useRef(0);

  const count = wishes.length;
  const size = count <= 4 ? 84 : count <= 8 ? 70 : 58;
  const allPopped = poppedBalloons.length === count;

  useEffect(() => {
    if (poppedBalloons.length > 0 && !showContinue) {
      setShowContinue(true);
    }
  }, [poppedBalloons.length, showContinue]);

  const handlePop = (index: number) => {
    if (popping || activeWish || poppedBalloons.includes(index) || stretching !== null) return;
    setPopping(true);
    setStretching(index);

    const balloonEl = balloonRefs.current[index];
    if (!balloonEl) {
      setPopping(false);
      setStretching(null);
      return;
    }

    const rect = balloonEl.getBoundingClientRect();
    const cardRect = balloonEl.closest('.recipientcard')?.getBoundingClientRect();
    if (!cardRect) {
      setPopping(false);
      setStretching(null);
      return;
    }

    const origin = {
      x: rect.left - cardRect.left + rect.width / 2,
      y: rect.top - cardRect.top + rect.height / 2,
    };

    later(() => {
      const color = getBalloonColor(index);
      const id = ++popId.current;
      setPops(prev => [...prev, { id, x: origin.x, y: origin.y, color: color.base, seed: index }]);

      confetti({
        particleCount: 16,
        spread: 360,
        startVelocity: 18,
        gravity: 0.9,
        ticks: 45,
        scalar: 0.7,
        colors: [color.base],
        shapes: ['circle'],
        zIndex: 100,
        disableForReducedMotion: true,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });

      onPopBalloon(index);
      setStretching(null);
      setActiveWish({ wish: wishes[index], origin });
      setPopping(false);
    }, 120);
  };

  const handleCloseWish = () => {
    setActiveWish(null);
  };

  const rng = makeRng(456);

  return (
    <>
      <motion.div
        className="eyebrow"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        BALLOON WISHES
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT }}
        style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 500, fontFamily: 'Playfair Display, serif', marginBottom: '24px' }}
      >
        Pop a balloon to reveal a wish
      </motion.h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          alignItems: 'flex-end',
          minHeight: count > 6 ? '280px' : '220px',
          gap: '4px',
          position: 'relative',
        }}
      >
        {pops.map(pop => (
          <PopEffects
            key={pop.id}
            x={pop.x}
            y={pop.y}
            color={pop.color}
            seed={pop.seed}
            onDone={() => setPops(prev => prev.filter(p => p.id !== pop.id))}
          />
        ))}
        <AnimatePresence mode="popLayout">
          {wishes.map((_, i) => {
            if (poppedBalloons.includes(i)) return null;

            const color = getBalloonColor(i);
            const marginTop = TOP_OFFSETS[i % TOP_OFFSETS.length];
            const scale = SCALES[i % SCALES.length];
            const baseRotation = ROTATIONS[i % ROTATIONS.length];

            const floatY = (rng() * 8 + 10) * (rng() > 0.5 ? 1 : -1);
            const floatDuration = 3 + rng() * 2;
            const swayDuration = 4 + rng() * 2.5;
            const swayDelay = rng() * 2;

            return (
              <motion.div
                key={i}
                layout
                style={{
                  marginTop: `${marginTop}px`,
                  position: 'relative',
                }}
                initial={{ y: 60, opacity: 0, scale: 0.8 }}
                animate={{
                  y: 0,
                  opacity: activeWish ? 0.4 : 1,
                  scale: activeWish ? 0.9 : scale,
                }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
              >
                <motion.div
                  animate={!isReducedMotion ? {
                    y: [0, -floatY, 0],
                    rotate: [baseRotation - 3, baseRotation + 3, baseRotation - 3],
                  } : {}}
                  transition={!isReducedMotion ? {
                    y: { duration: floatDuration, repeat: Infinity, ease: EASE_INOUT },
                    rotate: { duration: swayDuration, repeat: Infinity, ease: EASE_INOUT, delay: swayDelay },
                  } : {}}
                >
                  <motion.button
                    ref={(el) => { balloonRefs.current[i] = el; }}
                    disabled={popping || !!activeWish}
                    onClick={() => handlePop(i)}
                    aria-label={`Pop balloon ${i + 1}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'block',
                    }}
                    animate={
                      stretching === i && !isReducedMotion
                        ? { scaleX: 1.12, scaleY: 1.15 }
                        : { scaleX: 1, scaleY: 1 }
                    }
                    transition={{ duration: 0.12, ease: EASE_OUT }}
                    whileHover={!isReducedMotion && !activeWish && stretching === null ? { scale: 1.05 } : {}}
                  >
                    <Balloon color={color} size={size} id={`b${i}`} />
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeWish && (
          <motion.div
            className="wish-card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleCloseWish}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <motion.div
              className="wish-card"
              initial={{ scale: 0.2, opacity: 0, x: activeWish.origin.x, y: activeWish.origin.y }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={SPRING_SOFT}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                maxWidth: '90%',
                maxHeight: '70%',
                overflow: 'auto',
                boxShadow: '0 8px 32px rgba(224, 82, 126, 0.2)',
                border: '1px solid #e0527e',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#a45c72',
                  marginBottom: '12px',
                }}
              >
                A WISH FOR YOU
              </div>
              <div
                style={{
                  fontSize: 'clamp(18px, 4.5vw, 24px)',
                  fontFamily: 'Playfair Display, serif',
                  fontStyle: 'italic',
                  color: '#3d2630',
                  lineHeight: 1.6,
                }}
              >
                {activeWish.wish}
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#e0527e"
                style={{ marginTop: '16px' }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                  fontSize: '12px',
                  color: '#987984',
                  marginTop: '16px',
                  cursor: 'pointer',
                }}
              >
                Tap to close
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContinue && (
          <motion.button
            className="primary"
            onClick={onNext}
            initial={{ opacity: 0 }}
            animate={!isReducedMotion ? {
              opacity: 1,
              scale: [1, 1.04, 1],
            } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ...(isReducedMotion ? {} : {
                scale: { duration: 1.8, repeat: Infinity, ease: EASE_INOUT },
              }),
            }}
            style={{ marginTop: '24px' }}
          >
            {allPopped ? 'All wishes found ♥ ' : 'Continue '}
            <motion.span
              animate={!isReducedMotion ? { x: [0, 3, 0] } : {}}
              transition={!isReducedMotion ? { duration: 1.8, repeat: Infinity, ease: EASE_INOUT } : {}}
            >
              →
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
