/**
 * 종이 질감 배경 (CSS only, 0 JS)
 * - 이전: framer-motion orbs (heavy) → 삭제
 * - 현재: radial-gradient + 줄무늬 페이퍼 패턴 (globals.css .paper-bg)
 */
export default function PaperBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 paper-bg pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}
