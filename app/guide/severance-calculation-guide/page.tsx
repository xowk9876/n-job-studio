import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'severance-calculation-guide'
const title = '퇴직금 계산 공식과 실전 예시'
const description =
  '퇴직금 지급 요건, 평균임금·통상임금 비교, 상여금·연차수당 반영 범위와 세전 계산 예시를 정리합니다.'
const updatedAt = CONTENT_UPDATED_AT

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '퇴직' })

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="퇴직"
      tagColor="#b8a4fa"
      updatedAt={updatedAt}
      related={[
        { href: '/severance', label: '퇴직금 계산기' },
        { href: '/salary', label: '연봉 실수령액 계산기' },
      ]}
    >
      <section>
        <h2>퇴직금의 법적 근거</h2>
        <p>
          <strong>근로자퇴직급여 보장법 제8조</strong>에 따라 사용자는 계속근로기간 1년에 대해 30일분
          이상의 평균임금을 퇴직금으로 지급해야 합니다. 계속근로 1년 이상이고 4주 평균 1주 소정근로시간이 15시간 이상인 근로자가 대상이며, 사업장 규모만으로 제외되지 않습니다.
        </p>
      </section>

      <section>
        <h2>퇴직금 산정 공식</h2>
        <blockquote>
          <p>퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)</p>
        </blockquote>
        <p>
          핵심은 <strong>1일 평균임금</strong>의 정의입니다. 근로기준법 제2조 제1항 제6호에 따라 퇴직일
          이전 3개월간 근로자에게 지급된 임금 총액을 그 기간의 총 일수로 나누어 계산합니다. 여기서 &quot;임금
          총액&quot;에는 기본급뿐 아니라 연장·야간·휴일 수당, 직책수당, 상여금의 3/12 등이 포함됩니다.
        </p>
      </section>

      <section>
        <h2>평균임금 vs 통상임금</h2>
        <table>
          <thead>
            <tr><th>구분</th><th>평균임금</th><th>통상임금</th></tr>
          </thead>
          <tbody>
            <tr><td>기간</td><td>직전 3개월 실지급액</td><td>소정근로의 대가로 정기·일률 지급</td></tr>
            <tr><td>포함 항목</td><td>임금에 해당하는 상여금, 산입 대상 연차수당 등</td><td>정기 상여금·수당의 지급 조건별 판단</td></tr>
            <tr><td>용도</td><td>퇴직금·휴업수당</td><td>연장·야간·휴일수당 기준</td></tr>
          </tbody>
        </table>
        <p>
          2024.12.19 대법원 전원합의체 판결 이후 통상임금 판단에서 고정성 요건은 제외됩니다. 2025.2.6 고용노동부 지침에 따라 소정근로 대가성·정기성·일률성을 확인하세요.
          근로기준법 제2조 제2항에 따라 <strong>평균임금이 통상임금보다 낮으면 통상임금을 평균임금으로
          봅니다</strong>. 휴직·휴업 중 법령상 산정 제외 기간은 그 기간과 임금을 분모·분자에서 함께 제외해야 하므로 별도 검토가 필요합니다.
        </p>
      </section>

      <section>
        <h2>세전 퇴직금 계산 예시</h2>
        <p>최근 3개월 92일, 재직일수 1,917일을 가정합니다. 평균임금보다 높은 통상임금이나 산정 제외 기간은 없다고 봅니다.</p>
        <ul>
          <li>3개월 기본급: 월 350만원 × 3 = 1,050만원</li>
          <li>3개월 연장수당: 월 40만원 × 3 = 120만원</li>
          <li>임금에 해당하는 연간 상여금: 400만원 × 3/12 = 100만원</li>
          <li>퇴직 전 이미 지급 사유가 발생한 산입 대상 연차수당: 연 60만원 × 3/12 = 15만원</li>
        </ul>
        <p>산입 임금은 1,285만원, 1일 평균임금은 12,850,000 ÷ 92 ≈ 139,674원입니다. 중간값을 반올림하지 않고 계산한 세전 퇴직금은 <strong>약 {Math.round(12_850_000 / 92 * 30 * 1917 / 365).toLocaleString('ko-KR')}원</strong>입니다.</p>
        <p>퇴직으로 비로소 발생한 미사용 연차수당은 위 연차수당과 다릅니다. <a href="/severance">퇴직금 계산기</a>에는 월 급여·연간 상여금을 입력할 수 있으며, 연차수당과 휴직 기간은 자동 반영하지 않습니다.</p>
      </section>

      <section>
        <h2>IRP 의무 가입과 세금</h2>
        <p>
          퇴직급여는 원칙적으로 IRP 계좌로 이전하며 55세 이후 퇴직 등 법정 예외가 있습니다.
          퇴직급여 원금의 과세가 이연된 부분을 연금수령 요건에 맞춰 받으면 퇴직소득세의
          70%(연금수령 10년 이내), 60%(11~20년), 50%(20년 초과)를 적용합니다.
          개인 납입금·운용수익에 적용하는 연금소득세율과 퇴직급여 원금의 세율은 구분해야 합니다.
        </p>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>권고사직·해고의 경우 퇴직금이 달라지나요?</h3>
        <p>
          퇴직 사유와 무관하게 동일하게 지급됩니다. 다만 해고 시 <strong>실업급여</strong> 수급 가능 여부
          는 실제 이직 사유와 고용보험 요건에 따라 달라집니다. 이직확인서에는 사실에 맞는 사유를 기재해야 합니다.
        </p>
        <h3>퇴직 후 며칠 이내에 받아야 하나요?</h3>
        <p>
          근로자퇴직급여 보장법 제9조에 따라 지급 사유 발생일부터 <strong>14일 이내 지급</strong>이 원칙입니다. 특별한 사정이 있으면 당사자 합의로 지급기일을 연장할 수 있습니다. 지연이자의 적용·제외 사유는 별도 확인이 필요합니다.
        </p>
      </section>
    </GuideArticle>
  )
}
