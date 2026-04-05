import Link from 'next/link'

const links = [
  { href: '/salary',    label: '연봉 실수령액' },
  { href: '/mortgage',  label: '대출 이자' },
  { href: '/severance', label: '퇴직금' },
  { href: '/savings',   label: '적금/예금' },
  { href: '/jeonse',    label: '전세↔월세' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      {/* AdSense 슬롯 (광고 삽입 위치) */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          id="adsense-footer"
          className="w-full min-h-[90px] bg-white/5 rounded-xl flex items-center justify-center text-xs text-white/30 border border-dashed border-white/10"
          aria-label="광고 영역"
        >
          {/* Google AdSense 코드 삽입 위치 */}
          광고 영역
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <p className="font-bold text-white mb-1">머니핏 계산기</p>
            <p className="text-xs text-white/40 max-w-sm">
              본 계산기는 참고용이며 실제 세금·보험료는 관련 기관에 문의하세요.
              세율은 2026년 기준이며 변경될 수 있습니다.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="text-xs text-white/50 hover:text-blue-300 transition-colors">
                {label} 계산기
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-[11px] text-white/40">© 2026 머니핏 계산기. All rights reserved.</p>
          <p className="text-[11px] text-white/40">무료 한국 재테크 계산기</p>
        </div>
      </div>
    </footer>
  )
}
