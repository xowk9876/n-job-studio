import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const alt = '연봉 실수령액 계산기'
export const size = { width: 1200, height: 630 }
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: 'linear-gradient(135deg, #0f1c35 0%, #1a3a5c 50%, #0f2b4d 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }} />
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '0 8px 32px rgba(59,130,246,0.4)' }}>
          💰
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <span style={{ fontSize: 64, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, textAlign: 'center' }}>연봉 실수령액 계산기</span>
          <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.65)', fontWeight: 500, textAlign: 'center' }}>2026년 최신 기준 · 4대보험·소득세 자동 계산</span>
        </div>
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #60a5fa, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 'bold', color: '#fff' }}>₩</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>머니핏 계산기</span>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }}>n-job-studio.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
