"use client"

import { useState } from "react"
import { Play, ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react"

interface VideoStory {
  id: number
  title: string
  company: string
  duration: string
  category: string
  thumbnail: string
  description: string
}

const CompanyStories = () => {
  const [selectedVideo, setSelectedVideo] = useState<number>(0)

  const videos: VideoStory[] = [
    {
      id: 0,
      title: "De la Idea a la Realidad",
      company: "TechCali Solutions",
      duration: "4:32",
      category: "Tecnología",
      thumbnail: "/placeholder.jpg",
      description: "Una startup que transformó el panorama tecnológico local con soluciones innovadoras."
    },
    {
      id: 1,
      title: "Innovación Sostenible", 
      company: "EcoVerde",
      duration: "3:45",
      category: "Sostenibilidad",
      thumbnail: "/placeholder.jpg",
      description: "Revolucionando la industria con prácticas ambientalmente responsables."
    },
    {
      id: 2,
      title: "Sabores Auténticos",
      company: "Gastronomía Valluna", 
      duration: "6:12",
      category: "Gastronomía",
      thumbnail: "/placeholder.jpg",
      description: "Preservando las tradiciones culinarias mientras innovan en el mercado moderno."
    },
    {
      id: 3,
      title: "Tejiendo Sueños",
      company: "Textiles del Valle",
      duration: "5:28", 
      category: "Textil",
      thumbnail: "/placeholder.jpg",
      description: "Fusionando técnicas tradicionales con diseño contemporáneo para conquistar mercados globales."
    },
    {
      id: 4,
      title: "Conectando Sueños",
      company: "Logística Express",
      duration: "4:15",
      category: "Transporte",
      thumbnail: "/placeholder.jpg",
      description: "Transformando la cadena de suministro con tecnología de punta y compromiso social."
    }
  ]

  const currentVideo = videos[selectedVideo]

  const nextVideo = () => {
    setSelectedVideo((prev) => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    setSelectedVideo((prev) => (prev - 1 + videos.length) % videos.length)
  }

  return (
    <section className="py-6 lg:py-8 bg-primary/60">
      <div className="container mx-auto px-6">
        
        {/* Centered Floating Container */}
        <div className="flex items-center justify-center px-4 lg:px-8">
          <div className="relative max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full">
            
            {/* Main Container - Mobile: Single Column, Desktop: Two Columns */}
            <div className="relative p-3 md:p-4 lg:p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-500 group">
              
              <div className="lg:flex lg:gap-6">
                
                {/* Video Card - Left Column on Desktop */}
                <div className="lg:flex-1">
                  
                  {/* Video Area */}
                  <div className="relative aspect-video mb-2 lg:mb-3 rounded-2xl overflow-hidden bg-gray-300 min-h-[180px] md:min-h-[220px] lg:min-h-[260px] xl:min-h-[300px]">
                    
                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-400 text-white flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                        <Play className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 text-white text-xs tracking-wide px-2 py-1 rounded">
                        {currentVideo.duration}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Controls - Only show on mobile */}
                  <div className="flex lg:hidden justify-center items-center gap-4 mb-3">
                    <button 
                      onClick={prevVideo}
                      className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="text-white text-sm font-medium">
                      {selectedVideo + 1} / {videos.length}
                    </span>
                    
                    <button 
                      onClick={nextVideo}
                      className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Information */}
                  <div className="text-center lg:text-left space-y-2 lg:space-y-3 mb-4 lg:mb-5">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2 transition-all duration-500 text-white">
                      {currentVideo.title}
                    </h2>
                    <div className="inline-block">
                      <span className="text-xs lg:text-sm bg-gray-400 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full">
                        {currentVideo.category}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm lg:text-base mt-3 hidden lg:block">
                      {currentVideo.description}
                    </p>
                  </div>

                  {/* Progress Indicators - Only show on mobile */}
                  <div className="flex lg:hidden justify-center space-x-2">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVideo(index)}
                        className={`transition-all duration-300 rounded-full ${
                          selectedVideo === index 
                            ? 'w-8 h-2 bg-gray-400' 
                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Video List - Right Column on Desktop Only */}
                <div className="hidden lg:block lg:w-80 xl:w-96">
                  <div className="space-y-3">
                    <h3 className="text-white text-lg font-semibold mb-4">Historias Destacadas</h3>
                    
                    {videos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(index)}
                        className={`w-full p-3 rounded-xl transition-all duration-300 text-left group ${
                          selectedVideo === index 
                            ? 'bg-white/20 border border-white/30' 
                            : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-400 flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white" fill="currentColor" />
                            </div>
                            <div className="absolute bottom-1 right-1">
                              <span className="bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                {video.duration}
                              </span>
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate group-hover:text-white transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-white/70 text-xs mt-1 truncate">
                              {video.company}
                            </p>
                            <div className="mt-1">
                              <span className="inline-block bg-gray-500/50 text-white text-xs px-2 py-0.5 rounded">
                                {video.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export { CompanyStories }