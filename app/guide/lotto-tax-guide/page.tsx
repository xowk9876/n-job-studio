import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, LOTTO_GUIDE_UPDATED_AT } from '@/lib/seo'

const slug = 'lotto-tax-guide'
const title = '로또 당첨금 세금과 수령 절차'
const description =
  '200만원 과세최저한, 22%·33% 원천징수 구간, 구매 방식별 지급처와 수령 기한을 확인합니다.'
const updatedAt = LOTTO_GUIDE_UPDATED_AT

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
      ]}
    >
      <section>
        <h2>로또 당첨금은 어떤 소득으로 과세되나</h2>
        <p>
          <strong>소득세법 제21조 제1항 제2호</strong>에 따라
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
            <tr><td>200만 원 이하</td><td>비과세</td><td>소득세법 제84조(건별 과세최저한)</td></tr>
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
          <li>200만 원은 공제액이 아닌 과세최저한입니다. 이를 넘으면 200만 원을 빼지 않습니다.</li>
          <li>3억 원까지: 3억 × 22% = 6,600만 원 세금</li>
          <li>나머지 17억 원: 17억 × 33% = 5억 6,100만 원 세금</li>
          <li>총 세금: <strong>약 6억 2,700만 원</strong></li>
          <li>실수령액: 20억 − 약 6억 2,700만 = <strong>약 13억 7,300만 원</strong></li>
        </ul>
        <p>
          위 예시는 복권 구입비의 필요경비 처리와 원 단위 절사를 생략한 개략 계산입니다.
          분할 당첨(예: 당첨자 3명)의 경우 1인당 수령액이 줄어 세율 적용 구간이 낮아질 수 있습니다.
        </p>
      </section>

      <section>
        <h2>수령 절차</h2>
        <ol>
          <li>
            <strong>판매점에서 구입한 복권</strong>을 직접 수령할 때는 당첨 복권 원본이 필요합니다.
            1등은 NH농협은행 본점, 2·3등은 NH농협은행 지점, 4·5등은 로또 판매점에서 받습니다.
          </li>
          <li>
            <strong>인터넷 구매분</strong>은 200만 원 이하일 때 동행복권 예치금으로 자동 입금됩니다.
            그보다 큰 당첨금은 당첨 복권 번호와 신분증을 준비해 등위별 NH농협은행 지급처를 방문하세요.
          </li>
          <li>
            <strong>미리 페이코 복권지갑에 등록한 판매점 구매분</strong>은 1238회부터 미수령 당첨금을
            지급기한 당일에 전자 지급합니다. 200만 원 이하는 페이코 포인트로 받고,
            초과분은 실명 인증과 계좌 등록을 마친 뒤 본인 명의 계좌로 받습니다.
          </li>
          <li>
            수령 기한은 <strong>지급개시일로부터 1년</strong>(복권및복권기금법 제11조). 기한 경과 시 당첨금은
            복권기금으로 귀속됩니다.
          </li>
        </ol>
      </section>

      <section>
        <h2>수령 전 확인할 점</h2>
        <ul>
          <li>실물 복권 원본을 안전하게 보관하세요. 사진·서명만으로 분실 복권의 지급이 보장되지는 않습니다.</li>
          <li>은행에서 필요한 본인 확인과 당첨 사실의 대외 공개는 별개입니다. 복권번호·신분증·계좌 정보를 공개하지 마세요.</li>
          <li>대리 수령 등 예외적인 상황은 지급기관에 먼저 문의하세요.</li>
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
        <h2>수령 후 세금·보호 범위 확인</h2>
        <p>당첨금 원천징수와 이후 발생하는 이자·배당·증여의 과세는 별개입니다. 예금 등 보호 대상 상품은 원금과 소정의 이자를 합해 금융회사별 1인당 1억원까지 보호되며, 펀드 등 투자상품 전체가 보호되는 것은 아닙니다.</p>
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
          증여세 검토가 필요합니다. 거주자의 일반적인 증여재산공제는 10년 합산 배우자 6억원, 직계존속으로부터 받는 성인 5,000만원·미성년자 2,000만원 등입니다. 기존 증여, 가족관계, 별도 공제 요건에 따라 달라지므로 나누어 주기 전에 확인하세요.
        </p>
      </section>
    </GuideArticle>
  )
}
