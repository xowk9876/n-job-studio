import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '머니핏 재테크 실전 가이드'
export const size = { width: 1200, height: 630 }

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #12131a 0%, #1a2744 55%, #0f2b4d 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(146,156,248,0.22) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #929cf8, #6ea8ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            boxShadow: '0 8px 32px rgba(110,168,255,0.35)',
          }}
        >
          📘
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <span
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            재테크 실전 가이드
          </span>
          <span style={{ fontSize: 26, color: 'rgba(255,255,255,0.62)', fontWeight: 500, textAlign: 'center' }}>
            연봉 · DSR · 퇴직금 · ISA · 전세 · 로또
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 18, color: 'rgba(255,255,255,0.38)' }}>
          머니핏 계산기
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
