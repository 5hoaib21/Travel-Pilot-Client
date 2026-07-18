import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import StatisticsSection from '@/components/landing/StatisticsSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
