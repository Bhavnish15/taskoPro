"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VIP_LEVELS } from "@/lib/data"
import { Crown, Wallet, Calendar, TrendingUp, Target, Award, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      router.push("/")
      // <div className="min-h-screen flex items-center justify-center">
      //   <Card className="w-full max-w-md">
      //     <CardContent className="text-center py-8">
      //       <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      //       <p className="text-muted-foreground mb-4">Please sign in to access your dashboard.</p>
      //       <Link href="/auth">
      //         <Button>Sign In</Button>
      //       </Link>
      //     </CardContent>
      //   </Card>
      // </div>
    )
  }

  const currentVIP = VIP_LEVELS.find((level) => level.level === user.vipLevel)
  const nextVIP = VIP_LEVELS.find((level) => level.level === user.vipLevel + 1)
  const progressToNext = nextVIP ? Math.min((user.wallet / nextVIP.cost) * 100, 100) : 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <Badge variant="outline" className="text-sm">
            <Crown className="w-3 h-3 mr-1" />
            {currentVIP?.name} VIP
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {user.displayName ? `Hello ${user.displayName}` : user.email} • Last login:{" "}
          {new Date(user.lastLoginAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Level</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentVIP?.name}</div>
            <p className="text-xs text-muted-foreground">
              Level {user.vipLevel} • {Math.round((1 - (currentVIP?.timeReduction || 1)) * 100)}% faster
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.wallet.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Credits available</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.tasksToday}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalCreditsEarned?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All-time credits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/tasks">
                <Button className="w-full h-auto py-4 flex flex-col gap-2">
                  <Zap className="w-6 h-6" />
                  <span className="font-medium">Start Tasks</span>
                  <span className="text-xs opacity-80">Earn credits now</span>
                </Button>
              </Link>

              {nextVIP && (
                <Link href="/upgrade">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <Crown className="w-6 h-6" />
                    <span className="font-medium">Upgrade to {nextVIP.name}</span>
                    <span className="text-xs opacity-80">{nextVIP.cost} credits</span>
                  </Button>
                </Link>
              )}

              <Link href="/tasks">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Clock className="w-6 h-6" />
                  <span className="font-medium">View Progress</span>
                  <span className="text-xs opacity-80">Track your tasks</span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Award className="w-6 h-6" />
                  <span className="font-medium">Get Support</span>
                  <span className="text-xs opacity-80">24/7 help available</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* VIP Progress */}
          {nextVIP && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  VIP Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress to {nextVIP.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {user.wallet} / {nextVIP.cost} credits
                  </span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {currentVIP?.name}</span>
                  <span>Next: {nextVIP.name}</span>
                </div>
                {user.wallet >= nextVIP.cost && (
                  <Link href="/upgrade">
                    <Button className="w-full">Upgrade Now!</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current VIP Benefits */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Current VIP Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">{currentVIP?.name}</div>
                <div className="text-sm text-muted-foreground">Level {user.vipLevel}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time Reduction</span>
                  <Badge variant="secondary">{Math.round((1 - (currentVIP?.timeReduction || 1)) * 100)}%</Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Benefits:</span>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {currentVIP?.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Tasks completed today</span>
                  <Badge variant="outline">{user.tasksToday}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Total tasks completed</span>
                  <Badge variant="outline">{user.totalTasksCompleted || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Member since</span>
                  <Badge variant="outline">{new Date(user.createdAt).toLocaleDateString()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
