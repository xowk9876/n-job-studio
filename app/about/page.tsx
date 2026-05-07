import type { Metadata } from 'next'
import Link from 'next/link'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  title: '소개 | 머니핏 계산기 — 2026년 최신 세율·공식 기반 재테크 계산기',
  description:
    '머니핏 계산기는 근로기준법·소득세법·주택임대차보호법 등 실제 법령을 기반으로 한 무료 재테크 계산기입니다. 제작 의도, 계산 근거, 데이터 업데이트 원칙을 소개합니다.',
  alternates: { canonical: `${SITE}/about` },
  robots: { index: true, follow: true },
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
          복잡한 세금과 이자 계산을, 법령 그대로 정확하게. 광고 팝업이나 회원가입 없이 결과부터 보여주는
          것이 머니핏 계산기의 원칙입니다.
        </p>
      </header>

      <div className="space-y-10 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">왜 만들었나</h2>
          <p>
            네이버·구글에 &quot;연봉 실수령액&quot;을 검색하면 수많은 계산기가 나오지만, 대부분 광고 팝업으로
            결과를 가리거나 2024년 세율을 그대로 쓰고 있습니다. 2026년 1월부터 달라진 건강보험료율,
            스트레스 DSR 3단계, 개정된 근로소득 간이세액표를 반영한 깔끔한 계산기가 없어서 직접
            만들었습니다.
          </p>
          <p className="mt-3">
            머니핏 계산기는 <strong className="text-white">회원가입 없음·광고 팝업 없음·입력값 서버 전송
            없음</strong>을 원칙으로 운영합니다. 모든 계산은 브라우저 안에서 끝납니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">계산 근거 법령·고시</h2>
          <p>모든 계산기는 아래 공식 법령과 고시에 기반합니다.</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong className="text-white">연봉 실수령액</strong> — 소득세법 제134조 근로소득 간이세액표,
              국민연금법 제88조(근로자 4.5%), 국민건강보험법(근로자 부담 건보료율의 50%),
              노인장기요양보험법(건강보험료 대비 법정 비율), 고용보험법(근로자 0.9%). 요율은 매년 초
              보건복지부·고용노동부 고시에 따라 갱신됩니다.
            </li>
            <li>
              <strong className="text-white">퇴직금</strong> — 근로기준법 제34조, 근로자퇴직급여 보장법
              제8조(계속근로 1년에 대해 30일분 이상의 평균임금).
            </li>
            <li>
              <strong className="text-white">대출 이자</strong> — 금융감독원 표준 상환 공식(원리금균등·원금
              균등·만기일시). 2026년 적용되는 스트레스 DSR 3단계 가산금리 반영.
            </li>
            <li>
              <strong className="text-white">적금·예금</strong> — 소득세법 제129조 이자소득 원천징수세율
              15.4%(소득세 14% + 지방소득세 1.4%).
            </li>
            <li>
              <strong className="text-white">전월세 전환</strong> — 주택임대차보호법 제7조의2, 시행령
              제9조(법정 전환율 한도 = 한국은행 기준금리 + 2%).
            </li>
            <li>
              <strong className="text-white">로또</strong> — 복권및복권기금법 제5조, 소득세법 제14조(기타
              소득). 3억 원 초과분 33%, 5만 원 초과 ~ 3억 원 이하 22% 원천징수.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">데이터 업데이트 원칙</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>보건복지부·국세청·금융감독원이 고시하는 연도 요율을 매년 1월 반영합니다.</li>
            <li>
              법령 개정 시 관보(官報) 공포일 기준으로 계산 로직을 업데이트하며, 개정 전 계산도 별도로
              비교할 수 있게 유지합니다.
            </li>
            <li>
              한국은행 기준금리 변경은 변경 당일 전월세 전환 계산에 반영됩니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[19px] font-semibold text-white mb-3">기술 스택</h2>
          <p>
            Next.js 14 App Router · TypeScript · Tailwind CSS · Zustand. Vercel 에지 네트워크로 배포되어
            전국 어디서나 빠르게 접속됩니다. 모든 코드는 정적 생성(SSG) 또는 클라이언트 단에서만
            실행되므로 개인 입력값은 서버로 전송되지 않습니다.
          </p>
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
