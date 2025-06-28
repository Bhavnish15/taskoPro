import { DatabaseService } from "@/lib/db"
import type { Task, VIPLevel } from "@/types"

const dbService = DatabaseService.getInstance()

// Initial tasks data
const INITIAL_TASKS: Omit<Task, "id">[] = [
  {
    name: "Server Alpha Monitoring",
    description: "Monitor and maintain Alpha server infrastructure with real-time diagnostics",
    baseTime: 300, // 5 minutes
    reward: 15,
    isActive: false,
    category: "server",
    difficulty: "easy",
    requiredVipLevel: 1,
  },
  {
    name: "Server Beta Optimization",
    description: "Optimize Beta server performance and security protocols",
    baseTime: 600, // 10 minutes
    reward: 25,
    isActive: false,
    category: "server",
    difficulty: "medium",
    requiredVipLevel: 1,
  },
  {
    name: "Mining Gamma Operations",
    description: "Execute advanced mining algorithms on Gamma cluster infrastructure",
    baseTime: 900, // 15 minutes
    reward: 40,
    isActive: false,
    category: "mining",
    difficulty: "medium",
    requiredVipLevel: 2,
  },
  {
    name: "Trading Delta Analytics",
    description: "Analyze market trends and execute automated trading strategies",
    baseTime: 1200, // 20 minutes
    reward: 60,
    isActive: false,
    category: "trading",
    difficulty: "hard",
    requiredVipLevel: 3,
  },
  {
    name: "Server Omega Enterprise",
    description: "Manage enterprise-level Omega server operations and scaling",
    baseTime: 1800, // 30 minutes
    reward: 85,
    isActive: false,
    category: "server",
    difficulty: "hard",
    requiredVipLevel: 4,
  },
  {
    name: "Social Network Analysis",
    description: "Analyze social network patterns and engagement metrics",
    baseTime: 450, // 7.5 minutes
    reward: 30,
    isActive: false,
    category: "social",
    difficulty: "easy",
    requiredVipLevel: 2,
  },
  {
    name: "Advanced Mining Epsilon",
    description: "High-yield mining operations with quantum algorithms",
    baseTime: 2100, // 35 minutes
    reward: 120,
    isActive: false,
    category: "mining",
    difficulty: "hard",
    requiredVipLevel: 5,
  },
  {
    name: "Premium Trading Zeta",
    description: "Execute premium trading strategies with AI assistance",
    baseTime: 1500, // 25 minutes
    reward: 95,
    isActive: false,
    category: "trading",
    difficulty: "hard",
    requiredVipLevel: 4,
  },
]

// Initial VIP levels data
const INITIAL_VIP_LEVELS: VIPLevel[] = [
  {
    level: 1,
    name: "Basic",
    cost: 0,
    timeReduction: 1,
    description: "Standard access to basic server tasks",
    benefits: [
      "Access to basic server tasks",
      "Standard completion time",
      "Basic email support",
      "Community forum access",
    ],
    color: "gray",
  },
  {
    level: 2,
    name: "Silver",
    cost: 150,
    timeReduction: 0.9,
    description: "10% faster task completion + mining access",
    benefits: [
      "10% faster task completion",
      "Access to mining tasks",
      "Priority email support",
      "Silver member badge",
      "Weekly bonus rewards",
    ],
    color: "gray",
  },
  {
    level: 3,
    name: "Gold",
    cost: 350,
    timeReduction: 0.8,
    description: "20% faster completion + trading access",
    benefits: [
      "20% faster task completion",
      "Access to trading tasks",
      "Premium live chat support",
      "Gold member badge",
      "Daily bonus rewards",
      "Exclusive community channels",
    ],
    color: "yellow",
  },
  {
    level: 4,
    name: "Platinum",
    cost: 750,
    timeReduction: 0.7,
    description: "30% faster completion + premium tasks",
    benefits: [
      "30% faster task completion",
      "Access to all premium tasks",
      "VIP phone support",
      "Platinum member badge",
      "2x bonus rewards",
      "Early access to new features",
      "Personal account manager",
    ],
    color: "blue",
  },
  {
    level: 5,
    name: "Diamond",
    cost: 1500,
    timeReduction: 0.6,
    description: "40% faster completion + exclusive perks",
    benefits: [
      "40% faster task completion",
      "Access to exclusive Diamond tasks",
      "Dedicated VIP support team",
      "Diamond member badge",
      "3x bonus rewards",
      "Beta feature access",
      "Monthly VIP events",
      "Custom task scheduling",
      "Referral bonus program",
    ],
    color: "purple",
  },
]

export async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Initialize VIP Levels
    console.log("📊 Creating VIP levels...")
    for (const vipLevel of INITIAL_VIP_LEVELS) {
      await dbService.createVIPLevel(vipLevel)
      console.log(`✅ Created VIP level: ${vipLevel.name}`)
    }

    // Initialize Tasks
    console.log("🎯 Creating tasks...")
    for (const task of INITIAL_TASKS) {
      const taskId = await dbService.createTask(task)
      console.log(`✅ Created task: ${task.name} (ID: ${taskId})`)
    }

    // Initialize system stats
    console.log("📈 Initializing system stats...")
    await dbService.getSystemStats() // This will create initial stats if they don't exist

    console.log("🎉 Database initialization completed successfully!")
    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}

// Run initialization if this script is executed directly
if (typeof window === "undefined") {
  initializeDatabase()
}
