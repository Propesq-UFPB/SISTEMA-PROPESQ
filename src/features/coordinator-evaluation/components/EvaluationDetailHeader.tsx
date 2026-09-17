import {
  CalendarDays,
  FileSignature,
  GraduationCap,
} from "lucide-react"
import type { EvaluationDetail } from "../types/coordinatorEvaluation"

export function EvaluationDetailHeader({
  evaluationId,
  evaluation,
  completedCriteria,
  criteriaCount,
  calculatedScore,
}: Readonly<{
  evaluationId: string | undefined
  evaluation: EvaluationDetail
  completedCriteria: number
  criteriaCount: number
  calculatedScore: number
}>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileSignature size={14} />
              Avaliação #{evaluationId ?? evaluation.id}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
              Avaliação por pares
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {evaluation.projectTitle}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
            Registre o parecer técnico do projeto completo e indique o resultado
            dos planos de trabalho vinculados. Os dados do proponente não são
            exibidos ao avaliador.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral">
            <span className="inline-flex items-center gap-2">
              <GraduationCap size={16} />
              {evaluation.area}
            </span>

            <span className="h-1 w-1 rounded-full bg-neutral/40" />

            <span>{evaluation.edital}</span>

            <span className="h-1 w-1 rounded-full bg-neutral/40" />

            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              Prazo: {evaluation.deadline}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral/30 bg-neutral/5 px-5 py-4 lg:min-w-[220px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
            Nota ponderada
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-primary">
              {completedCriteria > 0 ? calculatedScore.toFixed(2) : "--"}
            </span>

            <span className="pb-1 text-sm text-neutral">/ 10</span>
          </div>

          <p className="mt-2 text-xs text-neutral">
            {completedCriteria} de {criteriaCount} critério(s) preenchido(s)
          </p>
        </div>
      </div>
    </section>
  )
}
