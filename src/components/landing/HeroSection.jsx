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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-warm-50 via-orange-50/40 to-warm-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium mb-8 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          AI-Powered Travel Planning
        </motion.div>

        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-navy-700 leading-tight mb-6 dark:text-slate-100"
        >
          Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600">
            AI Travel Planner
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg sm:text-xl text-warm-500 max-w-2xl mx-auto mb-10 leading-relaxed dark:text-slate-300"
        >
          Plan smarter. Travel better. Generate personalized itineraries, budget breakdowns, and destination tips in seconds.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/40"
          >
            Start Planning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 text-warm-700 font-medium rounded-xl border border-warm-200 hover:border-warm-300 hover:bg-warm-100 transition-colors dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            Learn More
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-16 relative max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-warm-200 bg-white shadow-xl shadow-warm-200/50 overflow-hidden dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50">
            <div className="flex items-center gap-2 px-4 py-3 bg-warm-50 border-b border-warm-100 dark:bg-slate-800/50 dark:border-b-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 dark:bg-orange-900">
                  <div className="w-5 h-5 rounded-full bg-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-48 bg-warm-200 rounded mb-2 dark:bg-slate-600" />
                  <div className="h-3 w-32 bg-warm-100 rounded dark:bg-slate-700" />
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full dark:bg-green-900 dark:text-green-300">
                  $1,850
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Morning', 'Afternoon', 'Evening'].map((time) => (
                  <div key={time} className="p-3 rounded-lg bg-warm-50 border border-warm-100 dark:bg-slate-800/50 dark:border-slate-700">
                    <div className="h-2.5 w-14 bg-warm-200 rounded mb-3 dark:bg-slate-600" />
                    <div className="h-4 w-full bg-warm-200 rounded mb-1.5 dark:bg-slate-600" />
                    <div className="h-3 w-3/4 bg-warm-100 rounded dark:bg-slate-700" />
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
