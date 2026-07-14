import { apiRequest, buildQuery } from "@/services/apiClient"

export type ScholarshipOrgaoSummary = {
  id: number
  nome: string
}

export type Scholarship = {
  id: number
  descricao: string
  categoria: string
  orgao_id: number | null
  valor: number | null
  permite_acumulo: boolean
  orgao: ScholarshipOrgaoSummary | null
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

export type ScholarshipLookup = {
  id: number
  descricao: string
}

export type CreateScholarshipFromSettingsPayload = {
  descricao: string
  orgao_id: number
  valor?: number | null
  permite_acumulo?: boolean
}

export type UpdateScholarshipSettingsPayload = {
  descricao?: string
  orgao_id?: number | null
  valor?: number | null
  permite_acumulo?: boolean
}

const ENDPOINT = "/scholarships"

export const scholarshipSettingsService = {
  list(limit = 100, offset = 0) {
    return apiRequest<Paginated<Scholarship>>(
      `${ENDPOINT}${buildQuery({ limit, offset })}`,
    )
  },
  lookup() {
    return apiRequest<ScholarshipLookup[]>(`${ENDPOINT}/lookup`)
  },
  createFromSettings(payload: CreateScholarshipFromSettingsPayload) {
    return apiRequest<Scholarship>(`${ENDPOINT}/from-settings`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(id: number, payload: UpdateScholarshipSettingsPayload) {
    return apiRequest<Scholarship>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
