import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CTASection />
      <Footer />
    </main>
  )
}
