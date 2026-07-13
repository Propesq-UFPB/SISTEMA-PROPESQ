import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileSignature,
  FileText,
  Search,
  Timer,
} from "lucide-react"

type ReportType = "Parcial" | "Final"
type ReportStatus = "Pendente" | "Submetido" | "Parecer emitido"
type DeadlineAlert = "normal" | "proximo" | "vencido"

type Report = {
  id: number
  planId: number
  planTitle: string
  studentName: string
  studentRegistration: string
  type: ReportType
  status: ReportStatus
  deadline: string
  submittedAt: string | null
  reviewedAt: string | null
}

const reports: Report[] = [
  {
    id: 1,
    planId: 1,
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    studentName: "Ana Beatriz Santos",
    studentRegistration: "20230014567",
    type: "Parcial",
    status: "Submetido",
    deadline: "15/05/2026",
    submittedAt: "08/05/2026",
    reviewedAt: null,
  },
  {
    id: 2,
    planId: 1,
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    studentName: "Ana Beatriz Santos",
    studentRegistration: "20230014567",
    type: "Final",
    status: "Pendente",
    deadline: "30/07/2027",
    submittedAt: null,
    reviewedAt: null,
  },
  {
    id: 3,
    planId: 2,
    planTitle: "Análise de dados de uso em ferramentas de acessibilidade",
    studentName: "João Victor Almeida",
    studentRegistration: "20220017890",
    type: "Parcial",
    status: "Submetido",
    deadline: "02/06/2026",
    submittedAt: "27/05/2026",
    reviewedAt: null,
  },
  {
    id: 4,
    planId: 3,
    planTitle: "Construção de painel analítico para acompanhamento acadêmico",
    studentName: "Mariana Costa Lima",
    studentRegistration: "20210011223",
    type: "Parcial",
    status: "Parecer emitido",
    deadline: "12/05/2026",
    submittedAt: "03/05/2026",
    reviewedAt: "09/05/2026",
  },
  {
    id: 5,
    planId: 4,
    planTitle: "Implementação de módulo inteligente para triagem de propostas",
    studentName: "Pedro Henrique Silva",
    studentRegistration: "20240015678",
    type: "Final",
    status: "Parecer emitido",
    deadline: "30/04/2026",
    submittedAt: "18/04/2026",
    reviewedAt: "22/04/2026",
  },
  {
    id: 6,
    planId: 5,
    planTitle: "Extração e análise de características em sinais multimodais",
    studentName: "Larissa Ferreira Gomes",
    studentRegistration: "20220019876",
    type: "Final",
    status: "Pendente",
    deadline: "05/06/2026",
    submittedAt: null,
    reviewedAt: null,
  },
]

const typeOptions: Array<ReportType | "Todos"> = ["Todos", "Parcial", "Final"]

const statusOptions: Array<ReportStatus | "Todos"> = [
  "Todos",
  "Pendente",
  "Submetido",
  "Parecer emitido",
]

function parseBrazilianDate(date: string) {
  const [day, month, year] = date.split("/").map(Number)
  return new Date(year, month - 1, day)
}

function getDaysUntilDeadline(deadline: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadlineDate = parseBrazilianDate(deadline)
  deadlineDate.setHours(0, 0, 0, 0)

  const diffTime = deadlineDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getDeadlineAlert(report: Report): DeadlineAlert {
  const days = getDaysUntilDeadline(report.deadline)

  if (report.status === "Parecer emitido") {
    return "normal"
  }

  if (days < 0) {
    return "vencido"
  }

  if (days <= 7) {
    return "proximo"
  }

  return "normal"
}

function getDeadlineLabel(report: Report) {
  const days = getDaysUntilDeadline(report.deadline)
  const alert = getDeadlineAlert(report)

  if (report.status === "Parecer emitido") {
    return "Concluído"
  }

  if (alert === "vencido") {
    return `Vencido há ${Math.abs(days)} dia(s)`
  }

  if (alert === "proximo") {
    if (days === 0) {
      return "Vence hoje"
    }

    return `Vence em ${days} dia(s)`
  }

  return "Dentro do prazo"
}

function getStatusClass(status: ReportStatus) {
  switch (status) {
    case "Pendente":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Submetido":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Parecer emitido":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case "Pendente":
      return <Timer size={14} />
    case "Submetido":
      return <FileText size={14} />
    case "Parecer emitido":
      return <CheckCircle2 size={14} />
    default:
      return <Clock size={14} />
  }
}

function getTypeClass(type: ReportType) {
  if (type === "Parcial") {
    return "border-sky-200 bg-sky-50 text-sky-700"
  }

  return "border-primary/20 bg-primary/5 text-primary"
}

function getDeadlineClass(alert: DeadlineAlert) {
  switch (alert) {
    case "vencido":
      return "border-red-200 bg-red-50 text-red-700"
    case "proximo":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "normal":
    default:
      return "border-neutral/20 bg-neutral/5 text-neutral"
  }
}

function getRowClass(alert: DeadlineAlert) {
  switch (alert) {
    case "vencido":
      return "border-l-4 border-l-red-400 bg-red-50/40"
    case "proximo":
      return "border-l-4 border-l-amber-400 bg-amber-50/40"
    case "normal":
    default:
      return "border-l-4 border-l-transparent"
  }
}

export default function CoordinatorReports() {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<ReportType | "Todos">("Todos")
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "Todos">("Todos")

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesSearch =
        !normalizedSearch ||
        report.planTitle.toLowerCase().includes(normalizedSearch) ||
        report.studentName.toLowerCase().includes(normalizedSearch) ||
        report.studentRegistration.toLowerCase().includes(normalizedSearch)

      const matchesType = selectedType === "Todos" || report.type === selectedType
      const matchesStatus = selectedStatus === "Todos" || report.status === selectedStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [search, selectedType, selectedStatus])

  const summary = useMemo(() => {
    const pending = reports.filter((report) => report.status === "Pendente").length
    const submitted = reports.filter((report) => report.status === "Submetido").length
    const reviewed = reports.filter((report) => report.status === "Parecer emitido").length
    const overdue = reports.filter((report) => getDeadlineAlert(report) === "vencido").length
    const closeDeadline = reports.filter((report) => getDeadlineAlert(report) === "proximo").length

    return {
      total: reports.length,
      pending,
      submitted,
      reviewed,
      overdue,
      closeDeadline,
    }
  }, [])

  function clearFilters() {
    setSearch("")
    setSelectedType("Todos")
    setSelectedStatus("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* HEADER */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileText size={14} />
              Lista de Relatórios
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Relatórios vinculados aos planos de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Acompanhe relatórios parciais e finais dos discentes, com status de submissão,
              prazo e indicação visual de vencimento.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Relatórios filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredReports.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {reports.length} relatório(s)
            </p>
          </div>
        </section>

        {/* ALERTAS */}
        {(summary.overdue > 0 || summary.closeDeadline > 0) && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {summary.overdue > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 shrink-0" size={20} />

                  <div>
                    <p className="text-sm font-semibold">
                      {summary.overdue} relatório(s) com prazo vencido
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      Verifique os relatórios pendentes ou submetidos que ultrapassaram o prazo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {summary.closeDeadline > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-700">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 shrink-0" size={20} />

                  <div>
                    <p className="text-sm font-semibold">
                      {summary.closeDeadline} relatório(s) com prazo próximo
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      Relatórios com vencimento em até 7 dias aparecem destacados na tabela.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Total
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {summary.total}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Pendentes
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {summary.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Submetidos
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {summary.submitted}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Parecer emitido
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {summary.reviewed}
            </p>
          </div>
        </section>

        {/* FILTROS */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-primary">
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
                  placeholder="Plano, discente ou matrícula..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Tipo
              </label>

              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value as ReportType | "Todos")
                }
                className="w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                  setSelectedStatus(event.target.value as ReportStatus | "Todos")
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
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral">
              <strong className="font-semibold text-primary">
                {filteredReports.length}
              </strong>{" "}
              relatório(s) encontrado(s).
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* TABELA */}
        <section className="rounded-2xl border border-neutral/30 bg-white">
          <div className="border-b border-neutral/20 p-6">
            <h2 className="text-base font-semibold text-primary">
              Relatórios
            </h2>

            <p className="mt-1 text-sm text-neutral">
              Tabela com plano vinculado, discente, tipo, status e prazo.
            </p>
          </div>

          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse">
                <thead>
                  <tr className="border-b border-neutral/20 bg-neutral/5 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Plano vinculado
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Discente
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Tipo
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                      Prazo
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => {
                    const deadlineAlert = getDeadlineAlert(report)

                    return (
                      <tr
                        key={report.id}
                        className={`border-b border-neutral/10 transition last:border-b-0 hover:bg-neutral/5 ${getRowClass(
                          deadlineAlert
                        )}`}
                      >
                        <td className="px-6 py-5 align-top">
                          <div className="max-w-sm">
                            <p className="text-sm font-semibold leading-5 text-primary">
                              {report.planTitle}
                            </p>

                            <p className="mt-1 text-xs text-neutral">
                              Plano #{report.planId}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <p className="text-sm font-semibold text-primary">
                            {report.studentName}
                          </p>

                          <p className="mt-1 text-xs text-neutral">
                            Matrícula {report.studentRegistration}
                          </p>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClass(
                              report.type
                            )}`}
                          >
                            <FileText size={13} />
                            {report.type}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              report.status
                            )}`}
                          >
                            {getStatusIcon(report.status)}
                            {report.status}
                          </span>

                          {report.submittedAt && (
                            <p className="mt-2 text-xs text-neutral">
                              Submetido em {report.submittedAt}
                            </p>
                          )}

                          {report.reviewedAt && (
                            <p className="mt-1 text-xs text-neutral">
                              Parecer em {report.reviewedAt}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 text-sm text-neutral">
                              <CalendarDays size={15} />
                              {report.deadline}
                            </div>

                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getDeadlineClass(
                                deadlineAlert
                              )}`}
                            >
                              {deadlineAlert === "vencido" ? (
                                <AlertCircle size={13} />
                              ) : deadlineAlert === "proximo" ? (
                                <Clock size={13} />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}

                              {getDeadlineLabel(report)}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end">
                            {report.status === "Pendente" ? (
                              <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/5 px-3 py-2 text-sm font-medium text-neutral/60"
                              >
                                <Timer size={15} />
                                Aguardando
                              </button>
                            ) : (
                              <Link
                                to={`/coordenador/relatorios/${report.id}/revisao`}
                                className={
                                  report.status === "Submetido"
                                    ? "inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                                    : "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10"
                                }
                              >
                                <FileSignature size={15} />
                                {report.status === "Submetido"
                                  ? "Emitir parecer"
                                  : "Ver parecer"}
                              </Link>
                            )}
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
                Nenhum relatório encontrado
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                Não encontramos relatórios com os filtros selecionados.
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