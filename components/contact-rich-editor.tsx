"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code2,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Send,
  Mail,
  CheckCircle,
  ArrowLeft,
  Edit3,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}

type ContactStep = "writing" | "email" | "success"

const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "h-9 w-9 p-0 transition-all duration-300 hover:scale-105",
      "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl",
      "hover:bg-white/20 hover:border-white/30",
      "group relative overflow-hidden",
      isActive && "bg-primary/30 text-white border-primary/50",
    )}
    title={title}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    <div className="relative z-10 text-white/90 group-hover:text-white">{children}</div>
  </Button>
)

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-primary" />
    
    {/* Pattern background matching the site */}
    <div className="absolute inset-0 pattern-1" />
    
    {/* Subtle overlay for better text readability */}
    <div className="absolute inset-0 bg-black/20" />
  </div>
)

export default function ContactRichEditor() {
  const [content, setContent] = useState("")
  const [email, setEmail] = useState("")
  const [currentStep, setCurrentStep] = useState<ContactStep>("writing")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const router = useRouter()

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateActiveFormats()
  }, [])

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()

    if (document.queryCommandState("bold")) formats.add("bold")
    if (document.queryCommandState("italic")) formats.add("italic")
    if (document.queryCommandState("underline")) formats.add("underline")
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul")
    if (document.queryCommandState("insertOrderedList")) formats.add("ol")

    setActiveFormats(formats)
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
      updateActiveFormats()
    }
  }, [updateActiveFormats])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            execCommand("bold")
            break
          case "i":
            e.preventDefault()
            execCommand("italic")
            break
          case "u":
            e.preventDefault()
            execCommand("underline")
            break
        }
      }
    },
    [execCommand],
  )

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }, [execCommand])

  const handleSendMessage = async () => {
    const plainText = content.replace(/<[^>]*>/g, "").trim()
    if (!plainText) {
      alert("Por favor, escribe tu mensaje antes de enviarlo.")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setCurrentStep("email")
  }

  // Validate HTML content before sending
  const validateHtmlContent = (html: string): { isValid: boolean; error?: string } => {
    if (!html || html.trim() === '') {
      return { isValid: false, error: 'El contenido no puede estar vacío.' }
    }
    
    if (html.length > 50000) {
      return { isValid: false, error: 'El contenido es demasiado largo. Máximo 50,000 caracteres.' }
    }
    
    // Check for potentially harmful content
    const suspiciousPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>/i
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(html)) {
        return { isValid: false, error: 'El contenido contiene elementos no permitidos.' }
      }
    }
    
    return { isValid: true }
  }

  // Simple email validation - just check for basic format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email.trim().length > 0 && emailRegex.test(email.trim())
  }

  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      alert("Por favor, ingresa un email válido.")
      return
    }

    setIsLoading(true)
    
    try {
      // Validate HTML content
      const validation = validateHtmlContent(content)
      if (!validation.isValid) {
        setIsLoading(false)
        alert(validation.error)
        return
      }
      
      // Create the email data with HTML content
      const emailData = {
        to: email,
        subject: "Mensaje desde el Directorio SENA",
        content: content,
        format: "html" as const,
        metadata: {
          timestamp: new Date().toISOString(),
          contentLength: content.length,
          textLength: content.replace(/<[^>]*>/g, '').trim().length
        }
      }
      
      // Use localStorage simulation instead of real API
      const { simulateEmailSending } = await import('@/lib/email-storage')
      const storedEmail = await simulateEmailSending(emailData)
      
      console.log('📧 Email stored locally:', storedEmail)
      
      setIsLoading(false)
      setShowConfirmation(true)
      
      // Start fade-out animation after 5 seconds
      setTimeout(() => {
        setIsFadingOut(true)
      }, 5000)
      
      // Redirect to home after fade-out animation completes (6 seconds total)
      setTimeout(() => {
        router.push("/")
      }, 6000)
      
    } catch (error) {
      console.error('Error storing email locally:', error)
      setIsLoading(false)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al procesar el correo'
      
      alert(`Error al procesar el correo: ${errorMessage}. Por favor, inténtalo de nuevo.`)
    }
  }

  const handleReset = () => {
    setContent("")
    setEmail("")
    setCurrentStep("writing")
    setShowConfirmation(false)
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }
  }

  const renderWritingStep = () => (
    <>
      <div className="flex items-center gap-2 p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 backdrop-blur-sm rounded-xl border border-primary/30">
              <Mail className="h-4 w-4 text-white" />
            </div>
          </div>

         {/* Desktop Toolbar */}
         <div className="hidden md:flex items-center gap-2 relative z-0">
           <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

           <div className="flex items-center gap-1">
             <ToolbarButton
               onClick={() => execCommand("formatBlock", "<h1>")}
               isActive={activeFormats.has("h1")}
               title="Heading 1"
             >
               <Heading1 className="h-4 w-4" />
             </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("formatBlock", "<h2>")}
              isActive={activeFormats.has("h2")}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("formatBlock", "<h3>")}
              isActive={activeFormats.has("h3")}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => execCommand("bold")}
              isActive={activeFormats.has("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("italic")}
              isActive={activeFormats.has("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("underline")}
              isActive={activeFormats.has("underline")}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={() => execCommand("formatBlock", "<blockquote>")} title="Quote">
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left">
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center">
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right">
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={() => execCommand("formatBlock", "<pre>")} title="Code Block">
              <Code2 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-6 mx-3 bg-white/20" />

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-white/70">
              Palabras:{" "}
              {
                content
                  .replace(/<[^>]*>/g, "")
                  .split(/\s+/)
                  .filter(Boolean).length
              }
            </span>
            <span className="flex items-center gap-2 text-sm text-white/70">
              Caracteres: {content.replace(/<[^>]*>/g, "").length}
            </span>
          </div>
         </div>

         {/* Mobile Edit Button */}
         <div className="md:hidden ml-auto relative z-[9999]">
           <Button
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 px-3 py-2 text-white/90 hover:text-white transition-all duration-300 relative z-[9999]"
           >
             <Edit3 className="h-4 w-4 mr-2" />
             Editar
             <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform duration-200", isMobileMenuOpen && "rotate-180")} />
           </Button>

           {/* Mobile Dropdown Menu */}
           {isMobileMenuOpen && (
             <div className="absolute top-full right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-[9999] shadow-2xl">
               <div className="space-y-4">
                 {/* Headings */}
                 <div>
                   <h4 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Encabezados</h4>
                   <div className="flex gap-2">
                     <ToolbarButton
                       onClick={() => { execCommand("formatBlock", "<h1>"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("h1")}
                       title="Heading 1"
                     >
                       <Heading1 className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton
                       onClick={() => { execCommand("formatBlock", "<h2>"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("h2")}
                       title="Heading 2"
                     >
                       <Heading2 className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton
                       onClick={() => { execCommand("formatBlock", "<h3>"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("h3")}
                       title="Heading 3"
                     >
                       <Heading3 className="h-4 w-4" />
                     </ToolbarButton>
                   </div>
                 </div>

                 {/* Text Format */}
                 <div>
                   <h4 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Formato</h4>
                   <div className="flex gap-2">
                     <ToolbarButton
                       onClick={() => { execCommand("bold"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("bold")}
                       title="Bold"
                     >
                       <Bold className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton
                       onClick={() => { execCommand("italic"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("italic")}
                       title="Italic"
                     >
                       <Italic className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton
                       onClick={() => { execCommand("underline"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("underline")}
                       title="Underline"
                     >
                       <Underline className="h-4 w-4" />
                     </ToolbarButton>
                   </div>
                 </div>

                 {/* Lists */}
                 <div>
                   <h4 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Listas</h4>
                   <div className="flex gap-2">
                     <ToolbarButton
                       onClick={() => { execCommand("insertUnorderedList"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("ul")}
                       title="Bullet List"
                     >
                       <List className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton
                       onClick={() => { execCommand("insertOrderedList"); setIsMobileMenuOpen(false); }}
                       isActive={activeFormats.has("ol")}
                       title="Numbered List"
                     >
                       <ListOrdered className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton 
                       onClick={() => { execCommand("formatBlock", "<blockquote>"); setIsMobileMenuOpen(false); }} 
                       title="Quote"
                     >
                       <Quote className="h-4 w-4" />
                     </ToolbarButton>
                   </div>
                 </div>

                 {/* Alignment */}
                 <div>
                   <h4 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Alineación</h4>
                   <div className="flex gap-2">
                     <ToolbarButton 
                       onClick={() => { execCommand("justifyLeft"); setIsMobileMenuOpen(false); }} 
                       title="Align Left"
                     >
                       <AlignLeft className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton 
                       onClick={() => { execCommand("justifyCenter"); setIsMobileMenuOpen(false); }} 
                       title="Align Center"
                     >
                       <AlignCenter className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton 
                       onClick={() => { execCommand("justifyRight"); setIsMobileMenuOpen(false); }} 
                       title="Align Right"
                     >
                       <AlignRight className="h-4 w-4" />
                     </ToolbarButton>
                   </div>
                 </div>

                 {/* Others */}
                 <div>
                   <h4 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Otros</h4>
                   <div className="flex gap-2">
                     <ToolbarButton 
                       onClick={() => { insertLink(); setIsMobileMenuOpen(false); }} 
                       title="Insert Link"
                     >
                       <Link2 className="h-4 w-4" />
                     </ToolbarButton>
                     <ToolbarButton 
                       onClick={() => { execCommand("formatBlock", "<pre>"); setIsMobileMenuOpen(false); }} 
                       title="Code Block"
                     >
                       <Code2 className="h-4 w-4" />
                     </ToolbarButton>
                   </div>
                 </div>

                 {/* Word Count - Mobile */}
                 <div className="pt-2 border-t border-white/10">
                   <div className="flex items-center justify-between text-xs text-white/70">
                     <span className="flex items-center gap-1">
                       Palabras: <span className="text-white/90 font-medium">
                         {content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length}
                       </span>
                     </span>
                     <span>
                       Caracteres: <span className="text-white/90 font-medium">{content.replace(/<[^>]*>/g, "").length}</span>
                     </span>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
      </div>

      <div className="relative z-0">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className={cn(
            "min-h-[400px] p-8 focus:outline-none relative z-0",
            "prose prose-lg max-w-none font-sans",
            "transition-all duration-300",
            "text-white leading-relaxed",
            "selection:bg-purple-500/30 selection:text-white",
            "[&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h1]:mt-8",
            "[&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-6",
            "[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:text-white [&>h3]:mb-3 [&>h3]:mt-5",
            "[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-white",
            "[&>ul]:mb-6 [&>ul]:pl-6 [&>ul]:text-white",
            "[&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:text-white",
            "[&>li]:mb-2 [&>li]:text-white",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-purple-400 [&>blockquote]:pl-6 [&>blockquote]:py-3 [&>blockquote]:italic [&>blockquote]:text-white [&>blockquote]:bg-purple-500/10 [&>blockquote]:backdrop-blur-sm [&>blockquote]:rounded-r-xl [&>blockquote]:my-6",
            "[&>pre]:bg-black/30 [&>pre]:backdrop-blur-sm [&>pre]:p-6 [&>pre]:rounded-xl [&>pre]:font-mono [&>pre]:text-sm [&>pre]:text-white [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/10",
            "[&>code]:bg-purple-500/20 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-white",
            "[&_a]:text-white [&_a]:underline [&_a]:decoration-white/50 [&_a]:underline-offset-2",
            "hover:[&_a]:decoration-white [&_a]:transition-colors",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-white/40 empty:before:pointer-events-none",
          )}
          data-placeholder="Cuéntanos sobre tu consulta, proyecto o cualquier cosa en la que podamos ayudarte..."
          suppressContentEditableWarning={true}
        />
      </div>

      <div className="flex items-center justify-end px-8 py-6 bg-white/5 backdrop-blur-xl border-t border-white/10 text-sm text-white/60 relative z-0">
        <Button
           onClick={handleSendMessage}
           disabled={isLoading}
           className="bg-white text-primary hover:bg-white/90 border-0 px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
         >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Siguiente
            </>
          )}
        </Button>
      </div>
    </>
  )

  const renderEmailStep = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-6 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="p-2 bg-primary/20 backdrop-blur-sm rounded-xl border border-primary/30">
          <Mail className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white/90 font-sans">Ingresa tu email</span>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/90">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <Button
          onClick={() => setCurrentStep("writing")}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button
          onClick={handleSendEmail}
          disabled={isLoading || !isValidEmail(email)}
          className="bg-white text-primary hover:bg-white/90 border-0 px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderConfirmationMessage = () => (
    <div className={cn(
      "flex flex-col h-full transition-all duration-1000 ease-in-out",
      isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
    )}>
      <div className="flex items-center gap-2 p-6 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="p-2 bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
          <CheckCircle className="h-4 w-4 text-green-300" />
        </div>
        <span className="text-sm font-semibold text-white/90 font-sans">¡Mensaje enviado!</span>
      </div>

      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
            <h3 className="text-2xl font-bold text-white">¡Gracias por tu mensaje!</h3>
            <p className="text-white/70 leading-relaxed">
              Hemos recibido tu consulta correctamente. Te responderemos pronto a tu correo electrónico.
            </p>
            <p className="text-white/50 text-sm">
              Serás redirigido al inicio en unos segundos...
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Logo */}
      <div className="relative z-20 p-4 sm:p-6">
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:bg-white/15 transition-all duration-300">
            <Logo size="lg" asLink={true} />
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 -mt-20">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {showConfirmation ? renderConfirmationMessage() : (
            currentStep === "writing" ? renderWritingStep() : renderEmailStep()
          )}
        </div>
      </div>
    </div>
  )
}