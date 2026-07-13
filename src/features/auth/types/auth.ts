export type BackendRole = "DISCENTE" | "COORDENADOR" | "GESTOR" | "ADMIN" | string
export type AppRole = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"

export type AuthUser = {
  id: number
  email: string
  name: string
  role: AppRole
  backendRole: BackendRole
}

export type LoginResponse = {
  accessToken: string
  user: {
    id: number
    email: string
    nome: string
    funcao: BackendRole
  }
}

export function mapBackendRole(role: BackendRole): AppRole {
  if (role === "COORDENADOR") return "COORDENADOR"
  if (role === "DISCENTE") return "DISCENTE"
  return "ADMINISTRADOR"
}
