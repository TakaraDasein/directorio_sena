"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Camera, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github, 
  Globe, 
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Plus,
  X,
  QrCode,
  Share2,
  Eye
} from "lucide-react"
import type { ProfileData } from "./profile-setup"

interface AdminPanelProps {
  userData: { name: string; email: string }
  profileData: ProfileData
  onViewProfile: () => void
}

interface SocialMedia {
  platform: string
  url: string
  icon: React.ReactNode
}

const AdminPanel: React.FC<AdminPanelProps> = ({ userData, profileData: initialProfile, onViewProfile }) => {
  const [profileData, setProfileData] = useState(initialProfile)
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg")
  const [coverImage, setCoverImage] = useState<string>("/placeholder.jpg")
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialUrl, setNewSocialUrl] = useState("")
  
  const profileImageRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)

  const socialPlatforms = [
    { name: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { name: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    { name: "GitHub", icon: <Github className="h-4 w-4" /> },
    { name: "Website", icon: <Globe className="h-4 w-4" /> }
  ]

  const handleImageUpload = (type: 'profile' | 'cover', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (type === 'profile') {
          setProfileImage(imageUrl)
        } else {
          setCoverImage(imageUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addSocialMedia = () => {
    if (newSocialPlatform && newSocialUrl) {
      const platform = socialPlatforms.find(p => p.name === newSocialPlatform)
      if (platform) {
        setSocialMedia(prev => [...prev, {
          platform: newSocialPlatform,
          url: newSocialUrl,
          icon: platform.icon
        }])
        setNewSocialPlatform("")
        setNewSocialUrl("")
      }
    }
  }

  const removeSocialMedia = (index: number) => {
    setSocialMedia(prev => prev.filter((_, i) => i !== index))
  }

  const profileUrl = `https://directorio-sena.com/profile/${userData.email.split('@')[0]}`

  return (
    <div className="min-h-screen bg-white/10 backdrop-blur-sm p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/20 backdrop-blur-md border-stone-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#22C55E" }}>
                  Panel de Administración
                </CardTitle>
                <CardDescription className="text-white">
                  Administra tu ficha profesional - {userData.email}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={onViewProfile}
                  variant="outline" 
                  className="bg-white/10 border-stone-200 text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Ficha
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-400/20">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="images" className="text-white data-[state=active]:bg-white/20">
              Imágenes
            </TabsTrigger>
            <TabsTrigger value="social" className="text-white data-[state=active]:bg-white/20">
              Redes Sociales
            </TabsTrigger>
            <TabsTrigger value="share" className="text-white data-[state=active]:bg-white/20">
              Compartir
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-white/20 backdrop-blur-md border-stone-200">
              <CardHeader>
                <CardTitle className="text-white">Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre</Label>
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-transparent border-stone-200 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Profesión</Label>
                    <Input
                      value={profileData.profession}
                      onChange={(e) => setProfileData(prev => ({ ...prev, profession: e.target.value }))}
                      className="bg-transparent border-stone-200 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Ubicación</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-transparent border-stone-200 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Teléfono</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-transparent border-stone-200 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Biografía</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-transparent border-stone-200 text-white min-h-[100px]"
                  />
                </div>
                
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card className="bg-white/20 backdrop-blur-md border-stone-200">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Imágenes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Foto de Perfil */}
                <div className="space-y-4">
                  <Label className="text-white text-lg">Foto de Perfil</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-stone-200"
                      />
                      <button 
                        onClick={() => profileImageRef.current?.click()}
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 text-white hover:bg-green-600"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                    <div>
                      <Button 
                        onClick={() => profileImageRef.current?.click()}
                        variant="outline"
                        className="bg-white/10 border-stone-200 text-white hover:bg-white/20"
                      >
                        Cambiar Foto
                      </Button>
                      <p className="text-sm text-gray-300 mt-1">
                        Recomendado: 400x400px, formato JPG o PNG
                      </p>
                    </div>
                  </div>
                  <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload('profile', e)}
                  />
                </div>

                {/* Imagen de Portada */}
                <div className="space-y-4">
                  <Label className="text-white text-lg">Imagen de Portada</Label>
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className="w-full h-32 rounded-lg object-cover border-2 border-stone-200"
                      />
                      <button 
                        onClick={() => coverImageRef.current?.click()}
                        className="absolute top-2 right-2 bg-green-500 rounded-full p-2 text-white hover:bg-green-600"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <Button 
                        onClick={() => coverImageRef.current?.click()}
                        variant="outline"
                        className="bg-white/10 border-stone-200 text-white hover:bg-white/20"
                      >
                        Cambiar Portada
                      </Button>
                      <p className="text-sm text-gray-300 mt-1">
                        Recomendado: 1200x400px, formato JPG o PNG
                      </p>
                    </div>
                  </div>
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload('cover', e)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card className="bg-white/20 backdrop-blur-md border-stone-200">
              <CardHeader>
                <CardTitle className="text-white">Redes Sociales</CardTitle>
                <CardDescription className="text-gray-300">
                  Agrega tus redes sociales para que las personas puedan conectar contigo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Agregar nueva red social */}
                <div className="space-y-4 p-4 border border-stone-200 rounded-lg">
                  <Label className="text-white">Agregar Red Social</Label>
                  <div className="flex gap-2">
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="px-3 py-2 bg-transparent border border-stone-200 text-white rounded-md"
                    >
                      <option value="">Seleccionar plataforma</option>
                      {socialPlatforms.map(platform => (
                        <option key={platform.name} value={platform.name} className="bg-gray-800">
                          {platform.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="URL completa (https://...)"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="bg-transparent border-stone-200 text-white flex-1"
                    />
                    <Button 
                      onClick={addSocialMedia}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Lista de redes sociales */}
                <div className="space-y-2">
                  <Label className="text-white">Redes Configuradas</Label>
                  {socialMedia.length === 0 ? (
                    <p className="text-gray-300 text-center py-8">
                      No has agregado ninguna red social aún
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {socialMedia.map((social, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            {social.icon}
                            <div>
                              <p className="text-white font-medium">{social.platform}</p>
                              <p className="text-gray-300 text-sm">{social.url}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeSocialMedia(index)}
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <Card className="bg-white/20 backdrop-blur-md border-stone-200">
              <CardHeader>
                <CardTitle className="text-white">Compartir Ficha</CardTitle>
                <CardDescription className="text-gray-300">
                  Comparte tu ficha profesional con el mundo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* URL de la ficha */}
                <div className="space-y-2">
                  <Label className="text-white">URL de tu Ficha</Label>
                  <div className="flex gap-2">
                    <Input
                      value={profileUrl}
                      readOnly
                      className="bg-transparent border-stone-200 text-white"
                    />
                    <Button 
                      onClick={() => navigator.clipboard.writeText(profileUrl)}
                      variant="outline"
                      className="bg-white/10 border-stone-200 text-white hover:bg-white/20"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                {/* Código QR */}
                <div className="text-center space-y-4">
                  <Label className="text-white text-lg">Código QR</Label>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Las personas pueden escanear este código QR para ver tu ficha
                  </p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Descargar QR
                  </Button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-stone-200 rounded-lg">
                    <p className="text-2xl font-bold text-white">127</p>
                    <p className="text-gray-300 text-sm">Visitas</p>
                  </div>
                  <div className="text-center p-4 border border-stone-200 rounded-lg">
                    <p className="text-2xl font-bold text-white">23</p>
                    <p className="text-gray-300 text-sm">Compartidas</p>
                  </div>
                  <div className="text-center p-4 border border-stone-200 rounded-lg">
                    <p className="text-2xl font-bold text-white">8</p>
                    <p className="text-gray-300 text-sm">Contactos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export { AdminPanel }