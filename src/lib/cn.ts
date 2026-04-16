/**
 * cn — Class name utility
 * Merges Tailwind classes safely, resolving conflicts via tailwind-merge.
 * Usage: cn('btn', 'btn-primary', condition && 'btn-lg')
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
