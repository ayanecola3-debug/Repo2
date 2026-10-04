'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, EASE_INOUT } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';
import { AnimatedName } from './AnimatedName';

interface NameSceneProps {
  recipientName: string;
  onNext: () => void;
}

export function NameScene({ recipientName, onNext }: NameSceneProps) {
  const { later, clearAll } = useTimeouts();
  const isReducedMotion = useReducedMotion();
  const [exitName, setExitName] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const nameLetterCount = recipientName.length;
    const lastLetterDelay = 0.4 + (nameLetterCount - 1) * 0.09 + 0.8;
    const underlineDelay = lastLetterDelay + 0.9;

    later(() => {
      setShowSubtitle(true);
      later(() => setShowButton(true), 600);
    }, underlineDelay);
  }, [recipientName]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setExitName(true);
  };

  const handleExited = () => {
    clearAll();
    onNext();
  };

  return (
    <>
      <motion.div
        className="eyebrow"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        FOR YOU
      </motion.div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <AnimatedName
          name={recipientName}
          delay={0.4}
          loop={!clicked}
          exit={exitName}
          onExited={handleExited}
        />
      </div>
      {showSubtitle && (
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          This little surprise was made just for you...
        </motion.p>
      )}
      {showButton && (
        <motion.button
          className="primary"
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isReducedMotion ? { opacity: 1, scale: 1 } : {
            opacity: 1,
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: isReducedMotion ? 0.5 : 2,
            delay: 0.4,
            ease: EASE_OUT,
            repeat: isReducedMotion ? 0 : Infinity,
            repeatType: 'loop',
          }}
          whileHover={!isReducedMotion ? { scale: 1.03 } : {}}
        >
          Open your surprise
        </motion.button>
      )}
    </>
  );
}
