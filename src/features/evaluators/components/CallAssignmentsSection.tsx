import { AlertCircle, Check, ClipboardList } from "lucide-react"
import type { Assignment, Evaluator, Project } from "../types/evaluators"
import {
  formatDate,
  getEvaluator,
  getProject,
} from "../utils/evaluatorHelpers"
import { Section, TableCell, TableHead } from "./formPrimitives"

export function CallAssignmentsSection({
  assignments,
  projects,
  evaluators,
}: Readonly<{
  assignments: Assignment[]
  projects: Project[]
  evaluators: Evaluator[]
}>) {
  return (
    <Section
      title="Avaliações vinculadas ao edital"
      description="Resumo das avaliações já relacionadas ao edital selecionado. A distribuição detalhada deve ficar na página própria de Distribuição."
      icon={<ClipboardList size={18} />}
    >
      <div className="overflow-hidden rounded-2xl border border-neutral-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-light">
            <thead className="bg-neutral-50">
              <tr>
                <TableHead>Projeto</TableHead>
                <TableHead>Avaliador</TableHead>
                <TableHead align="center">Avaliação cega</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead align="center">Status</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-light bg-white">
              {assignments.map((assignment) => {
                const project = getProject(projects, assignment.projectId)
                const evaluator = getEvaluator(
                  evaluators,
                  assignment.evaluatorId,
                )

                return (
                  <tr
                    key={assignment.id}
                    className="transition hover:bg-neutral-50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-primary">
                          {project?.id ?? assignment.projectId}
                        </p>
                        <p className="mt-0.5 max-w-md truncate text-[11px] text-neutral">
                          {project?.title ?? "Projeto não encontrado"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-semibold text-primary">
                          {evaluator?.name ?? "Avaliador não encontrado"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral">
                          {evaluator?.email ?? "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell align="center">
                      {assignment.blind ? (
                        <span className="font-semibold text-emerald-700">
                          Sim
                        </span>
                      ) : (
                        <span className="font-semibold text-neutral">
                          Não
                        </span>
                      )}
                    </TableCell>

                    <TableCell>{formatDate(assignment.dueAt)}</TableCell>

                    <TableCell align="center">
                      {assignment.status === "SUBMITTED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          <Check size={12} />
                          Submetida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                          <AlertCircle size={12} />
                          Pendente
                        </span>
                      )}
                    </TableCell>
                  </tr>
                )
              })}

              {assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-sm text-neutral"
                  >
                    Nenhuma avaliação vinculada ao edital selecionado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
