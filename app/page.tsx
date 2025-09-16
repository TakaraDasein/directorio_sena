import { LpNavbar1 } from "@/components/lp-navbar-1"
import { HeroSection7 } from "@/components/hero-section-7"
import { CompanyStories } from "@/components/company-stories"
import { RecommendedCompanies } from "@/components/recommended-companies"
import { FaqSection1 } from "@/components/faq-section-1"
import { Footer2 } from "@/components/footer-2"
import { ScrollSnapContainer } from "@/components/scroll-snap-container"

export default function Home() {
  return (
    <>
      <LpNavbar1 />
      <ScrollSnapContainer>
        <HeroSection7 />
        <CompanyStories />
        <RecommendedCompanies />
        <FaqSection1 />
        <Footer2 />
      </ScrollSnapContainer>
    </>
  )
}
