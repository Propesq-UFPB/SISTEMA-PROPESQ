import type {
  Assignment,
  AssignmentStatus,
  Candidate,
  CandidateRow,
  DistributableProject,
  DistributionIssue,
  DraftAssignment,
} from "../types/evaluationDistribution"

export const DEFAULT_PARAMS = {
  minPerConsultant: 1,
  maxPerConsultant: 10,
  perProject: 2,
}

export function isActive(assignment: Pick<Assignment, "status">) {
  return assignment.status !== "RECUSADO"
}

export function assignmentStatusLabel(status: AssignmentStatus) {
  if (status === "ACEITO") return "Aceito"
  if (status === "RECUSADO") return "Recusado"
  return "Pendente"
}

// Rótulo do score calculado no backend (subárea 160, área 60, grande área 10; adicionais valem metade)
export function affinityLabel(score: number) {
  if (score >= 160) return "Mesma subárea"
  if (score >= 80) return "Subárea (área adicional)"
  if (score >= 60) return "Mesma área"
  if (score >= 30) return "Área (área adicional)"
  if (score >= 10) return "Mesma grande área"
  if (score > 0) return "Grande área (área adicional)"
  return "Sem afinidade"
}

export function countBy<T>(items: T[], key: (item: T) => number) {
  const map = new Map<number, number>()
  for (const item of items) map.set(key(item), (map.get(key(item)) ?? 0) + 1)
  return map
}

// Convites pendentes/aceitos gravados viram o ponto de partida de um ajuste manual
export function draftFromAssignments(assignments: Assignment[]): DraftAssignment[] {
  return assignments
    .filter((a) => isActive(a) && a.consultantId !== null)
    .map((a) => ({
      projectId: a.projectId,
      consultantId: a.consultantId!,
      score: null,
      origin: "EXISTENTE",
      status: a.status,
      hasGrades: a.hasGrades,
    }))
}

export function computeIssues(
  projects: DistributableProject[],
  draft: DraftAssignment[],
  perProject: number,
): DistributionIssue[] {
  const perProjectCount = countBy(draft, (a) => a.projectId)
  return projects
    .map((p) => ({ projectId: p.id, missing: perProject - (perProjectCount.get(p.id) ?? 0) }))
    .filter((issue) => issue.missing > 0)
}

export function toggleDraftAssignment(
  draft: DraftAssignment[],
  projectId: number,
  candidate: Candidate,
): DraftAssignment[] {
  const existing = draft.find(
    (a) => a.projectId === projectId && a.consultantId === candidate.consultantId,
  )

  if (existing) {
    if (existing.hasGrades) return draft
    return draft.filter((a) => a !== existing)
  }

  return [
    ...draft,
    {
      projectId,
      consultantId: candidate.consultantId,
      score: candidate.score,
      origin: "MANUAL",
      status: null,
      hasGrades: false,
    },
  ]
}

export function candidateRows(
  candidates: Candidate[],
  draft: DraftAssignment[],
  projectId: number,
  maxPerConsultant: number,
): CandidateRow[] {
  const loads = countBy(draft, (a) => a.consultantId)

  return candidates
    .map((candidate) => {
      const entry = draft.find(
        (a) => a.projectId === projectId && a.consultantId === candidate.consultantId,
      )
      const draftLoad = loads.get(candidate.consultantId) ?? 0
      return {
        ...candidate,
        draftLoad,
        inDraft: Boolean(entry),
        locked: Boolean(entry?.hasGrades),
        overMax: draftLoad >= maxPerConsultant,
      }
    })
    .sort(
      (a, b) =>
        Number(b.inDraft) - Number(a.inDraft) || b.score - a.score || a.draftLoad - b.draftLoad,
    )
}

// O que a confirmação vai fazer em relação ao que está gravado
export function confirmImpact(assignments: Assignment[], draft: DraftAssignment[]) {
  const key = (projectId: number, consultantId: number | null) => `${projectId}:${consultantId}`
  const active = assignments.filter(isActive)
  const activeKeys = new Set(active.map((a) => key(a.projectId, a.consultantId)))
  const draftKeys = new Set(draft.map((a) => key(a.projectId, a.consultantId)))

  return {
    newInvites: draft.filter((a) => !activeKeys.has(key(a.projectId, a.consultantId))).length,
    removed: active.filter((a) => !a.hasGrades && !draftKeys.has(key(a.projectId, a.consultantId)))
      .length,
  }
}

export function assignmentSummary(assignments: Assignment[]) {
  return {
    total: assignments.length,
    pendentes: assignments.filter((a) => a.status === "PENDENTE").length,
    aceitos: assignments.filter((a) => a.status === "ACEITO").length,
    recusados: assignments.filter((a) => a.status === "RECUSADO").length,
  }
}

export function projectAreaLabel(project: DistributableProject) {
  if (!project.area) return "Sem área informada"
  return [project.area.grandeArea, project.area.area].filter(Boolean).join(" › ")
}

// Pendente: sem convite ativo; distribuído: atingiu o número de consultores; incompleto: entre os dois
export function areaSummary(
  projects: DistributableProject[],
  assignments: Assignment[],
  perProject: number,
) {
  const activeCount = countBy(assignments.filter(isActive), (a) => a.projectId)
  const map = new Map<
    string,
    { area: string; total: number; pendentes: number; distribuidos: number; incompletos: number }
  >()

  for (const project of projects) {
    const area = projectAreaLabel(project)
    const current = map.get(area) ?? {
      area,
      total: 0,
      pendentes: 0,
      distribuidos: 0,
      incompletos: 0,
    }
    const count = activeCount.get(project.id) ?? 0

    current.total += 1
    if (count === 0) current.pendentes += 1
    else if (count >= perProject) current.distribuidos += 1
    else current.incompletos += 1

    map.set(area, current)
  }

  return [...map.values()].sort(
    (a, b) => b.pendentes + b.incompletos - (a.pendentes + a.incompletos) || b.total - a.total,
  )
}

export function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("pt-BR")
}
