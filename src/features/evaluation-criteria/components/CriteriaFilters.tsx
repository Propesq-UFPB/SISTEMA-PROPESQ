import { Plus } from "lucide-react"
import type { AtivoFilter } from "@/features/evaluation-criteria/utils/criterionForm"

const FILTERS: { id: AtivoFilter; label: string }[] = [
  { id: "ativos", label: "Ativos" },
  { id: "inativos", label: "Inativos" },
  { id: "todos", label: "Todos" },
]

export function CriteriaFilters({
  filter,
  onFilterChange,
  onCreate,
}: Readonly<{
  filter: AtivoFilter
  onFilterChange: (next: AtivoFilter) => void
  onCreate: () => void
}>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex rounded-xl border border-neutral/15 bg-neutral-light/70 p-1">
        {FILTERS.map((item) => {
          const selected = item.id === filter
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                selected
                  ? "bg-white text-primary shadow-sm"
                  : "text-neutral hover:text-primary"
              }`}
              aria-pressed={selected}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Plus size={16} />
        Novo critério
      </button>
    </div>
  )
}
