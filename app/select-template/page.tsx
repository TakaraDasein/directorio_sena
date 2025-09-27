"use client";

import { TemplateSelector } from "@/components/inicio_sesion/template-selector";

export default function SelectTemplatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <TemplateSelector />
    </div>
  );
}