import { AlertCircle, ClipboardCheck, Send } from "lucide-react"
import type { ActiveForm } from "../types/coordinatorEvaluation"

export function NonEvaluationAlert({
  evaluationStartedAt,
  canSendNonEvaluationJustification,
  activeForm,
  onSelectForm,
}: Readonly<{
  evaluationStartedAt: string
  canSendNonEvaluationJustification: boolean
  activeForm: ActiveForm
  onSelectForm: (form: ActiveForm) => void
}>) {
  return (
    <section
      className={
        canSendNonEvaluationJustification
          ? "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
          : "rounded-2xl border border-neutral/20 bg-white px-5 py-4"
      }
    >
      <div className="flex gap-3">
        <AlertCircle
          size={18}
          className={
            canSendNonEvaluationJustification
              ? "mt-0.5 text-amber-700"
              : "mt-0.5 text-neutral"
          }
        />

        <div>
          <p
            className={
              canSendNonEvaluationJustification
                ? "text-sm font-semibold text-amber-800"
                : "text-sm font-semibold text-primary"
            }
          >
            Justificativa de não-avaliação
          </p>

          <p
            className={
              canSendNonEvaluationJustification
                ? "mt-1 text-sm leading-6 text-amber-700"
                : "mt-1 text-sm leading-6 text-neutral"
            }
          >
            Conforme o item 4.2.2, a justificativa de não-avaliação deve ser
            enviada em até 3 dias do início. Início registrado em{" "}
            {evaluationStartedAt}.{" "}
            {canSendNonEvaluationJustification
              ? "O envio ainda está dentro do prazo."
              : "O prazo para envio da justificativa já foi encerrado."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectForm("evaluation")}
              className={
                activeForm === "evaluation"
                  ? "inline-flex items-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                  : "inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
              }
            >
              <ClipboardCheck size={16} />
              Preencher avaliação
            </button>

            <button
              type="button"
              onClick={() => onSelectForm("justification")}
              className={
                activeForm === "justification"
                  ? "inline-flex items-center gap-2 rounded-xl border border-amber-600 bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                  : "inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
              }
            >
              <Send size={16} />
              Enviar justificativa
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
