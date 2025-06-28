export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  vipLevel: number
  wallet: number
  tasksToday: number
  lastTaskDate: string
  isAdmin: boolean
  createdAt: Date
  lastLoginAt: Date
  totalTasksCompleted: number
  totalCreditsEarned: number
  referralCode?: string
  referredBy?: string
}

export interface Task {
  id: string
  name: string
  description: string
  baseTime: number
  reward: number
  isActive: boolean
  timeRemaining?: number
  category: "server" | "mining" | "trading" | "social"
  difficulty: "easy" | "medium" | "hard"
  requiredVipLevel: number
}

export interface VIPLevel {
  level: number
  name: string
  cost: number
  timeReduction: number
  description: string
  benefits: string[]
  color: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface TaskProgress {
  taskId: string
  userId: string
  startTime: Date
  endTime?: Date
  isCompleted: boolean
  rewardClaimed: boolean
}

export interface UserStats {
  totalUsers: number
  activeToday: number
  totalCreditsDistributed: number
  averageVipLevel: number
  topUsers: User[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  type: "general" | "support" | "billing" | "technical"
}
