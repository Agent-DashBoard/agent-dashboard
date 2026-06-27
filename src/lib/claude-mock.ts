// NOTE PENANDA: CLAUDE_MOCK_v1.0
// Mock Claude responses untuk development tanpa API key
// Nanti swap ke real API saat production

export interface MockChatResponse {
  content: string
  inputTokens: number
  outputTokens: number
  costUsd: number
  model: string
}

// Mock responses database
const MOCK_RESPONSES: Record<string, string> = {
  'siapa kamu':
    'Aku adalah HERMES-AGENT, otak dan koordinator dari HERMES JARVIS OS. Tugasku adalah mengelola 3 agent spesialis: OPENCLAW (web scraping), CODE-GENIUS (coding), dan diri sendiri sebagai decision maker. Apa yang bisa aku bantu?',

  'apa itu hermes':
    'HERMES JARVIS OS adalah dashboard AI agent management yang powerful. Terdiri dari:\n- HERMES-AGENT: Koordinator utama\n- OPENCLAW: Spesialis web scraping & riset\n- CODE-GENIUS: Spesialis koding & debugging\n\nSemuanya terintegrasi dengan Claude API, Supabase, dan Pinecone untuk memory jangka panjang.',

  'berapa cost api':
    'Biaya API Claude tergantung model:\n- claude-3-5-sonnet: $3 per 1M input tokens, $15 per 1M output tokens\n- claude-3-5-haiku: $0.80 per 1M input, $4 per 1M output\n\nEstimasi: $27/bulan untuk 3,000 messages development.',

  'list agents':
    'Berikut 3 agents HERMES JARVIS OS:\n1. HERMES-AGENT (Online) - Koordinator & decision maker\n2. OPENCLAW (Offline) - Web scraping specialist\n3. CODE-GENIUS (Busy) - Coding & debugging specialist',

  'help':
    'Perintah yang tersedia:\n- "siapa kamu" - Info tentang HERMES-AGENT\n- "apa itu hermes" - Penjelasan project\n- "berapa cost api" - Info pricing\n- "list agents" - Daftar semua agents\n- "status" - Status sistem saat ini',

  'status':
    'Status HERMES JARVIS OS (27 Juni 2026, 19:54):\n- Dashboard: ✅ Online\n- Database: ✅ Supabase connected\n- Agents: 3/3 initialized\n- Memory: ✅ Ready\n- Skills: 11 loaded\n- API Cost Today: $0.024 (mock)',

  default:
    'Saya memahami pertanyaanmu, namun saat ini dalam mode mock development. Respons ini adalah simulasi. Fitur lengkap akan tersedia setelah Claude API key aktif.',
}

// Generate mock response
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim()

  // Exact match
  if (MOCK_RESPONSES[lowerMessage]) {
    return MOCK_RESPONSES[lowerMessage]
  }

  // Partial match
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }

  // Default
  return MOCK_RESPONSES.default
}

// Mock token estimation
function estimateMockTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Mock send message function
export async function sendMockMessage(
  userMessage: string
): Promise<MockChatResponse> {
  // Simulate network delay (100-300ms)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 200 + 100)
  )

  const content = getMockResponse(userMessage)
  const inputTokens = estimateMockTokens(userMessage)
  const outputTokens = estimateMockTokens(content)

  // Mock cost calculation (sonnet pricing)
  const costUsd =
    (inputTokens / 1_000_000) * 3.0 + (outputTokens / 1_000_000) * 15.0

  return {
    content,
    inputTokens,
    outputTokens,
    costUsd,
    model: 'claude-3-5-sonnet-20241022 (mock)',
  }
}

// Mock streaming generator
export async function* streamMockMessage(
  userMessage: string
): AsyncGenerator<string> {
  const response = await sendMockMessage(userMessage)

  // Stream character by character with delay
  for (const char of response.content) {
    await new Promise((resolve) => setTimeout(resolve, 20))
    yield char
  }
}
