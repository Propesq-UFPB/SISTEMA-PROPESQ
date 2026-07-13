import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Filter,
  Notebook,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"

type IndicationStatus =
  | "Pendente de indicação"
  | "Discente indicado"
  | "Aguardando validação"
  | "Indicação aprovada"
  | "Indicação recusada"

type Modality = "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"

type CommitmentTermStatus =
  | "Não enviado"
  | "Aguardando aceite"
  | "Aceito na Plataforma Carlos Chagas"
  | "Pendente de correção"

type Candidate = {
  id: number
  name: string
  registration: string
  course: string
  semester: string
  cra: string
  completedCredits: number
  failures: number
  academicStatus: string
  email: string
  lattesUrl: string
  interestRegisteredAt: string
  sigaaStatus: "Interesse registrado" | "Documentação pendente" | "Apto para indicação"
}

type BankData = {
  bankName: string
  agency: string
  account: string
}

type IndicationPlan = {
  id: number
  projectId: number
  projectTitle: string
  planTitle: string
  edital: string
  ano: string
  area: string
  modality: Modality
  vacancies: number
  workload: number
  status: IndicationStatus
  approvedAt: string
  validityStart: string
  validityEnd: string
  indicationDeadline: string
  substitutionDeadline: string
  commitmentTermStatus: CommitmentTermStatus
  indicatedStudent: Candidate | null
  indicationType: "Bolsista" | "Voluntário" | null
  bankData: BankData | null
  candidates: Candidate[]
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Ana Beatriz Santos",
    registration: "20230014567",
    course: "Ciência da Computação",
    semester: "5º período",
    cra: "8.7",
    completedCredits: 112,
    failures: 0,
    academicStatus: "Regular",
    email: "ana.beatriz@academico.ufpb.br",
    lattesUrl: "https://lattes.cnpq.br/0000000000000001",
    interestRegisteredAt: "12/05/2026",
    sigaaStatus: "Apto para indicação",
  },
  {
    id: 2,
    name: "João Victor Almeida",
    registration: "20220017890",
    course: "Ciência de Dados e Inteligência Artificial",
    semester: "6º período",
    cra: "8.4",
    completedCredits: 138,
    failures: 1,
    academicStatus: "Regular",
    email: "joao.victor@academico.ufpb.br",
    lattesUrl: "https://lattes.cnpq.br/0000000000000002",
    interestRegisteredAt: "13/05/2026",
    sigaaStatus: "Apto para indicação",
  },
  {
    id: 3,
    name: "Mariana Costa Lima",
    registration: "20210011223",
    course: "Engenharia de Computação",
    semester: "7º período",
    cra: "9.1",
    completedCredits: 164,
    failures: 0,
    academicStatus: "Regular",
    email: "mariana.lima@academico.ufpb.br",
    lattesUrl: "https://lattes.cnpq.br/0000000000000003",
    interestRegisteredAt: "14/05/2026",
    sigaaStatus: "Interesse registrado",
  },
  {
    id: 4,
    name: "Pedro Henrique Silva",
    registration: "20240015678",
    course: "Ciência da Computação",
    semester: "3º período",
    cra: "7.9",
    completedCredits: 72,
    failures: 1,
    academicStatus: "Regular",
    email: "pedro.silva@academico.ufpb.br",
    lattesUrl: "https://lattes.cnpq.br/0000000000000004",
    interestRegisteredAt: "15/05/2026",
    sigaaStatus: "Documentação pendente",
  },
]

const initialPlans: IndicationPlan[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Interação Humano-Computador",
    modality: "Bolsista",
    vacancies: 1,
    workload: 20,
    status: "Indicação aprovada",
    approvedAt: "10/05/2026",
    validityStart: "01/09/2026",
    validityEnd: "31/08/2027",
    indicationDeadline: "01/10/2026",
    substitutionDeadline: "10/06/2027",
    commitmentTermStatus: "Aceito na Plataforma Carlos Chagas",
    indicatedStudent: candidates[0],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Banco do Brasil",
      agency: "1234-5",
      account: "98765-4",
    },
    candidates: [candidates[0], candidates[1], candidates[2]],
  },
  {
    id: 2,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Análise de dados de uso em ferramentas de acessibilidade",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Ciência de Dados",
    modality: "Voluntário",
    vacancies: 1,
    workload: 12,
    status: "Pendente de indicação",
    approvedAt: "10/05/2026",
    validityStart: "01/09/2026",
    validityEnd: "31/08/2027",
    indicationDeadline: "01/10/2026",
    substitutionDeadline: "10/06/2027",
    commitmentTermStatus: "Não enviado",
    indicatedStudent: null,
    indicationType: null,
    bankData: null,
    candidates: [candidates[1], candidates[3]],
  },
  {
    id: 3,
    projectId: 2,
    projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    planTitle: "Construção de painel analítico para acompanhamento acadêmico",
    edital: "PIBITI 2026",
    ano: "2026",
    area: "Ciência de Dados",
    modality: "Bolsista ou Voluntário",
    vacancies: 1,
    workload: 20,
    status: "Aguardando validação",
    approvedAt: "09/05/2026",
    validityStart: "01/09/2026",
    validityEnd: "31/08/2027",
    indicationDeadline: "01/10/2026",
    substitutionDeadline: "10/06/2027",
    commitmentTermStatus: "Aguardando aceite",
    indicatedStudent: candidates[1],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Caixa Econômica Federal",
      agency: "0021",
      account: "45678-9",
    },
    candidates: [candidates[1], candidates[2]],
  },
  {
    id: 4,
    projectId: 3,
    projectTitle: "Modelos Inteligentes para Apoio à Gestão de Projetos de Pesquisa",
    planTitle: "Implementação de módulo inteligente para triagem de propostas",
    edital: "PIBIC 2025",
    ano: "2025",
    area: "Inteligência Artificial",
    modality: "Bolsista",
    vacancies: 1,
    workload: 20,
    status: "Indicação recusada",
    approvedAt: "30/04/2026",
    validityStart: "01/09/2025",
    validityEnd: "31/08/2026",
    indicationDeadline: "01/10/2025",
    substitutionDeadline: "10/06/2026",
    commitmentTermStatus: "Pendente de correção",
    indicatedStudent: candidates[2],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Banco do Brasil",
      agency: "3344-1",
      account: "10203-6",
    },
    candidates: [candidates[2], candidates[0]],
  },
]

const editalOptions = ["Todos", "PIBIC 2026", "PIBITI 2026", "PIBIC 2025"]

const statusOptions: Array<IndicationStatus | "Todos"> = [
  "Todos",
  "Pendente de indicação",
  "Discente indicado",
  "Aguardando validação",
  "Indicação aprovada",
  "Indicação recusada",
]

const modalityOptions: Array<Modality | "Todos"> = [
  "Todos",
  "Bolsista",
  "Voluntário",
  "Bolsista ou Voluntário",
]

const termOptions: Array<CommitmentTermStatus | "Todos"> = [
  "Todos",
  "Não enviado",
  "Aguardando aceite",
  "Aceito na Plataforma Carlos Chagas",
  "Pendente de correção",
]

const yearOptions = ["Todos", "2026", "2025"]

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

function getStatusClass(status: IndicationStatus) {
  switch (status) {
    case "Indicação aprovada":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aguardando validação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Discente indicado":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Indicação recusada":
      return "border-red-200 bg-red-50 text-red-700"
    case "Pendente de indicação":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function getStatusIcon(status: IndicationStatus) {
  switch (status) {
    case "Indicação aprovada":
      return <CheckCircle2 size={14} />
    case "Aguardando validação":
      return <ClipboardList size={14} />
    case "Discente indicado":
      return <UserCheck size={14} />
    case "Indicação recusada":
      return <XCircle size={14} />
    case "Pendente de indicação":
    default:
      return <AlertCircle size={14} />
  }
}

function getModalityClass(modality: Modality) {
  switch (modality) {
    case "Bolsista":
      return "border-primary/20 bg-primary/5 text-primary"
    case "Voluntário":
      return "border-sky-200 bg-sky-50 text-sky-700"
    case "Bolsista ou Voluntário":
    default:
      return "border-violet-200 bg-violet-50 text-violet-700"
  }
}

function getTermClass(status: CommitmentTermStatus) {
  switch (status) {
    case "Aceito na Plataforma Carlos Chagas":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aguardando aceite":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Pendente de correção":
      return "border-red-200 bg-red-50 text-red-700"
    case "Não enviado":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function getSigaaStatusClass(status: Candidate["sigaaStatus"]) {
  switch (status) {
    case "Apto para indicação":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Documentação pendente":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Interesse registrado":
    default:
      return "border-blue-200 bg-blue-50 text-blue-700"
  }
}

export default function CoordinatorIndication() {
  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState<IndicationStatus | "Todos">("Todos")
  const [selectedModality, setSelectedModality] = useState<Modality | "Todos">("Todos")
  const [selectedTermStatus, setSelectedTermStatus] = useState<CommitmentTermStatus | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")

  const filteredPlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return initialPlans.filter((plan) => {
      const matchesSearch =
        !normalizedSearch ||
        plan.planTitle.toLowerCase().includes(normalizedSearch) ||
        plan.projectTitle.toLowerCase().includes(normalizedSearch) ||
        plan.area.toLowerCase().includes(normalizedSearch) ||
        plan.edital.toLowerCase().includes(normalizedSearch) ||
        plan.indicatedStudent?.name.toLowerCase().includes(normalizedSearch) ||
        plan.indicatedStudent?.registration.toLowerCase().includes(normalizedSearch) ||
        plan.candidates.some(
          (candidate) =>
            candidate.name.toLowerCase().includes(normalizedSearch) ||
            candidate.registration.toLowerCase().includes(normalizedSearch) ||
            candidate.course.toLowerCase().includes(normalizedSearch)
        )

      const matchesEdital = selectedEdital === "Todos" || plan.edital === selectedEdital
      const matchesStatus = selectedStatus === "Todos" || plan.status === selectedStatus
      const matchesModality = selectedModality === "Todos" || plan.modality === selectedModality
      const matchesTerm =
        selectedTermStatus === "Todos" || plan.commitmentTermStatus === selectedTermStatus
      const matchesYear = selectedYear === "Todos" || plan.ano === selectedYear

      return matchesSearch && matchesEdital && matchesStatus && matchesModality && matchesTerm && matchesYear
    })
  }, [search, selectedEdital, selectedStatus, selectedModality, selectedTermStatus, selectedYear])

  const summary = useMemo(() => {
    const totalPlans = initialPlans.length
    const pending = initialPlans.filter((plan) => plan.status === "Pendente de indicação").length
    const indicated = initialPlans.filter((plan) => plan.indicatedStudent).length
    const acceptedTerms = initialPlans.filter(
      (plan) => plan.commitmentTermStatus === "Aceito na Plataforma Carlos Chagas"
    ).length
    const totalCandidates = initialPlans.reduce((acc, plan) => acc + plan.candidates.length, 0)

    return {
      totalPlans,
      pending,
      indicated,
      acceptedTerms,
      totalCandidates,
    }
  }, [])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedStatus("Todos")
    setSelectedModality("Todos")
    setSelectedTermStatus("Todos")
    setSelectedYear("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Notebook size={14} />
              Planos de trabalho
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Indicações para Planos de Trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Acompanhe os planos aprovados, veja os discentes interessados via SIGAA e acesse a página de detalhes para
              confirmar indicação ou substituição.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Planos filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredPlans.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {initialPlans.length} plano(s)
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Planos"
            value={summary.totalPlans}
            description="Disponíveis para indicação"
            icon={<Notebook size={20} />}
            iconClassName="bg-primary/10 text-primary"
          />

          <SummaryCard
            label="Candidatos"
            value={summary.totalCandidates}
            description="Interesse via SIGAA"
            icon={<Users size={20} />}
            iconClassName="bg-sky-50 text-sky-700"
          />

          <SummaryCard
            label="Pendentes"
            value={summary.pending}
            description="Aguardando indicação"
            icon={<AlertCircle size={20} />}
            iconClassName="bg-amber-50 text-amber-700"
          />

          <SummaryCard
            label="Indicados"
            value={summary.indicated}
            description="Com discente vinculado"
            icon={<UserCheck size={20} />}
            iconClassName="bg-blue-50 text-blue-700"
          />

          <SummaryCard
            label="Termos aceitos"
            value={summary.acceptedTerms}
            description="Plataforma Carlos Chagas"
            icon={<ShieldCheck size={20} />}
            iconClassName="bg-emerald-50 text-emerald-700"
          />
        </section>

        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Filter size={16} />
                Busca e filtros
              </div>

              <p className="mt-1 text-xs text-neutral">
                Filtre por edital, situação, modalidade, termo, ano, plano ou discente.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className={labelClassName}>
                Buscar
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Plano, projeto, área, matrícula ou discente..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <FilterSelect
              label="Edital"
              value={selectedEdital}
              onChange={setSelectedEdital}
              options={editalOptions}
            />

            <FilterSelect
              label="Situação"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value as IndicationStatus | "Todos")}
              options={statusOptions}
            />

            <FilterSelect
              label="Modalidade"
              value={selectedModality}
              onChange={(value) => setSelectedModality(value as Modality | "Todos")}
              options={modalityOptions}
            />

            <FilterSelect
              label="Termo CNPq"
              value={selectedTermStatus}
              onChange={(value) => setSelectedTermStatus(value as CommitmentTermStatus | "Todos")}
              options={termOptions}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
            <FilterSelect
              label="Ano"
              value={selectedYear}
              onChange={setSelectedYear}
              options={yearOptions}
            />

            <div className="flex items-end lg:col-span-5">
              <div className="w-full rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
                <strong className="font-semibold text-primary">
                  {filteredPlans.length}
                </strong>{" "}
                plano(s) encontrado(s).
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral/20 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-primary">
                Planos aprovados e discentes interessados
              </h2>

              <p className="mt-1 text-sm text-neutral">
                A indicação agora é feita em uma página própria com os dados completos do discente.
              </p>
            </div>

            <Link
              to="/coordenador/projetos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Ver projetos
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {filteredPlans.length > 0 ? (
            <div className="divide-y divide-neutral/10">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </section>
      </div>
    </main>
  )
}

function PlanCard({ plan }: { plan: IndicationPlan }) {
  const mainActionLabel = plan.indicatedStudent ? "Ver / alterar indicação" : "Indicar discente"

  return (
    <article className="p-6 transition hover:bg-neutral/5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Notebook size={14} />
                Plano aprovado
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getModalityClass(
                  plan.modality
                )}`}
              >
                {plan.modality}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                  plan.status
                )}`}
              >
                {getStatusIcon(plan.status)}
                {plan.status}
              </span>
            </div>

            <h3 className="mt-3 text-base font-semibold leading-6 text-primary">
              {plan.planTitle}
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral">
              Projeto vinculado:{" "}
              <span className="font-medium text-primary">
                {plan.projectTitle}
              </span>
            </p>
          </div>

          <Link
            to={`/coordenador/planos/indicacoes/${plan.id}`}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <UserCheck size={16} />
            {mainActionLabel}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <MiniInfo label="Edital" value={`${plan.edital} • ${plan.ano}`} />
          <MiniInfo label="Área" value={plan.area} />
          <MiniInfo label="Carga semanal" value={`${plan.workload}h`} />
          <MiniInfo label="Vigência" value={`${plan.validityStart} a ${plan.validityEnd}`} />
          <MiniInfo label="Prazo indicação" value={plan.indicationDeadline} />
          <MiniInfo label="Prazo substituição" value={plan.substitutionDeadline} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Discente indicado
                </p>

                {plan.indicatedStudent ? (
                  <>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {plan.indicatedStudent.name}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral">
                      {plan.indicatedStudent.registration} • {plan.indicatedStudent.course}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-neutral">
                    Nenhum discente indicado até o momento.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                {plan.indicationType ? (
                  <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {plan.indicationType}
                  </span>
                ) : null}

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getTermClass(
                    plan.commitmentTermStatus
                  )}`}
                >
                  {plan.commitmentTermStatus}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                Discentes interessados via SIGAA
              </p>

              <span className="text-xs font-medium text-neutral">
                {plan.candidates.length} candidato(s)
              </span>
            </div>

            <ul className="divide-y divide-neutral/10 rounded-xl border border-neutral/10 bg-white">
              {plan.candidates.map((candidate) => (
                <CandidateRow
                  key={candidate.id}
                  planId={plan.id}
                  candidate={candidate}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  )
}

function CandidateRow({
  planId,
  candidate,
}: {
  planId: number
  candidate: Candidate
}) {
  return (
    <li className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-primary">
            {candidate.name}
          </p>

          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getSigaaStatusClass(
              candidate.sigaaStatus
            )}`}
          >
            {candidate.sigaaStatus}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-neutral">
          {candidate.registration} • {candidate.course} • {candidate.semester}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-neutral">
          CRA {candidate.cra} • {candidate.academicStatus}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-neutral">
            Interesse em {candidate.interestRegisteredAt}
          </span>

          <a
            href={candidate.lattesUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary transition hover:text-primary/80"
          >
            Ver Lattes
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <Link
        to={`/coordenador/planos/indicacoes/${planId}?candidateId=${candidate.id}`}
        className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
      >
        Indicar
      </Link>
    </li>
  )
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string
  value: number
  description: string
  icon: React.ReactNode
  iconClassName: string
}) {
  return (
    <div className="rounded-2xl border border-neutral/30 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-primary">
            {value}
          </p>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral">
        {description}
      </p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className={labelClassName}>
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium leading-5 text-primary">
        {value}
      </p>
    </div>
  )
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral/10 text-neutral">
        <Search size={24} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-primary">
        Nenhum plano encontrado
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
        Tente limpar os filtros ou alterar os critérios de busca.
      </p>

      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
      >
        Limpar filtros
      </button>
    </div>
  )
}