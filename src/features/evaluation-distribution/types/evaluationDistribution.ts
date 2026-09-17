export type ProjectStatus =
  | "SUBMETIDO"
  | "DISTRIBUIDO"
  | "PENDENTE"
  | "RECUSADO"
  | "INCOMPLETO"

export type AssignmentStatus = "PENDENTE" | "ACEITO" | "RECUSADO"

export type DistributableProject = {
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

export type Evaluator = {
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

export type Assignment = {
  id: number
  projectId: number
  evaluatorId: number
  status: AssignmentStatus
  reason?: string
  sentAt: string
}

export type DraftAssignment = {
  id: number
  projectId: number
  evaluatorId: number
  score: number
  generatedBy: "AUTO"
}

export type DistributionIssue = {
  projectId: number
  missing: number
  reason: string
}

export type DistributionPreview = {
  draftAssignments: DraftAssignment[]
  issues: DistributionIssue[]
}
