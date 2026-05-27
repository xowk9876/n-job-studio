import Link from 'next/link'
import { Instagram } from 'lucide-react'
const guideLinks = [
  { href: '/guide/2026-salary-tax-guide', label: '연봉·세금 가이드', shortLabel: '연봉·세금' },
  { href: '/guide/dsr-stress-test-2026', label: 'DSR 스트레스', shortLabel: 'DSR' },
  { href: '/guide/severance-calculation-guide', label: '퇴직금 가이드', shortLabel: '퇴직금' },
  { href: '/guide/isa-vs-regular-savings', label: 'ISA 절세', shortLabel: 'ISA' },
  { href: '/guide/jeonse-safety-2026', label: '전세사기 방지', shortLabel: '전세사기' },
  { href: '/guide/lotto-tax-guide', label: '로또 세금·수령', shortLabel: '로또·세금' },
] as const

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
  { href: '/salary', label: '연봉 실수령액', shortLabel: '연봉·세후' },
  { href: '/severance', label: '퇴직금', shortLabel: '퇴직금' },
  { href: '/mortgage', label: '대출 이자', shortLabel: '대출' },
  { href: '/savings', label: '적금·예금', shortLabel: '적금·예금' },
  { href: '/jeonse', label: '전월세 전환', shortLabel: '전월세' },
  { href: '/lotto', label: '로또 번호 생성', shortLabel: '로또' },
] as const

type FooterLink = {
  readonly href: string
  readonly label: string
  readonly shortLabel?: string
}

function FooterColumn({
  title,
  titleShort,
  items,
  aria,
  className = '',
  listClassName = '',
}: {
  title: string
  titleShort?: string
  aria: string
  items: readonly FooterLink[]
  className?: string
  listClassName?: string
}) {
  return (
    <nav aria-label={aria} className={`site-footer__nav ${className}`.trim()}>
      <p className="site-footer__nav-title">
        <span className="site-footer__nav-title-full">{title}</span>
        {titleShort ? (
          <span className="site-footer__nav-title-short">{titleShort}</span>
        ) : null}
      </p>
      <ul className={`site-footer__nav-list ${listClassName}`.trim()}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="site-footer__nav-link inline-reset"
              title={item.label}
            >
              <span className="site-footer__nav-label-full">{item.label}</span>
              {item.shortLabel ? (
                <span className="site-footer__nav-label-short">{item.shortLabel}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__logo-row">
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded text-[10.5px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                boxShadow: '0 0 10px rgba(22,163,74,0.35)',
              }}
            >
              M
            </span>
            <span className="site-footer__brand-title">머니핏 계산기</span>
          </div>
          <p className="site-footer__desc">
            2026년 최신 세율·정책 기준으로 정확하게.
            <br />
            연봉, 대출, 퇴직금, 적금, 전월세, 로또까지 바로 확인하는 무료 계산기.
          </p>
          <p className="site-footer__notice">
            본 서비스는 정보 제공 목적이며, 실제 세액·대출 한도·보증 조건은 기관 심사와 최신 고시에 따라 달라질 수 있습니다.
          </p>

          {/* Contact · Social — 플랫폼 브랜드 배경 */}
          <div className="site-footer__contacts">
            <a
              href="https://www.instagram.com/tae_system/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-chip contact-chip--instagram"
              aria-label="인스타그램 @tae_system"
            >
              <Instagram className="contact-chip__icon" strokeWidth={2} aria-hidden />
              <span className="contact-chip__label">@tae_system</span>
            </a>
            <a
              href="mailto:bhd03014@gmail.com"
              className="contact-chip contact-chip--gmail"
              aria-label="이메일 bhd03014@gmail.com"
            >
              <GmailIcon className="contact-chip__icon" />
              <span className="contact-chip__label">bhd03014@gmail.com</span>
            </a>
          </div>
          <p className="site-footer__contact-note">
            궁금한 점·제안은 인스타그램 DM 또는 이메일로 편하게 연락주세요.
          </p>
        </div>

        <div className="site-footer__columns">
          <FooterColumn
            title="Calculators · 계산기"
            titleShort="계산기"
            items={calc}
            aria="사이트 내비게이션"
          />
          <FooterColumn
            title="Guides · 가이드"
            titleShort="가이드"
            items={guideLinks}
            aria="재테크 가이드"
          />
          <FooterColumn
            className="site-footer__nav--info"
            title="Information · 안내"
            titleShort="안내"
            aria="정보 페이지"
            items={[
              { href: '/about', label: '머니핏 소개', shortLabel: '소개' },
              { href: '/contact', label: '오류 제보·문의', shortLabel: '문의' },
              { href: '/privacy-policy', label: '개인정보처리방침', shortLabel: '개인정보' },
              { href: '/terms', label: '이용약관', shortLabel: '약관' },
            ]}
          />
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner">
          <span>© {year} 머니핏 계산기</span>
        </div>
      </div>
    </footer>
  )
}
