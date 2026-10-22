import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  Pencil,
  RefreshCcw,
  Send,
  Shuffle,
} from "lucide-react"
import type { ConfirmResult } from "../api/distributionService"
import type { DistributionDraft, DistributionParams } from "../types/evaluationDistribution"
import { SectionTitle } from "./formPrimitives"

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
    <label className="block w-28 text-sm">
      <span className="mb-1 block text-xs font-medium leading-tight text-neutral">{label}</span>
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
  totalProjects,
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
  totalProjects: number
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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 flex-1">
          <SectionTitle
            icon={<Shuffle size={18} />}
            title="Distribuição em lote"
            subtitle="Convites pendentes e aceitos são mantidos; a prévia preenche só as vagas abertas."
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-end gap-3">
          <ParamInput
            label="Consultores por projeto"
            value={params.perProject}
            min={1}
            disabled={busy !== null}
            onChange={(perProject) => onParamsChange({ ...params, perProject })}
          />
          <ParamInput
            label="Mín. projetos por consultor"
            value={params.minPerConsultant}
            min={0}
            disabled={busy !== null}
            onChange={(minPerConsultant) => onParamsChange({ ...params, minPerConsultant })}
          />
          <ParamInput
            label="Máx. projetos por consultor"
            value={params.maxPerConsultant}
            min={1}
            disabled={busy !== null}
            onChange={(maxPerConsultant) => onParamsChange({ ...params, maxPerConsultant })}
          />

          <button
            type="button"
            onClick={onGeneratePreview}
            disabled={busy !== null || invalidParams}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "preview" ? <Loader2 size={16} className="animate-spin" /> : <Shuffle size={16} />}
            Gerar prévia
          </button>

          <button
            type="button"
            onClick={onAdjustCurrent}
            disabled={busy !== null || !hasAssignments}
            title="Abre os convites gravados como rascunho para ajuste manual"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-4 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:text-neutral/40"
          >
            <Pencil size={16} />
            Ajustar atual
          </button>
        </div>
      </div>
      {invalidParams && (
        <p className="mt-2 text-right text-xs text-red-600">O mínimo não pode ser maior que o máximo.</p>
      )}

      {draft && impact ? (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3">
            <CircleAlert size={18} className="mt-0.5 shrink-0 text-blue-700" />
            <div className="text-sm leading-6 text-blue-800">
              <h3 className="font-semibold">
                {draft.mode === "PREVIA" ? "Prévia gerada" : "Ajustando a distribuição atual"}
                {" · "}
                {completedInDraft}/{totalProjects} projetos completos
                {issueCount > 0 && (
                  <span className="text-red-700"> · {issueCount} exige(m) ajuste</span>
                )}
              </h3>
              <p>
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

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={onClear}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:text-neutral/40"
            >
              <RefreshCcw size={16} />
              Descartar
            </button>

            <button
              type="button"
              disabled={busy !== null || nothingToConfirm}
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "confirm" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Confirmar
            </button>
          </div>
        </div>
      ) : null}

      {!draft && lastResult ? (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0" />
          Distribuição confirmada: {lastResult.criadas} convite(s) enviado(s),{" "}
          {lastResult.removidas} removido(s) e {lastResult.mantidas} mantido(s).
        </div>
      ) : null}
    </section>
  )
}
