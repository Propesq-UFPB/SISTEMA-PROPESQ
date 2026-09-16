import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { CriteriaSection } from "@/features/coordinator-evaluation/components/CriteriaSection"
import { EvaluationActionsBar } from "@/features/coordinator-evaluation/components/EvaluationActionsBar"
import { EvaluationAlerts } from "@/features/coordinator-evaluation/components/EvaluationAlerts"
import { EvaluationDetailHeader } from "@/features/coordinator-evaluation/components/EvaluationDetailHeader"
import { EvaluationMetrics } from "@/features/coordinator-evaluation/components/EvaluationMetrics"
import { JustificationForm } from "@/features/coordinator-evaluation/components/JustificationForm"
import { NonEvaluationAlert } from "@/features/coordinator-evaluation/components/NonEvaluationAlert"
import { OpinionSection } from "@/features/coordinator-evaluation/components/OpinionSection"
import { ProjectFullSection } from "@/features/coordinator-evaluation/components/ProjectFullSection"
import { WorkPlansSection } from "@/features/coordinator-evaluation/components/WorkPlansSection"
import { StatusIcon } from "@/features/coordinator-evaluation/components/StatusIcon"
import { useCoordinatorEvaluationDetail } from "@/features/coordinator-evaluation/hooks/useCoordinatorEvaluationDetail"
import { getStatusClass } from "@/features/coordinator-evaluation/utils/coordinatorEvaluationHelpers"

export default function CoordinatorEvaluationDetail() {
  const {
    id,
    evaluation,
    criteria,
    workPlans,
    generalOpinion,
    recommendations,
    nonEvaluationJustification,
    activeForm,
    lastAction,
    totalWeight,
    calculatedScore,
    completedCriteria,
    isReadyToSubmit,
    canSendNonEvaluationJustification,
    setActiveForm,
    setGeneralOpinion,
    setRecommendations,
    setNonEvaluationJustification,
    updateCriterionScore,
    updateCriterionOpinion,
    updateWorkPlanDecision,
    updateWorkPlanOpinion,
    handleSaveDraft,
    handleSubmit,
    handleSubmitJustification,
  } = useCoordinatorEvaluationDetail()

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/avaliacoes"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para avaliações
          </Link>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
              evaluation.status,
            )}`}
          >
            <StatusIcon status={evaluation.status} />
            {evaluation.status}
          </span>
        </div>

        <EvaluationDetailHeader
          evaluationId={id}
          evaluation={evaluation}
          completedCriteria={completedCriteria}
          criteriaCount={criteria.length}
          calculatedScore={calculatedScore}
        />

        <NonEvaluationAlert
          evaluationStartedAt={evaluation.evaluationStartedAt}
          canSendNonEvaluationJustification={canSendNonEvaluationJustification}
          activeForm={activeForm}
          onSelectForm={setActiveForm}
        />

        <EvaluationAlerts
          lastAction={lastAction}
          isReadyToSubmit={isReadyToSubmit}
        />

        {activeForm === "evaluation" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <EvaluationMetrics
              evaluation={evaluation}
              completedCriteria={completedCriteria}
              calculatedScore={calculatedScore}
            />

            <section className="mx-auto w-full max-w-7xl">
              <div className="space-y-6">
                <ProjectFullSection evaluation={evaluation} />

                <CriteriaSection
                  criteria={criteria}
                  totalWeight={totalWeight}
                  completedCriteria={completedCriteria}
                  calculatedScore={calculatedScore}
                  onUpdateScore={updateCriterionScore}
                  onUpdateOpinion={updateCriterionOpinion}
                />

                <WorkPlansSection
                  workPlans={workPlans}
                  onUpdateDecision={updateWorkPlanDecision}
                  onUpdateOpinion={updateWorkPlanOpinion}
                />

                <OpinionSection
                  generalOpinion={generalOpinion}
                  recommendations={recommendations}
                  onGeneralOpinionChange={setGeneralOpinion}
                  onRecommendationsChange={setRecommendations}
                />
              </div>
            </section>

            <EvaluationActionsBar onSaveDraft={handleSaveDraft} />
          </form>
        ) : (
          <JustificationForm
            evaluationStartedAt={evaluation.evaluationStartedAt}
            canSendNonEvaluationJustification={
              canSendNonEvaluationJustification
            }
            nonEvaluationJustification={nonEvaluationJustification}
            lastAction={lastAction}
            onJustificationChange={setNonEvaluationJustification}
            onSubmit={handleSubmitJustification}
          />
        )}
      </div>
    </main>
  )
}
