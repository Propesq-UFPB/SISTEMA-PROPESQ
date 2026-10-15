import { normalizeText } from "@/features/consultants/utils/consultantHelpers"
import type { EvaluationInvitation, InvitationStage } from "../types/invitation"

export const STAGE_LABEL: Record<InvitationStage, string> = {
  CONVITE: "Convite pendente",
  AGUARDANDO: "Aguardando avaliação",
  REALIZADA: "Realizada",
  RECUSADA: "Recusada",
}

export function invitationStage(invitation: Pick<EvaluationInvitation, "status" | "hasGrades">): InvitationStage {
  if (invitation.status === "RECUSADO") return "RECUSADA"
  if (invitation.status === "PENDENTE") return "CONVITE"
  return invitation.hasGrades ? "REALIZADA" : "AGUARDANDO"
}

export function invitationAreaLabel(invitation: EvaluationInvitation) {
  const area = invitation.project.area
  if (!area) return "Área não informada"
  return [area.area || area.grandeArea, area.subArea].filter(Boolean).join(" › ")
}

export type InvitationFilters = {
  search: string
  editalId: number | "ALL"
  stage: InvitationStage | "ALL"
  year: number | "ALL"
}

export const EMPTY_FILTERS: InvitationFilters = {
  search: "",
  editalId: "ALL",
  stage: "ALL",
  year: "ALL",
}

export function filterInvitations(invitations: EvaluationInvitation[], filters: InvitationFilters) {
  const q = normalizeText(filters.search)

  return invitations.filter((invitation) => {
    const text = `${invitation.project.code} ${invitation.project.title} ${invitationAreaLabel(invitation)} ${invitation.edital?.label ?? ""}`
    return (
      (!q || normalizeText(text).includes(q)) &&
      (filters.editalId === "ALL" || invitation.edital?.id === filters.editalId) &&
      (filters.stage === "ALL" || invitationStage(invitation) === filters.stage) &&
      (filters.year === "ALL" || invitation.edital?.year === filters.year)
    )
  })
}

export function invitationSummary(invitations: EvaluationInvitation[]) {
  const count = (stage: InvitationStage) =>
    invitations.filter((invitation) => invitationStage(invitation) === stage).length

  return {
    total: invitations.length,
    convites: count("CONVITE"),
    aguardando: count("AGUARDANDO"),
    realizadas: count("REALIZADA"),
    recusadas: count("RECUSADA"),
  }
}

// Opções dos filtros a partir dos próprios convites
export function editalOptions(invitations: EvaluationInvitation[]) {
  const map = new Map<number, string>()
  for (const { edital } of invitations) if (edital) map.set(edital.id, edital.label)
  return [...map.entries()].map(([id, label]) => ({ id, label }))
}

export function yearOptions(invitations: EvaluationInvitation[]) {
  return [...new Set(invitations.flatMap((i) => (i.edital ? [i.edital.year] : [])))].sort(
    (a, b) => b - a,
  )
}
