import { BarChart3 } from "lucide-react"
import { SectionTitle } from "./formPrimitives"

export function AreaSummarySection({
  areaSummary,
}: Readonly<{
  areaSummary: {
    area: string
    total: number
    pendentes: number
    distribuidos: number
    incompletos: number
  }[]
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<BarChart3 size={18} />}
        title="Resumo por área"
        subtitle="Projetos distribuídos sobre o total de cada área."
      />

      <ul className="space-y-4">
        {areaSummary.map((item) => {
          const percent = item.total ? Math.round((item.distribuidos / item.total) * 100) : 0
          return (
            <li key={item.area}>
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="font-medium text-neutral-dark" title={item.area}>
                  {item.area}
                </span>
                <span className="shrink-0 font-semibold text-neutral-dark">
                  {item.distribuidos}/{item.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-light">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              {(item.pendentes > 0 || item.incompletos > 0) && (
                <p className="mt-1 text-[11px] text-neutral">
                  {item.pendentes > 0 && `${item.pendentes} sem convite`}
                  {item.pendentes > 0 && item.incompletos > 0 && " · "}
                  {item.incompletos > 0 && (
                    <span className="text-amber-700">{item.incompletos} incompleto(s)</span>
                  )}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
