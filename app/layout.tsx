import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세',
    template: '%s | 머니핏 계산기',
  },
  description: '2026년 최신 기준 연봉 실수령액, 주택담보대출 이자, 퇴직금, 적금 만기 이자, 전세월세 전환 계산기. 무료 한국 재테크 계산기.',
  keywords: ['연봉 실수령액 계산기', '주담대 이자 계산기', '퇴직금 계산기', '적금 이자 계산기', '전월세 전환 계산기', '2026 세금 계산기'],
  authors: [{ name: '머니핏 계산기' }],
  creator: '머니핏 계산기',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '머니핏 계산기',
    title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세',
    description: '2026년 최신 기준 한국 재테크 계산기 모음. 무료 · 광고 없음 · 실시간 계산.',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'nCoNcuMFFK-0Pu8G3aVSRSeEH4jXNT6ZjRAFURfpmfY',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
