import type {
  Assignment,
  DistributableProject,
  DistributionIssue,
  DistributionPreview,
  DraftAssignment,
  Evaluator,
  AssignmentStatus,
} from "../types/evaluationDistribution"

export const MIN_EVALUATORS_PER_PROJECT = 2

export const projectsMock: DistributableProject[] = [
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

export const evaluatorsMock: Evaluator[] = [
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

export const assignmentsMock: Assignment[] = [
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

export function assignmentStatusLabel(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "Pendente",
    ACEITO: "Aceito",
    RECUSADO: "Recusado",
  }

  return map[status]
}

export function assignmentStatusClass(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-700",
    ACEITO: "border-emerald-200 bg-emerald-50 text-emerald-700",
    RECUSADO: "border-red-200 bg-red-50 text-red-700",
  }

  return map[status]
}

export function hasConflict(
  project: DistributableProject,
  evaluator: Evaluator,
) {
  return project.unit === evaluator.unit || project.coordinator === evaluator.name
}

export function affinityScore(
  project: DistributableProject,
  evaluator: Evaluator,
) {
  let score = 0

  if (evaluator.grandeAreas.includes(project.grandeArea)) score += 1
  if (evaluator.areas.includes(project.area)) score += 2
  if (evaluator.subareas.includes(project.subarea)) score += 3

  return score
}

export function activeAssignmentsByProject(
  projectId: number,
  assignments: Assignment[],
) {
  return assignments.filter(
    (assignment) =>
      assignment.projectId === projectId && assignment.status !== "RECUSADO",
  )
}

export function getProjectActiveCount(
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

export function evaluatorIdsForProject(
  projectId: number,
  assignments: Assignment[],
  draftAssignments: DraftAssignment[],
): Set<number> {
  const ids = new Set<number>()

  for (const assignment of activeAssignmentsByProject(projectId, assignments)) {
    ids.add(assignment.evaluatorId)
  }

  for (const assignment of draftAssignments) {
    if (assignment.projectId === projectId) {
      ids.add(assignment.evaluatorId)
    }
  }

  return ids
}

export function getEvaluatorProjectedLoad(
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

export function canEvaluateWithProjectedLoad({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: DistributableProject
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

export function smartScore({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: DistributableProject
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

export function countEligibleCandidates(
  project: DistributableProject,
  evaluators: Evaluator[],
) {
  return evaluators.filter(
    (evaluator) =>
      !evaluator.unavailable &&
      !hasConflict(project, evaluator) &&
      affinityScore(project, evaluator) > 0,
  ).length
}

export function buildSmartDistribution({
  projects,
  evaluators,
  assignments,
}: {
  projects: DistributableProject[]
  evaluators: Evaluator[]
  assignments: Assignment[]
}): DistributionPreview {
  const draftAssignments: DraftAssignment[] = []
  const issues: DistributionIssue[] = []

  const projectsToDistribute = projects
    .filter((project) => project.status !== "DISTRIBUIDO")
    .sort(
      (a, b) =>
        countEligibleCandidates(a, evaluators) -
        countEligibleCandidates(b, evaluators),
    )

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
        .filter(
          (evaluator) =>
            !alreadyAssignedIds.has(evaluator.id) &&
            canEvaluateWithProjectedLoad({
              project,
              evaluator,
              evaluators,
              draftAssignments,
            }),
        )
        .sort(
          (a, b) =>
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
            }),
        )

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
