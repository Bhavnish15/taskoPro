"use client"

import { useState, useEffect, useCallback } from "react"
import { DatabaseService } from "@/lib/db"
import type { Task, VIPLevel, UserStats, User } from "@/types"

const dbService = DatabaseService.getInstance()

// Hook for tasks
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const tasksData = await dbService.getTasks()
        setTasks(tasksData)
      } catch (err) {
        setError("Failed to fetch tasks")
        console.error("Error fetching tasks:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()

    // Set up real-time listener
    const unsubscribe = dbService.onTasksChange((tasksData) => {
      setTasks(tasksData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createTask = useCallback(async (taskData: Omit<Task, "id">) => {
    try {
      await dbService.createTask(taskData)
    } catch (err) {
      setError("Failed to create task")
      throw err
    }
  }, [])

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await dbService.updateTask(taskId, updates)
    } catch (err) {
      setError("Failed to update task")
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await dbService.deleteTask(taskId)
    } catch (err) {
      setError("Failed to delete task")
      throw err
    }
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  }
}

// Hook for VIP levels
export function useVIPLevels() {
  const [vipLevels, setVipLevels] = useState<VIPLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVIPLevels = async () => {
      try {
        setLoading(true)
        const vipData = await dbService.getVIPLevels()
        setVipLevels(vipData)
      } catch (err) {
        setError("Failed to fetch VIP levels")
        console.error("Error fetching VIP levels:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVIPLevels()

    // Set up real-time listener
    const unsubscribe = dbService.onVIPLevelsChange((vipData) => {
      setVipLevels(vipData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return {
    vipLevels,
    loading,
    error,
  }
}

// Hook for system stats
export function useSystemStats() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeToday: 0,
    totalCreditsDistributed: 0,
    averageVipLevel: 1,
    topUsers: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const statsData = await dbService.getSystemStats()
        setStats(statsData)
      } catch (err) {
        setError("Failed to fetch system stats")
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Set up real-time listener
    const unsubscribe = dbService.onUserStatsChange((statsData) => {
      setStats(statsData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return {
    stats,
    loading,
    error,
  }
}

// Hook for admin users management
export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  const loadUsers = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        const { users: newUsers, lastDoc: newLastDoc } = await dbService.getAllUsers(20, reset ? undefined : lastDoc)

        if (reset) {
          setUsers(newUsers)
        } else {
          setUsers((prev) => [...prev, ...newUsers])
        }

        setLastDoc(newLastDoc)
        setHasMore(newUsers.length === 20)
      } catch (err) {
        setError("Failed to fetch users")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    },
    [lastDoc],
  )

  const updateUser = useCallback(async (uid: string, updates: Partial<User>) => {
    try {
      await dbService.updateUser(uid, updates)
      // Update local state
      setUsers((prev) => prev.map((user) => (user.uid === uid ? { ...user, ...updates } : user)))
    } catch (err) {
      setError("Failed to update user")
      throw err
    }
  }, [])

  useEffect(() => {
    loadUsers(true)
  }, [])

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore: () => loadUsers(false),
    updateUser,
    refresh: () => loadUsers(true),
  }
}

// Hook for task completion
export function useTaskCompletion() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeTask = useCallback(async (userId: string, taskId: string, reward: number) => {
    try {
      setLoading(true)
      setError(null)
      await dbService.completeTask(userId, taskId, reward)
    } catch (err) {
      setError("Failed to complete task")
      console.error("Error completing task:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    completeTask,
    loading,
    error,
  }
}
