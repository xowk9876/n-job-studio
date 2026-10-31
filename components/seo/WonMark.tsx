/** 폰트에 원화 기호가 없어도 공유 이미지의 로고가 깨지지 않도록 그린다. */
export default function WonMark() {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
    <path d="M5 7L10 25L16 9L22 25L27 7M3 14H29M3 19H29" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
