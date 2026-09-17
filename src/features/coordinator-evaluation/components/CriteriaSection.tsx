import { ClipboardList } from "lucide-react"
import type { Criterion } from "../types/coordinatorEvaluation"

export function CriteriaSection({
  criteria,
  totalWeight,
  completedCriteria,
  calculatedScore,
  onUpdateScore,
  onUpdateOpinion,
}: Readonly<{
  criteria: Criterion[]
  totalWeight: number
  completedCriteria: number
  calculatedScore: number
  onUpdateScore: (criterionId: number, value: string) => void
  onUpdateOpinion: (criterionId: number, value: string) => void
}>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white">
      <div className="border-b border-neutral/20 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-primary">
              Critérios de avaliação
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral">
              Cada critério deve receber nota de 0 a 10 e parecer textual. A
              nota final é calculada de forma ponderada pelos pesos do edital.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral/10">
          <thead className="bg-neutral/5">
            <tr>
              <th className="w-[38%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                Critério e análise de julgamento
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                Pontos
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                Peso
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                Nota
              </th>

              <th className="min-w-[280px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                Parecer textual
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral/10 bg-white">
            {criteria.map((criterion) => (
              <tr key={criterion.id} className="align-top">
                <td className="px-6 py-5">
                  <p className="text-sm font-semibold leading-6 text-primary">
                    {criterion.id}. {criterion.label}
                  </p>
                </td>

                <td className="px-6 py-5 text-sm text-neutral">
                  {criterion.points}
                </td>

                <td className="px-6 py-5 text-sm font-semibold text-primary">
                  {criterion.weight.toFixed(1).replace(".", ",")}
                </td>

                <td className="px-6 py-5">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={criterion.score}
                    onChange={(event) =>
                      onUpdateScore(criterion.id, event.target.value)
                    }
                    placeholder="0 a 10"
                    className="w-28 rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </td>

                <td className="px-6 py-5">
                  <textarea
                    value={criterion.opinion}
                    onChange={(event) =>
                      onUpdateOpinion(criterion.id, event.target.value)
                    }
                    placeholder="Registre o parecer deste critério..."
                    className="min-h-[96px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral/20 bg-neutral/5 px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-neutral">
            Soma dos pesos:{" "}
            <strong className="font-semibold text-primary">
              {totalWeight.toFixed(1).replace(".", ",")}
            </strong>
          </p>

          <p className="text-sm text-neutral">
            Nota ponderada:{" "}
            <strong className="font-semibold text-primary">
              {completedCriteria > 0
                ? calculatedScore.toFixed(2)
                : "Não calculada"}
            </strong>
          </p>
        </div>
      </div>
    </section>
  )
}
