import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PaperBackground from '@/components/layout/AnimatedBackground'
import { SITE_NAME, SITE_URL, jsonLd, RSS_FEED_URL } from '@/lib/seo'
import { buildSiteVerifications } from '@/lib/seo-platform'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06070b' },
    { media: '(prefers-color-scheme: light)', color: '#06070b' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'finance',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: '머니핏 계산기',
    statusBarStyle: 'black-translucent',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: buildSiteVerifications(),
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  referrer: 'strict-origin-when-cross-origin',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528',
  },
}

function OrganizationData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['머니핏', 'Moneyfit'],
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
    sameAs: ['https://www.instagram.com/tae_system/'],
    contactPoint: {
      '@type': 'ContactPoint',
      url: `${SITE_URL}/contact`,
      email: 'bhd03014@gmail.com',
      contactType: 'customer support',
      availableLanguage: 'Korean',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organization) }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528'
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        <link rel="alternate" type="application/rss+xml" title="머니핏 계산기·가이드 RSS" href={RSS_FEED_URL} />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <OrganizationData />
      </head>
      <body className="app-shell">
        <PaperBackground />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="relative z-10 min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
