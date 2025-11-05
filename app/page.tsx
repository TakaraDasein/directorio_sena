import { LpNavbar1 } from "@/components/lp-navbar-1"
import { HeroSection7 } from "@/components/hero-section-7"
// import { CompanyStories } from "@/components/company-stories"
import { RecommendedCompanies } from "@/components/recommended-companies"
import { AnimatedLetter } from "@/components/animated-letter"
import { FaqSection1 } from "@/components/faq-section-1"
import { Footer2 } from "@/components/footer-2"

export default function Home() {
  return (
    <main>
      <LpNavbar1 />
      <HeroSection7 />
      {/* <CompanyStories /> */}
      <RecommendedCompanies />
      <AnimatedLetter />
      <FaqSection1 />
      <Footer2 />
    </main>
  )
}
