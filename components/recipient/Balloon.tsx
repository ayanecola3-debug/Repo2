'use client';
import { motion } from 'framer-motion';

interface BalloonProps {
  color: { base: string; light: string; dark: string };
  size: number;
  id?: string;
}

const PALETTE = [
  { base: '#f0628f', light: '#f8a5c0', dark: '#c4406e' },
  { base: '#ff8a73', light: '#ffbca9', dark: '#e85a45' },
  { base: '#b69cf0', light: '#d4c2f7', dark: '#8a6ad4' },
  { base: '#7ed6b2', light: '#b2ebd6', dark: '#4db688' },
  { base: '#f5c26b', light: '#f9de9c', dark: '#d49a3d' },
  { base: '#7cc4f0', light: '#b2dcf7', dark: '#4a9ad8' },
];

export function Balloon({ color, size, id }: BalloonProps) {
  const gradId = `balloon-grad-${id ?? color.base.replace('#', '')}`;
  return (
    <svg
      width={size}
      height={size * 1.56}
      viewBox="0 0 100 156"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color.light} />
          <stop offset="50%" stopColor={color.base} />
          <stop offset="100%" stopColor={color.dark} />
        </radialGradient>
      </defs>
      {/* Body */}
      <path
        d="M50 4 C78 4 96 26 96 52 C96 80 72 104 50 108 C28 104 4 80 4 52 C4 26 22 4 50 4 Z"
        fill={`url(#${gradId})`}
      />
      {/* Highlight */}
      <ellipse
        cx="28"
        cy="32"
        rx="4.5"
        ry="8"
        fill="white"
        opacity="0.45"
        transform="rotate(-25, 28, 32)"
      />
      {/* Knot */}
      <path
        d="M46 106 L54 106 L52 112 L48 112 Z"
        fill={color.dark}
      />
      {/* String */}
      <path
        d="M50 112 Q50 132 50 152"
        stroke="#c9b8bf"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function getBalloonColor(index: number) {
  return PALETTE[index % PALETTE.length];
}
