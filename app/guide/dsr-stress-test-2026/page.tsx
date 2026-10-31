import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { calcDsrLimit } from '@/lib/mortgage'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'dsr-stress-test-2026'
const title = '2026 스트레스 DSR 적용 기준과 계산 예시'
const description =
  '스트레스 금리가 실제 이자와 다른 이유, 지역·금리 유형별 적용 조건과 원리금균등 기준 한도 예시를 설명합니다.'
const updatedAt = CONTENT_UPDATED_AT
const exampleRates = [0, 0.75, 1.5, 3].map(stressBps => ({
  stressBps,
  ...calcDsrLimit({ annualIncome: 60_000_000, existingDebtMonthlyPmt: 0, annualRate: 4, years: 30, stressBps, dsrCap: 40 }),
}))

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '대출' })

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="대출"
      tagColor="#5eead4"
      updatedAt={updatedAt}
      related={[
        { href: '/mortgage', label: '대출 이자 계산기' },
        { href: '/guide/isa-vs-regular-savings', label: 'ISA 비과세 조건과 세금 비교' },
      ]}
    >
      <section>
        <h2>스트레스 DSR은 심사용 계산입니다</h2>
        <p>DSR은 연 소득 대비 연간 대출 원리금 상환액의 비율입니다. 차주단위 DSR 규제가 적용되는 경우 은행권 40%·제2금융권 50%를 기본으로 보되, 대출별 제외·예외 기준이 있습니다.</p>
        <p>스트레스 DSR은 향후 금리 상승을 가정해 심사용 금리를 높이는 제도입니다. <strong>스트레스 금리가 실제 약정 이자에 더해지는 것은 아닙니다.</strong></p>
      </section>

      <section>
        <h2>2026년 하반기 적용 기준</h2>
        <p>3단계는 2025년 7월부터 시행 중입니다. 아래는 변동형 대출의 기준이며, 혼합형·주기형은 고정기간 또는 금리변동주기와 만기의 비중에 따라 적용비율이 달라집니다.</p>
        <table>
          <thead><tr><th>구분</th><th>가산금리 기준</th><th>확인할 조건</th></tr></thead>
          <tbody>
            <tr><td>수도권·규제지역 주담대</td><td>3.0%p</td><td>금리 유형·경과규정</td></tr>
            <tr><td>지방 비규제지역 주담대</td><td>0.75%p</td><td>2단계 적용 유예: 2026.12.31까지</td></tr>
            <tr><td>신용·기타 대출</td><td>기본 1.5%p</td><td>신용대출은 총잔액 1억원 초과 시</td></tr>
          </tbody>
        </table>
        <p>지역 구분, 상품별 적용비율, 계약·신청 시점에 따른 경과규정은 금융위원회 하반기 행정지도와 금융기관 안내를 함께 확인하세요.</p>
      </section>

      <section>
        <h2>같은 조건에서 가산금리만 바꾸면</h2>
        <p>연 소득 6,000만원·기존 부채 없음·30년 원리금균등·약정금리 4%·DSR 40%를 가정합니다. 월 상환 여력은 200만원이며, 아래 금액은 대출 계산기의 역산 결과를 만원 단위로 반올림한 값입니다.</p>
        <table>
          <thead><tr><th>가산금리</th><th>심사 가정 금리</th><th>역산 원금</th></tr></thead>
          <tbody>{exampleRates.map(row => (
            <tr key={row.stressBps}><td>{row.stressBps}%p</td><td>{row.stressedRate}%</td><td>약 {Math.round(row.maxPrincipal / 10000).toLocaleString('ko-KR')}만원</td></tr>
          ))}</tbody>
        </table>
        <p>LTV, 지역별 대출 총액 제한, 인정 소득·만기, 기존 대출별 DSR 산식을 반영한 승인 한도는 아닙니다. <a href="/mortgage">대출 계산기</a>에서도 같은 가정으로 비교할 수 있습니다.</p>
      </section>

      <section>
        <h2>대출별로 확인할 항목</h2>
        <ul>
          <li>주담대: 소재지·규제지역 여부, 변동·혼합·주기형, 심사에 인정되는 만기를 확인하세요.</li>
          <li>신용대출·마이너스통장: 잔액뿐 아니라 약정 한도와 DSR상 상환기간이 반영될 수 있습니다.</li>
          <li>전세대출·정책대출: 일반 주담대와 적용 범위가 다릅니다. 상품과 주택 보유 여부 등에 따른 기준을 확인하세요.</li>
        </ul>
      </section>

      <section>
        <h2>상담 전에 준비할 정보</h2>
        <ul>
          <li>소득 증빙과 기존 대출의 잔액·한도·월 상환액을 준비하세요.</li>
          <li>만기 연장이 가능한지, 그 경우 총이자가 얼마나 늘어나는지 함께 비교하세요.</li>
          <li>고정금리 기간과 실제 적용되는 스트레스 비율을 확인하세요.</li>
          <li>대환은 금리 차이뿐 아니라 중도상환수수료·부대비용을 포함해 비교하세요.</li>
        </ul>
      </section>

      <section>
        <h2>기존 대출을 연장하면 바로 다시 계산되나요?</h2>
        <p>신규·증액·대환·재약정 여부, 대출 종류와 경과규정에 따라 달라집니다. 모든 단순 연장에 같은 규칙이 적용된다고 단정할 수 없습니다. 금융기관에 해당 계약의 적용 기준을 확인하세요. 심사 기준이 바뀌어도 기존 약정금리에 스트레스 금리가 추가되는 것은 아닙니다.</p>
      </section>
    </GuideArticle>
  )
}
