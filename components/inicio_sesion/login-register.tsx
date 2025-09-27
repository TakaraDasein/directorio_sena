"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, Award } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LoginRegisterProps {
  onSuccess: (userData: { name: string; email: string }) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  
  // Credenciales por defecto para desarrollo
  const DEFAULT_CREDENTIALS = {
    email: "admin@sena.edu.co",
    password: "admin123"
  };
  
  const [loginData, setLoginData] = useState({
    email: DEFAULT_CREDENTIALS.email,
    password: DEFAULT_CREDENTIALS.password
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de credenciales por defecto para desarrollo
    if (loginData.email === DEFAULT_CREDENTIALS.email && 
        loginData.password === DEFAULT_CREDENTIALS.password) {
      // Redirigir a la página de configuración de usuario
      router.push("/userinfo");
    } else {
      alert("Credenciales incorrectas. Use: admin@sena.edu.co / admin123");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Simulación de registro exitoso
    onSuccess({
      name: registerData.name,
      email: registerData.email
    });
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
            <h2 className="text-3xl font-bold">Directorio Profesional SENA</h2>
            <p className="text-lg text-primary-foreground/80">
              Conecta con egresados, instructores y empresas de la comunidad SENA
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Perfil Profesional</h3>
                <p className="text-sm text-primary-foreground/80">Crea tu ficha profesional completa</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Red de Contactos</h3>
                <p className="text-sm text-primary-foreground/80">Conecta con otros profesionales</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Oportunidades</h3>
                <p className="text-sm text-primary-foreground/80">Encuentra ofertas laborales</p>
              </div>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 pt-8">
            <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary-foreground/40"></div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center lg:hidden mb-4">
              <Logo asLink={true} size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
            <p className="text-gray-600">
              Accede a tu cuenta o crea una nueva
            </p>
          </div>

          {/* Form Container */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Registrarse
                  </TabsTrigger>
                </TabsList>
            
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-900">
                        Correo Electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-900">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Iniciar Sesión
                    </Button>
                    
                    {/* Nota informativa para desarrollo */}
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-700 text-center">
                        <strong>Credenciales de desarrollo:</strong><br />
                        Email: admin@sena.edu.co<br />
                        Contraseña: admin123
                      </p>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-gray-900">
                        Nombre Completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-gray-900">
                        Correo Electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-900">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-gray-900">
                        Confirmar Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Crear Cuenta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { LoginRegister };