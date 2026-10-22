import { AlertTriangle, CheckCircle2 } from "lucide-react"
import type { DistributableProject, DistributionIssue } from "../types/evaluationDistribution"
import { projectAreaLabel } from "../utils/evaluationDistributionHelpers"
import { EmptyState, SectionTitle, SmallBadge } from "./formPrimitives"

function issueButtonClassName(isSelected: boolean) {
  if (isSelected) {
    return "w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition"
  }
  return "w-full rounded-2xl border border-neutral/10 bg-white p-4 text-left transition hover:border-red-200 hover:bg-red-50"
}

export function IssuesQueueSection({
  issueProjects,
  selectedProjectId,
  onSelectProject,
}: Readonly<{
  issueProjects: { issue: DistributionIssue; project: DistributableProject }[]
  selectedProjectId: number | null
  onSelectProject: (projectId: number) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<AlertTriangle size={18} />}
        title="Fila de exceções"
        subtitle="Projetos do rascunho com menos consultores que o necessário."
      />

      {issueProjects.length > 0 ? (
        <div className="space-y-3">
          {issueProjects.map(({ issue, project }) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={issueButtonClassName(selectedProjectId === project.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary">{project.code}</p>
                  <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral">{projectAreaLabel(project)}</p>
                </div>
                <SmallBadge className="bg-red-100 text-red-700">
                  Faltam {issue.missing}
                </SmallBadge>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CheckCircle2 size={28} />}
          title="Nenhuma exceção pendente"
          desc="Todos os projetos do rascunho têm consultores suficientes."
          success
        />
      )}
    </section>
  )
}
