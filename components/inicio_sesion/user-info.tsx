"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, Users, Award, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserInfoProps {
  onSuccess?: (userData: { username: string }) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Guardar el userData en localStorage usando el nombre como base
    const userData = {
      name: username.trim(),
      email: "admin@sena.edu.co", // Email por defecto para el flujo de desarrollo
      bio: ""
    };
    
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("✅ Datos de usuario guardados:", userData);
    
    if (onSuccess) {
      onSuccess({ username: username.trim() });
    } else {
      // Redirigir a la página de selección de categoría
      router.push("/select-category");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with SENA branding and information */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground">
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* SENA Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logos/sena_logo.svg"
              alt="SENA Logo"
              width={120}
              height={120}
              className="transition-transform duration-300 hover:scale-125 cursor-pointer"
            />
          </div>
          
          {/* Main heading */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Configura tu Perfil</h2>
            <p className="text-lg text-primary-foreground/80">
              Personaliza tu experiencia en el Directorio Profesional SENA
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Identidad Única</h3>
                <p className="text-sm text-primary-foreground/80">Tu nombre de usuario te identificará en la plataforma</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Conexiones</h3>
                <p className="text-sm text-primary-foreground/80">Facilita que otros te encuentren y conecten contigo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Profesionalismo</h3>
                <p className="text-sm text-primary-foreground/80">Construye tu reputación profesional</p>
              </div>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 pt-8">
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
          </div>
        </div>
      </div>

      {/* Right side with username form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center lg:hidden mb-4">
              <Image
                src="/logos/sena_logo.svg"
                alt="SENA Logo"
                width={80}
                height={80}
                className="transition-transform duration-300 hover:scale-125 cursor-pointer"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Ingresa tu Nombre</h1>
            <p className="text-gray-600">
              Este será tu nombre de usuario en la plataforma
            </p>
          </div>

          {/* Form Container */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-900">
                    Tu Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Juan Pérez"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      required
                      minLength={2}
                      maxLength={50}
                      title="Ingresa tu nombre completo."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tu nombre completo. Se generará automáticamente tu nombre de usuario.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || username.length < 2}
                >
                  {isLoading ? (
                    "Configurando..."
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Info note */}
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-700 text-center">
                    <strong>Ejemplo:</strong> Si ingresas "Juan Pérez", tu nombre de usuario será "juanperez"
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { UserInfo };