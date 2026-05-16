'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAiStore } from '@/store/ai-store'
import type { ProductCategory, WritingTone } from '@/types'
import {
  Sparkles, Copy, Check, Save, RotateCcw, Trash2,
  ChevronDown, ChevronUp, Plus, Minus, Clock,
} from 'lucide-react'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'electronics', label: '전자기기' },
  { value: 'beauty', label: '뷰티' },
  { value: 'health', label: '건강' },
  { value: 'fashion', label: '패션' },
  { value: 'food', label: '식품' },
  { value: 'other', label: '기타' },
]

const TONES: { value: WritingTone; label: string; desc: string }[] = [
  { value: 'professional', label: '전문적', desc: '데이터 중심·객관적' },
  { value: 'friendly', label: '친근한', desc: '대화체·쉬운 설명' },
  { value: 'humorous', label: '유머러스', desc: '재미있고 가볍게' },
]

function ListInput({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">{label}</label>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              className="glass-input flex-1 rounded-lg px-3 py-2 text-[14px]"
              value={item}
              placeholder={`${label} ${i + 1}`}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="shrink-0 w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-400 hover:border-rose-400/30 transition-colors"
              >
                <Minus size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="self-start text-[12px] text-[color:var(--brand)] flex items-center gap-1 hover:underline mt-0.5"
        >
          <Plus size={12} /> 항목 추가
        </button>
      </div>
    </div>
  )
}

export default function AiPage() {
  const {
    formData, isGenerating, currentOutput, history,
    setForm, setGenerating, appendOutput, resetOutput, saveToHistory,
    deleteHistory, restoreHistory,
  } = useAiStore()

  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => setMounted(true), [])

  const handleGenerate = useCallback(async () => {
    if (isGenerating) {
      abortRef.current?.abort()
      setGenerating(false)
      return
    }

    resetOutput()
    setGenerating(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '서버 오류' }))
        appendOutput(err.error || '생성 중 오류가 발생했습니다.')
        setGenerating(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        appendOutput(decoder.decode(value, { stream: true }))
        outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        appendOutput('\n\n---\n생성이 중단되었습니다.')
      } else {
        appendOutput('\n\n---\n네트워크 오류가 발생했습니다.')
      }
    } finally {
      setGenerating(false)
    }
  }, [formData, isGenerating, setGenerating, resetOutput, appendOutput])

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-6">
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">AI GENERATOR</p>
        <h1 className="font-display text-[22px] md:text-[28px] font-bold tracking-tight text-white">
          AI 마케팅 글 생성기
        </h1>
        <p className="text-[13px] text-[color:var(--sub)] mt-1">
          상품 정보를 입력하면 Gemini AI가 SEO 최적화 블로그 포스트를 자동 생성합니다
        </p>
      </div>

      <div className="grid md:grid-cols-[380px_1fr] gap-4">
        {/* Left: Form */}
        <div className="glass-card p-5 flex flex-col gap-4 h-fit md:sticky md:top-28">
          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">상품명 *</label>
            <input
              className="glass-input w-full rounded-lg px-3 py-2.5 text-[15px] font-semibold"
              placeholder="예: 삼성 갤럭시 S25 울트라"
              value={formData.productName}
              onChange={(e) => setForm({ productName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">카테고리</label>
              <select
                className="glass-select w-full rounded-lg text-[13px]"
                value={formData.category}
                onChange={(e) => setForm({ category: e.target.value as ProductCategory })}
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">가격 (원)</label>
              <input
                type="number"
                className="glass-input w-full rounded-lg px-3 py-2.5 text-[14px]"
                placeholder="1,299,000"
                value={formData.price || ''}
                onChange={(e) => setForm({ price: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">핵심 스펙</label>
            <textarea
              className="glass-input w-full rounded-lg px-3 py-2.5 text-[13.5px] min-h-[80px] resize-y"
              placeholder="주요 사양, 크기, 재질 등"
              value={formData.specs}
              onChange={(e) => setForm({ specs: e.target.value })}
            />
          </div>

          <ListInput label="장점" items={formData.pros} onChange={(v) => setForm({ pros: v })} />
          <ListInput label="단점" items={formData.cons} onChange={(v) => setForm({ cons: v })} />

          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">타겟 독자</label>
            <input
              className="glass-input w-full rounded-lg px-3 py-2.5 text-[13.5px]"
              placeholder="예: 30대 직장인, IT 얼리어답터"
              value={formData.targetAudience}
              onChange={(e) => setForm({ targetAudience: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">어조</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ tone: t.value })}
                  className={`rounded-lg py-2 px-2 border text-center transition-colors ${
                    formData.tone === t.value
                      ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                      : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30'
                  }`}
                >
                  <span className="block text-[12.5px] font-semibold">{t.label}</span>
                  <span className="block text-[10px] opacity-60 mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!formData.productName.trim()}
            className={`w-full py-3 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
              isGenerating
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                : 'btn-primary disabled:opacity-40 disabled:pointer-events-none'
            }`}
          >
            {isGenerating ? (
              <><span className="w-4 h-4 border-2 border-rose-300/40 border-t-rose-300 rounded-full animate-spin" /> 중단하기</>
            ) : (
              <><Sparkles size={16} /> 생성하기</>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-3">
          <div className="glass-card flex-1 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-[12.5px] font-semibold text-white/60">
                {isGenerating ? '생성 중...' : currentOutput ? '생성 완료' : '결과가 여기에 표시됩니다'}
              </span>
              {currentOutput && (
                <div className="flex gap-1.5">
                  <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="복사">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => { saveToHistory() }} className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="저장">
                    <Save size={14} />
                  </button>
                  <button onClick={() => { resetOutput() }} className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="초기화">
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto p-4 text-[13.5px] text-white/80 leading-relaxed whitespace-pre-wrap font-mono"
            >
              {currentOutput || (
                <div className="h-full flex items-center justify-center text-white/20 text-[14px]">
                  상품 정보를 입력하고 &quot;생성하기&quot;를 클릭하세요
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="glass-card">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5"><Clock size={14} /> 생성 이력 ({history.length})</span>
                {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showHistory && (
                <div className="border-t border-white/10 max-h-[300px] overflow-y-auto">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <button
                        onClick={() => restoreHistory(h.id)}
                        className="flex-1 text-left"
                      >
                        <span className="text-[13px] font-medium text-white/80">{h.productName}</span>
                        <span className="block text-[11px] text-white/35 mt-0.5">
                          {new Date(h.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </button>
                      <button
                        onClick={() => deleteHistory(h.id)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-white/30 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
