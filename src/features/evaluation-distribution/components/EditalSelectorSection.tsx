import { ChevronDown } from "lucide-react"
import type { EditalLookup } from "@/features/editais"

export function EditalSelectorSection({
  editais,
  loading,
  error,
  selectedEditalId,
  onSelectedEditalIdChange,
}: Readonly<{
  editais: EditalLookup[]
  loading: boolean
  error: string | null
  selectedEditalId: string
  onSelectedEditalIdChange: (id: string) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium text-neutral">
          Edital da distribuição
        </span>

        <div className="relative">
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
          />

          <select
            value={selectedEditalId}
            disabled={loading || editais.length === 0}
            onChange={(event) => onSelectedEditalIdChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-neutral/20 bg-white px-3 pr-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-neutral-light"
          >
            <option value="">
              {loading ? "Carregando editais..." : "Selecione um edital"}
            </option>
            {editais.map((edital) => (
              <option key={edital.id} value={String(edital.id)}>
                {edital.codigo ? `${edital.codigo} • ` : ""}
                {edital.descricao}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </label>
    </section>
  )
}
