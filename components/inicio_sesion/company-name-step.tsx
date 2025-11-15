"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ArrowRight, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CompanyNameStep: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Generar slug automáticamente desde el nombre de la empresa
  useEffect(() => {
    if (companyName) {
      const generatedSlug = companyName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
        .replace(/\s+/g, "-") // Espacios a guiones
        .replace(/-+/g, "-") // Múltiples guiones a uno solo
        .replace(/^-|-$/g, ""); // Remover guiones al inicio y final
      
      setSlug(generatedSlug);
    } else {
      setSlug("");
      setSlugAvailable(null);
    }
  }, [companyName]);

  // Verificar disponibilidad del slug
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!slug || slug.length < 3) {
        setSlugAvailable(null);
        return;
      }

      setIsCheckingSlug(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('slug')
          .eq('slug', slug)
          .limit(1);

        if (error) throw error;

        setSlugAvailable(data.length === 0);
      } catch (error) {
        console.error('Error verificando slug:', error);
        setError('Error al verificar disponibilidad del nombre');
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [slug, supabase]);

  const handleContinue = () => {
    if (companyName && slug && slugAvailable) {
      // Guardar nombre y slug en localStorage
      localStorage.setItem("companyName", companyName);
      localStorage.setItem("companySlug", slug);
      // Continuar a selección de categoría
      router.push("/select-category");
    }
  };

  const canContinue = companyName.length >= 3 && slugAvailable === true && !isCheckingSlug;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-8 h-1 rounded-full bg-primary"></div>
          <div className="w-8 h-1 rounded-full bg-gray-300"></div>
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
            ¿Cómo se llama tu empresa o perfil profesional?
          </h1>
          <p className="text-gray-600">
            Este nombre aparecerá en tu ficha del directorio SENA y en tu URL personalizada.
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-6 space-y-6 bg-white">
            {/* Company Name Input */}
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-gray-900 font-medium">
                Nombre de la Empresa o Perfil
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Ejemplo: V1TR0"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-12 text-base"
                  maxLength={100}
                />
              </div>
              <p className="text-xs text-gray-500">
                Mínimo 3 caracteres. Este nombre no se puede cambiar después.
              </p>
            </div>

            {/* URL Preview */}
            {slug && (
              <div className="space-y-2">
                <Label className="text-gray-900 font-medium">
                  Tu URL personalizada
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-600">
                    https://www.directoriosena.com/
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {slug}
                  </span>
                  {isCheckingSlug && (
                    <div className="ml-auto">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {!isCheckingSlug && slugAvailable === true && (
                    <div className="ml-auto">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  {!isCheckingSlug && slugAvailable === false && (
                    <div className="ml-auto">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>
                {slugAvailable === false && (
                  <p className="text-xs text-red-600">
                    Esta URL ya está en uso. Por favor, elige otro nombre.
                  </p>
                )}
                {slugAvailable === true && (
                  <p className="text-xs text-green-600">
                    ¡Perfecto! Esta URL está disponible.
                  </p>
                )}
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      ¿Por qué es importante?
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Este nombre será tu identificación única en el directorio. Aparecerá en búsquedas, 
                      en tu perfil público y en todas tus interacciones. Elige un nombre profesional y 
                      memorable que represente bien tu marca.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="pt-6">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingSlug ? "Verificando disponibilidad..." : "Continuar"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Una vez confirmado, este nombre no podrá ser modificado
          </p>
        </div>
      </div>
    </div>
  );
};

export { CompanyNameStep };
