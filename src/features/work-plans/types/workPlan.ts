import type { PaginatedResponse } from "@/features/projects/types/project"

export type WorkPlanMonth = {
  id?: number
  data: string
}

export type WorkPlanActivity = {
  id?: number
  descricao: string
  meses: WorkPlanMonth[]
}

export type WorkPlanBody = {
  id?: number
  titulo: string
  introducao: string
  objetivos: string
  metodologia: string
  referencias: string
}

export type WorkPlanProject = {
  id: number
  codigo?: string
  titulo?: string
  title?: string
  situacao?: string
  edital?: string | null
  vigencia?: string
}

export type WorkPlan = {
  id: number
  pesquisa_id: number
  modalidade: string
  status: string
  bolsa_id: number | null
  bolsa?: ScholarshipLookup | null
  cronograma_id: number
  direcionamento_plano: string
  corpo_id?: number | null
  corpo_plano_trabalho?: WorkPlanBody | null
  atividades: WorkPlanActivity[]
  projeto_pesquisa?: WorkPlanProject | null
  discente?: unknown | null
  usuario?: unknown | null
}

export type CreateWorkPlanPayload = {
  pesquisa_id: number
  status: string
  bolsa_id: number
  cronograma_id: number
  direcionamento_plano: string
  corpo_plano_trabalho: WorkPlanBody
  atividades: Array<{
    descricao: string
    meses: Array<{ data: string }>
  }>
}

export type UpdateWorkPlanPayload = Partial<Omit<CreateWorkPlanPayload, "corpo_plano_trabalho" | "atividades">> & {
  corpo_plano_trabalho?: Partial<WorkPlanBody>
  atividades?: WorkPlanActivity[]
}

export type WorkPlanListParams = {
  limit?: number
  offset?: number
}

export type WorkPlanPaginatedResponse = PaginatedResponse<WorkPlan>


export type AvailableWorkPlan = Pick<WorkPlan, "id" | "pesquisa_id" | "modalidade" | "bolsa_id" | "direcionamento_plano"> & {
  corpo_plano_trabalho: { titulo: string } | null
  projeto_pesquisa: {
    id: number
    titulo: string
    edital_rel: { id: number; descricao: string; status: "PUBLICADO" }
  }
}

export type WorkPlanInterest = {
  id: number
  plano_trabalho_id: number
  discente_id: number
  status: string
  criado_em: string
}


export type WorkPlanCreationProject = {
  id: number
  codigo: string | null
  titulo: string
  situacao: string
  data_inicio: string | null
  data_fim: string | null
  edital_rel: { id: number; descricao: string; limite_planos_orientador: number }
}

export type ScholarshipLookup = { id: number; descricao: string }
