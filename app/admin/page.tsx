"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, query, orderBy, addDoc, deleteDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Search, Users, TrendingUp, Wallet, Crown, Settings, Plus, Edit, Trash2, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  vipLevel: number
  wallet: number
  tasksToday: number
  lastTaskDate: string
  isAdmin: boolean
  createdAt: any
  lastLoginAt: any
  totalTasksCompleted: number
  totalCreditsEarned: number
}

interface Task {
  id: string
  title: string
  description: string
  reward: number
  category: string
  isActive: boolean
  createdAt: any
  updatedAt: any
}

interface SystemSettings {
  dailyTaskLimit: number
  minimumWithdrawal: number
  referralBonus: number
  taskResetTime: string
}

interface VIPSettings {
  level: number
  name: string
  dailyTaskLimit: number
  bonusMultiplier: number
  minTaskReward: number
  features: string[]
}

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // State for users
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [walletAmount, setWalletAmount] = useState("")
  const [vipLevel, setVipLevel] = useState("")
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    reward: "",
    category: "",
    isActive: true,
  })

  // State for VIP settings
  const [vipSettings, setVipSettings] = useState<VIPSettings[]>([])
  const [selectedVipLevel, setSelectedVipLevel] = useState<VIPSettings | null>(null)
  const [isVipDialogOpen, setIsVipDialogOpen] = useState(false)

  // State for system settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    dailyTaskLimit: 10,
    minimumWithdrawal: 100,
    referralBonus: 50,
    taskResetTime: "00:00",
  })

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const usersData: User[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        usersData.push({
          uid: doc.id,
          email: data.email || "",
          displayName: data.displayName || "",
          photoURL: data.photoURL || "",
          vipLevel: data.vipLevel || 1,
          wallet: data.wallet || 0,
          tasksToday: data.tasksToday || 0,
          lastTaskDate: data.lastTaskDate || "",
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt,
          lastLoginAt: data.lastLoginAt,
          totalTasksCompleted: data.totalTasksCompleted || 0,
          totalCreditsEarned: data.totalCreditsEarned || 0,
        })
      })

      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    try {
      const tasksRef = collection(db, "tasks")
      const q = query(tasksRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const tasksData: Task[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        tasksData.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          reward: data.reward || 0,
          category: data.category || "",
          isActive: data.isActive || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      })

      setTasks(tasksData)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks data.",
        variant: "destructive",
      })
    }
  }

  // Fetch VIP settings
  const fetchVipSettings = async () => {
    try {
      const vipRef = collection(db, "vipSettings")
      const querySnapshot = await getDocs(vipRef)

      const vipData: VIPSettings[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        vipData.push({
          level: data.level || 1,
          name: data.name || "",
          dailyTaskLimit: data.dailyTaskLimit || 10,
          bonusMultiplier: data.bonusMultiplier || 1,
          minTaskReward: data.minTaskReward || 1,
          features: data.features || [],
        })
      })

      setVipSettings(vipData.sort((a, b) => a.level - b.level))
    } catch (error) {
      console.error("Error fetching VIP settings:", error)
    }
  }
  // Fetch system settings
  const fetchSystemSettings = async () => {
    try {
      const settingsRef = doc(db, "systemSettings", "main")
      const docSnap = await getDocs(collection(db, "systemSettings"))

      if (!docSnap.empty) {
        const data = docSnap.docs[0].data()
        setSystemSettings({
          dailyTaskLimit: data.dailyTaskLimit || 10,
          minimumWithdrawal: data.minimumWithdrawal || 100,
          referralBonus: data.referralBonus || 50,
          taskResetTime: data.taskResetTime || "00:00",
        })
      }
    } catch (error) {
      console.error("Error fetching system settings:", error)
    }
  }

  // User management functions
  const handleAddCredits = async () => {
    if (!selectedUser || !walletAmount) return

    const amount = Number.parseInt(walletAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      })
      return
    }

    try {
      const userRef = doc(db, "users", selectedUser.uid)
      const newWalletAmount = selectedUser.wallet + amount

      await updateDoc(userRef, {
        wallet: newWalletAmount,
      })

      setUsers(users.map((u) => (u.uid === selectedUser.uid ? { ...u, wallet: newWalletAmount } : u)))

      toast({
        title: "Credits Added",
        description: `Added ${amount} credits to ${selectedUser.email}`,
      })

      setWalletAmount("")
      setSelectedUser(null)
      setIsUserDialogOpen(false)
    } catch (error) {
      console.error("Error adding credits:", error)
      toast({
        title: "Error",
        description: "Failed to add credits.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateVIP = async () => {
    if (!selectedUser || !vipLevel) return

    const level = Number.parseInt(vipLevel)
    if (isNaN(level) || level < 1 || level > 5) {
      toast({
        title: "Invalid VIP Level",
        description: "VIP level must be between 1 and 5.",
        variant: "destructive",
      })
      return
    }

    try {
      const userRef = doc(db, "users", selectedUser.uid)

      await updateDoc(userRef, {
        vipLevel: level,
      })

      setUsers(users.map((u) => (u.uid === selectedUser.uid ? { ...u, vipLevel: level } : u)))

      toast({
        title: "VIP Level Updated",
        description: `Updated ${selectedUser.email} to VIP Level ${level}`,
      })

      setVipLevel("")
      setSelectedUser(null)
      setIsUserDialogOpen(false)
    } catch (error) {
      console.error("Error updating VIP level:", error)
      toast({
        title: "Error",
        description: "Failed to update VIP level.",
        variant: "destructive",
      })
    }
  }

  // Task management functions
  const handleCreateTask = async () => {
    if (!taskForm.title || !taskForm.description || !taskForm.reward) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const tasksRef = collection(db, "tasks")
      await addDoc(tasksRef, {
        ...taskForm,
        reward: Number.parseInt(taskForm.reward),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      toast({
        title: "Task Created",
        description: "New task has been created successfully.",
      })

      setTaskForm({
        title: "",
        description: "",
        reward: "",
        category: "",
        isActive: true,
      })
      setIsTaskDialogOpen(false)
      fetchTasks()
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async () => {
    if (!selectedTask) return

    try {
      const taskRef = doc(db, "tasks", selectedTask.id)
      await updateDoc(taskRef, {
        ...taskForm,
        reward: Number.parseInt(taskForm.reward),
        updatedAt: new Date(),
      })

      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      })

      setSelectedTask(null)
      setIsTaskDialogOpen(false)
      fetchTasks()
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId))
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully.",
      })
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      })
    }
  }

  // System settings functions
  const handleUpdateSystemSettings = async () => {
    try {
      const settingsRef = doc(db, "systemSettings", "main")
      await setDoc(settingsRef, systemSettings, { merge: true })

      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating system settings:", error)
      toast({
        title: "Error",
        description: "Failed to update system settings.",
        variant: "destructive",
      })
    }
  }

  const getVipBadgeVariant = (level: number) => {
    switch (level) {
      case 1:
        return "secondary"
      case 2:
        return "outline"
      case 3:
        return "default"
      case 4:
        return "secondary"
      case 5:
        return "destructive"
      default:
        return "secondary"
    }
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.tasksToday > 0).length,
    totalCredits: users.reduce((sum, u) => sum + u.wallet, 0),
    vipUsers: users.filter((u) => u.vipLevel > 1).length,
  }

  useEffect(() => {
    if (!user?.isAdmin) {
      return 
    }

    fetchUsers()
    fetchTasks()
    fetchVipSettings()
    fetchSystemSettings()
  }, [user])

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have admin privileges.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Comprehensive system management and analytics</p>
        </div>
        <Button
          onClick={() => {
            fetchUsers()
            fetchTasks()
          }}
          variant="outline"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Completed tasks today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits}</div>
            <p className="text-xs text-muted-foreground">System-wide credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vipUsers}</div>
            <p className="text-xs text-muted-foreground">Premium members</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            VIP Settings
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Task Settings
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Search and manage all registered users, update VIP levels, and manage credits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users Table */}
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>VIP Level</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Tasks Today</TableHead>
                        <TableHead>Total Tasks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-muted-foreground">
                              {searchTerm ? "No users found matching your search." : "No users found."}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.uid}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.displayName || "No name"}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getVipBadgeVariant(user.vipLevel)}>
                                <Crown className="w-3 h-3 mr-1" />
                                Level {user.vipLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Wallet className="w-4 h-4 mr-1 text-muted-foreground" />
                                {user.wallet}
                              </div>
                            </TableCell>
                            <TableCell>{user.tasksToday}</TableCell>
                            <TableCell>{user.totalTasksCompleted}</TableCell>
                            <TableCell>
                              <Dialog
                                open={isUserDialogOpen && selectedUser?.uid === user.uid}
                                onOpenChange={setIsUserDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsUserDialogOpen(true)
                                    }}
                                  >
                                    Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Manage User</DialogTitle>
                                    <DialogDescription>Update credits and VIP level for {user.email}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="wallet">Add Credits</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          id="wallet"
                                          type="number"
                                          value={walletAmount}
                                          onChange={(e) => setWalletAmount(e.target.value)}
                                          placeholder="Amount"
                                          min="1"
                                        />
                                        <Button onClick={handleAddCredits} disabled={!walletAmount}>
                                          Add
                                        </Button>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Current balance: {user.wallet} credits
                                      </p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="vip">Update VIP Level</Label>
                                      <div className="flex gap-2">
                                        <Select value={vipLevel} onValueChange={setVipLevel}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1">Level 1</SelectItem>
                                            <SelectItem value="2">Level 2</SelectItem>
                                            <SelectItem value="3">Level 3</SelectItem>
                                            <SelectItem value="4">Level 4</SelectItem>
                                            <SelectItem value="5">Level 5</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Button onClick={handleUpdateVIP} disabled={!vipLevel}>
                                          Update
                                        </Button>
                                      </div>
                                      <p className="text-sm text-muted-foreground">Current level: {user.vipLevel}</p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedUser(null)
                                        setIsUserDialogOpen(false)
                                        setWalletAmount("")
                                        setVipLevel("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIP Settings Tab */}
        <TabsContent value="vip" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VIP Level Configuration</CardTitle>
              <CardDescription>Configure VIP levels, benefits, and requirements for premium users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Card key={level} className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        VIP Level {level}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Daily Task Limit</Label>
                        <p className="font-medium">{level * 10} tasks</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Bonus Multiplier</Label>
                        <p className="font-medium">{level}x rewards</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Min Task Reward</Label>
                        <p className="font-medium">{level} credits</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={handleUpdateVIP}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Level
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Settings Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Create, edit, and manage tasks available to users.</CardDescription>
              </div>
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedTask(null)
                      setTaskForm({
                        title: "",
                        description: "",
                        reward: "",
                        category: "",
                        isActive: true,
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{selectedTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                    <DialogDescription>
                      {selectedTask ? "Update task details" : "Add a new task for users to complete"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reward">Reward (Credits)</Label>
                        <Input
                          id="reward"
                          type="number"
                          value={taskForm.reward}
                          onChange={(e) => setTaskForm({ ...taskForm, reward: e.target.value })}
                          placeholder="0"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={taskForm.category}
                          onValueChange={(value) => setTaskForm({ ...taskForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="survey">Survey</SelectItem>
                            <SelectItem value="video">Video Watch</SelectItem>
                            <SelectItem value="app">App Download</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={taskForm.isActive}
                        onCheckedChange={(checked) => setTaskForm({ ...taskForm, isActive: checked })}
                      />
                      <Label htmlFor="active">Task is active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={selectedTask ? handleUpdateTask : handleCreateTask}>
                      {selectedTask ? "Update Task" : "Create Task"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-muted-foreground">No tasks found. Create your first task!</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">{task.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{task.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Wallet className="w-4 h-4 mr-1 text-muted-foreground" />
                              {task.reward}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={task.isActive ? "default" : "secondary"}>
                              {task.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTask(task)
                                  setTaskForm({
                                    title: task.title,
                                    description: task.description,
                                    reward: task.reward.toString(),
                                    category: task.category,
                                    isActive: task.isActive,
                                  })
                                  setIsTaskDialogOpen(true)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings and limits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Task Limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={systemSettings.dailyTaskLimit}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        dailyTaskLimit: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                  />
                  <p className="text-sm text-muted-foreground">Maximum tasks a user can complete per day</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount</Label>
                  <Input
                    id="minWithdrawal"
                    type="number"
                    value={systemSettings.minimumWithdrawal}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        minimumWithdrawal: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                  />
                  <p className="text-sm text-muted-foreground">Minimum credits required for withdrawal</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralBonus">Referral Bonus Amount</Label>
                  <Input
                    id="referralBonus"
                    type="number"
                    value={systemSettings.referralBonus}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        referralBonus: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                  <p className="text-sm text-muted-foreground">Credits awarded for successful referrals</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resetTime">Task Reset Time (UTC)</Label>
                  <Input
                    id="resetTime"
                    type="time"
                    value={systemSettings.taskResetTime}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        taskResetTime: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">Daily reset time for task counters</p>
                </div>

                <Button onClick={handleUpdateSystemSettings} className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  System Statistics
                </CardTitle>
                <CardDescription>Current system performance metrics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                    <div className="text-sm text-muted-foreground">Active Today</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalCredits}</div>
                    <div className="text-sm text-muted-foreground">Total Credits</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Active Tasks</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Credits per User</span>
                    <span className="font-medium">
                      {stats.totalUsers > 0 ? Math.round(stats.totalCredits / stats.totalUsers) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">VIP Conversion Rate</span>
                    <span className="font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.vipUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Rate</span>
                    <span className="font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
