// NOTE PENANDA: MEMORY_SEARCH_RESULTS_COMPONENT_v1.0
// Display semantic search results dari Pinecone
// Menampilkan hasil dengan similarity score & metadata

'use client'

import { Search, AlertCircle, Loader2 } from 'lucide-react'
import { useSemanticSearch, filterBySimilarity } from '@/hooks/useSemanticSearch'
import type { SearchResult } from '@/lib/pinecone'

interface MemorySearchResultsProps {
  onResultClick?: (result: SearchResult) => void
}

export function MemorySearchResults({
  onResultClick,
}: MemorySearchResultsProps) {
  const {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
  } = useSemanticSearch({ limit: 10 })

  // Filter results by 50% similarity threshold
  const filteredResults = filterBySimilarity(results, 0.5)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search memories with semantic intelligence..."
          value={query}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={clearResults}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin mr-2" />
          <span className="text-sm text-zinc-400">Searching memories...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">Search Error</p>
            <p className="text-xs text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && filteredResults.length === 0 && !isLoading && (
        <div className="p-6 text-center rounded-lg border border-zinc-700 bg-zinc-900/30">
          <p className="text-sm text-zinc-400">
            {query
              ? 'No similar memories found'
              : 'Start typing to search memories'}
          </p>
        </div>
      )}

      {/* Results Grid */}
      {filteredResults.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-3">
            Found {filteredResults.length} relevant memories
          </p>
          <div className="space-y-3">
            {filteredResults.map((result, idx) => (
              <button
                key={result.id}
                onClick={() => onResultClick?.(result)}
                className="w-full p-4 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-blue-500 transition-all text-left group"
              >
                {/* Result Header */}
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-500">
                    #{idx + 1}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    {(result.score * 100).toFixed(0)}% match
                  </span>
                </div>

                {/* Result Content */}
                <p className="text-sm text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {result.content}
                </p>

                {/* Result Metadata */}
                {Object.keys(result.metadata).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                    {Object.entries(result.metadata)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between text-xs text-zinc-500"
                        >
                          <span className="capitalize">{key}:</span>
                          <span className="text-zinc-400">
                            {String(value).substring(0, 30)}
                            {String(value).length > 30 ? '...' : ''}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
