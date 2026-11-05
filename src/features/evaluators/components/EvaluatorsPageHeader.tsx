import type { ReactNode } from "react"

function Stat({
  label,
  value,
  helper,
  tone = "default",
}: Readonly<{
  label: string
  value: number
  helper: string
  tone?: "default" | "success" | "warning"
}>) {
  const valueClassName = {
    default: "text-neutral-dark",
    success: "text-emerald-700",
    warning: "text-amber-700",
  }[tone]

  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueClassName}`}>{value}</p>
      <p className="mt-0.5 text-[11px] leading-4 text-neutral">{helper}</p>
    </div>
  )
}

export function EvaluatorsPageHeader({
  selector,
  evaluatorsCount,
  activeCount,
  externalCount,
  pendingCount,
}: Readonly<{
  selector: ReactNode
  evaluatorsCount: number
  activeCount: number
  externalCount: number
  pendingCount: number
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Avaliadores</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral">
            Consulte, acompanhe e organize o banco de avaliadores internos,
            externos, voluntários e consultores vinculados à PROPESQ.
          </p>
        </div>

        <div className="w-full lg:w-[420px]">{selector}</div>
      </div>

      <div className="grid grid-cols-2 divide-neutral/10 border-t border-neutral/10 lg:grid-cols-4 lg:divide-x">
        <Stat
          label="Avaliadores cadastrados"
          value={evaluatorsCount}
          helper="Total no banco de avaliadores"
        />
        <Stat
          label="Ativos"
          value={activeCount}
          helper="Disponíveis para avaliação"
          tone="success"
        />
        <Stat
          label="Externos"
          value={externalCount}
          helper="Consultores de fora da instituição"
        />
        <Stat
          label="Pendências"
          value={pendingCount}
          helper="Avaliações ainda não submetidas"
          tone={pendingCount > 0 ? "warning" : "success"}
        />
      </div>
    </section>
  )
}
