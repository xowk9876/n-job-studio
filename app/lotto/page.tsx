'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, Trophy, Info, Copy, Check, Clock } from 'lucide-react'
import { FAQSection, TipsSection } from '@/components/ui/PageContent'

// ═══ 동행복권 회차 / 추첨시간 계산 ═══
// 1회차: 2002-12-07(토), 매주 토요일 20:45 추첨, 20:00 판매마감
const FIRST_DRAW = new Date('2002-12-07T20:45:00+09:00')

function getLottoInfo(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay()
  const daysUntilSat = (6 - day + 7) % 7
  const nextDraw = new Date(d)
  nextDraw.setDate(d.getDate() + daysUntilSat)
  nextDraw.setHours(20, 45, 0, 0)
  if (daysUntilSat === 0 && d.getTime() >= nextDraw.getTime()) {
    nextDraw.setDate(nextDraw.getDate() + 7)
  }
  const salesCloseAt = new Date(nextDraw.getTime() - 45 * 60 * 1000)
  const round = Math.floor((nextDraw.getTime() - FIRST_DRAW.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  return { round, nextDraw, salesCloseAt }
}

// ═══ 당첨 등위 ═══
const PRIZE_INFO = [
  { rank: 1, match: '6개 일치',        prob: '1 / 8,145,060', amount: '평균 약 20억원',   color: '#fbbf24' },
  { rank: 2, match: '5개 + 보너스볼',  prob: '1 / 1,357,510', amount: '평균 약 5,000만원', color: '#94a3b8' },
  { rank: 3, match: '5개 일치',        prob: '1 / 35,724',    amount: '평균 약 140만원',   color: '#f97316' },
  { rank: 4, match: '4개 일치',        prob: '1 / 733',       amount: '50,000원',          color: '#3b82f6' },
  { rank: 5, match: '3개 일치',        prob: '1 / 45',        amount: '5,000원',           color: '#10b981' },
]

// 동행복권 공 색상
function ballColor(n: number) {
  if (n <= 10) return 'bg-yellow-400 text-yellow-900'
  if (n <= 20) return 'bg-blue-500 text-white'
  if (n <= 30) return 'bg-red-500 text-white'
  if (n <= 40) return 'bg-gray-300 text-gray-900'
  return 'bg-green-500 text-white'
}

// 암호학적 난수 (균등분포 보정)
function secureRandomInt(maxExclusive: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive
    let r: number
    do { crypto.getRandomValues(arr); r = arr[0] } while (r >= limit)
    return r % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

function generateOneGame(): number[] {
  const set = new Set<number>()
  while (set.size < 6) set.add(secureRandomInt(45) + 1)
  return Array.from(set).sort((a, b) => a - b)
}

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
function formatDrawDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${WEEKDAY[d.getDay()]}) 20:45`
}
function formatCountdown(diffMs: number) {
  if (diffMs <= 0) return '추첨 중'
  const sec = Math.floor(diffMs / 1000)
  const days = Math.floor(sec / 86400)
  const hours = Math.floor((sec % 86400) / 3600)
  const mins = Math.floor((sec % 3600) / 60)
  if (days > 0) return `${days}일 ${hours}시간 남음`
  if (hours > 0) return `${hours}시간 ${mins}분 남음`
  return `${mins}분 남음`
}

export default function LottoPage() {
  const [mounted, setMounted] = useState(false)
  const [gameCount, setGameCount] = useState(5)
  const [games, setGames] = useState<number[][]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const info = useMemo(() => getLottoInfo(), [tick])

  const stats = useMemo(() => {
    if (games.length === 0) return null
    const all = games.flat()
    const odd = all.filter(n => n % 2 === 1).length
    const high = all.filter(n => n > 22).length
    const avgSum = Math.round(games.reduce((s, g) => s + g.reduce((a, b) => a + b, 0), 0) / games.length)
    return { odd, even: all.length - odd, high, low: all.length - high, avgSum }
  }, [games])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setCopiedIdx(null)
    setTimeout(() => {
      setGames(Array.from({ length: gameCount }, () => generateOneGame()))
      setIsSpinning(false)
    }, games.length === 0 ? 900 : 500)
  }, [isSpinning, games.length, gameCount])

  const handleCopy = useCallback(async (idx: number, nums: number[]) => {
    try {
      await navigator.clipboard.writeText(nums.join(', '))
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    } catch { /* noop */ }
  }, [])

  if (!mounted) return null

  const countdown = formatCountdown(info.nextDraw.getTime() - Date.now())
  const hasGames = games.length > 0

  return (
    <div className="calc-page">
      {/* 헤더 */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">LOTTO · 6/45</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">로또 번호 생성기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">
          제 {info.round.toLocaleString()}회차 · {formatDrawDate(info.nextDraw)} · {countdown}
        </p>
      </div>

      {/* 생성 카드 */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[12px] text-white/55 font-medium">게임 수</span>
          <div className="flex gap-1 bg-black/25 rounded-lg p-1">
            {[1, 3, 5].map(n => (
              <button
                key={n}
                onClick={() => setGameCount(n)}
                disabled={isSpinning}
                className={`px-3 py-1 rounded-md text-[12px] font-bold transition-colors ${
                  gameCount === n ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 번호 영역 */}
        <div className="flex flex-col gap-3 mb-6 min-h-[56px]">
          {!hasGames && !isSpinning && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/20 text-base font-bold">?</span>
                </div>
              ))}
            </div>
          )}
          {isSpinning && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 flex items-center justify-center text-white/50"
                  style={{ animation: `lotto-bounce 0.6s ease-in-out ${i * 0.08}s infinite` }}
                >
                  ···
                </div>
              ))}
            </div>
          )}
          {hasGames && !isSpinning && games.map((nums, gameIdx) => (
            <div
              key={gameIdx}
              className="flex items-center gap-2 mf-rise"
              style={{ animationDelay: `${gameIdx * 60}ms` }}
            >
              <span className="text-white/35 text-[11px] font-mono w-5 shrink-0">{String.fromCharCode(65 + gameIdx)}</span>
              <div className="flex gap-1.5 md:gap-2 flex-1 justify-center">
                {nums.map(num => (
                  <div
                    key={num}
                    className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${ballColor(num)} shadow-md flex items-center justify-center text-[13px] md:text-[15px] font-extrabold tabular`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCopy(gameIdx, nums)}
                className="shrink-0 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="번호 복사"
              >
                {copiedIdx === gameIdx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isSpinning}
          className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
            isSpinning ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-white/90'
          }`}
        >
          <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          {hasGames ? `다시 뽑기 (${gameCount}게임)` : `번호 뽑기 (${gameCount}게임)`}
        </button>

        {hasGames && !isSpinning && stats && (
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-[12px]">
            <div>
              <p className="text-white/50 mb-1">평균 합계</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.avgSum}</p>
            </div>
            <div>
              <p className="text-white/50 mb-1">홀:짝</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.odd}:{stats.even}</p>
            </div>
            <div>
              <p className="text-white/50 mb-1">저:고</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.low}:{stats.high}</p>
            </div>
          </div>
        )}
      </div>

      {/* 당첨 등위 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-[15px]">
          <Trophy className="w-4 h-4 text-amber-400" /> 당첨 등위
        </h2>
        <div className="flex flex-col gap-2">
          {PRIZE_INFO.map(p => (
            <div key={p.rank} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04]">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-extrabold text-[13px] shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-white">{p.rank}등 · {p.match}</span>
                  <span className="text-[12px] font-bold text-amber-300">{p.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-2.5 flex items-center gap-2 text-[14px]">
          <Info className="w-4 h-4 text-white/40" /> 알아두세요
        </h2>
        <ul className="text-[12.5px] text-white/60 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>실제 추첨과 무관하며 당첨을 보장하지 않습니다.</li>
          <li>추첨: 매주 토요일 20:45 / 판매마감: 토요일 20:00</li>
          <li>로또 구매는 만 19세 이상만 가능합니다.</li>
        </ul>
      </div>

      <FAQSection items={[
        { q: '로또 당첨금에 세금이 얼마나 부과되나요?', a: '복권 당첨금은 소득세법 제14조에 따라 기타소득으로 분리과세됩니다. 3억원 이하는 22%(소득세 20% + 지방소득세 2%), 3억원 초과분은 33%(소득세 30% + 지방소득세 3%)가 원천징수됩니다. 예: 1등 20억 당첨 시 세후 수령액 약 13억 4,200만원. 단, 5만원 이하(4등) 당첨금은 비과세.' },
        { q: '당첨금 수령 기한과 방법은?', a: '추첨일로부터 1년 이내에 수령하지 않으면 시효 소멸되어 복권기금으로 귀속됩니다(복권및복권기금법 제10조). 1~3등은 농협은행 본점에서만 수령 가능(신분증 + 당첨복권 원본), 4~5등은 판매점 또는 농협은행 지점. 5만원 초과는 영업일 기준 2~3일 내 계좌이체.' },
        { q: '자동 vs 수동, 당첨 확률 차이 있나요?', a: '통계적으로 차이 없습니다. 모든 조합은 수학적으로 동일한 확률을 가집니다. 다만 수동 선택 시 생년월일·특정 패턴으로 뽑는 사람이 많아, 만약 그런 번호가 당첨되면 당첨자 수가 많아 1등 분배금이 줄어드는 경향(확률의 독립성과 분배금은 별개).' },
        { q: '과거 당첨번호 분석이 의미가 있나요?', a: '없습니다. 매 회차 추첨은 완전히 독립적인 확률 이벤트이며, 과거 기록은 다음 회차 확률에 영향을 주지 않습니다(대수의 법칙·독립시행). 다만 심리적 안정을 위한 참고자료일 뿐, "잘 나온 번호"나 "안 나온 번호" 개념은 통계적 유의성이 없습니다.' },
        { q: '연금복권·스피또와 차이는?', a: '로또 6/45(동행복권) 1등 평균 20억원 일시금, 확률 1/814만. 연금복권 720+는 1등 월 700만원 × 20년(총 16.8억) 지급, 확률 1/315만. 스피또(즉석복권) 1000원권 1등 5~10억원, 확률 상품별 상이(1/50만~1/400만). 모두 22~33% 원천징수 동일.' },
        { q: '미성년자·공무원도 살 수 있나요?', a: '미성년자(만 19세 미만)는 판매·수령 모두 불가(복권및복권기금법 제6조). 공무원은 구매·당첨에 법적 제한 없으나 근무 중 도박 행위 금지(국가공무원법 제56조 품위유지의무) 및 내부 규정에 따름. 외국인도 국내에서 구매·수령 가능.' },
      ]} />

      <TipsSection title="로또 · 복권 합리적으로 즐기기" items={[
        { title: '월 소득의 1% 이내 원칙', desc: '재정학계에서는 복권을 "오락비용"으로 분류합니다. 월 소득의 1% 이내(월 3~10만원)에서 재미로만 구매하고, 생활비·비상금을 털어넣지 마세요. 기대값은 투자금의 약 50%(정부·복권기금이 46~50% 수취)로 장기 구매는 반드시 손실.' },
        { title: '자동 + 수동 혼합', desc: '당첨 확률은 동일하지만, 많은 사람이 선호하는 번호(1~31의 생일 숫자)를 피하면 당첨 시 분배금이 커집니다. 32~45 숫자를 2개 이상 포함하면 다인 당첨 리스크 감소. 홀/짝·고/저 균형(3:3 또는 4:2)은 통계적 의미 없음.' },
        { title: '세금까지 고려한 수령 계획', desc: '1등 당첨 시 즉시 사용 전에 세무사 상담 필수. 3억 초과분 33% 원천징수 후에도 증여세·상속세 대비 필요. 배우자 공동 수령 시 증여 아닌 공동소유로 처리해야 추가 세금 없음. 당첨 사실은 최대한 비공개(범죄·사기 표적).' },
        { title: '정기 적립식 vs 일회성', desc: '매주 5,000원씩 1년 복권에 쓰면 260,000원. 같은 금액을 연 4% 정기적금에 넣으면 세후 이자 약 11,000원 + 원금 260,000원 = 271,000원. 단기엔 적금이 압도적이지만, "취미"라는 비재무적 효용도 고려.' },
        { title: '도박중독 주의 신호', desc: '매출의 상당 부분이 소수 중독자에게서 발생합니다. ① 빚내서 구매 ② 추가 구매로 손실 만회 시도 ③ 가족에게 숨김 ④ 일상 기능 저하 중 하나라도 해당되면 한국도박문제예방치유원(☎1336) 무료상담. 복권은 "기분전환"이 되어야지 "희망의 전부"가 되면 안 됩니다.' },
        { title: '공식 판매처에서만 구매', desc: '동행복권(dhlottery.co.kr) 지정 판매점 또는 공식 인터넷 구매만 유효합니다. SNS·단체카톡방·사설 사이트의 "추천번호", "당첨 확정번호" 판매는 대부분 사기. 돈을 요구하는 곳은 100% 신고(한국도박문제예방치유원·경찰청 112).' },
      ]} />

      <nav className="flex flex-wrap gap-2" aria-label="관련 계산기">
        {[
          { href: '/salary',   label: '연봉 실수령액' },
          { href: '/savings',  label: '적금 이자' },
          { href: '/mortgage', label: '대출 이자' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[12.5px] px-3 py-2 rounded-md border border-[color:var(--line-strong)] bg-white/[0.03] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] transition-colors"
          >
            → {label}
          </Link>
        ))}
      </nav>

      <style jsx>{`
        @keyframes lotto-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
