"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { User, Briefcase, MapPin, FileText } from "lucide-react"

interface ProfileSetupProps {
  userData: { name: string; email: string }
  onComplete: (profileData: ProfileData) => void
}

interface ProfileData {
  displayName: string
  profession: string
  location: string
  bio: string
  phone: string
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ userData, onComplete }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: userData.name,
    profession: "",
    location: "",
    bio: "",
    phone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(profileData)
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-white/20 backdrop-blur-md border-stone-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: "#22C55E" }}>
            Configura tu Ficha
          </CardTitle>
          <CardDescription className="text-white">
            Completa la información para crear tu ficha profesional
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-white">
                Nombre para mostrar
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Como quieres que aparezca tu nombre"
                  value={profileData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="pl-10 bg-transparent border-stone-200 text-white placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-white">
                Profesión/Cargo
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="profession"
                  type="text"
                  placeholder="Ej: Desarrollador Full Stack, Diseñador UX"
                  value={profileData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="pl-10 bg-transparent border-stone-200 text-white placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Ubicación
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="location"
                  type="text"
                  placeholder="Ej: Cali, Valle del Cauca"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10 bg-transparent border-stone-200 text-white placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+57 300 123 4567"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-transparent border-stone-200 text-white placeholder:text-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Descripción Personal
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="bio"
                  placeholder="Cuéntanos sobre ti, tus habilidades y experiencia..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="pl-10 pt-3 bg-transparent border-stone-200 text-white placeholder:text-gray-300 min-h-[100px]"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Crear Mi Ficha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProfileSetup }
export type { ProfileData }