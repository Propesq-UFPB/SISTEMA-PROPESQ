import type { FormEvent } from "react"
import { Send } from "lucide-react"
import type { LastAction } from "../types/coordinatorEvaluation"
import { labelClassName, SummaryItem } from "./formPrimitives"

export function JustificationForm({
  evaluationStartedAt,
  canSendNonEvaluationJustification,
  nonEvaluationJustification,
  lastAction,
  onJustificationChange,
  onSubmit,
}: Readonly<{
  evaluationStartedAt: string
  canSendNonEvaluationJustification: boolean
  nonEvaluationJustification: string
  lastAction: LastAction
  onJustificationChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}>) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="rounded-2xl border border-neutral/30 bg-white p-6">
        <h2 className="text-base font-semibold text-primary">
          Envio de justificativa de não-avaliação
        </h2>

        <p className="mt-1 text-sm leading-6 text-neutral">
          Use este formulário apenas quando houver impedimento para realizar a
          avaliação. O envio deve ocorrer em até 3 dias do início da avaliação.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SummaryItem
            label="Início da avaliação"
            value={evaluationStartedAt}
          />

          <SummaryItem
            label="Limite para justificativa"
            value="Até 3 dias do início"
          />

          <SummaryItem
            label="Situação"
            value={
              canSendNonEvaluationJustification
                ? "Dentro do prazo"
                : "Prazo encerrado"
            }
          />
        </div>

        <div className="mt-5">
          <label className={labelClassName}>
            Justificativa de não-avaliação{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            value={nonEvaluationJustification}
            onChange={(event) => onJustificationChange(event.target.value)}
            disabled={!canSendNonEvaluationJustification}
            placeholder="Descreva o motivo que impede a realização da avaliação..."
            className={
              canSendNonEvaluationJustification
                ? "min-h-[180px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                : "min-h-[180px] w-full resize-y rounded-xl border border-neutral/20 bg-neutral/10 px-3 py-2.5 text-sm leading-6 text-neutral outline-none"
            }
          />
        </div>

        {lastAction === "justify" &&
          (!canSendNonEvaluationJustification ||
            nonEvaluationJustification.trim().length === 0) && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              Não foi possível enviar. Verifique se o prazo ainda está aberto e
              se a justificativa foi preenchida.
            </div>
          )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!canSendNonEvaluationJustification}
            className={
              canSendNonEvaluationJustification
                ? "inline-flex items-center justify-center gap-2 rounded-xl border border-amber-600 bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                : "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/10 px-5 py-2.5 text-sm font-semibold text-neutral"
            }
          >
            <Send size={16} />
            Enviar justificativa
          </button>
        </div>
      </section>
    </form>
  )
}
