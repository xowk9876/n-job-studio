import { calcMortgage, type RepaymentType } from '@/lib/mortgage'
import { calcJeonse } from '@/lib/jeonse'
import { ExamplesSection } from '@/components/ui/PageContent'

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`
const cell = 'border-b border-[color:var(--line)] px-2 py-3 text-left align-top [overflow-wrap:anywhere] sm:px-4'

const repaymentMethods: { type: RepaymentType; label: string }[] = [
  { type: 'equal-payment', label: '원리금균등' },
  { type: 'equal-principal', label: '원금균등' },
  { type: 'bullet', label: '만기일시' },
]
const mortgageExamples = repaymentMethods.map(({ type, label }) => ({
  label,
  result: calcMortgage({ principal: 300_000_000, annualRate: 4, years: 30, type }),
}))

export function MortgageExamples() {
  return (
    <section aria-labelledby="mortgage-examples-heading">
      <h2 id="mortgage-examples-heading" className="scroll-mt-36 font-display text-[22px] md:text-[28px] font-bold tracking-tight text-white mb-3">
        3억 주담대, 상환 방식별 월 납입액 비교
      </h2>
      <p className="text-[14px] leading-relaxed text-[color:var(--sub)] mb-5">
        대출 3억원을 연 4%로 30년 동안 빌린다고 가정한 예시입니다. 아래 표의 조건은 위 계산기에 입력한 값과 별개로 고정되어 있습니다.
      </p>
      <div className="card p-3 sm:p-5">
        <table className="w-full table-fixed text-[11px] sm:text-[14px] tabular-nums">
          <caption className="text-left text-[color:var(--sub)] pb-3">대출금 3억원 · 연 4% 고정 가정 · 360개월 (단위: 원)</caption>
          <colgroup><col className="w-[28%]" /><col className="w-[32%]" /><col className="w-[40%]" /></colgroup>
          <thead className="text-[color:var(--ink-2)]">
            <tr><th scope="col" className={cell}>상환 방식</th><th scope="col" className={cell}>첫 달 납입액</th><th scope="col" className={cell}>30년 총이자</th></tr>
          </thead>
          <tbody className="text-white">
            {mortgageExamples.map(({ label, result }) => (
              <tr key={label}>
                <th scope="row" className={`${cell} font-medium`}>{label}</th>
                <td className={`${cell} whitespace-nowrap`}>{result.monthlyPayment.toLocaleString('ko-KR')}</td>
                <td className={`${cell} whitespace-nowrap`}>{result.totalInterest.toLocaleString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed mt-4">
          원리금균등은 월 납입액이 일정하고 마지막 달에 반올림 차이를 조정합니다. 원금균등은 첫 달 부담이 크고 이후 줄어듭니다. 만기일시는 매달 이자를 내고, 마지막 달에는 원금 3억원도 함께 갚습니다.
        </p>
        <p className="text-[12.5px] text-[color:var(--muted)] leading-relaxed mt-3">
          연 4%는 비교용 가정이며 현재 판매 금리가 아닙니다. 금리 변동·중도상환·수수료는 제외했고, 월별 원 단위 반올림을 적용했습니다. 실제 약정의 일수 계산과 상환 조건에 따라 금액이 달라질 수 있습니다.
        </p>
      </div>
    </section>
  )
}

const monthlyExample = calcJeonse({ direction: 'jeonse-to-wolse', jeonsDeposit: 300_000_000, wolseDeposit: 50_000_000, conversionRate: 5 })
const depositExample = calcJeonse({ direction: 'wolse-to-jeonse', currentWolseDeposit: 50_000_000, currentWolse: 900_000, conversionRate: 5 })
const depositDifferences = [10_000_000, 30_000_000, 50_000_000].map(difference => ({
  difference,
  result: calcJeonse({ direction: 'jeonse-to-wolse', jeonsDeposit: difference, wolseDeposit: 0, conversionRate: 5 }),
}))

export function JeonseExamples() {
  return (
    <>
      <ExamplesSection title="보증금·월세를 바꿔 보는 계산 예시" items={[
        { label: '전세 3억원 → 월세 · 연 5% 가정', input: '월세 보증금 5,000만원 유지', result: `월세 ${won(monthlyExample.monthlyRent!)}`, note: '(3억원 − 5,000만원) × 5% ÷ 12' },
        { label: '보증금 5,000만원·월세 90만원 → 전세', input: '연 전환율 5% 가정', result: `전세 환산액 ${won(depositExample.jeonseDeposit!)}`, note: '5,000만원 + (90만원 × 12 ÷ 5%) = 2억 6,600만원 · 협의용 참고값' },
      ]} />
      <section aria-labelledby="deposit-comparison-heading">
        <h2 id="deposit-comparison-heading" className="font-display text-[22px] md:text-[28px] font-bold tracking-tight text-white mb-3">
          보증금 5,000만원을 줄이면 월세는 얼마일까?
        </h2>
        <p className="text-[14px] leading-relaxed text-[color:var(--sub)] mb-5">
          월세로 바꾸는 금액은 남겨 두는 보증금이 아니라 줄어드는 보증금의 차액입니다. 연 5%를 가정하면 5,000만원 차액은 월 약 {won(depositDifferences[2].result.monthlyRent!)}에 해당합니다.
        </p>
        <div className="card p-3 sm:p-5">
          <table className="w-full table-fixed text-[13px] sm:text-[14px] tabular-nums">
            <caption className="text-left text-[color:var(--sub)] pb-3">보증금 차액 × 연 5% ÷ 12개월</caption>
            <thead className="text-[color:var(--ink-2)]"><tr><th scope="col" className={cell}>줄어드는 보증금</th><th scope="col" className={cell}>월세 환산액</th></tr></thead>
            <tbody className="text-white">
              {depositDifferences.map(({ difference, result }) => (
                <tr key={difference}><th scope="row" className={`${cell} font-medium`}>{won(difference)}</th><td className={cell}>{won(result.monthlyRent!)}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-[12.5px] leading-relaxed text-[color:var(--muted)] mt-4">
            위 예시는 전환율을 연 5%로 고정한 계산이며 계약 금액을 정해 주는 값이 아닙니다. 실제 적용 전환율과 계약 조건은 별도로 확인하세요. 월세→전세 환산액도 법정 보증금이나 시세를 뜻하지 않습니다.
          </p>
        </div>
      </section>
    </>
  )
}
