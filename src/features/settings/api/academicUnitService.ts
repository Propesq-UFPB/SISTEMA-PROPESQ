import { apiRequest, buildQuery } from "@/services/apiClient"

export type AcademicUnit = {
  id: number
  sigla: string
  nome: string
  ativo: boolean
}

export type AcademicUnitLookup = {
  id: number
  name: string
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

const ENDPOINT = "/academic-units"

export const academicUnitService = {
  list(limit = 100, offset = 0) {
    return apiRequest<Paginated<AcademicUnit>>(
      `${ENDPOINT}${buildQuery({ limit, offset })}`,
    )
  },
  lookup() {
    return apiRequest<AcademicUnitLookup[]>(`${ENDPOINT}/lookup`)
  },
  create(payload: { sigla: string; nome: string }) {
    return apiRequest<AcademicUnit>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(
    id: number,
    payload: { sigla?: string; nome?: string; ativo?: boolean },
  ) {
    return apiRequest<AcademicUnit>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
