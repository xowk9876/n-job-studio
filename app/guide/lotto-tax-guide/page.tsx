import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'lotto-tax-guide'
const title = '로또 당첨금 세금·수령 완전 가이드 — 원천징수 구간과 실수령액 계산'
const description =
  '로또 1등 당첨 시 실제 수령액은? 소득세법상 기타소득 원천징수 22% · 33% 구간과 신고 의무, 익명 수령 절차까지 정확히 정리합니다.'
const updatedAt = CONTENT_UPDATED_AT

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '복권' })

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="복권"
      tagColor="#f590c0"
      updatedAt={updatedAt}
      related={[
        { href: '/lotto', label: '로또 번호 생성기' },
        { href: '/guide/isa-vs-regular-savings', label: '당첨금 운용 — ISA 가이드' },
      ]}
    >
      <section>
        <h2>로또 당첨금은 어떤 소득으로 과세되나</h2>
        <p>
          <strong>복권및복권기금법 제5조</strong>와 <strong>소득세법 제21조 제1항 제2호</strong>에 따라
          복권 당첨금은 <strong>기타소득</strong>으로 분류됩니다. 일반적인 기타소득 원천징수율이 22%
          (소득세 20% + 지방소득세 2%)인데, 복권은 <strong>당첨금 규모에 따라 분리과세율이 달라진다</strong>
          는 점이 특징입니다.
        </p>
      </section>

      <section>
        <h2>원천징수 구간</h2>
        <table>
          <thead>
            <tr><th>당첨금 구간</th><th>세율(지방세 포함)</th><th>근거</th></tr>
          </thead>
          <tbody>
            <tr><td>200만 원 이하</td><td>비과세</td><td>소득세법 제14조 제3항(2023.1 개정)</td></tr>
            <tr><td>200만 원 초과 ~ 3억 원 이하</td><td>22%</td><td>소득세 20% + 지방세 2%</td></tr>
            <tr><td>3억 원 초과분</td><td>33%</td><td>소득세 30% + 지방세 3%</td></tr>
          </tbody>
        </table>
        <p>
          주의할 점은 <strong>3억 원 초과 &quot;부분&quot;</strong>만 33%로 과세된다는 것입니다. 당첨금
          전액이 33%로 빠지는 것이 아닙니다.
        </p>
      </section>

      <section>
        <h2>1등 20억 원 당첨 시 실수령액</h2>
        <ul>
          <li>200만 원까지: 비과세</li>
          <li>200만 원 초과 ~ 3억 원: (3억 − 200만) × 22% = 6,556만 원 세금</li>
          <li>나머지 17억 원: 17억 × 33% = 5억 6,100만 원 세금</li>
          <li>총 세금: <strong>약 6억 2,656만 원</strong></li>
          <li>실수령액: 20억 − 약 6억 2,656만 = <strong>약 13억 7,344만 원</strong></li>
        </ul>
        <p>
          1등 평균 당첨금이 약 20억 원대일 때 실제 통장에 들어오는 금액은 약 13억 7,300만 원 선입니다.
          분할 당첨(예: 당첨자 3명)의 경우 1인당 수령액이 줄어 세율 적용 구간이 낮아질 수 있습니다.
        </p>
      </section>

      <section>
        <h2>수령 절차</h2>
        <ol>
          <li>
            <strong>1~3등</strong> — 농협은행 전국 지점(평일 9~16시) 또는 농협은행 본점(서울 서대문구)
            에서 수령. 200만 원 이하는 시중 은행 및 편의점 일부에서도 가능.
          </li>
          <li>
            필요 서류: 당첨 복권 원본, 신분증, 본인 명의 통장, 도장(또는 서명).
          </li>
          <li>
            세금은 지급 시점에 <strong>원천징수 후 입금</strong>됩니다. 별도 신고·납부 절차 없음.
          </li>
          <li>
            수령 기한은 <strong>당첨일로부터 1년</strong>(복권및복권기금법 제11조). 기한 경과 시 당첨금은
            복권기금으로 귀속됩니다.
          </li>
        </ol>
      </section>

      <section>
        <h2>익명·안전 수령 팁</h2>
        <ul>
          <li>당첨 복권 뒷면에 본인 서명을 즉시 해두면 분실·도난 시 소유권 입증 용이</li>
          <li>수령 시 사진·신원 노출이 부담스러우면 본점 VIP실 수령 예약 가능(개인정보 비공개 옵션)</li>
          <li>SNS·주변 언급 자제 — 사기·협박 범죄 표적이 될 수 있음</li>
          <li>대리 수령은 원칙적으로 위임장+인감증명서+대리인 신분증 필요</li>
        </ul>
      </section>

      <section>
        <h2>종합소득세 신고는 필요 없나?</h2>
        <p>
          분리과세로 끝납니다(소득세법 제14조 제3항 제8호). 원천징수로 과세가 완결되므로 별도의 종합
          소득세 신고 의무는 없습니다. 다만 당첨금을 예·적금이나 주식 배당으로 운용해 <strong>연 금융
          소득 2,000만 원을 초과</strong>하면 그 금융소득은 종합과세 대상이 됩니다.
        </p>
      </section>

      <section>
        <h2>당첨 후 자산 관리 3원칙</h2>
        <ol>
          <li>수령 직후 최소 1개월은 큰 의사결정(부동산 매입·창업) 보류</li>
          <li>
            예금자보호 한도(2025.9.1 시행, 금융기관·보험사·증권사 등 <strong>1인당 1억 원</strong>)를 감안해{' '}
            <strong>여러 금융기관에 분산</strong>. 국고채·MMF 같은 단기 안전자산 병행.
          </li>
          <li>
            세무사·변호사·PB(Private Banker) 등 전문가 자문 1회 이상. 증여·상속 설계까지 함께 검토하면
            추가 절세 가능.
          </li>
        </ol>
      </section>

      <section>
        <h2>자주 묻는 질문</h2>
        <h3>연금복권처럼 매월 지급되는 경우 세금은?</h3>
        <p>
          동일하게 기타소득으로 과세되며 지급 시마다 원천징수됩니다. 월 700만 원·20년 지급 상품의 경우
          매 지급분에서 22%가 차감됩니다.
        </p>
        <h3>당첨금을 가족에게 나눠주면 증여세가 발생하나요?</h3>
        <p>
          네. 10년 합산 배우자 6억, 성인 자녀 5,000만 원, 미성년 자녀 2,000만 원을 초과하는 금액은 증여세
          부과 대상입니다(상속세 및 증여세법 제53조).
        </p>
      </section>
    </GuideArticle>
  )
}
