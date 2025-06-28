"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Effective Date: June 15, 2025</p>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="who-we-are">
          <AccordionTrigger>Who We Are</AccordionTrigger>
          <AccordionContent>
            <p>
              Taskopro is a web-based platform where users complete virtual tasks and earn rewards based on time and VIP levels. This policy applies to all data we collect from users interacting with our platform.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-collection">
          <AccordionTrigger>What Data We Collect</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Identity:</strong> Username, email, country, IP address</li>
              <li><strong>Contact:</strong> Email, messaging ID (optional)</li>
              <li><strong>Technical:</strong> Browser, device, OS, referral source</li>
              <li><strong>Profile:</strong> VIP level, task history, rewards</li>
              <li><strong>Usage:</strong> Task interactions, pages visited</li>
              <li><strong>Wallet:</strong> Address and activity logs</li>
            </ul>
            <p className="mt-2">
              We do not knowingly collect data from children under 13. Any such data is deleted immediately.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-usage">
          <AccordionTrigger>How We Use Your Data</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1">
              <li>Account setup and authentication</li>
              <li>Task delivery and performance tracking</li>
              <li>Issuing rewards</li>
              <li>Security and fraud prevention</li>
              <li>Service improvements and updates</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-security">
          <AccordionTrigger>Data Security</AccordionTrigger>
          <AccordionContent>
            <p>
              We use SSL and secure infrastructure to protect your data. However, no system is completely secure—use strong passwords and safeguard your credentials.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-sharing">
          <AccordionTrigger>Data Sharing</AccordionTrigger>
          <AccordionContent>
            <p>
              We do not sell your data. We may share it with service providers (e.g., Firebase) or when required by law.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="retention">
          <AccordionTrigger>Data Retention</AccordionTrigger>
          <AccordionContent>
            <p>
              We retain data as long as needed for service, legal compliance, and dispute resolution. You can request deletion at any time by emailing privacy@taskopro.com.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rights">
          <AccordionTrigger>Your Rights</AccordionTrigger>
          <AccordionContent>
            <p>
              You may access, correct, delete, or restrict processing of your data. To exercise your rights, contact us at privacy@taskopro.com.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="changes">
          <AccordionTrigger>Policy Updates</AccordionTrigger>
          <AccordionContent>
            <p>
              We may update this policy occasionally. The effective date will change at the top. Continued use means acceptance of the new terms.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger>Contact Us</AccordionTrigger>
          <AccordionContent>
            <p>
              For questions or requests, email us at <a href="mailto:privacy@taskopro.com" className="underline">privacy@taskopro.com</a>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
