"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Zap,
  Filter,
  Crown,
  Target,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Wallet,
  Star,
  Trophy,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string
  reward: number
  category: string
  isActive: boolean
  createdAt: any
  updatedAt: any
  duration?: number // in minutes
}

interface TaskProgress {
  taskId: string
  startTime: number
  duration: number
  isRunning: boolean
  progress: number
}

interface User {
  uid: string
  email: string
  displayName: string
  vipLevel: number
  wallet: number
  tasksToday: number
  lastTaskDate: string
  totalTasksCompleted: number
  totalCreditsEarned: number
}

export default function TasksPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("reward")
  const [searchTerm, setSearchTerm] = useState("")
  const [taskProgress, setTaskProgress] = useState<Map<string, TaskProgress>>(new Map())
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  const router = useRouter()

  // Fetch tasks from Firestore
  // const testFetch = async () => {
  //   const snap = await getDocs(collection(db, "tasks"));
  //   console.log("total tasks in Firestore:", snap.size);
  //   snap.docs.forEach(d => console.log(d.id, d.data()));

  //   const tasksRef = collection(db, "tasks");
  //   const allRef = query(tasksRef, where("isActive", "in", [true, false]));
  //   const allSnap = await getDocs(allRef);
  //   console.log("all with isActive present:", allSnap.size);
  // };
  // useEffect(() => { testFetch() }, []);
  // const fetchTasks = async () => {
  //   try {
  //     setLoading(true)
  //     const tasksRef = collection(db, "tasks")
  //     const q = query(tasksRef, where("isActive", "==", true), orderBy("createdAt", "desc"))
  //     const querySnapshot = await getDocs(q)

  //     const tasksData: Task[] = []
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data()
  //       tasksData.push({
  //         id: doc.id,
  //         title: data.title || "",
  //         description: data.description || "",
  //         reward: data.reward || 0,
  //         category: data.category || "",
  //         isActive: data.isActive || false,
  //         createdAt: data.createdAt,
  //         updatedAt: data.updatedAt,
  //         duration: data.duration || Math.floor(Math.random() * 10) + 5, // Random duration 5-15 mins if not set
  //       })
  //     })

  //     setTasks(tasksData)
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch tasks data.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchTasks = async () => {
    try {
      // 1) Build your query: only active tasks, sorted by createdAt descending
      const tasksRef = collection(db, "tasks");
      const tasksQuery = query(
        tasksRef,
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );

      // 2) Run it
      const snapshot = await getDocs(tasksQuery);

      // 3) Map into your Task[] shape, converting Firestore Timestamps
      const tasksData: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;

        const createdAt = (data.createdAt as any)?.toDate?.() ?? new Date();
        const updatedAt = (data.updatedAt as any)?.toDate?.() ?? new Date();

        return {
          id: doc.id,
          title: data.title ?? "",
          description: data.description ?? "",
          reward: data.reward ?? 0,
          category: data.category ?? "",
          isActive: data.isActive ?? false,
          createdAt,
          updatedAt,
          duration:
            typeof data.duration === "number"
              ? data.duration
              : Math.floor(Math.random() * 10) + 5,
        };
      });

      setTasks(tasksData);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)            // ← stop spinner
    }
  };

  // Start task timer
  const startTask = (taskId: string, duration: number) => {
    const newProgress: TaskProgress = {
      taskId,
      startTime: Date.now(),
      duration: duration * 60 * 1000, // Convert minutes to milliseconds
      isRunning: true,
      progress: 0,
    }

    setTaskProgress((prev) => new Map(prev.set(taskId, newProgress)))

    toast({
      title: "Task Started! 🚀",
      description: `Timer started for ${duration} minutes. Complete the task to earn rewards!`,
    })
  }

  // Pause task timer
  const pauseTask = (taskId: string) => {
    setTaskProgress((prev) => {
      const current = prev.get(taskId)
      if (current) {
        const elapsed = Date.now() - current.startTime
        const newProgress = {
          ...current,
          isRunning: false,
          progress: Math.min((elapsed / current.duration) * 100, 100),
        }
        return new Map(prev.set(taskId, newProgress))
      }
      return prev
    })
  }

  // Resume task timer
  const resumeTask = (taskId: string) => {
    setTaskProgress((prev) => {
      const current = prev.get(taskId)
      if (current) {
        const newProgress = {
          ...current,
          isRunning: true,
          startTime: Date.now() - (current.progress / 100) * current.duration,
        }
        return new Map(prev.set(taskId, newProgress))
      }
      return prev
    })
  }

  // Complete task
  const completeTask = async (taskId: string, reward: number) => {
    if (!user) return

    try {
      const userRef = doc(db, "users", user.uid)
      const newWallet = user.wallet + reward
      const newTasksToday = user.tasksToday + 1
      const newTotalCompleted = user.totalTasksCompleted + 1
      const newTotalEarned = user.totalCreditsEarned + reward

      await updateDoc(userRef, {
        wallet: newWallet,
        tasksToday: newTasksToday,
        totalTasksCompleted: newTotalCompleted,
        totalCreditsEarned: newTotalEarned,
        lastTaskDate: new Date().toDateString(),
      })

      // Update local state
      setCompletedTasks((prev) => new Set(prev.add(taskId)))
      setTaskProgress((prev) => {
        const newMap = new Map(prev)
        newMap.delete(taskId)
        return newMap
      })

      toast({
        title: "Task Completed! 🎉",
        description: `Congratulations! You earned ${reward} credits!`,
      })

      // Refresh user data would happen through useAuth hook in real implementation
    } catch (error) {
      console.error("Error completing task:", error)
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update progress for running tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskProgress((prev) => {
        const newMap = new Map(prev)
        let hasChanges = false

        for (const [taskId, progress] of newMap.entries()) {
          if (progress.isRunning) {
            const elapsed = Date.now() - progress.startTime
            const newProgressValue = Math.min((elapsed / progress.duration) * 100, 100)

            if (newProgressValue !== progress.progress) {
              newMap.set(taskId, { ...progress, progress: newProgressValue })
              hasChanges = true
            }

            // Auto-complete when progress reaches 100%
            if (newProgressValue >= 100 && !completedTasks.has(taskId)) {
              const task = tasks.find((t) => t.id === taskId)
              if (task) {
                completeTask(taskId, task.reward)
              }
            }
          }
        }

        return hasChanges ? newMap : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [tasks, completedTasks, user])

  useEffect(() => {
    fetchTasks()
  }, [])

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filter === "all") return true
    if (filter === "completed") return completedTasks.has(task.id)
    if (filter === "in-progress") return taskProgress.has(task.id)
    return task.category === filter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "reward":
        return b.reward - a.reward
      case "duration":
        return (a.duration || 0) - (b.duration || 0)
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatProgress = (progress: number) => {
    const minutes = Math.floor(progress / 60)
    const seconds = progress % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getProgressTime = (taskProgress: TaskProgress) => {
    const elapsed = taskProgress.isRunning
      ? Date.now() - taskProgress.startTime
      : (taskProgress.progress / 100) * taskProgress.duration
    return Math.floor(elapsed / 1000)
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "social":
        return "📱"
      case "survey":
        return "📊"
      case "video":
        return "🎥"
      case "app":
        return "📲"
      default:
        return "⭐"
    }
  }

  const stats = {
    availableTasks: tasks.length,
    completedToday: completedTasks.size,
    inProgress: taskProgress.size,
    totalEarnings: user?.totalCreditsEarned || 0,
  }

  if (!user) {
    return (
      router.push("/")
      // <div className="min-h-screen flex items-center justify-center">
      //   <Card className="w-full max-w-md">
      //     <CardContent className="text-center py-8">
      //       <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      //       <p className="text-muted-foreground mb-4">Please sign in to access tasks.</p>
      //       <Button>Sign In</Button>
      //     </CardContent>
      //   </Card>
      // </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            Task Center
          </h1>
          <p className="text-muted-foreground">Complete tasks to earn credits and level up your account</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Crown className="w-4 h-4 mr-2" />
            VIP Level {user.vipLevel}
          </Badge>
          <Button onClick={fetchTasks} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Available Tasks</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.availableTasks}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">Ready to start</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completedToday}</div>
            <p className="text-xs text-green-600 dark:text-green-400">Tasks finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inProgress}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Credits earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <Input
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="app">App Download</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reward">Reward</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "No tasks match your current filters"}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedTasks.map((task) => {
            const progress = taskProgress.get(task.id)
            const isCompleted = completedTasks.has(task.id)
            const isInProgress = !!progress

            return (
              <Card
                key={task.id}
                className={`transition-all duration-200 hover:shadow-lg ${isCompleted
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : isInProgress
                    ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                    : "hover:shadow-md"
                  }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wallet className="w-4 h-4 text-yellow-600" />
                      <span className="font-bold text-yellow-600">{task.reward}</span>
                    </div>
                  </div>

                  <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{task.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(task.duration || 10)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>+{task.reward} credits</span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  {isInProgress && progress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {formatProgress(getProgressTime(progress))} / {formatTime(task.duration || 10)}
                        </span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(progress.progress)}% complete
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isCompleted ? (
                      <Button disabled className="w-full bg-transparent" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    ) : isInProgress ? (
                      <>
                        <Button
                          onClick={() => (progress?.isRunning ? pauseTask(task.id) : resumeTask(task.id))}
                          variant="outline"
                          className="flex-1"
                        >
                          {progress?.isRunning ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </>
                          )}
                        </Button>
                        {progress && progress.progress >= 100 && (
                          <Button onClick={() => completeTask(task.id, task.reward)} className="flex-1">
                            <Trophy className="w-4 h-4 mr-2" />
                            Claim Reward
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button onClick={() => startTask(task.id, task.duration || 10)} className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Task
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* VIP Upgrade CTA */}
      {user.vipLevel < 5 && (
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Crown className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Unlock Premium Tasks!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upgrade your VIP level to access higher-paying tasks, faster completion times, and exclusive rewards.
            </p>
            <Button size="lg" className="px-8">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to VIP {user.vipLevel + 1}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
