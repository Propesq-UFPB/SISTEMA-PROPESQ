import { Sparkles } from "lucide-react"
import type { QuotaReserveOptions } from "../types/quotas"

function ReserveOption({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: Readonly<{
  id: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}>) {
  const descriptionId = `${id}-description`

  return (
    <label
      htmlFor={id}
      aria-label={title}
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-light p-4 transition hover:bg-neutral-light/40"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        aria-describedby={descriptionId}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-primary">{title}</span>
        <span
          id={descriptionId}
          className="block text-sm text-neutral/70"
        >
          {description}
        </span>
      </span>
    </label>
  )
}

export function QuotaReservesSection({
  options,
  onChange,
}: Readonly<{
  options: QuotaReserveOptions
  onChange: (next: QuotaReserveOptions) => void
}>) {
  return (
    <div className="rounded-3xl border border-neutral-light bg-white p-6 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            Reservas especiais
          </h2>
          <p className="mt-1 text-sm text-neutral/70">
            Ative ou desative as reservas antes de gerar a distribuição.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <ReserveOption
          id="quota-reserve-new-doctor"
          title="Recém-doutor"
          description="Prioriza candidatos marcados com reserva de recém-doutor."
          checked={options.applyNewDoctorReserve}
          onCheckedChange={(applyNewDoctorReserve) =>
            onChange({ ...options, applyNewDoctorReserve })
          }
        />

        <ReserveOption
          id="quota-reserve-leave"
          title="Licença-maternidade/licença-adotante"
          description="Considera reservas vinculadas a afastamento legal."
          checked={options.applyLeaveReserve}
          onCheckedChange={(applyLeaveReserve) =>
            onChange({ ...options, applyLeaveReserve })
          }
        />

        <ReserveOption
          id="quota-reserve-priority-area"
          title="Áreas prioritárias"
          description="Aplica prioridade para áreas definidas no edital."
          checked={options.applyPriorityAreaReserve}
          onCheckedChange={(applyPriorityAreaReserve) =>
            onChange({ ...options, applyPriorityAreaReserve })
          }
        />
      </div>
    </div>
  )
}
