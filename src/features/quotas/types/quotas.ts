export type QuotaSource = "CNPq" | "UFPB" | "VOLUNTARIO" | "NAO_CONTEMPLADO"

export type QuotaStatus =
  | "CONTEMPLADO_CNPQ"
  | "CONTEMPLADO_UFPB"
  | "VOLUNTARIO"
  | "NAO_CONTEMPLADO"
  | "PENDENTE_REVISAO"

export type QuotaDistributionItem = {
  id: string
  rankingPosition: number
  coordinator: string
  center: string
  area: string
  projectTitle: string
  workPlanTitle: string
  studentName?: string
  np: number
  ipi: number
  fppi: number
  ifc: number
  approvedPlans: number
  assignedQuotas: number
  quotaSource: QuotaSource
  status: QuotaStatus
  isNewDoctor?: boolean
  hasMaternityLeave?: boolean
  hasAdoptionLeave?: boolean
  isPriorityArea?: boolean
  priorityAreaName?: string
  eligibilityReason: string
}

export type QuotaSummary = {
  cnpqTotal: number
  ufpbTotal: number
}

export type TabKey = "TODOS" | "CONTEMPLADOS" | "VOLUNTARIOS" | "PENDENCIAS"

export type QuotaReserveOptions = {
  applyNewDoctorReserve: boolean
  applyLeaveReserve: boolean
  applyPriorityAreaReserve: boolean
}

export type QuotaListFilters = {
  search: string
  selectedCenter: string
  selectedSource: string
  selectedStatus: string
  selectedTab: TabKey
}

export type QuotaUsageSummary = {
  cnpqUsed: number
  ufpbUsed: number
  volunteers: number
  pending: number
  eligible: number
  totalScholarships: number
  cnpqRemaining: number
  ufpbRemaining: number
}
