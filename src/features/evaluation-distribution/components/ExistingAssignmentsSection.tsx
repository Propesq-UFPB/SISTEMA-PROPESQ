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
  Evaluator,
} from "../types/evaluationDistribution"
import { assignmentStatusLabel } from "../utils/evaluationDistributionHelpers"
import { MetricCard, SectionTitle } from "./formPrimitives"

export function ExistingAssignmentsSection({
  assignmentSummary,
  recentDeclinedAssignments,
  projects,
  evaluators,
  onResendDeclined,
}: Readonly<{
  assignmentSummary: {
    total: number
    pendentes: number
    aceitos: number
    recusados: number
  }
  recentDeclinedAssignments: Assignment[]
  projects: DistributableProject[]
  evaluators: Evaluator[]
  onResendDeclined: (assignmentId: number) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<UserCheck size={18} />}
        title="Distribuições existentes"
        subtitle="Resumo dos convites já enviados."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Total"
          value={assignmentSummary.total}
          icon={<UserCheck size={18} />}
        />

        <MetricCard
          label="Pendentes"
          value={assignmentSummary.pendentes}
          icon={<Clock3 size={18} />}
          warning={assignmentSummary.pendentes > 0}
        />

        <MetricCard
          label="Aceitos"
          value={assignmentSummary.aceitos}
          icon={<CheckCircle2 size={18} />}
        />

        <MetricCard
          label="Recusados"
          value={assignmentSummary.recusados}
          icon={<XCircle size={18} />}
          warning={assignmentSummary.recusados > 0}
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

              const evaluator = evaluators.find(
                (item) => item.id === assignment.evaluatorId,
              )

              if (!project || !evaluator) return null

              return (
                <div
                  key={assignment.id}
                  className="rounded-2xl border border-red-100 bg-red-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        {project.code}
                      </p>

                      <h4 className="mt-1 text-sm font-semibold text-neutral-dark">
                        {evaluator.name}
                      </h4>

                      <p className="mt-1 text-xs text-red-700">
                        {assignment.reason ??
                          "Recusa registrada pelo avaliador."}
                      </p>

                      <p className="mt-1 text-xs text-neutral">
                        Status: {assignmentStatusLabel(assignment.status)} ·{" "}
                        enviado em {assignment.sentAt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onResendDeclined(assignment.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
                    >
                      <RefreshCcw size={14} />
                      Redistribuir
                    </button>
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
