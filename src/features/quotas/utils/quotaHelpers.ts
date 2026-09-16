import type {
  QuotaDistributionItem,
  QuotaListFilters,
  QuotaReserveOptions,
  QuotaStatus,
  QuotaSummary,
  QuotaUsageSummary,
} from "../types/quotas"

export const initialQuotaSummary: QuotaSummary = {
  cnpqTotal: 8,
  ufpbTotal: 7,
}

export const rankingMock: QuotaDistributionItem[] = [
  {
    id: "1",
    rankingPosition: 1,
    coordinator: "Ana Beatriz Costa",
    center: "CI",
    area: "Ciência da Computação",
    projectTitle: "Modelos Inteligentes para Acessibilidade Digital",
    workPlanTitle: "Treinamento e avaliação de modelos de tradução automática",
    studentName: "Lucas Almeida",
    np: 9.4,
    ipi: 180,
    fppi: 10,
    ifc: 9.82,
    approvedPlans: 2,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    isPriorityArea: true,
    priorityAreaName: "Tecnologias Assistivas",
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "2",
    rankingPosition: 2,
    coordinator: "Carlos Henrique Lima",
    center: "CT",
    area: "Engenharia Elétrica",
    projectTitle: "Sistemas de Monitoramento para Eficiência Energética",
    workPlanTitle: "Análise de dados de consumo energético",
    studentName: "Mariana Santos",
    np: 9.1,
    ipi: 154,
    fppi: 10,
    ifc: 9.73,
    approvedPlans: 2,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "3",
    rankingPosition: 3,
    coordinator: "Fernanda Rocha",
    center: "CCS",
    area: "Saúde Coletiva",
    projectTitle: "Indicadores de Saúde Materno-Infantil",
    workPlanTitle: "Construção de base analítica para acompanhamento regional",
    studentName: "Pedro Martins",
    np: 8.8,
    ipi: 142,
    fppi: 9.47,
    ifc: 9.27,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    hasMaternityLeave: true,
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "4",
    rankingPosition: 4,
    coordinator: "João Paulo Medeiros",
    center: "CCHLA",
    area: "Linguística",
    projectTitle: "Corpus Digital para Estudos Linguísticos",
    workPlanTitle: "Curadoria e anotação de dados textuais",
    studentName: "Rafaela Nunes",
    np: 8.6,
    ipi: 130,
    fppi: 8.67,
    ifc: 8.65,
    approvedPlans: 2,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    isNewDoctor: true,
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "5",
    rankingPosition: 5,
    coordinator: "Patrícia Gomes",
    center: "CCEN",
    area: "Matemática",
    projectTitle: "Métodos Numéricos Aplicados à Modelagem Científica",
    workPlanTitle: "Implementação de algoritmos para simulação",
    studentName: "André Oliveira",
    np: 8.2,
    ipi: 121,
    fppi: 8.07,
    ifc: 8.11,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "6",
    rankingPosition: 6,
    coordinator: "Roberto Nascimento",
    center: "CCA",
    area: "Agronomia",
    projectTitle: "Soluções Sustentáveis para Agricultura Familiar",
    workPlanTitle: "Mapeamento de práticas sustentáveis",
    studentName: "Bianca Freitas",
    np: 8.0,
    ipi: 110,
    fppi: 7.33,
    ifc: 7.53,
    approvedPlans: 2,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    isPriorityArea: true,
    priorityAreaName: "Sustentabilidade",
    eligibilityReason: "Apto — IFC maior ou igual a 7",
  },
  {
    id: "7",
    rankingPosition: 7,
    coordinator: "Luciana Araújo",
    center: "CE",
    area: "Educação",
    projectTitle: "Tecnologias Educacionais para Inclusão",
    workPlanTitle: "Avaliação de recursos digitais inclusivos",
    studentName: "Thiago Ribeiro",
    np: 7.7,
    ipi: 100,
    fppi: 6.67,
    ifc: 6.98,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    hasAdoptionLeave: true,
    eligibilityReason:
      "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
  },
  {
    id: "8",
    rankingPosition: 8,
    coordinator: "Mateus Ferreira",
    center: "CCTA",
    area: "Comunicação",
    projectTitle: "Narrativas Digitais e Difusão Científica",
    workPlanTitle: "Produção de materiais de comunicação científica",
    studentName: "Clara Barbosa",
    np: 7.4,
    ipi: 92,
    fppi: 6.13,
    ifc: 6.51,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    eligibilityReason:
      "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
  },
  {
    id: "9",
    rankingPosition: 9,
    coordinator: "Renata Cavalcanti",
    center: "CCJ",
    area: "Direito",
    projectTitle: "Direitos Digitais e Governança de Dados",
    workPlanTitle: "Levantamento normativo e análise documental",
    studentName: "Gabriel Dias",
    np: 7.1,
    ipi: 85,
    fppi: 5.67,
    ifc: 6.1,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    eligibilityReason:
      "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
  },
  {
    id: "10",
    rankingPosition: 10,
    coordinator: "Sofia Martins",
    center: "CCM",
    area: "Medicina",
    projectTitle: "Triagem Inteligente de Dados Clínicos",
    workPlanTitle: "Organização de base de dados para análise exploratória",
    studentName: undefined,
    np: 8.7,
    ipi: 120,
    fppi: 8,
    ifc: 8.21,
    approvedPlans: 0,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "PENDENTE_REVISAO",
    eligibilityReason:
      "Pendente — projeto sem plano aprovado ou discente indicado",
  },
]

export function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function getStatusLabel(status: QuotaStatus) {
  const labels: Record<QuotaStatus, string> = {
    CONTEMPLADO_CNPQ: "Contemplado CNPq",
    CONTEMPLADO_UFPB: "Contemplado UFPB",
    VOLUNTARIO: "Voluntário",
    NAO_CONTEMPLADO: "Não contemplado",
    PENDENTE_REVISAO: "Pendente",
  }

  return labels[status]
}

export function getStatusClass(status: QuotaStatus) {
  const classes: Record<QuotaStatus, string> = {
    CONTEMPLADO_CNPQ: "border-blue-200 bg-blue-50 text-blue-700",
    CONTEMPLADO_UFPB: "border-emerald-200 bg-emerald-50 text-emerald-700",
    VOLUNTARIO: "border-violet-200 bg-violet-50 text-violet-700",
    NAO_CONTEMPLADO: "border-slate-200 bg-slate-50 text-slate-600",
    PENDENTE_REVISAO: "border-amber-200 bg-amber-50 text-amber-700",
  }

  return classes[status]
}

export function uniqueCenters(items: readonly QuotaDistributionItem[]) {
  const centers = new Set<string>()

  for (const item of items) {
    centers.add(item.center)
  }

  return Array.from(centers).sort((a, b) => a.localeCompare(b, "pt-BR"))
}

export function filterQuotaItems(
  items: readonly QuotaDistributionItem[],
  filters: QuotaListFilters,
) {
  return items.filter((item) => {
    const normalizedSearch = filters.search.trim().toLowerCase()

    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.coordinator.toLowerCase().includes(normalizedSearch) ||
      item.projectTitle.toLowerCase().includes(normalizedSearch) ||
      item.workPlanTitle.toLowerCase().includes(normalizedSearch) ||
      item.studentName?.toLowerCase().includes(normalizedSearch) ||
      item.area.toLowerCase().includes(normalizedSearch)

    const matchesCenter =
      filters.selectedCenter === "TODOS" || item.center === filters.selectedCenter

    const matchesSource =
      filters.selectedSource === "TODAS" ||
      item.quotaSource === filters.selectedSource

    const matchesStatus =
      filters.selectedStatus === "TODOS" || item.status === filters.selectedStatus

    const matchesTab =
      filters.selectedTab === "TODOS" ||
      (filters.selectedTab === "CONTEMPLADOS" &&
        (item.status === "CONTEMPLADO_CNPQ" ||
          item.status === "CONTEMPLADO_UFPB")) ||
      (filters.selectedTab === "VOLUNTARIOS" && item.status === "VOLUNTARIO") ||
      (filters.selectedTab === "PENDENCIAS" && item.status === "PENDENTE_REVISAO")

    return (
      matchesSearch &&
      matchesCenter &&
      matchesSource &&
      matchesStatus &&
      matchesTab
    )
  })
}

export function calcQuotaSummary(
  distribution: readonly QuotaDistributionItem[],
  totals: QuotaSummary,
): QuotaUsageSummary {
  const cnpqUsed = distribution.filter(
    (item) => item.status === "CONTEMPLADO_CNPQ",
  ).length

  const ufpbUsed = distribution.filter(
    (item) => item.status === "CONTEMPLADO_UFPB",
  ).length

  const volunteers = distribution.filter(
    (item) => item.status === "VOLUNTARIO",
  ).length

  const pending = distribution.filter(
    (item) => item.status === "PENDENTE_REVISAO",
  ).length

  const eligible = distribution.filter(
    (item) => item.approvedPlans > 0 && item.studentName,
  ).length

  return {
    cnpqUsed,
    ufpbUsed,
    volunteers,
    pending,
    eligible,
    totalScholarships: cnpqUsed + ufpbUsed,
    cnpqRemaining: totals.cnpqTotal - cnpqUsed,
    ufpbRemaining: totals.ufpbTotal - ufpbUsed,
  }
}

function isMissingPlanOrStudent(item: QuotaDistributionItem) {
  return item.approvedPlans <= 0 || !item.studentName
}

function initialDistributionItem(item: QuotaDistributionItem): QuotaDistributionItem {
  return {
    ...item,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: isMissingPlanOrStudent(item)
      ? "PENDENTE_REVISAO"
      : "NAO_CONTEMPLADO",
  }
}

function getPriorityScore(
  item: QuotaDistributionItem,
  options: QuotaReserveOptions,
) {
  let score = 0

  if (options.applyNewDoctorReserve && item.isNewDoctor) score += 3

  if (
    options.applyLeaveReserve &&
    (item.hasMaternityLeave || item.hasAdoptionLeave)
  ) {
    score += 3
  }

  if (options.applyPriorityAreaReserve && item.isPriorityArea) score += 2

  return score
}

function orderByReserveThenRanking(
  items: QuotaDistributionItem[],
  options: QuotaReserveOptions,
) {
  return [...items].sort((a, b) => {
    const priorityDifference =
      getPriorityScore(b, options) - getPriorityScore(a, options)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return a.rankingPosition - b.rankingPosition
  })
}

function canReceiveQuota(
  item: QuotaDistributionItem,
  coordinatorQuotaCount: Map<string, number>,
) {
  const currentCount = coordinatorQuotaCount.get(item.coordinator) ?? 0

  if (item.approvedPlans <= 0) return false
  if (!item.studentName) return false

  if (item.ifc >= 7) {
    return currentCount < 2
  }

  return currentCount < 1
}

function assignQuota(
  item: QuotaDistributionItem,
  source: "CNPq" | "UFPB",
  coordinatorQuotaCount: Map<string, number>,
) {
  item.quotaSource = source
  item.status = source === "CNPq" ? "CONTEMPLADO_CNPQ" : "CONTEMPLADO_UFPB"
  item.assignedQuotas = 1

  const currentCount = coordinatorQuotaCount.get(item.coordinator) ?? 0
  coordinatorQuotaCount.set(item.coordinator, currentCount + 1)
}

function assignFromPool(
  orderedRanking: QuotaDistributionItem[],
  available: number,
  coordinatorQuotaCount: Map<string, number>,
  source: "CNPq" | "UFPB",
  shouldAssign: (item: QuotaDistributionItem) => boolean,
) {
  let remaining = available

  for (const item of orderedRanking) {
    if (remaining <= 0) break

    if (!shouldAssign(item) || !canReceiveQuota(item, coordinatorQuotaCount)) {
      continue
    }

    assignQuota(item, source, coordinatorQuotaCount)
    remaining -= 1
  }

  return remaining
}

function isHighIfc(item: QuotaDistributionItem) {
  return item.ifc >= 7
}

function isHighIfcWithoutCnpq(item: QuotaDistributionItem) {
  return item.status !== "CONTEMPLADO_CNPQ" && item.ifc >= 7
}

function isLowIfcResidual(item: QuotaDistributionItem) {
  return (
    item.status !== "CONTEMPLADO_CNPQ" &&
    item.status !== "CONTEMPLADO_UFPB" &&
    item.status !== "PENDENTE_REVISAO" &&
    item.ifc < 7
  )
}

function finalizeUnassigned(items: QuotaDistributionItem[]) {
  for (const item of items) {
    if (item.status === "PENDENTE_REVISAO") {
      item.quotaSource = "NAO_CONTEMPLADO"
      continue
    }

    if (
      item.status !== "CONTEMPLADO_CNPQ" &&
      item.status !== "CONTEMPLADO_UFPB"
    ) {
      item.quotaSource = "VOLUNTARIO"
      item.status = "VOLUNTARIO"
    }
  }
}

export function distributeQuotas(
  ranking: QuotaDistributionItem[],
  cnpqAvailable: number,
  ufpbAvailable: number,
  options: QuotaReserveOptions,
) {
  const result = ranking.map(initialDistributionItem)
  const coordinatorQuotaCount = new Map<string, number>()
  const orderedRanking = orderByReserveThenRanking(result, options)

  assignFromPool(
    orderedRanking,
    cnpqAvailable,
    coordinatorQuotaCount,
    "CNPq",
    isHighIfc,
  )

  const ufpbRemaining = assignFromPool(
    orderedRanking,
    ufpbAvailable,
    coordinatorQuotaCount,
    "UFPB",
    isHighIfcWithoutCnpq,
  )

  assignFromPool(
    orderedRanking,
    ufpbRemaining,
    coordinatorQuotaCount,
    "UFPB",
    isLowIfcResidual,
  )

  finalizeUnassigned(result)

  return result.sort((a, b) => a.rankingPosition - b.rankingPosition)
}

export function buildQuotaCsv(items: readonly QuotaDistributionItem[]) {
  const headers = [
    "Classificação",
    "Coordenador",
    "Centro/Unidade",
    "Área",
    "Projeto",
    "Plano de trabalho",
    "Discente",
    "NP",
    "IPI",
    "FPPI",
    "IFC",
    "Planos aprovados",
    "Fonte",
    "Status",
    "Reserva recém-doutor",
    "Licença maternidade",
    "Licença adotante",
    "Área prioritária",
    "Justificativa",
  ]

  const rows = items.map((item) => [
    item.rankingPosition,
    item.coordinator,
    item.center,
    item.area,
    item.projectTitle,
    item.workPlanTitle,
    item.studentName ?? "-",
    item.np,
    item.ipi,
    item.fppi,
    item.ifc,
    item.approvedPlans,
    item.quotaSource,
    getStatusLabel(item.status),
    item.isNewDoctor ? "Sim" : "Não",
    item.hasMaternityLeave ? "Sim" : "Não",
    item.hasAdoptionLeave ? "Sim" : "Não",
    item.isPriorityArea ? (item.priorityAreaName ?? "Sim") : "Não",
    item.eligibilityReason,
  ])

  return [headers, ...rows]
    .map((row) =>
      row
        .map((value) => {
          const cell = String(value).replaceAll('"', '""')
          return `"${cell}"`
        })
        .join(";"),
    )
    .join("\n")
}

export function exportToCsv(items: QuotaDistributionItem[]) {
  const csvContent = buildQuotaCsv(items)
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = "distribuicao-final-cotas.csv"
  link.click()

  URL.revokeObjectURL(url)
}
