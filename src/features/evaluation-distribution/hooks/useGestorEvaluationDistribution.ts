import { useCallback, useEffect, useMemo, useState } from "react"
import { useEditalSelection } from "@/features/editais"
import { useEditalConsultants } from "@/features/consultants/hooks/useEditalConsultants"
import { apiErrorMessage } from "@/features/consultants/utils/consultantHelpers"
import { distributionService, type ConfirmResult } from "../api/distributionService"
import type {
  Assignment,
  Candidate,
  DistributableProject,
  DistributionDraft,
  DistributionParams,
} from "../types/evaluationDistribution"
import {
  areaSummary as buildAreaSummary,
  assignmentSummary as buildAssignmentSummary,
  candidateRows,
  computeIssues,
  confirmImpact,
  countBy,
  DEFAULT_PARAMS,
  draftFromAssignments,
  isActive,
  toggleDraftAssignment,
} from "../utils/evaluationDistributionHelpers"

export function useGestorEvaluationDistribution() {
  const {
    editais,
    loading: editaisLoading,
    error: editaisError,
    selectedEditalId,
    selectedEdital,
    selectEdital,
  } = useEditalSelection()

  const [projects, setProjects] = useState<DistributableProject[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<"preview" | "confirm" | null>(null)
  const [lastResult, setLastResult] = useState<ConfirmResult | null>(null)

  const [params, setParams] = useState<DistributionParams>(DEFAULT_PARAMS)
  const [draft, setDraft] = useState<DistributionDraft | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [candidatesLoading, setCandidatesLoading] = useState(false)

  const editalId = selectedEdital?.id ?? null
  const editalConsultants = useEditalConsultants(editalId)

  const loadPanorama = useCallback(async () => {
    if (editalId === null) return
    setLoading(true)
    setError(null)
    try {
      const data = await distributionService.panorama(editalId)
      setProjects(data.projects)
      setAssignments(data.assignments)
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar a distribuição do edital."))
    } finally {
      setLoading(false)
    }
  }, [editalId])

  useEffect(() => {
    setProjects([])
    setAssignments([])
    void loadPanorama()
  }, [loadPanorama])

  // Candidatos do projeto em ajuste (afinidade calculada no backend)
  useEffect(() => {
    if (editalId === null || selectedProjectId === null || !draft) {
      setCandidates([])
      return
    }

    let cancelled = false
    setCandidatesLoading(true)
    distributionService
      .candidates(editalId, selectedProjectId)
      .then((rows) => {
        if (!cancelled) setCandidates(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, "Não foi possível carregar os candidatos."))
      })
      .finally(() => {
        if (!cancelled) setCandidatesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [editalId, selectedProjectId, Boolean(draft)]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectEdital(id: string) {
    selectEdital(id)
    setDraft(null)
    setSelectedProjectId(null)
    setLastResult(null)
  }

  const activeCountByProject = useMemo(
    () => countBy(assignments.filter(isActive), (a) => a.projectId),
    [assignments],
  )

  const isCovered = (projectId: number) =>
    (activeCountByProject.get(projectId) ?? 0) >= params.perProject

  const pendingProjects = projects.filter((p) => !activeCountByProject.get(p.id))
  const distributedProjects = projects.filter((p) => isCovered(p.id))

  const issues = useMemo(
    () => (draft ? computeIssues(projects, draft.assignments, params.perProject) : []),
    [draft, projects, params.perProject],
  )

  const issueProjects = issues.flatMap((issue) => {
    const project = projects.find((p) => p.id === issue.projectId)
    return project ? [{ issue, project }] : []
  })

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null

  const candidatesForSelected = useMemo(
    () =>
      draft && selectedProjectId !== null
        ? candidateRows(candidates, draft.assignments, selectedProjectId, params.maxPerConsultant)
        : [],
    [candidates, draft, selectedProjectId, params.maxPerConsultant],
  )

  const impact = useMemo(
    () => (draft ? confirmImpact(assignments, draft.assignments) : null),
    [assignments, draft],
  )

  const summary = buildAssignmentSummary(assignments)
  const areaSummary = useMemo(
    () => buildAreaSummary(projects, assignments, params.perProject),
    [projects, assignments, params.perProject],
  )

  const recentDeclinedAssignments = assignments
    .filter((a) => a.status === "RECUSADO")
    .sort((a, b) => (b.answeredAt ?? "").localeCompare(a.answeredAt ?? ""))
    .slice(0, 5)

  async function handleGeneratePreview() {
    if (editalId === null) return
    setBusy("preview")
    setError(null)
    setLastResult(null)
    try {
      const preview = await distributionService.preview(editalId, params)
      setDraft({ mode: "PREVIA", assignments: preview })
      const firstIssue = computeIssues(projects, preview, params.perProject)[0]
      setSelectedProjectId(firstIssue?.projectId ?? null)
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível gerar a prévia."))
    } finally {
      setBusy(null)
    }
  }

  function handleAdjustCurrent(projectId: number | null = null) {
    setLastResult(null)
    setDraft({ mode: "AJUSTE", assignments: draftFromAssignments(assignments) })
    setSelectedProjectId(projectId)
  }

  function handleClearDraft() {
    setDraft(null)
    setSelectedProjectId(null)
  }

  function handleToggleCandidate(candidate: Candidate) {
    if (!draft || selectedProjectId === null) return
    setDraft({
      ...draft,
      assignments: toggleDraftAssignment(draft.assignments, selectedProjectId, candidate),
    })
  }

  async function handleConfirm() {
    if (editalId === null || !draft) return
    setBusy("confirm")
    setError(null)
    try {
      const result = await distributionService.confirm(editalId, draft.assignments)
      setLastResult(result)
      setDraft(null)
      setSelectedProjectId(null)
      await Promise.all([loadPanorama(), editalConsultants.reload()])
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível confirmar a distribuição."))
    } finally {
      setBusy(null)
    }
  }

  // Recusa: abre o ajuste da distribuição atual já no projeto que perdeu o consultor
  function handleRedistributeDeclined(assignmentId: number) {
    const declined = assignments.find((a) => a.id === assignmentId)
    if (!declined) return
    if (draft) setSelectedProjectId(declined.projectId)
    else handleAdjustCurrent(declined.projectId)
  }

  return {
    editais,
    editaisLoading,
    editaisError,
    selectedEditalId,
    selectedEdital,
    handleSelectEdital,
    editalConsultants,
    projects,
    assignments,
    loading,
    error,
    busy,
    lastResult,
    params,
    setParams,
    draft,
    issues,
    issueProjects,
    impact,
    pendingProjects,
    distributedProjects,
    selectedProject,
    setSelectedProjectId,
    candidatesForSelected,
    candidatesLoading,
    summary,
    areaSummary,
    recentDeclinedAssignments,
    isCovered,
    handleGeneratePreview,
    handleAdjustCurrent,
    handleClearDraft,
    handleToggleCandidate,
    handleConfirm,
    handleRedistributeDeclined,
  }
}
