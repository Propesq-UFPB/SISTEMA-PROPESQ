import { useEffect, useState } from "react"
import { UserCheck } from "lucide-react"
import { distributionService } from "@/features/evaluation-distribution/api/distributionService"
import { AssignmentStatusBadge } from "@/features/evaluation-distribution/components/AssignmentStatusBadge"
import type { ProjectAssignment } from "@/features/evaluation-distribution/types/evaluationDistribution"
import { formatDate } from "@/features/evaluation-distribution/utils/evaluationDistributionHelpers"
import { apiErrorMessage } from "@/features/consultants/utils/consultantHelpers"

// Consultores convidados para avaliar o projeto (visível apenas para o gestor)
export function ProjectEvaluatorsSection({ projectId }: Readonly<{ projectId: number }>) {
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    distributionService
      .projectAssignments(projectId)
      .then(setAssignments)
      .catch((err) => setError(apiErrorMessage(err, "Não foi possível carregar os avaliadores.")))
      .finally(() => setLoading(false))
  }, [projectId])

  return (
    <section className="rounded-2xl border border-neutral/20 bg-white p-6">
      <div className="flex items-center gap-2">
        <UserCheck size={18} className="text-primary" />
        <h2 className="text-base font-semibold text-primary">Avaliadores</h2>
      </div>
      <p className="mt-1 text-sm text-neutral">
        Convites de avaliação enviados aos consultores na distribuição do edital.
      </p>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-4 text-sm text-neutral">Carregando avaliadores...</p>
      ) : assignments.length === 0 ? (
        <p className="mt-4 text-sm text-neutral">Este projeto ainda não foi distribuído.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral/20">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral/5 text-neutral">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Consultor</th>
                <th className="px-4 py-2 text-left font-semibold">Situação</th>
                <th className="px-4 py-2 text-left font-semibold">Convite</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-t border-neutral/10 align-top">
                  <td className="px-4 py-2">
                    <p className="font-semibold text-primary">{a.evaluatorName}</p>
                    <p className="text-xs text-neutral">{a.evaluatorEmail}</p>
                  </td>
                  <td className="px-4 py-2">
                    <AssignmentStatusBadge status={a.status} hasGrades={a.hasGrades} />
                    {a.status === "RECUSADO" && a.reason && (
                      <p className="mt-1 max-w-xs text-xs text-red-700">Motivo: {a.reason}</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-neutral">
                    Enviado em {formatDate(a.sentAt)}
                    {a.answeredAt && (
                      <>
                        <br />
                        respondido em {formatDate(a.answeredAt)}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
