"use client"

import DirectorySearchBar from "@/components/directory-search-bar"

export function HeroSection7() {
  return (
    <section className="snap-panel py-16 lg:py-24 px-6 justify-center items-center" aria-labelledby="hero-heading">
      <div className="container px-6 flex flex-col items-center gap-12 lg:gap-16 mx-auto">
        <div className="flex flex-col items-center lg:items-start gap-8 w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-6 lg:gap-8">
            <div className="flex flex-col items-center lg:items-start gap-4 lg:flex-1 lg:max-w-xl">
              <h1 id="hero-heading" className="text-foreground font-bold text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 animate-fade-in-up leading-tight">
                  DIRECTORIO
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl animate-fade-in-up animation-delay-200 leading-tight">
                  Fondo Emprender: Cali
                </div>
              </h1>
              <div className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl text-center lg:text-left space-y-1">
                <p className="animate-fade-in-up animation-delay-400 leading-relaxed">
                  Directorio completo de empresas, servicios
                </p>
                <p className="animate-fade-in-up animation-delay-600 leading-relaxed">
                  y profesionales vinculados al SENA.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-auto lg:flex-1 lg:max-w-md xl:max-w-lg mt-2 lg:mt-0 lg:ml-auto">
              <DirectorySearchBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
