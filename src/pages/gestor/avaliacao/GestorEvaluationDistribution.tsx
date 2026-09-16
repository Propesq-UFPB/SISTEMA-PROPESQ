import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import { AreaSummarySection } from "@/features/evaluation-distribution/components/AreaSummarySection"
import { BatchDistributionSection } from "@/features/evaluation-distribution/components/BatchDistributionSection"
import { ExistingAssignmentsSection } from "@/features/evaluation-distribution/components/ExistingAssignmentsSection"
import { IssuesAdjustmentSection } from "@/features/evaluation-distribution/components/IssuesAdjustmentSection"
import { PageHeader } from "@/features/evaluation-distribution/components/PageHeader"
import { useGestorEvaluationDistribution } from "@/features/evaluation-distribution/hooks/useGestorEvaluationDistribution"

export default function GestorEvaluationDistribution() {
  const {
    projects,
    evaluators,
    preview,
    pendingProjects,
    distributedProjects,
    issueProjects,
    selectedIssueProject,
    totalDraftAssignments,
    projectsCompletedInPreview,
    assignmentSummary,
    areaSummary,
    recentDeclinedAssignments,
    manualCandidatesForIssue,
    setSelectedIssueProjectId,
    handleGenerateSmartPreview,
    handleConfirmPreview,
    handleClearPreview,
    handleManualAddForIssue,
    handleResendDeclined,
  } = useGestorEvaluationDistribution()

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

          <PageHeader
            totalProjects={projects.length}
            pendingProjects={pendingProjects.length}
            distributedProjects={distributedProjects.length}
            issueCount={preview?.issues.length ?? 0}
          />

          <BatchDistributionSection
            preview={preview}
            pendingProjectsCount={pendingProjects.length}
            totalDraftAssignments={totalDraftAssignments}
            projectsCompletedInPreview={projectsCompletedInPreview}
            onGenerateSmartPreview={handleGenerateSmartPreview}
            onConfirmPreview={handleConfirmPreview}
            onClearPreview={handleClearPreview}
          />

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <AreaSummarySection areaSummary={areaSummary} />

              <ExistingAssignmentsSection
                assignmentSummary={assignmentSummary}
                recentDeclinedAssignments={recentDeclinedAssignments}
                projects={projects}
                evaluators={evaluators}
                onResendDeclined={handleResendDeclined}
              />
            </div>

            <IssuesAdjustmentSection
              issueProjects={issueProjects}
              selectedIssueProject={selectedIssueProject}
              preview={preview}
              manualCandidatesForIssue={manualCandidatesForIssue}
              onSelectIssueProject={setSelectedIssueProjectId}
              onManualAddForIssue={handleManualAddForIssue}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
