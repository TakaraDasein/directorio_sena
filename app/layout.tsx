import type React from "react"
import type { Metadata, Viewport } from "next"
import { Onest } from "next/font/google"
import "./globals.css"

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
})

export const metadata: Metadata = {
  title: "Flowly - Work smarter, not harder with automated workflows",
  description:
    "Automate workflows, streamline tasks, and collaborate seamlessly with Flowly. Boost productivity and efficiency for teams of all sizes.",
  keywords: "workflow automation, task management, team collaboration, productivity tools",
  authors: [{ name: "Flowly Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flowly.com",
    title: "Flowly - Automated Workflow Solutions",
    description: "Streamline your team's workflow with Flowly's powerful automation tools.",
    siteName: "Flowly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowly - Automated Workflow Solutions",
    description: "Streamline your team's workflow with Flowly's powerful automation tools.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${onest.variable} font-sans`}>
      <body className="antialiased bg-muted text-foreground pattern-1 min-h-screen">
        {children}
      </body>
    </html>
  )
}
