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
  tipo_bolsa: string
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
  modalidade: string
  status: string
  tipo_bolsa: string
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
