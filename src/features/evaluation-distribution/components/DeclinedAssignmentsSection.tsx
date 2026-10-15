import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react"
import type {
  Assignment,
  DistributableProject,
} from "../types/evaluationDistribution"
import { formatDate } from "../utils/evaluationDistributionHelpers"
import { SectionTitle } from "./formPrimitives"

export function DeclinedAssignmentsSection({
  recentDeclinedAssignments,
  projects,
  isCovered,
  onRedistributeDeclined,
}: Readonly<{
  recentDeclinedAssignments: Assignment[]
  projects: DistributableProject[]
  // O projeto já tem consultores suficientes (a recusa foi substituída)
  isCovered: (projectId: number) => boolean
  onRedistributeDeclined: (assignmentId: number) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<XCircle size={18} />}
        title="Recusas recentes"
        subtitle="Vagas abertas por consultores que recusaram o convite."
      />

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
              <div className="flex flex-col items-start gap-3">
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
                    {assignment.reason ?? "Recusa registrada pelo consultor."}
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
    </section>
  )
}
