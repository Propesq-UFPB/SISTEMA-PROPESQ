import { apiRequest, buildQuery } from "@/services/apiClient"

export type EvaluationCriterion = {
  id: number
  nome: string
  descricao: string | null
  peso: number
  nota_maxima: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
  desativado_em: string | null
}

export type EvaluationCriterionLookup = {
  id: number
  name: string
}

export type EvaluationCriterionPage = {
  total: number
  limit: number
  offset: number
  results: EvaluationCriterion[]
}

export type CreateEvaluationCriterionPayload = {
  nome: string
  descricao?: string
  peso: number
  nota_maxima: number
  ativo?: boolean
}

export type UpdateEvaluationCriterionPayload = {
  nome?: string
  descricao?: string
  peso?: number
  nota_maxima?: number
  ativo?: boolean
}

const ENDPOINT = "/evaluation-criteria"

export const evaluationCriteriaService = {
  list(limit = 10, offset = 0, ativo?: boolean) {
    return apiRequest<EvaluationCriterionPage>(
      `${ENDPOINT}${buildQuery({ limit, offset, ativo })}`,
    )
  },
  lookup() {
    return apiRequest<EvaluationCriterionLookup[]>(`${ENDPOINT}/lookup`)
  },
  create(payload: CreateEvaluationCriterionPayload) {
    return apiRequest<EvaluationCriterion>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(id: number, payload: UpdateEvaluationCriterionPayload) {
    return apiRequest<EvaluationCriterion>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
