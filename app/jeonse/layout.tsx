import type { Metadata } from 'next'
import CalculatorSeoShell from '@/components/layout/CalculatorSeoShell'
import { buildCalculatorMetadata, calculatorByPath } from '@/lib/seo'

const calc = calculatorByPath['/jeonse']

export const metadata: Metadata = buildCalculatorMetadata(calc)

export default function JeonseLayout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoShell calc={calc}>{children}</CalculatorSeoShell>
}
