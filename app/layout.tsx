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
  title: "Directorio Empresarial Sena | Fondo Emprender",
  description:
    "Directorio oficial de empresas, egresados e instructores del SENA. Encuentra y conecta con emprendedores del Fondo Emprender.",
  keywords: "SENA, Fondo Emprender, directorio empresarial, egresados SENA, empresas SENA, emprendedores Colombia",
  authors: [{ name: "SENA" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.directoriosena.com",
    title: "Directorio Empresarial Sena | Fondo Emprender",
    description: "Directorio oficial de empresas, egresados e instructores del SENA.",
    siteName: "Directorio SENA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Directorio Empresarial Sena | Fondo Emprender",
    description: "Directorio oficial de empresas, egresados e instructores del SENA.",
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
      <body className="antialiased text-white pattern-1 min-h-screen">
        {children}
      </body>
    </html>
  )
}
