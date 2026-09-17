import { AlertCircle, ShieldCheck, UserCheck, Users } from "lucide-react"
import { MetricCard } from "./formPrimitives"

export function EvaluatorsPageHeader({
  evaluatorsCount,
  activeCount,
  externalCount,
  pendingCount,
}: Readonly<{
  evaluatorsCount: number
  activeCount: number
  externalCount: number
  pendingCount: number
}>) {
  return (
    <header className="rounded-3xl border border-neutral-light bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="mt-2 text-2xl font-bold text-primary">
            Avaliadores
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral">
            Consulte, acompanhe e organize o banco de avaliadores internos,
            externos, voluntários e consultores vinculados à PROPESQ.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Avaliadores cadastrados"
          value={evaluatorsCount}
          helper="Total no banco de avaliadores"
          icon={<Users size={18} />}
        />

        <MetricCard
          label="Ativos"
          value={activeCount}
          helper="Disponíveis para avaliação"
          icon={<UserCheck size={18} />}
          tone="success"
        />

        <MetricCard
          label="Externos"
          value={externalCount}
          helper="Consultores de fora da instituição"
          icon={<ShieldCheck size={18} />}
        />

        <MetricCard
          label="Pendências"
          value={pendingCount}
          helper="Avaliações ainda não submetidas"
          icon={<AlertCircle size={18} />}
          tone={pendingCount > 0 ? "warning" : "success"}
        />
      </div>
    </header>
  )
}
