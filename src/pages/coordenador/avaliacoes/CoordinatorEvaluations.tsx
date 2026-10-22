import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  Filter,
  GraduationCap,
  Inbox,
  Loader2,
  Mail,
  Search,
  Timer,
  XCircle,
} from "lucide-react"
import { DeclineInvitationModal } from "@/features/coordinator-evaluation/components/DeclineInvitationModal"
import { useMyInvitations } from "@/features/coordinator-evaluation/hooks/useMyInvitations"
import type { InvitationStage } from "@/features/coordinator-evaluation/types/invitation"
import {
  EMPTY_FILTERS,
  invitationAreaLabel,
  invitationStage,
  STAGE_LABEL,
} from "@/features/coordinator-evaluation/utils/invitationHelpers"
import { formatDate } from "@/features/evaluation-distribution/utils/evaluationDistributionHelpers"

const STAGE_CLASS: Record<InvitationStage, string> = {
  CONVITE: "border-blue-200 bg-blue-50 text-blue-700",
  AGUARDANDO: "border-amber-200 bg-amber-50 text-amber-700",
  REALIZADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RECUSADA: "border-neutral/20 bg-neutral/10 text-neutral",
}

const STAGE_ICON: Record<InvitationStage, ReactNode> = {
  CONVITE: <Mail size={14} />,
  AGUARDANDO: <Timer size={14} />,
  REALIZADA: <CheckCircle2 size={14} />,
  RECUSADA: <XCircle size={14} />,
}

function SummaryCard({
  label,
  value,
  hint,
  icon,
  iconClass,
}: Readonly<{ label: string; value: number; hint: string; icon: ReactNode; iconClass: string }>) {
  return (
    <div className="rounded-2xl border border-neutral/30 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral">{label}</p>
          <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral">{hint}</p>
    </div>
  )
}

const selectClass =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

export default function CoordinatorEvaluations() {
  const {
    invitations,
    filtered,
    summary,
    editais,
    years,
    loading,
    error,
    answering,
    filters,
    setFilters,
    accept,
    declining,
    declineError,
    openDecline,
    closeDecline,
    confirmDecline,
  } = useMyInvitations()

  const clearFilters = () => setFilters(EMPTY_FILTERS)

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
              Responda aos convites de avaliação recebidos como consultor e avalie os projetos
              aceitos.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Projetos filtrados
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">{filtered.length}</p>
            <p className="mt-1 text-xs text-neutral">
              de {invitations.length} convite(s) recebido(s)
            </p>
          </div>
        </section>

        {error && (
          <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </section>
        )}

        {/* ALERTA DE CONVITES */}
        {summary.convites > 0 && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-blue-800">
                  Você tem {summary.convites} convite(s) aguardando resposta
                </h2>
                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Aceite para avaliar o projeto ou recuse informando o motivo, para que o gestor
                  possa redistribuí-lo a outro consultor.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Convites pendentes"
            value={summary.convites}
            hint="aguardando sua resposta"
            icon={<Mail size={20} />}
            iconClass="bg-blue-50 text-blue-700"
          />
          <SummaryCard
            label="Aguardando avaliação"
            value={summary.aguardando}
            hint="convites aceitos sem parecer"
            icon={<Timer size={20} />}
            iconClass="bg-amber-50 text-amber-700"
          />
          <SummaryCard
            label="Realizadas"
            value={summary.realizadas}
            hint="parecer enviado"
            icon={<ClipboardCheck size={20} />}
            iconClass="bg-emerald-50 text-emerald-700"
          />
          <SummaryCard
            label="Recusadas"
            value={summary.recusadas}
            hint="convites recusados"
            icon={<ClipboardList size={20} />}
            iconClass="bg-primary/10 text-primary"
          />
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
                Localize convites por projeto, edital, área, situação ou ano.
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
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                  placeholder="Código ou título do projeto, área ou edital..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Edital</label>
              <select
                value={filters.editalId}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    editalId: event.target.value === "ALL" ? "ALL" : Number(event.target.value),
                  })
                }
                className={selectClass}
              >
                <option value="ALL">Todos</option>
                {editais.map((edital) => (
                  <option key={edital.id} value={edital.id}>
                    {edital.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Situação</label>
              <select
                value={filters.stage}
                onChange={(event) =>
                  setFilters({ ...filters, stage: event.target.value as InvitationStage | "ALL" })
                }
                className={selectClass}
              >
                <option value="ALL">Todas</option>
                {(Object.keys(STAGE_LABEL) as InvitationStage[]).map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABEL[stage]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Ano</label>
              <select
                value={filters.year}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    year: event.target.value === "ALL" ? "ALL" : Number(event.target.value),
                  })
                }
                className={selectClass}
              >
                <option value="ALL">Todos</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* TABELA */}
        <section className="overflow-hidden rounded-2xl border border-neutral/30 bg-white">
          <div className="border-b border-neutral/20 p-6">
            <h2 className="text-base font-semibold text-primary">Convites de avaliação</h2>
            <p className="mt-1 text-sm text-neutral">
              Projetos para os quais você foi convidado como consultor.
            </p>
          </div>

          {loading ? (
            <p className="flex items-center gap-2 px-6 py-10 text-sm text-neutral">
              <Loader2 size={16} className="animate-spin" />
              Carregando convites...
            </p>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral/10">
                <thead className="bg-neutral/5">
                  <tr>
                    {["Projeto", "Área", "Convite", "Situação"].map((title) => (
                      <th
                        key={title}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral"
                      >
                        {title}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral/10 bg-white">
                  {filtered.map((invitation) => {
                    const stage = invitationStage(invitation)
                    const busy = answering === invitation.id

                    return (
                      <tr
                        key={invitation.id}
                        className={
                          stage === "CONVITE"
                            ? "bg-blue-50/40 transition hover:bg-blue-50"
                            : "transition hover:bg-neutral/5"
                        }
                      >
                        <td className="max-w-md px-6 py-5 align-top">
                          <p className="text-xs font-semibold text-neutral">
                            {invitation.project.code}
                          </p>
                          <p className="text-sm font-semibold leading-6 text-primary">
                            {invitation.project.title}
                          </p>
                          <p className="mt-1 text-xs text-neutral">
                            {invitation.edital
                              ? `${invitation.edital.label} • ${invitation.edital.year}`
                              : "Sem edital"}
                          </p>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className="inline-flex items-center gap-2 text-sm text-neutral">
                            <GraduationCap size={15} className="shrink-0" />
                            {invitationAreaLabel(invitation)}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                            <CalendarDays size={15} />
                            {formatDate(invitation.sentAt)}
                          </span>
                          {invitation.answeredAt && (
                            <p className="mt-1 text-xs text-neutral">
                              respondido em {formatDate(invitation.answeredAt)}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STAGE_CLASS[stage]}`}
                          >
                            {STAGE_ICON[stage]}
                            {STAGE_LABEL[stage]}
                          </span>
                          {stage === "RECUSADA" && invitation.reason && (
                            <p className="mt-2 max-w-xs text-xs leading-5 text-neutral">
                              {invitation.reason}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            {stage === "CONVITE" && (
                              <>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void accept(invitation)}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                                >
                                  {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                  Aceitar
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => openDecline(invitation)}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                                >
                                  <XCircle size={15} />
                                  Recusar
                                </button>
                              </>
                            )}

                            {(stage === "AGUARDANDO" || stage === "REALIZADA") && (
                              <Link
                                to={`/coordenador/avaliacoes/${invitation.id}`}
                                className={
                                  stage === "AGUARDANDO"
                                    ? "inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                                    : "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
                                }
                              >
                                <FileSignature size={15} />
                                {stage === "AGUARDANDO" ? "Avaliar" : "Ver avaliação"}
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
                {invitations.length === 0 ? <Inbox size={24} /> : <Search size={24} />}
              </div>
              <h3 className="mt-4 text-base font-semibold text-primary">
                {invitations.length === 0
                  ? "Nenhum convite de avaliação recebido"
                  : "Nenhum convite encontrado"}
              </h3>
              <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                {invitations.length === 0
                  ? "Quando um gestor distribuir projetos para você, os convites aparecerão aqui."
                  : "Não encontramos convites com os filtros selecionados."}
              </p>
              {invitations.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {declining && (
        <DeclineInvitationModal
          invitation={declining}
          saving={answering === declining.id}
          error={declineError}
          onClose={closeDecline}
          onConfirm={(reason) => void confirmDecline(reason)}
        />
      )}
    </main>
  )
}
