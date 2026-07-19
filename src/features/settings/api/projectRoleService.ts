import { apiRequest, buildQuery } from "@/services/apiClient"

export type ProjectRoleCategory =
  | "ACADEMICO"
  | "BOLSA"
  | "EXTERNO"
  | "GESTAO"
  | "OUTRO"

export type ProjectRole = {
  id: number
  nome: string
  descricao: string | null
  categoria: ProjectRoleCategory
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type ProjectRoleLookup = {
  id: number
  name: string
}

export type CreateProjectRolePayload = {
  nome: string
  categoria: ProjectRoleCategory
  descricao?: string
  ativo?: boolean
}

export type UpdateProjectRolePayload = {
  nome?: string
  categoria?: ProjectRoleCategory
  descricao?: string | null
  ativo?: boolean
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

const ENDPOINT = "/project-roles"

export const projectRoleService = {
  list(limit = 100, offset = 0, ativo?: boolean) {
    return apiRequest<Paginated<ProjectRole>>(
      `${ENDPOINT}${buildQuery({ limit, offset, ativo })}`,
    )
  },
  lookup() {
    return apiRequest<ProjectRoleLookup[]>(`${ENDPOINT}/lookup`)
  },
  create(payload: CreateProjectRolePayload) {
    return apiRequest<ProjectRole>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(id: number, payload: UpdateProjectRolePayload) {
    return apiRequest<ProjectRole>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
