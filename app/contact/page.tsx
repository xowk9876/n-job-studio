import type { Metadata } from 'next'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'

const pageTitle = '문의하기'
const description = '머니핏 계산기 운영자 연락처. 이메일 bhd03014@gmail.com · 인스타그램 @tae_system.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description,
  alternates: buildGoogleAlternates(`${SITE_URL}/contact`),
  robots: { index: true, follow: true },
  openGraph: {
    title: formatPageTitle(pageTitle),
    description: '계산 오류 제보, 새 계산기 제안, 제휴 문의 연락처 안내.',
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 계산기 문의하기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: formatPageTitle(pageTitle),
    description: '오류 제보와 새 계산기 제안을 받습니다.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 계산기 문의하기' }],
  },
  other: buildNaverMeta(formatPageTitle(pageTitle), description),
}

function GmailIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

export default function ContactPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">CONTACT</p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-white tracking-tight">문의하기</h1>
        <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed">
          계산 오류 제보, 새 계산기 제안, 제휴·광고 문의 모두 환영합니다. 아래 채널 중 편한 쪽으로
          연락주세요. 오류 제보는 최우선 처리, 일반 문의는 영업일 기준 3일 이내 답변을 목표로 합니다.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        <a
          href="mailto:bhd03014@gmail.com"
          className="card card-hover p-5 inline-reset flex items-start gap-3"
        >
          <GmailIcon className="w-7 h-7 shrink-0" />
          <div>
            <p className="text-[11px] font-mono tracking-[0.18em] text-[color:var(--muted)]">EMAIL</p>
            <p className="mt-1 font-semibold text-white text-[15px]">bhd03014@gmail.com</p>
            <p className="mt-1 text-[12.5px] text-[color:var(--sub)]">상세 문의·제휴·자료 첨부</p>
          </div>
        </a>
        <a
          href="https://www.instagram.com/tae_system/"
          target="_blank"
          rel="noopener noreferrer"
          className="card card-hover p-5 inline-reset flex items-start gap-3"
        >
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-white"
            style={{
              background:
                'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
            }}
          >
            <Instagram className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[11px] font-mono tracking-[0.18em] text-[color:var(--muted)]">INSTAGRAM</p>
            <p className="mt-1 font-semibold text-white text-[15px]">@tae_system</p>
            <p className="mt-1 text-[12.5px] text-[color:var(--sub)]">간단한 질문·DM 소통</p>
          </div>
        </a>
      </div>

      <div className="space-y-8 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">문의 유형별 안내</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">계산 오류 제보</strong> — 어느 계산기에서, 어떤 입력값으로,
              어떤 결과가 나왔는지, 예상한 결과는 무엇이었는지를 함께 보내주시면 가장 빠르게 수정됩니다.
            </li>
            <li>
              <strong className="text-white">새 계산기 제안</strong> — 자주 쓰는 계산 상황과 근거 법령·공식
              링크를 알려주시면 검토 후 반영 여부를 회신드립니다.
            </li>
            <li>
              <strong className="text-white">제휴·광고 문의</strong> — 회사명·담당자·제안 내용을 이메일로
              보내주세요. 광고 위치는 계산 버튼·결과 영역과 혼동되지 않는 범위에서만 검토합니다.
            </li>
            <li>
              <strong className="text-white">법률·세무 상담</strong> — 머니핏 계산기는 상담 자격이 없으므로
              세무사·변호사·공인중개사 등 전문가 상담을 권장드립니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">응답 정책</h2>
          <p>
            모든 문의는 확인 즉시 우선순위에 따라 처리됩니다. 오류 제보는 최우선 처리하며,
            제휴·일반 질문은 영업일 기준 3일 이내 답변을 목표로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">오류 제보 양식</h2>
          <p>
            계산 오류를 제보할 때는 아래 내용을 함께 보내주시면 재현과 수정이 빨라집니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1.5">
            <li>사용한 계산기 이름과 접속한 URL</li>
            <li>입력한 금액·기간·세율·부양가족 등 주요 조건</li>
            <li>화면에 표시된 결과값과 예상한 결과값</li>
            <li>참고한 공식 자료 링크가 있다면 함께 첨부</li>
          </ul>
        </section>

        <div className="pt-6 border-t border-[color:var(--line)] flex flex-wrap gap-4 text-[13.5px]">
          <Link href="/" className="text-[color:var(--brand)] hover:underline">← 홈</Link>
          <Link href="/about" className="text-[color:var(--brand)] hover:underline">머니핏 소개</Link>
          <Link href="/privacy-policy" className="text-[color:var(--brand)] hover:underline">개인정보처리방침</Link>
        </div>
      </div>
    </article>
  )
}
