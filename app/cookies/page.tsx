"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Cookie Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Effective Date: June 15, 2025</p>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-are-cookies">
          <AccordionTrigger>1. What Are Cookies?</AccordionTrigger>
          <AccordionContent>
            <p>
              Cookies are small text files stored on your device that help websites function and collect information about user interactions.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types-of-cookies">
          <AccordionTrigger>2. Types of Cookies We Use</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Strictly Necessary:</strong> Required for basic platform functions (e.g., login, session)</li>
              <li><strong>Performance:</strong> Track usage and performance (e.g., page load time, crashes)</li>
              <li><strong>Analytics:</strong> Collect user behavior data (e.g., popular pages, bounce rate)</li>
              <li><strong>Preference:</strong> Remember your settings and language</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="third-party-cookies">
          <AccordionTrigger>3. Third-Party Cookies</AccordionTrigger>
          <AccordionContent>
            <p>
              We may use services like Google Analytics to understand how visitors use our site. These providers may also set cookies on your device.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manage-cookies">
          <AccordionTrigger>4. How to Manage Cookies</AccordionTrigger>
          <AccordionContent>
            <p>
              You can control or delete cookies via your browser settings. Note that disabling cookies may affect some platform features.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Chrome:</strong> <code>chrome://settings/cookies</code></li>
              <li><strong>Firefox:</strong> <code>about:preferences#privacy</code></li>
              <li><strong>Safari:</strong> Settings → Privacy & Security</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="policy-changes">
          <AccordionTrigger>5. Changes to This Cookie Policy</AccordionTrigger>
          <AccordionContent>
            <p>
              We may update this policy as needed to reflect changes in technology or law. All updates will be posted on this page.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger>6. Contact</AccordionTrigger>
          <AccordionContent>
            <p>
              For any questions about our use of cookies, please email <a href="mailto:privacy@taskopro.com" className="underline">privacy@taskopro.com</a>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
