"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { StepBasicInfo } from "./steps/step-basic-info"
import { StepCompanyDetails } from "./steps/step-company-details"
import { StepSocialLinks } from "./steps/step-social-links"
import { StepReview } from "./steps/step-review"
import type { CompanyRegistrationForm } from "@/lib/types/database.types"

type RegistrationStep = 1 | 2 | 3 | 4

export function CompanyRegistrationFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Partial<CompanyRegistrationForm>>({
    category: 'empresa',
    country: 'Colombia',
    social_links: []
  })

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      setIsEditMode(true)
      setCompanyId(editId)
      loadCompanyData(editId)
    } else {
      checkUser()
    }
  }, [])

  const loadCompanyData = async (id: string) => {
    try {
      setLoading(true)
      
      // Verificar usuario
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)

      // Cargar datos de la empresa
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Verificar que sea del usuario actual
        .single()

      if (error || !company) {
        console.error('Error al cargar empresa:', error)
        alert('No se pudo cargar la información de la empresa')
        router.push('/admin')
        return
      }

      // Llenar el formulario con los datos existentes
      setFormData({
        company_name: company.company_name,
        slug: company.slug,
        category: company.category,
        short_description: company.short_description,
        description: company.description,
        industry: company.industry,
        website: company.website,
        email: company.email,
        phone: company.phone,
        whatsapp: company.whatsapp,
        address: company.address,
        city: company.city,
        department: company.department,
        year_founded: company.year_founded,
        employee_count: company.employee_count,
        // Convertir social_links de objeto a array
        social_links: Array.isArray(company.social_links)
          ? company.social_links // Ya es un array
          : company.social_links && typeof company.social_links === 'object'
          ? Object.entries(company.social_links).map(([platform, url]) => ({
              platform,
              url: url as string
            }))
          : [],
        logo_url: company.logo_url,
        cover_image_url: company.cover_image_url,
        theme: company.theme
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
    } else {
      setUser(user)
      setFormData(prev => ({ ...prev, email: user.email }))
    }
  }

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const stepTitles = {
    1: "Información Básica",
    2: "Detalles de la Empresa",
    3: "Redes Sociales",
    4: "Revisión y Confirmación"
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((currentStep + 1) as RegistrationStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RegistrationStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleUpdateFormData = (data: Partial<CompanyRegistrationForm>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      if (isEditMode && companyId) {
        // MODO EDICIÓN: Actualizar empresa existente
        
        // Convertir social_links de array a objeto
        const socialLinksObject: Record<string, string> = {};
        if (formData.social_links && Array.isArray(formData.social_links)) {
          formData.social_links.forEach((link: any) => {
            if (link.platform && link.url) {
              socialLinksObject[link.platform] = link.url;
            }
          });
        }
        
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            company_name: formData.company_name!,
            category: formData.category!,
            email: formData.email!,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            city: formData.city!,
            department: formData.department!,
            description: formData.description!,
            short_description: formData.short_description!,
            year_founded: formData.year_founded,
            employee_count: formData.employee_count,
            industry: formData.industry!,
            social_links: socialLinksObject,
            logo_url: formData.logo_url,
            cover_image_url: formData.cover_image_url,
            theme: formData.theme,
            updated_at: new Date().toISOString()
          })
          .eq('id', companyId)
          .eq('user_id', user.id)

        if (updateError) throw updateError

        // Redirigir al admin después de actualizar
        router.push('/admin')
        alert('¡Empresa actualizada exitosamente!')
        
      } else {
        // MODO CREACIÓN: Crear nueva empresa
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            user_id: user.id,
            slug: formData.slug!,
            company_name: formData.company_name!,
            category: formData.category!,
            email: formData.email!,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            city: formData.city!,
            department: formData.department!,
            country: formData.country,
            description: formData.description!,
            short_description: formData.short_description!,
            year_founded: formData.year_founded,
            employee_count: formData.employee_count,
            industry: formData.industry!,
            visibility: 'public',
            is_active: true
          })
          .select()
          .single()

        if (companyError) throw companyError

        // 2. Insertar enlaces sociales (solo en creación, en edición se actualizan en el campo social_links)
        if (formData.social_links && formData.social_links.length > 0) {
          const socialLinksToInsert = formData.social_links.map((link, index) => ({
            company_id: company.id,
            platform: link.platform,
            url: link.url,
            display_order: index
          }))

          const { error: socialError } = await supabase
            .from('social_links')
            .insert(socialLinksToInsert)

          if (socialError) throw socialError
        }

        // 3. Crear entrada de estadísticas
        await supabase
          .from('company_stats')
          .insert({
            company_id: company.id,
            total_views: 0,
            unique_visitors: 0,
            profile_shares: 0,
            contact_clicks: 0
          })

        // Redirigir a la página de éxito con el slug
        router.push(`/company/${formData.slug}/success`)
      }
      
    } catch (error: any) {
      console.error('Error al procesar la empresa:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
            isEditMode={isEditMode}
            currentCompanyId={companyId}
          />
        )
      case 2:
        return (
          <StepCompanyDetails
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <StepSocialLinks
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <StepReview
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {isEditMode ? 'Editar Empresa' : 'Crear Ficha de Empresa'}
            </h1>
            <span className="text-sm font-semibold text-[hsl(111,29%,23%)] bg-[hsl(111,29%,23%)]/10 px-4 py-2 rounded-lg">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>{stepTitles[currentStep]}</span>
              <span className="text-[hsl(111,29%,23%)]">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all ${
                    currentStep > step
                      ? 'bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] text-white scale-110'
                      : currentStep === step
                      ? 'bg-gradient-to-br from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)] text-white ring-4 ring-[hsl(111,29%,23%)]/20'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-2 mx-3 rounded-full transition-all ${
                      currentStep > step ? 'bg-gradient-to-r from-[hsl(111,29%,23%)] to-[hsl(111,29%,18%)]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 md:p-10">
          {renderStep()}
        </div>

        {/* Footer text */}
        <div className="mt-8 text-center text-sm text-gray-600 bg-white/50 backdrop-blur rounded-lg p-4">
          <p className="font-medium">¿Necesitas ayuda? Contáctanos en <span className="text-[hsl(111,29%,23%)] font-semibold">soporte@directoriosena.com</span></p>
        </div>
      </div>
    </div>
  )
}
