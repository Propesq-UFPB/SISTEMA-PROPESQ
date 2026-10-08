import { Pencil, Trash2 } from "lucide-react"
import type { EvaluationCriterion } from "@/features/evaluation-criteria/api/evaluationCriteriaService"

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
}

export function CriteriaTable({
  rows,
  loading,
  offset,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onEdit,
  onDeactivate,
}: Readonly<{
  rows: EvaluationCriterion[]
  loading: boolean
  offset: number
  total: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  onEdit: (row: EvaluationCriterion) => void
  onDeactivate: (row: EvaluationCriterion) => void
}>) {
  const from = total === 0 ? 0 : offset + 1
  const to = Math.min(offset + rows.length, total)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-neutral/10">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                Nome
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                Descrição
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                Peso
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                Nota máxima
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-sm text-neutral">
                  Carregando critérios...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-sm text-neutral">
                  Nenhum critério neste filtro.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="border-b border-neutral/10 last:border-0">
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-dark">
                    {row.nome}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-sm text-neutral">
                    <span className="line-clamp-2">{row.descricao?.trim() || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-dark">
                    {formatNumber(row.peso)}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-dark">
                    {formatNumber(row.nota_maxima)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        row.ativo
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-neutral/15 bg-neutral-light text-neutral"
                      }`}
                    >
                      {row.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral/20 px-3 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      {row.ativo && (
                        <button
                          type="button"
                          onClick={() => onDeactivate(row)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Desativar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral">
          {total === 0 ? "0 critérios" : `${from}–${to} de ${total}`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev || loading}
            className="rounded-lg border border-neutral/20 px-3 py-2 text-sm font-semibold text-neutral transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext || loading}
            className="rounded-lg border border-neutral/20 px-3 py-2 text-sm font-semibold text-neutral transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}
