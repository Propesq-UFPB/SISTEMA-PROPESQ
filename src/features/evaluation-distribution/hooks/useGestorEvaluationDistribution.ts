import { useMemo, useState } from "react"
import type {
  Assignment,
  DistributableProject,
  DistributionIssue,
  DistributionPreview,
  Evaluator,
} from "../types/evaluationDistribution"
import {
  affinityScore,
  assignmentsMock,
  buildSmartDistribution,
  canEvaluateWithProjectedLoad,
  evaluatorIdsForProject,
  evaluatorsMock,
  getProjectActiveCount,
  getEvaluatorProjectedLoad,
  hasConflict,
  MIN_EVALUATORS_PER_PROJECT,
  projectsMock,
} from "../utils/evaluationDistributionHelpers"

export function useGestorEvaluationDistribution() {
  const [projects, setProjects] = useState<DistributableProject[]>(projectsMock)
  const [evaluators, setEvaluators] = useState<Evaluator[]>(evaluatorsMock)
  const [assignments, setAssignments] = useState<Assignment[]>(assignmentsMock)
  const [preview, setPreview] = useState<DistributionPreview | null>(null)
  const [selectedIssueProjectId, setSelectedIssueProjectId] =
    useState<number | null>(null)

  const pendingProjects = projects.filter(
    (project) => project.status !== "DISTRIBUIDO",
  )

  const distributedProjects = projects.filter(
    (project) => project.status === "DISTRIBUIDO",
  )

  const issueProjects = useMemo(() => {
    if (!preview) return []

    return preview.issues.flatMap((issue) => {
      const project = projects.find((item) => item.id === issue.projectId)
      return project ? [{ issue, project }] : []
    })
  }, [preview, projects])

  const selectedIssueProject =
    projects.find((project) => project.id === selectedIssueProjectId) ??
    issueProjects[0]?.project ??
    null

  const totalDraftAssignments = preview?.draftAssignments.length ?? 0

  const projectsCompletedInPreview = useMemo(() => {
    if (!preview) return 0

    return pendingProjects.filter((project) => {
      const activeCount = getProjectActiveCount(
        project.id,
        assignments,
        preview.draftAssignments,
      )

      return activeCount >= MIN_EVALUATORS_PER_PROJECT
    }).length
  }, [preview, pendingProjects, assignments])

  const assignmentSummary = {
    total: assignments.length,
    pendentes: assignments.filter((item) => item.status === "PENDENTE").length,
    aceitos: assignments.filter((item) => item.status === "ACEITO").length,
    recusados: assignments.filter((item) => item.status === "RECUSADO").length,
  }

  const areaSummary = useMemo(() => {
    const map = new Map<
      string,
      {
        area: string
        total: number
        pendentes: number
        distribuidos: number
        incompletos: number
      }
    >()

    projects.forEach((project) => {
      const current = map.get(project.area) ?? {
        area: project.area,
        total: 0,
        pendentes: 0,
        distribuidos: 0,
        incompletos: 0,
      }

      current.total += 1

      if (project.status === "DISTRIBUIDO") current.distribuidos += 1
      if (project.status === "INCOMPLETO") current.incompletos += 1
      if (project.status !== "DISTRIBUIDO") current.pendentes += 1

      map.set(project.area, current)
    })

    return Array.from(map.values()).sort((a, b) => b.pendentes - a.pendentes)
  }, [projects])

  const recentDeclinedAssignments = assignments
    .filter((assignment) => assignment.status === "RECUSADO")
    .slice(0, 5)

  const manualCandidatesForIssue = useMemo(() => {
    if (!selectedIssueProject || !preview) return []

    const assignedIds = evaluatorIdsForProject(
      selectedIssueProject.id,
      assignments,
      preview.draftAssignments,
    )

    return evaluators
      .map((evaluator) => {
        const score = affinityScore(selectedIssueProject, evaluator)

        const projectedLoad = getEvaluatorProjectedLoad(
          evaluator.id,
          evaluators,
          preview.draftAssignments,
        )

        const alreadyAssigned = assignedIds.has(evaluator.id)

        const blocked =
          !alreadyAssigned &&
          (!canEvaluateWithProjectedLoad({
            project: selectedIssueProject,
            evaluator,
            evaluators,
            draftAssignments: preview.draftAssignments,
          }) ||
            Boolean(evaluator.unavailable))

        return {
          evaluator,
          score,
          projectedLoad,
          alreadyAssigned,
          blocked,
          conflict: hasConflict(selectedIssueProject, evaluator),
        }
      })
      .sort((a, b) => b.score - a.score || a.projectedLoad - b.projectedLoad)
      .slice(0, 8)
  }, [selectedIssueProject, preview, assignments, evaluators])

  function syncSelectedIssue(issues: DistributionIssue[]) {
    setSelectedIssueProjectId(
      issues.length > 0 ? issues[0].projectId : null,
    )
  }

  function handleGenerateSmartPreview() {
    const nextPreview = buildSmartDistribution({
      projects,
      evaluators,
      assignments,
    })

    setPreview(nextPreview)
    syncSelectedIssue(nextPreview.issues)
  }

  function handleConfirmPreview() {
    if (!preview) return

    const today = new Date().toISOString().slice(0, 10)

    const newAssignments: Assignment[] = preview.draftAssignments.map(
      (assignment, index) => ({
        id: Date.now() + index,
        projectId: assignment.projectId,
        evaluatorId: assignment.evaluatorId,
        status: "PENDENTE",
        sentAt: today,
      }),
    )

    setAssignments((current) => [...current, ...newAssignments])

    setEvaluators((current) =>
      current.map((evaluator) => {
        const added = preview.draftAssignments.filter(
          (assignment) => assignment.evaluatorId === evaluator.id,
        ).length

        return {
          ...evaluator,
          currentAssignments: evaluator.currentAssignments + added,
        }
      }),
    )

    setProjects((current) =>
      current.map((project) => {
        const activeCount = getProjectActiveCount(
          project.id,
          assignments,
          preview.draftAssignments,
        )

        if (activeCount >= MIN_EVALUATORS_PER_PROJECT) {
          return {
            ...project,
            status: "DISTRIBUIDO",
          }
        }

        if (preview.issues.some((issue) => issue.projectId === project.id)) {
          return {
            ...project,
            status: "INCOMPLETO",
          }
        }

        return project
      }),
    )

    setPreview(null)
    setSelectedIssueProjectId(null)
  }

  function handleClearPreview() {
    setPreview(null)
    setSelectedIssueProjectId(null)
  }

  function handleManualAddForIssue(evaluatorId: number) {
    if (!selectedIssueProject || !preview) return

    const evaluator = evaluators.find((item) => item.id === evaluatorId)

    if (!evaluator) return

    const assignedIds = evaluatorIdsForProject(
      selectedIssueProject.id,
      assignments,
      preview.draftAssignments,
    )

    const alreadyAssigned = assignedIds.has(evaluator.id)

    if (alreadyAssigned) {
      const nextDraftAssignments = preview.draftAssignments.filter(
        (assignment) =>
          !(
            assignment.projectId === selectedIssueProject.id &&
            assignment.evaluatorId === evaluator.id
          ),
      )

      setPreview({
        draftAssignments: nextDraftAssignments,
        issues: preview.issues,
      })

      return
    }

    if (
      !canEvaluateWithProjectedLoad({
        project: selectedIssueProject,
        evaluator,
        evaluators,
        draftAssignments: preview.draftAssignments,
      })
    ) {
      return
    }

    const newDraftAssignment = {
      id: Date.now(),
      projectId: selectedIssueProject.id,
      evaluatorId: evaluator.id,
      score: affinityScore(selectedIssueProject, evaluator),
      generatedBy: "AUTO" as const,
    }

    const nextDraftAssignments = [...preview.draftAssignments, newDraftAssignment]

    const activeCount = getProjectActiveCount(
      selectedIssueProject.id,
      assignments,
      nextDraftAssignments,
    )

    const nextIssues =
      activeCount >= MIN_EVALUATORS_PER_PROJECT
        ? preview.issues.filter(
            (issue) => issue.projectId !== selectedIssueProject.id,
          )
        : preview.issues

    setPreview({
      draftAssignments: nextDraftAssignments,
      issues: nextIssues,
    })

    syncSelectedIssue(nextIssues)
  }

  function handleResendDeclined(assignmentId: number) {
    const declinedAssignment = assignments.find(
      (assignment) => assignment.id === assignmentId,
    )

    const project = projects.find(
      (item) => item.id === declinedAssignment?.projectId,
    )

    if (!declinedAssignment || !project) return

    const alreadyAssignedIds = new Set<number>()
    for (const assignment of assignments) {
      if (
        assignment.projectId === project.id &&
        assignment.status !== "RECUSADO"
      ) {
        alreadyAssignedIds.add(assignment.evaluatorId)
      }
    }

    const replacement = evaluators
      .filter((evaluator) => {
        return (
          !alreadyAssignedIds.has(evaluator.id) &&
          evaluator.id !== declinedAssignment.evaluatorId &&
          !evaluator.unavailable &&
          !hasConflict(project, evaluator) &&
          affinityScore(project, evaluator) > 0 &&
          evaluator.currentAssignments < evaluator.maxAssignments
        )
      })
      .sort((a, b) => {
        const aLoad = a.currentAssignments / a.maxAssignments
        const bLoad = b.currentAssignments / b.maxAssignments

        return affinityScore(project, b) - affinityScore(project, a) || aLoad - bLoad
      })[0]

    if (!replacement) return

    const newAssignment: Assignment = {
      id: Date.now(),
      projectId: project.id,
      evaluatorId: replacement.id,
      status: "PENDENTE",
      sentAt: new Date().toISOString().slice(0, 10),
    }

    setAssignments((current) => [...current, newAssignment])

    setEvaluators((current) =>
      current.map((evaluator) =>
        evaluator.id === replacement.id
          ? {
              ...evaluator,
              currentAssignments: evaluator.currentAssignments + 1,
            }
          : evaluator,
      ),
    )
  }

  return {
    projects,
    evaluators,
    preview,
    setSelectedIssueProjectId,
    pendingProjects,
    distributedProjects,
    issueProjects,
    selectedIssueProject,
    totalDraftAssignments,
    projectsCompletedInPreview,
    assignmentSummary,
    areaSummary,
    recentDeclinedAssignments,
    manualCandidatesForIssue,
    handleGenerateSmartPreview,
    handleConfirmPreview,
    handleClearPreview,
    handleManualAddForIssue,
    handleResendDeclined,
  }
}
