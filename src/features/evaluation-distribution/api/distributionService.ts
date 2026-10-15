import { apiRequest } from "@/services/apiClient"
import { toKnowledgeArea } from "@/features/consultants/api/consultantService"
import type {
  Assignment,
  AssignmentStatus,
  Candidate,
  DistributableProject,
  DistributionParams,
  DraftAssignment,
} from "../types/evaluationDistribution"

type AreaResponse = Parameters<typeof toKnowledgeArea>[0]

type PanoramaResponse = {
  projetos: {
    id: number
    codigo: string
    titulo: string
    situacao: string
    coordenador: string | null
    unidade: string | null
    area_conhecimento: AreaResponse | null
  }[]
  atribuicoes: {
    id: number
    projeto_id: number
    consultor_id: number | null
    avaliador_id: number
    avaliador_nome: string
    status: AssignmentStatus
    motivo_recusa: string | null
    tem_notas: boolean
    criado_em: string
    respondido_em: string | null
  }[]
}

type PreviewResponse = {
  status: string
  atribuicoes: {
    projeto_id: number
    consultor_id: number | null
    avaliador_id: number
    score: number
    existente: boolean
    atribuicao_id: number | null
    status: AssignmentStatus | null
    tem_notas: boolean
  }[]
}

type CandidateResponse = {
  consultor_id: number
  nome: string
  score: number
  carga: number
  atribuido: boolean
}

export type ConfirmResult = {
  criadas: number
  removidas: number
  mantidas: number
}

const ENDPOINT = "/distribuicao"

export const distributionService = {
  async panorama(editalId: number) {
    const data = await apiRequest<PanoramaResponse>(`${ENDPOINT}/${editalId}`)

    const projects: DistributableProject[] = data.projetos.map((p) => ({
      id: p.id,
      code: p.codigo,
      title: p.titulo,
      coordinator: p.coordenador,
      unit: p.unidade,
      area: p.area_conhecimento ? toKnowledgeArea(p.area_conhecimento) : null,
      situacao: p.situacao,
    }))

    const assignments: Assignment[] = data.atribuicoes.map((a) => ({
      id: a.id,
      projectId: a.projeto_id,
      consultantId: a.consultor_id,
      evaluatorName: a.avaliador_nome,
      status: a.status,
      reason: a.motivo_recusa,
      hasGrades: a.tem_notas,
      sentAt: a.criado_em,
      answeredAt: a.respondido_em,
    }))

    return { projects, assignments }
  },

  async preview(editalId: number, params: DistributionParams) {
    const data = await apiRequest<PreviewResponse>(`${ENDPOINT}/${editalId}/preview`, {
      method: "POST",
      body: JSON.stringify({
        minimoProjetosPorAvaliador: params.minPerConsultant,
        maximoProjetosPorAvaliador: params.maxPerConsultant,
        avaliadoresPorProjeto: params.perProject,
      }),
    })

    // Atribuições antigas sem consultor não podem ser reenviadas no confirm
    return data.atribuicoes
      .filter((a) => a.consultor_id !== null)
      .map(
        (a): DraftAssignment => ({
          projectId: a.projeto_id,
          consultantId: a.consultor_id!,
          score: a.score,
          origin: a.existente ? "EXISTENTE" : "AUTO",
          status: a.status,
          hasGrades: a.tem_notas,
        }),
      )
  },

  confirm(editalId: number, assignments: DraftAssignment[]) {
    return apiRequest<ConfirmResult>(`${ENDPOINT}/${editalId}/confirm`, {
      method: "POST",
      body: JSON.stringify({
        atribuicoes: assignments.map((a) => ({
          projeto_id: a.projectId,
          consultor_id: a.consultantId,
        })),
      }),
    })
  },

  async candidates(editalId: number, projectId: number) {
    const rows = await apiRequest<CandidateResponse[]>(
      `${ENDPOINT}/${editalId}/candidatos/${projectId}`,
    )
    return rows.map(
      (c): Candidate => ({ consultantId: c.consultor_id, name: c.nome, score: c.score }),
    )
  },
}
