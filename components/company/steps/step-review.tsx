"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  Briefcase,
  Share2,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react"
import type { CompanyRegistrationForm } from "@/lib/types/database.types"

interface StepReviewProps {
  formData: Partial<CompanyRegistrationForm>
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}

export function StepReview({ formData, onBack, onSubmit, loading }: StepReviewProps) {
  const categoryLabels = {
    'emprendimiento-egresado': 'Egresado con Emprendimiento',
    'empresa-fe': 'Empresa Ganadora FE',
    'agente-digitalizador': 'Agente Digitalizador',
    // Legacy values para compatibilidad
    'egresado': 'Egresado con Emprendimiento',
    'empresa': 'Empresa Ganadora FE',
    'instructor': 'Agente Digitalizador'
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle2 className="h-7 w-7 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Revisión y Confirmación</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Revisa la información antes de crear tu ficha empresarial
            </p>
          </div>
        </div>
      </div>

      {/* URL Preview */}
      <Card className="bg-gradient-to-r from-[hsl(111,29%,23%)]/10 to-blue-50 border-2 border-[hsl(111,29%,23%)]/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Tu ficha estará disponible en:</p>
            <div className="bg-white rounded-lg py-3 px-4 inline-block shadow-sm">
              <p className="text-lg font-mono font-bold text-[hsl(111,29%,23%)]">
                directoriosena.com/<span className="text-gray-900">{formData.slug}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre de la Empresa</p>
              <p className="font-semibold">{formData.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categoría</p>
              <Badge variant="secondary">
                {categoryLabels[formData.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Descripción Corta</p>
            <p className="text-gray-900">{formData.short_description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
            </div>
            
            {formData.website && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Sitio Web</p>
                  <p className="font-medium text-blue-600 truncate">{formData.website}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="font-medium">{formData.city}, {formData.department}</p>
              </div>
            </div>
          </div>
          
          {formData.address && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Detalles de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Industria</p>
                <p className="font-medium">{formData.industry}</p>
              </div>
            </div>
            
            {formData.year_founded && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fundada en</p>
                  <p className="font-medium">{formData.year_founded}</p>
                </div>
              </div>
            )}
            
            {formData.employee_count && (
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Empleados</p>
                  <p className="font-medium">{formData.employee_count}</p>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Descripción</p>
            <p className="text-gray-900 whitespace-pre-line">{formData.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      {(() => {
        // Ensure social_links is always an array
        const socialLinksArray = Array.isArray(formData.social_links)
          ? formData.social_links
          : formData.social_links && typeof formData.social_links === 'object'
          ? Object.entries(formData.social_links).map(([platform, url]) => ({
              platform,
              url: url as string
            }))
          : [];

        return socialLinksArray.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Redes Sociales ({socialLinksArray.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {socialLinksArray.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">{link.platform}</p>
                      <p className="text-xs text-gray-600 truncate">{link.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p className="font-semibold mb-1">Antes de continuar</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                <li>Verifica que toda la información sea correcta</li>
                <li>Podrás editar esta información más adelante desde tu panel de administración</li>
                <li>Tu ficha estará visible públicamente una vez creada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={loading}
          className="min-w-[150px] border-2 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Atrás
        </Button>
        
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          disabled={loading}
          className="min-w-[200px] bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creando Ficha...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Crear Mi Ficha
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
