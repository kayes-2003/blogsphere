import { format, formatDistanceToNow } from 'date-fns'

/** Format a date string → "Jan 5, 2025" */
export const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : ''

/** Format a date as relative → "3 days ago" */
export const timeAgo = (dateStr) =>
  dateStr ? formatDistanceToNow(new Date(dateStr), { addSuffix: true }) : ''

/** Estimate read time from HTML/plain content */
export const calcReadTime = (content = '') => {
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** Build a URL-safe slug from a title */
export const toSlug = (title = '') =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

/** Truncate text to N words */
export const truncate = (text = '', words = 30) =>
  text.split(' ').slice(0, words).join(' ') + (text.split(' ').length > words ? '…' : '')

/** Get initials from a full name */
export const initials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

/** Capitalise first letter */
export const ucFirst = (str = '') => str.charAt(0).toUpperCase() + str.slice(1)

/** Clamp a number between min and max */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
