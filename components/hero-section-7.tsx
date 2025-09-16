"use client"

import DirectorySearchBar from "@/components/directory-search-bar"

export function HeroSection7() {
  return (
    <section className="py-36 md:py-44 lg:py-56 xl:py-72 2xl:py-80 px-12 lg:px-20 xl:px-28 2xl:px-36 min-h-[85vh] lg:min-h-[90vh] xl:min-h-[95vh] 2xl:min-h-screen" aria-labelledby="hero-heading">
      <div className="container px-12 lg:px-20 xl:px-24 2xl:px-28 flex flex-col items-center gap-12 lg:gap-16 mx-auto">
        <div className="flex flex-col items-center lg:items-start gap-8 w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full gap-6 lg:gap-8">
            <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 lg:flex-1 lg:max-w-2xl">
              <h1 id="hero-heading" className="text-white font-bold text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 lg:mb-6 animate-fade-in-up leading-tight">
                  DIRECTORIO
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl animate-fade-in-up animation-delay-200 leading-tight">
                  Fondo Emprender: Cali
                </div>
              </h1>
              <div className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl text-center lg:text-left space-y-2 lg:space-y-3">
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
