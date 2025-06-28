import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Trophy, Users, Shield, Clock, Star, ArrowRight, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto max-w-6xl relative">
          <Badge variant="outline" className="mb-4">
            🎉 Join 2M+ Users Earning Daily
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Complete Tasks,
            <br />
            <span className="text-primary">Earn Real Rewards</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join our premium TaskoPro system and unlock exclusive benefits. Complete daily server tasks, earn credits
            instantly, and upgrade to higher VIP levels for exponentially better rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Start Earning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">2M+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">$50M+</div>
              <div className="text-sm text-muted-foreground">Rewards Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TaskoPro?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the most rewarding task platform with cutting-edge features designed for maximum earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete tasks and earn instant rewards. Higher VIP levels unlock up to 40% faster completion times
                  with exponentially better payouts.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>5 VIP Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upgrade through Basic, Silver, Gold, Platinum, and Diamond levels. Each tier offers better rewards,
                  faster tasks, and exclusive perks.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Multiple Task Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access server monitoring, mining operations, trading algorithms, and social tasks. Each category
                  offers unique rewards and challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bank-level security with Firebase authentication, encrypted data transmission, and secure payment
                  processing for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tasks refresh daily with no limits. Earn around the clock with our globally distributed infrastructure
                  and 99.9% uptime guarantee.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Thriving Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join millions of users earning daily rewards. Access exclusive community features, referral bonuses,
                  and VIP-only events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* VIP Levels Preview */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">VIP Level Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock exponentially better rewards as you climb the VIP ladder. Each level offers significant
              improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { level: 1, name: "Basic", reduction: "0%", color: "gray" },
              { level: 2, name: "Silver", reduction: "10%", color: "gray" },
              { level: 3, name: "Gold", reduction: "20%", color: "yellow" },
              { level: 4, name: "Platinum", reduction: "30%", color: "blue" },
              { level: 5, name: "Diamond", reduction: "40%", color: "purple" },
            ].map((vip) => (
              <Card key={vip.level} className="text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${vip.color}-500`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <Crown className={`w-8 h-8 text-${vip.color}-500`} />
                  </div>
                  <CardTitle className="text-lg">{vip.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Level {vip.level}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-1">{vip.reduction}</div>
                  <p className="text-xs text-muted-foreground">Faster Tasks</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join millions of satisfied users who are earning daily with TaskoPro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                level: "Diamond VIP",
                text: "I've earned over $5,000 in the past 6 months. The VIP system really pays off - Diamond level is incredible!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                level: "Platinum VIP",
                text: "Started as Basic and worked my way up. The faster task times at higher levels make a huge difference in earnings.",
                rating: 5,
              },
              {
                name: "Emma Rodriguez",
                level: "Gold VIP",
                text: "Love the variety of tasks and the instant payouts. Customer support is also top-notch. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <Badge variant="outline">{testimonial.level}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your VIP Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of users earning daily rewards. Sign up now and get instant access to all tasks and VIP
            features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Join TaskoPro Now
                <Crown className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                View FAQ
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>✅ No hidden fees • ✅ Instant payouts • ✅ 24/7 support • ✅ 2M+ happy users</p>
          </div>
        </div>
      </section>
    </div>
  )
}
