'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EASE_OUT, EASE_INOUT, SPRING_SNAPPY } from '@/lib/motion';
import { makeRng } from '@/lib/random';
import { useTimeouts } from '@/lib/hooks';
import styles from './CakeScene.module.css';

const CANDLE_COUNT = 4;
const CANDLE_X = [108, 129, 151, 172];

interface CakeSceneProps {
  candlesExtinguished: number[];
  onExtinguishCandle: (index: number) => void;
  onNext: () => void;
}

export function CakeScene({ candlesExtinguished, onExtinguishCandle, onNext }: CakeSceneProps) {
  const { later, clearAll } = useTimeouts();
  const isReducedMotion = useReducedMotion();
  const cakeRef = useRef<HTMLDivElement>(null);
  const [showFlames, setShowFlames] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [candlesEntered, setCandlesEntered] = useState(false);
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const [remainingText, setRemainingText] = useState('');

  const flameRngs = useRef(
    Array.from({ length: CANDLE_COUNT }, (_, i) => makeRng(1000 + i))
  );

  const getFlameVariants = (index: number) => {
    const rng = flameRngs.current[index];
    const duration = 0.25 + rng() * 0.25;
    return {
      flicker: {
        scaleY: 0.9 + rng() * 0.2,
        scaleX: 0.94 + rng() * 0.12,
        rotate: -3 + rng() * 6,
        skewX: -4 + rng() * 8,
      },
      duration,
    };
  };

  const handleCandleTap = (index: number) => {
    if (candlesExtinguished.includes(index)) return;
    onExtinguishCandle(index);
  };

  useEffect(() => {
    later(() => {
      setShowFlames(true);
      later(() => setShowHint(true), 300);
    }, 0.7 + 0.12 * 3 + 0.15 * 4);
  }, []);

  useEffect(() => {
    const remaining = CANDLE_COUNT - candlesExtinguished.length;
    setRemainingText(remaining > 0 ? `${remaining} left` : '');
  }, [candlesExtinguished]);

  useEffect(() => {
    if (candlesExtinguished.length === CANDLE_COUNT && !celebrationTriggered) {
      setCelebrationTriggered(true);
      
      if (!isReducedMotion && cakeRef.current) {
        const rect = cakeRef.current.getBoundingClientRect();
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 35,
          colors: ['#f4a3bd', '#e0527e', '#f5c26b', '#ffffff'],
          origin: { x: rect.left + rect.width / 2 / window.innerWidth, y: rect.top + rect.height / 2 / window.innerHeight },
          zIndex: 100,
          disableForReducedMotion: true,
        });
      }

      later(() => {
        onNext();
      }, 2600);
    }
  }, [candlesExtinguished, celebrationTriggered, isReducedMotion, onNext, later]);

  useEffect(() => {
    return () => {
      clearAll();
      confetti.reset();
    };
  }, [clearAll]);

  const smokePaths = [
    'M0,0 Q10,-20 20,-40 Q30,-60 40,-80',
    'M0,0 Q-10,-20 -20,-40 Q-30,-60 -40,-80',
    'M0,0 Q5,-25 10,-50 Q15,-75 20,-100',
  ];

  return (
    <div className={styles['cake-scene']} ref={cakeRef}>
      <motion.svg
        viewBox="0 0 280 300"
        style={{ width: 'clamp(240px, 62vw, 320px)' }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <defs>
          <linearGradient id="tierBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4b6c8" />
            <stop offset="100%" stopColor="#e48aa6" />
          </linearGradient>
          <linearGradient id="tierMiddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8c8d6" />
            <stop offset="100%" stopColor="#ec9db6" />
          </linearGradient>
          <linearGradient id="tierTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbd9e3" />
            <stop offset="100%" stopColor="#f2aec2" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe28a" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffe28a" />
            <stop offset="70%" stopColor="#ffab40" />
            <stop offset="100%" stopColor="#ffab40" stopOpacity="0" />
          </linearGradient>
          <filter id="glowBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="shadowBlur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="140" cy="275" rx="115" ry="8" fill="rgba(0,0,0,0.08)" filter="url(#shadowBlur)" />

        {/* Plate */}
        <ellipse cx="140" cy="270" rx="125" ry="10" fill="#fff" stroke="#f4b6c8" strokeWidth="2" />

        {/* Bottom tier */}
        <motion.rect
          x="40" y="198" width="200" height="60" rx="14"
          fill="url(#tierBottomGrad)"
          initial={{ y: 222, opacity: 0 }}
          animate={{ y: 198, opacity: 1 }}
          transition={{ delay: 0, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="40" y="198" width="200" height="60" rx="14"
          fill="#fff" fillOpacity="0.25"
          initial={{ y: 222, opacity: 0 }}
          animate={{ y: 198, opacity: 0.25 }}
          transition={{ delay: 0, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="40" y="198" width="200" height="60" rx="14"
          fill="#b0345a" fillOpacity="0.12"
          initial={{ y: 222, opacity: 0 }}
          animate={{ y: 198, opacity: 0.12 }}
          transition={{ delay: 0, duration: 0.5, ease: EASE_OUT }}
        />

        {/* Middle tier */}
        <motion.rect
          x="65" y="148" width="150" height="52" rx="12"
          fill="url(#tierMiddleGrad)"
          initial={{ y: 172, opacity: 0 }}
          animate={{ y: 148, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="65" y="148" width="150" height="52" rx="12"
          fill="#fff" fillOpacity="0.25"
          initial={{ y: 172, opacity: 0 }}
          animate={{ y: 148, opacity: 0.25 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="65" y="148" width="150" height="52" rx="12"
          fill="#b0345a" fillOpacity="0.12"
          initial={{ y: 172, opacity: 0 }}
          animate={{ y: 148, opacity: 0.12 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE_OUT }}
        />

        {/* Top tier */}
        <motion.rect
          x="90" y="108" width="100" height="42" rx="10"
          fill="url(#tierTopGrad)"
          initial={{ y: 132, opacity: 0 }}
          animate={{ y: 108, opacity: 1 }}
          transition={{ delay: 0.24, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="90" y="108" width="100" height="42" rx="10"
          fill="#fff" fillOpacity="0.25"
          initial={{ y: 132, opacity: 0 }}
          animate={{ y: 108, opacity: 0.25 }}
          transition={{ delay: 0.24, duration: 0.5, ease: EASE_OUT }}
        />
        <motion.rect
          x="90" y="108" width="100" height="42" rx="10"
          fill="#b0345a" fillOpacity="0.12"
          initial={{ y: 132, opacity: 0 }}
          animate={{ y: 108, opacity: 0.12 }}
          transition={{ delay: 0.24, duration: 0.5, ease: EASE_OUT }}
        />

        {/* Frosting */}
        <motion.path
          d="M40,200 Q50,185 60,200 Q70,185 80,200 Q90,185 100,200 Q110,185 120,200 Q130,185 140,200 Q150,185 160,200 Q170,185 180,200 Q190,185 200,200 Q210,185 220,200 Q230,185 240,200"
          stroke="#fff7f2" strokeWidth="3" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        <motion.path
          d="M65,150 Q75,135 85,150 Q95,135 105,150 Q115,135 125,150 Q135,135 145,150 Q155,135 165,150 Q175,135 185,150 Q195,135 205,150"
          stroke="#fff7f2" strokeWidth="3" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.3 }}
        />
        <motion.path
          d="M90,110 Q100,95 110,110 Q120,95 130,110 Q140,95 150,110 Q160,95 170,110 Q180,95 190,110"
          stroke="#fff7f2" strokeWidth="3" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.74, duration: 0.3 }}
        />

        {/* Sprinkles */}
        {[45, 65, 85, 105, 125, 145, 165, 185].map((x, i) => (
          <motion.circle
            key={i}
            cx={x} cy={220}
            r={3}
            fill={i % 2 === 0 ? '#f5c26b' : '#b0345a'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
          />
        ))}

        {/* Pearls */}
        {[70, 90, 110, 130, 150, 170, 190].map((x, i) => (
          <motion.circle
            key={i}
            cx={x} cy={148}
            r={4}
            fill="#fff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 + i * 0.04, duration: 0.3 }}
          />
        ))}

        {/* Cherry */}
        <motion.circle
          cx="140" cy="95"
          r="8"
          fill="#e0527e"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.74, duration: 0.3 }}
        />

        {/* Candles */}
        {CANDLE_X.map((x, i) => (
          <g key={i}>
            <motion.g
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.08, opacity: 1 }}
              transition={{ delay: 0.7 + 0.12 * 3 + 0.15 * i, duration: 0.3, ...SPRING_SNAPPY }}
            >
              {/* Candle body */}
              <rect
                x={x - 4} y="70"
                width="8" height="38"
                fill="url(#candleGrad)"
              />
              <defs>
                <linearGradient id={`candleGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="50%" stopColor="#f4b6c8" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
              </defs>

              {/* Wick */}
              <line
                x1={x} y1="70" x2={x} y2="62"
                stroke="#333" strokeWidth="2"
              />

              {/* Flame */}
              {showFlames && !candlesExtinguished.includes(i) && !isReducedMotion && (
                <>
                  <motion.circle
                    cx={x} cy="52"
                    r="18"
                    fill="#ffab40"
                    fillOpacity="0.35"
                    filter="url(#glowBlur)"
                    animate={{ opacity: [0.45, 0.8, 0.45] }}
                    transition={{ duration: 2, repeat: Infinity, ease: EASE_INOUT }}
                  />
                  <motion.path
                    d={`M${x},44 Q${x - 6},52 ${x},62 Q${x + 6},52 ${x},44`}
                    fill="url(#flameGrad)"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: 1,
                      opacity: 1,
                      ...(isReducedMotion ? {} : getFlameVariants(i).flicker),
                    }}
                    transition={{
                      duration: 0.3,
                      ...(isReducedMotion ? {} : {
                        repeat: Infinity,
                        repeatType: 'mirror' as const,
                        ease: EASE_INOUT,
                      }),
                    }}
                  />
                </>
              )}

              {/* Ember */}
              {candlesExtinguished.includes(i) && (
                <motion.circle
                  cx={x} cy="60"
                  r="3"
                  fill="#ffab40"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0, fill: '#333' }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Smoke */}
              {candlesExtinguished.includes(i) && !isReducedMotion && (
                smokePaths.map((path, j) => (
                  <motion.path
                    key={j}
                    d={path}
                    transform={`translate(${x}, 50)`}
                    stroke="#b9a9b0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#shadowBlur)"
                    initial={{ pathLength: 0.1, opacity: 0.7, y: 0, x: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: 0,
                      y: -50,
                      x: (j % 2 === 0 ? 1 : -1) * (8 + j * 2),
                    }}
                    transition={{ duration: 1.4, delay: j * 0.18, ease: EASE_OUT }}
                  />
                ))
              )}
            </motion.g>

            {/* Invisible hit area */}
            <button
              aria-label={`Blow out candle ${i + 1}`}
              onClick={() => handleCandleTap(i)}
              style={{
                position: 'absolute',
                left: `${x - 22}px`,
                top: '40px',
                width: '44px',
                height: '72px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          </g>
        ))}
      </motion.svg>

      {/* Celebration glow */}
      {celebrationTriggered && (
        <motion.div
          className={styles['celebration-glow']}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
      )}

      {/* Hint text */}
      <motion.p
        className={styles['cake-hint']}
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {celebrationTriggered ? (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
          >
            Make a wish… ✨
          </motion.span>
        ) : (
          <>
            Tap each candle to blow it out ✦
            {remainingText && (
              <motion.span
                className={styles['remaining-count']}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {remainingText}
              </motion.span>
            )}
          </>
        )}
      </motion.p>
    </div>
  );
}
