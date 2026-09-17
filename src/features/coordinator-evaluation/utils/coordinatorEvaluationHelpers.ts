import type {
  Criterion,
  EvaluationDetail,
  EvaluationStatus,
  EvaluationWorkPlan,
  EvaluationWorkPlanDecision,
  HistoryItem,
} from "../types/coordinatorEvaluation"

export const evaluationMock: EvaluationDetail = {
  id: 3,
  projectId: 2,
  projectTitle:
    "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
  projectTitleEn:
    "Educational Data Analysis for Monitoring Academic Indicators",
  edital: "PIBITI 2026",
  ano: "2026",
  area: "Ciência de Dados",
  ods: "ODS 4 — Educação de qualidade",
  submittedAt: "07/05/2026",
  evaluationStartedAt: "15/05/2026",
  deadline: "18/05/2026",
  status: "Em avaliação",
  previousScore: null,
  keywords:
    "ciência de dados; indicadores acadêmicos; visualização de dados; gestão universitária",
  keywordsEn:
    "data science; academic indicators; data visualization; university management",
  summary:
    "O projeto propõe o desenvolvimento de indicadores e painéis analíticos para acompanhamento de dados educacionais, apoiando a gestão acadêmica e a tomada de decisão com base em dados.",
  abstract:
    "The project proposes the development of indicators and analytical dashboards to monitor educational data, supporting academic management and data-driven decision-making.",
  introduction:
    "A crescente disponibilidade de dados educacionais nas instituições de ensino superior demanda métodos sistemáticos de análise, integração e visualização. O projeto se insere nesse contexto ao propor uma abordagem aplicada para acompanhamento de indicadores acadêmicos.",
  objectives:
    "Construir uma solução analítica para consolidar dados acadêmicos, gerar indicadores de acompanhamento e apoiar processos de monitoramento institucional.",
  methodology:
    "A metodologia contempla levantamento de requisitos, análise das fontes de dados, modelagem dos indicadores, construção de protótipos de painéis, validação com usuários e documentação dos resultados.",
  expectedResults:
    "Espera-se entregar um conjunto de indicadores, painéis de visualização, relatório técnico e documentação metodológica sobre o uso dos dados educacionais analisados.",
  schedule:
    "Mês 1-2: levantamento e revisão. Mês 3-5: tratamento e modelagem dos dados. Mês 6-8: desenvolvimento dos painéis. Mês 9-11: validação. Mês 12: relatório final.",
  references:
    "Trabalhos sobre learning analytics, ciência de dados educacionais, visualização de dados, governança de dados e apoio à decisão institucional.",
  observations:
    "A proposta apresenta boa aderência ao edital, mas requer análise detalhada da viabilidade técnica, clareza metodológica e coerência entre objetivos, atividades e entregas.",
  complementaryPdf: "projeto-complementar.pdf",
  workPlans: [
    {
      id: 1,
      title: "Construção de painel de indicadores acadêmicos",
      student: "Discente 1",
      activities:
        "Levantamento de requisitos, tratamento de dados, construção de indicadores e prototipação dos painéis.",
      expectedResults:
        "Painel inicial de indicadores acadêmicos com documentação técnica e validação preliminar.",
      decision: "Selecione o resultado",
      opinion: "",
    },
    {
      id: 2,
      title: "Validação dos indicadores e documentação metodológica",
      student: "Discente 2",
      activities:
        "Validação dos indicadores com usuários, análise de consistência dos dados e elaboração da documentação metodológica.",
      expectedResults:
        "Relatório de validação, documentação dos indicadores e recomendações para continuidade.",
      decision: "Selecione o resultado",
      opinion: "",
    },
  ],
  history: [
    {
      id: 1,
      date: "15/05/2026",
      title: "Avaliação iniciada",
      description:
        "O projeto foi distribuído para avaliação por pares sem exibição dos dados do proponente.",
      status: "info",
    },
    {
      id: 2,
      date: "07/05/2026",
      title: "Projeto submetido",
      description: "A proposta foi enviada para análise conforme o edital.",
      status: "neutral",
    },
    {
      id: 3,
      date: "04/05/2026",
      title: "Rascunho finalizado",
      description: "A proposta foi concluída antes do envio.",
      status: "neutral",
    },
  ],
}

export const initialCriteria: Criterion[] = [
  {
    id: 1,
    label:
      "Adequação do resumo ao projeto situando o tema, aporte teórico-metodológico e objetivos",
    points: "0 a 10",
    weight: 1.0,
    score: "",
    opinion: "",
  },
  {
    id: 2,
    label: "Introdução e justificativa",
    points: "0 a 10",
    weight: 1.5,
    score: "",
    opinion: "",
  },
  {
    id: 3,
    label:
      "Relevância do projeto para o alcance dos objetivos do Programa de Iniciação Científica e/ou Tecnológica",
    points: "0 a 10",
    weight: 2.5,
    score: "",
    opinion: "",
  },
  {
    id: 4,
    label: "Adequação da metodologia aos objetivos",
    points: "0 a 10",
    weight: 2.5,
    score: "",
    opinion: "",
  },
  {
    id: 5,
    label: "Viabilidade, clareza e relevância dos objetivos",
    points: "0 a 10",
    weight: 1.0,
    score: "",
    opinion: "",
  },
  {
    id: 6,
    label: "Adequação e atualização das referências ao projeto",
    points: "0 a 10",
    weight: 0.5,
    score: "",
    opinion: "",
  },
  {
    id: 7,
    label: "Adequação do cronograma de atividades",
    points: "0 a 10",
    weight: 1.0,
    score: "",
    opinion: "",
  },
]

export function parseBrazilianDate(date: string) {
  const [day, month, year] = date.split("/").map(Number)
  return new Date(year, month - 1, day)
}

export function getDaysBetween(start: string, end: Date) {
  const startDate = parseBrazilianDate(start)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  const diffInMs = endDate.getTime() - startDate.getTime()

  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

export function getStatusClass(
  status: EvaluationStatus | EvaluationWorkPlanDecision,
) {
  switch (status) {
    case "Realizada":
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Justificativa enviada":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Pendente":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

export function getHistoryDotClass(status: HistoryItem["status"]) {
  switch (status) {
    case "success":
      return "bg-emerald-500"
    case "info":
      return "bg-blue-500"
    case "warning":
      return "bg-amber-500"
    case "danger":
      return "bg-red-500"
    case "neutral":
    default:
      return "bg-neutral/50"
  }
}

export function calcTotalWeight(criteria: readonly Criterion[]) {
  return criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
}

export function calcWeightedScore(
  criteria: readonly Criterion[],
  totalWeight: number,
) {
  if (totalWeight === 0) {
    return 0
  }

  const weightedSum = criteria.reduce((sum, criterion) => {
    const score = Number(criterion.score)

    if (criterion.score === "" || Number.isNaN(score)) {
      return sum
    }

    return sum + score * criterion.weight
  }, 0)

  return weightedSum / totalWeight
}

export function countCompletedCriteria(criteria: readonly Criterion[]) {
  return criteria.filter((criterion) => criterion.score !== "").length
}

export function areAllCriteriaFilled(criteria: readonly Criterion[]) {
  return criteria.every((criterion) => {
    const score = Number(criterion.score)

    return (
      criterion.score !== "" &&
      !Number.isNaN(score) &&
      score >= 0 &&
      score <= 10 &&
      criterion.opinion.trim().length > 0
    )
  })
}

export function areAllWorkPlansEvaluated(
  workPlans: readonly EvaluationWorkPlan[],
) {
  return workPlans.every(
    (workPlan) =>
      workPlan.decision !== "Selecione o resultado" &&
      workPlan.opinion.trim().length > 0,
  )
}

export function isReadyToSubmit(
  criteria: readonly Criterion[],
  workPlans: readonly EvaluationWorkPlan[],
  generalOpinion: string,
) {
  return (
    areAllCriteriaFilled(criteria) &&
    areAllWorkPlansEvaluated(workPlans) &&
    generalOpinion.trim().length > 0
  )
}

export function canSendNonEvaluationJustification(daysSinceStart: number) {
  return daysSinceStart <= 3
}

export function isValidCriterionScore(value: string) {
  if (value === "") {
    return true
  }

  const numericValue = Number(value)

  return !Number.isNaN(numericValue) && numericValue >= 0 && numericValue <= 10
}
