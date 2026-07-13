import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  Download,
  Filter,
  GraduationCap,
  HeartHandshake,
  Medal,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { Helmet } from "react-helmet"

type QuotaSource = "CNPq" | "UFPB" | "VOLUNTARIO" | "NAO_CONTEMPLADO"

type QuotaStatus =
  | "CONTEMPLADO_CNPQ"
  | "CONTEMPLADO_UFPB"
  | "VOLUNTARIO"
  | "NAO_CONTEMPLADO"
  | "PENDENTE_REVISAO"

type QuotaDistributionItem = {
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

type QuotaSummary = {
  cnpqTotal: number
  ufpbTotal: number
}

type TabKey = "TODOS" | "CONTEMPLADOS" | "VOLUNTARIOS" | "PENDENCIAS"

const initialQuotaSummary: QuotaSummary = {
  cnpqTotal: 8,
  ufpbTotal: 7,
}

const rankingMock: QuotaDistributionItem[] = [
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
    eligibilityReason: "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
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
    eligibilityReason: "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
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
    eligibilityReason: "Apto com restrição — IFC menor que 7, somente se houver disponibilidade",
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
    eligibilityReason: "Pendente — projeto sem plano aprovado ou discente indicado",
  },
]

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getStatusLabel(status: QuotaStatus) {
  const labels: Record<QuotaStatus, string> = {
    CONTEMPLADO_CNPQ: "Contemplado CNPq",
    CONTEMPLADO_UFPB: "Contemplado UFPB",
    VOLUNTARIO: "Voluntário",
    NAO_CONTEMPLADO: "Não contemplado",
    PENDENTE_REVISAO: "Pendente",
  }

  return labels[status]
}

function getStatusClass(status: QuotaStatus) {
  const classes: Record<QuotaStatus, string> = {
    CONTEMPLADO_CNPQ:
      "border-blue-200 bg-blue-50 text-blue-700",
    CONTEMPLADO_UFPB:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    VOLUNTARIO:
      "border-violet-200 bg-violet-50 text-violet-700",
    NAO_CONTEMPLADO:
      "border-slate-200 bg-slate-50 text-slate-600",
    PENDENTE_REVISAO:
      "border-amber-200 bg-amber-50 text-amber-700",
  }

  return classes[status]
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-neutral-light bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral/70">{label}</p>
          <strong className="mt-2 block text-2xl font-semibold text-primary">
            {value}
          </strong>
          {description ? (
            <p className="mt-1 text-xs text-neutral/70">{description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}

function distributeQuotas(
  ranking: QuotaDistributionItem[],
  cnpqAvailable: number,
  ufpbAvailable: number,
  options: {
    applyNewDoctorReserve: boolean
    applyLeaveReserve: boolean
    applyPriorityAreaReserve: boolean
  }
) {
  const result = ranking.map((item) => ({
    ...item,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO" as QuotaSource,
    status:
      item.approvedPlans <= 0 || !item.studentName
        ? ("PENDENTE_REVISAO" as QuotaStatus)
        : ("NAO_CONTEMPLADO" as QuotaStatus),
  }))

  const coordinatorQuotaCount = new Map<string, number>()

  function getPriorityScore(item: QuotaDistributionItem) {
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

  const orderedRanking = [...result].sort((a, b) => {
    const priorityDifference = getPriorityScore(b) - getPriorityScore(a)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return a.rankingPosition - b.rankingPosition
  })

  function canReceiveQuota(item: QuotaDistributionItem) {
    const currentCount = coordinatorQuotaCount.get(item.coordinator) ?? 0

    if (item.approvedPlans <= 0) return false
    if (!item.studentName) return false

    if (item.ifc >= 7) {
      return currentCount < 2
    }

    return currentCount < 1
  }

  function assignQuota(item: QuotaDistributionItem, source: "CNPq" | "UFPB") {
    item.quotaSource = source
    item.status = source === "CNPq" ? "CONTEMPLADO_CNPQ" : "CONTEMPLADO_UFPB"
    item.assignedQuotas = 1

    const currentCount = coordinatorQuotaCount.get(item.coordinator) ?? 0
    coordinatorQuotaCount.set(item.coordinator, currentCount + 1)
  }

  for (const item of orderedRanking) {
    if (cnpqAvailable <= 0) break

    if (item.ifc >= 7 && canReceiveQuota(item)) {
      assignQuota(item, "CNPq")
      cnpqAvailable -= 1
    }
  }

  for (const item of orderedRanking) {
    if (ufpbAvailable <= 0) break

    if (item.status === "CONTEMPLADO_CNPQ") continue

    if (item.ifc >= 7 && canReceiveQuota(item)) {
      assignQuota(item, "UFPB")
      ufpbAvailable -= 1
    }
  }

  for (const item of orderedRanking) {
    if (ufpbAvailable <= 0) break

    if (item.status === "CONTEMPLADO_CNPQ") continue
    if (item.status === "CONTEMPLADO_UFPB") continue
    if (item.status === "PENDENTE_REVISAO") continue

    if (item.ifc < 7 && canReceiveQuota(item)) {
      assignQuota(item, "UFPB")
      ufpbAvailable -= 1
    }
  }

  for (const item of result) {
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

  return result.sort((a, b) => a.rankingPosition - b.rankingPosition)
}

function exportToCsv(items: QuotaDistributionItem[]) {
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
    item.isPriorityArea ? item.priorityAreaName ?? "Sim" : "Não",
    item.eligibilityReason,
  ])

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => {
          const cell = String(value).replace(/"/g, '""')
          return `"${cell}"`
        })
        .join(";")
    )
    .join("\n")

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

export default function Quotas() {
  const [search, setSearch] = useState("")
  const [selectedCenter, setSelectedCenter] = useState("TODOS")
  const [selectedSource, setSelectedSource] = useState("TODAS")
  const [selectedStatus, setSelectedStatus] = useState("TODOS")
  const [selectedTab, setSelectedTab] = useState<TabKey>("TODOS")

  const [applyNewDoctorReserve, setApplyNewDoctorReserve] = useState(true)
  const [applyLeaveReserve, setApplyLeaveReserve] = useState(true)
  const [applyPriorityAreaReserve, setApplyPriorityAreaReserve] =
    useState(true)

  const [distributionVersion, setDistributionVersion] = useState(1)

  const distribution = useMemo(() => {
    return distributeQuotas(
      rankingMock,
      initialQuotaSummary.cnpqTotal,
      initialQuotaSummary.ufpbTotal,
      {
        applyNewDoctorReserve,
        applyLeaveReserve,
        applyPriorityAreaReserve,
      }
    )
  }, [
    applyNewDoctorReserve,
    applyLeaveReserve,
    applyPriorityAreaReserve,
    distributionVersion,
  ])

  const centers = useMemo(() => {
    return Array.from(new Set(distribution.map((item) => item.center))).sort()
  }, [distribution])

  const filteredItems = useMemo(() => {
    return distribution.filter((item) => {
      const normalizedSearch = search.trim().toLowerCase()

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.coordinator.toLowerCase().includes(normalizedSearch) ||
        item.projectTitle.toLowerCase().includes(normalizedSearch) ||
        item.workPlanTitle.toLowerCase().includes(normalizedSearch) ||
        item.studentName?.toLowerCase().includes(normalizedSearch) ||
        item.area.toLowerCase().includes(normalizedSearch)

      const matchesCenter =
        selectedCenter === "TODOS" || item.center === selectedCenter

      const matchesSource =
        selectedSource === "TODAS" || item.quotaSource === selectedSource

      const matchesStatus =
        selectedStatus === "TODOS" || item.status === selectedStatus

      const matchesTab =
        selectedTab === "TODOS" ||
        (selectedTab === "CONTEMPLADOS" &&
          ["CONTEMPLADO_CNPQ", "CONTEMPLADO_UFPB"].includes(item.status)) ||
        (selectedTab === "VOLUNTARIOS" && item.status === "VOLUNTARIO") ||
        (selectedTab === "PENDENCIAS" && item.status === "PENDENTE_REVISAO")

      return (
        matchesSearch &&
        matchesCenter &&
        matchesSource &&
        matchesStatus &&
        matchesTab
      )
    })
  }, [
    distribution,
    search,
    selectedCenter,
    selectedSource,
    selectedStatus,
    selectedTab,
  ])

  const summary = useMemo(() => {
    const cnpqUsed = distribution.filter(
      (item) => item.status === "CONTEMPLADO_CNPQ"
    ).length

    const ufpbUsed = distribution.filter(
      (item) => item.status === "CONTEMPLADO_UFPB"
    ).length

    const volunteers = distribution.filter(
      (item) => item.status === "VOLUNTARIO"
    ).length

    const pending = distribution.filter(
      (item) => item.status === "PENDENTE_REVISAO"
    ).length

    const eligible = distribution.filter(
      (item) => item.approvedPlans > 0 && item.studentName
    ).length

    return {
      cnpqUsed,
      ufpbUsed,
      volunteers,
      pending,
      eligible,
      totalScholarships: cnpqUsed + ufpbUsed,
      cnpqRemaining: initialQuotaSummary.cnpqTotal - cnpqUsed,
      ufpbRemaining: initialQuotaSummary.ufpbTotal - ufpbUsed,
    }
  }, [distribution])

  function handleRegenerateDistribution() {
    setDistributionVersion((current) => current + 1)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Distribuição de Cotas • PROPESQ</title>
      </Helmet>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Botão voltar */}
        <div>
          <Link
            to="/adm/resultados/ranking"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Voltar para ranking
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Trophy size={14} />
                Cotas
              </div>

              <h1 className="mt-3 text-[28px] leading-tight font-bold tracking-tight text-primary">
                Distribuição de Cotas
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Geração da distribuição de bolsas CNPq e UFPB com base no
                ranking final classificatório, respeitando IFC, limite por
                pesquisador, planos aptos, reservas especiais e disponibilidade
                de cotas.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
              <button
                type="button"
                onClick={handleRegenerateDistribution}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCcw size={16} />
                Gerar distribuição
              </button>

              <button
                type="button"
                onClick={() => exportToCsv(distribution)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                <Download size={16} />
                Exportar lista final
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            icon={<Award size={22} />}
            label="Cotas CNPq"
            value={`${summary.cnpqUsed}/${initialQuotaSummary.cnpqTotal}`}
            description={`${summary.cnpqRemaining} cotas restantes`}
          />

          <SummaryCard
            icon={<Medal size={22} />}
            label="Cotas UFPB"
            value={`${summary.ufpbUsed}/${initialQuotaSummary.ufpbTotal}`}
            description={`${summary.ufpbRemaining} cotas restantes`}
          />

          <SummaryCard
            icon={<Users size={22} />}
            label="Projetos elegíveis"
            value={summary.eligible}
            description="Com plano aprovado e discente indicado"
          />

          <SummaryCard
            icon={<BadgeCheck size={22} />}
            label="Contemplados"
            value={summary.totalScholarships}
            description="CNPq + UFPB"
          />

          <SummaryCard
            icon={<HeartHandshake size={22} />}
            label="Voluntários"
            value={summary.volunteers}
            description={`${summary.pending} pendência(s) para revisar`}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-neutral-light bg-white p-6 shadow-card">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-primary">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-primary">
                  Regras aplicadas na distribuição
                </h2>
                <p className="mt-1 text-sm text-neutral/70">
                  A distribuição usa o ranking final como base e aplica a
                  ordem CNPq → UFPB.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
                <p className="text-sm font-semibold text-primary">
                  Pesquisador com IFC ≥ 7
                </p>
                <p className="mt-1 text-sm text-neutral/70">
                  Pode receber até 2 cotas, desde que tenha planos aprovados e
                  discentes indicados.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
                <p className="text-sm font-semibold text-primary">
                  Pesquisador com IFC menor que 7
                </p>
                <p className="mt-1 text-sm text-neutral/70">
                  Pode receber 1 cota somente se houver disponibilidade após a
                  distribuição principal.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
                <p className="text-sm font-semibold text-primary">
                  Ordem das fontes
                </p>
                <p className="mt-1 text-sm text-neutral/70">
                  Primeiro são atribuídas as cotas CNPq. Depois são atribuídas
                  as cotas UFPB.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
                <p className="text-sm font-semibold text-primary">
                  Planos sem bolsa
                </p>
                <p className="mt-1 text-sm text-neutral/70">
                  Planos aprovados não contemplados são mantidos como
                  voluntários.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-light bg-white p-6 shadow-card">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
                <Sparkles size={22} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-primary">
                  Reservas especiais
                </h2>
                <p className="mt-1 text-sm text-neutral/70">
                  Ative ou desative as reservas antes de gerar a distribuição.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-light p-4 transition hover:bg-neutral-light/40">
                <input
                  type="checkbox"
                  checked={applyNewDoctorReserve}
                  onChange={(event) =>
                    setApplyNewDoctorReserve(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-primary">
                    Recém-doutor
                  </span>
                  <span className="block text-sm text-neutral/70">
                    Prioriza candidatos marcados com reserva de recém-doutor.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-light p-4 transition hover:bg-neutral-light/40">
                <input
                  type="checkbox"
                  checked={applyLeaveReserve}
                  onChange={(event) =>
                    setApplyLeaveReserve(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-primary">
                    Licença-maternidade/licença-adotante
                  </span>
                  <span className="block text-sm text-neutral/70">
                    Considera reservas vinculadas a afastamento legal.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-light p-4 transition hover:bg-neutral-light/40">
                <input
                  type="checkbox"
                  checked={applyPriorityAreaReserve}
                  onChange={(event) =>
                    setApplyPriorityAreaReserve(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-primary">
                    Áreas prioritárias
                  </span>
                  <span className="block text-sm text-neutral/70">
                    Aplica prioridade para áreas definidas no edital.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-light bg-white shadow-card">
          <div className="border-b border-neutral-light p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">
                  Lista de distribuição
                </h2>
                <p className="mt-1 text-sm text-neutral/70">
                  Ranking final, fonte da cota, reservas e situação do plano.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral/50"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por projeto, coordenador ou discente"
                    className="h-11 w-full rounded-xl border border-neutral-light bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral/50 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-80"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-light bg-white px-4 text-sm font-semibold text-primary"
                >
                  <Filter size={16} />
                  Filtros
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <select
                value={selectedCenter}
                onChange={(event) => setSelectedCenter(event.target.value)}
                className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="TODOS">Todos os centros</option>
                {centers.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>

              <select
                value={selectedSource}
                onChange={(event) => setSelectedSource(event.target.value)}
                className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="TODAS">Todas as fontes</option>
                <option value="CNPq">CNPq</option>
                <option value="UFPB">UFPB</option>
                <option value="VOLUNTARIO">Voluntário</option>
                <option value="NAO_CONTEMPLADO">Não contemplado</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="TODOS">Todos os status</option>
                <option value="CONTEMPLADO_CNPQ">Contemplado CNPq</option>
                <option value="CONTEMPLADO_UFPB">Contemplado UFPB</option>
                <option value="VOLUNTARIO">Voluntário</option>
                <option value="PENDENTE_REVISAO">Pendente</option>
              </select>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { key: "TODOS", label: "Todos" },
                { key: "CONTEMPLADOS", label: "Contemplados" },
                { key: "VOLUNTARIOS", label: "Voluntários" },
                { key: "PENDENCIAS", label: "Pendências" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedTab(tab.key as TabKey)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedTab === tab.key
                      ? "bg-primary text-white shadow-sm"
                      : "border border-neutral-light bg-white text-neutral hover:bg-neutral-light/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-light bg-neutral-light/50">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Class.
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Coordenador
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Projeto / Plano
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    IFC
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Fonte
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Reservas
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    Elegibilidade
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-light transition hover:bg-neutral-light/30"
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-light bg-white text-sm font-semibold text-primary">
                        {item.rankingPosition}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="font-semibold text-primary">
                        {item.coordinator}
                      </div>
                      <div className="mt-1 text-sm text-neutral/70">
                        {item.center} • {item.area}
                      </div>
                      <div className="mt-1 text-xs text-neutral/50">
                        Planos aprovados: {item.approvedPlans}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="max-w-xl font-medium text-primary">
                        {item.projectTitle}
                      </div>
                      <div className="mt-1 text-sm text-neutral/70">
                        {item.workPlanTitle}
                      </div>
                      <div className="mt-1 text-xs text-neutral/50">
                        Discente: {item.studentName ?? "Não indicado"}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="font-semibold text-primary">
                        {formatNumber(item.ifc)}
                      </div>
                      <div className="mt-1 text-xs text-neutral/70">
                        NP {formatNumber(item.np)} • FPPI{" "}
                        {formatNumber(item.fppi)}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      {item.quotaSource === "CNPq" ? (
                        <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                          CNPq
                        </Badge>
                      ) : null}

                      {item.quotaSource === "UFPB" ? (
                        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          UFPB
                        </Badge>
                      ) : null}

                      {item.quotaSource === "VOLUNTARIO" ? (
                        <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                          Voluntário
                        </Badge>
                      ) : null}

                      {item.quotaSource === "NAO_CONTEMPLADO" ? (
                        <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                          -
                        </Badge>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {item.isNewDoctor ? (
                          <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700">
                            <GraduationCap size={12} className="mr-1" />
                            Recém-doutor
                          </Badge>
                        ) : null}

                        {item.hasMaternityLeave ? (
                          <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                            Licença-maternidade
                          </Badge>
                        ) : null}

                        {item.hasAdoptionLeave ? (
                          <Badge className="border-pink-200 bg-pink-50 text-pink-700">
                            Licença-adotante
                          </Badge>
                        ) : null}

                        {item.isPriorityArea ? (
                          <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                            {item.priorityAreaName ?? "Área prioritária"}
                          </Badge>
                        ) : null}

                        {!item.isNewDoctor &&
                        !item.hasMaternityLeave &&
                        !item.hasAdoptionLeave &&
                        !item.isPriorityArea ? (
                          <span className="text-sm text-neutral/50">-</span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <Badge className={getStatusClass(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex max-w-sm items-start gap-2 text-sm text-neutral/70">
                        {item.status === "PENDENTE_REVISAO" ? (
                          <AlertTriangle
                            size={16}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />
                        ) : (
                          <BarChart3
                            size={16}
                            className="mt-0.5 shrink-0 text-neutral/40"
                          />
                        )}
                        <span>{item.eligibilityReason}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-light bg-neutral-light/50 text-neutral/50">
                          <Search size={20} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-primary">
                          Nenhum resultado encontrado
                        </h3>
                        <p className="mt-1 text-sm text-neutral/70">
                          Ajuste os filtros ou limpe a busca para visualizar a
                          distribuição.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}