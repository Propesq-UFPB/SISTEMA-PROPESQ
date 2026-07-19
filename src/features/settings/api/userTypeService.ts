import { apiRequest, buildQuery } from "@/services/apiClient"

export type UserTypeAudience =
  | "DOCENTE"
  | "TECNICO_ADMINISTRATIVO"
  | "POS_DOUTORANDO"
  | "DISCENTE_UFPB_MEDIO"
  | "DISCENTE_UFPB_SUPERIOR"
  | "DISCENTE_EXTERNO_SEM_SIGAA"

export type UserTypeApi = {
  id: number
  nome: string
  descricao: string | null
  publicos: UserTypeAudience[]
  ativo: boolean
}

export type UserTypeLookup = {
  id: number
  name: string
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

const ENDPOINT = "/user-types"

export const userTypeService = {
  list(limit = 100, offset = 0) {
    return apiRequest<Paginated<UserTypeApi>>(
      `${ENDPOINT}${buildQuery({ limit, offset })}`,
    )
  },
  lookup() {
    return apiRequest<UserTypeLookup[]>(`${ENDPOINT}/lookup`)
  },
  create(payload: {
    nome: string
    descricao?: string
    publicos: UserTypeAudience[]
  }) {
    return apiRequest<UserTypeApi>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(
    id: number,
    payload: {
      nome?: string
      descricao?: string
      publicos?: UserTypeAudience[]
      ativo?: boolean
    },
  ) {
    return apiRequest<UserTypeApi>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
