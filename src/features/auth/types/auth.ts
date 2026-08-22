export type BackendRole = "DISCENTE" | "COORDENADOR" | "GESTOR" | "ADMIN" | "ALUNO" | "ADMINISTRADOR" | string
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

export function mapBackendRole(role?: BackendRole | AppRole): AppRole {
  const normalizedRole = role?.toString().trim().toUpperCase()

  switch (normalizedRole) {
    case "ALUNO":
    case "DISCENTE":
      return "DISCENTE"
    case "COORDENADOR":
      return "COORDENADOR"
    case "GESTOR":
    case "ADMIN":
    case "ADMINISTRADOR":
      return "GESTOR"
    default:
      return "DISCENTE"
  }
}
