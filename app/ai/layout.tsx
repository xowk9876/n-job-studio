import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'AI 마케팅 글 생성기 — 제휴 마케팅 블로그 자동 작성',
  description: 'Gemini AI가 상품 정보를 기반으로 SEO 최적화된 제휴 마케팅 블로그 포스트를 자동 생성합니다.',
  keywords: ['AI 블로그 생성기', '제휴 마케팅', '블로그 자동 작성', 'Gemini AI', 'SEO 콘텐츠'],
  authors: [{ name: '머니핏 계산기' }],
  alternates: { canonical: `${SITE}/ai` },
  robots: { index: true, follow: true },
}

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
