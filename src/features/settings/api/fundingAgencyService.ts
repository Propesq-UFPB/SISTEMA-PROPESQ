import { apiRequest, buildQuery } from "@/services/apiClient"

export type FundingAgency = {
  id: number
  nome: string
  criado_em: string
  atualizado_em: string
}

export type FundingAgencyLookup = {
  id: number
  name: string
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

const ENDPOINT = "/funding-agencies"

export const fundingAgencyService = {
  list(limit = 100, offset = 0) {
    return apiRequest<Paginated<FundingAgency>>(
      `${ENDPOINT}${buildQuery({ limit, offset })}`,
    )
  },
  lookup() {
    return apiRequest<FundingAgencyLookup[]>(`${ENDPOINT}/lookup`)
  },
  create(payload: { nome: string }) {
    return apiRequest<FundingAgency>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(id: number, payload: { nome: string }) {
    return apiRequest<FundingAgency>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
