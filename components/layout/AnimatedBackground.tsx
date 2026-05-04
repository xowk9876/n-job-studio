/**
 * Midnight Finance — Animated background layers
 * CSS-only, 0 JS. Aurora gradient mesh + fine grid + grain noise.
 */
export default function AnimatedBackground() {
  return (
    <>
      <div aria-hidden="true" className="mf-bg-base" />
      <div aria-hidden="true" className="mf-bg-aurora"><span /></div>
      <div aria-hidden="true" className="mf-bg-grid" />
      <div aria-hidden="true" className="mf-bg-noise" />
    </>
  )
}
