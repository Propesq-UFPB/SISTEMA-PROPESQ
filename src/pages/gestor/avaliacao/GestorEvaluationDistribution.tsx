import { useState } from "react"
import { AlertCircle, FileSearch } from "lucide-react"
import { Helmet } from "react-helmet"
import { ConsultantAssignmentsDrawer } from "@/features/consultants/components/ConsultantAssignmentsDrawer"
import { EditalConsultantsModal } from "@/features/consultants/components/EditalConsultantsModal"
import { AreaSummarySection } from "@/features/evaluation-distribution/components/AreaSummarySection"
import { BatchDistributionSection } from "@/features/evaluation-distribution/components/BatchDistributionSection"
import { DeclinedAssignmentsSection } from "@/features/evaluation-distribution/components/DeclinedAssignmentsSection"
import { DraftAssignmentsSection } from "@/features/evaluation-distribution/components/DraftAssignmentsSection"
import { EditalAssignmentsSection } from "@/features/evaluation-distribution/components/EditalAssignmentsSection"
import { EditalSelector } from "@/features/evaluation-distribution/components/EditalSelector"
import { IssuesQueueSection } from "@/features/evaluation-distribution/components/IssuesQueueSection"
import { ManualAdjustmentSection } from "@/features/evaluation-distribution/components/ManualAdjustmentSection"
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
  const [consultantsOpen, setConsultantsOpen] = useState(false)

  const stats = selectedEdital
    ? {
        totalProjects: projects.length,
        pendingProjects: pendingProjects.length,
        distributedProjects: distributedProjects.length,
        invitesPending: summary.pendentes,
        invitesAccepted: summary.aceitos,
        invitesDeclined: summary.recusados,
        consultants: editalConsultants.linked.length,
      }
    : null

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Helmet>
          <title>Distribuição de Avaliações • PROPESQ</title>
        </Helmet>

        <PageHeader
          onManageConsultants={() => setConsultantsOpen(true)}
          stats={loading || editalConsultants.loading ? null : stats}
          selector={
            <EditalSelector
              editais={editais}
              loading={editaisLoading}
              error={editaisError}
              selectedEditalId={selectedEditalId}
              onSelectedEditalIdChange={handleSelectEdital}
            />
          }
        />

        {error && (
          <div className="flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {!selectedEdital ? (
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
        ) : loading ? (
          <p className="text-sm text-neutral">Carregando projetos e convites...</p>
        ) : (
          <>
            <BatchDistributionSection
              params={params}
              onParamsChange={setParams}
              draft={draft}
              busy={busy}
              hasAssignments={assignments.some((a) => a.status !== "RECUSADO")}
              totalProjects={projects.length}
              completedInDraft={draft ? projects.length - issues.length : 0}
              issueCount={issues.length}
              impact={impact}
              lastResult={lastResult}
              onGeneratePreview={() => void handleGeneratePreview()}
              onAdjustCurrent={() => handleAdjustCurrent()}
              onConfirm={() => void handleConfirm()}
              onClear={handleClearDraft}
            />

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {draft ? (
                <DraftAssignmentsSection
                  draft={draft}
                  projects={projects}
                  consultants={editalConsultants.linked}
                  perProject={params.perProject}
                  selectedProjectId={selectedProject?.id ?? null}
                  onSelectProject={setSelectedProjectId}
                />
              ) : (
                <EditalAssignmentsSection
                  projects={projects}
                  assignments={assignments}
                  perProject={params.perProject}
                  onOpenConsultant={setOpenConsultant}
                />
              )}

              {/* Painel lateral: acompanha a rolagem da tabela */}
              <aside className="space-y-6 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
                {draft && selectedProject ? (
                  <ManualAdjustmentSection
                    selectedProject={selectedProject}
                    candidates={candidatesForSelected}
                    candidatesLoading={candidatesLoading}
                    maxPerConsultant={params.maxPerConsultant}
                    onToggleCandidate={handleToggleCandidate}
                    onClose={() => setSelectedProjectId(null)}
                  />
                ) : null}

                {draft ? (
                  <IssuesQueueSection
                    issueProjects={issueProjects}
                    selectedProjectId={selectedProject?.id ?? null}
                    onSelectProject={setSelectedProjectId}
                  />
                ) : null}

                {recentDeclinedAssignments.length > 0 ? (
                  <DeclinedAssignmentsSection
                    recentDeclinedAssignments={recentDeclinedAssignments}
                    projects={projects}
                    isCovered={isCovered}
                    onRedistributeDeclined={handleRedistributeDeclined}
                  />
                ) : null}

                <AreaSummarySection areaSummary={areaSummary} />
              </aside>
            </div>
          </>
        )}
      </div>

      {consultantsOpen && selectedEdital && (
        <EditalConsultantsModal
          state={editalConsultants}
          editalLabel={[selectedEdital.codigo, selectedEdital.descricao].filter(Boolean).join(" • ")}
          onClose={() => setConsultantsOpen(false)}
        />
      )}

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
