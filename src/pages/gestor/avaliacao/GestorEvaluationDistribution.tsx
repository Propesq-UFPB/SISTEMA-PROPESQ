import { useState } from "react"
import { AlertCircle, ArrowLeft, FileSearch } from "lucide-react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import { ConsultantAssignmentsDrawer } from "@/features/consultants/components/ConsultantAssignmentsDrawer"
import { EditalConsultantsSection } from "@/features/consultants/components/EditalConsultantsSection"
import { EditalAssignmentsSection } from "@/features/evaluation-distribution/components/EditalAssignmentsSection"
import { AreaSummarySection } from "@/features/evaluation-distribution/components/AreaSummarySection"
import { BatchDistributionSection } from "@/features/evaluation-distribution/components/BatchDistributionSection"
import { DraftAssignmentsSection } from "@/features/evaluation-distribution/components/DraftAssignmentsSection"
import { EditalSelectorSection } from "@/features/evaluation-distribution/components/EditalSelectorSection"
import { ExistingAssignmentsSection } from "@/features/evaluation-distribution/components/ExistingAssignmentsSection"
import { IssuesAdjustmentSection } from "@/features/evaluation-distribution/components/IssuesAdjustmentSection"
import { PageHeader } from "@/features/evaluation-distribution/components/PageHeader"
import { useGestorEvaluationDistribution } from "@/features/evaluation-distribution/hooks/useGestorEvaluationDistribution"

export default function GestorEvaluationDistribution() {
  const {
    editais,
    editaisLoading,
    editaisError,
    selectedEditalId,
    selectedEdital,
    handleSelectEdital,
    editalConsultants,
    projects,
    assignments,
    loading,
    error,
    busy,
    lastResult,
    params,
    setParams,
    draft,
    issues,
    issueProjects,
    impact,
    pendingProjects,
    distributedProjects,
    selectedProject,
    setSelectedProjectId,
    candidatesForSelected,
    candidatesLoading,
    summary,
    areaSummary,
    recentDeclinedAssignments,
    isCovered,
    handleGeneratePreview,
    handleAdjustCurrent,
    handleClearDraft,
    handleToggleCandidate,
    handleConfirm,
    handleRedistributeDeclined,
  } = useGestorEvaluationDistribution()

  const [openConsultant, setOpenConsultant] = useState<{ id: number; name: string } | null>(null)

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Helmet>
            <title>Distribuição de Avaliações • PROPESQ</title>
          </Helmet>

          <div className="flex items-center justify-between">
            <Link
              to="/gestor/avaliacao/avaliadores"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para Avaliadores
            </Link>
          </div>

          <EditalSelectorSection
            editais={editais}
            loading={editaisLoading}
            error={editaisError}
            selectedEditalId={selectedEditalId}
            onSelectedEditalIdChange={handleSelectEdital}
          />

          {selectedEdital ? (
            <>
              <EditalConsultantsSection state={editalConsultants} />

              <PageHeader
                totalProjects={projects.length}
                pendingProjects={pendingProjects.length}
                distributedProjects={distributedProjects.length}
                issueCount={issues.length}
              />

              {error && (
                <div className="flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {loading ? (
                <p className="text-sm text-neutral">Carregando projetos e convites...</p>
              ) : (
                <>
                  <BatchDistributionSection
                    params={params}
                    onParamsChange={setParams}
                    draft={draft}
                    busy={busy}
                    hasAssignments={assignments.some((a) => a.status !== "RECUSADO")}
                    pendingProjectsCount={pendingProjects.length}
                    completedInDraft={draft ? projects.length - issues.length : 0}
                    issueCount={issues.length}
                    impact={impact}
                    lastResult={lastResult}
                    onGeneratePreview={() => void handleGeneratePreview()}
                    onAdjustCurrent={() => handleAdjustCurrent()}
                    onConfirm={() => void handleConfirm()}
                    onClear={handleClearDraft}
                  />

                  {draft && (
                    <DraftAssignmentsSection
                      draft={draft}
                      projects={projects}
                      consultants={editalConsultants.linked}
                      perProject={params.perProject}
                      selectedProjectId={selectedProject?.id ?? null}
                      onSelectProject={setSelectedProjectId}
                    />
                  )}

                  <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-6">
                      <AreaSummarySection areaSummary={areaSummary} />

                      <ExistingAssignmentsSection
                        summary={summary}
                        recentDeclinedAssignments={recentDeclinedAssignments}
                        projects={projects}
                        isCovered={isCovered}
                        onRedistributeDeclined={handleRedistributeDeclined}
                      />
                    </div>

                    <IssuesAdjustmentSection
                      hasDraft={Boolean(draft)}
                      issueProjects={issueProjects}
                      selectedProject={selectedProject}
                      candidates={candidatesForSelected}
                      candidatesLoading={candidatesLoading}
                      maxPerConsultant={params.maxPerConsultant}
                      onSelectProject={setSelectedProjectId}
                      onToggleCandidate={handleToggleCandidate}
                    />
                  </section>

                  <EditalAssignmentsSection
                    projects={projects}
                    assignments={assignments}
                    perProject={params.perProject}
                    onOpenConsultant={setOpenConsultant}
                  />
                </>
              )}
            </>
          ) : (
            <section className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-neutral/20 bg-white px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileSearch size={22} />
              </div>
              <h2 className="text-base font-semibold text-primary">
                Selecione um edital para iniciar a distribuição
              </h2>
              <p className="max-w-md text-sm leading-6 text-neutral">
                A distribuição de avaliações é feita por edital. Escolha o
                edital acima para visualizar os projetos e gerar a prévia.
              </p>
            </section>
          )}
        </div>
      </div>

      {openConsultant && (
        <ConsultantAssignmentsDrawer
          consultant={openConsultant}
          initialEditalId={selectedEdital?.id ?? null}
          onClose={() => setOpenConsultant(null)}
        />
      )}
    </div>
  )
}
