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

/* ── 그라데이션 오브 설정 ── */
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

/* ── 플로팅 아이콘 설정 ── */
const floatingIcons = [
  { Icon: TrendingUp,       size: 52, top: '8%',  left: '6%',  duration: 14, delay: 0    },
  { Icon: BarChart2,        size: 44, top: '18%', left: '82%', duration: 18, delay: 2    },
  { Icon: PieChart,         size: 38, top: '55%', left: '4%',  duration: 16, delay: 4    },
  { Icon: TrendingDown,     size: 48, top: '72%', left: '75%', duration: 20, delay: 1    },
  { Icon: DollarSign,       size: 56, top: '33%', left: '50%', duration: 13, delay: 3    },
  { Icon: Calculator,       size: 36, top: '80%', left: '20%', duration: 17, delay: 5    },
  { Icon: Percent,          size: 42, top: '12%', left: '38%', duration: 22, delay: 2.5  },
  { Icon: Landmark,         size: 50, top: '62%', left: '88%', duration: 15, delay: 6    },
  { Icon: CandlestickChart, size: 40, top: '45%', left: '15%', duration: 19, delay: 1.5  },
  { Icon: Banknote,         size: 46, top: '90%', left: '58%', duration: 12, delay: 3.5  },
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

      {/* ── 플로팅 금융 아이콘 ── */}
      {floatingIcons.map(({ Icon, size, top, left, duration, delay }, i) => (
        <motion.div
          key={`icon-${i}`}
          animate={{ y: [-12, 12, -12] }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top,
            left,
            opacity: 0.055,
            color: 'white',
            willChange: 'transform',
          }}
        >
          <Icon width={size} height={size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  )
}
