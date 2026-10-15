import type { KnowledgeArea } from "@/features/consultants/types/consultant"
import type { AssignmentStatus } from "@/features/evaluation-distribution/types/evaluationDistribution"

// Convite de avaliação recebido pelo usuário logado
export type EvaluationInvitation = {
  id: number
  status: AssignmentStatus
  reason: string | null
  hasGrades: boolean
  sentAt: string
  answeredAt: string | null
  project: { id: number; code: string; title: string; area: KnowledgeArea | null }
  edital: { id: number; label: string; year: number } | null
}

// Situação exibida ao avaliador
export type InvitationStage = "CONVITE" | "AGUARDANDO" | "REALIZADA" | "RECUSADA"
