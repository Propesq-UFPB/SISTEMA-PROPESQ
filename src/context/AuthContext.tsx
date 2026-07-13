import React, { createContext, useContext, useMemo, useState } from "react"
import { authStorage } from "@/features/auth/api/authService"
import type { AppRole, AuthUser } from "@/features/auth/types/auth"

export type Role = AppRole

type AuthContextType = {
  user: AuthUser | null
  setAuthenticatedUser: (user: AuthUser) => void
  loginMock: (email: string, role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser())

  const loginMock = (email: string, role: Role) => {
    setUser({ id: 0, name: email.split("@")[0], email, role, backendRole: role })
  }

  const logout = () => {
    authStorage.clear()
    setUser(null)
  }

  const value = useMemo(() => ({ user, setAuthenticatedUser: setUser, loginMock, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
