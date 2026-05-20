import type { Metadata } from 'next'
import CalculatorSeoShell from '@/components/layout/CalculatorSeoShell'
import { buildCalculatorMetadata, calculatorByPath } from '@/lib/seo'

const calc = calculatorByPath['/severance']

export const metadata: Metadata = buildCalculatorMetadata(calc)

export default function SeveranceLayout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoShell calc={calc}>{children}</CalculatorSeoShell>
}
