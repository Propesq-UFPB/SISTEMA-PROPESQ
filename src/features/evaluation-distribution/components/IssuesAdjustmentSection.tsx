import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react"
import type {
  DistributableProject,
  DistributionIssue,
  DistributionPreview,
  Evaluator,
} from "../types/evaluationDistribution"
import { EmptyState, SectionTitle, SmallBadge } from "./formPrimitives"

function issueButtonClassName(isSelected: boolean) {
  if (isSelected) {
    return "w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition"
  }
  return "w-full rounded-2xl border border-neutral/10 bg-white p-4 text-left transition hover:border-red-200 hover:bg-red-50"
}

function manualActionClassName(alreadyAssigned: boolean, blocked: boolean) {
  if (alreadyAssigned) {
    return "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
  }
  if (blocked) {
    return "cursor-not-allowed rounded-xl border border-neutral/10 bg-neutral-light px-3 py-2 text-xs font-semibold text-neutral/50 transition"
  }
  return "rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
}

export function IssuesAdjustmentSection({
  issueProjects,
  selectedIssueProject,
  preview,
  manualCandidatesForIssue,
  onSelectIssueProject,
  onManualAddForIssue,
}: Readonly<{
  issueProjects: {
    issue: DistributionIssue
    project: DistributableProject
  }[]
  selectedIssueProject: DistributableProject | null
  preview: DistributionPreview | null
  manualCandidatesForIssue: {
    evaluator: Evaluator
    score: number
    projectedLoad: number
    alreadyAssigned: boolean
    blocked: boolean
    conflict: boolean
  }[]
  onSelectIssueProject: (projectId: number) => void
  onManualAddForIssue: (evaluatorId: number) => void
}>) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={<AlertTriangle size={18} />}
          title="Fila de exceções"
          subtitle="Casos que precisam de ajuste manual."
        />

        {issueProjects.length > 0 ? (
          <div className="space-y-3">
            {issueProjects.map(({ issue, project }) => {
              const isSelected = selectedIssueProject?.id === project.id

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectIssueProject(project.id)}
                  className={issueButtonClassName(isSelected)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">
                        {project.code}
                      </p>

                      <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-xs text-neutral">
                        {project.area} · {project.subarea}
                      </p>
                    </div>

                    <SmallBadge className="bg-red-100 text-red-700">
                      Faltam {issue.missing}
                    </SmallBadge>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-red-700">
                    {issue.reason}
                  </p>
                </button>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<CheckCircle2 size={28} />}
            title="Nenhuma exceção pendente"
            desc="Depois de gerar a prévia, os casos problemáticos aparecem aqui."
            success
          />
        )}
      </section>

      {selectedIssueProject && preview ? (
        <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={<SlidersHorizontal size={18} />}
            title="Ajuste manual"
            subtitle="Use somente para completar uma exceção."
          />

          <div className="mb-4 rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
            <p className="text-xs font-semibold text-primary">
              {selectedIssueProject.code}
            </p>

            <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
              {selectedIssueProject.title}
            </h3>

            <p className="mt-2 text-xs text-neutral">
              {selectedIssueProject.grandeArea} ·{" "}
              {selectedIssueProject.area} · {selectedIssueProject.subarea}
            </p>
          </div>

          <div className="space-y-3">
            {manualCandidatesForIssue.map(
              ({
                evaluator,
                score,
                projectedLoad,
                alreadyAssigned,
                blocked,
                conflict,
              }) => (
                <div
                  key={evaluator.id}
                  className="rounded-2xl border border-neutral/10 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-dark">
                        {evaluator.name}
                      </h3>

                      <p className="mt-1 text-xs text-neutral">
                        {evaluator.unit} · {evaluator.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={blocked && !alreadyAssigned}
                      onClick={() => onManualAddForIssue(evaluator.id)}
                      className={manualActionClassName(
                        alreadyAssigned,
                        blocked,
                      )}
                    >
                      {alreadyAssigned ? "Remover" : "Adicionar"}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <SmallBadge>Afinidade: {score}/6</SmallBadge>

                    <SmallBadge>
                      Carga: {projectedLoad}/{evaluator.maxAssignments}
                    </SmallBadge>

                    {conflict ? (
                      <SmallBadge className="bg-red-50 text-red-700">
                        <ShieldAlert size={13} />
                        Conflito
                      </SmallBadge>
                    ) : null}

                    {projectedLoad >= evaluator.maxAssignments ? (
                      <SmallBadge className="bg-amber-50 text-amber-700">
                        <CircleAlert size={13} />
                        Sem capacidade
                      </SmallBadge>
                    ) : null}

                    {evaluator.unavailable ? (
                      <SmallBadge className="bg-neutral-light text-neutral">
                        Indisponível
                      </SmallBadge>
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}
