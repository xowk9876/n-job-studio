import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'
const slug = '2026-salary-tax-guide'
const title = '2026년 연봉 실수령액 완전 가이드 — 4대보험 요율·간이세액표 총정리'
const description =
  '2026년 개정된 건강보험료율(7.19%)과 국민연금·고용보험·근로소득 간이세액표를 반영해 연봉별 실수령액 공식과 예시를 정리합니다.'

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
      tag="세금"
      tagColor="#60a5fa"
      updatedAt="2026-01-05"
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
          비과세 식대(월 20만 원 한도), 건강보험 피부양자 유무에 따라 월 실수령액이 최대 15만 원까지
          벌어집니다. 이 글은 2026년 기준으로 공제 항목 하나하나의 계산 근거를 짚고, 직접 엑셀에 옮겨
          쓸 수 있는 공식을 제공합니다.
        </p>
      </section>

      <section>
        <h2>2026년 4대보험 요율</h2>
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
            <tr><td>국민연금</td><td>9.0%</td><td>4.5%</td><td>국민연금법 제88조</td></tr>
            <tr><td>건강보험</td><td>7.19%</td><td>3.595%</td><td>2026년 보건복지부 고시</td></tr>
            <tr><td>장기요양</td><td>건보료의 12.95%</td><td>건보료의 6.475%</td><td>노인장기요양보험법</td></tr>
            <tr><td>고용보험</td><td>1.8%</td><td>0.9%</td><td>고용보험법 시행령</td></tr>
          </tbody>
        </table>
        <p>
          2026년 건강보험료율은 2025년 대비 0.04%p 소폭 인상되었고, 장기요양보험율은 건강보험료 대비
          비율로 유지되었습니다. 국민연금·고용보험은 동결입니다.
        </p>
      </section>

      <section>
        <h2>소득세·지방소득세 계산 방식</h2>
        <p>
          매달 급여에서 빠지는 소득세는 연말정산 전 <strong>간이세액표</strong>에 따라 원천징수됩니다.
          소득세법 제134조와 시행령 제189조에 따라 국세청이 매년 고시하며, 월 급여(비과세 제외) ·
          공제대상 부양가족 수(본인 포함) 두 축으로 세액이 결정됩니다. 지방소득세는 소득세의 10%로
          함께 공제됩니다.
        </p>
        <blockquote>
          <p>
            <strong>TIP</strong> — 간이세액표는 신청 시 80%·100%·120% 세 가지 비율 중 선택할 수
            있습니다. 120%로 올리면 월 실수령액은 줄지만 연말정산 때 환급이 커집니다.
          </p>
        </blockquote>
      </section>

      <section>
        <h2>연봉 5,000만 원 실전 계산</h2>
        <p>독신·부양가족 1명(본인) 기준, 비과세 식대 240만 원/년 반영 시:</p>
        <ul>
          <li>과세 급여 총액: 50,000,000 − 2,400,000 = 47,600,000원</li>
          <li>월 과세 급여: 3,966,667원</li>
          <li>국민연금: 3,966,667 × 4.5% = 178,500원</li>
          <li>건강보험: 3,966,667 × 3.595% = 142,601원</li>
          <li>장기요양: 142,601 × 12.95% = 18,466원</li>
          <li>고용보험: 3,966,667 × 0.9% = 35,700원</li>
          <li>근로소득세(간이세액표): 약 158,560원</li>
          <li>지방소득세: 15,850원</li>
        </ul>
        <p>
          총 공제액 약 549,677원. 여기에 식대 20만 원을 더한 월 실수령액은 약{' '}
          <strong>3,617,000원</strong>입니다. 머니핏{' '}
          <a href="/salary">연봉 실수령액 계산기</a>에서 본인 상황을 넣어 확인해보세요.
        </p>
      </section>

      <section>
        <h2>실수령액을 늘리는 합법적 방법 4가지</h2>
        <ol>
          <li>
            <strong>비과세 항목 최대 활용</strong> — 식대(월 20만 원), 자가운전보조금(월 20만 원, 본인
            차량 업무 사용 시), 출산·보육수당(월 20만 원 한도) 등을 급여 구조에 반영.
          </li>
          <li>
            <strong>연금저축·IRP</strong> — 합산 연 900만 원까지 세액공제 15%(총급여 5,500만 원 이하)
            또는 12%. 실질 환급액이 커집니다.
          </li>
          <li>
            <strong>ISA 계좌</strong> — 순이익 200만 원까지 비과세, 초과분도 9.9% 분리과세.{' '}
            <a href="/guide/isa-vs-regular-savings">ISA 완전 비교</a>에서 예시를 확인하세요.
          </li>
          <li>
            <strong>부양가족 등록 누락 점검</strong> — 연 소득 100만 원 이하(근로소득만 있을 경우 총
            급여 500만 원 이하) 부모·자녀·배우자를 빠짐없이 등록.
          </li>
        </ol>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>상여금은 어떻게 계산되나요?</h3>
        <p>
          상여금은 지급 월에 일시금으로 간이세액표에 따라 원천징수됩니다. 연 단위 합산 소득으로
          연말정산 때 정산되므로 월별 체감 공제율과 연간 실효세율은 다릅니다.
        </p>
        <h3>건강보험 피부양자 요건은?</h3>
        <p>
          연 소득 3,400만 원 이하(금융소득 포함), 재산세 과세표준 5.4억 원 이하 등. 요건 초과 시
          지역가입자로 전환되어 별도 보험료가 부과됩니다(국민건강보험법 시행규칙 별표 1의2).
        </p>
      </section>
    </GuideArticle>
  )
}
