import {
  CalendarDays,
  ClipboardCheck,
  FolderKanban,
  Star,
} from "lucide-react"
import type { EvaluationDetail } from "../types/coordinatorEvaluation"

export function EvaluationMetrics({
  evaluation,
  completedCriteria,
  calculatedScore,
}: Readonly<{
  evaluation: EvaluationDetail
  completedCriteria: number
  calculatedScore: number
}>) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-neutral/30 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Edital
            </p>

            <p className="mt-2 text-lg font-bold text-primary">
              {evaluation.edital}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardCheck size={20} />
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral">Ano {evaluation.ano}</p>
      </div>

      <div className="rounded-2xl border border-neutral/30 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Tipo de avaliação
            </p>

            <p className="mt-2 text-lg font-bold text-primary">
              Projeto completo
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <FolderKanban size={20} />
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral">Planos de trabalho vinculados</p>
      </div>

      <div className="rounded-2xl border border-neutral/30 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Submissão
            </p>

            <p className="mt-2 text-lg font-bold text-primary">
              {evaluation.submittedAt}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CalendarDays size={20} />
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral">
          Prazo final em {evaluation.deadline}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral/30 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Critérios
            </p>

            <p className="mt-2 text-lg font-bold text-primary">
              {completedCriteria}/7
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Star size={20} />
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral">
          Avaliação ponderada em {calculatedScore.toFixed(2)}
        </p>
      </div>
    </section>
  )
}
