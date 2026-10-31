import type { Metadata } from 'next'
import { calcSalary } from '@/lib/salary'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = '2026-salary-tax-guide'
const title = '2026년 연봉 실수령액 계산 기준'
const description =
  '2026년 개정된 건강보험료율(7.19%)과 국민연금·고용보험·근로소득 간이세액표를 반영해 연봉별 실수령액 공식과 예시를 정리합니다.'
const updatedAt = CONTENT_UPDATED_AT

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '세금' })

const example = calcSalary({ annualSalary: 50_000_000, dependents: 1, children: 0, overtimeHours: 0, nightHours: 0, holidayHours: 0, mealAllowance: 200_000, transportAllowance: 0 })
const won = (value: number) => value.toLocaleString('ko-KR') + '원'

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="세금"
      tagColor="#6bafff"
      updatedAt={updatedAt}
      related={[
        { href: '/salary', label: '연봉 실수령액 계산기' },
        { href: '/severance', label: '퇴직금 계산기' },
        { href: '/guide/severance-calculation-guide', label: '퇴직금 계산 가이드' },
      ]}
    >
      <section>
        <h2>왜 같은 연봉인데 실수령액이 다른가</h2>
        <p>
          5,000만 원짜리 연봉 계약을 해도 통장에 꽂히는 금액은 사람마다 다릅니다. 부양가족 수,
          비과세 식대(월 20만 원 한도), 원천징수 선택비율에 따라 달라집니다. 직장 건강보험료는 피부양자 수에 따라 늘어나지 않습니다. 이 글은 주요 공제 항목과 계산기에 적용한 가정을 설명합니다.
        </p>
      </section>

      <section>
        <h2>급여의 주요 공제 요율</h2>
        <p>
          아래는 일반적인 직장가입자의 근로자 부담 기준입니다. 국민연금 상·하한은 2026년 7월 이후 기준이며, 산재보험은 사업주가 부담합니다.
        </p>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>총 요율</th>
              <th>근로자 부담</th>
              <th>근거</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>국민연금</td><td>9.5%</td><td>4.75%</td><td>국민연금법 제88조 (2026.1 시행). 기준소득월액 상한 659만원(2026.7~2027.6) → 월 공제 상한 313,025원</td></tr>
            <tr><td>건강보험</td><td>7.19%</td><td>3.595%</td><td>2026년 보건복지부 고시</td></tr>
            <tr><td>장기요양</td><td>건보료의 13.14%</td><td>본인 건강보험료의 약 13.14%</td><td>노인장기요양보험법 (2026 고시)</td></tr>
            <tr><td>고용보험</td><td>1.8%(실업급여)</td><td>0.9%</td><td>고용보험법 시행령</td></tr>
          </tbody>
        </table>
        <p>
          2026년에는 국민연금 요율이 9%→9.5%로 인상되었고, 건강보험료율(7.19%)·장기요양 요율(건보료의
          13.14%)도 조정되었습니다. 고용보험 실업급여분(1.8%, 근로자 0.9%)은 동일합니다. 실제 공제
          시점의 요율은 국세청 홈택스·4대 사회보험 EDI에서 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>소득세·지방소득세 계산 방식</h2>
        <p>
          매달 급여에서 빠지는 소득세는 연말정산 전 <strong>간이세액표</strong>에 따라 원천징수됩니다.
          소득세법 시행령 별표 2의 월 급여(비과세 제외) ·
          공제대상 부양가족 수(본인 포함) 두 축으로 세액이 결정됩니다. 지방소득세는 소득세의 10%로
          함께 공제됩니다.
        </p>
        <blockquote>
          <p>
            <strong>TIP</strong> 간이세액표는 신청 시 80%·100%·120% 세 가지 비율 중 선택할 수
            있습니다. 원천징수 비율은 미리 내는 세금을 바꿀 뿐 최종 세액 자체를 줄이지 않습니다. 이 계산기는 100%만 적용합니다.
          </p>
        </blockquote>
        <p>
          월 간이세액표는 8~20세 자녀 1명 20,830원, 2명 45,830원, 3명부터 추가 1명당 33,330원을
          표 세액에서 차감합니다(시행령 별표 2, 2026.2.27 개정). 연말정산 자녀공제는 해당 귀속연도의
          연령·소득 요건에 따라 별도로 정산합니다.
        </p>
      </section>

      <section>
        <h2>연봉 5,000만 원 실전 계산 (2026년 요율 기준)</h2>
        <p>
          독신·부양가족 1명(본인) 기준, 비과세 식대 240만 원/년 반영 시입니다. 금액은 머니핏 계산기 산출값이며,
          월 간이세액표 100% 선택 기준입니다. 실제 보험료는 신고 보수·가입 조건과 정산에 따라 달라질 수 있습니다.
        </p>
        <ul>
          <li>과세 급여 총액: 50,000,000 − 2,400,000 = 47,600,000원</li>
          <li>월 과세 급여: 3,966,667원</li>
          <li>국민연금(기준소득월액 천 원 미만 절사): {won(example.pension)}</li>
          <li>건강보험: {won(example.health)}</li>
          <li>장기요양: {won(example.care)}</li>
          <li>고용보험: {won(example.employment)}</li>
          <li>근로소득세(공식 간이세액표): {won(example.incomeTax)}</li>
          <li>지방소득세: {won(example.localTax)}</li>
        </ul>
        <p>
          총 공제액 {won(example.totalDeduction)}. 세전 월급 4,166,667원(식대 20만 원 포함)에서 공제를 뺀 월 실수령액은{' '}
          <strong>{won(example.monthlyNet)}</strong>입니다. 부양가족 수·원천징수 선택비율(80/100/120%)·
          식대 이외 비과세 항목에 따라 달라집니다. 100% 기준 예상액은 머니핏{' '}
          <a href="/salary">연봉 실수령액 계산기</a>에서 본인 값을 넣고 확인하세요.
        </p>
      </section>

      <section>
        <h2>급여명세서와 비교할 때</h2>
        <ul>
          <li>식대·자가운전보조금은 실제 지급액과 법정 비과세 요건을 확인한 뒤 입력하세요.</li>
          <li>공제대상 가족 수에는 본인을 포함하고, 다른 가족과 중복 공제하지 않도록 연령·소득·부양 요건을 확인하세요.</li>
          <li>보험료는 신고한 보수와 정산 내역을 사용하므로 현재 월 급여에 단순히 요율을 곱한 값과 다를 수 있습니다.</li>
          <li>연금저축·IRP·월세 등 연말정산 공제는 이 월급 계산에 포함되지 않습니다. 공제 대상 납입한도와 실제 환급액을 구별하세요.</li>
        </ul>
      </section>

      <section>
        <h2>계산기에 포함되지 않는 항목</h2>
        <p>상여금 원천징수, 중도 입·퇴사 월의 일할 급여, 회사별 보험료 정산, 연말정산의 개별 소득·세액공제는 별도 확인이 필요합니다.</p>
        <p>추가 수당은 주 40시간·월 209시간, 입력 연봉 전액을 통상임금으로 가정합니다. 실제 통상임금 구성과 근무 형태가 다르면 회사 급여 담당자와 확인하세요.</p>
      </section>
    </GuideArticle>
  )
}
