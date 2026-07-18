'use client'

import { motion } from 'framer-motion'
import { FileText, Wand2, MessageSquareMore } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    number: 1,
    title: 'Tell Us Your Preferences',
    description:
      'Enter your destination, budget, duration, travel style, and interests. The more detail you share, the more personalized your plan.',
  },
  {
    icon: Wand2,
    number: 2,
    title: 'AI Generates Your Plan',
    description:
      'Our multi-agent AI system creates a complete day-by-day itinerary with budget breakdown, accommodation, activities, and travel tips.',
  },
  {
    icon: MessageSquareMore,
    number: 3,
    title: 'Refine with Travel Copilot',
    description:
      'Chat with your AI copilot to tweak any detail — swap restaurants, adjust pace, or add new activities. Your plan evolves with you.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-warm-50 via-orange-50/40 to-warm-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-warm-500 dark:text-slate-300 max-w-2xl mx-auto">
            Three simple steps from idea to a fully planned itinerary.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 dark:from-orange-800 dark:via-orange-600 dark:to-orange-800" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-200 dark:shadow-orange-900/40">
                <span className="text-white font-bold text-lg font-heading">{step.number}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-5">
                <step.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-warm-500 dark:text-slate-300 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
