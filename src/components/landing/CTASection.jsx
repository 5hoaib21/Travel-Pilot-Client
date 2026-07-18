'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
          Start Planning Free
        </h2>
        <p className="text-lg text-orange-100 mb-10 max-w-xl mx-auto">
          Create your first AI-powered itinerary in seconds. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-lg"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 text-white font-medium rounded-xl border border-white/30 hover:bg-white/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}
