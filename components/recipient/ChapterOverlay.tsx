'use client';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

interface ChapterOverlayProps {
  chapterTransition: string | null;
  step: number;
}

export function ChapterOverlay({ chapterTransition, step }: ChapterOverlayProps) {
  if (!chapterTransition) return null;

  const [number, title] = chapterTransition.split(':');

  return (
    <motion.div
      className="chapter-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="chapter-content">
        <motion.div
          className="chapter-number"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        >
          0{step + 1}
        </motion.div>
        <motion.div
          className="chapter-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
        >
          {title}
        </motion.div>
        <motion.div
          className="chapter-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}
