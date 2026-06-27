// NOTE PENANDA: USE_SEMANTIC_SEARCH_HOOK_v1.0
// React hook untuk semantic memory search via Pinecone
// Integrates with Memory page & ChatPanel untuk intelligent recall

'use client'

import { useState, useCallback } from 'react'
import type { SearchResult } from '@/lib/pinecone'

interface UseSemanticSearchOptions {
  limit?: number
  debounceMs?: number
}

interface UseSemanticSearchState {
  query: string
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}

export function useSemanticSearch(
  options: UseSemanticSearchOptions = {}
) {
  const { limit = 5, debounceMs = 300 } = options

  const [state, setState] = useState<UseSemanticSearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  })

  const debounceTimer = useCallback((callback: () => void, delay: number) => {
    return setTimeout(callback, delay)
  }, [])

  const search = useCallback(
    async (query: string) => {
      // Update query immediately
      setState((prev) => ({
        ...prev,
        query,
        isLoading: true,
        error: null,
      }))

      // Skip if query is empty
      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          results: [],
          isLoading: false,
          hasSearched: false,
        }))
        return
      }

      try {
        // Call memory search API
        const response = await fetch('/api/memory/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            limit,
          }),
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        setState((prev) => ({
          ...prev,
          results: data.results || [],
          isLoading: false,
          hasSearched: true,
        }))
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Search failed'

        setState((prev) => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
          hasSearched: true,
        }))

        console.error('Semantic search error:', error)
      }
    },
    [limit, debounceTimer]
  )

  const clearResults = useCallback(() => {
    setState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
    })
  }, [])

  return {
    ...state,
    search,
    clearResults,
  }
}

// Utility: Format search results for display
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'Tidak ada hasil pencarian.'
  }

  return results
    .map((result, idx) => {
      const score = (result.score * 100).toFixed(0)
      return `${idx + 1}. [${score}%] ${result.content}`
    })
    .join('\n')
}

// Utility: Get top result (for auto-recall in chat)
export function getTopResult(results: SearchResult[]): SearchResult | null {
  if (results.length === 0) return null
  return results[0]
}

// Utility: Filter by similarity threshold
export function filterBySimilarity(
  results: SearchResult[],
  threshold: number = 0.5
): SearchResult[] {
  return results.filter((result) => result.score >= threshold)
}
