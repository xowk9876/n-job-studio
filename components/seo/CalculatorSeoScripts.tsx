import Script from 'next/script'
import { buildCalculatorStructuredData, jsonLd } from '@/lib/seo'

type Props = {
  id: string
  breadcrumb: { name: string; path: string }[]
  webApp: {
    path: string
    name: string
    description: string
    category?: string
    guidePath?: string
  }
}

export default function CalculatorSeoScripts({ id, breadcrumb, webApp }: Props) {
  const ld = buildCalculatorStructuredData({ breadcrumb, webApp })
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
    />
  )
}
