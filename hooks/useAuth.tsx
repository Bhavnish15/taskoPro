"use client"

import type React from "react"
import { useState, useEffect, useCallback, createContext, useContext } from "react"
import type { User } from "@/types"
import { AuthService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authService = AuthService.getInstance()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */

  const clearError = useCallback(() => setError(null), [])

  /* ------------------------------------------------------------------ */
  /* Auth actions                                                       */
  /* ------------------------------------------------------------------ */

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        clearError()
        const user = await authService.signInWithEmail(email, password)
        setUser(user)
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [authService, clearError],
  )

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setLoading(true)
        clearError()
        const user = await authService.signUpWithEmail(email, password, displayName)
        setUser(user)
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [authService, clearError],
  )

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      clearError()
      const user = await authService.signInWithGoogle()
      setUser(user)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [authService, clearError])

  const sendPasswordReset = useCallback(
    async (email: string) => {
      try {
        clearError()
        await authService.sendPasswordReset(email)
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [authService, clearError],
  )

  const signOut = useCallback(async () => {
    try {
      clearError()
      await authService.signOut()
      setUser(null)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [authService, clearError])

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return
      try {
        clearError()
        await authService.updateUser(user.uid, updates)
        setUser((prev) => (prev ? { ...prev, ...updates } : null))
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [authService, user, clearError],
  )

  /* ------------------------------------------------------------------ */
  /* Auth state listener                                                */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [authService])

  /* ------------------------------------------------------------------ */
  /* Provider value                                                     */
  /* ------------------------------------------------------------------ */

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    signOut,
    updateUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
