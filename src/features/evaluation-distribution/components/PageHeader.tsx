import type { ReactNode } from "react"

export type DistributionStats = {
  totalProjects: number
  pendingProjects: number
  distributedProjects: number
  invitesPending: number
  invitesAccepted: number
  invitesDeclined: number
  consultants: number
}

function Stat({
  label,
  value,
  tone = "default",
  action,
}: Readonly<{
  label: string
  value: number
  tone?: "default" | "warning" | "danger"
  action?: ReactNode
}>) {
  const valueClassName = {
    default: "text-neutral-dark",
    warning: "text-amber-700",
    danger: "text-red-600",
  }[tone]

  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueClassName}`}>{value}</p>
      {action}
    </div>
  )
}

export function PageHeader({
  selector,
  stats,
  onManageConsultants,
}: Readonly<{
  selector: ReactNode
  stats: DistributionStats | null
  onManageConsultants: () => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Distribuição de Projetos para Avaliação
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral">
            Distribuição em lote com ajuste manual dos casos pendentes.
          </p>
        </div>

        <div className="w-full lg:w-[420px]">{selector}</div>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 divide-neutral/10 border-t border-neutral/10 sm:grid-cols-4 lg:grid-cols-7 lg:divide-x">
          <Stat label="Projetos" value={stats.totalProjects} />
          <Stat
            label="Sem convite"
            value={stats.pendingProjects}
            tone={stats.pendingProjects > 0 ? "warning" : "default"}
          />
          <Stat label="Distribuídos" value={stats.distributedProjects} />
          <Stat
            label="Convites pendentes"
            value={stats.invitesPending}
            tone={stats.invitesPending > 0 ? "warning" : "default"}
          />
          <Stat label="Convites aceitos" value={stats.invitesAccepted} />
          <Stat
            label="Convites recusados"
            value={stats.invitesDeclined}
            tone={stats.invitesDeclined > 0 ? "danger" : "default"}
          />
          <Stat
            label="Consultores vinculados"
            value={stats.consultants}
            tone={stats.consultants === 0 ? "danger" : "default"}
            action={
              <button
                type="button"
                onClick={onManageConsultants}
                className="mt-1 text-xs font-semibold text-primary hover:underline"
              >
                Gerenciar
              </button>
            }
          />
        </div>
      ) : null}
    </section>
  )
}
