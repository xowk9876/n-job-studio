'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  DollarSign,
  Calculator,
  Percent,
  Landmark,
  CandlestickChart,
  Banknote,
} from 'lucide-react'

/* ── 그라데이션 오브 ── */
const orbs = [
  {
    color: 'rgba(96, 165, 250, 0.18)',
    size: 650,
    top: '-8%',
    left: '-10%',
    duration: 22,
    xRange: [-40, 60, -20, 40, -40],
    yRange: [0, 50, -30, 60, 0],
  },
  {
    color: 'rgba(52, 211, 153, 0.17)',
    size: 540,
    bottom: '-12%',
    right: '-6%',
    duration: 28,
    xRange: [0, -50, 30, -60, 0],
    yRange: [0, -40, 50, -30, 0],
  },
  {
    color: 'rgba(167, 139, 250, 0.15)',
    size: 480,
    top: '38%',
    right: '12%',
    duration: 18,
    xRange: [0, 40, -50, 30, 0],
    yRange: [0, -60, 20, -40, 0],
  },
]

/* ── 왼쪽 아이콘 — left/top 모두 다르게 흩뿌리기 ── */
const leftIcons = [
  { Icon: TrendingUp,       top:  '8%', left:  '1%', color: '#60a5fa', size: 44, duration: 14, delay: 0   },
  { Icon: BarChart2,        top: '22%', left:  '7%', color: '#34d399', size: 38, duration: 18, delay: 1.5 },
  { Icon: PieChart,         top: '40%', left:  '2%', color: '#a78bfa', size: 40, duration: 16, delay: 3   },
  { Icon: Calculator,       top: '60%', left:  '9%', color: '#f59e0b', size: 36, duration: 20, delay: 0.5 },
  { Icon: Percent,          top: '80%', left:  '3%', color: '#34d399', size: 34, duration: 13, delay: 2   },
]

/* ── 오른쪽 아이콘 — right/top 모두 다르게 흩뿌리기 ── */
const rightIcons = [
  { Icon: Banknote,         top:  '6%', right:  '2%', color: '#f59e0b', size: 44, duration: 17, delay: 1   },
  { Icon: TrendingDown,     top: '25%', right:  '8%', color: '#f87171', size: 40, duration: 15, delay: 2.5 },
  { Icon: CandlestickChart, top: '44%', right:  '1%', color: '#60a5fa', size: 42, duration: 19, delay: 0   },
  { Icon: DollarSign,       top: '63%', right:  '7%', color: '#34d399', size: 38, duration: 12, delay: 3.5 },
  { Icon: Landmark,         top: '82%', right:  '3%', color: '#a78bfa', size: 36, duration: 16, delay: 1   },
]

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ── 그라데이션 오브 ── */}
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

      {/* ── 왼쪽 플로팅 아이콘 ── */}
      {leftIcons.map(({ Icon, top, left, color, size, duration, delay }, i) => (
        <motion.div
          key={`left-${i}`}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top,
            left,
            color,
            opacity: 0.22,
            willChange: 'transform',
            filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        >
          <Icon width={size} height={size} strokeWidth={1.2} />
        </motion.div>
      ))}

      {/* ── 오른쪽 플로팅 아이콘 ── */}
      {rightIcons.map(({ Icon, top, right, color, size, duration, delay }, i) => (
        <motion.div
          key={`right-${i}`}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top,
            right,
            color,
            opacity: 0.22,
            willChange: 'transform',
            filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        >
          <Icon width={size} height={size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  )
}
