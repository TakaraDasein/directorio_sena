"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Plus, Trash2, ArrowLeft, ArrowRight, Instagram, Facebook, Twitter, Linkedin, Youtube, Globe, MessageCircle } from "lucide-react"
import type { CompanyRegistrationForm } from "@/lib/types/database.types"

interface StepSocialLinksProps {
  formData: Partial<CompanyRegistrationForm>
  onUpdate: (data: Partial<CompanyRegistrationForm>) => void
  onNext: () => void
  onBack: () => void
}

interface SocialLink {
  platform: string
  url: string
}

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, prefix: 'https://instagram.com/', placeholder: '@usuario o URL completa' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, prefix: 'https://facebook.com/', placeholder: 'usuario o URL completa' },
  { value: 'twitter', label: 'X (Twitter)', icon: Twitter, prefix: 'https://x.com/', placeholder: '@usuario o URL completa' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: 'https://linkedin.com/company/', placeholder: 'empresa o URL completa' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, prefix: 'https://youtube.com/', placeholder: 'canal o URL completa' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, prefix: 'https://wa.me/', placeholder: '573001234567' },
  { value: 'tiktok', label: 'TikTok', icon: Globe, prefix: 'https://tiktok.com/@', placeholder: '@usuario' },
  { value: 'website', label: 'Otro Sitio Web', icon: Globe, prefix: '', placeholder: 'https://www.ejemplo.com' },
]

export function StepSocialLinks({ formData, onUpdate, onNext, onBack }: StepSocialLinksProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    formData.social_links || []
  )
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("")

  const handleAddLink = () => {
    if (!selectedPlatform || !inputValue.trim()) {
      alert("Por favor selecciona una plataforma e ingresa la URL")
      return
    }

    // Check if platform already exists
    if (socialLinks.some(link => link.platform === selectedPlatform)) {
      alert("Ya agregaste esta red social. Puedes editarla o eliminarla.")
      return
    }

    const platform = SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)
    if (!platform) return

    // Format URL
    let finalUrl = inputValue.trim()
    
    // If it's not a full URL, prepend the prefix
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      // Remove @ if present
      finalUrl = finalUrl.replace(/^@/, '')
      finalUrl = platform.prefix + finalUrl
    }

    setSocialLinks([...socialLinks, {
      platform: selectedPlatform,
      url: finalUrl
    }])

    // Reset inputs
    setSelectedPlatform("")
    setInputValue("")
  }

  const handleRemoveLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Social links are optional, so we can continue even if empty
    onUpdate({
      social_links: socialLinks
    })
    onNext()
  }

  const handleSkip = () => {
    onUpdate({
      social_links: []
    })
    onNext()
  }

  const getPlatformInfo = (platformValue: string) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platformValue)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl flex items-center justify-center shadow-sm">
            <Share2 className="h-7 w-7 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Redes Sociales</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Conecta tus redes sociales para que los clientes puedan encontrarte fácilmente
            </p>
          </div>
        </div>
      </div>

      {/* Add new social link */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Agregar Red Social</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una red" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const Icon = platform.icon
                    const isAdded = socialLinks.some(link => link.platform === platform.value)
                    return (
                      <SelectItem 
                        key={platform.value} 
                        value={platform.value}
                        disabled={isAdded}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {platform.label}
                          {isAdded && <span className="text-xs text-gray-500">(agregado)</span>}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url">URL o Usuario</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="text"
                  placeholder={
                    selectedPlatform 
                      ? SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.placeholder 
                      : "Primero selecciona una plataforma"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!selectedPlatform}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!selectedPlatform || !inputValue.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {selectedPlatform && (
                <p className="text-xs text-gray-500">
                  Ejemplo: {SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.prefix}
                  {SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.placeholder.replace('@', '')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List of added social links */}
      {socialLinks.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Redes Sociales Agregadas ({socialLinks.length})</h3>
          
          {socialLinks.map((link, index) => {
            const platformInfo = getPlatformInfo(link.platform)
            const Icon = platformInfo?.icon || Globe
            
            return (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {platformInfo?.label || link.platform}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No has agregado ninguna red social todavía</p>
              <p className="text-sm text-gray-500 mt-1">
                Agrega tus redes sociales para que los clientes puedan conectar contigo
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Share2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 Consejo</p>
            <p>
              Agregar tus redes sociales aumenta la confianza de los clientes y les permite 
              conocer mejor tu empresa. Puedes saltarte este paso y agregar las redes después.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="min-w-[150px] border-2 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Atrás
        </Button>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleSkip}
            className="font-semibold"
          >
            Saltar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="min-w-[200px] bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  )
}
