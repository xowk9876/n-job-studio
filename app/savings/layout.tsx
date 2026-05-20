import type { Metadata } from 'next'
import CalculatorSeoShell from '@/components/layout/CalculatorSeoShell'
import { buildCalculatorMetadata, calculatorByPath } from '@/lib/seo'

const calc = calculatorByPath['/savings']

export const metadata: Metadata = buildCalculatorMetadata(calc)

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoShell calc={calc}>{children}</CalculatorSeoShell>
}
