import { type FormEvent, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type {
  ActiveForm,
  Criterion,
  EvaluationWorkPlan,
  EvaluationWorkPlanDecision,
  LastAction,
} from "../types/coordinatorEvaluation"
import {
  calcTotalWeight,
  calcWeightedScore,
  canSendNonEvaluationJustification,
  countCompletedCriteria,
  evaluationMock,
  getDaysBetween,
  initialCriteria,
  isReadyToSubmit,
  isValidCriterionScore,
} from "../utils/coordinatorEvaluationHelpers"

export function useCoordinatorEvaluationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const evaluation = evaluationMock

  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria)
  const [workPlans, setWorkPlans] = useState<EvaluationWorkPlan[]>(
    evaluation.workPlans,
  )
  const [generalOpinion, setGeneralOpinion] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [nonEvaluationJustification, setNonEvaluationJustification] =
    useState("")
  const [activeForm, setActiveForm] = useState<ActiveForm>("evaluation")
  const [lastAction, setLastAction] = useState<LastAction>(null)

  const totalWeight = useMemo(() => calcTotalWeight(criteria), [criteria])

  const calculatedScore = useMemo(
    () => calcWeightedScore(criteria, totalWeight),
    [criteria, totalWeight],
  )

  const completedCriteria = useMemo(
    () => countCompletedCriteria(criteria),
    [criteria],
  )

  const readyToSubmit = useMemo(
    () => isReadyToSubmit(criteria, workPlans, generalOpinion),
    [criteria, workPlans, generalOpinion],
  )

  const daysSinceEvaluationStart = getDaysBetween(
    evaluation.evaluationStartedAt,
    new Date(),
  )

  const canSendJustification = canSendNonEvaluationJustification(
    daysSinceEvaluationStart,
  )

  function updateCriterionScore(criterionId: number, value: string) {
    if (!isValidCriterionScore(value)) {
      return
    }

    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              score: value,
            }
          : criterion,
      ),
    )
  }

  function updateCriterionOpinion(criterionId: number, value: string) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              opinion: value,
            }
          : criterion,
      ),
    )
  }

  function updateWorkPlanDecision(
    workPlanId: number,
    decision: EvaluationWorkPlanDecision,
  ) {
    setWorkPlans((current) =>
      current.map((workPlan) =>
        workPlan.id === workPlanId
          ? {
              ...workPlan,
              decision,
            }
          : workPlan,
      ),
    )
  }

  function updateWorkPlanOpinion(workPlanId: number, value: string) {
    setWorkPlans((current) =>
      current.map((workPlan) =>
        workPlan.id === workPlanId
          ? {
              ...workPlan,
              opinion: value,
            }
          : workPlan,
      ),
    )
  }

  function handleSaveDraft() {
    setLastAction("draft")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("submit")

    if (!readyToSubmit) {
      return
    }

    navigate("/coordenador/avaliacoes")
  }

  function handleSubmitJustification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("justify")

    if (
      !canSendJustification ||
      nonEvaluationJustification.trim().length === 0
    ) {
      return
    }

    navigate("/coordenador/avaliacoes")
  }

  return {
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
    isReadyToSubmit: readyToSubmit,
    canSendNonEvaluationJustification: canSendJustification,
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
  }
}
