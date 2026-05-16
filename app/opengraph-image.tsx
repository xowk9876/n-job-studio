import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const alt = '머니핏 계산기'
export const size = { width: 1200, height: 630 }
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: 'linear-gradient(135deg, #0f1c35 0%, #1a3a5c 50%, #0f2b4d 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,175,255,0.25) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,224,165,0.15) 0%, transparent 70%)' }} />
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #4d9cf5, #3ee0a5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 32px rgba(107,175,255,0.4)' }}>₩</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <span style={{ fontSize: 60, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, textAlign: 'center' }}>머니핏 계산기</span>
          <span style={{ fontSize: 30, color: 'rgba(255,255,255,0.65)', fontWeight: 500, textAlign: 'center' }}>연봉 · 대출 · 퇴직금 · 적금 · 전월세 · 로또</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {[{e:'💰',l:'연봉'},{e:'🏠',l:'대출'},{e:'💼',l:'퇴직금'},{e:'🐷',l:'적금'},{e:'🏢',l:'전월세'},{e:'🎰',l:'로또'}].map((item,i)=>(
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 24 }}>{item.e}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{item.l}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 18, color: 'rgba(255,255,255,0.4)' }}>n-job-studio.vercel.app</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
