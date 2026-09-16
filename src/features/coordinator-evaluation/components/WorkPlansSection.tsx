import { FolderKanban } from "lucide-react"
import type {
  EvaluationWorkPlan,
  EvaluationWorkPlanDecision,
} from "../types/coordinatorEvaluation"
import { getStatusClass } from "../utils/coordinatorEvaluationHelpers"
import {
  inputClassName,
  labelClassName,
  textareaClassName,
  TextBlock,
} from "./formPrimitives"
import { StatusIcon } from "./StatusIcon"

export function WorkPlansSection({
  workPlans,
  onUpdateDecision,
  onUpdateOpinion,
}: Readonly<{
  workPlans: EvaluationWorkPlan[]
  onUpdateDecision: (
    workPlanId: number,
    decision: EvaluationWorkPlanDecision,
  ) => void
  onUpdateOpinion: (workPlanId: number, value: string) => void
}>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white">
      <div className="border-b border-neutral/20 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <FolderKanban size={20} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-primary">
              Planos de trabalho vinculados
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral">
              Indique se cada plano de trabalho vinculado ao projeto está
              aprovado ou reprovado.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral/10">
        {workPlans.map((workPlan) => (
          <article key={workPlan.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-base font-bold leading-6 text-primary">
                  {workPlan.title}
                </h3>

                <p className="mt-1 text-xs text-neutral">
                  Plano vinculado ao projeto • {workPlan.student}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                  workPlan.decision,
                )}`}
              >
                <StatusIcon status={workPlan.decision} />
                {workPlan.decision === "Selecione o resultado"
                  ? "Pendente"
                  : workPlan.decision}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TextBlock
                title="Atividades previstas"
                text={workPlan.activities}
              />

              <TextBlock
                title="Resultados esperados"
                text={workPlan.expectedResults}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className={labelClassName}>
                  Resultado do plano <span className="text-red-500">*</span>
                </label>

                <select
                  value={workPlan.decision}
                  onChange={(event) =>
                    onUpdateDecision(
                      workPlan.id,
                      event.target.value as EvaluationWorkPlanDecision,
                    )
                  }
                  className={inputClassName}
                >
                  <option value="Selecione o resultado">
                    Selecione o resultado
                  </option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className={labelClassName}>
                  Parecer sobre o plano <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={workPlan.opinion}
                  onChange={(event) =>
                    onUpdateOpinion(workPlan.id, event.target.value)
                  }
                  placeholder="Justifique a indicação de aprovado ou reprovado para este plano..."
                  className={textareaClassName}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
