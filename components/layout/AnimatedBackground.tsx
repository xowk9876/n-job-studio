'use client'

import { motion } from 'framer-motion'

const orbs = [
  {
    color: 'rgba(96, 165, 250, 0.15)',
    size: 600,
    top: '-5%',
    left: '-8%',
    duration: 22,
    xRange: [-40, 60, -20, 40, -40],
    yRange: [0, 50, -30, 60, 0],
  },
  {
    color: 'rgba(52, 211, 153, 0.15)',
    size: 500,
    bottom: '-10%',
    right: '-5%',
    duration: 28,
    xRange: [0, -50, 30, -60, 0],
    yRange: [0, -40, 50, -30, 0],
  },
  {
    color: 'rgba(167, 139, 250, 0.13)',
    size: 450,
    top: '40%',
    right: '15%',
    duration: 18,
    xRange: [0, 40, -50, 30, 0],
    yRange: [0, -60, 20, -40, 0],
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
          key={i}
          animate={{
            x: orb.xRange,
            y: orb.yRange,
          }}
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
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
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
