import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "./firebase"
import { DatabaseService } from "./db"
import type { User } from "@/types"

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Admin emails from environment
// const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || []
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map(e => e.trim().replace(/^"|"$/g, "").toLowerCase());

export class AuthService {
  private static instance: AuthService
  private dbService = DatabaseService.getInstance()

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Create user document in Firestore
  private async createUserDocument(firebaseUser: FirebaseUser): Promise<User> {
    const existingUser = await this.dbService.getUser(firebaseUser.uid)

    const userEmail = (firebaseUser.email ?? "").toLowerCase();

    if (!existingUser) {
      const userData: Omit<User, "uid">  & { userId: string }  = {
        userId: firebaseUser.uid, 
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        vipLevel: 1,
        wallet: 0,
        tasksToday: 0,
        lastTaskDate: new Date().toDateString(),
        isAdmin: ADMIN_EMAILS.includes(userEmail),
        createdAt: new Date(),
        lastLoginAt: new Date(),
        totalTasksCompleted: 0,
        totalCreditsEarned: 0,
      }

      await this.dbService.createUser(firebaseUser.uid, userData)
      return { uid: firebaseUser.uid, ...userData }
    } else {
      // Update last login
      await this.dbService.updateUser(firebaseUser.uid, {
        lastLoginAt: new Date(),
      })
      return existingUser
    }
  }

  // Get user document from Firestore
  async getUserDocument(uid: string): Promise<User | null> {
    return await this.dbService.getUser(uid)
  }

  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

      if (displayName) {
        await updateProfile(firebaseUser, { displayName })
      }

      return await this.createUserDocument(firebaseUser)
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }


  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
      return await this.createUserDocument(firebaseUser)
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider)
      return await this.createUserDocument(firebaseUser)
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in was cancelled")
      }
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      throw new Error("Failed to sign out")
    }
  }

  // Update user data
  async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    try {
      await this.dbService.updateUser(uid, updates)
    } catch (error) {
      console.error("Error updating user:", error)
      throw new Error("Failed to update user data")
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserDocument(firebaseUser.uid)
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  // Get current Firebase user
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser
  }

  // Get user-friendly error messages
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address"
      case "auth/wrong-password":
        return "Incorrect password"
      case "auth/email-already-in-use":
        return "An account with this email already exists"
      case "auth/weak-password":
        return "Password should be at least 6 characters"
      case "auth/invalid-email":
        return "Invalid email address"
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later"
      case "auth/network-request-failed":
        return "Network error. Please check your connection"
      case "auth/popup-blocked":
        return "Popup was blocked. Please allow popups and try again"
      case "EMAIL_EXISTS":
      case "auth/email-already-in-use":
        return "That email is already registered. Try signing in instead.";
      default:
        return "An error occurred. Please try again"
    }
  }
}
