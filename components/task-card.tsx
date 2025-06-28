"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { useVIPLevels } from "@/hooks/useDatabase"
import { Clock, Coins, Server, Pickaxe, TrendingUp, Users, Lock } from "lucide-react"

interface TaskCardProps {
  task: Task
  onTaskComplete: (taskId: string, reward: number) => void
}

const categoryIcons = {
  server: Server,
  mining: Pickaxe,
  trading: TrendingUp,
  social: Users,
}

const difficultyColors = {
  easy: "green",
  medium: "yellow",
  hard: "red",
}

export function TaskCard({ task, onTaskComplete }: TaskCardProps) {
  const { user } = useAuth()
  const { vipLevels } = useVIPLevels()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const vipLevel = user?.vipLevel || 1
  const currentVIPLevel = vipLevels.find((level) => level.level === vipLevel)
  const timeReduction = currentVIPLevel?.timeReduction || 1
  const adjustedTime = Math.floor(task.baseTime * timeReduction)
  const canAccess = vipLevel >= task.requiredVipLevel

  const CategoryIcon = categoryIcons[task.category]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, timeRemaining])

  const startTask = () => {
    if (!canAccess) return
    setTimeRemaining(adjustedTime)
    setIsActive(true)
    setIsCompleted(false)
  }

  const collectReward = () => {
    onTaskComplete(task.id, task.reward)
    setIsCompleted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = isActive ? ((adjustedTime - timeRemaining) / adjustedTime) * 100 : 0

  return (
    <Card className={`w-full task-card transition-all duration-300 hover:shadow-lg ${!canAccess ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
              <CategoryIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {task.name}
                {!canAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Coins className="w-4 h-4 text-yellow-500" />
              {task.reward}
            </div>
            <Badge
              variant="outline"
              className={`text-xs border-${difficultyColors[task.difficulty]}-500 text-${difficultyColors[task.difficulty]}-700`}
            >
              {task.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Duration: {formatTime(adjustedTime)}</span>
            {timeReduction < 1 && (
              <Badge variant="secondary" className="text-xs">
                {Math.round((1 - timeReduction) * 100)}% faster
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>VIP {task.requiredVipLevel}+ required</span>
          </div>
        </div>

        {isActive && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Time Remaining:</span>
              <span className="font-mono text-primary">{formatTime(timeRemaining)}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
            <div className="text-center">
              <Badge variant="secondary" className="animate-pulse">
                Task Running...
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!canAccess ? (
            <Button disabled className="w-full" variant="outline">
              <Lock className="w-4 h-4 mr-2" />
              Requires VIP {task.requiredVipLevel}
            </Button>
          ) : !isActive && !isCompleted ? (
            <Button onClick={startTask} className="w-full">
              Start Task
            </Button>
          ) : isActive ? (
            <Button disabled className="w-full" variant="outline">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                Running...
              </div>
            </Button>
          ) : isCompleted ? (
            <Button onClick={collectReward} className="w-full bg-green-600 hover:bg-green-700">
              <Coins className="w-4 h-4 mr-2" />
              Collect {task.reward} Credits
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
