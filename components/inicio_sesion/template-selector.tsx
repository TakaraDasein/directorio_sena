"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, User, Briefcase, CreditCard } from "lucide-react";
import Image from "next/image";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: JSX.Element;
  features: string[];
}

const templates: Template[] = [
  {
    id: "professional-pastel",
    name: "Mujer Profesional Pastel",
    description: "Diseño elegante con colores pastel para profesionales femeninas",
    category: "Professional",
    features: ["Colores pastel suaves", "Tipografía elegante", "Layout minimalista", "Responsive design"],
    preview: (
      <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute top-4 left-4 w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-pink-600" />
        </div>
        <div className="absolute top-4 right-4 text-xs text-pink-600 font-medium">@username</div>
        <div className="absolute bottom-16 left-4 right-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sofia Martinez</h3>
          <p className="text-sm text-gray-600 mb-3">Marketing Director & Brand Strategist</p>
          <div className="space-y-2">
            <div className="h-8 bg-pink-200 rounded-full flex items-center px-3">
              <span className="text-xs text-pink-700">💼 LinkedIn</span>
            </div>
            <div className="h-8 bg-purple-200 rounded-full flex items-center px-3">
              <span className="text-xs text-purple-700">📧 Email</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "card-3d",
    name: "Tarjeta 3D CSS",
    description: "Tarjeta interactiva con efecto 3D, portada y contraportada",
    category: "Interactive",
    features: ["Efecto 3D flip", "Portada y contraportada", "Animaciones CSS", "Hover effects"],
    preview: (
      <div className="w-full h-64 bg-gray-900 rounded-lg p-4 relative overflow-hidden perspective-1000">
        <div className="w-full h-full relative transform-style-preserve-3d hover:rotate-y-180 transition-transform duration-700">
          {/* Portada */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg backface-hidden">
            <div className="p-4 h-full flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <CreditCard className="w-8 h-8" />
                <span className="text-xs opacity-75">FRONT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Alex Johnson</h3>
                <p className="text-sm opacity-90">Full Stack Developer</p>
              </div>
              <div className="text-xs opacity-75">Hover to flip</div>
            </div>
          </div>
          {/* Contraportada */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg backface-hidden rotate-y-180">
            <div className="p-4 h-full flex flex-col justify-center text-white space-y-3">
              <div className="text-center text-xs opacity-75 mb-2">BACK</div>
              <div className="space-y-2">
                <div className="bg-white/20 rounded px-2 py-1 text-xs">🌐 Portfolio</div>
                <div className="bg-white/20 rounded px-2 py-1 text-xs">💼 LinkedIn</div>
                <div className="bg-white/20 rounded px-2 py-1 text-xs">📧 Contact</div>
                <div className="bg-white/20 rounded px-2 py-1 text-xs">📱 WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "business-elegant",
    name: "Empresario Elegante",
    description: "Diseño sobrio y profesional para ejecutivos y empresarios",
    category: "Business",
    features: ["Diseño minimalista", "Colores corporativos", "Tipografía serif", "Layout ejecutivo"],
    preview: (
      <div className="w-full h-64 bg-gray-50 rounded-lg p-4 relative overflow-hidden border">
        <div className="absolute top-4 left-4 w-16 h-16 bg-gray-800 rounded-sm flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono">EST. 2024</div>
        <div className="absolute bottom-12 left-4 right-4">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Robert Williams</h3>
          <p className="text-sm text-gray-600 mb-4">Chief Executive Officer</p>
          <div className="space-y-2">
            <div className="h-6 bg-gray-800 text-white text-xs flex items-center px-3 font-mono">
              LINKEDIN.COM/IN/RWILLIAMS
            </div>
            <div className="h-6 bg-gray-200 text-gray-800 text-xs flex items-center px-3 font-mono">
              ROBERT@COMPANY.COM
            </div>
            <div className="h-6 bg-gray-100 text-gray-700 text-xs flex items-center px-3 font-mono">
              +1 (555) 123-4567
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const router = useRouter();

  const handleContinue = () => {
    if (selectedTemplate) {
      // Guardar template seleccionado en localStorage
      localStorage.setItem("selectedTemplate", selectedTemplate);
      // Redirigir a la selección de plataformas
      router.push("/select-platforms");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Atrás</span>
          </button>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
          </div>
        </div>

        {/* SENA Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">SENA</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selecciona tu template
          </h1>
          <p className="text-gray-600">
            Elige el diseño que mejor represente tu estilo profesional
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="w-full max-w-6xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                selectedTemplate === template.id
                  ? "ring-4 ring-purple-500 ring-offset-2 scale-105"
                  : "hover:scale-102 hover:shadow-lg"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Preview */}
                <div className="relative">
                  {template.preview}
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-1">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-md">
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedTemplate
              ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Additional CSS for 3D effects */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .hover\\:rotate-y-180:hover {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}