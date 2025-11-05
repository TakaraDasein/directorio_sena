"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Briefcase,
  Eye,
  Share2,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Star,
  Clock,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Store,
  ShoppingCart,
  Package,
} from "lucide-react"
import type { CompanyWithRelations } from "@/lib/types/database.types"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getThemeById, applyTheme } from "@/lib/themes"

interface CompanyProfileProps {
  company: CompanyWithRelations
}

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
}

const categoryLabels: Record<string, string> = {
  'egresado': 'Egresado SENA',
  'empresa': 'Empresa',
  'instructor': 'Instructor SENA'
}

const daysOfWeek = [
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADOS',
  'DOMINGOS'
]

export function CompanyProfile({ company }: CompanyProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Obtener color personalizado
  const primaryColor = (company as any).custom_color || company.theme_color || '#2F4D2A';
  
  // Aplicar color personalizado de la empresa
  useEffect(() => {
    // Crear estilos dinámicos para la ficha
    const styleId = 'company-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Inyectar CSS personalizado
    styleElement.textContent = `
      .custom-primary-bg {
        background-color: ${primaryColor} !important;
      }
      .custom-primary-text {
        color: ${primaryColor} !important;
      }
      .custom-primary-bg-10 {
        background-color: ${primaryColor}1A !important;
      }
      .custom-primary-border {
        border-color: ${primaryColor} !important;
      }
      .custom-primary-ring {
        --tw-ring-color: ${primaryColor} !important;
      }
      .custom-primary-hover:hover {
        background-color: ${primaryColor}DD !important;
      }
      
      /* Sobrescribir botones SENA con color personalizado */
      .sena-btn-primary {
        background-color: ${primaryColor} !important;
      }
      .sena-btn-primary:hover {
        background-color: ${primaryColor}DD !important;
      }
      .sena-btn-secondary {
        border-color: ${primaryColor} !important;
        color: ${primaryColor} !important;
      }
      .sena-btn-secondary:hover {
        background-color: ${primaryColor}0D !important;
      }
      
      /* Iconos y elementos con clase sena-icon-box */
      .sena-icon-box {
        background-color: ${primaryColor}1A !important;
      }
      .sena-icon-box svg {
        color: ${primaryColor} !important;
      }
      
      /* Sobrescribir clases de Tailwind/Shadcn */
      .text-primary {
        color: ${primaryColor} !important;
      }
      .bg-primary {
        background-color: ${primaryColor} !important;
      }
      .border-primary {
        border-color: ${primaryColor} !important;
      }
      .hover\\:border-primary\\/30:hover {
        border-color: ${primaryColor}4D !important;
      }
    `;
    
    return () => {
      // Cleanup cuando el componente se desmonte
      styleElement?.remove();
    };
  }, [primaryColor])
  
  // Obtener imágenes por tipo
  const logoImage = company.company_images?.find(img => img.image_type === 'logo')
  const coverImage = company.company_images?.find(img => img.image_type === 'cover')
  const galleryImages = company.company_images?.filter(img => img.image_type === 'gallery') || []
  
  // Carrusel de imágenes
  const carouselImages = coverImage ? [coverImage, ...galleryImages] : galleryImages
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: company.company_name,
          text: company.short_description || '',
          url: window.location.href
        })
      } catch (err) {
        console.log('Error al compartir:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('¡URL copiada al portapapeles!')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimalista estilo Vercel */}
      <div className="relative border-b border-gray-200">
        {/* Cover Image - Más bajo y elegante */}
        <div className="relative h-[280px] md:h-[320px] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden">
          {carouselImages.length > 0 ? (
            <div className="relative h-full group">
              <Image
                src={carouselImages[currentImageIndex].image_url}
                alt={carouselImages[currentImageIndex].alt_text || company.company_name}
                fill
                className="object-cover opacity-90"
                priority
                onError={() => setImageError(true)}
              />
              
              {/* Gradient Overlay Sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              
              {/* Carousel Controls - Minimalistas */}
              {carouselImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Indicators - Discretos */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'custom-primary-bg w-6' 
                            : 'bg-gray-300 hover:bg-gray-400 w-1.5'
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-24 w-24 text-gray-300" />
              </div>
            </div>
          )}
        </div>
        
        {/* Company Header - Debajo de la imagen */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo - Estilo Vercel */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-sm border border-gray-200 p-2 overflow-hidden">
                  {logoImage ? (
                    <Image
                      src={logoImage.image_url}
                      alt={`Logo de ${company.company_name}`}
                      fill
                      className="object-contain p-1"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                      {company.company_name}
                    </h1>
                    {company.short_description && (
                      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {company.short_description}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons - Estilo Vercel */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Meta Info - Horizontal con separadores */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <Badge 
                    variant="secondary" 
                    className="custom-primary-bg border-0 font-medium"
                    style={{ color: 'white' }}
                  >
                    {categoryLabels[company.category] || company.category}
                  </Badge>
                  {company.industry && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {company.industry}
                      </span>
                    </>
                  )}
                  {company.city && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.city}
                      </span>
                    </>
                  )}
                  {company.year_founded && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Desde {company.year_founded}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Estilo Vercel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions - Cards estilo Vercel */}
            <div className="flex flex-wrap gap-3">
              {company.phone && (
                <Button 
                  asChild
                  size="lg"
                  className="custom-primary-bg custom-primary-hover text-white font-medium shadow-sm"
                >
                  <a href={`tel:${company.phone}`} className="gap-2">
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                </Button>
              )}
              
              {company.email && (
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <a href={`mailto:${company.email}`} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Correo
                  </a>
                </Button>
              )}
              
              {company.website && (
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Sitio web
                  </a>
                </Button>
              )}
            </div>

            {/* Description - Card minimalista */}
            {company.description && (
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Acerca de</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {company.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Company Details Grid - Estilo Vercel */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Información de la empresa</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.industry && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Industria</p>
                        <p className="font-medium text-gray-900">{company.industry}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.year_founded && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Año de fundación</p>
                        <p className="font-medium text-gray-900">{company.year_founded}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.employee_count && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Users className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Número de empleados</p>
                        <p className="font-medium text-gray-900">{company.employee_count}</p>
                      </div>
                    </div>
                  )}
                  
                  {(company.city || company.department) && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                        <p className="font-medium text-gray-900">
                          {[company.city, company.department].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags/Categories */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {company.category && (
                    <Badge 
                      className="custom-primary-bg hover:custom-primary-bg/90 border-0 px-3 py-1.5 font-medium"
                      style={{ color: 'white' }}
                    >
                      {categoryLabels[company.category]}
                    </Badge>
                  )}
                  {company.industry && (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1.5 font-medium">
                      {company.industry}
                    </Badge>
                  )}
                  {company.employee_count && (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1.5 font-medium">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {company.employee_count}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Califica y escribe un comentario</h3>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-4">Tu Opinión</p>
                  <textarea
                    placeholder="Cuente su experiencia o deje un consejo para otros"
                    className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                  />
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Su calificación general:</p>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-8 w-8 text-gray-300 hover:custom-primary-text cursor-pointer transition-colors" />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Título de su opinión *</label>
                      <input
                        type="text"
                        placeholder="Resuma su opinión"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:custom-primary-ring bg-white text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Nombre *</label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Correo electrónico *</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <Button className="sena-btn-primary">
                    Envíe su opinión
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            {galleryImages.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Galería de fotos</h3>
                    <Button variant="link" className="text-primary">
                      Todas las fotos ({galleryImages.length})
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((image, index) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || `Galería ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products Section */}
            {company.products && company.products.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Store className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Productos</h3>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {company.products.filter((p: any) => p.is_active).length} disponibles
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.products
                      .filter((product: any) => product.is_active)
                      .slice(0, 6)
                      .map((product: any) => (
                      <div 
                        key={product.id}
                        className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
                      >
                        {/* Imagen del producto */}
                        <div className="relative h-48 bg-gray-100">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-16 h-16 text-gray-300" />
                            </div>
                          )}
                          
                          {/* Badge de categoría */}
                          {product.category && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 text-gray-900 border-0">
                                {product.category}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="p-4">
                          <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </h4>
                          
                          {product.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-primary">
                                ${product.price.toLocaleString('es-CO')}
                              </p>
                              {product.stock_quantity > 0 && (
                                <p className="text-xs text-gray-500">
                                  Stock: {product.stock_quantity}
                                </p>
                              )}
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="sena-btn-primary flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {company.products.filter((p: any) => p.is_active).length > 6 && (
                    <div className="mt-6 text-center">
                      <Button variant="outline" className="w-full">
                        Ver todos los productos ({company.products.filter((p: any) => p.is_active).length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Owner/Contact Person Card */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {logoImage ? (
                    <Image
                      src={logoImage.image_url}
                      alt={logoImage.alt_text || company.company_name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1">{company.company_name}</h3>
                <p className="text-gray-600 mb-4">{categoryLabels[company.category]}</p>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold">{company.address || company.city}</p>
                  <Button variant="link" className="text-primary p-0 h-auto">
                    » Obtener las direcciones
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Horarios</h3>
                </div>
                
                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">7:00 am – 6:00 pm</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories/Tags Sidebar */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="sena-icon-box">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">{categoryLabels[company.category]}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="sena-icon-box">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">Eventos</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="sena-icon-box">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">{company.industry}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {company.company_stats && (
              <Card className="bg-gradient-to-br from-secondary to-secondary/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Visitas</span>
                    </div>
                    <span className="font-bold text-2xl text-primary">{company.company_stats.total_views}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
