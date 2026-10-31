import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'isa-vs-regular-savings'
const title = 'ISA 비과세 조건과 일반계좌 세금 비교'
const description =
  'ISA 가입·납입·비과세 조건과 중도해지 주의사항을 확인하고, 같은 과세 대상 수익의 세금을 비교합니다.'
const updatedAt = CONTENT_UPDATED_AT

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '투자' })

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="투자"
      tagColor="#3ee0a5"
      updatedAt={updatedAt}
      related={[
        { href: '/savings', label: '적금 · 예금 계산기' },
        { href: '/guide/2026-salary-tax-guide', label: '연봉 실수령액 가이드' },
      ]}
    >
      <section>
        <h2>ISA의 세금 구조</h2>
        <p>ISA는 계좌 안의 과세 대상 이익과 인정되는 손실을 통산해 세금을 계산하는 계좌입니다. 요건을 충족하면 일반형은 순이익 <strong>200만원</strong>, 서민형·농어민형은 <strong>400만원</strong>까지 비과세이고 초과분은 지방소득세 포함 <strong>9.9%</strong>로 분리과세합니다.</p>
        <p>비과세 한도는 매년 새로 생기는 한도가 아닙니다. 금융상품별 과세 방식과 손익통산 범위가 다르며, ISA라는 이유로 투자 원금이나 수익률이 보장되지는 않습니다.</p>
      </section>

      <section>
        <h2>가입·납입 조건과 계좌 유형</h2>
        <ul>
          <li>19세 이상 거주자 또는 직전 과세기간에 근로소득이 있는 15세 이상 거주자가 가입할 수 있으며, 1인 1계좌가 원칙입니다.</li>
          <li>직전 3개 과세기간 중 금융소득 종합과세 대상이었던 경우 가입·연장이 제한됩니다.</li>
          <li>납입한도는 연 2,000만원·총 1억원이며 미사용 연간 한도는 이월할 수 있습니다. 세제 혜택을 위한 의무기간은 3년입니다.</li>
          <li>서민형·농어민형의 소득·유형 요건은 가입 또는 연장 시점에 금융기관에서 확인하세요.</li>
        </ul>
        <table>
          <thead><tr><th>유형</th><th>운용 방식</th><th>확인할 점</th></tr></thead>
          <tbody>
            <tr><td>중개형</td><td>가입자가 직접 매매</td><td>편입 가능 상품·거래 비용</td></tr>
            <tr><td>신탁형</td><td>가입자의 운용 지시에 따라 운용</td><td>예금 등 편입 가능 상품·신탁보수</td></tr>
            <tr><td>일임형</td><td>금융회사가 위임받아 운용</td><td>운용전략·위험등급·일임보수</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>과세 대상 순수익 1,000만원의 세금 예시</h2>
        <p>가입 요건을 충족한 ISA를 정상 해지하고, 양쪽 계좌에서 같은 1,000만원의 과세 대상 이자·배당 수익이 발생했다고 가정합니다. 수수료·손실·중간 과세·금융소득 종합과세는 제외한 단순 비교입니다.</p>
        <table>
          <thead><tr><th>구분</th><th>계산식</th><th>세금</th></tr></thead>
          <tbody>
            <tr><td>일반계좌</td><td>1,000만원 × 15.4%</td><td>154만원</td></tr>
            <tr><td>ISA 일반형</td><td>(1,000만원 − 200만원) × 9.9%</td><td>79만 2,000원</td></tr>
            <tr><td>ISA 서민형·농어민형</td><td>(1,000만원 − 400만원) × 9.9%</td><td>59만 4,000원</td></tr>
          </tbody>
        </table>
        <p>일반형의 세금 차이는 74만 8,000원입니다. 이 예시는 수익률 예측이 아니며, 일반계좌에서도 비과세인 국내 상장주식 매매차익 등에 그대로 적용할 수 없습니다.</p>
      </section>

      <section>
        <h2>중도인출과 중도해지는 다릅니다</h2>
        <p>납입 원금 범위 내 인출과 계좌 해지는 구분해야 합니다. 3년 전에 중도해지하면 원칙적으로 세제 혜택이 추징되며, 납입액을 초과해 인출하는 경우에도 중도해지로 볼 수 있습니다.</p>
        <p>사망·해외이주 등 법령상 부득이한 사유는 예외가 있을 수 있습니다. 인출 전 금융기관에 사유·증빙·세금과 납입한도 처리 방식을 확인하세요.</p>
      </section>

      <section>
        <h2>비교할 때 확인할 세 가지</h2>
        <ul>
          <li>3년 안에 사용할 자금인지, 중도해지 가능성이 있는지 확인하세요.</li>
          <li>편입 상품의 원금 손실 위험·수수료·예금자보호 여부를 확인하세요.</li>
          <li>계좌에 넣을 상품이 일반계좌에서 실제로 과세되는 상품인지 비교하세요.</li>
        </ul>
      </section>

      <section>
        <h2>연금계좌와 함께 사용할 수 있나요?</h2>
        <p>가입 요건을 충족하면 ISA와 연금저축·IRP를 함께 이용할 수 있습니다. 연금계좌는 인출 제한과 과세 조건이 달라 자금 사용 시점도 비교해야 합니다.</p>
        <p>ISA 만기자금의 연금계좌 전환 요건을 충족하면 전환액의 10%, 최대 300만원이 추가 세액공제 대상 납입한도가 됩니다. <strong>300만원을 환급한다는 뜻은 아닙니다.</strong> 실제 공제액은 소득별 공제율과 산출세액 등에 따라 달라집니다.</p>
      </section>
    </GuideArticle>
  )
}
