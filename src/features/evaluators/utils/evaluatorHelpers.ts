import type {
  Area,
  Assignment,
  Call,
  Evaluator,
  EvaluatorRole,
  EvaluatorStatusFilter,
  EvaluatorTypeFilter,
  NotifyPreviewItem,
  NotifyRoleMap,
  Project,
} from "../types/evaluators"

export const DEFAULT_MAIL_SUBJECT = "Pendências de avaliação — {edital}"

export const DEFAULT_MAIL_BODY = `Prezado(a) {consultor},

Solicitamos sua atenção para as pendências de avaliação no edital {edital}.

Projetos pendentes:
{projetos}

Acesse o sistema para concluir a avaliação dentro do prazo.

Atenciosamente,
PROPESQ`

export const callsMock: Call[] = [
  {
    id: "c1",
    title: "PIBIC - Pesquisa",
    baseYear: 2025,
    statusLabel: "Em configuração",
  },
  {
    id: "c2",
    title: "PROBEX - Extensão",
    baseYear: 2024,
    statusLabel: "Encerrado",
  },
]

export const availableAreasMock: Area[] = [
  { id: "cnpq_ai", label: "CNPq: Inteligência Artificial", source: "CNPq" },
  { id: "cnpq_cv", label: "CNPq: Visão Computacional", source: "CNPq" },
  { id: "cnpq_ds", label: "CNPq: Ciência de Dados", source: "CNPq" },
  { id: "cnae_it", label: "CNAE: Tecnologia da Informação", source: "CNAE" },
  { id: "cnae_ed", label: "CNAE: Educação", source: "CNAE" },
]

export const evaluatorsMock: Evaluator[] = [
  {
    id: "e1",
    name: "Profa. Ana Souza",
    email: "ana.souza@ufpb.br",
    type: "INTERNO",
    roles: ["INTERNO", "PROPESQ"],
    areas: [availableAreasMock[0], availableAreasMock[2]],
    active: true,
  },
  {
    id: "e2",
    name: "Prof. Bruno Lima",
    email: "bruno.lima@externo.org",
    type: "EXTERNO",
    roles: ["EXTERNO"],
    areas: [availableAreasMock[1]],
    active: true,
  },
  {
    id: "e3",
    name: "Profa. Carla Mendes",
    email: "carla.mendes@ufpb.br",
    type: "INTERNO",
    roles: ["INTERNO", "VOLUNTARIO"],
    areas: [availableAreasMock[4]],
    active: false,
  },
  {
    id: "e4",
    name: "Prof. Diego Ramos",
    email: "diego.ramos@ufpb.br",
    type: "INTERNO",
    roles: ["INTERNO"],
    areas: [availableAreasMock[2]],
    active: true,
  },
]

export const projectsMock: Project[] = [
  {
    id: "P001",
    title: "Detecção de presença com TinyML",
    proponent: "Profa. Ana Souza",
    members: ["Discente João", "Discente Maria"],
    areaHint: "CNPq: Inteligência Artificial",
  },
  {
    id: "P002",
    title: "Otimização de energia em datacenters",
    proponent: "Prof. Diego Ramos",
    members: ["Profa. Carla Mendes", "Discente Luiza"],
    areaHint: "CNPq: Ciência de Dados",
  },
  {
    id: "P003",
    title: "Ambientes virtuais para ensino médio",
    proponent: "Profa. Elisa Nunes",
    members: ["Discente Pedro"],
    areaHint: "CNAE: Educação",
  },
]

export const assignmentsMock: Assignment[] = [
  {
    id: "a1",
    callId: "c1",
    projectId: "P002",
    evaluatorId: "e2",
    blind: true,
    status: "PENDING",
    dueAt: "2025-09-20",
  },
  {
    id: "a2",
    callId: "c1",
    projectId: "P003",
    evaluatorId: "e1",
    blind: true,
    status: "SUBMITTED",
    dueAt: "2025-09-18",
  },
  {
    id: "a3",
    callId: "c1",
    projectId: "P001",
    evaluatorId: "e4",
    blind: true,
    status: "PENDING",
    dueAt: "2025-09-20",
  },
]

export function roleLabel(role: EvaluatorRole) {
  const map: Record<EvaluatorRole, string> = {
    INTERNO: "Interno",
    EXTERNO: "Externo",
    VOLUNTARIO: "Voluntário",
    PROPESQ: "PROPESQ",
  }

  return map[role]
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function formatDate(date?: string) {
  if (!date) return "Sem prazo"

  const [year, month, day] = date.split("-")

  if (!year || !month || !day) return "Sem prazo"

  return `${day}/${month}/${year}`
}

export function sortCallsByBaseYear(calls: Call[]) {
  return calls.slice().sort((a, b) => b.baseYear - a.baseYear)
}

export function filterAndSortEvaluators(
  evaluators: Evaluator[],
  input: {
    search: string
    typeFilter: EvaluatorTypeFilter
    statusFilter: EvaluatorStatusFilter
  },
) {
  const q = input.search.trim().toLowerCase()

  return evaluators
    .filter((evaluator) => {
      if (input.typeFilter !== "ALL" && evaluator.type !== input.typeFilter) {
        return false
      }
      if (input.statusFilter === "ACTIVE" && !evaluator.active) return false
      if (input.statusFilter === "INACTIVE" && evaluator.active) return false

      if (!q) return true

      return (
        evaluator.name.toLowerCase().includes(q) ||
        evaluator.email.toLowerCase().includes(q) ||
        evaluator.areas.some((area) => area.label.toLowerCase().includes(q)) ||
        evaluator.roles.some((role) =>
          roleLabel(role).toLowerCase().includes(q),
        )
      )
    })
    .sort(
      (a, b) =>
        Number(b.active) - Number(a.active) || a.name.localeCompare(b.name),
    )
}

export function assignmentsForCall(assignments: Assignment[], callId: string) {
  return assignments.filter((assignment) => assignment.callId === callId)
}

export function pendingAssignments(assignments: Assignment[]) {
  return assignments.filter((assignment) => assignment.status === "PENDING")
}

export function submittedAssignments(assignments: Assignment[]) {
  return assignments.filter((assignment) => assignment.status === "SUBMITTED")
}

export function countByEvaluator(
  assignments: Assignment[],
  evaluatorId: string,
) {
  return assignments.filter(
    (assignment) => assignment.evaluatorId === evaluatorId,
  ).length
}

export function getProject(projects: Project[], id: string) {
  return projects.find((project) => project.id === id) ?? null
}

export function getEvaluator(evaluators: Evaluator[], id: string) {
  return evaluators.find((evaluator) => evaluator.id === id) ?? null
}

export function buildNotifyPreview(input: {
  pending: Assignment[]
  evaluators: Evaluator[]
  projects: Project[]
  notifyRole: NotifyRoleMap
}): NotifyPreviewItem[] {
  const enabledRoles = new Set(
    (Object.keys(input.notifyRole) as EvaluatorRole[]).filter(
      (role) => input.notifyRole[role],
    ),
  )

  const map = new Map<string, NotifyPreviewItem>()

  input.pending.forEach((assignment) => {
    const evaluator = getEvaluator(input.evaluators, assignment.evaluatorId)
    const project = getProject(input.projects, assignment.projectId)

    if (!evaluator || !project) return
    if (!evaluator.active) return
    if (!evaluator.roles.some((role) => enabledRoles.has(role))) return

    let entry = map.get(evaluator.id)
    if (!entry) {
      entry = { evaluator, projects: [] }
      map.set(evaluator.id, entry)
    }

    entry.projects.push(project)
  })

  return Array.from(map.values()).sort((a, b) =>
    a.evaluator.name.localeCompare(b.evaluator.name),
  )
}

export function countActive(evaluators: Evaluator[]) {
  return evaluators.filter((evaluator) => evaluator.active).length
}

export function countByType(
  evaluators: Evaluator[],
  type: Evaluator["type"],
) {
  return evaluators.filter((evaluator) => evaluator.type === type).length
}
