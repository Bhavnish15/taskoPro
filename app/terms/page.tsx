"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground">Effective Date: June 15, 2025</p>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="use-platform">
          <AccordionTrigger>1. Use of the Platform</AccordionTrigger>
          <AccordionContent>
            <p>
              You must be at least 13 years old to use Taskopro. You agree to provide accurate information and not use the platform for any unlawful or fraudulent activity.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="account-responsibilities">
          <AccordionTrigger>2. Account Responsibilities</AccordionTrigger>
          <AccordionContent>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="task-system">
          <AccordionTrigger>3. Task System and Rewards</AccordionTrigger>
          <AccordionContent>
            <p>
              Taskopro offers digital tasks that reward users after successful and complete execution. Rewards are based on your VIP level, task completion time, and adherence to platform rules.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Suspend tasks if suspicious activity is detected</li>
              <li>Adjust task logic or reward rates at any time</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prohibited-conduct">
          <AccordionTrigger>4. Prohibited Conduct</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1">
              <li>Use bots, automation, or scripts to game the system</li>
              <li>Attempt to exploit bugs or vulnerabilities</li>
              <li>Share or resell accounts</li>
              <li>Post harmful or misleading content</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="intellectual-property">
          <AccordionTrigger>5. Intellectual Property</AccordionTrigger>
          <AccordionContent>
            <p>
              All content on Taskopro — including logos, code, graphics, and platform logic — is the property of Taskopro Technologies and may not be copied or reused without permission.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="termination">
          <AccordionTrigger>6. Termination</AccordionTrigger>
          <AccordionContent>
            <p>
              We reserve the right to suspend or terminate any account found violating these Terms, without prior notice or liability.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="disclaimer">
          <AccordionTrigger>7. Disclaimer</AccordionTrigger>
          <AccordionContent>
            <p>
              Taskopro is provided “as is” without warranties of any kind. We do not guarantee earnings or uninterrupted service. Use the platform at your own risk.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="liability">
          <AccordionTrigger>8. Limitation of Liability</AccordionTrigger>
          <AccordionContent>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our Service.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="changes-to-terms">
          <AccordionTrigger>9. Changes to the Terms</AccordionTrigger>
          <AccordionContent>
            <p>
              We may update these Terms from time to time. Continued use of the platform after updates implies acceptance of the new Terms.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger>10. Contact</AccordionTrigger>
          <AccordionContent>
            <p>
              For questions about these Terms, contact us at <a href="mailto:support@taskopro.com" className="underline">support@taskopro.com</a>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
