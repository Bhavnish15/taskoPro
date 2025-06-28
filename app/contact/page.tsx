"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ContactUsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast({ title: "Please fill in all fields", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      })
      toast({ title: "Message sent!", description: "We will get back to you soon." })
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      console.error(error)
      toast({ title: "Error sending message", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress bar shown while sending */}
          {loading && <Progress className="h-1 mb-4 animate-pulse" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium">Message</label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
