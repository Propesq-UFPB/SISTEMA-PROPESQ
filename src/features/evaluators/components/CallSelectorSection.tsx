import { BookOpen, ChevronDown } from "lucide-react"
import type { Call } from "../types/evaluators"

// Seletor de edital exibido no cabeçalho da página (mesmo padrão do EditalSelector)
export function CallSelectorSection({
  callsSorted,
  selectedCallId,
  onSelectedCallIdChange,
  selectedCall,
  selectedCallAssignmentsCount,
}: Readonly<{
  callsSorted: Call[]
  selectedCallId: string
  onSelectedCallIdChange: (id: string) => void
  selectedCall: Call | null
  selectedCallAssignmentsCount: number
}>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-neutral">
        Edital em acompanhamento
      </span>

      <div className="relative">
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
        />

        <select
          value={selectedCallId}
          onChange={(event) => onSelectedCallIdChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-neutral/20 bg-white px-3 pr-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {callsSorted.map((call) => (
            <option key={call.id} value={call.id}>
              {call.title} • {call.baseYear} • {call.statusLabel}
            </option>
          ))}
        </select>
      </div>

      <span className="mt-1.5 flex items-start gap-1.5 text-xs text-neutral">
        <BookOpen size={14} className="mt-0.5 shrink-0 text-primary" />
        <span>
          <span className="font-semibold text-neutral-dark">
            {selectedCall?.title ?? "Edital não selecionado"}
          </span>{" "}
          · {selectedCall?.baseYear ?? "—"} · {selectedCall?.statusLabel ?? "—"} ·{" "}
          {selectedCallAssignmentsCount} avaliação(ões) vinculada(s)
        </span>
      </span>
    </label>
  )
}
