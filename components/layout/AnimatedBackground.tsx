'use client'

import { motion } from 'framer-motion'

const orbs = [
  {
    // 블루 — 좌상단
    color: 'rgba(96, 165, 250, 0.22)',
    size: 700,
    top: '-15%',
    left: '-12%',
    duration: 24,
    xRange: [-30, 50, -10, 40, -30],
    yRange: [0, 40, -25, 50, 0],
  },
  {
    // 바이올렛 — 우하단
    color: 'rgba(139, 92, 246, 0.18)',
    size: 600,
    bottom: '-18%',
    right: '-10%',
    duration: 30,
    xRange: [0, -40, 25, -50, 0],
    yRange: [0, -35, 40, -25, 0],
  },
]

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          animate={{ x: orb.xRange, y: orb.yRange }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
            filter: 'blur(90px)',
            willChange: 'transform',
            top: orb.top,
            left: orb.left,
            bottom: (orb as any).bottom,
            right: (orb as any).right,
          }}
        />
      ))}
    </div>
  )
}
