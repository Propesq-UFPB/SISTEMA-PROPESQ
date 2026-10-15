import {
  CheckCircle2,
  Clock3,
  RefreshCcw,
  UserCheck,
  XCircle,
} from "lucide-react"
import type {
  Assignment,
  DistributableProject,
} from "../types/evaluationDistribution"
import { formatDate } from "../utils/evaluationDistributionHelpers"
import { MetricCard, SectionTitle } from "./formPrimitives"

export function ExistingAssignmentsSection({
  summary,
  recentDeclinedAssignments,
  projects,
  isCovered,
  onRedistributeDeclined,
}: Readonly<{
  summary: {
    total: number
    pendentes: number
    aceitos: number
    recusados: number
  }
  recentDeclinedAssignments: Assignment[]
  projects: DistributableProject[]
  // O projeto já tem consultores suficientes (a recusa foi substituída)
  isCovered: (projectId: number) => boolean
  onRedistributeDeclined: (assignmentId: number) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<UserCheck size={18} />}
        title="Convites enviados"
        subtitle="Situação dos convites de avaliação deste edital."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Total"
          value={summary.total}
          icon={<UserCheck size={18} />}
        />
        <MetricCard
          label="Pendentes"
          value={summary.pendentes}
          icon={<Clock3 size={18} />}
          warning={summary.pendentes > 0}
        />
        <MetricCard
          label="Aceitos"
          value={summary.aceitos}
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="Recusados"
          value={summary.recusados}
          icon={<XCircle size={18} />}
          warning={summary.recusados > 0}
        />
      </div>

      {recentDeclinedAssignments.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-dark">
            Recusas recentes
          </h3>

          <div className="space-y-3">
            {recentDeclinedAssignments.map((assignment) => {
              const project = projects.find(
                (item) => item.id === assignment.projectId,
              )

              return (
                <div
                  key={assignment.id}
                  className="rounded-2xl border border-red-100 bg-red-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        {project
                          ? `${project.code} · ${project.title}`
                          : `Projeto ${assignment.projectId}`}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-neutral-dark">
                        {assignment.evaluatorName}
                      </h4>
                      <p className="mt-1 text-xs text-red-700">
                        {assignment.reason ??
                          "Recusa registrada pelo consultor."}
                      </p>
                      <p className="mt-1 text-xs text-neutral">
                        Enviado em {formatDate(assignment.sentAt)} · recusado em{" "}
                        {formatDate(assignment.answeredAt)}
                      </p>
                    </div>

                    {isCovered(assignment.projectId) ? (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Vaga preenchida
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRedistributeDeclined(assignment.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
                      >
                        <RefreshCcw size={14} />
                        Redistribuir
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
