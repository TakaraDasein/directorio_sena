import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CompanyProfile } from "@/components/company/company-profile"
import type { CompanyWithRelations } from "@/lib/types/database.types"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  
  const { data: company } = await supabase
    .from('companies')
    .select('company_name, short_description')
    .eq('slug', params.slug)
    .single()

  if (!company) {
    return {
      title: 'Empresa no encontrada - Directorio SENA',
    }
  }

  return {
    title: `${company.company_name} - Directorio SENA`,
    description: company.short_description || `Conoce más sobre ${company.company_name} en el Directorio SENA`,
    openGraph: {
      title: company.company_name,
      description: company.short_description,
      type: 'website',
    },
  }
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  
  // Fetch company with all related data
  const { data: company, error } = await supabase
    .from('companies')
    .select(`
      *,
      social_links (*),
      company_images (*),
      company_stats (*),
      products (*)
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .eq('visibility', 'public')
    .single()

  if (error || !company) {
    notFound()
  }

  // Increment view count (non-blocking)
  supabase.rpc('increment_company_views', { company_slug: params.slug }).then()

  const companyData: CompanyWithRelations = {
    ...company,
    company_stats: company.company_stats?.[0] || null
  }

  return <CompanyProfile company={companyData} />
}
