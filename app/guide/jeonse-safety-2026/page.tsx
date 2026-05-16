import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'
const slug = 'jeonse-safety-2026'
const title = '2026 전세사기 방지 체크리스트 — 계약 전·중·후 25개 점검 포인트'
const description =
  'HUG 전세보증금반환보증 가입 조건, 등기부등본 읽는 법, 깡통전세 판별 공식까지. 주택임대차보호법 개정 사항을 반영한 2026년판 체크리스트.'

export const metadata: Metadata = {
  title: `${title} | 머니핏 계산기`,
  description,
  alternates: { canonical: `${SITE}/guide/${slug}` },
  openGraph: { title, description, url: `${SITE}/guide/${slug}`, type: 'article' },
}

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="부동산"
      tagColor="#fcc73e"
      updatedAt="2026-01-09"
      related={[
        { href: '/jeonse', label: '전월세 전환 계산기' },
        { href: '/mortgage', label: '대출 이자 계산기' },
      ]}
    >
      <section>
        <h2>왜 2026년에도 전세사기가 위험한가</h2>
        <p>
          2022~2024년 수도권을 중심으로 터진 대규모 전세사기의 여진은 2026년에도 지속됩니다. 특히 빌라·
          오피스텔 역전세 리스크가 큰 지역은 보증금 미반환 사례가 이어지고 있으며, 계약 전 단계에서
          기본 절차만 지켜도 피해의 80% 이상을 예방할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>계약 전 — 시세·권리관계 확인</h2>
        <ol>
          <li>
            <strong>시세 3채널 크로스체크</strong> — 국토교통부 실거래가, KB시세, 네이버 부동산 모두
            확인. 보증금이 매매가의 80%를 넘으면 깡통전세 가능성.
          </li>
          <li>
            <strong>등기부등본 열람(인터넷등기소, 700원)</strong> — 표제부·갑구(소유권)·을구(저당권)
            세 섹션 확인.
          </li>
          <li>
            근저당 총액이 {'(매매가 − 보증금) × 70%'} 를 넘으면 위험 신호. 예: 시세 3억, 보증금 2.4억,
            근저당 4,200만 원 이상이면 요주의.
          </li>
          <li>
            <strong>건축물대장 확인(정부24)</strong> — 위반건축물 여부, 실제 용도와 계약상 용도 일치 여부.
          </li>
          <li>
            <strong>임대인 국세·지방세 완납증명서 요구</strong> — 2023.4 개정 주택임대차보호법 제3조의7
            에 따라 요청 가능. 거부 시 계약 재고.
          </li>
        </ol>
      </section>

      <section>
        <h2>계약 중 — 특약·서류</h2>
        <ol>
          <li><strong>임대인 신분증·등기부 소유주 일치</strong> 반드시 대조(대리인 계약 시 위임장·인감증명서 필수)</li>
          <li>계약서에 <strong>&quot;잔금 지급일 다음날까지 선순위 근저당 설정 금지&quot;</strong> 특약 명시</li>
          <li><strong>&quot;보증금 반환 보증보험 가입 가능한 물건임을 확인한다&quot;</strong> 특약 추가</li>
          <li>전입신고·확정일자 받기 전 임대인이 근저당을 추가 설정할 경우 해지 권리 특약</li>
          <li>계약금·잔금은 반드시 <strong>등기부상 소유주 본인 계좌</strong>로 송금(현금·타인 계좌 금지)</li>
        </ol>
      </section>

      <section>
        <h2>계약 후 — 대항력 확보</h2>
        <ol>
          <li>
            <strong>전입신고 + 확정일자</strong>를 잔금일 당일에 동시 진행. 이 순간부터 주택임대차보호법
            상 대항력·우선변제권이 발생합니다(법 제3조, 제3조의2).
          </li>
          <li>
            <strong>HUG 전세보증금반환보증 가입</strong> — 보증금 수도권 7억/비수도권 5억 이하, 주택가격
            대비 보증금 비율 90% 이하 시 가입 가능. 보증료 연 0.115~0.154%.
          </li>
          <li>가입 완료 증빙(HUG 보증서 PDF)을 별도 보관.</li>
          <li>계약 만료 6개월~2개월 전 갱신 거절 의사 내용증명 발송(법 제6조의3).</li>
        </ol>
      </section>

      <section>
        <h2>깡통전세 판별 공식</h2>
        <blockquote>
          <p>깡통전세 위험 점수 = (선순위 채권 총액 + 보증금) ÷ 시세</p>
        </blockquote>
        <ul>
          <li>70% 이하 — 안전</li>
          <li>70~80% — 주의(HUG 보증 필수)</li>
          <li>80~90% — 경고(가급적 회피)</li>
          <li>90% 초과 — 위험(계약 재고)</li>
        </ul>
        <p>
          전세↔월세 전환을 고민 중이라면 <a href="/jeonse">전월세 전환 계산기</a>에서 법정 전환율
          (한국은행 기준금리 + 2%) 기반 월세 환산액을 먼저 비교해보세요.
        </p>
      </section>

      <section>
        <h2>사고 발생 시 대응 순서</h2>
        <ol>
          <li>임대차분쟁조정위원회 조정 신청(한국부동산원, 무료)</li>
          <li>내용증명으로 보증금 반환 청구</li>
          <li>임차권등기명령 신청(법원) — 이사가도 우선변제권 유지</li>
          <li>지급명령 → 본안소송(보증금 반환 청구)</li>
          <li>HUG 가입자는 보증 이행 청구로 회수</li>
        </ol>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>전세대출을 받았는데 사기를 당하면 어떻게 되나요?</h3>
        <p>
          HF·SGI 등 보증기관이 대위변제를 해주지만 본인 채무가 완전히 사라지는 것은 아닙니다. 특례 제도
          (버팀목 전세사기 피해자 대출 등) 자격 확인 필수.
        </p>
        <h3>전세사기 특별법 피해자 인정은 어떻게 받나요?</h3>
        <p>
          국토교통부 &quot;전세사기피해지원위원회&quot;에 신청. 인정 시 우선매수권·경매 유예·저금리 대환
          대출 등 지원을 받을 수 있습니다.
        </p>
      </section>
    </GuideArticle>
  )
}
