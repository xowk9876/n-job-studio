import type { Metadata } from 'next'
import GuideArticle from '@/components/guide/GuideArticle'
import { buildGuideMetadata, CONTENT_UPDATED_AT } from '@/lib/seo'

const slug = 'jeonse-safety-2026'
const title = '전세 계약 전후 보증금 확인 체크리스트'
const description =
  '등기·선순위 권리·반환보증을 확인하고, 입주 후 대항력과 우선변제권을 갖추는 절차를 정리합니다.'
const updatedAt = CONTENT_UPDATED_AT

export const metadata: Metadata = buildGuideMetadata({ slug, title, description, updatedAt, section: '부동산' })

export default function Page() {
  return (
    <GuideArticle
      slug={slug}
      title={title}
      description={description}
      tag="부동산"
      tagColor="#fcc73e"
      updatedAt={updatedAt}
      related={[
        { href: '/jeonse', label: '전월세 전환 계산기' },
        { href: '/mortgage', label: '대출 이자 계산기' },
      ]}
    >
      <section>
        <h2>보증금 비율만으로 안전을 판단할 수 없습니다</h2>
        <p>시세가 충분해 보여도 선순위 채권, 다른 임차인의 보증금, 임대인의 체납, 신탁 등기에 따라 회수 가능액이 달라집니다. 아래 항목은 확인 순서이며 피해 예방이나 보증금 반환을 보장하는 기준은 아닙니다.</p>
      </section>

      <section>
        <h2>계약 전: 시세와 권리관계 확인</h2>
        <ol>
          <li><strong>시세:</strong> 국토교통부 실거래가와 주변 유사 주택의 거래를 비교하세요. 호가와 보증기관이 인정하는 주택가격은 다를 수 있습니다.</li>
          <li><strong>등기사항증명서:</strong> 소유자, 신탁, 압류·가압류, 근저당권을 확인하세요. 다가구주택은 다른 세입자의 선순위 보증금도 확인해야 합니다.</li>
          <li><strong>건축물대장:</strong> 실제 용도, 주거용 여부, 위반건축물 표시를 확인하세요.</li>
          <li><strong>임대인 정보:</strong> 확정일자 부여 현황과 국세·지방세 납세증명서 등 주택임대차보호법 제3조의7의 제시 대상 정보를 요청하세요.</li>
          <li><strong>반환보증:</strong> 계약금을 보내기 전에 해당 주택·보증금·계약 조건으로 신청할 수 있는지 보증기관에 확인하세요.</li>
        </ol>
      </section>

      <section>
        <h2>계약·잔금 지급 시: 증빙 남기기</h2>
        <ol>
          <li>계약 상대의 신분과 등기상 소유자를 대조하고, 대리 계약은 위임 범위와 서류를 확인하세요.</li>
          <li>새 담보권 설정 제한, 반환보증 가입이 거절될 경우의 처리 등 필요한 특약을 협의하세요. 특약만으로 제3자의 권리가 사라지는 것은 아닙니다.</li>
          <li>잔금 직전 등기를 다시 확인하고, 지급받을 권한이 확인된 계좌로 송금한 기록을 보관하세요.</li>
        </ol>
      </section>

      <section>
        <h2>입주 후: 전입신고·확정일자·반환보증</h2>
        <p><strong>주택 인도와 주민등록을 모두 갖춘 다음 날</strong> 대항력이 발생합니다. 우선변제권에는 이 대항요건과 확정일자가 필요합니다. 전입신고만 했거나 확정일자만 받은 상태와 구분하세요.</p>
        <ul>
          <li>HUG의 기본 보증금 요건은 수도권 7억원·그 외 5억원 이하입니다. 보증한도는 <strong>주택가격 × 90% − 선순위채권 등</strong>으로 산정하며 다른 가입 조건도 충족해야 합니다.</li>
          <li>신규 계약의 신청기한은 잔금지급일과 전입신고일 중 늦은 날부터 계약기간의 절반이 지나기 전입니다. 갱신 계약은 갱신 계약기간의 절반이 지나기 전까지입니다.</li>
          <li>보증료·주택가격 인정 방식·제출 서류는 주택과 신청 조건에 따라 달라집니다. 가입 완료 후 보증서를 보관하세요.</li>
          <li>계약을 끝내려면 묵시적 갱신을 피할 수 있도록 만료 2개월 전까지 종료 의사가 임대인에게 도달하도록 하고 증빙을 남기세요.</li>
        </ul>
      </section>

      <section>
        <h2>전월세 계산기로 확인할 수 있는 범위</h2>
        <p><a href="/jeonse">전월세 전환 계산기</a>는 보증금·월세 환산액과 입력 시세 대비 전세가율을 보여줍니다. 선순위 권리·체납·경매 낙찰가를 조사하거나 반환보증 가입을 판정하지 않습니다.</p>
        <p>법정 전환율 상한은 보증금을 월세로 바꾸는 경우에 관한 규정입니다. 월세를 전세로 역산한 결과가 임대인이 받아야 하는 법정 보증금은 아닙니다.</p>
      </section>

      <section>
        <h2>만료 후 보증금을 받지 못했다면</h2>
        <ol>
          <li>계약 종료 통지와 반환 요청이 도달했다는 증빙을 확보하세요.</li>
          <li>반환보증 가입자는 보증기관에 사고 접수·이행 청구 요건과 기한을 확인하세요.</li>
          <li>이사가 필요하다면 임차권등기명령을 검토하세요. <strong>신청만 하고 이사하지 말고 등기 완료 여부</strong>를 확인해야 기존 권리 보전에 도움이 됩니다.</li>
          <li>분쟁조정·지급명령·소송 중 상황에 맞는 절차를 상담하세요. 조정 수수료와 면제 여부는 접수 기관에서 확인하세요.</li>
        </ol>
      </section>

      <section>
        <h2>대출보증과 반환보증은 같은가요?</h2>
        <p>다릅니다. 전세대출의 보증과 임대인의 보증금 반환을 보장하는 상품은 보장 대상이 다릅니다. 전세대출이 있다는 이유만으로 보증금 반환까지 보장되지는 않으므로 보증서의 상품명과 보장 범위를 확인하세요.</p>
      </section>
    </GuideArticle>
  )
}
