/**
 * TypeScript Types para Supabase Database
 * Directorio SENA - Database Types
 */

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          user_id: string
          slug: string
          company_name: string
          category: 'emprendimiento-egresado' | 'empresa-fe' | 'agente-digitalizador'
          email: string
          phone: string | null
          whatsapp: string | null
          website: string | null
          address: string | null
          city: string | null
          department: string | null
          country: string | null
          description: string | null
          short_description: string | null
          year_founded: number | null
          employee_count: string | null
          industry: string | null
          is_active: boolean
          is_verified: boolean
          visibility: 'public' | 'private' | 'draft'
          views_count: number
          profile_completeness: number
          theme_color: string | null
          theme_style: string | null
          custom_color: string | null
          selected_theme: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          company_name: string
          category: 'emprendimiento-egresado' | 'empresa-fe' | 'agente-digitalizador'
          email: string
          phone?: string | null
          whatsapp?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          department?: string | null
          country?: string | null
          description?: string | null
          short_description?: string | null
          year_founded?: number | null
          employee_count?: string | null
          industry?: string | null
          is_active?: boolean
          is_verified?: boolean
          visibility?: 'public' | 'private' | 'draft'
          views_count?: number
          profile_completeness?: number
          theme_color?: string | null
          theme_style?: string | null
          custom_color?: string | null
          selected_theme?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          company_name?: string
          category?: 'emprendimiento-egresado' | 'empresa-fe' | 'agente-digitalizador'
          email?: string
          phone?: string | null
          whatsapp?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          department?: string | null
          country?: string | null
          description?: string | null
          short_description?: string | null
          year_founded?: number | null
          employee_count?: string | null
          industry?: string | null
          is_active?: boolean
          is_verified?: boolean
          visibility?: 'public' | 'private' | 'draft'
          views_count?: number
          profile_completeness?: number
          theme_color?: string | null
          theme_style?: string | null
          custom_color?: string | null
          selected_theme?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          company_id: string
          platform: string
          url: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          platform: string
          url: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          platform?: string
          url?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      company_images: {
        Row: {
          id: string
          company_id: string
          image_type: 'logo' | 'cover' | 'gallery'
          image_url: string
          storage_path: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          image_type: 'logo' | 'cover' | 'gallery'
          image_url: string
          storage_path: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          image_type?: 'logo' | 'cover' | 'gallery'
          image_url?: string
          storage_path?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
      }
      company_stats: {
        Row: {
          id: string
          company_id: string
          total_views: number
          unique_visitors: number
          profile_shares: number
          contact_clicks: number
          last_view_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          total_views?: number
          unique_visitors?: number
          profile_shares?: number
          contact_clicks?: number
          last_view_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          total_views?: number
          unique_visitors?: number
          profile_shares?: number
          contact_clicks?: number
          last_view_at?: string | null
          updated_at?: string
        }
      }
      slug_history: {
        Row: {
          id: string
          company_id: string
          old_slug: string
          new_slug: string
          changed_at: string
        }
        Insert: {
          id?: string
          company_id: string
          old_slug: string
          new_slug: string
          changed_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          old_slug?: string
          new_slug?: string
          changed_at?: string
        }
      }
      products: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          price: number
          currency: string
          image_url: string | null
          images: any
          category: string | null
          tags: string[] | null
          stock_quantity: number
          sku: string | null
          is_active: boolean
          is_featured: boolean
          has_variations: boolean
          variations: any
          views_count: number
          clicks_count: number
          sales_count: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          price: number
          currency?: string
          image_url?: string | null
          images?: any
          category?: string | null
          tags?: string[] | null
          stock_quantity?: number
          sku?: string | null
          is_active?: boolean
          is_featured?: boolean
          has_variations?: boolean
          variations?: any
          views_count?: number
          clicks_count?: number
          sales_count?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          image_url?: string | null
          images?: any
          category?: string | null
          tags?: string[] | null
          stock_quantity?: number
          sku?: string | null
          is_active?: boolean
          is_featured?: boolean
          has_variations?: boolean
          variations?: any
          views_count?: number
          clicks_count?: number
          sales_count?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_slug_availability: {
        Args: {
          slug_to_check: string
        }
        Returns: boolean
      }
      generate_slug_from_name: {
        Args: {
          company_name_input: string
        }
        Returns: string
      }
      increment_company_views: {
        Args: {
          company_slug: string
        }
        Returns: void
      }
      search_companies: {
        Args: {
          search_query: string
        }
        Returns: Array<{
          id: string
          slug: string
          company_name: string
          category: string
          short_description: string | null
          city: string | null
          relevance: number
        }>
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de utilidad para trabajar con las tablas
export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type SocialLinkInsert = Database['public']['Tables']['social_links']['Insert']
export type SocialLinkUpdate = Database['public']['Tables']['social_links']['Update']

export type CompanyImage = Database['public']['Tables']['company_images']['Row']
export type CompanyImageInsert = Database['public']['Tables']['company_images']['Insert']
export type CompanyImageUpdate = Database['public']['Tables']['company_images']['Update']

export type CompanyStats = Database['public']['Tables']['company_stats']['Row']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

// Tipo completo con todas las relaciones
export type CompanyWithRelations = Company & {
  social_links: SocialLink[]
  company_images: CompanyImage[]
  company_stats: CompanyStats | null
  products?: Product[]
}

// Tipo para el formulario de registro
export interface CompanyRegistrationForm {
  // Paso 1: Autenticación
  email: string
  password: string
  
  // Paso 2: Datos básicos
  company_name: string
  slug: string
  category: 'emprendimiento-egresado' | 'empresa-fe' | 'agente-digitalizador'
  
  // Paso 3: Información detallada
  phone: string
  website?: string
  address?: string
  city: string
  department: string
  description: string
  short_description: string
  year_founded?: number
  employee_count?: string
  industry: string
  
  // Paso 4: Redes sociales
  social_links: Array<{
    platform: string
    url: string
  }>
  
  // Paso 5: Imágenes (se suben después)
  logo?: File
  cover?: File
}

// Opciones para filtros y selectores
export const EMPLOYEE_COUNT_OPTIONS = [
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '200+', label: 'Más de 200 empleados' },
] as const

export const DEPARTMENT_OPTIONS = [
  'Valle del Cauca',
  'Cauca',
  'Nariño',
  'Antioquia',
  'Cundinamarca',
  'Atlántico',
  'Santander',
  'Bolívar',
  // Agregar más departamentos
] as const

export const INDUSTRY_OPTIONS = [
  'Tecnología',
  'Salud',
  'Educación',
  'Manufactura',
  'Comercio',
  'Servicios',
  'Construcción',
  'Agricultura',
  'Turismo',
  'Transporte y Logística',
  'Finanzas',
  'Marketing y Publicidad',
  'Consultoría',
  'Otro',
] as const

export const CATEGORY_OPTIONS = [
  { value: 'emprendimiento-egresado', label: 'Egresado con Emprendimiento', description: 'Emprendimiento de egresado del SENA' },
  { value: 'empresa-fe', label: 'Empresa Ganadora FE', description: 'Empresa ganadora del Fondo Emprender' },
  { value: 'agente-digitalizador', label: 'Agente Digitalizador', description: 'Agente digitalizador aprobado' },
] as const

// Blog types
export interface Blog {
  id: string
  company_id: string
  title: string
  slug: string
  excerpt: string | null
  author: string
  cover_image: string | null
  content_path: string
  published_at: string | null
  created_at: string
  updated_at: string
  is_published: boolean
  views: number
}

export interface BlogInsert {
  company_id: string
  title: string
  slug: string
  excerpt?: string | null
  author: string
  cover_image?: string | null
  content_path: string
  published_at?: string | null
  is_published?: boolean
}

export interface BlogUpdate {
  title?: string
  slug?: string
  excerpt?: string | null
  author?: string
  cover_image?: string | null
  content_path?: string
  published_at?: string | null
  is_published?: boolean
}

export interface BlogWithCompany extends Blog {
  company: {
    company_name: string
    slug: string
    category: string
  }
}
