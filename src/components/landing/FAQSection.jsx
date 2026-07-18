'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How does the AI generate my itinerary?',
    a: 'Our multi-agent AI system analyzes your preferences — destination, budget, duration, travel style, and interests — then generates a complete day-by-day plan. Each day includes activities, meals, and accommodation, all optimized for your budget and preferences.',
  },
  {
    q: 'Can I modify my itinerary after it is generated?',
    a: 'Absolutely. You can regenerate the entire trip, regenerate a single day, or use the AI Travel Copilot to make specific changes through natural conversation. Swap restaurants, adjust the pace, or add new activities — your plan evolves with you.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your trip data is stored securely and never shared with third parties. Sessions are encrypted with httpOnly cookies, and all API requests are authenticated. You can delete your trips or account at any time.',
  },
  {
    q: 'What destinations are supported?',
    a: 'Travel Pilot supports destinations worldwide. Our AI enriches your destination with structured data including country, continent, best travel months, language, currency, and timezone — regardless of how obscure the destination.',
  },
  {
    q: 'How accurate is the budget breakdown?',
    a: 'The budgeter agent calculates costs based on real-world estimates for accommodation, food, activities, transport, and miscellaneous expenses. While actual costs may vary, the breakdown gives you a reliable framework for planning your spending.',
  },
  {
    q: 'Can I share my trip with others?',
    a: 'Yes. Every trip can be shared via a unique link. You can also mark trips as public to appear on the Explore page, allowing other travelers to discover and get inspired by your itineraries.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-warm-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-warm-500 dark:text-slate-300">
            Everything you need to know about Travel Pilot.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-navy-700 dark:text-slate-100 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-warm-400 dark:text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-sm text-warm-500 dark:text-slate-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
