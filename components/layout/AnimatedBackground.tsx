/**
 * 배경 — 3개 오브 + 파인 그리드 + 노이즈
 */
export default function AnimatedBackground() {
  return (
    <>
      <div aria-hidden="true" className="mf-bg-base" />
      <div aria-hidden="true" className="mf-bg-orb mf-bg-orb-1" />
      <div aria-hidden="true" className="mf-bg-orb mf-bg-orb-2" />
      <div aria-hidden="true" className="mf-bg-orb mf-bg-orb-3" />
      <div aria-hidden="true" className="mf-bg-grid" />
      <div aria-hidden="true" className="mf-bg-noise" />
    </>
  )
}
