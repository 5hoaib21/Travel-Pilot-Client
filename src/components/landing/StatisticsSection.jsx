'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: 10000, suffix: '+', label: 'Trips Planned' },
  { value: 50, suffix: '+', label: 'Countries' },
  { value: 48, prefix: '', suffix: '★', label: 'Avg Rating', isRating: true },
  { value: 2, suffix: 'x Faster', label: 'Planning Speed' },
]

function useCountUp(target, isInView, duration = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTimestamp
    let rafId

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, isInView, duration])

  return count
}

function StatItem({ stat, index }) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const count = useCountUp(stat.value, isInView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-4xl sm:text-5xl font-heading font-bold text-orange-500 mb-2">
        {stat.isRating ? '4.8' : count}
        {stat.suffix}
      </span>
      <span className="text-sm text-warm-500 dark:text-slate-300 font-medium">
        {stat.label}
      </span>
    </motion.div>
  )
}

export default function StatisticsSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-800/50 border-t border-b border-warm-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
