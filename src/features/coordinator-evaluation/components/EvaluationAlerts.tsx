import { AlertCircle, Info } from "lucide-react"
import type { LastAction } from "../types/coordinatorEvaluation"

export function EvaluationAlerts({
  lastAction,
  isReadyToSubmit,
}: Readonly<{
  lastAction: LastAction
  isReadyToSubmit: boolean
}>) {
  return (
    <>
      {lastAction === "draft" && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex gap-3">
            <Info size={18} className="mt-0.5 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Rascunho de avaliação salvo no protótipo
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Em uma versão integrada, essa ação salvaria a avaliação sem
                publicar o resultado final.
              </p>
            </div>
          </div>
        </section>
      )}

      {lastAction === "submit" && !isReadyToSubmit && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex gap-3">
            <AlertCircle size={18} className="mt-0.5 text-amber-700" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Existem campos obrigatórios pendentes
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Preencha todos os critérios com nota e parecer textual, avalie
                todos os planos de trabalho vinculados e informe o parecer geral
                antes de concluir a avaliação.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
