"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ExternalLink, Settings, Eye, Share2, Copy, Check } from "lucide-react"

export default function CompanySuccessPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const companyUrl = `https://directoriosena.com/${params.slug}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(companyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi ficha empresarial',
          text: '¡Mira mi nueva ficha en el Directorio SENA!',
          url: companyUrl
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      handleCopyUrl()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(111,29%,23%)]/5 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-green-100 rounded-full mb-6 animate-bounce shadow-lg">
            <CheckCircle2 className="h-14 w-14 text-[hsl(111,29%,23%)]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¡Ficha Creada Exitosamente! 🎉
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Tu ficha empresarial ya está disponible en:
          </p>
          
          <div className="inline-block bg-white rounded-xl shadow-lg border-2 border-[hsl(111,29%,23%)]/20 p-5 mb-6 hover:shadow-xl transition-shadow">
            <p className="text-xl md:text-2xl font-mono font-bold text-[hsl(111,29%,23%)]">
              directoriosena.com/<span className="text-gray-900">{params.slug}</span>
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-[hsl(111,29%,23%)]/30" onClick={() => router.push(`/${params.slug}`)}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl mb-4 shadow-md">
                  <Eye className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Ver Mi Ficha</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mira cómo se ve tu ficha pública
                </p>
                <Button variant="outline" className="w-full border-2 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold">
                  <Eye className="mr-2 h-5 w-5" />
                  Ver Ficha
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-[hsl(111,29%,23%)]/30" onClick={() => router.push('/admin')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl mb-4 shadow-md">
                  <Settings className="h-8 w-8 text-[hsl(111,29%,23%)]" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Panel de Admin</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Edita y gestiona tu ficha
                </p>
                <Button variant="outline" className="w-full border-2 hover:bg-[hsl(111,29%,23%)]/5 hover:border-[hsl(111,29%,23%)] text-gray-700 hover:text-gray-900 font-semibold">
                  <Settings className="mr-2 h-5 w-5" />
                  Ir al Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Section */}
        <Card className="bg-gradient-to-r from-[hsl(111,29%,23%)]/10 to-green-50 border-2 border-[hsl(111,29%,23%)]/20 shadow-md">
          <CardContent className="pt-6">
            <h3 className="font-bold text-xl mb-4 text-center text-gray-900">Comparte tu Ficha</h3>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={companyUrl}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900"
              />
              <Button onClick={handleCopyUrl} variant="outline" className="border-2 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold">
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
              <Button onClick={handleShare} className="bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] shadow-md hover:shadow-lg font-semibold">
                <Share2 className="h-5 w-5 mr-2" />
                Compartir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 shadow-md">
          <CardContent className="pt-6">
            <h3 className="font-bold text-xl mb-5 text-gray-900">Próximos Pasos Recomendados</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,23%)]/80 rounded-full flex items-center justify-center shadow-md mt-0.5">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Sube tu logo y foto de portada</p>
                  <p className="text-sm text-gray-600">Dale personalidad a tu ficha con imágenes profesionales</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,23%)]/80 rounded-full flex items-center justify-center shadow-md mt-0.5">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Completa tu perfil al 100%</p>
                  <p className="text-sm text-gray-600">Agrega galería de imágenes, testimonios y más información</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,23%)]/80 rounded-full flex items-center justify-center shadow-md mt-0.5">
                  <span className="text-sm font-bold text-white">3</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Comparte tu ficha</p>
                  <p className="text-sm text-gray-600">Difunde tu URL en redes sociales y tarjetas de presentación</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] shadow-md hover:shadow-lg font-bold"
            onClick={() => router.push('/admin')}
          >
            <Settings className="mr-2 h-6 w-6" />
            Ir al Panel de Administración
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold"
            onClick={() => router.push(`/${params.slug}`)}
          >
            <Eye className="mr-2 h-6 w-6" />
            Ver Mi Ficha Pública
          </Button>
        </div>
      </div>
    </div>
  )
}
