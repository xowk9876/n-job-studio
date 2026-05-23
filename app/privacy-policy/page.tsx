import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'

const pageTitle = '개인정보처리방침'
const description =
  '머니핏 계산기의 개인정보처리방침. 수집 항목, 쿠키, Google AdSense·Analytics 사용, 제3자 제공, 이용자 권리에 대한 안내입니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description,
  alternates: buildGoogleAlternates(`${SITE_URL}/privacy-policy`),
  robots: { index: true, follow: true },
  openGraph: {
    title: formatPageTitle(pageTitle),
    description: '계산 입력값 처리 원칙, 개인정보 수집 여부, 광고·분석 도구 사용 안내.',
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
        <p className="mt-3 text-[13px] text-[color:var(--muted)]">시행일: 2026년 1월 1일</p>
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
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">2. 수집하는 개인정보 항목</h2>
          <p>
            서비스는 <strong className="text-white">회원가입·로그인 기능을 제공하지 않으며, 이용자의
            이름·연락처·주민등록번호 등 어떠한 개인 식별 정보도 직접 수집하지 않습니다.</strong>{' '}
            연봉·대출금·저축액 등 계산기에 입력한 모든 값은 이용자의 브라우저 내에서만 처리되며 서버로
            전송·저장되지 않습니다.
          </p>
          <p className="mt-3">
            다만 서비스 품질 개선과 광고 제공을 위해 다음 항목이 자동 수집될 수 있습니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>접속 IP 주소, 브라우저 종류 및 버전, 운영체제</li>
            <li>방문 일시, 체류 시간, 참조 URL</li>
            <li>쿠키(Cookie) 및 유사 기술에 의한 식별자</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">3. 계산 입력값 처리 원칙</h2>
          <p>
            머니핏 계산기는 연봉, 대출금, 보증금, 저축액처럼 민감할 수 있는 금액 정보를 다룹니다.
            따라서 입력값은 이용자의 브라우저 안에서 계산에만 사용되며, 운영자가 별도로 확인할 수 있는
            서버 데이터베이스에 저장하지 않습니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1.5">
            <li>계산기 입력값은 결과 산출을 위한 임시 값으로만 사용됩니다.</li>
            <li>회원가입, 로그인, 주민등록번호, 계좌번호 입력을 요구하지 않습니다.</li>
            <li>페이지를 새로고침하거나 브라우저 저장 데이터를 삭제하면 입력값도 함께 초기화될 수 있습니다.</li>
            <li>정확한 세무·법률 판단이 필요한 경우에는 공식 기관 또는 전문가 상담을 권장합니다.</li>
          </ul>
          <p className="mt-3">
            서비스는 사용자가 계산 결과를 빠르게 확인할 수 있도록 설계되었으며, 입력값을 기반으로 개인을
            식별하거나 개별 상담·영업 목적으로 활용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">4. 개인정보의 보유 및 파기</h2>
          <p>
            자동 수집되는 접속 로그는 통신비밀보호법에 따라 3개월간 보관 후 파기됩니다. 계산 입력값은
            브라우저 세션 종료 시 함께 소멸합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">5. 제3자 제공</h2>
          <p>
            서비스는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 법령에 의거하거나 수사기관의
            적법한 요청이 있을 때에는 관련 법령 절차에 따라 제공할 수 있습니다.
          </p>
          <p className="mt-3">
            계산기에 입력한 연봉, 대출금, 보증금, 저축액 등은 브라우저 안에서만 처리되며 운영자가 별도로
            열람하거나 제3자에게 제공할 수 있는 형태로 저장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">6. 이용자의 권리</h2>
          <p>
            이용자는 「개인정보 보호법」 제35조~제39조에 따라 자신의 개인정보에 대한 열람·정정·삭제·처리정지를
            요구할 권리가 있습니다. 다만 본 서비스는 회원정보를 보유하지 않으므로 일반적으로 해당되는
            정보가 존재하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">7. 연락처</h2>
          <p>
            개인정보 관련 문의는 아래 이메일로 보내주시면 영업일 기준 7일 이내 답변드립니다.
          </p>
          <p className="mt-2">
            이메일:{' '}
            <a href="mailto:bhd03014@gmail.com" className="text-[color:var(--brand)] underline">
              bhd03014@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-[18px] font-semibold text-white mb-3">8. 방침의 변경</h2>
          <p>
            본 방침이 변경될 경우, 시행일 최소 7일 전에 본 페이지에 공지합니다. 중대한 변경 사항은 30일
            전에 공지합니다.
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
