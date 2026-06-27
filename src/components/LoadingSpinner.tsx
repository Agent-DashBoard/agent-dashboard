// NOTE PENANDA: LOADING_SPINNER_COMPONENT_v1.0
// Reusable loading spinner component untuk semua pages
// Menampilkan animated loading state

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

const sizeConfig = {
  sm: { spinner: 16, text: 'text-xs' },
  md: { spinner: 24, text: 'text-sm' },
  lg: { spinner: 32, text: 'text-base' },
}

export function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const config = sizeConfig[size]

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        size={config.spinner}
        className="animate-spin text-blue-500"
      />
      {text && <p className={`${config.text} text-zinc-400`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return content
}
