"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    question: "¿El Directorio SENA es gratuito?",
    answer: "Sí, el registro y creación de tu perfil empresarial es completamente gratuito. Puedes mostrar tus productos, servicios y conectar con la comunidad SENA.",
  },
  {
    question: "¿Puedo cancelar o eliminar mi perfil en cualquier momento?",
    answer: "Sí, puedes desactivar o eliminar tu perfil cuando lo desees. No hay compromisos a largo plazo y tienes control total sobre tu información.",
  },
  {
    question: "¿Quiénes pueden registrarse en el directorio?",
    answer: "Egresados SENA, instructores y empresas vinculadas al ecosistema SENA pueden crear su perfil. Buscamos conectar a toda la comunidad emprendedora y empresarial formada por el SENA.",
  },
  {
    question: "¿Cómo puedo destacar mi negocio en el directorio?",
    answer: "Completa tu perfil al 100%, agrega imágenes de calidad, mantén actualizada tu información de contacto, horarios y productos. Los perfiles completos tienen mayor visibilidad.",
  },
]

export function FaqSection1() {
  return (
    <section className="bg-stone-100 py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="max-w-2xl gap-12 mx-auto px-6 flex flex-col">
        <div className="flex flex-col text-center gap-5">
          <p className="text-sm md:text-base text-black font-semibold">Preguntas Frecuentes</p>
          <h1 id="faq-heading" className="text-3xl md:text-4xl font-bold text-black">
            ¿Tienes dudas? Aquí están las respuestas.
          </h1>
          <p className="text-black">
            Hemos recopilado la información más importante para ayudarte a aprovechar al máximo tu experiencia. ¿No encuentras lo que buscas?{" "}
            <Link href="/contacto" className="text-primary underline">
              Contáctanos.
            </Link>
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1" aria-label="Preguntas frecuentes">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-base font-medium text-left text-black">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-black">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-stone-100 w-full rounded-xl p-6 md:p-8 flex flex-col items-center gap-6 border border-stone-200">
          <div className="flex flex-col text-center gap-2">
            <h2 className="text-2xl font-bold text-black">¿Aún tienes preguntas?</h2>
            <p className="text-base text-black">
              ¿Tienes dudas o necesitas ayuda? ¡Nuestro equipo está aquí para ayudarte!
            </p>
          </div>
          <Link href="/contacto">
            <Button 
              className="bg-stone-100 text-black hover:bg-stone-200 border border-stone-300"
              aria-label="Contactar con nuestro equipo de soporte"
            >
              Contáctanos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
