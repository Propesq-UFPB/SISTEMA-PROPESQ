export type Call = {
  id: string
  title: string
  baseYear: number
  statusLabel: string
}

export type Area = {
  id: string
  label: string
  source: "CNPq" | "CNAE"
}

export type EvaluatorRole = "INTERNO" | "EXTERNO" | "VOLUNTARIO" | "PROPESQ"

export type Evaluator = {
  id: string
  name: string
  email: string
  type: "INTERNO" | "EXTERNO"
  roles: EvaluatorRole[]
  areas: Area[]
  active: boolean
}

export type Project = {
  id: string
  title: string
  proponent: string
  members: string[]
  areaHint: string
}

export type Assignment = {
  id: string
  callId: string
  projectId: string
  evaluatorId: string
  blind: boolean
  status: "PENDING" | "SUBMITTED"
  dueAt?: string
  lastReminderAt?: string
}

export type EvaluatorTypeFilter = "ALL" | "INTERNO" | "EXTERNO"

export type EvaluatorStatusFilter = "ALL" | "ACTIVE" | "INACTIVE"

export type NotifyRoleMap = Record<EvaluatorRole, boolean>

export type NotifyPreviewItem = {
  evaluator: Evaluator
  projects: Project[]
}
