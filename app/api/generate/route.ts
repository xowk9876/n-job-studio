import { GoogleGenAI } from '@google/genai'
import type { ProductSpec } from '@/types'

const SYSTEM_PROMPT = `당신은 한국 최고의 제휴 마케팅 블로거입니다.
아래 상품 정보를 바탕으로 SEO 최적화된 블로그 리뷰 포스트를 작성하세요.

[출력 형식]
1. 제목 후보 3개 (## 로 구분)
2. 메타 디스크립션 (160자 이내, **메타 디스크립션:** 라벨 포함)
3. 본문 마크다운 (H2~H3 계층 구조, 최소 800자)
   - 도입부: 독자 공감 문장
   - 핵심 스펙 분석 (표 형식)
   - 장단점 분석
   - 추천 대상
   - 결론 및 구매 유도 CTA

[작성 규칙]
- 자연스러운 한국어, 존댓말 사용
- SEO 키워드를 자연스럽게 반복
- 표는 마크다운 테이블 문법 사용
- 불필요한 인삿말이나 서론 없이 바로 본론`

function buildUserPrompt(spec: ProductSpec): string {
  return JSON.stringify({
    상품명: spec.productName,
    카테고리: spec.category,
    가격: `${spec.price.toLocaleString()}원`,
    핵심스펙: spec.specs,
    장점: spec.pros,
    단점: spec.cons,
    타겟독자: spec.targetAudience,
    어조: spec.tone === 'professional' ? '전문적' : spec.tone === 'friendly' ? '친근한' : '유머러스',
  }, null, 2)
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return Response.json(
      { error: 'GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일에 API 키를 추가해주세요.' },
      { status: 500 },
    )
  }

  let spec: ProductSpec
  try {
    spec = await req.json()
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  if (!spec.productName?.trim()) {
    return Response.json({ error: '상품명을 입력해주세요.' }, { status: 400 })
  }

  const ai = new GoogleGenAI({ apiKey })

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: buildUserPrompt(spec) }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.8,
            maxOutputTokens: 4096,
          },
        })

        for await (const chunk of response) {
          const text = chunk.text
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gemini API 오류'
        controller.enqueue(new TextEncoder().encode(`\n\n---\n오류: ${msg}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  })
}
