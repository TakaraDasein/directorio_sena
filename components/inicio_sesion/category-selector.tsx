"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building2, Briefcase, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const CategorySelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Verificar que exista el nombre de la empresa
    const savedName = localStorage.getItem("companyName");
    const savedSlug = localStorage.getItem("companySlug");
    
    if (!savedName || !savedSlug) {
      // Si no hay nombre guardado, redirigir al paso anterior
      router.push("/company-name");
      return;
    }
    
    setCompanyName(savedName);
  }, [router]);

  const categories: CategoryOption[] = [
    {
      id: "emprendimiento-egresado",
      title: "Egresado con Emprendimiento",
      description: "Tengo un emprendimiento, soy egresado del SENA y busco conectar para impulsar mi proyecto.",
      icon: <User className="h-8 w-8" />,
      color: "bg-primary"
    },
    {
      id: "empresa-fe",
      title: "Empresa Ganadora FE", 
      description: "Empresa ganadora del Fondo Emprender; busco visibilizar y digitalizar mi negocio para crecer.",
      icon: <Building2 className="h-8 w-8" />,
      color: "bg-primary"
    },
    {
      id: "agente-digitalizador",
      title: "Agente Digitalizador",
      description: "Agente digitalizador aprobado; ofrezco soluciones para la transformación digital.",
      icon: <Briefcase className="h-8 w-8" />,
      color: "bg-primary"
    }
  ];

  const handleContinue = () => {
    if (selectedCategory) {
      // Guardar categoría seleccionada en localStorage
      localStorage.setItem("selectedCategory", selectedCategory);
      // Ir a completar el perfil con toda la información
      router.push("/company/create");
    }
  };

  if (!companyName) {
    return null; // O un loading spinner
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-8 h-1 rounded-full bg-primary"></div>
          <div className="w-8 h-1 rounded-full bg-primary"></div>
          <div className="w-8 h-1 rounded-full bg-gray-300"></div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Image
                src="/logos/sena_logo.svg"
                alt="SENA Logo"
                width={32}
                height={32}
                className="transition-transform duration-300 hover:scale-110 filter brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Selecciona el perfil que mejor representa tu actividad en el Directorio SENA.
          </h1>
          <p className="text-gray-600">
            Perfil para: <span className="font-semibold text-primary">{companyName}</span>
          </p>
        </div>

        {/* Category Options */}
        <div className="space-y-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                selectedCategory === category.id
                  ? "ring-2 ring-primary border-primary shadow-lg bg-primary hover:bg-primary/90"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:bg-primary/5"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className={`p-6 transition-colors duration-200 ${
                selectedCategory === category.id
                  ? "bg-transparent"
                  : "bg-transparent"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-900 group-hover:text-gray-900"
                    }`}>
                      {category.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      selectedCategory === category.id
                        ? "text-white/90"
                        : "text-gray-600 group-hover:text-gray-700"
                    }`}>
                      {category.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}>
                    {category.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedCategory}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Podrás cambiar esto más tarde en la configuración de tu perfil
          </p>
        </div>
      </div>
    </div>
  );
};

export { CategorySelector };