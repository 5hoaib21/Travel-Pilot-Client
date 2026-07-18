'use client'

import { motion } from 'framer-motion'
import { Sparkles, BarChart3, MessageSquareMore } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Itinerary Generator',
    description:
      'Describe your dream trip and get a complete day-by-day itinerary in seconds — personalized to your style, budget, and interests.',
  },
  {
    icon: BarChart3,
    title: 'Budget Intelligence',
    description:
      'Smart cost allocation across accommodation, food, activities, and transport. See exactly where your money goes before you go.',
  },
  {
    icon: MessageSquareMore,
    title: 'AI Travel Copilot',
    description:
      'Refine your plans through natural conversation. Ask questions, swap activities, or adjust days — your copilot remembers everything.',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-warm-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-4">
            Everything You Need to Plan the Perfect Trip
          </h2>
          <p className="text-lg text-warm-500 dark:text-slate-300 max-w-2xl mx-auto">
            Three AI-powered tools that work together to create, budget, and refine your travel plans in one seamless workflow.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-warm-500 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
