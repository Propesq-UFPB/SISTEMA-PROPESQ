import { useMemo, useState } from "react"
import { Plus, RefreshCcw, Trash2 } from "lucide-react"
import type { CronogramaItem } from "../types/projectFormWizard"
import {
  createId,
  cx,
  formatCronogramaDuration,
  getProjectDurationInMonths,
} from "../utils/projectFormHelpers"
import { inputClassName, selectClassName } from "./formPrimitives"

export function CronogramaPicker({
  value,
  onChange,
  periodoIni,
  periodoFim,
}: Readonly<{
  value: CronogramaItem[]
  onChange: (value: CronogramaItem[]) => void
  periodoIni: string
  periodoFim: string
}>) {
  const [atividade, setAtividade] = useState("")
  const [mesInicio, setMesInicio] = useState(1)
  const [mesFim, setMesFim] = useState(1)

  const totalMeses = useMemo(
    () => getProjectDurationInMonths(periodoIni, periodoFim),
    [periodoIni, periodoFim],
  )

  const mesesDisponiveis = useMemo(
    () => Array.from({ length: totalMeses }, (_, index) => index + 1),
    [totalMeses],
  )

  const canAdd = Boolean(
    atividade.trim() &&
      mesInicio >= 1 &&
      mesFim >= mesInicio &&
      mesFim <= totalMeses,
  )

  function addLinha() {
    if (!canAdd) return

    onChange([
      ...value,
      {
        id: createId("cronograma"),
        atividade: atividade.trim(),
        mesInicio,
        mesFim,
      },
    ])

    setAtividade("")
    setMesInicio(1)
    setMesFim(1)
  }

  function removeLinha(id: string) {
    onChange(value.filter((item) => item.id !== id))
  }

  return (
    <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_170px_170px_auto]">
        <input
          value={atividade}
          onChange={(event) => setAtividade(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addLinha()
            }
          }}
          className={inputClassName}
          placeholder="Atividade"
        />

        <select
          value={mesInicio}
          onChange={(event) => {
            const nextMesInicio = Number(event.target.value)
            setMesInicio(nextMesInicio)

            if (mesFim < nextMesInicio) {
              setMesFim(nextMesInicio)
            }
          }}
          className={selectClassName}
        >
          {mesesDisponiveis.map((item) => (
            <option key={item} value={item}>
              Início: mês {item}
            </option>
          ))}
        </select>

        <select
          value={mesFim}
          onChange={(event) => setMesFim(Number(event.target.value))}
          className={selectClassName}
        >
          {mesesDisponiveis
            .filter((item) => item >= mesInicio)
            .map((item) => (
              <option key={item} value={item}>
                Fim: mês {item}
              </option>
            ))}
        </select>

        <button
          type="button"
          onClick={addLinha}
          disabled={!canAdd}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canAdd
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      <p className="mt-2 text-[11px] text-neutral">
        A duração deve ficar entre o mês 1 e o mês {totalMeses}, conforme o
        período informado para o projeto.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={value.length === 0}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            value.length === 0
              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
              : "border-neutral/20 bg-white text-primary hover:border-primary/30",
          )}
        >
          <RefreshCcw size={14} />
          Limpar cronograma
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-light bg-white p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Nenhuma atividade adicionada ao cronograma.
            </p>

            <p className="mt-1 text-xs text-neutral">
              Informe a atividade, selecione a duração e clique em adicionar.
            </p>
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-neutral">
                  {formatCronogramaDuration(item.mesInicio, item.mesFim)}
                </p>

                <p className="mt-1 text-sm leading-6 text-primary">
                  {item.atividade}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeLinha(item.id)}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
