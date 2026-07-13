import { apiRequest } from "@/services/apiClient"
import type { AuthUser, LoginResponse } from "../types/auth"
import { mapBackendRole } from "../types/auth"

const TOKEN_KEY = "access_token"
const USER_KEY = "auth_user"

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try { return JSON.parse(raw) as AuthUser } catch { return null }
  },
  save(response: LoginResponse): AuthUser {
    const user: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.nome,
      backendRole: response.user.funcao,
      role: mapBackendRole(response.user.funcao),
    }
    localStorage.setItem(TOKEN_KEY, response.accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem("token")
    localStorage.removeItem("role")
  },
}

export const authService = {
  login(email: string, password: string) {
    return apiRequest<LoginResponse>("/authentications/sessions", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },
  me() {
    return apiRequest<LoginResponse["user"]>("/authentications/users/me")
  },
}
