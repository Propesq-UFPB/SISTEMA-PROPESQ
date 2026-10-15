import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  GitBranch,
  Loader2,
  Pencil,
  RefreshCcw,
  Send,
  Shuffle,
  UserCheck,
} from "lucide-react"
import type { ConfirmResult } from "../api/distributionService"
import type { DistributionDraft, DistributionParams } from "../types/evaluationDistribution"
import { MetricCard, SectionTitle } from "./formPrimitives"

function ParamInput({
  label,
  value,
  min,
  disabled,
  onChange,
}: Readonly<{
  label: string
  value: number
  min: number
  disabled: boolean
  onChange: (value: number) => void
}>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-neutral">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || min))}
        className="h-10 w-full rounded-xl border border-neutral/20 bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:bg-neutral-light"
      />
    </label>
  )
}

export function BatchDistributionSection({
  params,
  onParamsChange,
  draft,
  busy,
  hasAssignments,
  pendingProjectsCount,
  completedInDraft,
  issueCount,
  impact,
  lastResult,
  onGeneratePreview,
  onAdjustCurrent,
  onConfirm,
  onClear,
}: Readonly<{
  params: DistributionParams
  onParamsChange: (params: DistributionParams) => void
  draft: DistributionDraft | null
  busy: "preview" | "confirm" | null
  hasAssignments: boolean
  pendingProjectsCount: number
  completedInDraft: number
  issueCount: number
  impact: { newInvites: number; removed: number } | null
  lastResult: ConfirmResult | null
  onGeneratePreview: () => void
  onAdjustCurrent: () => void
  onConfirm: () => void
  onClear: () => void
}>) {
  const invalidParams = params.minPerConsultant > params.maxPerConsultant
  const nothingToConfirm = !impact || (impact.newInvites === 0 && impact.removed === 0)

  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          icon={<Shuffle size={18} />}
          title="Distribuição em lote"
          subtitle="Convites pendentes e aceitos são mantidos; a prévia preenche só as vagas abertas."
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGeneratePreview}
            disabled={busy !== null || invalidParams}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "preview" ? <Loader2 size={16} className="animate-spin" /> : <Shuffle size={16} />}
            Gerar prévia
          </button>

          <button
            type="button"
            onClick={onAdjustCurrent}
            disabled={busy !== null || !hasAssignments}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:text-neutral/40"
          >
            <Pencil size={16} />
            Ajustar distribuição atual
          </button>

          <button
            type="button"
            disabled={!draft || busy !== null || nothingToConfirm}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:bg-neutral-light disabled:text-neutral/50"
          >
            {busy === "confirm" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Confirmar
          </button>

          <button
            type="button"
            disabled={!draft || busy !== null}
            onClick={onClear}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:text-neutral/40"
          >
            <RefreshCcw size={16} />
            Descartar
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <ParamInput
          label="Consultores por projeto"
          value={params.perProject}
          min={1}
          disabled={busy !== null}
          onChange={(perProject) => onParamsChange({ ...params, perProject })}
        />
        <ParamInput
          label="Mínimo de projetos por consultor"
          value={params.minPerConsultant}
          min={0}
          disabled={busy !== null}
          onChange={(minPerConsultant) => onParamsChange({ ...params, minPerConsultant })}
        />
        <ParamInput
          label="Máximo de projetos por consultor"
          value={params.maxPerConsultant}
          min={1}
          disabled={busy !== null}
          onChange={(maxPerConsultant) => onParamsChange({ ...params, maxPerConsultant })}
        />
      </div>
      {invalidParams && (
        <p className="mt-2 text-xs text-red-600">O mínimo não pode ser maior que o máximo.</p>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Projetos sem convite"
          value={pendingProjectsCount}
          icon={<GitBranch size={18} />}
        />
        <MetricCard
          label="Novos convites no rascunho"
          value={impact?.newInvites ?? 0}
          icon={<UserCheck size={18} />}
        />
        <MetricCard
          label="Projetos completos no rascunho"
          value={completedInDraft}
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="Exigem ajuste"
          value={issueCount}
          icon={<AlertTriangle size={18} />}
          warning={issueCount > 0}
        />
      </div>

      {draft && impact ? (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <CircleAlert size={18} className="mt-0.5 shrink-0 text-blue-700" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800">
                {draft.mode === "PREVIA" ? "Prévia gerada" : "Ajustando a distribuição atual"}
              </h3>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                Nada foi gravado ainda. Ao confirmar, serão enviados{" "}
                <strong>{impact.newInvites}</strong> novo(s) convite(s)
                {impact.removed > 0 && (
                  <>
                    {" "}e removido(s) <strong>{impact.removed}</strong> convite(s) sem avaliação
                  </>
                )}
                . Convites com notas lançadas e recusas registradas não são alterados.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!draft && lastResult ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Distribuição confirmada: {lastResult.criadas} convite(s) enviado(s),{" "}
          {lastResult.removidas} removido(s) e {lastResult.mantidas} mantido(s).
        </div>
      ) : null}
    </section>
  )
}
