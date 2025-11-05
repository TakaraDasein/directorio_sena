"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Building2, Send, Loader2 } from "lucide-react"
import useDebounce from "@/flow_componentes/use-debounce"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  slug: string
  company_name: string
  category: string
  industry: string | null
  city: string | null
  short_description: string | null
}

interface SearchResult {
  companies: Company[]
  isLoading: boolean
}

function DirectorySearchBar() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const supabase = createClient()
  const router = useRouter()

  // Buscar empresas en Supabase
  useEffect(() => {
    if (!isFocused) {
      setResult(null)
      return
    }

    const searchCompanies = async () => {
      setResult(prev => ({ companies: prev?.companies || [], isLoading: true }))
      
      try {
        let query = supabase
          .from('companies')
          .select('id, slug, company_name, category, industry, city, short_description')
          .eq('is_active', true)
          .eq('visibility', 'public')
          .order('views_count', { ascending: false })
          .limit(10)

        // Si hay búsqueda, filtrar
        if (debouncedQuery) {
          query = query.or(`company_name.ilike.%${debouncedQuery}%,industry.ilike.%${debouncedQuery}%,city.ilike.%${debouncedQuery}%,short_description.ilike.%${debouncedQuery}%`)
        }

        const { data, error } = await query

        if (error) throw error

        setResult({
          companies: data || [],
          isLoading: false
        })
      } catch (error) {
        console.error('Error buscando empresas:', error)
        setResult({
          companies: [],
          isLoading: false
        })
      }
    }

    searchCompanies()
  }, [debouncedQuery, isFocused, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsTyping(true)
  }

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setQuery(company.company_name)
    setIsFocused(false)
    router.push(`/${company.slug}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Reset selectedCompany when focusing the input
  const handleFocus = () => {
    setSelectedCompany(null)
    setIsFocused(true)
    setIsExpanded(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
      if (!query) {
        setIsExpanded(false)
      }
    }, 200)
  }

  return (
    <div className="flex justify-center lg:justify-end w-full">
      <motion.div 
        className="relative flex flex-col justify-start"
        animate={{
          width: isExpanded ? "400px" : "280px"
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="w-full sticky top-0 bg-transparent z-10">
          <motion.label 
            className="text-xs font-medium text-white/70 mb-2 block" 
            htmlFor="search"
            animate={{
              opacity: isExpanded ? 1 : 0.7
            }}
            transition={{ duration: 0.3 }}
          >
            Directorio Empresarial SENA
          </motion.label>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar empresas..."
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="pl-4 pr-12 py-3 h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0 backdrop-blur-sm transition-all duration-300 w-full"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">
                <AnimatePresence mode="popLayout">
                  {result?.isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
                    </motion.div>
                  ) : query.length > 0 ? (
                    <motion.div
                      key="send"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button type="submit" className="focus:outline-none">
                        <Send className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className="w-5 h-5 text-white/70" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {isFocused && result && !selectedCompany && (
              <motion.div
                className="w-full border rounded-xl shadow-lg overflow-hidden border-white/20 bg-white/10 backdrop-blur-md mt-1"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {result.companies.length > 0 ? (
                    result.companies.map((company) => (
                      <motion.li
                        key={company.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer rounded-lg"
                        variants={item}
                        layout
                        onClick={() => handleCompanyClick(company)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-shrink-0 bg-white/20 rounded-lg flex items-center justify-center w-10 h-10">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white truncate">
                                {company.company_name}
                              </span>
                              {company.category && (
                                <span className="text-xs text-white/60 capitalize">{company.category}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {company.industry && (
                                <span className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                                  {company.industry}
                                </span>
                              )}
                              {company.city && (
                                <span className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                                  {company.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))
                  ) : (
                    <motion.li
                      className="px-4 py-6 text-center text-white/60"
                      variants={item}
                    >
                      {result.isLoading ? 'Buscando...' : 'No se encontraron empresas'}
                    </motion.li>
                  )}
                </motion.ul>
                <div className="mt-2 px-4 py-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{result.companies.length} {result.companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}</span>
                    <span>ESC para cancelar</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default DirectorySearchBar