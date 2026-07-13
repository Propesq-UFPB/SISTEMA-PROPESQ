import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileSignature,
  Filter,
  GraduationCap,
  Search,
  Send,
  Timer,
} from "lucide-react"

type EvaluationStatus = "Pendente" | "Realizada" | "Justificativa enviada"

type EvaluationProject = {
  id: number
  projectId: number
  projectTitle: string
  edital: string
  area: string
  ano: string
  deadline: string
  status: EvaluationStatus
  justification?: string
}

const initialEvaluations: EvaluationProject[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    edital: "PIBIC 2026",
    area: "Ciência da Computação",
    ano: "2026",
    deadline: "30/05/2026",
    status: "Pendente",
  },
  {
    id: 2,
    projectId: 2,
    projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    edital: "PIBIC 2026",
    area: "Ciência de Dados",
    ano: "2026",
    deadline: "31/05/2026",
    status: "Pendente",
  },
  {
    id: 3,
    projectId: 3,
    projectTitle: "Modelos Computacionais para Apoio à Pesquisa Aplicada",
    edital: "PIBIC 2026",
    area: "Engenharia de Software",
    ano: "2026",
    deadline: "02/06/2026",
    status: "Realizada",
  },
  {
    id: 4,
    projectId: 4,
    projectTitle: "Automação de Processos Acadêmicos com Inteligência Artificial",
    edital: "PIBITI 2026",
    area: "Inteligência Artificial",
    ano: "2026",
    deadline: "03/06/2026",
    status: "Realizada",
  },
  {
    id: 5,
    projectId: 5,
    projectTitle: "Sistema de Apoio à Gestão de Bolsas de Iniciação Científica",
    edital: "PIBITI 2026",
    area: "Sistemas de Informação",
    ano: "2026",
    deadline: "01/06/2026",
    status: "Justificativa enviada",
    justification:
      "Justificativa registrada por impedimento técnico dentro do período previsto.",
  },
]

const editalOptions = ["Todos", "PIBIC 2026", "PIBITI 2026", "PIVIC 2026"]

const statusOptions: Array<EvaluationStatus | "Todos"> = [
  "Todos",
  "Pendente",
  "Realizada",
  "Justificativa enviada",
]

const yearOptions = ["Todos", "2026", "2025"]

function parseBrazilianDate(date: string) {
  const [day, month, year] = date.split("/").map(Number)
  return new Date(year, month - 1, day)
}

function getDaysUntilDeadline(deadline: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadlineDate = parseBrazilianDate(deadline)
  deadlineDate.setHours(0, 0, 0, 0)

  const diffInMs = deadlineDate.getTime() - today.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

function isDeadlineNear(evaluation: EvaluationProject) {
  const daysUntilDeadline = getDaysUntilDeadline(evaluation.deadline)
  return evaluation.status === "Pendente" && daysUntilDeadline >= 0 && daysUntilDeadline <= 3
}

function isOverdue(evaluation: EvaluationProject) {
  const daysUntilDeadline = getDaysUntilDeadline(evaluation.deadline)
  return evaluation.status === "Pendente" && daysUntilDeadline < 0
}

function getDeadlineLabel(evaluation: EvaluationProject) {
  const daysUntilDeadline = getDaysUntilDeadline(evaluation.deadline)

  if (evaluation.status !== "Pendente") {
    return "Prazo encerrado para esta avaliação"
  }

  if (daysUntilDeadline < 0) {
    return "Prazo vencido"
  }

  if (daysUntilDeadline === 0) {
    return "Vence hoje"
  }

  if (daysUntilDeadline === 1) {
    return "Vence em 1 dia"
  }

  return `Vence em ${daysUntilDeadline} dias`
}

function getStatusClass(status: EvaluationStatus) {
  switch (status) {
    case "Realizada":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Justificativa enviada":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Pendente":
      return "border-blue-200 bg-blue-50 text-blue-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: EvaluationStatus) {
  switch (status) {
    case "Realizada":
      return <CheckCircle2 size={14} />
    case "Justificativa enviada":
      return <Send size={14} />
    case "Pendente":
      return <Timer size={14} />
    default:
      return <ClipboardList size={14} />
  }
}

export default function CoordinatorEvaluations() {
  const [evaluations] = useState<EvaluationProject[]>(initialEvaluations)

  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState<EvaluationStatus | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return evaluations.filter((evaluation) => {
      const matchesSearch =
        !normalizedSearch ||
        evaluation.projectTitle.toLowerCase().includes(normalizedSearch) ||
        evaluation.area.toLowerCase().includes(normalizedSearch) ||
        evaluation.edital.toLowerCase().includes(normalizedSearch)

      const matchesEdital =
        selectedEdital === "Todos" || evaluation.edital === selectedEdital

      const matchesStatus =
        selectedStatus === "Todos" || evaluation.status === selectedStatus

      const matchesYear =
        selectedYear === "Todos" || evaluation.ano === selectedYear

      return matchesSearch && matchesEdital && matchesStatus && matchesYear
    })
  }, [evaluations, search, selectedEdital, selectedStatus, selectedYear])

  const summary = useMemo(() => {
    const total = evaluations.length

    const pending = evaluations.filter(
      (evaluation) => evaluation.status === "Pendente"
    ).length

    const completed = evaluations.filter(
      (evaluation) => evaluation.status === "Realizada"
    ).length

    const justified = evaluations.filter(
      (evaluation) => evaluation.status === "Justificativa enviada"
    ).length

    const nearDeadline = evaluations.filter(isDeadlineNear).length

    return {
      total,
      pending,
      completed,
      justified,
      nearDeadline,
    }
  }, [evaluations])

  const evaluationsByEdital = useMemo(() => {
    return evaluations.reduce<Record<string, number>>((acc, evaluation) => {
      acc[evaluation.edital] = (acc[evaluation.edital] || 0) + 1
      return acc
    }, {})
  }, [evaluations])

  const hasNearDeadlinePending = useMemo(() => {
    return evaluations.some(isDeadlineNear)
  }, [evaluations])

  const hasOverduePending = useMemo(() => {
    return evaluations.some(isOverdue)
  }, [evaluations])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedStatus("Todos")
    setSelectedYear("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* HEADER */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileSignature size={14} />
              Avaliações
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Avaliação de projetos
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Avalie projetos de outros pesquisadores conforme a avaliação por pares obrigatória prevista no edital.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Projetos filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredEvaluations.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {evaluations.length} avaliação(ões) distribuída(s)
            </p>
          </div>
        </section>

        {/* ALERTA DE PRAZO */}
        {(hasNearDeadlinePending || hasOverduePending) && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-amber-800">
                  Atenção ao prazo de avaliação
                </h2>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Existem avaliações pendentes com prazo próximo ou vencido. Conforme a regra do edital,
                  a não realização da avaliação obrigatória por pares pode implicar penalidade, incluindo
                  a exclusão do próprio projeto do coordenador.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Total distribuído
                </p>

                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              máximo de 5 projetos por edital
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Pendentes
                </p>

                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.pending}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Timer size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              aguardando avaliação
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Realizadas
                </p>

                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.completed}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ClipboardCheck size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              parecer enviado
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Prazo próximo
                </p>

                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.nearDeadline}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <AlertTriangle size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              pendente(s) com risco de penalidade
            </p>
          </div>
        </section>

        {/* FILTROS */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Filter size={16} />
                Busca e filtros
              </div>

              <p className="mt-1 text-xs text-neutral">
                Localize avaliações por título do projeto, edital, área, status ou ano.
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Buscar projeto
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
                  placeholder="Título do projeto, área ou edital..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Edital
              </label>

              <select
                value={selectedEdital}
                onChange={(event) => setSelectedEdital(event.target.value)}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {editalOptions.map((edital) => (
                  <option key={edital} value={edital}>
                    {edital}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Status
              </label>

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as EvaluationStatus | "Todos")
                }
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Ano
              </label>

              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
            <strong className="font-semibold text-primary">
              {filteredEvaluations.length}
            </strong>{" "}
            avaliação(ões) encontrada(s) conforme os filtros aplicados.
          </div>
        </section>

        {/* TABELA */}
        <section className="overflow-hidden rounded-2xl border border-neutral/30 bg-white">
          <div className="border-b border-neutral/20 p-6">
            <h2 className="text-base font-semibold text-primary">
              Lista de avaliações
            </h2>

            <p className="mt-1 text-sm text-neutral">
              Tabela com título do projeto, área, prazo para avaliar e status da avaliação.
            </p>
          </div>

          {filteredEvaluations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral/10">
                <thead className="bg-neutral/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                      Título do projeto
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                      Área
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                      Prazo para avaliar
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral/10 bg-white">
                  {filteredEvaluations.map((evaluation) => {
                    const nearDeadline = isDeadlineNear(evaluation)
                    const overdue = isOverdue(evaluation)

                    return (
                      <tr
                        key={evaluation.id}
                        className={
                          nearDeadline || overdue
                            ? "bg-amber-50/60 transition hover:bg-amber-50"
                            : "transition hover:bg-neutral/5"
                        }
                      >
                        <td className="max-w-md px-6 py-5 align-top">
                          <div>
                            <p className="text-sm font-semibold leading-6 text-primary">
                              {evaluation.projectTitle}
                            </p>

                            <p className="mt-1 text-xs text-neutral">
                              {evaluation.edital} • {evaluation.ano}
                            </p>

                            {(nearDeadline || overdue) && (
                              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                                <span>
                                  Avaliação pendente com prazo crítico. A não avaliação pode causar exclusão do próprio projeto.
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className="inline-flex items-center gap-2 text-sm text-neutral">
                            <GraduationCap size={15} />
                            {evaluation.area}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                              <CalendarDays size={15} />
                              {evaluation.deadline}
                            </span>

                            <p
                              className={
                                nearDeadline || overdue
                                  ? "text-xs font-semibold text-amber-700"
                                  : "text-xs text-neutral"
                              }
                            >
                              {getDeadlineLabel(evaluation)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              evaluation.status
                            )}`}
                          >
                            {getStatusIcon(evaluation.status)}
                            {evaluation.status}
                          </span>

                          {evaluation.status === "Justificativa enviada" && evaluation.justification && (
                            <p className="mt-2 max-w-xs text-xs leading-5 text-neutral">
                              {evaluation.justification}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/coordenador/avaliacoes/${evaluation.id}`}
                              className={
                                evaluation.status === "Pendente"
                                  ? "inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                                  : "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
                              }
                            >
                              <FileSignature size={15} />
                              {evaluation.status === "Pendente"
                                ? "Avaliar"
                                : "Ver avaliação"}
                            </Link>

                            <Link
                              to={`/coordenador/avaliacoes/${evaluation.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                            >
                              <Eye size={15} />
                              Visualizar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral/10 text-neutral">
                <Search size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-primary">
                Nenhuma avaliação encontrada
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                Não encontramos avaliações com os filtros selecionados. Tente limpar os filtros ou alterar os critérios.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}