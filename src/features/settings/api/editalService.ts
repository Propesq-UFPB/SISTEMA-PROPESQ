import { apiRequest, buildQuery } from "@/services/apiClient"
import type { EditalListItem } from "@/features/editais"

export type { EditalListItem } from "@/features/editais"

export type EditalDetail = {
  id: number
  codigo?: string | null
  descricao: string
  unidade_ids: number[]
}

type Paginated<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

const ENDPOINT = "/editais"

export const editalService = {
  list(limit = 100, offset = 0) {
    return apiRequest<Paginated<EditalListItem>>(
      `${ENDPOINT}${buildQuery({ limit, offset })}`,
    )
  },
  getOne(id: number) {
    return apiRequest<EditalDetail>(`${ENDPOINT}/${id}`)
  },
  setAcademicUnits(id: number, unidade_ids: number[]) {
    return apiRequest<void>(`${ENDPOINT}/${id}/academic-units`, {
      method: "PUT",
      body: JSON.stringify({ unidade_ids }),
    })
  },
}
