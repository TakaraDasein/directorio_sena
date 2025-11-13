"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Globe, 
  Megaphone, 
  FileText, 
  Zap, 
  Mail, 
  MessageCircle,
  Check,
  ChevronRight,
  Rocket,
  Users,
  TrendingUp,
  Target,
  Award,
  Lightbulb,
  Database,
  Send,
  Bot,
  DollarSign,
  ShoppingBag,
  Gift,
  Handshake
} from "lucide-react"
import { LpNavbar1 } from "@/components/lp-navbar-1"
import { Footer2 } from "@/components/footer-2"
import { useState } from "react"

export default function KitDigitalPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const whatsappLink = "https://wa.me/573126503491?text=Hola%2C%20quiero%20información%20sobre%20el%20Kit%20Digital%20Empresas"

  return (
    <>
      <LpNavbar1 />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  KIT DIGITAL EMPRESAS
                </h1>
                <p className="text-xl lg:text-2xl font-semibold">
                  Digitaliza tu negocio y gana visibilidad
                </p>
                <p className="text-lg text-white/90">
                  Transforma tu empresa, impulsa tus ventas y fortalece tu presencia digital. Con el <strong>Kit Digital Empresas</strong>, obtienes tu propia <strong>página web profesional</strong>, <strong>campañas digitales efectivas</strong>, <strong>material publicitario</strong> y <strong>herramientas tecnológicas exclusivas</strong> que integran software, automatización e inteligencia artificial.
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Rocket className="w-5 h-5 mr-2" />
                    Quiero mi Kit Digital
                  </a>
                </Button>
                <blockquote className="text-2xl italic border-l-4 border-white pl-6 mt-8">
                  "Crece, conecta y transforma tu empresa."
                </blockquote>
              </div>
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="/kit/1.webp"
                  alt="Kit Digital Empresas"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Digitalizamos Juntos */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              "Digitalizamos juntos, crecemos juntos."
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Forma parte de una red de empresarios que se apoyan entre sí, comparten conocimiento y construyen una economía más fuerte en la región. Este programa impulsa tu negocio y, al mismo tiempo, apoya a otros empresarios como tú.
            </p>
          </div>
        </section>

        {/* ¿Qué es el Kit Digital? */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[450px]">
                <Image
                  src="/kit/2 _que _es_el_kit_digital.webp"
                  alt="¿Qué es el Kit Digital?"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-10 h-10 text-primary" />
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                    ¿Qué es el Kit Digital Empresas?
                  </h2>
                </div>
                <p className="text-lg text-gray-700">
                  El <strong>Kit Digital Empresas</strong> es una iniciativa creada <em>por empresarios para empresarios</em>, inspirada en el exitoso programa europeo <em>Kit Digital España</em>, pero adaptada al contexto colombiano.
                </p>
                <p className="text-lg text-gray-700">
                  Su propósito es <strong>impulsar la digitalización, la visibilidad y la sostenibilidad de las empresas ganadoras del Fondo Emprender</strong>, fortaleciendo al mismo tiempo el ecosistema empresarial.
                </p>
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-900">
                    Cada kit es una <strong>herramienta de crecimiento real</strong>, que permite a las empresas:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Tener presencia digital profesional.",
                      "Atraer clientes mediante estrategias de marketing efectivas.",
                      "Conectarse con otros negocios del Directorio Sena.",
                      "Posicionar su marca en un entorno colaborativo."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hecho por empresarios */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Handshake className="w-10 h-10 text-primary" />
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                    Hecho por empresarios, para empresarios
                  </h2>
                </div>
                <p className="text-lg text-gray-700">
                  Este Kit Digital se ejecuta a través de un grupo especializado de empresas y profesionales certificados dentro del propio directorio, llamados:
                </p>
                <blockquote className="text-2xl font-bold text-primary border-l-4 border-primary pl-6">
                  Agentes Digitalizadores Regionales
                </blockquote>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    Estos <strong>Agentes Digitalizadores Regionales</strong> son ganadores del Fondo Emprender, que ahora ofrecen sus servicios a otros empresarios como parte de un modelo de economía colaborativa.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "El dinero invertido se queda en la región, generando empleo y fortaleciendo el tejido empresarial.",
                      "La calidad está garantizada, porque los servicios provienen de quienes ya vivieron el proceso en el Fondo Emprender y lo culminaron con éxito.",
                      "Cada implementación del Kit genera trabajo, crecimiento y economía circular local: el dinero invertido se queda en la región, se reinvierte en el Directorio y multiplica las oportunidades para todos."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <blockquote className="text-xl italic text-gray-700 bg-white p-6 rounded-lg border-l-4 border-primary">
                  "Cada empresa que compra un Kit Digital está apoyando a otros empresarios del mismo ecosistema."
                </blockquote>
              </div>
              <div className="relative h-[450px]">
                <Image
                  src="/kit/3_hecho_por_empresarios.webp"
                  alt="Hecho por empresarios"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ¿Qué incluye? */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <ShoppingBag className="w-10 h-10 text-primary" />
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 text-center">
                ¿Qué incluye el Kit Digital Empresas?
              </h2>
            </div>
            
            <div className="relative h-[500px] mb-12 max-w-4xl mx-auto">
              <Image
                src="/kit/4a_kit_digital.webp"
                alt="Kit Digital incluye"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Página Web */}
              <Card className="border-2 hover:border-primary transition-colors shadow-lg hover:shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Página Web Profesional
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Manual básico de identidad visual",
                      "Diseño adaptable a dispositivos móviles",
                      "Hasta 5 secciones con información empresarial",
                      "Optimización SEO local básica para Google",
                      "Productos conectados dinámicamente a WhatsApp",
                      "Integración con WhatsApp, redes sociales y Directorio",
                      "Hosting y dominio por un año"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Campañas Digitales */}
              <Card className="border-2 hover:border-primary transition-colors shadow-lg hover:shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Campañas Digitales
                  </h3>
                  <p className="text-sm text-gray-600">(Facebook + WhatsApp Ads)</p>
                  <ul className="space-y-2">
                    {[
                      "Análisis del negocio y del público objetivo",
                      "Diseño de creativos (imágenes y piezas gráficas)",
                      "Creación estratégica de anuncios y copies",
                      "Configuración y gestión profesional de campañas",
                      "Monitoreo, métricas y optimización continua",
                      "Asesoría personalizada"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Material Publicitario */}
              <Card className="border-2 hover:border-primary transition-colors shadow-lg hover:shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Material Publicitario Físico
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Diseño de letrero o pendón publicitario 120cm x 90cm",
                      "100 tarjetas de presentación personalizadas"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative h-[250px] mt-4">
                    <Image
                      src="/kit/4b_material_publicitario.webp"
                      alt="Material publicitario"
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Herramientas PLUS */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Gift className="w-10 h-10 text-primary" />
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 text-center">
                Herramientas PLUS de impulso empresarial
              </h2>
            </div>
            <p className="text-xl text-gray-700 text-center mb-12">
              Cada empresa que adquiera su Kit Digital recibirá sin costo adicional acceso temporal a herramientas tecnológicas exclusivas:
            </p>

            <div className="relative h-[550px] mb-12 max-w-4xl mx-auto">
              <Image
                src="/kit/5_herramientas_plus.webp"
                alt="Herramientas PLUS"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Herramienta</th>
                    <th className="px-6 py-4 text-left font-semibold">Descripción</th>
                    <th className="px-6 py-4 text-left font-semibold">Valor comercial</th>
                    <th className="px-6 py-4 text-left font-semibold">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <span className="font-medium">MEGA EXTRACTOR</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">Software para obtener bases de datos de clientes y contactos empresariales.</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">$1.000.000</td>
                    <td className="px-6 py-4 text-gray-700">1 mes</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        <span className="font-medium">MEGA ENVÍOS</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">Plataforma para enviar mensajes masivos por WhatsApp o correo.</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">$1.000.000</td>
                    <td className="px-6 py-4 text-gray-700">1 mes</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-medium">CRM IA-E</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">Sistema que gestiona de forma automatizada tus conversaciones y emociones del cliente.</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">$3.000.000</td>
                    <td className="px-6 py-4 text-gray-700">1 mes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Impacto y Propósito */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[550px]">
                <Image
                  src="/kit/6_impacto_y_proposito.webp"
                  alt="Impacto y Propósito"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-10 h-10 text-primary" />
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                    Impacto y propósito del Kit Digital
                  </h2>
                </div>
                <p className="text-lg text-gray-700">
                  El <strong>Kit Digital Empresas</strong> no es solo tecnología; es una red de apoyo y colaboración entre empresarios.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: DollarSign, text: "Fortalece la economía local: las inversiones se quedan en la región." },
                    { icon: Users, text: "Genera sinergia: los empresarios del Fondo Emprender trabajan entre sí." },
                    { icon: Award, text: "Posiciona el Directorio Sena: cada kit adquirido impulsa la visibilidad colectiva." },
                    { icon: TrendingUp, text: "Promueve la digitalización real: tecnología útil, implementada por quienes entienden tus desafíos." }
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span className="text-lg text-gray-700">{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <blockquote className="text-xl italic text-primary bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  "Este programa une fuerzas, conecta negocios y crea oportunidades reales de crecimiento."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <Zap className="w-10 h-10 text-primary" />
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 text-center">
                ¿Cómo funciona el proceso?
              </h2>
            </div>
            
            <div className="relative h-[550px] mb-12 max-w-3xl mx-auto">
              <Image
                src="/kit/7_proceso.webp"
                alt="Proceso del Kit Digital"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Solicita tu Kit Digital",
                  description: "Completa el formulario o contáctanos por WhatsApp."
                },
                {
                  step: "2",
                  title: "Asignación de Agente",
                  description: "Se te conectará con un experto emprendedor de tu región."
                },
                {
                  step: "3",
                  title: "Ejecución del plan",
                  description: "En menos de 21 días hábiles tendrás tu sitio web, campaña digital y material publicitario."
                },
                {
                  step: "4",
                  title: "Entrega de bonos",
                  description: "Acceso a las herramientas PLUS y capacitación para aprovecharlas al máximo."
                }
              ].map((item) => (
                <Card key={item.step} className="border-2 hover:border-primary transition-colors relative overflow-hidden shadow-lg hover:shadow-xl">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full flex items-start justify-end p-4">
                    <span className="text-3xl font-bold text-primary">{item.step}</span>
                  </div>
                  <CardContent className="p-6 pt-16">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Inversión */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <DollarSign className="w-10 h-10" />
              <h2 className="text-3xl lg:text-5xl font-bold text-center">
                Inversión y valor comercial
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Concepto</th>
                      <th className="px-6 py-4 text-right font-semibold">Valor comercial</th>
                      <th className="px-6 py-4 text-right font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { concept: "Página Web Profesional", value: "$2.500.000", duration: "1 Año" },
                      { concept: "Campañas Digitales", value: "$2.500.000", duration: "1 Mes" },
                      { concept: "Material Publicitario", value: "$1.000.000", duration: "No Aplica" },
                      { concept: "MegaBusiness Extractor", value: "$1.000.000", duration: "1 Mes" },
                      { concept: "MegaBusiness Envíos", value: "$1.000.000", duration: "1 Mes" },
                      { concept: "CRM IA Emocional WhatsApp", value: "$1.000.000", duration: "1 mes" }
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{item.concept}</td>
                        <td className="px-6 py-4 text-right font-medium">{item.value}</td>
                        <td className="px-6 py-4 text-right">{item.duration}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary text-white font-bold">
                      <td className="px-6 py-4 text-lg">Valor total</td>
                      <td className="px-6 py-4 text-right text-xl">$9.000.000 COP</td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-12 space-y-6">
                <div className="bg-white text-primary rounded-2xl p-8 inline-block shadow-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-6 h-6" />
                    <p className="text-2xl">Tú solo inviertes:</p>
                  </div>
                  <p className="text-5xl font-bold">$5.000.000 COP</p>
                </div>
                <p className="text-xl">
                  Ahorra más de <strong>$4.000.000</strong> y recibe una solución integral que impulsa tu empresa, tu marca y a toda la comunidad empresarial.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl"
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-5 h-5 mr-2" />
                      Solicitar mi Kit Digital
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Hablar con un Agente
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <MessageCircle className="w-10 h-10 text-primary" />
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 text-center">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "¿Quién puede acceder al Kit Digital Empresas?",
                  a: "Empresas ganadoras del Fondo Emprender, egresados Sena y Agentes digitalizadores."
                },
                {
                  q: "¿Quién desarrolla los Kits?",
                  a: "Los Agentes Digitalizadores: empresarios certificados dentro del ecosistema Directorio SENA."
                },
                {
                  q: "¿El dominio y hosting están incluidos?",
                  a: "Sí, por un año completo."
                },
                {
                  q: "¿Cuánto tarda todo el proceso?",
                  a: "Entre 15 y 21 días hábiles desde la aprobación del recurso."
                },
                {
                  q: "¿Puedo obtener soporte técnico?",
                  a: "Sí, recibirás acompañamiento personalizado durante la implementación y post-entrega."
                },
                {
                  q: "¿Qué impacto tiene mi compra?",
                  a: "Tu inversión fortalece tu negocio con herramientas digitales reales que aumentan tus ventas, tu presencia online y tu posicionamiento de marca. Al mismo tiempo, impulsa la economía local al generar oportunidades para otros empresarios del Fondo Emprender, promoviendo una red de crecimiento colaborativo donde todos ganan."
                }
              ].map((faq, i) => (
                <Card 
                  key={i} 
                  className="cursor-pointer hover:shadow-lg transition-all shadow-md"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
                      <ChevronRight 
                        className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                          openFAQ === i ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                    {openFAQ === i && (
                      <p className="mt-4 text-gray-700">{faq.a}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="relative h-[100px] mb-8 max-w-3xl mx-auto">
              <Image
                src="/kit/8_logos_directorio_sena.webp"
                alt="Logos Directorio SENA"
                fill
                className="object-contain drop-shadow-xl"
              />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresarios que ya están digitalizando sus negocios y creciendo juntos.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-6 shadow-2xl"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Rocket className="w-5 h-5 mr-2" />
                Solicitar mi Kit Digital ahora
              </a>
            </Button>
            <p className="mt-12 text-white/80 italic text-lg border-t border-white/20 pt-8">
              "Una iniciativa creada por empresarios del Fondo Emprender para fortalecer a todos los negocios de Colombia."
            </p>
          </div>
        </section>
      </main>

      <Footer2 />
    </>
  )
}
