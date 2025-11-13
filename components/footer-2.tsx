"use client"

import { Logo } from "./logo"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Footer2() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Aquí puedes agregar la lógica para guardar el email
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="py-16 lg:py-24 bg-primary text-white" role="contentinfo" aria-label="Pie de página del sitio">
      <div className="container px-6 mx-auto flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row md:justify-between md:items-center gap-12">
            <div className="flex flex-col items-center lg:flex-row gap-12">
              <Link href="/" aria-label="Ir a la página de inicio">
                <Logo asLink={false} />
              </Link>

              <nav
                className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center"
                aria-label="Navegación del footer"
              >
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Inicio
                </Link>
                <Link href="/search" className="text-white/80 hover:text-white transition-colors">
                  Directorio
                </Link>
                <Link href="/kit-digital" className="text-white/80 hover:text-white transition-colors">
                  Kit Digital
                </Link>
                <Link href="/contacto" className="text-white/80 hover:text-white transition-colors">
                  Contacto
                </Link>
                <Link href="/auth" className="text-white/80 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </nav>
            </div>

            <form
              className="flex flex-col md:flex-row gap-2 w-full md:w-auto"
              onSubmit={handleSubscribe}
              aria-label="Formulario de suscripción al boletín"
            >
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="md:w-[242px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                aria-label="Ingresa tu correo para el boletín"
              />
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-white text-primary hover:bg-white/90" 
                aria-label="Suscribirse al boletín"
              >
                {subscribed ? "¡Suscrito!" : "Suscribirse"}
              </Button>
            </form>
          </div>

          <Separator role="presentation" />

          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 text-center">
            <p className="text-white/70 order-2 md:order-1">
              © {new Date().getFullYear()} Directorio SENA | {" "}
              <Link href="/cristofer" className="hover:text-white transition-colors">
                V1TR0
              </Link>
              {" | "}
              <Link href="/volando-entre-dos" className="hover:text-white transition-colors">
                VED
              </Link>
              {" | "}
              <Link href="/studios-nova-sas" className="hover:text-white transition-colors">
                Andres Bosa
              </Link>
            </p>

            <nav
              className="flex flex-col md:flex-row items-center gap-6 md:gap-8 order-1 md:order-2"
              aria-label="Enlaces legales"
            >
              <Link href="/contacto" className="text-white/80 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/contacto" className="text-white/80 hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/contacto" className="text-white/80 hover:text-white transition-colors">
                Ayuda
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
