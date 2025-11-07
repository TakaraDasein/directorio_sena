"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, Award, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginRegisterProps {
  onSuccess: (userData: { name: string; email: string }) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();
  const supabase = createClient();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Verificar si el usuario ya tiene una empresa registrada
        const { data: companies, error: companyError } = await supabase
          .from('companies')
          .select('id, slug')
          .eq('user_id', data.user.id)
          .limit(1);

        if (companyError) throw companyError;

        if (companies && companies.length > 0) {
          // Usuario ya tiene empresa, redirigir al panel de administración
          router.push('/admin');
        } else {
          // Usuario nuevo, redirigir al flujo de configuración (nombre de empresa primero)
          router.push("/company-name");
        }
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.name,
          },
          emailRedirectTo: `https://www.directoriosena.com/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Verificar si necesita confirmación de email
        if (data.user.identities && data.user.identities.length === 0) {
          setError("Este correo electrónico ya está registrado. Por favor inicia sesión.");
          setIsLoading(false);
          return;
        }

        setSuccessMessage(
          "¡Cuenta creada exitosamente! Revisa tu correo electrónico para confirmar tu cuenta."
        );
        
        // Limpiar formulario
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        
        // Opcional: cambiar a tab de login después de 3 segundos
        setTimeout(() => {
          const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement;
          loginTab?.click();
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error en registro:", error);
      setError(error.message || "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `https://www.directoriosena.com/auth/reset-password`,
      });

      if (error) throw error;

      setSuccessMessage(
        "Te hemos enviado un correo electrónico con las instrucciones para recuperar tu contraseña."
      );
      setResetEmail("");
      
      // Volver al login después de 5 segundos
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage(null);
      }, 5000);
    } catch (error: any) {
      console.error("Error en recuperación:", error);
      setError(error.message || "Error al enviar el correo de recuperación.");
    } finally {
      setIsLoading(false);
    }
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
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Success Alert */}
              {successMessage && (
                <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              
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
                  {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2 text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recuperar Contraseña</h3>
                        <p className="text-sm text-gray-600">
                          Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-gray-900">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="tu@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Enviar Instrucciones"
                        )}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <button 
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setError(null);
                            setSuccessMessage(null);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Volver al inicio de sesión
                        </button>
                      </div>
                    </form>
                  ) : (
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <button 
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </form>
                  )}
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-600 mt-4">
                      Al registrarte, aceptas nuestros{" "}
                      <a href="#" className="text-primary hover:underline">
                        Términos de Servicio
                      </a>{" "}
                      y{" "}
                      <a href="#" className="text-primary hover:underline">
                        Política de Privacidad
                      </a>
                    </p>
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