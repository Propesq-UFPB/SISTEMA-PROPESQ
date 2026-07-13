import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  GitBranch,
  RefreshCcw,
  Send,
  ShieldAlert,
  Shuffle,
  SlidersHorizontal,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

type ProjectStatus =
  | "SUBMETIDO"
  | "DISTRIBUIDO"
  | "PENDENTE"
  | "RECUSADO"
  | "INCOMPLETO"

type AssignmentStatus = "PENDENTE" | "ACEITO" | "RECUSADO"

type Project = {
  id: number
  code: string
  title: string
  coordinator: string
  unit: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  status: ProjectStatus
}

type Evaluator = {
  id: number
  name: string
  unit: string
  email: string
  grandeAreas: string[]
  areas: string[]
  subareas: string[]
  maxAssignments: number
  currentAssignments: number
  unavailable?: boolean
}

type Assignment = {
  id: number
  projectId: number
  evaluatorId: number
  status: AssignmentStatus
  reason?: string
  sentAt: string
}

type DraftAssignment = {
  id: number
  projectId: number
  evaluatorId: number
  score: number
  generatedBy: "AUTO"
}

type DistributionIssue = {
  projectId: number
  missing: number
  reason: string
}

type DistributionPreview = {
  draftAssignments: DraftAssignment[]
  issues: DistributionIssue[]
}

const MIN_EVALUATORS_PER_PROJECT = 2

const projectsMock: Project[] = [
  {
    id: 1,
    code: "PVH-2026-001",
    title: "Aplicação de IA para análise de acessibilidade em ambientes digitais",
    coordinator: "Dra. Ana Beatriz Lima",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Inteligência Artificial",
    especialidade: "Processamento de Linguagem Natural",
    status: "PENDENTE",
  },
  {
    id: 2,
    code: "PVH-2026-002",
    title: "Monitoramento inteligente de dados acadêmicos em programas institucionais",
    coordinator: "Dr. Carlos Henrique Souza",
    unit: "CT",
    grandeArea: "Engenharias",
    area: "Engenharia de Produção",
    subarea: "Pesquisa Operacional",
    especialidade: "Sistemas de Apoio à Decisão",
    status: "DISTRIBUIDO",
  },
  {
    id: 3,
    code: "PVH-2026-003",
    title: "Métodos computacionais aplicados à análise de sinais biomédicos",
    coordinator: "Dra. Mariana Costa",
    unit: "CCS",
    grandeArea: "Ciências da Saúde",
    area: "Medicina",
    subarea: "Engenharia Biomédica",
    especialidade: "Processamento de Sinais",
    status: "SUBMETIDO",
  },
  {
    id: 4,
    code: "PVH-2026-004",
    title: "Modelagem de indicadores para acompanhamento da produção científica",
    coordinator: "Dr. Roberto Menezes",
    unit: "CCHLA",
    grandeArea: "Ciências Humanas",
    area: "Educação",
    subarea: "Políticas Educacionais",
    especialidade: "Avaliação Institucional",
    status: "RECUSADO",
  },
  {
    id: 5,
    code: "PVH-2026-005",
    title: "Sistemas inteligentes aplicados à análise de dados públicos",
    coordinator: "Dra. Juliana Freitas",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Sistemas de Informação",
    especialidade: "Mineração de Dados",
    status: "PENDENTE",
  },
]

const evaluatorsMock: Evaluator[] = [
  {
    id: 1,
    name: "Prof. João Martins",
    unit: "CI",
    email: "joao.martins@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra"],
    areas: ["Ciência da Computação"],
    subareas: ["Inteligência Artificial", "Sistemas de Computação"],
    maxAssignments: 4,
    currentAssignments: 2,
  },
  {
    id: 2,
    name: "Profa. Helena Duarte",
    unit: "CT",
    email: "helena.duarte@ufpb.br",
    grandeAreas: ["Engenharias", "Ciências Exatas e da Terra"],
    areas: ["Engenharia de Produção", "Ciência da Computação"],
    subareas: ["Pesquisa Operacional", "Inteligência Artificial"],
    maxAssignments: 3,
    currentAssignments: 1,
  },
  {
    id: 3,
    name: "Prof. Miguel Andrade",
    unit: "CCS",
    email: "miguel.andrade@ufpb.br",
    grandeAreas: ["Ciências da Saúde"],
    areas: ["Medicina"],
    subareas: ["Engenharia Biomédica", "Saúde Coletiva"],
    maxAssignments: 3,
    currentAssignments: 3,
  },
  {
    id: 4,
    name: "Profa. Clara Nogueira",
    unit: "CCHLA",
    email: "clara.nogueira@ufpb.br",
    grandeAreas: ["Ciências Humanas"],
    areas: ["Educação"],
    subareas: ["Políticas Educacionais", "Avaliação Institucional"],
    maxAssignments: 5,
    currentAssignments: 2,
  },
  {
    id: 5,
    name: "Prof. Felipe Rocha",
    unit: "CEAR",
    email: "felipe.rocha@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra", "Engenharias"],
    areas: ["Ciência da Computação", "Engenharia Elétrica"],
    subareas: ["Inteligência Artificial", "Processamento de Sinais"],
    maxAssignments: 4,
    currentAssignments: 0,
  },
  {
    id: 6,
    name: "Profa. Renata Alves",
    unit: "CI",
    email: "renata.alves@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra"],
    areas: ["Ciência da Computação"],
    subareas: ["Processamento de Linguagem Natural", "Inteligência Artificial"],
    maxAssignments: 2,
    currentAssignments: 1,
    unavailable: true,
  },
]

const assignmentsMock: Assignment[] = [
  {
    id: 1,
    projectId: 2,
    evaluatorId: 2,
    status: "ACEITO",
    sentAt: "2026-06-01",
  },
  {
    id: 2,
    projectId: 2,
    evaluatorId: 5,
    status: "PENDENTE",
    sentAt: "2026-06-01",
  },
  {
    id: 3,
    projectId: 4,
    evaluatorId: 4,
    status: "RECUSADO",
    reason: "Conflito de interesse declarado pelo avaliador.",
    sentAt: "2026-05-31",
  },
]

function assignmentStatusLabel(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "Pendente",
    ACEITO: "Aceito",
    RECUSADO: "Recusado",
  }

  return map[status]
}

function assignmentStatusClass(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-700",
    ACEITO: "border-emerald-200 bg-emerald-50 text-emerald-700",
    RECUSADO: "border-red-200 bg-red-50 text-red-700",
  }

  return map[status]
}

function hasConflict(project: Project, evaluator: Evaluator) {
  return project.unit === evaluator.unit || project.coordinator === evaluator.name
}

function affinityScore(project: Project, evaluator: Evaluator) {
  let score = 0

  if (evaluator.grandeAreas.includes(project.grandeArea)) score += 1
  if (evaluator.areas.includes(project.area)) score += 2
  if (evaluator.subareas.includes(project.subarea)) score += 3

  return score
}

function activeAssignmentsByProject(projectId: number, assignments: Assignment[]) {
  return assignments.filter(
    (assignment) =>
      assignment.projectId === projectId && assignment.status !== "RECUSADO",
  )
}

function getProjectActiveCount(
  projectId: number,
  assignments: Assignment[],
  draftAssignments: DraftAssignment[],
) {
  const active = activeAssignmentsByProject(projectId, assignments).length

  const drafted = draftAssignments.filter(
    (assignment) => assignment.projectId === projectId,
  ).length

  return active + drafted
}

function getEvaluatorProjectedLoad(
  evaluatorId: number,
  evaluators: Evaluator[],
  draftAssignments: DraftAssignment[],
) {
  const evaluator = evaluators.find((item) => item.id === evaluatorId)

  if (!evaluator) return 0

  return (
    evaluator.currentAssignments +
    draftAssignments.filter(
      (assignment) => assignment.evaluatorId === evaluatorId,
    ).length
  )
}

function canEvaluateWithProjectedLoad({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: Project
  evaluator: Evaluator
  evaluators: Evaluator[]
  draftAssignments: DraftAssignment[]
}) {
  const projectedLoad = getEvaluatorProjectedLoad(
    evaluator.id,
    evaluators,
    draftAssignments,
  )

  return (
    !evaluator.unavailable &&
    !hasConflict(project, evaluator) &&
    affinityScore(project, evaluator) > 0 &&
    projectedLoad < evaluator.maxAssignments
  )
}

function smartScore({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: Project
  evaluator: Evaluator
  evaluators: Evaluator[]
  draftAssignments: DraftAssignment[]
}) {
  const affinity = affinityScore(project, evaluator)

  const projectedLoad = getEvaluatorProjectedLoad(
    evaluator.id,
    evaluators,
    draftAssignments,
  )

  const loadRatio = projectedLoad / evaluator.maxAssignments

  return affinity * 100 - loadRatio * 30
}

function buildSmartDistribution({
  projects,
  evaluators,
  assignments,
}: {
  projects: Project[]
  evaluators: Evaluator[]
  assignments: Assignment[]
}): DistributionPreview {
  const draftAssignments: DraftAssignment[] = []
  const issues: DistributionIssue[] = []

  const projectsToDistribute = projects
    .filter((project) => project.status !== "DISTRIBUIDO")
    .sort((a, b) => {
      const aCandidates = evaluators.filter((evaluator) => {
        return (
          !evaluator.unavailable &&
          !hasConflict(a, evaluator) &&
          affinityScore(a, evaluator) > 0
        )
      }).length

      const bCandidates = evaluators.filter((evaluator) => {
        return (
          !evaluator.unavailable &&
          !hasConflict(b, evaluator) &&
          affinityScore(b, evaluator) > 0
        )
      }).length

      return aCandidates - bCandidates
    })

  projectsToDistribute.forEach((project) => {
    const activeAssignments = activeAssignmentsByProject(project.id, assignments)

    let missing = Math.max(
      MIN_EVALUATORS_PER_PROJECT - activeAssignments.length,
      0,
    )

    const alreadyAssignedIds = new Set([
      ...activeAssignments.map((assignment) => assignment.evaluatorId),
      ...draftAssignments
        .filter((assignment) => assignment.projectId === project.id)
        .map((assignment) => assignment.evaluatorId),
    ])

    while (missing > 0) {
      const candidates = evaluators
        .filter((evaluator) => {
          return (
            !alreadyAssignedIds.has(evaluator.id) &&
            canEvaluateWithProjectedLoad({
              project,
              evaluator,
              evaluators,
              draftAssignments,
            })
          )
        })
        .sort((a, b) => {
          return (
            smartScore({
              project,
              evaluator: b,
              evaluators,
              draftAssignments,
            }) -
            smartScore({
              project,
              evaluator: a,
              evaluators,
              draftAssignments,
            })
          )
        })

      const selected = candidates[0]

      if (!selected) {
        issues.push({
          projectId: project.id,
          missing,
          reason:
            "Não há avaliadores elegíveis suficientes com afinidade, sem conflito e com carga disponível.",
        })

        break
      }

      alreadyAssignedIds.add(selected.id)

      draftAssignments.push({
        id: Date.now() + draftAssignments.length + selected.id,
        projectId: project.id,
        evaluatorId: selected.id,
        score: affinityScore(project, selected),
        generatedBy: "AUTO",
      })

      missing -= 1
    }
  })

  return {
    draftAssignments,
    issues,
  }
}

export default function AdminEvaluationDistribution() {
  const [projects, setProjects] = useState<Project[]>(projectsMock)
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

    return preview.issues
      .map((issue) => {
        const project = projects.find((item) => item.id === issue.projectId)

        if (!project) return null

        return {
          issue,
          project,
        }
      })
      .filter(Boolean) as {
      issue: DistributionIssue
      project: Project
    }[]
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

  const assignmentSummary = useMemo(() => {
    return {
      total: assignments.length,
      pendentes: assignments.filter((item) => item.status === "PENDENTE").length,
      aceitos: assignments.filter((item) => item.status === "ACEITO").length,
      recusados: assignments.filter((item) => item.status === "RECUSADO").length,
    }
  }, [assignments])

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

  const projectedEvaluatorLoads = useMemo(() => {
    return evaluators
      .map((evaluator) => {
        const added =
          preview?.draftAssignments.filter(
            (assignment) => assignment.evaluatorId === evaluator.id,
          ).length ?? 0

        return {
          evaluator,
          added,
          projected: evaluator.currentAssignments + added,
        }
      })
      .sort((a, b) => b.projected - a.projected)
  }, [evaluators, preview])

  const evaluatorLoadSummary = useMemo(() => {
    const overloaded = projectedEvaluatorLoads.filter(
      ({ evaluator, projected }) => projected >= evaluator.maxAssignments,
    ).length

    const changed = projectedEvaluatorLoads.filter(({ added }) => added > 0).length

    const unavailable = evaluators.filter((item) => item.unavailable).length

    return {
      total: evaluators.length,
      changed,
      overloaded,
      unavailable,
    }
  }, [projectedEvaluatorLoads, evaluators])

  const visibleEvaluatorLoads = useMemo(() => {
    return projectedEvaluatorLoads
      .filter(({ evaluator, added, projected }) => {
        return added > 0 || projected >= evaluator.maxAssignments || evaluator.unavailable
      })
      .slice(0, 6)
  }, [projectedEvaluatorLoads])

  const recentDeclinedAssignments = useMemo(() => {
    return assignments
      .filter((assignment) => assignment.status === "RECUSADO")
      .slice(0, 5)
  }, [assignments])

  const manualCandidatesForIssue = useMemo(() => {
    if (!selectedIssueProject || !preview) return []

    const activeIds = activeAssignmentsByProject(
      selectedIssueProject.id,
      assignments,
    ).map((assignment) => assignment.evaluatorId)

    const draftIds = preview.draftAssignments
      .filter((assignment) => assignment.projectId === selectedIssueProject.id)
      .map((assignment) => assignment.evaluatorId)

    return evaluators
      .map((evaluator) => {
        const score = affinityScore(selectedIssueProject, evaluator)

        const projectedLoad = getEvaluatorProjectedLoad(
          evaluator.id,
          evaluators,
          preview.draftAssignments,
        )

        const alreadyAssigned = [...activeIds, ...draftIds].includes(evaluator.id)

        const blocked =
          !alreadyAssigned &&
          (!canEvaluateWithProjectedLoad({
            project: selectedIssueProject,
            evaluator,
            evaluators,
            draftAssignments: preview.draftAssignments,
          }) ||
            evaluator.unavailable)

        return {
          evaluator,
          score,
          projectedLoad,
          alreadyAssigned,
          blocked,
          conflict: hasConflict(selectedIssueProject, evaluator),
        }
      })
      .sort((a, b) => {
        return b.score - a.score || a.projectedLoad - b.projectedLoad
      })
      .slice(0, 8)
  }, [selectedIssueProject, preview, assignments, evaluators])

  function handleGenerateSmartPreview() {
    const nextPreview = buildSmartDistribution({
      projects,
      evaluators,
      assignments,
    })

    setPreview(nextPreview)

    if (nextPreview.issues.length > 0) {
      setSelectedIssueProjectId(nextPreview.issues[0].projectId)
    } else {
      setSelectedIssueProjectId(null)
    }
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

    const activeIds = activeAssignmentsByProject(
      selectedIssueProject.id,
      assignments,
    ).map((assignment) => assignment.evaluatorId)

    const draftIds = preview.draftAssignments
      .filter((assignment) => assignment.projectId === selectedIssueProject.id)
      .map((assignment) => assignment.evaluatorId)

    const alreadyAssigned = [...activeIds, ...draftIds].includes(evaluator.id)

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

    const newDraftAssignment: DraftAssignment = {
      id: Date.now(),
      projectId: selectedIssueProject.id,
      evaluatorId: evaluator.id,
      score: affinityScore(selectedIssueProject, evaluator),
      generatedBy: "AUTO",
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

    if (nextIssues.length > 0) {
      setSelectedIssueProjectId(nextIssues[0].projectId)
    } else {
      setSelectedIssueProjectId(null)
    }
  }

  function handleResendDeclined(assignmentId: number) {
    const declinedAssignment = assignments.find(
      (assignment) => assignment.id === assignmentId,
    )

    const project = projects.find(
      (item) => item.id === declinedAssignment?.projectId,
    )

    if (!declinedAssignment || !project) return

    const alreadyAssignedIds = assignments
      .filter(
        (assignment) =>
          assignment.projectId === project.id && assignment.status !== "RECUSADO",
      )
      .map((assignment) => assignment.evaluatorId)

    const replacement = evaluators
      .filter((evaluator) => {
        return (
          !alreadyAssignedIds.includes(evaluator.id) &&
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

  return (
    <div className="min-h-screen bg-neutral-light">

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
        <Helmet>
          <title>Distribuição de Avaliações • PROPESQ</title>
        </Helmet>
        <div className="flex items-center justify-between">
          <Link
            to="/adm/avaliacao/avaliadores"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para Avaliadores
          </Link>
        </div>

          <PageHeader
            totalProjects={projects.length}
            pendingProjects={pendingProjects.length}
            distributedProjects={distributedProjects.length}
            issueCount={preview?.issues.length ?? 0}
          />

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                icon={<Shuffle size={18} />}
                title="Distribuição em lote"
                subtitle="Gere uma prévia automática e revise somente as exceções."
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSmartPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <Shuffle size={16} />
                  Gerar prévia
                </button>

                <button
                  type="button"
                  disabled={!preview || totalDraftAssignments === 0}
                  onClick={handleConfirmPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:bg-neutral-light disabled:text-neutral/50"
                >
                  <Send size={16} />
                  Confirmar
                </button>

                <button
                  type="button"
                  disabled={!preview}
                  onClick={handleClearPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:text-neutral/40"
                >
                  <RefreshCcw size={16} />
                  Limpar
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <MetricCard
                label="Projetos pendentes"
                value={pendingProjects.length}
                icon={<GitBranch size={18} />}
              />

              <MetricCard
                label="Atribuições sugeridas"
                value={totalDraftAssignments}
                icon={<UserCheck size={18} />}
              />

              <MetricCard
                label="Projetos completos"
                value={projectsCompletedInPreview}
                icon={<CheckCircle2 size={18} />}
              />

              <MetricCard
                label="Exigem ajuste"
                value={preview?.issues.length ?? 0}
                icon={<AlertTriangle size={18} />}
                warning={Boolean(preview && preview.issues.length > 0)}
              />
            </div>

            {preview ? (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <CircleAlert
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-blue-800">
                      Prévia gerada
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Nenhum convite foi enviado. Revise as exceções antes de
                      confirmar a distribuição.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<BarChart3 size={18} />}
                  title="Resumo por área"
                  subtitle="Visão agregada para o gestor."
                />

                <div className="overflow-hidden rounded-2xl border border-neutral/10">
                  <table className="min-w-full divide-y divide-neutral/10 text-sm">
                    <thead className="bg-neutral-light/70">
                      <tr>
                        <TableHead>Área</TableHead>
                        <TableHead align="right">Total</TableHead>
                        <TableHead align="right">Pendentes</TableHead>
                        <TableHead align="right">Distribuídos</TableHead>
                        <TableHead align="right">Incompletos</TableHead>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral/10 bg-white">
                      {areaSummary.map((item) => (
                        <tr key={item.area}>
                          <TableCell>{item.area}</TableCell>
                          <TableCell align="right">{item.total}</TableCell>
                          <TableCell align="right">{item.pendentes}</TableCell>
                          <TableCell align="right">{item.distribuidos}</TableCell>
                          <TableCell align="right">{item.incompletos}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<UserCheck size={18} />}
                  title="Distribuições existentes"
                  subtitle="Resumo dos convites já enviados."
                />

                <div className="grid gap-4 md:grid-cols-4">
                  <MetricCard
                    label="Total"
                    value={assignmentSummary.total}
                    icon={<UserCheck size={18} />}
                  />

                  <MetricCard
                    label="Pendentes"
                    value={assignmentSummary.pendentes}
                    icon={<Clock3 size={18} />}
                    warning={assignmentSummary.pendentes > 0}
                  />

                  <MetricCard
                    label="Aceitos"
                    value={assignmentSummary.aceitos}
                    icon={<CheckCircle2 size={18} />}
                  />

                  <MetricCard
                    label="Recusados"
                    value={assignmentSummary.recusados}
                    icon={<XCircle size={18} />}
                    warning={assignmentSummary.recusados > 0}
                  />
                </div>

                {recentDeclinedAssignments.length > 0 ? (
                  <div className="mt-5">
                    <h3 className="mb-3 text-sm font-semibold text-neutral-dark">
                      Recusas recentes
                    </h3>

                    <div className="space-y-3">
                      {recentDeclinedAssignments.map((assignment) => {
                        const project = projects.find(
                          (item) => item.id === assignment.projectId,
                        )

                        const evaluator = evaluators.find(
                          (item) => item.id === assignment.evaluatorId,
                        )

                        if (!project || !evaluator) return null

                        return (
                          <div
                            key={assignment.id}
                            className="rounded-2xl border border-red-100 bg-red-50 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-xs font-semibold text-red-700">
                                  {project.code}
                                </p>

                                <h4 className="mt-1 text-sm font-semibold text-neutral-dark">
                                  {evaluator.name}
                                </h4>

                                <p className="mt-1 text-xs text-red-700">
                                  {assignment.reason ??
                                    "Recusa registrada pelo avaliador."}
                                </p>

                                <p className="mt-1 text-xs text-neutral">
                                  Status: {assignmentStatusLabel(assignment.status)} ·{" "}
                                  enviado em {assignment.sentAt}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResendDeclined(assignment.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
                              >
                                <RefreshCcw size={14} />
                                Redistribuir
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<AlertTriangle size={18} />}
                  title="Fila de exceções"
                  subtitle="Casos que precisam de ajuste manual."
                />

                {issueProjects.length > 0 ? (
                  <div className="space-y-3">
                    {issueProjects.map(({ issue, project }) => {
                      const isSelected = selectedIssueProject?.id === project.id

                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedIssueProjectId(project.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-red-200 bg-red-50"
                              : "border-neutral/10 bg-white hover:border-red-200 hover:bg-red-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-primary">
                                {project.code}
                              </p>

                              <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
                                {project.title}
                              </h3>

                              <p className="mt-1 text-xs text-neutral">
                                {project.area} · {project.subarea}
                              </p>
                            </div>

                            <SmallBadge className="bg-red-100 text-red-700">
                              Faltam {issue.missing}
                            </SmallBadge>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-red-700">
                            {issue.reason}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<CheckCircle2 size={28} />}
                    title="Nenhuma exceção pendente"
                    desc="Depois de gerar a prévia, os casos problemáticos aparecem aqui."
                    success
                  />
                )}
              </section>

              {selectedIssueProject && preview ? (
                <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                  <SectionTitle
                    icon={<SlidersHorizontal size={18} />}
                    title="Ajuste manual"
                    subtitle="Use somente para completar uma exceção."
                  />

                  <div className="mb-4 rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
                    <p className="text-xs font-semibold text-primary">
                      {selectedIssueProject.code}
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
                      {selectedIssueProject.title}
                    </h3>

                    <p className="mt-2 text-xs text-neutral">
                      {selectedIssueProject.grandeArea} ·{" "}
                      {selectedIssueProject.area} · {selectedIssueProject.subarea}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {manualCandidatesForIssue.map(
                      ({
                        evaluator,
                        score,
                        projectedLoad,
                        alreadyAssigned,
                        blocked,
                        conflict,
                      }) => (
                        <div
                          key={evaluator.id}
                          className="rounded-2xl border border-neutral/10 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-neutral-dark">
                                {evaluator.name}
                              </h3>

                              <p className="mt-1 text-xs text-neutral">
                                {evaluator.unit} · {evaluator.email}
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={blocked && !alreadyAssigned}
                              onClick={() => handleManualAddForIssue(evaluator.id)}
                              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                alreadyAssigned
                                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                  : blocked
                                    ? "cursor-not-allowed border border-neutral/10 bg-neutral-light text-neutral/50"
                                    : "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                              }`}
                            >
                              {alreadyAssigned ? "Remover" : "Adicionar"}
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <SmallBadge>Afinidade: {score}/6</SmallBadge>

                            <SmallBadge>
                              Carga: {projectedLoad}/{evaluator.maxAssignments}
                            </SmallBadge>

                            {conflict ? (
                              <SmallBadge className="bg-red-50 text-red-700">
                                <ShieldAlert size={13} />
                                Conflito
                              </SmallBadge>
                            ) : null}

                            {projectedLoad >= evaluator.maxAssignments ? (
                              <SmallBadge className="bg-amber-50 text-amber-700">
                                <CircleAlert size={13} />
                                Sem capacidade
                              </SmallBadge>
                            ) : null}

                            {evaluator.unavailable ? (
                              <SmallBadge className="bg-neutral-light text-neutral">
                                Indisponível
                              </SmallBadge>
                            ) : null}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function PageHeader({
  totalProjects,
  pendingProjects,
  distributedProjects,
  issueCount,
}: {
  totalProjects: number
  pendingProjects: number
  distributedProjects: number
  issueCount: number
}) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">

          <div>

            <h1 className="text-2xl font-bold text-primary">
              Distribuição de Projetos para Avaliação
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Distribuição em lote com acompanhamento por indicadores e ajuste
              manual apenas nos casos pendentes.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:w-[620px]">
          <SummaryCard
            label="Projetos"
            value={totalProjects}
            icon={<GitBranch size={18} />}
          />

          <SummaryCard
            label="Pendentes"
            value={pendingProjects}
            icon={<Clock3 size={18} />}
          />

          <SummaryCard
            label="Distribuídos"
            value={distributedProjects}
            icon={<CheckCircle2 size={18} />}
          />

          <SummaryCard
            label="Exceções"
            value={issueCount}
            icon={<AlertTriangle size={18} />}
          />
        </div>
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className="mt-1 text-xl font-bold text-neutral-dark">{value}</p>
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-primary">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral">{subtitle}</p> : null}
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  warning,
}: {
  label: string
  value: number
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warning
          ? "border-amber-100 bg-amber-50 text-amber-800"
          : "border-neutral/10 bg-neutral-light/60 text-neutral-dark"
      }`}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-primary">
        {icon}
      </div>

      <p className="text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

function TableHead({
  children,
  align = "left",
}: {
  children: ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

function TableCell({
  children,
  align = "left",
}: {
  children: ReactNode
  align?: "left" | "right"
}) {
  return (
    <td
      className={`px-4 py-3 text-xs text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  )
}

function SmallBadge({
  children,
  className = "bg-neutral-light text-neutral",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  )
}

function EmptyState({
  icon,
  title,
  desc,
  success,
}: {
  icon: ReactNode
  title: string
  desc: string
  success?: boolean
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/60 p-6 text-center">
      <div className={success ? "text-emerald-600" : "text-neutral"}>
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-neutral-dark">{title}</h3>

      <p className="mt-1 text-sm text-neutral">{desc}</p>
    </div>
  )
}