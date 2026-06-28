// NOTE PENANDA: PINECONE_VECTOR_DB_v1.0_PART1
// Pinecone vector database integration untuk HERMES JARVIS OS
// Memory embeddings, semantic search, vector operations

import { Pinecone } from '@pinecone-database/pinecone'

// Initialize Pinecone client
const apiKey = process.env.PINECONE_API_KEY || ''
const indexName = process.env.PINECONE_INDEX_NAME || 'hermes-memory'

let pineconeClient: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY not configured')
    }
    pineconeClient = new Pinecone({ apiKey })
  }
  return pineconeClient
}

// Types
export interface MemoryItem {
  id: string
  content: string
  metadata: Record<string, any>
  timestamp: string
  embedding?: number[]
}

export interface EmbeddingResult {
  text: string
  embedding: number[]
  model: string
}

export interface SearchResult {
  id: string
  score: number
  content: string
  metadata: Record<string, any>
}

// Mock embedding function (for development without real API)
// In production, use Claude API or OpenAI embeddings
export function generateMockEmbedding(text: string): number[] {
  // Simple hash-based mock embedding (1536 dimensions for similarity with OpenAI)
  const hash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  const seed = hash(text)
  const embedding: number[] = []

  for (let i = 0; i < 1536; i++) {
    const x = Math.sin(seed + i) * 10000
    embedding.push(x - Math.floor(x))
  }

  return embedding
}

// Get or create Pinecone index
export async function ensureIndexExists(): Promise<void> {
  try {
    const client = getPineconeClient()
    const indexes = await client.listIndexes()

    const indexExists = indexes.indexes?.some(
      (idx) => idx.name === indexName
    )

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${indexName}`)
      await client.createIndex({
        name: indexName,
        dimension: 1536,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })
    }
  } catch (error) {
    console.warn('Could not ensure Pinecone index:', error)
    // In development, continue without Pinecone
  }
}

// Store memory in Pinecone
export async function storeMemory(item: MemoryItem): Promise<void> {
  try {
    const client = getPineconeClient()
    const index = client.Index(indexName)

    // Generate embedding if not provided
    const embedding = item.embedding || generateMockEmbedding(item.content)

    // Store in Pinecone
    await index.upsert({
      records: [
        {
          id: item.id,
          values: embedding,
          metadata: {
            content: item.content,
            timestamp: item.timestamp,
            ...item.metadata,
          },
        },
      ],
    })
  } catch (error) {
    console.error('Error storing memory in Pinecone:', error)
    // Continue without Pinecone in development
  }
}

// Search similar memories
export async function searchMemories(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const client = getPineconeClient()
    const index = client.Index(indexName)

    // Generate query embedding
    const queryEmbedding = generateMockEmbedding(query)

    // Search in Pinecone
    const results = await index.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    })

    // Format results
    return (results.matches || []).map((match) => ({
      id: match.id,
      score: match.score || 0,
      content: (match.metadata?.content as string) || '',
      metadata: match.metadata || {},
    }))
  } catch (error) {
    console.error('Error searching memories:', error)
    return []
  }
}

// Delete memory from Pinecone
export async function deleteMemory(id: string): Promise<void> {
  try {
    const client = getPineconeClient()
    const index = client.Index(indexName)
    await index.deleteOne({ id })
  } catch (error) {
    console.error('Error deleting memory:', error)
  }
}

// Clear all memories
export async function clearAllMemories(): Promise<void> {
  try {
    const client = getPineconeClient()
    const index = client.Index(indexName)
    await index.deleteAll()
  } catch (error) {
    console.error('Error clearing memories:', error)
  }
}
