import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0f1c35 40%, #1a2d50 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 글로우 — 에메랄드 */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 560, height: 560,
          background: 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
        }} />
        {/* 배경 글로우 — 사이언 */}
        <div style={{
          position: 'absolute', top: -60, right: -80,
          width: 440, height: 440,
          background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
        }} />
        {/* 배경 글로우 — 바이올렛 */}
        <div style={{
          position: 'absolute', bottom: -120, left: '30%',
          width: 580, height: 420,
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
        }} />
        {/* 화이트 스포트라이트 */}
        <div style={{
          position: 'absolute', top: -80, left: '50%',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.09) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
        }} />

        {/* 컨텐츠 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          padding: '60px 80px',
          zIndex: 1,
        }}>
          {/* 배지 */}
          <div style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 100,
            padding: '10px 24px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 20,
            fontWeight: 700,
            display: 'flex',
          }}>
            ✨ 2026년 최신 세율 자동 반영
          </div>

          {/* 메인 타이틀 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              display: 'flex',
            }}>
              💰 머니핏 계산기
            </div>
            <div style={{
              fontSize: 30,
              color: 'rgba(255,255,255,0.55)',
              textAlign: 'center',
              display: 'flex',
            }}>
              한국 재테크 스마트 계산기 모음
            </div>
          </div>

          {/* 계산기 카드 5개 */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 8,
          }}>
            {[
              { icon: '💼', label: '연봉 실수령액', color: 'rgba(59,130,246,0.25)' },
              { icon: '🏠', label: '대출 이자', color: 'rgba(16,185,129,0.25)' },
              { icon: '📋', label: '퇴직금', color: 'rgba(139,92,246,0.25)' },
              { icon: '🐷', label: '적금 이자', color: 'rgba(245,158,11,0.25)' },
              { icon: '🏢', label: '전월세 전환', color: 'rgba(236,72,153,0.25)' },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{
                background: color,
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 14,
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}>
                <div style={{ fontSize: 28, display: 'flex' }}>{icon}</div>
                <div style={{ fontSize: 15, color: 'white', fontWeight: 700, display: 'flex' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* URL */}
          <div style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.35)',
            marginTop: 4,
            display: 'flex',
          }}>
            n-job-studio.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
