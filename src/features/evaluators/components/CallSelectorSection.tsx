import { BookOpen, ChevronDown } from "lucide-react"
import type { Call } from "../types/evaluators"
import { FieldLabel } from "./formPrimitives"

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
    <section className="rounded-2xl border border-neutral-light bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <FieldLabel label="Edital em acompanhamento">
          <div className="relative">
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
            />

            <select
              value={selectedCallId}
              onChange={(event) => onSelectedCallIdChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-neutral-light bg-white px-3 pr-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            >
              {callsSorted.map((call) => (
                <option key={call.id} value={call.id}>
                  {call.title} • {call.baseYear} • {call.statusLabel}
                </option>
              ))}
            </select>
          </div>
        </FieldLabel>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="mt-0.5 text-blue-700" />

            <div>
              <p className="text-sm font-semibold text-blue-800">
                {selectedCall?.title ?? "Edital não selecionado"}
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-800/80">
                {selectedCall?.baseYear ?? "—"} •{" "}
                {selectedCall?.statusLabel ?? "—"} •{" "}
                {selectedCallAssignmentsCount} avaliação(ões)
                vinculada(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
