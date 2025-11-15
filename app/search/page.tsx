"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Search, Loader2, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LpNavbar1 } from "@/components/lp-navbar-1"

export const dynamic = 'force-dynamic'

interface Company {
  id: string
  slug: string
  company_name: string
  category: string
  industry: string | null
  city: string | null
  short_description: string | null
  company_images: Array<{
    image_type: string
    image_url: string
  }>
}

const categoryLabels: Record<string, string> = {
  'emprendimiento-egresado': 'Egresado con Emprendimiento',
  'empresa-fe': 'Empresa Ganadora FE',
  'agente-digitalizador': 'Agente Digitalizador',
  // Legacy values para compatibilidad
  'egresado': 'Egresado con Emprendimiento',
  'empresa': 'Empresa Ganadora FE',
  'instructor': 'Agente Digitalizador'
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    searchCompanies()
  }, [query, selectedCategory, selectedIndustry])

  const searchCompanies = async () => {
    setIsLoading(true)
    
    try {
      let queryBuilder = supabase
        .from('companies')
        .select(`
          id,
          slug,
          company_name,
          category,
          industry,
          city,
          short_description,
          company_images (
            image_type,
            image_url
          )
        `)
        .eq('is_active', true)
        .eq('visibility', 'public')
        .order('views_count', { ascending: false })
        .limit(50)

      // Aplicar filtro de búsqueda
      if (query) {
        queryBuilder = queryBuilder.or(`company_name.ilike.%${query}%,industry.ilike.%${query}%,city.ilike.%${query}%,short_description.ilike.%${query}%`)
      }

      // Aplicar filtro de categoría
      if (selectedCategory) {
        queryBuilder = queryBuilder.eq('category', selectedCategory)
      }

      // Aplicar filtro de industria
      if (selectedIndustry) {
        queryBuilder = queryBuilder.eq('industry', selectedIndustry)
      }

      const { data, error } = await queryBuilder

      if (error) throw error

      setCompanies(data || [])
    } catch (error) {
      console.error('Error buscando empresas:', error)
      setCompanies([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchCompanies()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Navbar */}
      <LpNavbar1 />
      
      {/* Search Bar */}
      <div className="bg-white border-b sticky top-[72px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Directorio Empresarial</h1>
            <p className="text-gray-600 mt-1">
              Encuentra empresas, egresados e instructores de la comunidad SENA
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, industria, ciudad..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filtros</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-gray-700 mb-3">Categoría</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Todas
                    </Button>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                {(selectedCategory || selectedIndustry || query) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedIndustry(null)
                      setQuery('')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {isLoading ? (
                  'Buscando...'
                ) : (
                  <>
                    {companies.length} {companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
                    {query && <span className="font-semibold"> para "{query}"</span>}
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company) => {
                  const logoImage = company.company_images?.find(img => img.image_type === 'logo')
                  const coverImage = company.company_images?.find(img => img.image_type === 'cover')

                  return (
                    <Link key={company.id} href={`/${company.slug}`}>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-0">
                          {/* Cover Image */}
                          <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                            {coverImage ? (
                              <Image
                                src={coverImage.image_url}
                                alt={company.company_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-primary/30" />
                              </div>
                            )}
                            
                            {/* Logo Overlay */}
                            <div className="absolute -bottom-8 left-4">
                              <div className="w-16 h-16 bg-white rounded-lg shadow-lg p-2 border-2 border-white">
                                {logoImage ? (
                                  <Image
                                    src={logoImage.image_url}
                                    alt={`Logo ${company.company_name}`}
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                  />
                                ) : (
                                  <Building2 className="h-full w-full text-primary" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="pt-10 px-4 pb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                              {company.company_name}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {categoryLabels[company.category]}
                              </Badge>
                              {company.industry && (
                                <Badge variant="outline" className="text-xs">
                                  {company.industry}
                                </Badge>
                              )}
                            </div>

                            {company.short_description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {company.short_description}
                              </p>
                            )}

                            {company.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                {company.city}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-20 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron empresas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </p>
                  <Button
                    variant="outline"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                      setQuery('')
                      setSelectedCategory(null)
                      setSelectedIndustry(null)
                    }}
                  >
                    Limpiar búsqueda
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
