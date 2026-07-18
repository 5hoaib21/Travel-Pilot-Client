'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 via-primary-50/30 to-neutral-50 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-200/30 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Travel Planning
        </motion.div>

        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-900 leading-tight mb-6"
        >
          Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
            AI Travel Planner
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Plan smarter. Travel better. Generate personalized itineraries, budget breakdowns, and destination tips in seconds.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300"
          >
            Start Planning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 text-neutral-700 font-medium rounded-xl border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
          >
            Learn More
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 rounded-full bg-primary-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-48 bg-neutral-200 rounded mb-2" />
                  <div className="h-3 w-32 bg-neutral-100 rounded" />
                </div>
                <div className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                  $1,850
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Morning', 'Afternoon', 'Evening'].map((time) => (
                  <div key={time} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="h-2.5 w-14 bg-neutral-200 rounded mb-3" />
                    <div className="h-4 w-full bg-neutral-200 rounded mb-1.5" />
                    <div className="h-3 w-3/4 bg-neutral-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
