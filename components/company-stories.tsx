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
    <section className="snap-panel py-16 lg:py-24 justify-center items-center">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 transition-all duration-500">
            {currentVideo.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            Historia de {currentVideo.company}
          </p>
        </div>

        {/* Centered Floating Container */}
        <div className="flex items-center justify-center">
          <div className="relative max-w-2xl mx-auto">
            
            {/* Video Card */}
            <div className="relative p-8 bg-card rounded-2xl shadow-lg transition-all duration-500 group">
              
              {/* Video Area */}
              <div className="relative aspect-video mb-4 rounded-2xl overflow-hidden bg-muted">
                
                {/* Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 text-white text-xs tracking-wide px-2 py-1 rounded">
                    {currentVideo.duration}
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <button 
                  onClick={prevVideo}
                  className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-muted-foreground text-sm font-medium">
                  {selectedVideo + 1} / {videos.length}
                </span>
                
                <button 
                  onClick={nextVideo}
                  className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Video Information */}
              <div className="text-center space-y-3 mb-8">
                <p className="text-muted-foreground text-sm tracking-wide max-w-md mx-auto">
                  {currentVideo.description}
                </p>
                <div className="inline-block">
                  <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    {currentVideo.category}
                  </span>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center space-x-2">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVideo(index)}
                    className={`transition-all duration-300 rounded-full ${
                      selectedVideo === index 
                        ? 'w-8 h-2 bg-primary' 
                        : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export { CompanyStories }