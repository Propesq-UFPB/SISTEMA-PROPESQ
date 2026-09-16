import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  GitBranch,
  RefreshCcw,
  Send,
  Shuffle,
  UserCheck,
} from "lucide-react"
import type { DistributionPreview } from "../types/evaluationDistribution"
import { MetricCard, SectionTitle } from "./formPrimitives"

export function BatchDistributionSection({
  preview,
  pendingProjectsCount,
  totalDraftAssignments,
  projectsCompletedInPreview,
  onGenerateSmartPreview,
  onConfirmPreview,
  onClearPreview,
}: Readonly<{
  preview: DistributionPreview | null
  pendingProjectsCount: number
  totalDraftAssignments: number
  projectsCompletedInPreview: number
  onGenerateSmartPreview: () => void
  onConfirmPreview: () => void
  onClearPreview: () => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          icon={<Shuffle size={18} />}
          title="Distribuição em lote"
          subtitle="Gere uma prévia automática e revise somente as exceções."
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerateSmartPreview}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Shuffle size={16} />
            Gerar prévia
          </button>

          <button
            type="button"
            disabled={!preview || totalDraftAssignments === 0}
            onClick={onConfirmPreview}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:bg-neutral-light disabled:text-neutral/50"
          >
            <Send size={16} />
            Confirmar
          </button>

          <button
            type="button"
            disabled={!preview}
            onClick={onClearPreview}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:text-neutral/40"
          >
            <RefreshCcw size={16} />
            Limpar
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Projetos pendentes"
          value={pendingProjectsCount}
          icon={<GitBranch size={18} />}
        />

        <MetricCard
          label="Atribuições sugeridas"
          value={totalDraftAssignments}
          icon={<UserCheck size={18} />}
        />

        <MetricCard
          label="Projetos completos"
          value={projectsCompletedInPreview}
          icon={<CheckCircle2 size={18} />}
        />

        <MetricCard
          label="Exigem ajuste"
          value={preview?.issues.length ?? 0}
          icon={<AlertTriangle size={18} />}
          warning={Boolean(preview && preview.issues.length > 0)}
        />
      </div>

      {preview ? (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-blue-800">
                Prévia gerada
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Nenhum convite foi enviado. Revise as exceções antes de
                confirmar a distribuição.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
