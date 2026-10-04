'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';

interface EnvelopeProps {
  onOpenStart?: () => void;
  onOpened?: () => void;
}

export function Envelope({ onOpenStart, onOpened }: EnvelopeProps) {
  const { later } = useTimeouts();
  const [busy, setBusy] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapRotate, setFlapRotate] = useState(0);
  const [flapZ, setFlapZ] = useState(4);
  const [paperY, setPaperY] = useState(0);
  const [dropped, setDropped] = useState(false);

  const handleOpen = () => {
    if (busy) return;
    setBusy(true);
    onOpenStart?.();
    setSealGone(true);

    later(() => setFlapRotate(-90), 300);
    later(() => {
      setFlapZ(0);
      setFlapRotate(-180);
    }, 650);
    later(() => setPaperY(-110), 1000);
    later(() => {
      setDropped(true);
      onOpened?.();
    }, 1900);
  };

  return (
    <motion.div
      animate={dropped ? { y: 40, opacity: 0.25 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      style={{
        position: 'relative',
        width: 'min(78vw, 320px)',
        margin: '0 auto',
      }}
    >
      {/* 60% of envelope height (aspect 3/2 ⇒ 40% of width) so the open flap is not clipped */}
      <div aria-hidden style={{ paddingTop: '40%' }} />

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 2',
          perspective: '900px',
        }}
      >
        {/* z-1 back panel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background: 'linear-gradient(135deg, #f7dbe3 0%, #f0c3d0 100%)',
            borderRadius: '6px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
          }}
        />

        {/* z2 small paper — sits under the pocket so it emerges from inside */}
        <motion.div
          style={{
            position: 'absolute',
            left: '6%',
            top: '8%',
            width: '88%',
            height: '70%',
            zIndex: 2,
            background: '#fffdf8',
            borderRadius: '2px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
          animate={{ y: paperY, rotate: paperY < 0 ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '8%',
                right: '8%',
                top: `${15 + i * 18}%`,
                height: '1px',
                background: 'rgba(167, 28, 69, 0.15)',
              }}
            />
          ))}
        </motion.div>

        {/* z3 front pocket */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            background: 'linear-gradient(135deg, #fcebf0 0%, #f8e1e7 100%)',
            clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)',
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '58%',
              borderRight: '1px solid rgba(167, 28, 69, 0.1)',
              transform: 'skewY(-25deg)',
              transformOrigin: 'top left',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '50%',
              height: '58%',
              borderLeft: '1px solid rgba(167, 28, 69, 0.1)',
              transform: 'skewY(25deg)',
              transformOrigin: 'top right',
            }}
          />
        </div>

        {/* flap: z4 while closed, z0 after passing -90 so it sits behind the paper */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '58%',
            zIndex: flapZ,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
          animate={{ rotateX: flapRotate }}
          transition={{
            duration: 0.35,
            ease: flapRotate === -90 ? [0.55, 0, 1, 1] : [0, 0, 0.2, 1],
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #fcebf0 0%, #f8e1e7 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: '58%',
                transform: 'translate(-50%, -50%)',
                width: '34px',
                height: '34px',
                background: 'linear-gradient(135deg, #8a2a4a 0%, #641a30 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              animate={sealGone ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fcebf0">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #e8c4d4 0%, #ddb8c8 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              borderRadius: '6px 6px 0 0',
              transform: 'rotateX(180deg)',
            }}
          />
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '10%',
            right: '10%',
            height: '12px',
            zIndex: -1,
            background: 'radial-gradient(ellipse, rgba(224, 82, 126, 0.15) 0%, transparent 70%)',
            filter: 'blur(4px)',
            borderRadius: '50%',
          }}
        />

        {!busy && (
          <motion.button
            onClick={handleOpen}
            aria-label="Open the envelope"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
            whileHover={{ y: -4 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>
    </motion.div>
  );
}
