import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'

const pageTitle = '개인정보처리방침'
const description =
  '머니핏 계산기의 개인정보처리방침. 브라우저 저장, 광고·호스팅 서비스, 문의 정보 처리와 이용자 권리에 대한 안내입니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description,
  alternates: buildGoogleAlternates(`${SITE_URL}/privacy-policy`),
  robots: { index: true, follow: true },
  openGraph: {
    title: formatPageTitle(pageTitle),
    description: '브라우저 저장, 광고·호스팅 및 문의 정보 처리 안내.',
    url: `${SITE_URL}/privacy-policy`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 계산기 개인정보처리방침' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: formatPageTitle(pageTitle),
    description: '계산 입력값은 브라우저 안에서 처리됩니다.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 계산기 개인정보처리방침' }],
  },
  other: buildNaverMeta(formatPageTitle(pageTitle), description),
}

export default function PrivacyPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16 prose-invert">
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">LEGAL</p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-white tracking-tight">
          개인정보처리방침
        </h1>
        <p className="mt-3 text-[13px] text-[color:var(--muted)]">시행일: 2026년 1월 1일 · 최종 수정: 2026년 10월 31일 (실제 기능·저장 방식 설명 정정)</p>
      </header>

      <div className="space-y-8 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">1. 개요</h2>
          <p>
            머니핏 계산기(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요하게 생각하며,
            「개인정보 보호법」 및 관련 법령이 정한 바를 준수합니다. 본 방침은 서비스가 어떠한 정보를
            수집·이용·보관·파기하는지를 투명하게 공개합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">2. 계산 입력값과 브라우저 저장</h2>
          <p>회원가입·로그인 없이 이용할 수 있습니다. 연봉·대출금·저축액 등 금융 계산 입력값은 브라우저에서 처리하며 계산을 위해 서버로 전송하지 않습니다.</p>
          <p className="mt-3">다섯 금융 계산기의 입력값은 같은 브라우저에서 다시 사용할 수 있도록 로컬 저장소(localStorage)에 저장됩니다. 새로고침하거나 브라우저를 닫아도 남을 수 있으며, 기기·브라우저 간에 동기화하지 않습니다.</p>
          <p className="mt-3">공용 기기에서는 사용 후 브라우저 설정에서 이 사이트의 저장 데이터를 삭제하세요. 삭제하면 저장된 입력값이 초기화됩니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">3. 광고와 외부 콘텐츠</h2>
          <p>서비스에는 Google AdSense 광고 스크립트가 포함되어 있습니다. Google 등 광고 사업자는 쿠키·기기 정보·IP 주소·방문 및 광고 반응 정보 등을 자체 정책과 이용자 설정에 따라 처리할 수 있습니다.</p>
          <p className="mt-3">글꼴 등 외부 콘텐츠를 불러올 때도 해당 제공자에게 접속 정보가 전달될 수 있습니다.</p>
          <p className="mt-3">광고 설정과 쿠키 처리는 <a href="https://policies.google.com/technologies/ads" className="text-[color:var(--brand)] underline">Google 광고 정책</a>과 브라우저 설정에서 확인할 수 있습니다. 광고·쿠키 차단과 사이트 저장 데이터 삭제는 별개입니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">4. 접속·조회 정보</h2>
          <p>사이트는 Vercel을 통해 제공됩니다. 페이지와 로또 데이터 조회 시 IP 주소·요청 경로·시각·브라우저 정보 등이 호스팅·보안 서비스에서 처리될 수 있습니다. 로또 API는 과도한 요청을 제한하기 위해 IP 기반 식별자를 서버 메모리에서 사용합니다.</p>
          <p className="mt-3">로또 회차 조회에는 입력한 회차 번호가 서버로 전송됩니다. 금융 계산 입력값이나 생성한 번호를 운영자 데이터베이스에 저장하는 기능은 없습니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">5. 문의 정보와 보관</h2>
          <p>이메일이나 인스타그램으로 문의하면 이용자가 보낸 연락처·메시지·첨부자료가 해당 서비스와 운영자에게 전달됩니다. 문의 확인과 답변에 필요한 범위에서 이용하며, 주민등록번호·계좌 비밀번호·복권 원본 번호 등 불필요한 민감정보를 보내지 마세요.</p>
          <p className="mt-3">브라우저 저장값은 이용자가 사이트 데이터를 삭제할 때까지 남을 수 있습니다. 광고·호스팅·메일 등 외부 서비스의 기록은 각 서비스 정책과 설정에 따라 보관됩니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">6. 외부 서비스 확인</h2>
          <p>금융 계산 기능은 입력값을 외부로 전송하지 않지만, 사이트 접속·광고·문의 과정에서는 위 외부 서비스가 정보를 처리할 수 있습니다. 외부 링크를 열면 해당 사이트의 개인정보 처리방침이 적용됩니다.</p>
          <p className="mt-3">운영자는 문의 목적으로 받은 정보를 별도의 마케팅·판매 목적으로 이용하지 않는 것을 원칙으로 합니다. 법령에 따른 적법한 요청은 관련 절차에 따릅니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">7. 저장값 삭제와 개인정보 문의</h2>
          <p>계산 입력값을 지우려면 사용 중인 브라우저의 사이트 설정에서 머니핏 계산기의 저장 데이터를 삭제하세요. 다른 브라우저에 저장된 값은 각각 삭제해야 합니다.</p>
          <p className="mt-3">운영자가 받은 문의 정보에 대한 열람·정정·삭제 등 요청은 아래 이메일로 연락해주세요. 처리 대상과 법령상 요건을 확인해 안내합니다. 외부 사업자가 처리하는 정보는 해당 사업자에게도 요청해야 할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">8. 연락처</h2>
          <p>
            개인정보 관련 문의와 처리 요청은 아래 이메일로 보내주세요.
          </p>
          <p className="mt-2">
            이메일:{' '}
            <a href="mailto:bhd03014@gmail.com" className="text-[color:var(--brand)] underline">
              bhd03014@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">9. 방침의 변경</h2>
          <p>수집·이용 방식이 바뀌면 변경 내용과 적용일을 이 페이지에 안내합니다. 법령상 별도 고지나 동의가 필요한 변경은 해당 절차를 따릅니다.</p>
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
