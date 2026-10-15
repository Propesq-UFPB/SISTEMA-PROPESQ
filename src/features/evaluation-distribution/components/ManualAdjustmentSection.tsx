import { useEffect, useRef } from "react"
import { CircleAlert, Loader2, Lock, SlidersHorizontal, X } from "lucide-react"
import type { CandidateRow, DistributableProject } from "../types/evaluationDistribution"
import { affinityLabel, projectAreaLabel } from "../utils/evaluationDistributionHelpers"
import { SectionTitle, SmallBadge } from "./formPrimitives"

function manualActionClassName(inDraft: boolean, locked: boolean) {
  if (locked) {
    return "inline-flex items-center gap-1 cursor-not-allowed rounded-xl border border-neutral/10 bg-neutral-light px-3 py-2 text-xs font-semibold text-neutral/60"
  }
  if (inDraft) {
    return "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
  }
  return "rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
}

export function ManualAdjustmentSection({
  selectedProject,
  candidates,
  candidatesLoading,
  maxPerConsultant,
  onToggleCandidate,
  onClose,
}: Readonly<{
  selectedProject: DistributableProject
  candidates: CandidateRow[]
  candidatesLoading: boolean
  maxPerConsultant: number
  onToggleCandidate: (candidate: CandidateRow) => void
  onClose: () => void
}>) {
  const sectionRef = useRef<HTMLElement>(null)

  // Em telas estreitas o painel fica abaixo da tabela: traz para a vista ao trocar de projeto
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [selectedProject.id])

  return (
    <section ref={sectionRef} className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <SectionTitle
          icon={<SlidersHorizontal size={18} />}
          title="Ajuste manual"
          subtitle="Inclua ou remova consultores deste projeto no rascunho."
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar ajuste manual"
          className="rounded-lg p-1.5 text-neutral transition hover:bg-neutral-light hover:text-primary"
        >
          <X size={16} />
        </button>
      </div>

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
        <div className="space-y-3">
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
  )
}
