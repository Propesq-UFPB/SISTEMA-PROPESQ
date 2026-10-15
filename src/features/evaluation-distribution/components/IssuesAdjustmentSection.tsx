import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Lock,
  SlidersHorizontal,
} from "lucide-react"
import type {
  CandidateRow,
  DistributableProject,
  DistributionIssue,
} from "../types/evaluationDistribution"
import { affinityLabel, projectAreaLabel } from "../utils/evaluationDistributionHelpers"
import { EmptyState, SectionTitle, SmallBadge } from "./formPrimitives"

function issueButtonClassName(isSelected: boolean) {
  if (isSelected) {
    return "w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition"
  }
  return "w-full rounded-2xl border border-neutral/10 bg-white p-4 text-left transition hover:border-red-200 hover:bg-red-50"
}

function manualActionClassName(inDraft: boolean, locked: boolean) {
  if (locked) {
    return "inline-flex items-center gap-1 cursor-not-allowed rounded-xl border border-neutral/10 bg-neutral-light px-3 py-2 text-xs font-semibold text-neutral/60"
  }
  if (inDraft) {
    return "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
  }
  return "rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
}

export function IssuesAdjustmentSection({
  hasDraft,
  issueProjects,
  selectedProject,
  candidates,
  candidatesLoading,
  maxPerConsultant,
  onSelectProject,
  onToggleCandidate,
}: Readonly<{
  hasDraft: boolean
  issueProjects: { issue: DistributionIssue; project: DistributableProject }[]
  selectedProject: DistributableProject | null
  candidates: CandidateRow[]
  candidatesLoading: boolean
  maxPerConsultant: number
  onSelectProject: (projectId: number) => void
  onToggleCandidate: (candidate: CandidateRow) => void
}>) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={<AlertTriangle size={18} />}
          title="Fila de exceções"
          subtitle="Projetos do rascunho com menos consultores que o necessário."
        />

        {issueProjects.length > 0 ? (
          <div className="max-h-[420px] space-y-3 overflow-y-auto">
            {issueProjects.map(({ issue, project }) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={issueButtonClassName(selectedProject?.id === project.id)}
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
            desc={
              hasDraft
                ? "Todos os projetos do rascunho têm consultores suficientes."
                : "Gere uma prévia ou ajuste a distribuição atual para ver os casos pendentes."
            }
            success
          />
        )}
      </section>

      {selectedProject && hasDraft ? (
        <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={<SlidersHorizontal size={18} />}
            title="Ajuste manual"
            subtitle="Inclua ou remova consultores deste projeto no rascunho."
          />

          <div className="mb-4 rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
            <p className="text-xs font-semibold text-primary">{selectedProject.code}</p>
            <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
              {selectedProject.title}
            </h3>
            <p className="mt-2 text-xs text-neutral">
              {projectAreaLabel(selectedProject)}
              {selectedProject.area?.subArea && ` › ${selectedProject.area.subArea}`}
              {selectedProject.coordinator && ` · Coord.: ${selectedProject.coordinator}`}
            </p>
          </div>

          {candidatesLoading ? (
            <p className="flex items-center gap-2 text-sm text-neutral">
              <Loader2 size={16} className="animate-spin" />
              Carregando candidatos...
            </p>
          ) : candidates.length === 0 ? (
            <p className="text-sm text-neutral">
              Nenhum consultor do edital apto para este projeto (conflito de interesse ou recusa).
            </p>
          ) : (
            <div className="max-h-[520px] space-y-3 overflow-y-auto">
              {candidates.map((candidate) => (
                <div
                  key={candidate.consultantId}
                  className={`rounded-2xl border p-4 ${
                    candidate.inDraft ? "border-primary/30 bg-primary/5" : "border-neutral/10 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-dark">{candidate.name}</h3>
                      <p className="mt-1 text-xs text-neutral">{affinityLabel(candidate.score)}</p>
                    </div>

                    <button
                      type="button"
                      disabled={candidate.locked}
                      onClick={() => onToggleCandidate(candidate)}
                      title={candidate.locked ? "Avaliação já iniciada" : undefined}
                      className={manualActionClassName(candidate.inDraft, candidate.locked)}
                    >
                      {candidate.locked && <Lock size={12} />}
                      {candidate.inDraft ? "Remover" : "Adicionar"}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <SmallBadge>Afinidade: {candidate.score}</SmallBadge>
                    <SmallBadge>
                      Carga no rascunho: {candidate.draftLoad}/{maxPerConsultant}
                    </SmallBadge>
                    {candidate.overMax && !candidate.inDraft ? (
                      <SmallBadge className="bg-amber-50 text-amber-700">
                        <CircleAlert size={13} />
                        Acima do máximo
                      </SmallBadge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
