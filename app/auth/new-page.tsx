"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, Award, AlertCircle, Link2, Check, X } from "lucide-react"
import { Logo } from "@/components/logo"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

const AuthPage: React.FC = () => {
  const router = useRouter()
  const supabase = createClient()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "", // slug personalizado
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Función para formatear el username a slug válido
  const formatSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9-]/g, '') // Solo letras, números y guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .replace(/^-|-$/g, '') // Quitar guiones al inicio y final
  }

  // Validar slug en tiempo real
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      setSlugError("Mínimo 3 caracteres")
      return
    }

    if (slug.length > 50) {
      setSlugAvailable(null)
      setSlugError("Máximo 50 caracteres")
      return
    }

    setCheckingSlug(true)
    setSlugError(null)

    try {
      const { data, error } = await supabase.rpc('check_slug_availability', {
        slug_to_check: slug
      })

      if (error) throw error

      setSlugAvailable(data)
      if (!data) {
        setSlugError("Este nombre de usuario ya está en uso")
      }
    } catch (err) {
      console.error('Error checking slug:', err)
      setSlugAvailable(null)
      setSlugError("Error al verificar disponibilidad")
    } finally {
      setCheckingSlug(false)
    }
  }

  // Debounce para la validación del slug
  const handleUsernameChange = (value: string) => {
    const formattedSlug = formatSlug(value)
    setRegisterData({ ...registerData, username: formattedSlug })
    
    // Debounce check
    if (formattedSlug.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkSlugAvailability(formattedSlug)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setSlugAvailable(null)
      setSlugError(formattedSlug.length > 0 ? "Mínimo 3 caracteres" : null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        // Verificar si el usuario ya tiene una empresa registrada
        const { data: companies } = await supabase
          .from('companies')
          .select('slug')
          .eq('user_id', data.user.id)
          .single()

        if (companies?.slug) {
          // Redirigir al admin de la empresa
          router.push('/admin')
        } else {
          // Redirigir al flujo de creación de empresa
          router.push('/company/create')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    // Validaciones
    if (!registerData.username || registerData.username.length < 3) {
      setError("Debes elegir un nombre de usuario válido (mínimo 3 caracteres)")
      setLoading(false)
      return
    }

    if (!slugAvailable) {
      setError("El nombre de usuario no está disponible o no es válido")
      setLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.name,
            username: registerData.username, // Guardar el username en metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        setSuccess(
          `¡Registro exitoso! Tu URL será: https://www.directoriosena.com/${registerData.username}\n\nRevisa tu correo para confirmar tu cuenta.`
        )
        // Limpiar formulario
        setRegisterData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        })
        setSlugAvailable(null)
        setSlugError(null)
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

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
              Crea tu perfil profesional con URL personalizada
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Tu URL Única</h3>
                <p className="text-sm text-primary-foreground/80">
                  https://www.directoriosena.com/tu-nombre
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Ficha Profesional</h3>
                <p className="text-sm text-primary-foreground/80">
                  Información completa de tu empresa
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Visibilidad</h3>
                <p className="text-sm text-primary-foreground/80">
                  Conecta con clientes y oportunidades
                </p>
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
              Crea tu cuenta e inicia tu presencia digital
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-500 text-green-700 bg-green-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Form Container */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <Tabs defaultValue="register" className="space-y-6">
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
                          disabled={loading}
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
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={loading}
                    >
                      {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
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
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-gray-900">
                        Nombre de Usuario
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                          https://www.directoriosena.com/
                        </span>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="tu-nombre"
                          value={registerData.username}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          className="pl-[185px] pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                          disabled={loading}
                          minLength={3}
                          maxLength={50}
                          pattern="[a-z0-9-]+"
                        />
                        {checkingSlug && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        )}
                        {!checkingSlug && slugAvailable === true && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {!checkingSlug && (slugAvailable === false || slugError) && registerData.username.length >= 3 && (
                          <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {slugError && registerData.username.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">{slugError}</p>
                      )}
                      {slugAvailable && registerData.username.length >= 3 && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Disponible: https://www.directoriosena.com/{registerData.username}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Solo letras minúsculas, números y guiones. Ej: juan-perez, mi-empresa
                      </p>
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
                          disabled={loading}
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
                          disabled={loading}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={loading}
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
                          disabled={loading}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={loading}
                    >
                      {loading ? "Creando cuenta..." : "Crear Cuenta"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Al registrarte, aceptas nuestros términos de servicio y política de privacidad
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
