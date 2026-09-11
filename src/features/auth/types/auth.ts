export type BackendRole = "DISCENTE" | "COORDENADOR" | "GESTOR" | "ALUNO" | string
export type AppRole = "DISCENTE" | "COORDENADOR" | "GESTOR"

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

export function isLegacyAdminRole(role?: string): boolean {
  const normalized = role?.toString().trim().toUpperCase()
  return normalized === "ADMIN" || normalized === "ADMINISTRADOR"
}

export function mapBackendRole(role?: BackendRole | AppRole): AppRole {
  const normalizedRole = role?.toString().trim().toUpperCase()

  switch (normalizedRole) {
    case "ALUNO":
    case "DISCENTE":
      return "DISCENTE"
    case "COORDENADOR":
      return "COORDENADOR"
    case "GESTOR":
      return "GESTOR"
    default:
      return "DISCENTE"
  }
}
