"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github, 
  Globe,
  ArrowLeft,
  Share2,
  MessageCircle,
  Download,
  QrCode
} from "lucide-react"
import type { ProfileData } from "./profile-setup"

interface ProfileViewProps {
  userData: { name: string; email: string }
  profileData: ProfileData
  onBack: () => void
}

interface SocialMedia {
  platform: string
  url: string
  icon: React.ReactNode
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData, profileData, onBack }) => {
  const profileImage = "/placeholder-user.jpg"
  const coverImage = "/placeholder.jpg"
  
  // Datos de ejemplo para redes sociales
  const socialMedia: SocialMedia[] = [
    { platform: "LinkedIn", url: "#", icon: <Linkedin className="h-5 w-5" /> },
    { platform: "Instagram", url: "#", icon: <Instagram className="h-5 w-5" /> },
    { platform: "GitHub", url: "#", icon: <Github className="h-5 w-5" /> }
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ficha de ${profileData.displayName}`,
        text: `Conoce a ${profileData.displayName} - ${profileData.profession}`,
        url: window.location.href,
      })
    }
  }

  const handleContact = () => {
    window.location.href = `mailto:${userData.email}`
  }

  return (
    <div className="min-h-screen bg-white/10 backdrop-blur-sm">
      
      {/* Header con imagen de portada */}
      <div className="relative h-64 md:h-80">
        <img 
          src={coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Botones de navegación */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Foto de perfil */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img 
            src={profileImage} 
            alt={profileData.displayName} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Información principal */}
          <Card className="bg-white/20 backdrop-blur-md border-stone-200 text-center">
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileData.displayName}
              </h1>
              <p className="text-xl" style={{ color: "#22C55E" }} >
                {profileData.profession}
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 justify-center mt-6">
                <Button 
                  onClick={handleContact}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-stone-200 text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar vCard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Biografía */}
          <Card className="bg-white/20 backdrop-blur-md border-stone-200">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Acerca de mí</h2>
              <p className="text-gray-300 leading-relaxed">
                {profileData.bio}
              </p>
            </CardContent>
          </Card>

          {/* Redes Sociales */}
          {socialMedia.length > 0 && (
            <Card className="bg-white/20 backdrop-blur-md border-stone-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-white mb-4">Conéctate conmigo</h2>
                <div className="flex flex-wrap gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-stone-200 text-white hover:text-green-400 transition-colors"
                    >
                      {social.icon}
                      <span>{social.platform}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Habilidades y Skills (ejemplo) */}
          <Card className="bg-white/20 backdrop-blur-md border-stone-200">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "React", "Node.js", "TypeScript", "Python", "Design Thinking", "UI/UX", "Figma"].map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experiencia (ejemplo) */}
          <Card className="bg-white/20 backdrop-blur-md border-stone-200">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Experiencia</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-green-500 pl-4">
                  <h3 className="font-semibold text-white">Desarrollador Full Stack</h3>
                  <p className="text-green-400">TechCali Solutions • 2023 - Presente</p>
                  <p className="text-gray-300 mt-1">
                    Desarrollo de aplicaciones web usando React, Node.js y bases de datos PostgreSQL.
                  </p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <h3 className="font-semibold text-white">Diseñador UX/UI</h3>
                  <p className="text-green-400">Startup Local • 2022 - 2023</p>
                  <p className="text-gray-300 mt-1">
                    Diseño de interfaces y experiencias de usuario para aplicaciones móviles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-400">
              Ficha creada con <span className="text-green-400">Directorio SENA</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Crea tu propia ficha profesional
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProfileView }