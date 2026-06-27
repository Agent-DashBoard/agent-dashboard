// NOTE PENANDA: BADGE_COMPONENT_v1.0
// Reusable badge component untuk tags & status

import React from 'react'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold'

  const variantStyles = {
    default: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    secondary: 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/50',
    destructive: 'bg-red-600/20 text-red-400 border border-red-600/30',
    outline: 'border border-zinc-600 text-zinc-400',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
