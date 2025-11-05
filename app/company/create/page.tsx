"use client"

import { CompanyRegistrationFlow } from "@/components/company/company-registration-flow"

export default function CreateCompanyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(111,29%,23%)]/5 via-white to-blue-50">
      <CompanyRegistrationFlow />
    </div>
  )
}
