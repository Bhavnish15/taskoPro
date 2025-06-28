"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function FaqPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-is-taskopro">
          <AccordionTrigger>What is Taskopro?</AccordionTrigger>
          <AccordionContent>
            <p>
              Taskopro is a web-based platform where users complete virtual tasks to earn credits and progress through VIP levels.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="earning-rewards">
          <AccordionTrigger>How do I earn rewards?</AccordionTrigger>
          <AccordionContent>
            <p>
              You earn credits by completing tasks. The faster you finish and the higher your VIP level, the more credits you receive.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vip-levels">
          <AccordionTrigger>How do VIP levels work?</AccordionTrigger>
          <AccordionContent>
            <p>
              VIP levels are based on total credits earned and tasks completed. Increasing your level unlocks higher-paying tasks and perks.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-security">
          <AccordionTrigger>Is my data secure?</AccordionTrigger>
          <AccordionContent>
            <p>
              Yes. We protect your data with SSL encryption, Firebase security rules, and industry best practices.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact-support">
          <AccordionTrigger>How can I contact support?</AccordionTrigger>
          <AccordionContent>
            <p>
              Visit our Contact Us page to send a message, or email us directly at <a href="mailto:support@taskopro.com" className="underline">support@taskopro.com</a>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
