import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  addDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { User, Task, VIPLevel, TaskProgress, UserStats, ContactForm } from "@/types"

export class DatabaseService {
  private static instance: DatabaseService

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // User Operations
  async createUser(uid: string, userData: Omit<User, "uid">): Promise<void> {
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    })
  }

  async getUser(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          uid,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as User
      }
      return null
    } catch (error) {
      console.error("Error getting user:", error)
      return null
    }
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      ...updates,
      lastLoginAt: serverTimestamp(),
    })
  }

  async getAllUsers(
    pageSize = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
  ): Promise<{
    users: User[]
    lastDoc: QueryDocumentSnapshot<DocumentData> | null
  }> {
    try {
      let q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(pageSize))

      if (lastDoc) {
        q = query(collection(db, "users"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize))
      }

      const querySnapshot = await getDocs(q)
      const users: User[] = []
      let newLastDoc: QueryDocumentSnapshot<DocumentData> | null = null

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        users.push({
          uid: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as User)
      })

      if (querySnapshot.docs.length > 0) {
        newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      }

      return { users, lastDoc: newLastDoc }
    } catch (error) {
      console.error("Error getting users:", error)
      return { users: [], lastDoc: null }
    }
  }

  // Task Operations
  async getTasks(): Promise<Task[]> {
    try {
      const tasksRef = collection(db, "tasks")
      const q = query(tasksRef, orderBy("requiredVipLevel"), orderBy("reward", "desc"))
      const querySnapshot = await getDocs(q)

      const tasks: Task[] = []
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task)
      })

      return tasks
    } catch (error) {
      console.error("Error getting tasks:", error)
      return []
    }
  }

  async createTask(taskData: Omit<Task, "id">): Promise<string> {
    const tasksRef = collection(db, "tasks")
    const docRef = doc(tasksRef)
    await setDoc(docRef, {
      ...taskData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, "tasks", taskId)
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, "tasks", taskId)
    await deleteDoc(taskRef)
  }

  // VIP Level Operations
  async getVIPLevels(): Promise<VIPLevel[]> {
    try {
      const vipRef = collection(db, "vipLevels")
      const q = query(vipRef, orderBy("level"))
      const querySnapshot = await getDocs(q)

      const vipLevels: VIPLevel[] = []
      querySnapshot.forEach((doc) => {
        vipLevels.push({ ...doc.data() } as VIPLevel)
      })

      return vipLevels
    } catch (error) {
      console.error("Error getting VIP levels:", error)
      return []
    }
  }

  async createVIPLevel(vipData: VIPLevel): Promise<void> {
    const vipRef = doc(db, "vipLevels", vipData.level.toString())
    await setDoc(vipRef, {
      ...vipData,
      createdAt: serverTimestamp(),
    })
  }

  // Task Progress Operations
  async createTaskProgress(progressData: Omit<TaskProgress, "id">): Promise<string> {
    const progressRef = collection(db, "taskProgress")
    const docRef = doc(progressRef)
    await setDoc(docRef, {
      ...progressData,
      startTime: serverTimestamp(),
    })
    return docRef.id
  }

  async updateTaskProgress(progressId: string, updates: Partial<TaskProgress>): Promise<void> {
    const progressRef = doc(db, "taskProgress", progressId)
    await updateDoc(progressRef, {
      ...updates,
      ...(updates.isCompleted && { endTime: serverTimestamp() }),
    })
  }

  async getUserTaskProgress(userId: string, date: string): Promise<TaskProgress[]> {
    try {
      const progressRef = collection(db, "taskProgress")
      const q = query(progressRef, where("userId", "==", userId), where("date", "==", date))
      const querySnapshot = await getDocs(q)

      const progress: TaskProgress[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        progress.push({
          id: doc.id,
          taskId: data.taskId,
          userId: data.userId,
          isCompleted: data.isCompleted,
          rewardClaimed: data.rewardClaimed,
          // add any other required TaskProgress fields here
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as TaskProgress)
      })

      return progress
    } catch (error) {
      console.error("Error getting task progress:", error)
      return []
    }
  }

  // System Stats Operations
  async getSystemStats(): Promise<UserStats> {
    try {
      const statsRef = doc(db, "systemStats", "global")
      const statsSnap = await getDoc(statsRef)

      if (statsSnap.exists()) {
        return statsSnap.data() as UserStats
      }

      // If no stats exist, calculate and create them
      return await this.calculateAndUpdateStats()
    } catch (error) {
      console.error("Error getting system stats:", error)
      return {
        totalUsers: 0,
        activeToday: 0,
        totalCreditsDistributed: 0,
        averageVipLevel: 1,
        topUsers: [],
      }
    }
  }

  private async calculateAndUpdateStats(): Promise<UserStats> {
    try {
      const usersRef = collection(db, "users")
      const allUsersQuery = query(usersRef)
      const usersSnapshot = await getDocs(allUsersQuery)

      const today = new Date().toDateString()
      let totalUsers = 0
      let activeToday = 0
      let totalCreditsDistributed = 0
      let totalVipLevels = 0
      const topUsers: User[] = []

      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as User
        totalUsers++
        totalVipLevels += userData.vipLevel
        totalCreditsDistributed += userData.totalCreditsEarned || 0

        if (userData.lastTaskDate === today) {
          activeToday++
        }

        // Collect top users (by total credits earned)
        if (topUsers.length < 10) {
          topUsers.push({ ...userData, uid: doc.id } as User)
        } else {
          const minCredits = Math.min(...topUsers.map((u) => u.totalCreditsEarned || 0))
          if ((userData.totalCreditsEarned || 0) > minCredits) {
            const minIndex = topUsers.findIndex((u) => (u.totalCreditsEarned || 0) === minCredits)
            topUsers[minIndex] = { ...userData, uid: doc.id } as User
          }
        }
      })

      // Sort top users by credits earned
      topUsers.sort((a, b) => (b.totalCreditsEarned || 0) - (a.totalCreditsEarned || 0))

      const stats: UserStats = {
        totalUsers,
        activeToday,
        totalCreditsDistributed,
        averageVipLevel: totalUsers > 0 ? totalVipLevels / totalUsers : 1,
        topUsers: topUsers.slice(0, 10),
      }

      // Update stats in database
      const statsRef = doc(db, "systemStats", "global")
      await setDoc(statsRef, {
        ...stats,
        lastUpdated: serverTimestamp(),
      })

      return stats
    } catch (error) {
      console.error("Error calculating stats:", error)
      return {
        totalUsers: 0,
        activeToday: 0,
        totalCreditsDistributed: 0,
        averageVipLevel: 1,
        topUsers: [],
      }
    }
  }

  // Contact Form Operations
  async submitContactForm(formData: ContactForm): Promise<void> {
    const contactRef = collection(db, "contactForms")
    await setDoc(doc(contactRef), {
      ...formData,
      createdAt: serverTimestamp(),
      status: "pending",
    })
  }

  async getContactForms(status?: string): Promise<ContactForm[]> {
    try {
      const contactRef = collection(db, "contactForms")
      let q = query(contactRef, orderBy("createdAt", "desc"))

      if (status) {
        q = query(contactRef, where("status", "==", status), orderBy("createdAt", "desc"))
      }

      const querySnapshot = await getDocs(q)
      const forms: ContactForm[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        forms.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          type: data.type,
          status: data.status,
          createdAt: data.createdAt?.toDate(),
        } as ContactForm)
      })

      return forms
    } catch (error) {
      console.error("Error getting contact forms:", error)
      return []
    }
  }

  // Real-time listeners
  onUserStatsChange(callback: (stats: UserStats) => void): () => void {
    const statsRef = doc(db, "systemStats", "global")
    return onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as UserStats)
      }
    })
  }

  onTasksChange(callback: (tasks: Task[]) => void): () => void {
    const tasksRef = collection(db, "tasks")
    const q = query(tasksRef, orderBy("requiredVipLevel"), orderBy("reward", "desc"))

    return onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = []
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task)
      })
      callback(tasks)
    })
  }

  onVIPLevelsChange(callback: (vipLevels: VIPLevel[]) => void): () => void {
    const vipRef = collection(db, "vipLevels")
    const q = query(vipRef, orderBy("level"))

    return onSnapshot(q, (querySnapshot) => {
      const vipLevels: VIPLevel[] = []
      querySnapshot.forEach((doc) => {
        vipLevels.push({ ...doc.data() } as VIPLevel)
      })
      callback(vipLevels)
    })
  }

  // Batch operations for better performance
  async batchUpdateUsers(updates: { uid: string; data: Partial<User> }[]): Promise<void> {
    const batch = writeBatch(db)

    updates.forEach(({ uid, data }) => {
      const userRef = doc(db, "users", uid)
      batch.update(userRef, {
        ...data,
        lastLoginAt: serverTimestamp(),
      })
    })

    await batch.commit()
  }

  // Transaction for task completion (ensures data consistency)
  async completeTask(userId: string, taskId: string, reward: number): Promise<void> {
    const userRef = doc(db, "users", userId)
    const batch = writeBatch(db)

    // Update user stats
    batch.update(userRef, {
      wallet: increment(reward),
      tasksToday: increment(1),
      totalTasksCompleted: increment(1),
      totalCreditsEarned: increment(reward),
      lastTaskDate: new Date().toDateString(),
      lastLoginAt: serverTimestamp(),
    })

    // Create task progress record
    const progressRef = doc(collection(db, "taskProgress"))
    batch.set(progressRef, {
      userId,
      taskId,
      reward,
      completedAt: serverTimestamp(),
      date: new Date().toDateString(),
    })

    // Update global stats
    const statsRef = doc(db, "systemStats", "global")
    batch.update(statsRef, {
      totalCreditsDistributed: increment(reward),
      lastUpdated: serverTimestamp(),
    })

    await batch.commit()
  }
}

// Payments function
export async function createVipPayment(payment: {
  userId: string
  email: string
  country: string
  currency: string
  amount: number
  method: string
  proofUrl: string
}) {
  const docRef = await addDoc(collection(db, "vipPayments"), {
    ...payment,
    createdAt: serverTimestamp(), // use server time for consistency
  })
  return docRef.id
}