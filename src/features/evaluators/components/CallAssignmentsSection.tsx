import { AlertCircle, Check, ClipboardList } from "lucide-react"
import type { Assignment, Evaluator, Project } from "../types/evaluators"
import {
  formatDate,
  getEvaluator,
  getProject,
} from "../utils/evaluatorHelpers"
import {
  Section,
  StatusPill,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeadRow,
  TableRow,
  TableWrapper,
} from "./formPrimitives"

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
      <TableWrapper>
        <TableHeadRow>
          <TableHead>Projeto</TableHead>
          <TableHead>Avaliador</TableHead>
          <TableHead align="center">Avaliação cega</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead align="center">Status</TableHead>
        </TableHeadRow>

        <tbody>
          {assignments.length === 0 ? (
            <TableEmptyRow colSpan={5}>
              Nenhuma avaliação vinculada ao edital selecionado.
            </TableEmptyRow>
          ) : (
            assignments.map((assignment) => {
              const project = getProject(projects, assignment.projectId)
              const evaluator = getEvaluator(evaluators, assignment.evaluatorId)

              return (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <p className="text-xs font-semibold text-primary">
                      {project?.id ?? assignment.projectId}
                    </p>
                    <p className="max-w-md truncate font-medium text-neutral-dark">
                      {project?.title ?? "Projeto não encontrado"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-primary">
                      {evaluator?.name ?? "Avaliador não encontrado"}
                    </p>
                    <p className="text-xs text-neutral">
                      {evaluator?.email ?? "—"}
                    </p>
                  </TableCell>

                  <TableCell align="center">
                    {assignment.blind ? (
                      <span className="font-semibold text-emerald-700">Sim</span>
                    ) : (
                      <span className="font-semibold text-neutral">Não</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="whitespace-nowrap">
                      {formatDate(assignment.dueAt)}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {assignment.status === "SUBMITTED" ? (
                      <StatusPill tone="success" icon={<Check size={12} />}>
                        Submetida
                      </StatusPill>
                    ) : (
                      <StatusPill tone="warning" icon={<AlertCircle size={12} />}>
                        Pendente
                      </StatusPill>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </tbody>
      </TableWrapper>
    </Section>
  )
}
