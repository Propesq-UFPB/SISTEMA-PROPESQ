export type EvaluationStatus =
  | "Pendente"
  | "Em avaliação"
  | "Realizada"
  | "Justificativa enviada"

export type EvaluationWorkPlanDecision =
  | "Selecione o resultado"
  | "Aprovado"
  | "Reprovado"

export type Criterion = {
  id: number
  label: string
  points: string
  weight: number
  score: string
  opinion: string
}

export type EvaluationWorkPlan = {
  id: number
  title: string
  student: string
  activities: string
  expectedResults: string
  decision: EvaluationWorkPlanDecision
  opinion: string
}

export type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

export type EvaluationDetail = {
  id: number
  projectId: number
  projectTitle: string
  projectTitleEn: string
  edital: string
  ano: string
  area: string
  ods: string
  submittedAt: string
  evaluationStartedAt: string
  deadline: string
  status: EvaluationStatus
  previousScore: number | null
  keywords: string
  keywordsEn: string
  summary: string
  abstract: string
  introduction: string
  objectives: string
  methodology: string
  expectedResults: string
  schedule: string
  references: string
  observations: string
  complementaryPdf: string
  workPlans: EvaluationWorkPlan[]
  history: HistoryItem[]
}

export type ActiveForm = "evaluation" | "justification"

export type LastAction = "draft" | "submit" | "justify" | null
