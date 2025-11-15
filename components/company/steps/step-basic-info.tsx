"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, CheckCircle2, XCircle, Loader2, Eye, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { CompanyRegistrationForm, CATEGORY_OPTIONS } from "@/lib/types/database.types"

interface StepBasicInfoProps {
  formData: Partial<CompanyRegistrationForm>
  onUpdate: (data: Partial<CompanyRegistrationForm>) => void
  onNext: () => void
  isEditMode?: boolean
  currentCompanyId?: string | null
}

const categoryOptions: typeof CATEGORY_OPTIONS = [
  { value: 'emprendimiento-egresado', label: 'Egresado con Emprendimiento', description: 'Emprendimiento de egresado del SENA' },
  { value: 'empresa-fe', label: 'Empresa Ganadora FE', description: 'Empresa ganadora del Fondo Emprender' },
  { value: 'agente-digitalizador', label: 'Agente Digitalizador', description: 'Agente digitalizador aprobado' },
]

export function StepBasicInfo({ formData, onUpdate, onNext, isEditMode = false, currentCompanyId = null }: StepBasicInfoProps) {
  const supabase = createClient()
  const [companyName, setCompanyName] = useState(formData.company_name || "")
  const [slug, setSlug] = useState(formData.slug || "")
  const [category, setCategory] = useState(formData.category || "empresa-fe")
  const [shortDescription, setShortDescription] = useState(formData.short_description || "")
  
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [nameIsLocked, setNameIsLocked] = useState(false)

  // Cargar nombre y slug desde localStorage (guardado en /company-name)
  useEffect(() => {
    const savedName = localStorage.getItem("companyName")
    const savedSlug = localStorage.getItem("companySlug")
    const savedCategory = localStorage.getItem("selectedCategory")
    
    if (savedName && !formData.company_name) {
      setCompanyName(savedName)
      setNameIsLocked(true)
    }
    
    if (savedSlug && !formData.slug) {
      setSlug(savedSlug)
      // Verificar que el slug todavía esté disponible
      checkSlugAvailability(savedSlug)
    }
    
    if (savedCategory && !formData.category) {
      setCategory(savedCategory as any)
    }
  }, [])

  // Check slug availability with debounce
  useEffect(() => {
    // En modo edición, si el slug no ha cambiado, marcarlo como disponible
    if (isEditMode && slug === formData.slug) {
      setSlugAvailable(true)
      setSlugError(null)
      return
    }

    if (slug.length < 3) {
      setSlugError("El slug debe tener al menos 3 caracteres")
      setSlugAvailable(false)
      return
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError("Solo letras minúsculas, números y guiones")
      setSlugAvailable(false)
      return
    }

    setSlugError(null)
    const timeoutId = setTimeout(() => {
      checkSlugAvailability(slug)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [slug, isEditMode, formData.slug])

  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 80) // Limit length
  }

  const checkSlugAvailability = async (slugToCheck: string) => {
    setCheckingSlug(true)
    try {
      // En modo edición, si el slug es el mismo que el original, marcarlo como disponible
      if (isEditMode && slugToCheck === formData.slug) {
        setSlugAvailable(true)
        setCheckingSlug(false)
        return
      }

      const { data, error } = await supabase
        .rpc('check_slug_availability', { slug_to_check: slugToCheck })

      if (error) throw error
      setSlugAvailable(data)
    } catch (error) {
      console.error('Error checking slug:', error)
      setSlugAvailable(null)
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que el slug esté disponible
    if (!slugAvailable) {
      alert("Por favor, elige un slug disponible")
      return
    }

    if (!companyName || !slug || !shortDescription) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    onUpdate({
      company_name: companyName,
      slug,
      category,
      short_description: shortDescription
    })
    onNext()
  }

  const getSlugStatusIcon = () => {
    if (checkingSlug) {
      return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
    }
    if (slugAvailable === true) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
    if (slugAvailable === false) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="h-7 w-7 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Información Básica</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Comencemos con los datos fundamentales de tu empresa
            </p>
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="company-name" className="text-base font-semibold text-gray-900">
          Nombre de la Empresa <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          type="text"
          placeholder="Ej: Vitro Tecnología SAS"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="text-base text-gray-900 bg-white border-gray-300"
          required
          disabled={nameIsLocked}
        />
        <p className="text-sm text-gray-600">
          {nameIsLocked ? "Este nombre fue seleccionado previamente y no se puede cambiar" : "El nombre completo y oficial de tu empresa"}
        </p>
      </div>

      {/* Slug (URL personalizada) */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-base font-semibold text-gray-900">
          URL Personalizada (Slug) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm rounded-l-md font-medium">
              directoriosena.com/
            </span>
            <Input
              id="slug"
              type="text"
              placeholder="tu-empresa"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              className="rounded-l-none pr-12 text-base text-gray-900 bg-white border-gray-300"
              required
              pattern="[a-z0-9-]+"
              minLength={3}
              maxLength={80}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getSlugStatusIcon()}
            </div>
          </div>
        </div>
        
        {slugError && (
          <p className="text-sm text-red-600 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {slugError}
          </p>
        )}
        
        {slugAvailable === true && (
          <p className="text-sm text-green-700 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            ¡Este slug está disponible!
          </p>
        )}
        
        {slugAvailable === false && !slugError && (
          <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-md">
            <XCircle className="h-4 w-4" />
            Este slug ya está en uso, intenta con otro
          </p>
        )}
        
        <p className="text-sm text-gray-600">
          Esta será tu URL única: <span className="font-mono text-primary font-semibold">directoriosena.com/{slug || 'tu-empresa'}</span>
        </p>
        {isEditMode && (
          <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
            ⚠️ Cambiar la URL puede afectar enlaces existentes. Asegúrate de actualizar cualquier referencia externa.
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-base font-semibold text-gray-900">
          Categoría <span className="text-red-500">*</span>
        </Label>
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
          <SelectTrigger className="text-base text-gray-900 bg-white border-gray-300">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categoryOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className="text-gray-900 data-[highlighted]:bg-primary data-[highlighted]:text-white focus:bg-primary focus:text-white"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs opacity-90">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">
          Selecciona la categoría que mejor describe tu perfil
        </p>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="short-description" className="text-base font-semibold text-gray-900">
          Descripción Corta <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="short-description"
          placeholder="Describe brevemente tu empresa en una línea..."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="text-base resize-none text-gray-900 bg-white border-gray-300"
          rows={3}
          maxLength={500}
          required
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Aparecerá en las búsquedas y tarjetas de vista previa</span>
          <span className="font-medium">{shortDescription.length}/500</span>
        </div>
      </div>

      {/* Preview Card */}
      <Card className="bg-gradient-to-r from-[hsl(111,29%,23%)]/5 to-blue-50 border-2 border-[hsl(111,29%,23%)]/20">
        <CardContent className="pt-6">
          <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[hsl(111,29%,23%)]" />
            Vista Previa de tu Tarjeta
          </h4>
          <div className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="h-7 w-7 text-[hsl(111,29%,23%)]" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-lg text-gray-900">
                  {companyName || "Nombre de tu empresa"}
                </h5>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {shortDescription || "Descripción corta de tu empresa..."}
                </p>
                <p className="text-sm text-[hsl(111,29%,23%)] mt-3 font-mono font-semibold bg-[hsl(111,29%,23%)]/5 inline-block px-3 py-1 rounded-lg">
                  directoriosena.com/{slug || "tu-empresa"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-end pt-8">
        <Button
          type="submit"
          size="lg"
          disabled={!slugAvailable || checkingSlug}
          className="min-w-[200px] bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          Continuar
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </form>
  )
}
