import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  GitBranch,
} from "lucide-react"
import { SummaryCard } from "./formPrimitives"

export function PageHeader({
  totalProjects,
  pendingProjects,
  distributedProjects,
  issueCount,
}: Readonly<{
  totalProjects: number
  pendingProjects: number
  distributedProjects: number
  issueCount: number
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Distribuição de Projetos para Avaliação
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Distribuição em lote com acompanhamento por indicadores e ajuste
              manual apenas nos casos pendentes.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:w-[620px]">
          <SummaryCard
            label="Projetos"
            value={totalProjects}
            icon={<GitBranch size={18} />}
          />

          <SummaryCard
            label="Pendentes"
            value={pendingProjects}
            icon={<Clock3 size={18} />}
          />

          <SummaryCard
            label="Distribuídos"
            value={distributedProjects}
            icon={<CheckCircle2 size={18} />}
          />

          <SummaryCard
            label="Exceções"
            value={issueCount}
            icon={<AlertTriangle size={18} />}
          />
        </div>
      </div>
    </section>
  )
}
