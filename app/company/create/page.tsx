"use client"

import { Suspense } from "react"
import { CompanyRegistrationFlow } from "@/components/company/company-registration-flow"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function CreateCompanyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(111,29%,23%)]/5 via-white to-blue-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      }>
        <CompanyRegistrationFlow />
      </Suspense>
    </div>
  )
}
