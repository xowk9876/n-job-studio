import Script from 'next/script'
import type { CalculatorDef } from '@/lib/seo'
import { buildCalculatorStructuredData, jsonLd } from '@/lib/seo'

type Props = {
  calc: CalculatorDef
  children: React.ReactNode
}

export default function CalculatorSeoShell({ calc, children }: Props) {
  const ld = buildCalculatorStructuredData(calc)
  const scriptId = `calc-ld${calc.path.replace(/\//g, '-')}`

  return (
    <>
      <Script
        id={scriptId}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
      />
      <div className="max-w-4xl mx-auto px-5 md:px-6 pt-6 md:pt-8">
        <p className="text-[13px] text-[color:var(--sub)] leading-relaxed border-b border-white/[0.06] pb-4 mb-1">
          {calc.seoIntro}
        </p>
      </div>
      {children}
    </>
  )
}
