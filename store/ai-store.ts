import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductSpec, GenerationHistory } from '@/types'

interface AiStore {
  formData: ProductSpec
  isGenerating: boolean
  currentOutput: string
  history: GenerationHistory[]
  setForm: (v: Partial<ProductSpec>) => void
  setGenerating: (v: boolean) => void
  appendOutput: (chunk: string) => void
  resetOutput: () => void
  saveToHistory: () => void
  deleteHistory: (id: string) => void
  restoreHistory: (id: string) => void
}

const DEFAULT_FORM: ProductSpec = {
  productName: '',
  category: 'electronics',
  price: 0,
  specs: '',
  pros: [''],
  cons: [''],
  targetAudience: '',
  tone: 'friendly',
}

export const useAiStore = create<AiStore>()(
  persist(
    (set, get) => ({
      formData: { ...DEFAULT_FORM },
      isGenerating: false,
      currentOutput: '',
      history: [],
      setForm: (v) => set((s) => ({ formData: { ...s.formData, ...v } })),
      setGenerating: (v) => set({ isGenerating: v }),
      appendOutput: (chunk) => set((s) => ({ currentOutput: s.currentOutput + chunk })),
      resetOutput: () => set({ currentOutput: '' }),
      saveToHistory: () => {
        const { formData, currentOutput, history } = get()
        if (!currentOutput.trim()) return
        const entry: GenerationHistory = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          createdAt: new Date().toISOString(),
          productName: formData.productName || '무제',
          output: currentOutput,
        }
        set({ history: [entry, ...history].slice(0, 20) })
      },
      deleteHistory: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      restoreHistory: (id) => {
        const item = get().history.find((h) => h.id === id)
        if (item) set({ currentOutput: item.output })
      },
    }),
    {
      name: 'mf-ai',
      partialize: (s) => ({ formData: s.formData, history: s.history }),
    },
  ),
)
