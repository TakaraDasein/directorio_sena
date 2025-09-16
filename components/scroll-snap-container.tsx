"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

// Registrar plugins de GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

interface ScrollSnapContainerProps {
  children: React.ReactNode
}

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const panels = gsap.utils.toArray(".snap-panel")
    let observer: any
    let scrollTween: gsap.core.Tween | null = null

    // Configuración para dispositivos táctiles
    if (ScrollTrigger.isTouch === 1) {
      observer = ScrollTrigger.normalizeScroll(true)
    }

    // Prevenir interrupciones en dispositivos táctiles
    const handleTouchStart = (e: TouchEvent) => {
      if (scrollTween) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }

    document.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: false,
    })

    // Función para navegar a una sección específica
    function goToSection(i: number) {
      scrollTween = gsap.to(window, {
        scrollTo: { y: i * window.innerHeight, autoKill: false },
        onStart: () => {
          if (!observer) return
          observer.disable()
          observer.enable()
        },
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => (scrollTween = null),
        overwrite: true,
      })
    }

    // Crear ScrollTriggers para cada panel
    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel as Element,
        start: "top bottom",
        end: "+=199%",
        onToggle: (self) => self.isActive && !scrollTween && goToSection(i),
      })
    })

    // ScrollTrigger de respaldo para snap
    ScrollTrigger.create({
      start: 0,
      end: "max",
      snap: 1 / (panels.length - 1),
    })

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      if (scrollTween) scrollTween.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="scroll-snap-container">
      {children}
    </div>
  )
}