"use client"

import { Logo } from "./logo"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer2() {
  return (
    <footer className="py-16 lg:py-24 bg-primary text-white" role="contentinfo" aria-label="Site footer">
      <div className="container px-6 mx-auto flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row md:justify-between md:items-center gap-12">
            <div className="flex flex-col items-center lg:flex-row gap-12">
              <Link href="/" aria-label="Go to homepage">
                <Logo asLink={false} />
              </Link>

              <nav
                className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center"
                aria-label="Footer navigation"
              >
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Support
                </Link>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </Link>
              </nav>
            </div>

            <form
              className="flex flex-col md:flex-row gap-2 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription form"
            >
              <Input
                type="email"
                placeholder="Your email"
                className="md:w-[242px]"
                required
                aria-required="true"
                aria-label="Enter your email for newsletter"
              />
              <Button type="submit" className="w-full md:w-auto bg-white text-primary hover:bg-white/90" aria-label="Subscribe to our newsletter">
                Subscribe
              </Button>
            </form>
          </div>

          <Separator role="presentation" />

          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 text-center">
            <p className="text-white/70 order-2 md:order-1">
              <span>Built with Pro Blocks by</span>{" "}
              <Link href="https://www.shadcndesign.com/pro-blocks" target="_blank" className="underline text-white/90 hover:text-white">
                shadcndesign.com
              </Link>
            </p>

            <nav
              className="flex flex-col md:flex-row items-center gap-6 md:gap-8 order-1 md:order-2"
              aria-label="Legal links"
            >
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Cookies Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
