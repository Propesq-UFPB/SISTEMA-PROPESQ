import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Gavel,
  MessageSquareWarning,
  RefreshCcw,
  Search,
  Scale,
  Send,
  ShieldAlert,
  UserCheck,
  XCircle,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

type AppealType =
  | "NOTA_PROJETO"
  | "REPROVACAO_PROJETO"
  | "REPROVACAO_PLANO"
  | "DISCREPANCIA_NOTAS"
  | "IPI"
  | "ADMINISTRATIVO"

type AppealStatus =
  | "RECEBIDO"
  | "EM_ANALISE"
  | "AGUARDANDO_TERCEIRO_AVALIADOR"
  | "DEFERIDO"
  | "INDEFERIDO"
  | "PARCIALMENTE_DEFERIDO"
  | "ENCERRADO"

type Decision = "PENDENTE" | "MANTER_RESULTADO" | "ALTERAR_NOTA" | "REAVALIAR" | "ENVIAR_TERCEIRO"

type Appeal = {
  id: number
  protocol: string
  type: AppealType
  status: AppealStatus
  decision: Decision
  coordinator: string
  center: string
  projectTitle: string
  planTitle?: string
  originalScore?: number
  requestedScore?: number
  finalScore?: number
  evaluatorOneScore?: number
  evaluatorTwoScore?: number
  scoreDifference?: number
  ipiOriginal?: number
  ipiRequested?: number
  submittedAt: string
  deadline: string
  reason: string
  hasAttachment: boolean
  thirdEvaluator?: string
  finalDecision?: string
}

const appealTypes: Record<AppealType, string> = {
  NOTA_PROJETO: "Nota do projeto",
  REPROVACAO_PROJETO: "Reprovação de projeto",
  REPROVACAO_PLANO: "Reprovação de plano",
  DISCREPANCIA_NOTAS: "Discrepância entre notas",
  IPI: "Recurso de IPI",
  ADMINISTRATIVO: "Recurso administrativo",
}

const statusLabels: Record<AppealStatus, string> = {
  RECEBIDO: "Recebido",
  EM_ANALISE: "Em análise",
  AGUARDANDO_TERCEIRO_AVALIADOR: "Aguardando 3º avaliador",
  DEFERIDO: "Deferido",
  INDEFERIDO: "Indeferido",
  PARCIALMENTE_DEFERIDO: "Parcialmente deferido",
  ENCERRADO: "Encerrado",
}

const decisionLabels: Record<Decision, string> = {
  PENDENTE: "Pendente",
  MANTER_RESULTADO: "Manter resultado",
  ALTERAR_NOTA: "Alterar nota",
  REAVALIAR: "Reavaliar",
  ENVIAR_TERCEIRO: "Enviar para 3º avaliador",
}

const appealsMock: Appeal[] = [
  {
    id: 1,
    protocol: "REC-2026-001",
    type: "NOTA_PROJETO",
    status: "EM_ANALISE",
    decision: "PENDENTE",
    coordinator: "Dra. Helena Duarte",
    center: "CI",
    projectTitle: "Modelos inteligentes para acessibilidade em ambientes digitais",
    originalScore: 7.2,
    requestedScore: 8.5,
    submittedAt: "2026-05-22",
    deadline: "2026-05-25",
    reason:
      "A coordenadora solicita reconsideração da nota atribuída ao critério de metodologia, alegando que a proposta apresentou detalhamento suficiente das etapas experimentais.",
    hasAttachment: true,
  },
  {
    id: 2,
    protocol: "REC-2026-002",
    type: "DISCREPANCIA_NOTAS",
    status: "AGUARDANDO_TERCEIRO_AVALIADOR",
    decision: "ENVIAR_TERCEIRO",
    coordinator: "Dr. Rafael Lima",
    center: "CT",
    projectTitle: "Eficiência energética aplicada a sistemas embarcados",
    originalScore: 6.8,
    evaluatorOneScore: 8.4,
    evaluatorTwoScore: 6.1,
    scoreDifference: 2.3,
    submittedAt: "2026-05-23",
    deadline: "2026-05-26",
    reason:
      "O recurso aponta diferença superior a 2 pontos entre as avaliações e solicita nova análise por terceiro avaliador.",
    hasAttachment: false,
    thirdEvaluator: "Dra. Marina Costa",
  },
  {
    id: 3,
    protocol: "REC-2026-003",
    type: "IPI",
    status: "DEFERIDO",
    decision: "ALTERAR_NOTA",
    coordinator: "Dr. André Freitas",
    center: "CCHLA",
    projectTitle: "Análise interdisciplinar de dados educacionais",
    ipiOriginal: 132,
    ipiRequested: 151,
    submittedAt: "2026-05-24",
    deadline: "2026-05-27",
    reason:
      "O proponente informa que uma produção qualificada não foi considerada no cálculo do IPI e anexou documentação comprobatória.",
    hasAttachment: true,
    finalDecision:
      "Recurso deferido. A produção apresentada atende aos critérios do edital e será considerada no cálculo final do IPI.",
  },
  {
    id: 4,
    protocol: "REC-2026-004",
    type: "REPROVACAO_PLANO",
    status: "INDEFERIDO",
    decision: "MANTER_RESULTADO",
    coordinator: "Dra. Patrícia Almeida",
    center: "CCEN",
    projectTitle: "Monitoramento ambiental com visão computacional",
    planTitle: "Plano de trabalho 02 — Coleta e anotação de imagens",
    originalScore: 6.5,
    submittedAt: "2026-05-24",
    deadline: "2026-05-27",
    reason:
      "A coordenadora solicita reconsideração da reprovação do plano de trabalho, alegando adequação ao objetivo geral do projeto.",
    hasAttachment: false,
    finalDecision:
      "Recurso indeferido. O plano permanece não aprovado por ausência de detalhamento metodológico suficiente.",
  },
  {
    id: 5,
    protocol: "REC-2026-005",
    type: "REPROVACAO_PROJETO",
    status: "RECEBIDO",
    decision: "PENDENTE",
    coordinator: "Dr. Lucas Nascimento",
    center: "CCS",
    projectTitle: "Predição de risco em saúde pública com aprendizado de máquina",
    originalScore: 6.9,
    requestedScore: 7.4,
    submittedAt: "2026-05-25",
    deadline: "2026-05-28",
    reason:
      "O proponente solicita revisão da reprovação do projeto por entender que a média final deveria considerar ajuste em um dos critérios avaliativos.",
    hasAttachment: true,
  },
]

function getStatusClass(status: AppealStatus) {
  switch (status) {
    case "RECEBIDO":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "EM_ANALISE":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "AGUARDANDO_TERCEIRO_AVALIADOR":
      return "border-purple-200 bg-purple-50 text-purple-700"
    case "DEFERIDO":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "PARCIALMENTE_DEFERIDO":
      return "border-teal-200 bg-teal-50 text-teal-700"
    case "INDEFERIDO":
      return "border-red-200 bg-red-50 text-red-700"
    case "ENCERRADO":
      return "border-neutral-200 bg-neutral-100 text-neutral-700"
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-700"
  }
}

function getTypeIcon(type: AppealType) {
  switch (type) {
    case "NOTA_PROJETO":
      return <FileText size={16} />
    case "REPROVACAO_PROJETO":
      return <XCircle size={16} />
    case "REPROVACAO_PLANO":
      return <ShieldAlert size={16} />
    case "DISCREPANCIA_NOTAS":
      return <AlertTriangle size={16} />
    case "IPI":
      return <Scale size={16} />
    case "ADMINISTRATIVO":
      return <Gavel size={16} />
    default:
      return <FileText size={16} />
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))
}

function MetricCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
}) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral">{title}</p>
          <strong className="mt-1 block text-2xl font-semibold text-primary">{value}</strong>
        </div>

        <div className="rounded-xl border border-primary/10 bg-primary/5 p-2.5 text-primary">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-neutral">{description}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral/20 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-light text-neutral">
        <Search size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-primary">Nenhum recurso encontrado</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral">
        Ajuste os filtros ou pesquise por outro protocolo, coordenador, centro ou projeto.
      </p>
    </div>
  )
}

export default function AdminAppeals() {
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"TODOS" | AppealType>("TODOS")
  const [statusFilter, setStatusFilter] = useState<"TODOS" | AppealStatus>("TODOS")
  const [selectedAppealId, setSelectedAppealId] = useState<number>(appealsMock[0]?.id ?? 0)

  const filteredAppeals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return appealsMock.filter((appeal) => {
      const matchesQuery =
        !normalizedQuery ||
        appeal.protocol.toLowerCase().includes(normalizedQuery) ||
        appeal.coordinator.toLowerCase().includes(normalizedQuery) ||
        appeal.center.toLowerCase().includes(normalizedQuery) ||
        appeal.projectTitle.toLowerCase().includes(normalizedQuery)

      const matchesType = typeFilter === "TODOS" || appeal.type === typeFilter
      const matchesStatus = statusFilter === "TODOS" || appeal.status === statusFilter

      return matchesQuery && matchesType && matchesStatus
    })
  }, [query, typeFilter, statusFilter])

  const selectedAppeal =
    filteredAppeals.find((appeal) => appeal.id === selectedAppealId) ?? filteredAppeals[0]

  const metrics = useMemo(() => {
    const pending = appealsMock.filter((appeal) =>
      ["RECEBIDO", "EM_ANALISE", "AGUARDANDO_TERCEIRO_AVALIADOR"].includes(appeal.status),
    ).length

    const thirdEvaluator = appealsMock.filter(
      (appeal) => appeal.status === "AGUARDANDO_TERCEIRO_AVALIADOR",
    ).length

    const decided = appealsMock.filter((appeal) =>
      ["DEFERIDO", "INDEFERIDO", "PARCIALMENTE_DEFERIDO", "ENCERRADO"].includes(appeal.status),
    ).length

    const ipiAppeals = appealsMock.filter((appeal) => appeal.type === "IPI").length

    return {
      pending,
      thirdEvaluator,
      decided,
      ipiAppeals,
    }
  }, [])

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Helmet>
          <title>Recursos e Reconsiderações • PROPESQ</title>
        </Helmet>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/adm/resultados/ranking"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para resultados
            </Link>

            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              <Download size={16} />
              Exportar recursos
            </button>
          </div>

          <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <Gavel size={14} />
                  Fluxo do gestor
                </div>

                <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
                  Recursos e Reconsiderações
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-neutral sm:text-base">
                  Controle dos pedidos de reconsideração e recursos administrativos contra nota do
                  projeto, reprovação de projeto ou plano, discrepância entre avaliações, IPI e
                  decisões finais do resultado.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 lg:max-w-sm">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 shrink-0" size={18} />
                  <p>
                    Acompanhe os prazos do edital e registre a decisão final antes da publicação do
                    resultado final classificatório.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Recursos pendentes"
              value={metrics.pending}
              icon={<MessageSquareWarning size={20} />}
              description="Pedidos recebidos, em análise ou aguardando encaminhamento."
            />

            <MetricCard
              title="3º avaliador"
              value={metrics.thirdEvaluator}
              icon={<UserCheck size={20} />}
              description="Casos com discrepância relevante entre notas dos avaliadores."
            />

            <MetricCard
              title="Decisões registradas"
              value={metrics.decided}
              icon={<CheckCircle2 size={20} />}
              description="Recursos deferidos, indeferidos, parcialmente deferidos ou encerrados."
            />

            <MetricCard
              title="Recursos de IPI"
              value={metrics.ipiAppeals}
              icon={<Scale size={20} />}
              description="Solicitações relacionadas à revisão do IPI e FPPI do coordenador."
            />
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-primary">
                  <Filter size={18} />
                  Filtros de acompanhamento
                </h2>
                <p className="mt-1 text-sm text-neutral">
                  Filtre por protocolo, coordenador, tipo de recurso ou situação atual.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  setTypeFilter("TODOS")
                  setStatusFilter("TODOS")
                }}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                <RefreshCcw size={16} />
                Limpar filtros
              </button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_260px_260px]">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                  size={18}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por protocolo, coordenador, centro ou projeto"
                  className="h-11 w-full rounded-xl border border-neutral/20 bg-white pl-10 pr-4 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as "TODOS" | AppealType)}
                className="h-11 rounded-xl border border-neutral/20 bg-white px-3 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              >
                <option value="TODOS">Todos os tipos</option>
                {Object.entries(appealTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "TODOS" | AppealStatus)
                }
                className="h-11 rounded-xl border border-neutral/20 bg-white px-3 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              >
                <option value="TODOS">Todos os status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary">Lista de recursos</h2>
                  <p className="mt-1 text-sm text-neutral">
                    {filteredAppeals.length} registro(s) encontrado(s).
                  </p>
                </div>
              </div>

              {filteredAppeals.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral/10">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral/10">
                      <thead className="bg-neutral-light">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Protocolo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Coordenador
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Nota/IPI
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                            Ação
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-neutral/10 bg-white">
                        {filteredAppeals.map((appeal) => (
                          <tr
                            key={appeal.id}
                            className={
                              selectedAppeal?.id === appeal.id ? "bg-primary/5" : "hover:bg-neutral-light/70"
                            }
                          >
                            <td className="whitespace-nowrap px-4 py-4">
                              <div>
                                <p className="text-sm font-semibold text-primary">
                                  {appeal.protocol}
                                </p>
                                <p className="mt-0.5 text-xs text-neutral">
                                  Enviado em {formatDate(appeal.submittedAt)}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm text-primary">
                                <span className="rounded-lg bg-primary/5 p-1.5 text-primary">
                                  {getTypeIcon(appeal.type)}
                                </span>
                                {appealTypes[appeal.type]}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-sm font-medium text-primary">{appeal.coordinator}</p>
                              <p className="mt-0.5 text-xs text-neutral">{appeal.center}</p>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-sm text-primary">
                              {appeal.type === "IPI" ? (
                                <span>
                                  {appeal.ipiOriginal} → {appeal.ipiRequested}
                                </span>
                              ) : appeal.requestedScore ? (
                                <span>
                                  {appeal.originalScore?.toFixed(1)} →{" "}
                                  {appeal.requestedScore.toFixed(1)}
                                </span>
                              ) : appeal.scoreDifference ? (
                                <span>Dif. {appeal.scoreDifference.toFixed(1)}</span>
                              ) : (
                                <span>{appeal.originalScore?.toFixed(1) ?? "-"}</span>
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                  appeal.status,
                                )}`}
                              >
                                {statusLabels[appeal.status]}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedAppealId(appeal.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                              >
                                <Eye size={14} />
                                Analisar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <aside className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
              {selectedAppeal ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                          Análise do recurso
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-primary">
                          {selectedAppeal.protocol}
                        </h2>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                          selectedAppeal.status,
                        )}`}
                      >
                        {statusLabels[selectedAppeal.status]}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral">
                      {selectedAppeal.projectTitle}
                    </p>

                    {selectedAppeal.planTitle ? (
                      <p className="mt-2 rounded-xl bg-neutral-light px-3 py-2 text-xs text-neutral">
                        {selectedAppeal.planTitle}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral/10 bg-neutral-light p-4">
                      <p className="text-xs text-neutral">Coordenador</p>
                      <strong className="mt-1 block text-sm text-primary">
                        {selectedAppeal.coordinator}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-neutral/10 bg-neutral-light p-4">
                      <p className="text-xs text-neutral">Prazo de resposta</p>
                      <strong className="mt-1 block text-sm text-primary">
                        {formatDate(selectedAppeal.deadline)}
                      </strong>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral/10 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <MessageSquareWarning size={16} />
                      Fundamentação do pedido
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral">
                      {selectedAppeal.reason}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-neutral/15 bg-neutral-light px-3 py-1 text-xs text-neutral">
                        Tipo: {appealTypes[selectedAppeal.type]}
                      </span>

                      <span className="rounded-full border border-neutral/15 bg-neutral-light px-3 py-1 text-xs text-neutral">
                        Anexo: {selectedAppeal.hasAttachment ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>

                  {selectedAppeal.type === "DISCREPANCIA_NOTAS" ? (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-800">
                        <AlertTriangle size={16} />
                        Discrepância entre avaliadores
                      </h3>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-neutral">Aval. 1</p>
                          <strong className="text-sm text-primary">
                            {selectedAppeal.evaluatorOneScore?.toFixed(1)}
                          </strong>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-neutral">Aval. 2</p>
                          <strong className="text-sm text-primary">
                            {selectedAppeal.evaluatorTwoScore?.toFixed(1)}
                          </strong>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-neutral">Diferença</p>
                          <strong className="text-sm text-primary">
                            {selectedAppeal.scoreDifference?.toFixed(1)}
                          </strong>
                        </div>
                      </div>

                      {selectedAppeal.thirdEvaluator ? (
                        <p className="mt-3 text-xs text-purple-800">
                          Encaminhado para: <strong>{selectedAppeal.thirdEvaluator}</strong>
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {selectedAppeal.type === "IPI" ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                        <Scale size={16} />
                        Revisão de IPI
                      </h3>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-neutral">IPI original</p>
                          <strong className="text-sm text-primary">
                            {selectedAppeal.ipiOriginal}
                          </strong>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-neutral">IPI solicitado</p>
                          <strong className="text-sm text-primary">
                            {selectedAppeal.ipiRequested}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-neutral/10 p-4">
                    <label className="text-sm font-semibold text-primary">Decisão do gestor</label>

                    <select
                      defaultValue={selectedAppeal.decision}
                      className="mt-2 h-11 w-full rounded-xl border border-neutral/20 bg-white px-3 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    >
                      {Object.entries(decisionLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      defaultValue={selectedAppeal.finalDecision ?? ""}
                      placeholder="Registre a decisão final, justificativa técnica, eventual alteração de nota ou encaminhamento para terceiro avaliador."
                      rows={5}
                      className="mt-3 w-full resize-none rounded-xl border border-neutral/20 bg-white p-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                    >
                      <CheckCircle2 size={16} />
                      Registrar decisão final
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-800 transition hover:bg-purple-100"
                    >
                      <Send size={16} />
                      Encaminhar para 3º avaliador
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                    >
                      <Download size={16} />
                      Baixar processo do recurso
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral/20 p-8 text-center">
                  <Gavel className="mx-auto text-neutral" size={28} />
                  <p className="mt-3 text-sm text-neutral">
                    Selecione um recurso para visualizar os detalhes da análise.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}