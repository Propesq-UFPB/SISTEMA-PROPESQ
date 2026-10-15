import type { KnowledgeArea } from "@/features/consultants/types/consultant"

export type AssignmentStatus = "PENDENTE" | "ACEITO" | "RECUSADO"

export type DistributableProject = {
  id: number
  code: string
  title: string
  coordinator: string | null
  unit: string | null
  area: KnowledgeArea | null
  situacao: string
}

// Convite de avaliação já gravado
export type Assignment = {
  id: number
  projectId: number
  consultantId: number | null
  evaluatorName: string
  status: AssignmentStatus
  reason: string | null
  hasGrades: boolean
  sentAt: string
  answeredAt: string | null
}

export type ProjectAssignment = Assignment & {
  evaluatorEmail: string
}

export type DistributionParams = {
  minPerConsultant: number
  maxPerConsultant: number
  perProject: number
}

// EXISTENTE: convite pendente/aceito mantido; AUTO: sugerido pelo otimizador; MANUAL: incluído pelo gestor
export type DraftOrigin = "EXISTENTE" | "AUTO" | "MANUAL"

export type DraftAssignment = {
  projectId: number
  consultantId: number
  // Nulo em convites gravados carregados para ajuste (a afinidade é calculada no backend)
  score: number | null
  origin: DraftOrigin
  status: AssignmentStatus | null
  hasGrades: boolean
}

// PREVIA: gerada pelo otimizador; AJUSTE: edição da distribuição atual
export type DistributionDraft = {
  mode: "PREVIA" | "AJUSTE"
  assignments: DraftAssignment[]
}

export type DistributionIssue = {
  projectId: number
  missing: number
}

export type Candidate = {
  consultantId: number
  name: string
  score: number
}

export type CandidateRow = Candidate & {
  draftLoad: number
  inDraft: boolean
  locked: boolean
  overMax: boolean
}
