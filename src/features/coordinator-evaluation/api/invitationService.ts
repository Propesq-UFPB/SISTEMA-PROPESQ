import { apiRequest } from "@/services/apiClient"
import { toKnowledgeArea } from "@/features/consultants/api/consultantService"
import type { AssignmentStatus } from "@/features/evaluation-distribution/types/evaluationDistribution"
import type { EvaluationInvitation } from "../types/invitation"

type AreaResponse = Parameters<typeof toKnowledgeArea>[0]

type MinhaAtribuicaoResponse = {
  id: number
  status: AssignmentStatus
  motivo_recusa: string | null
  tem_notas: boolean
  criado_em: string
  respondido_em: string | null
  projeto: { id: number; codigo: string; titulo: string; area_conhecimento: AreaResponse | null }
  edital: { id: number; codigo: string | null; descricao: string; ano: number } | null
}

const ENDPOINT = "/distribuicao/atribuicoes"

function toInvitation(row: MinhaAtribuicaoResponse): EvaluationInvitation {
  return {
    id: row.id,
    status: row.status,
    reason: row.motivo_recusa,
    hasGrades: row.tem_notas,
    sentAt: row.criado_em,
    answeredAt: row.respondido_em,
    project: {
      id: row.projeto.id,
      code: row.projeto.codigo,
      title: row.projeto.titulo,
      area: row.projeto.area_conhecimento ? toKnowledgeArea(row.projeto.area_conhecimento) : null,
    },
    edital: row.edital
      ? {
          id: row.edital.id,
          label: row.edital.codigo ?? row.edital.descricao,
          year: row.edital.ano,
        }
      : null,
  }
}

export const invitationService = {
  async mine() {
    const rows = await apiRequest<MinhaAtribuicaoResponse[]>(`${ENDPOINT}/minhas`)
    return rows.map(toInvitation)
  },
  accept(id: number) {
    return apiRequest<unknown>(`${ENDPOINT}/${id}/aceite`, { method: "POST" })
  },
  decline(id: number, motivo: string) {
    return apiRequest<unknown>(`${ENDPOINT}/${id}/recusa`, {
      method: "POST",
      body: JSON.stringify({ motivo }),
    })
  },
}
