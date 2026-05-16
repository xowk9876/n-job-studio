import Link from 'next/link'
import { Instagram } from 'lucide-react'

function GmailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="#4285f4" d="M6 40h7V22l-9-7v22a3 3 0 0 0 2 3z" />
      <path fill="#34a853" d="M35 40h7a3 3 0 0 0 3-3V15l-10 7z" />
      <path fill="#fbbc04" d="M35 10v12l10-7V11.5A3.5 3.5 0 0 0 41.5 8h-1.3c-.6 0-1.2.2-1.7.5z" />
      <path fill="#ea4335" d="M13 22V10l11 8 11-8v12l-11 8z" />
      <path fill="#c5221f" d="M4 11.5V15l9 7V10L9.5 8H7.5A3.5 3.5 0 0 0 4 11.5z" />
    </svg>
  )
}

const calc = [
  { href: '/salary', label: '연봉 실수령액' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage', label: '대출 이자' },
  { href: '/savings', label: '적금 이자' },
  { href: '/jeonse', label: '전월세 전환' },
  { href: '/lotto', label: '로또 번호' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-24 border-t border-[color:var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid gap-10 md:grid-cols-[1fr_auto_auto]">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded text-[10.5px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #6ea8ff 0%, #a78bfa 100%)',
                boxShadow: '0 0 10px rgba(110,168,255,0.4)',
              }}
            >
              M
            </span>
            <span className="font-semibold text-white">머니핏 계산기</span>
          </div>
          <p className="text-[13.5px] text-[color:var(--sub)] leading-relaxed max-w-md">
            2026년 최신 세율·공제 기준으로 정확하게.
            <br />
            광고 팝업 없이 결과부터 보여주는 한국 재테크 계산기.
          </p>
          <p className="text-[11.5px] text-[color:var(--muted)] mt-4">
            본 계산기는 정보 제공 목적이며, 실제 세액·이자는 정책 및 금융기관 상품에 따라 달라질 수 있습니다.
          </p>

          {/* Contact · Social */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.instagram.com/tae_system/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px] font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                boxShadow: '0 2px 10px rgba(220,39,67,0.25)',
              }}
              aria-label="인스타그램 @tae_system"
            >
              <Instagram className="w-4 h-4" strokeWidth={2} />
              <span>@tae_system</span>
            </a>
            <a
              href="mailto:bhd03014@gmail.com"
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px] font-medium text-[color:var(--ink-2)] border border-[color:var(--line-strong)] bg-white/[0.03] hover:text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] hover:border-[color:var(--brand)] transition-colors"
              aria-label="이메일 문의"
            >
              <GmailIcon className="w-4 h-4" />
              <span>bhd03014@gmail.com</span>
            </a>
          </div>
          <p className="text-[11px] text-[color:var(--muted)] mt-2.5">
            궁금한 점·제안은 인스타그램 DM 또는 이메일로 편하게 연락주세요.
          </p>
        </div>

        <nav aria-label="사이트 내비게이션">
          <p className="text-[10.5px] font-semibold text-[color:var(--muted)] tracking-[0.18em] mb-4 uppercase">
            Calculators
          </p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
            {calc.map(c => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-reset text-[13.5px] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="정보 페이지">
          <p className="text-[10.5px] font-semibold text-[color:var(--muted)] tracking-[0.18em] mb-4 uppercase">
            Information
          </p>
          <ul className="space-y-2.5">
            {[
              { href: '/guide', label: '재테크 가이드' },
              { href: '/about', label: '소개' },
              { href: '/contact', label: '문의하기' },
              { href: '/privacy-policy', label: '개인정보처리방침' },
              { href: '/terms', label: '이용약관' },
            ].map(i => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="inline-reset text-[13.5px] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] transition-colors"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[color:var(--line)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 text-[11.5px] text-[color:var(--muted)]">
          <span>© {year} 머니핏 계산기</span>
        </div>
      </div>
    </footer>
  )
}
