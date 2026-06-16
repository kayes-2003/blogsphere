import { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 to `value` when the element enters the viewport.
 * Formats large numbers with K / M suffixes automatically.
 */
function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

export default function AnimatedCounter({ value, duration = 1800, suffix = '' }) {
  const [display, setDisplay]   = useState(0)
  const [started, setStarted]   = useState(false)
  const ref = useRef(null)

  // Trigger when element scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Count-up animation
  useEffect(() => {
    if (!started || !value) return

    const start     = performance.now()
    const startVal  = 0
    const endVal    = value

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startVal + (endVal - startVal) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [started, value, duration])

  return (
    <span ref={ref}>
      {formatNumber(display)}{suffix}
    </span>
  )
}
