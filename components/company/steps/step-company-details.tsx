"use client"

import { useState } from "react"
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
import { Building2, MapPin, Phone, Globe, Calendar, Users as UsersIcon, Briefcase, ArrowLeft, ArrowRight } from "lucide-react"
import type { CompanyRegistrationForm } from "@/lib/types/database.types"

interface StepCompanyDetailsProps {
  formData: Partial<CompanyRegistrationForm>
  onUpdate: (data: Partial<CompanyRegistrationForm>) => void
  onNext: () => void
  onBack: () => void
}

const DEPARTMENT_OPTIONS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
  'Vaupés', 'Vichada'
]

const INDUSTRY_OPTIONS = [
  'Tecnología e Informática',
  'Salud y Bienestar',
  'Educación y Formación',
  'Manufactura e Industria',
  'Comercio y Retail',
  'Servicios Profesionales',
  'Construcción e Infraestructura',
  'Agricultura y Ganadería',
  'Turismo y Hospitalidad',
  'Transporte y Logística',
  'Finanzas y Seguros',
  'Marketing y Publicidad',
  'Consultoría',
  'Arte y Diseño',
  'Alimentación y Bebidas',
  'Energía y Recursos Naturales',
  'Telecomunicaciones',
  'Medios y Entretenimiento',
  'Deporte y Recreación',
  'Otro',
]

const EMPLOYEE_COUNT_OPTIONS = [
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '200+', label: 'Más de 200 empleados' },
]

export function StepCompanyDetails({ formData, onUpdate, onNext, onBack }: StepCompanyDetailsProps) {
  const [phone, setPhone] = useState(formData.phone || "")
  const [website, setWebsite] = useState(formData.website || "")
  const [address, setAddress] = useState(formData.address || "")
  const [city, setCity] = useState(formData.city || "")
  const [department, setDepartment] = useState(formData.department || "")
  const [description, setDescription] = useState(formData.description || "")
  const [yearFounded, setYearFounded] = useState(formData.year_founded?.toString() || "")
  const [employeeCount, setEmployeeCount] = useState(formData.employee_count || "")
  const [industry, setIndustry] = useState(formData.industry || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || !city || !department || !description || !industry) {
      alert("Por favor, completa todos los campos requeridos")
      return
    }

    onUpdate({
      phone,
      website: website || undefined,
      address: address || undefined,
      city,
      department,
      description,
      year_founded: yearFounded ? parseInt(yearFounded) : undefined,
      employee_count: employeeCount || undefined,
      industry
    })
    onNext()
  }

  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(111,29%,23%)]/20 to-[hsl(111,29%,23%)]/10 rounded-xl flex items-center justify-center shadow-sm">
            <Briefcase className="h-7 w-7 text-[hsl(111,29%,23%)]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Detalles de la Empresa</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Información completa para tu ficha profesional
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Teléfono de Contacto <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm rounded-l-md font-medium">
                +57
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-l-none text-base text-gray-900 bg-white border-gray-300"
                required
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Número de teléfono colombiano (10 dígitos)
          </p>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sitio Web
          </Label>
          <div className="relative">
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm rounded-l-md font-medium">
                https://www.
              </span>
              <Input
                id="website"
                type="text"
                placeholder="tuempresa.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-l-none text-base text-gray-900 bg-white border-gray-300"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Solo escribe tu dominio (ejemplo: v1tr0.com)
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Dirección
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="Calle 5 #38-25, Barrio San Fernando"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="text-base text-gray-900 bg-white border-gray-300"
        />
        <p className="text-sm text-gray-600">
          Dirección completa de tu empresa (opcional)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-base font-semibold text-gray-900">
            Ciudad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="Cali"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-base text-gray-900 bg-white border-gray-300"
            required
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="text-base font-semibold text-gray-900">
            Departamento <span className="text-red-500">*</span>
          </Label>
          <Select value={department} onValueChange={setDepartment} required>
            <SelectTrigger className="text-base text-gray-900 bg-white border-gray-300">
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-gray-900">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-base font-semibold text-gray-900">
          Industria / Sector <span className="text-red-500">*</span>
        </Label>
        <Select value={industry} onValueChange={setIndustry} required>
          <SelectTrigger className="text-base text-gray-900 bg-white border-gray-300">
            <SelectValue placeholder="Selecciona una industria" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {INDUSTRY_OPTIONS.map((ind) => (
              <SelectItem key={ind} value={ind} className="text-gray-900">
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">
          Selecciona el sector que mejor describe tu empresa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year Founded */}
        <div className="space-y-2">
          <Label htmlFor="year-founded" className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Año de Fundación
          </Label>
          <Input
            id="year-founded"
            type="number"
            placeholder="2020"
            value={yearFounded}
            onChange={(e) => setYearFounded(e.target.value)}
            className="text-base text-gray-900 bg-white border-gray-300"
            min="1900"
            max={currentYear}
          />
        </div>

        {/* Employee Count */}
        <div className="space-y-2">
          <Label htmlFor="employee-count" className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Número de Empleados
          </Label>
          <Select value={employeeCount} onValueChange={setEmployeeCount}>
            <SelectTrigger className="text-base text-gray-900 bg-white border-gray-300">
              <SelectValue placeholder="Selecciona un rango" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {EMPLOYEE_COUNT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-gray-900">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold text-gray-900">
          Descripción Detallada <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe tu empresa, servicios, productos, valores, equipo y cualquier otra información relevante que quieras compartir con potenciales clientes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-base resize-none text-gray-900 bg-white border-gray-300"
          rows={8}
          maxLength={2000}
          required
        />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Esta descripción aparecerá en tu página de empresa</span>
          <span className="text-gray-900 font-semibold">{description.length}/2000</span>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[hsl(111,29%,23%)]/5 border-2 border-[hsl(111,29%,23%)]/20 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Building2 className="h-5 w-5 text-[hsl(111,29%,23%)]" />
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-1 text-gray-900">💡 Consejo</p>
            <p className="text-gray-700">
              Una descripción detallada y bien redactada ayuda a que los clientes entiendan 
              mejor tus servicios y aumenta la confianza en tu empresa.
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
        <Button
          type="submit"
          size="lg"
          className="min-w-[200px] bg-[hsl(111,29%,23%)] hover:bg-[hsl(111,29%,18%)] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          Continuar
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}
