import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'
const slug = 'dsr-stress-test-2026'
const title = '2026 스트레스 DSR 3단계 완전 정리 — 한도 축소 폭과 대응 전략'
const description =
  '2026년 7월부터 전면 시행되는 스트레스 DSR 3단계. 가산금리 0.75%p 적용 방식과 주담대·신용대출별 한도 축소 폭을 사례로 정리합니다.'

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
      tag="대출"
      tagColor="#5eead4"
      updatedAt="2026-01-08"
      related={[
        { href: '/mortgage', label: '대출 이자 계산기' },
        { href: '/guide/isa-vs-regular-savings', label: 'ISA vs 일반계좌 시뮬레이션' },
      ]}
    >
      <section>
        <h2>스트레스 DSR이란</h2>
        <p>
          DSR(Debt Service Ratio, 총부채원리금상환비율)은 연 소득 대비 연간 총 원리금 상환액 비율입니다.
          현재 은행권은 40%, 2금융권은 50% 한도를 적용합니다. <strong>스트레스 DSR</strong>은 이 산식에
          가상의 &quot;가산금리&quot;를 얹어 한도를 더 빡빡하게 잡는 규제로, 금리 인상 충격에 대비해
          2024년 2월 금융위원회가 도입했습니다.
        </p>
      </section>

      <section>
        <h2>단계별 적용 일정과 가산금리</h2>
        <table>
          <thead>
            <tr><th>단계</th><th>시행일</th><th>가산금리</th></tr>
          </thead>
          <tbody>
            <tr><td>1단계</td><td>2024.2.26~</td><td>0.38%p (실제의 25%)</td></tr>
            <tr><td>2단계</td><td>2024.9.1~</td><td>0.75%p × 50% = 0.375~0.75%p</td></tr>
            <tr><td>3단계</td><td>2026.7.1~</td><td>0.75%p 전면(100%) 적용</td></tr>
          </tbody>
        </table>
        <p>
          2026년 3단계부터는 가산금리가 <strong>전 대출·전 구간 0.75%p로 전면 적용</strong>됩니다.
          수도권 주담대는 이 수치를 그대로 반영하고, 비수도권은 완화 조치가 유지될 가능성이 있어
          금융위 공지를 확인해야 합니다.
        </p>
      </section>

      <section>
        <h2>한도 축소 실제 사례</h2>
        <p>연 소득 6,000만 원, 30년 만기 원리금균등, 기존 금리 4.0% 주담대 기준:</p>
        <ul>
          <li>스트레스 적용 전 — 대출 한도 약 5억 600만 원</li>
          <li>2단계(0.375%p) — 약 4억 8,300만 원 (−약 2,300만 원)</li>
          <li>3단계(0.75%p) — 약 <strong>4억 6,100만 원</strong> (−약 4,500만 원)</li>
        </ul>
        <p>
          실제 한도는 머니핏 <a href="/mortgage">대출 이자 계산기</a>에 본인 소득·기존 부채를 넣고
          월 상환액이 소득의 40%(DSR 한도)를 넘지 않는 대출 원금을 역산해 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>적용 대상 대출</h2>
        <ul>
          <li>주택담보대출(은행·보험·저축은행)</li>
          <li>신용대출(만기 이상 5년 차감 기준 적용)</li>
          <li>전세자금대출 중 유주택자 대출</li>
          <li>마이너스통장 한도 내 사용분</li>
        </ul>
        <p>
          중도금 대출, 서민금융상품(디딤돌·보금자리), 소액 전세자금대출은 제외 혹은 완화 적용입니다
          (금융위 &quot;스트레스 DSR 세부 운영기준&quot; 참고).
        </p>
      </section>

      <section>
        <h2>한도를 최대한 지키는 전략</h2>
        <ol>
          <li>
            <strong>만기를 늘려라</strong> — 주담대 30년 → 40년(일부 은행)으로 바꾸면 월 상환액이 줄어
            DSR 여력이 생깁니다. 단, 총 이자는 늘어납니다.
          </li>
          <li>
            <strong>고정금리 상품 선택</strong> — 일부 은행은 고정금리 대출에 대해 가산금리를 일부 차감
            합니다.
          </li>
          <li>
            <strong>기존 신용대출 정리</strong> — 마이너스통장 미사용 한도도 DSR에 포함됩니다. 사용하지
            않는 한도는 미리 줄이는 것이 유리합니다.
          </li>
          <li>
            <strong>부부 합산 소득 활용</strong> — 공동명의·연대보증 형태로 합산 가능. 다만 채무도 공동
            으로 산정됩니다.
          </li>
        </ol>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>기존 대출도 스트레스 DSR 재계산되나요?</h3>
        <p>
          기존 대출의 상환 방식·금리를 바꾸지 않으면 소급 적용되지 않습니다. 다만 <strong>증액·연장·재약정
          </strong>을 신청하는 순간 3단계 기준으로 재산정됩니다.
        </p>
        <h3>금리 인하요구권을 행사하면 한도가 늘어나나요?</h3>
        <p>
          이미 체결된 대출에 대해서는 한도가 자동 재산정되지 않습니다. 신규 대출·대환 시점에만 변경된
          금리가 반영됩니다.
        </p>
      </section>
    </GuideArticle>
  )
}
