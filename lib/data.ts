import type { Task, VIPLevel } from "@/types"

export const TASKS: Task[] = [
  {
    id: "server-alpha",
    name: "Server Alpha",
    description: "Monitor and maintain Alpha server infrastructure",
    baseTime: 300, // 5 minutes
    reward: 10,
    isActive: false,
    category: "server",
    difficulty: "easy",
    requiredVipLevel: 1,
  },
  {
    id: "server-beta",
    name: "Server Beta",
    description: "Optimize Beta server performance and security",
    baseTime: 600, // 10 minutes
    reward: 20,
    isActive: false,
    category: "server",
    difficulty: "medium",
    requiredVipLevel: 1,
  },
  {
    id: "mining-gamma",
    name: "Mining Gamma",
    description: "Execute advanced mining algorithms on Gamma cluster",
    baseTime: 900, // 15 minutes
    reward: 35,
    isActive: false,
    category: "mining",
    difficulty: "medium",
    requiredVipLevel: 2,
  },
  {
    id: "trading-delta",
    name: "Trading Delta",
    description: "Analyze market trends and execute trading strategies",
    baseTime: 1200, // 20 minutes
    reward: 50,
    isActive: false,
    category: "trading",
    difficulty: "hard",
    requiredVipLevel: 3,
  },
  {
    id: "server-omega",
    name: "Server Omega",
    description: "Manage enterprise-level Omega server operations",
    baseTime: 1800, // 30 minutes
    reward: 75,
    isActive: false,
    category: "server",
    difficulty: "hard",
    requiredVipLevel: 4,
  },
]

export const VIP_LEVELS: VIPLevel[] = [
  {
    level: 1,
    name: "Basic",
    cost: 0,
    timeReduction: 1,
    description: "Standard access to basic tasks",
    benefits: ["Access to basic tasks", "Standard completion time", "Basic support"],
    color: "gray",
  },
  {
    level: 2,
    name: "Silver",
    cost: 100,
    timeReduction: 0.9,
    description: "10% faster task completion",
    benefits: ["10% faster tasks", "Access to mining tasks", "Priority support", "Silver badge"],
    color: "gray",
  },
  {
    level: 3,
    name: "Gold",
    cost: 250,
    timeReduction: 0.8,
    description: "20% faster task completion",
    benefits: ["20% faster tasks", "Access to trading tasks", "Premium support", "Gold badge", "Exclusive rewards"],
    color: "yellow",
  },
  {
    level: 4,
    name: "Platinum",
    cost: 500,
    timeReduction: 0.7,
    description: "30% faster task completion",
    benefits: [
      "30% faster tasks",
      "Access to all tasks",
      "VIP support",
      "Platinum badge",
      "Bonus rewards",
      "Early access to new features",
    ],
    color: "blue",
  },
  {
    level: 5,
    name: "Diamond",
    cost: 1000,
    timeReduction: 0.6,
    description: "40% faster task completion + exclusive perks",
    benefits: [
      "40% faster tasks",
      "Maximum rewards",
      "Dedicated support",
      "Diamond badge",
      "Exclusive events",
      "Referral bonuses",
      "Custom features",
    ],
    color: "purple",
  },
]

export const FAQ_DATA = [
  {
    question: "What is TaskoPro?",
    answer:
      "TaskoPro is a gamified platform where users complete various server and mining tasks to earn credits and upgrade their VIP status for better rewards and faster completion times.",
  },
  {
    question: "How do I earn credits?",
    answer:
      "You earn credits by completing daily tasks. Each task has a specific reward amount that gets added to your wallet upon completion. Higher VIP levels unlock tasks with better rewards.",
  },
  {
    question: "What are VIP levels?",
    answer:
      "VIP levels range from 1 (Basic) to 5 (Diamond). Higher levels provide faster task completion times, access to premium tasks, better rewards, and exclusive benefits.",
  },
  {
    question: "How do I upgrade my VIP level?",
    answer:
      "Visit the Upgrade page and use your earned credits to purchase higher VIP levels. Each level has different costs and benefits.",
  },
  {
    question: "Are tasks reset daily?",
    answer:
      "Yes, your daily task count resets every 24 hours, allowing you to complete tasks again and earn more credits.",
  },
  {
    question: "Is there a limit to how many tasks I can complete?",
    answer:
      "There's no daily limit on task completions. You can complete tasks as many times as you want throughout the day.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact our support team through the Contact page, or email us directly at support@viptasks.com. VIP users get priority support.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard security measures including Firebase authentication and encryption to protect your data and privacy.",
  },
]
