"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface CompanyData {
  id: string
  slug: string
  background: string
  icon: string
  main: string
  sub: string
  defaultColor: string
}

const RecommendedCompanies: React.FC = () => {
  const [activeCompany, setActiveCompany] = useState<number>(0)
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecommendedCompanies()
  }, [])

  const loadRecommendedCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          slug,
          company_name,
          short_description,
          industry,
          company_images (
            id,
            image_type,
            image_url
          )
        `)
        .eq('is_active', true)
        .eq('visibility', 'public')
        .order('views_count', { ascending: false })
        .limit(5)

      if (error) throw error

      const formattedCompanies = data?.map((company: any, index: number) => {
        const coverImage = company.company_images?.find((img: any) => img.image_type === 'cover')
        
        return {
          id: company.id,
          slug: company.slug,
          background: coverImage?.image_url || '/placeholder.jpg',
          icon: getIndustryIcon(company.industry),
          main: company.company_name,
          sub: company.short_description || company.industry || 'Empresa destacada',
          defaultColor: getIndustryColor(company.industry, index)
        }
      }) || []

      // Si no hay empresas, usar datos de ejemplo
      if (formattedCompanies.length === 0) {
        formattedCompanies.push(...getPlaceholderCompanies())
      }

      setCompanies(formattedCompanies)
    } catch (error) {
      console.error('Error loading companies:', error)
      setCompanies(getPlaceholderCompanies())
    } finally {
      setLoading(false)
    }
  }

  const getIndustryIcon = (industry: string): string => {
    const icons: Record<string, string> = {
      'Tecnología': 'fas fa-laptop-code',
      'Agricultura': 'fas fa-leaf',
      'Gastronomía': 'fas fa-utensils',
      'Textil': 'fas fa-tshirt',
      'Logística': 'fas fa-truck',
      'Educación': 'fas fa-graduation-cap',
      'Salud': 'fas fa-heartbeat',
      'Construcción': 'fas fa-hard-hat',
      'Comercio': 'fas fa-store',
      'Servicios': 'fas fa-hands-helping'
    }
    return icons[industry] || 'fas fa-building'
  }

  const getIndustryColor = (industry: string, index: number): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
    return colors[index % colors.length]
  }

  const getPlaceholderCompanies = (): CompanyData[] => {
    return [
      {
        id: '0',
        slug: '#',
        background: "/placeholder.jpg",
        icon: "fas fa-laptop-code",
        main: "TechCali Solutions",
        sub: "Desarrollo de software innovador",
        defaultColor: "#3B82F6",
      },
      {
        id: '1',
        slug: '#',
        background: "/placeholder.jpg",
        icon: "fas fa-leaf",
        main: "EcoVerde Sostenible",
        sub: "Productos ecológicos y sostenibles",
        defaultColor: "#10B981",
      },
      {
        id: '2',
        slug: '#',
        background: "/placeholder.jpg",
        icon: "fas fa-utensils",
        main: "Gastronomía Valluna",
        sub: "Restaurante de comida tradicional",
        defaultColor: "#F59E0B",
      },
      {
        id: '3',
        slug: '#',
        background: "/placeholder.jpg",
        icon: "fas fa-tshirt",
        main: "Textiles del Valle",
        sub: "Manufactura textil de alta calidad",
        defaultColor: "#8B5CF6",
      },
      {
        id: '4',
        slug: '#',
        background: "/placeholder.jpg",
        icon: "fas fa-truck",
        main: "Logística Express",
        sub: "Servicios de transporte y logística",
        defaultColor: "#EF4444",
      },
    ]
  }

  const handleCompanyClick = (companyId: number) => {
    setActiveCompany(companyId)
    
    // Si hay slug válido, redirigir
    if (companies[companyId] && companies[companyId].slug !== '#') {
      window.location.href = `/${companies[companyId].slug}`
    }
  }

  const styles = `
    .companies-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      height: 60vh;
      font-family: 'Roboto', sans-serif;
      transition: 0.25s;
      background: transparent;
      padding: 0;
    }
    
    .companies-wrapper {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      overflow: hidden;
      min-width: 600px;
      max-width: 900px;
      width: calc(100% - 100px);
      height: 400px;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .company-item {
      position: relative;
      overflow: hidden;
      min-width: 60px;
      margin: 10px;
      background-size: auto 120%;
      background-position: center;
      cursor: pointer;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
      border-radius: 30px;
      flex-grow: 1;
    }
    
    .company-item.active {
      flex-grow: 10000;
      transform: scale(1);
      max-width: 600px;
      margin: 0px;
      border-radius: 40px;
      background-size: auto 100%;
    }
    
    .company-item.active .company-shadow {
      box-shadow: none;
    }
    
    .company-item:not(.active) .company-shadow {
      bottom: -40px;
      box-shadow: none;
    }
    
    .company-item.active .company-label {
      bottom: 20px;
      left: 20px;
    }
    
    .company-item:not(.active) .company-label {
      bottom: 10px;
      left: 10px;
    }
    
    .company-item.active .company-info > div {
      left: 0px;
      opacity: 1;
    }
    
    .company-item:not(.active) .company-info > div {
      left: 20px;
      opacity: 0;
    }
    
    .company-shadow {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 120px;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
    }
    
    .company-label {
      display: flex;
      position: absolute;
      right: 0px;
      height: 40px;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
    }
    
    .company-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      border-radius: 100%;
      background-color: white;
    }
    
    .company-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      color: white;
      white-space: pre;
    }
    
    .company-info > div {
      position: relative;
      transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
    }
    
    .company-main {
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .company-sub {
      transition-delay: 0.1s;
    }
    
    .inactive-companies {
      display: none;
    }
    
    /* Tablet and Mobile Responsive Styles */
    @media screen and (max-width: 1024px) {
      .companies-container {
        padding: 0;
        height: auto;
        min-height: 60vh;
        flex-direction: column;
      }
      
      .companies-wrapper {
        display: flex;
        flex-direction: column;
        min-width: auto;
        max-width: none;
        width: 100%;
        height: auto;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .company-item.active {
        display: block;
        width: 100%;
        max-width: 500px;
        height: 300px;
        margin: 0 0 30px 0;
        border-radius: 25px;
        background-size: cover;
        flex-grow: 0;
        transform: none;
      }
      
      .company-item.active .company-label {
        bottom: 25px;
        left: 25px;
        right: auto;
        height: 40px;
      }
      
      .company-item.active .company-info > div {
        left: 0px;
        opacity: 1;
      }
      
      .company-item:not(.active) {
        display: none;
      }
      
      .inactive-companies {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
        width: 100%;
        max-width: 500px;
      }
      
      .inactive-company {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;
        overflow: hidden;
      }
      
      .inactive-company::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
      }
      
      .inactive-company-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 1;
      }
    }
    
    @media screen and (max-width: 768px) {
      .company-item.active {
        height: 250px;
        border-radius: 20px;
        max-width: 400px;
      }
      
      .company-item.active .company-label {
        bottom: 20px;
        left: 20px;
      }
      
      .inactive-company {
        width: 60px;
        height: 60px;
      }
      
      .inactive-company-inner {
        width: 35px;
        height: 35px;
        font-size: 16px;
      }
    }
    
    @media screen and (max-width: 480px) {
      .company-item.active {
        height: 220px;
        border-radius: 18px;
      }
      
      .company-item.active .company-label {
        bottom: 18px;
        left: 18px;
      }
      
      .company-main {
        font-size: 1.1rem;
      }
      
      .inactive-company {
        width: 50px;
        height: 50px;
      }
      
      .inactive-company-inner {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
    }
  `

  if (loading) {
    return (
      <section className="py-20 lg:py-24 px-4 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Empresas Más Recomendadas
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubre las empresas ganadoras del Fondo Emprender más destacadas de Cali
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-40 lg:py-24 px-4 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

      <div className="container px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Empresas Más Recomendadas
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre las empresas ganadoras del Fondo Emprender más destacadas de Cali
          </p>
        </div>
      </div>

      <div className="companies-container">
        <div className="companies-wrapper">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className={`company-item ${activeCompany === index ? "active" : ""}`}
              style={{
                backgroundImage: `url(${company.background})`,
                backgroundColor: company.defaultColor,
              }}
              onClick={() => handleCompanyClick(index)}
            >
              <div className="company-shadow"></div>
              <div className="company-label">
                <div className="company-icon">
                  <i className={company.icon} style={{ color: company.defaultColor }}></i>
                </div>
                <div className="company-info">
                  <div className="company-main">{company.main}</div>
                  <div className="company-sub">{company.sub}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="inactive-companies">
            {companies.map(
              (company, index) =>
                index !== activeCompany && (
                  <div
                    key={company.id}
                    className="inactive-company"
                    style={{
                      backgroundImage: `url(${company.background})`,
                      backgroundColor: company.defaultColor,
                    }}
                    onClick={() => handleCompanyClick(index)}
                  >
                    <div className="inactive-company-inner">
                      <i className={company.icon} style={{ color: company.defaultColor }}></i>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { RecommendedCompanies }