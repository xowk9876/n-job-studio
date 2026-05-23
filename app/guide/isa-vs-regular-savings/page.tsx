import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'isa-vs-regular-savings'
const title = 'ISA vs 일반계좌 10년 시뮬레이션 — 얼마나 유리한가'
const description =
  'ISA 비과세 한도 500만 원과 9.9% 분리과세의 실제 절세 효과를 10년 시뮬레이션으로 비교. 중개형·신탁형·일임형 선택 기준과 만기 이전 인출 시 주의사항까지.'
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
        <h2>ISA 계좌가 뭐고 왜 유리한가</h2>
        <p>
          ISA(Individual Savings Account, 개인종합자산관리계좌)는 한 계좌 안에서 예·적금, 펀드, ETF,
          국내주식(중개형)을 운용할 수 있고, 3년 이상 의무 가입 후 <strong>순이익 500만 원까지 비과세</strong>,
          초과분은 <strong>9.9%</strong>로 분리과세되는 절세 상품입니다. 일반 계좌의 이자소득세 15.4%보다
          훨씬 유리합니다(조세특례제한법 제91조의18).
        </p>
      </section>

      <section>
        <h2>유형별 차이</h2>
        <table>
          <thead>
            <tr><th>유형</th><th>운용 주체</th><th>가입처</th><th>추천 대상</th></tr>
          </thead>
          <tbody>
            <tr><td>중개형</td><td>가입자 직접 운용(국내주식 가능)</td><td>증권사</td><td>직접 투자 선호</td></tr>
            <tr><td>신탁형</td><td>가입자 지시 + 금융사 운용</td><td>은행·증권사</td><td>예·적금 중심</td></tr>
            <tr><td>일임형</td><td>금융사 일임 운용</td><td>증권사</td><td>초보·귀찮음</td></tr>
          </tbody>
        </table>
        <p>연간 납입 한도 4,000만 원, 총 2억 원까지 납입 가능합니다.</p>
      </section>

      <section>
        <h2>10년 시뮬레이션 — 연 4% 수익률 가정</h2>
        <p>
          매년 말 2,000만 원씩 10년간 납입, 복리 연 4% 재투자 가정(연금 미래가치 공식 FV = PMT ×
          [(1+r)^n − 1] / r):
        </p>
        <ul>
          <li>총 납입 원금: 2억 원</li>
          <li>10년 뒤 평가액: 약 2억 4,012만 원</li>
          <li>총 수익: 약 <strong>4,012만 원</strong></li>
        </ul>
        <h3>일반계좌(이자·배당소득세 15.4%)</h3>
        <ul>
          <li>세금: 4,012만 원 × 15.4% ≈ <strong>약 618만 원</strong></li>
          <li>세후 수익: 약 3,394만 원</li>
        </ul>
        <h3>ISA 일반형(비과세 500만 원 + 초과분 9.9% 분리과세)</h3>
        <ul>
          <li>비과세 구간: 500만 원</li>
          <li>과세 구간: 3,512만 원 × 9.9% ≈ <strong>약 348만 원</strong></li>
          <li>세후 수익: 약 3,664만 원</li>
        </ul>
        <p>
          이 단순 비교만으로 <strong>약 270만 원</strong>이 남습니다. 서민형(총급여 5,000만 원 이하 등)
          가입자는 비과세 한도가 1,000만 원으로 늘어 절세폭이 더 커집니다. 금융소득 종합과세(연 2,000만 원
          초과) 대상이거나 고소득 구간일수록 ISA의 분리과세 가치가 커집니다.
        </p>
      </section>

      <section>
        <h2>만기 전에 인출하면 어떻게 되나</h2>
        <p>
          3년 의무 기간을 채우기 전에 전액 해지하면 <strong>비과세 혜택이 모두 박탈</strong>되어 일반
          과세(15.4%)로 재산정됩니다. 부분 인출은 원금 한도 내에서만 가능하며, 수익 부분은 해지 시점까지
          기다려야 비과세 한도를 활용할 수 있습니다.
        </p>
        <p>
          부득이한 인출 사유(사망·해외이주·질병·노령·천재지변·금융회사 파산 등)에 해당하면 조세특례
          제한법 시행령 제93조의6에 따라 불이익 없이 해지 가능합니다.
        </p>
      </section>

      <section>
        <h2>어떤 사람에게 유리한가</h2>
        <ul>
          <li><strong>예·적금 중심의 안정 추구형</strong> — 이자소득 500만 원만 벌어도 연 77만 원 절세</li>
          <li><strong>배당 ETF 장기 보유자</strong> — 분배금 비과세로 복리 효과 극대화</li>
          <li><strong>연 금융소득 2,000만 원 근접</strong> — 종합과세 회피 효과</li>
        </ul>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>연금저축·IRP와 중복 가입 가능한가요?</h3>
        <p>
          가능합니다. 세액공제(연금저축·IRP)와 과세이연(ISA)은 별개 혜택이므로 병행하는 것이 가장
          유리합니다.
        </p>
        <h3>만기 후 연금저축으로 이체하면 추가 혜택이 있나요?</h3>
        <p>
          ISA 만기 자금을 연금저축·IRP로 이체하면 이체액의 10%(한도 300만 원)를 추가 세액공제 받을 수
          있습니다(조세특례제한법 제91조의18 제4항).
        </p>
      </section>
    </GuideArticle>
  )
}
