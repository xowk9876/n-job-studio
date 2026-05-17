import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '이용약관 | 머니핏 계산기',
  description:
    '머니핏 계산기 이용약관. 서비스 성격, 면책, 지식재산권, 준거법, 분쟁 해결 절차에 대한 안내입니다.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
  openGraph: {
    title: '이용약관 | 머니핏 계산기',
    description: '서비스 성격, 면책, 지식재산권, 준거법 안내.',
    url: `${SITE_URL}/terms`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 계산기 이용약관' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용약관 | 머니핏 계산기',
    description: '머니핏 계산기 서비스 이용 조건 안내.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 계산기 이용약관' }],
  },
}

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">LEGAL</p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-white tracking-tight">이용약관</h1>
        <p className="mt-3 text-[13px] text-[color:var(--muted)]">시행일: 2026년 1월 1일</p>
      </header>

      <div className="space-y-8 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제1조 (목적)</h2>
          <p>
            본 약관은 머니핏 계산기(이하 &quot;서비스&quot;)가 제공하는 연봉 실수령액·대출 이자·퇴직금·적금·전월세
            전환·로또 번호 등 온라인 계산 도구 이용과 관련한 권리·의무·책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제2조 (서비스의 성격)</h2>
          <p>
            서비스는 공개된 법령·고시·금융권 표준 공식을 기반으로 한{' '}
            <strong className="text-white">정보 제공용 계산 도구</strong>입니다. 서비스는 세무·법률·금융
            자문이 아니며, 실제 세액·이자·급여액은 개별 상황, 적용 법령의 개정, 금융기관 상품 약관에 따라
            달라질 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제3조 (이용 요금)</h2>
          <p>
            서비스는 무료로 제공됩니다. 회원가입이나 결제 절차가 없으며, 서비스 운영은 페이지 내 광고
            수익으로 유지됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제4조 (면책)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              서비스 계산 결과는 입력값과 게시 시점의 공식·세율을 기반으로 산출됩니다. 정확성과 완전성을
              보장하기 위해 최선을 다하나, 결과의 실제 적용에 따른 손해에 대해 서비스는 어떠한 법적
              책임도 지지 않습니다.
            </li>
            <li>
              이용자는 중요한 재무 의사결정(대출 실행, 세무 신고, 계약 체결 등) 전에 반드시 공인된 전문가
              (세무사·변호사·공인중개사·금융기관) 또는 공식 기관의 확인을 거쳐야 합니다.
            </li>
            <li>
              서비스는 천재지변, 통신 장애, 제3자 서비스(Vercel·Google 등) 장애로 인한 서비스 중단에 대해
              책임지지 않습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제5조 (지식재산권)</h2>
          <p>
            서비스의 UI 디자인·소스코드·문서·이미지·브랜드명은 운영자에게 귀속됩니다. 이용자는 개인적·비상업적
            용도로 서비스를 이용할 수 있으며, 복제·배포·2차 가공·상업적 이용을 위해서는 사전 서면 동의가
            필요합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제6조 (금지 행위)</h2>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>자동화된 수단으로 과도한 요청을 발생시켜 서비스 안정성을 해치는 행위</li>
            <li>서비스의 소스코드·구조를 무단 복제·변조하는 행위</li>
            <li>서비스를 통해 타인에게 허위 정보·피싱 등 불법 행위를 유도하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제7조 (약관의 변경)</h2>
          <p>
            운영자는 필요 시 본 약관을 변경할 수 있으며, 변경된 약관은 본 페이지 공지 후 7일이 경과한 날
            부터 효력이 발생합니다. 중대한 변경은 30일 전에 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제8조 (준거법 및 관할)</h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석됩니다. 서비스와 관련한 분쟁은 민사소송법상 관할 법원에
            제소합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">제9조 (문의)</h2>
          <p>
            약관 해석에 대한 문의는{' '}
            <a href="mailto:bhd03014@gmail.com" className="text-[color:var(--brand)] underline">
              bhd03014@gmail.com
            </a>
            으로 연락해주시기 바랍니다.
          </p>
        </section>

        <div className="pt-6 border-t border-[color:var(--line)]">
          <Link href="/" className="text-[13.5px] text-[color:var(--brand)] hover:underline">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </article>
  )
}
