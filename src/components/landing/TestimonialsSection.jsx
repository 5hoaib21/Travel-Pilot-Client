'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    avatar: 'PS',
    role: 'Product Manager',
    quote:
      'I used to spend hours researching trips. Travel Pilot generated a complete Tokyo itinerary in 15 seconds — and it was better than anything I could have put together myself.',
    rating: 5,
  },
  {
    name: 'James Chen',
    avatar: 'JC',
    role: 'Software Engineer',
    quote:
      'The budget intelligence feature is a game-changer. I could see exactly where my money was going before I even booked anything. No surprises.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    avatar: 'AP',
    role: 'Marketing Director',
    quote:
      'We planned a family trip to Bali. The AI suggested kid-friendly activities, safe areas, and restaurants with variety. My kids loved it as much as I did.',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    avatar: 'MW',
    role: 'Freelance Designer',
    quote:
      'The Travel Copilot is like having a travel agent in your pocket. I changed three activities mid-plan and it adjusted everything seamlessly.',
    rating: 4,
  },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
}

export default function TestimonialsSection() {
  const [[index, dir], setState] = useState([0, 0])

  const goTo = useCallback(
    (next) => {
      const clamped = (next + testimonials.length) % testimonials.length
      setState([clamped, next - index])
    },
    [index]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const t = testimonials[index]

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-warm-50 via-white to-warm-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-700 dark:text-slate-100 mb-4">
            Loved by Travelers
          </h2>
          <p className="text-lg text-warm-500 dark:text-slate-300">
            Here&apos;s what our users say about planning with Travel Pilot.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 p-8 sm:p-10 shadow-sm"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-warm-200 dark:text-slate-600'}`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <blockquote className="text-base sm:text-lg text-warm-600 dark:text-slate-200 italic leading-relaxed mb-8 max-w-2xl mx-auto">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm mb-3">
                  {t.avatar}
                </div>
                <span className="text-sm font-semibold text-navy-700 dark:text-slate-100">{t.name}</span>
                <span className="text-xs text-warm-400 dark:text-slate-400">{t.role}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-12 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-warm-500 dark:text-slate-300 hover:text-orange-500 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-12 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-warm-500 dark:text-slate-300 hover:text-orange-500 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? 'bg-orange-500 w-6' : 'bg-warm-200 dark:bg-slate-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
