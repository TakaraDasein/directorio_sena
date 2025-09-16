"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    question: "Is Flowly free to use?",
    answer: "Yes! We offer a free plan with essential features to get you started.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. No long-term commitments required.",
  },
  {
    question: "Do you offer discounts for nonprofits or education?",
    answer:
      "Yes, we offer special pricing for nonprofit organizations and educational institutions. Please contact us for more information.",
  },
  {
    question: "What integrations does Flowly support?",
    answer:
      "Flowly integrates with popular tools like Slack, Google Workspace, Trello, and many more. Check our documentation for the full list.",
  },
]

export function FaqSection1() {
  return (
    <section className="bg-stone-100 py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="max-w-2xl gap-12 mx-auto px-6 flex flex-col">
        <div className="flex flex-col text-center gap-5">
          <p className="text-sm md:text-base text-black font-semibold">FAQ</p>
          <h1 id="faq-heading" className="text-3xl md:text-4xl font-bold text-black">
            Got questions? We've got answers.
          </h1>
          <p className="text-black">
            We've compiled the most important information to help you get the most out of your experience. Can't find
            what you're looking for?{" "}
            <Link href="#" className="text-primary underline">
              Contact us.
            </Link>
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1" aria-label="FAQ items">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-base font-medium text-left text-black">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-black">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-stone-100 w-full rounded-xl p-6 md:p-8 flex flex-col items-center gap-6 border border-stone-200">
          <div className="flex flex-col text-center gap-2">
            <h2 className="text-2xl font-bold text-black">Still have questions?</h2>
            <p className="text-base text-black">
              Have questions or need assistance? Our team is here to help!
            </p>
          </div>
          <Button 
            className="bg-stone-100 text-black hover:bg-stone-200 border border-stone-300"
            aria-label="Contact our support team"
          >
            Contact us
          </Button>
        </div>
      </div>
    </section>
  )
}
