import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'

const pageTitle = '머니핏 계산기 소개'
const description =
  '머니핏 계산기는 근로기준법·소득세법·주택임대차보호법 등 실제 법령을 기반으로 한 무료 재테크 계산기입니다. 제작 의도, 계산 근거, 데이터 업데이트 원칙을 소개합니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description,
  alternates: buildGoogleAlternates(`${SITE_URL}/about`),
  robots: { index: true, follow: true },
  openGraph: {
    title: '머니핏 계산기 소개 — 공식 기준 기반 무료 재테크 계산기',
    description: '계산 근거, 데이터 업데이트 원칙, 개인정보 처리 방식을 투명하게 안내합니다.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 계산기 소개' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 소개',
    description: '공식 기준 기반 무료 재테크 계산기 운영 원칙.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 계산기 소개' }],
  },
  other: buildNaverMeta(formatPageTitle(pageTitle), description),
}

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">ABOUT</p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-white tracking-tight">
          머니핏 계산기는 어떻게 만들어졌나
        </h1>
        <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed">
          연봉·퇴직금·대출·저축·전월세의 예상 금액을 비교할 수 있는 무료 계산기입니다.
          각 페이지에서 계산 기준과 적용 범위를 함께 확인할 수 있습니다.
        </p>
      </header>

      <div className="space-y-10 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">서비스 이용 안내</h2>
          <p>금융 계산에 필요한 입력값과 결과를 한 화면에서 확인할 수 있도록 만들었습니다. 회원가입 없이 이용할 수 있으며, 금융 계산은 브라우저 안에서 처리합니다. 입력값은 같은 브라우저에 저장되며 사이트 데이터를 삭제하면 지울 수 있습니다.</p>
          <p className="mt-3">로또 당첨번호 조회에는 조회할 회차가 서버로 전달됩니다. 광고·접속 기록과 외부 서비스의 정보 처리에 대해서는 <Link href="/privacy-policy" className="text-[color:var(--brand)] underline">개인정보처리방침</Link>을 확인해주세요.</p>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">계산 근거 법령·고시</h2>
          <p>모든 계산기는 아래 공식 법령과 고시에 기반합니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong className="text-white">연봉 실수령액</strong> — 소득세법 제134조 근로소득 간이세액표,
              국민연금법 제88조(근로자 4.75%), 국민건강보험법(근로자 부담 건보료율의 50%),
              노인장기요양보험법(건강보험료 대비 법정 비율), 고용보험법(근로자 0.9%). 적용 기준일은 계산기에서 확인할 수 있습니다.
            </li>
            <li>
              <strong className="text-white">퇴직금</strong> — 근로기준법 제34조, 근로자퇴직급여 보장법
              제8조(계속근로 1년에 대해 30일분 이상의 평균임금).
            </li>
            <li>
              <strong className="text-white">대출 이자</strong> — 원리금균등·원금균등·만기일시 상환 공식. DSR 한도는 입력한 소득·금리·기존 상환액에 따른 참고 계산입니다.
            </li>
            <li>
              <strong className="text-white">적금·예금</strong> — 소득세법 제129조 이자소득 원천징수세율
              15.4%(소득세 14% + 지방소득세 1.4%).
            </li>
            <li>
              <strong className="text-white">전월세 전환</strong> — 주택임대차보호법 제7조의2, 시행령
              제9조. 보증금의 월차임 전환 시 연 10%와 한국은행 기준금리 + 2%p 중 낮은 비율이 상한입니다.
            </li>
            <li>
              <strong className="text-white">로또</strong> — 소득세법 제21조·제84조·제129조와 지방소득세 기준. 200만 원 이하는 비과세, 200만 원 초과 ~ 3억 원 이하 22%, 3억 원 초과분 33% 원천징수.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">자료와 적용 기준</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>계산기와 가이드에 확인 기준일, 공식 출처, 주요 가정을 표시합니다. 고시·금리 변경이 자동으로 실시간 반영되는 것은 아닙니다.</li>
            <li>실제 적용 요율과 가입·심사 조건은 기관의 최신 원문을 함께 확인해주세요.</li>
            <li>로또 당첨번호는 동행복권 조회 결과를 사용하며, 조회에 실패하면 기준 회차가 표시된 보관 데이터를 안내합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">광고와 콘텐츠</h2>
          <p>페이지에 광고가 표시될 수 있습니다. 계산 결과와 가이드의 공식 근거는 각 페이지에서 확인할 수 있으며, 내용에 오류가 있으면 문의 채널로 알려주세요.</p>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">운영자 연락처</h2>
          <p>
            오류 제보·기능 제안·제휴 문의는 아래 채널로 부탁드립니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              이메일:{' '}
              <a href="mailto:bhd03014@gmail.com" className="text-[color:var(--brand)] underline">
                bhd03014@gmail.com
              </a>
            </li>
            <li>
              인스타그램:{' '}
              <a
                href="https://www.instagram.com/tae_system/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--brand)] underline"
              >
                @tae_system
              </a>
            </li>
          </ul>
        </section>

        <div className="pt-6 border-t border-[color:var(--line)] flex flex-wrap gap-4 text-[13.5px]">
          <Link href="/" className="text-[color:var(--brand)] hover:underline">← 홈</Link>
          <Link href="/contact" className="text-[color:var(--brand)] hover:underline">문의하기 →</Link>
          <Link href="/privacy-policy" className="text-[color:var(--brand)] hover:underline">개인정보처리방침</Link>
        </div>
      </div>
    </article>
  )
}
