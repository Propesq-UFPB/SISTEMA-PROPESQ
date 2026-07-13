import { FormEvent, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Info,
  Save,
  Send,
  Star,
  Timer,
  XCircle,
} from "lucide-react"

type EvaluationStatus =
  | "Pendente"
  | "Em avaliação"
  | "Realizada"
  | "Justificativa enviada"

type WorkPlanDecision =
  | "Selecione o resultado"
  | "Aprovado"
  | "Reprovado"

type Criterion = {
  id: number
  label: string
  points: string
  weight: number
  score: string
  opinion: string
}

type WorkPlan = {
  id: number
  title: string
  student: string
  activities: string
  expectedResults: string
  decision: WorkPlanDecision
  opinion: string
}

type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

type EvaluationDetail = {
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
  workPlans: WorkPlan[]
  history: HistoryItem[]
}

const evaluationMock: EvaluationDetail = {
  id: 3,
  projectId: 2,
  projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
  projectTitleEn: "Educational Data Analysis for Monitoring Academic Indicators",
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

const initialCriteria: Criterion[] = [
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

function parseBrazilianDate(date: string) {
  const [day, month, year] = date.split("/").map(Number)
  return new Date(year, month - 1, day)
}

function getDaysBetween(start: string, end: Date) {
  const startDate = parseBrazilianDate(start)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  const diffInMs = endDate.getTime() - startDate.getTime()

  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

function getStatusClass(status: EvaluationStatus | WorkPlanDecision) {
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

function getStatusIcon(status: EvaluationStatus | WorkPlanDecision) {
  switch (status) {
    case "Realizada":
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Justificativa enviada":
      return <Send size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Pendente":
      return <Timer size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    default:
      return <ClipboardList size={14} />
  }
}

function getHistoryDotClass(status: HistoryItem["status"]) {
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

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[150px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

export default function CoordinatorEvaluationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const evaluation = evaluationMock

  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria)
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>(evaluation.workPlans)
  const [generalOpinion, setGeneralOpinion] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [nonEvaluationJustification, setNonEvaluationJustification] = useState("")
  const [activeForm, setActiveForm] = useState<"evaluation" | "justification">(
    "evaluation"
  )
  const [lastAction, setLastAction] = useState<
    "draft" | "submit" | "justify" | null
  >(null)

  const totalWeight = useMemo(() => {
    return criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  }, [criteria])

  const calculatedScore = useMemo(() => {
    const weightedSum = criteria.reduce((sum, criterion) => {
      const score = Number(criterion.score)

      if (criterion.score === "" || Number.isNaN(score)) {
        return sum
      }

      return sum + score * criterion.weight
    }, 0)

    return weightedSum / totalWeight
  }, [criteria, totalWeight])

  const completedCriteria = useMemo(() => {
    return criteria.filter((criterion) => criterion.score !== "").length
  }, [criteria])

  const allCriteriaFilled = useMemo(() => {
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
  }, [criteria])

  const allWorkPlansEvaluated = useMemo(() => {
    return workPlans.every(
      (workPlan) =>
        workPlan.decision !== "Selecione o resultado" &&
        workPlan.opinion.trim().length > 0
    )
  }, [workPlans])

  const isReadyToSubmit = useMemo(() => {
    return (
      allCriteriaFilled &&
      allWorkPlansEvaluated &&
      generalOpinion.trim().length > 0
    )
  }, [allCriteriaFilled, allWorkPlansEvaluated, generalOpinion])

  const daysSinceEvaluationStart = getDaysBetween(
    evaluation.evaluationStartedAt,
    new Date()
  )

  const canSendNonEvaluationJustification = daysSinceEvaluationStart <= 3

  function updateCriterionScore(criterionId: number, value: string) {
    const numericValue = Number(value)

    if (
      value !== "" &&
      (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 10)
    ) {
      return
    }

    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              score: value,
            }
          : criterion
      )
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
          : criterion
      )
    )
  }

  function updateWorkPlanDecision(
    workPlanId: number,
    decision: WorkPlanDecision
  ) {
    setWorkPlans((current) =>
      current.map((workPlan) =>
        workPlan.id === workPlanId
          ? {
              ...workPlan,
              decision,
            }
          : workPlan
      )
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
          : workPlan
      )
    )
  }

  function handleSaveDraft() {
    setLastAction("draft")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("submit")

    if (!isReadyToSubmit) {
      return
    }

    navigate("/coordenador/avaliacoes")
  }

  function handleSubmitJustification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("justify")

    if (
      !canSendNonEvaluationJustification ||
      nonEvaluationJustification.trim().length === 0
    ) {
      return
    }

    navigate("/coordenador/avaliacoes")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* BOTÃO DE VOLTAR */}
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
              evaluation.status
            )}`}
          >
            {getStatusIcon(evaluation.status)}
            {evaluation.status}
          </span>
        </div>

        {/* HEADER */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FileSignature size={14} />
                  Avaliação #{id ?? evaluation.id}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                  Avaliação por pares
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {evaluation.projectTitle}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                Registre o parecer técnico do projeto completo e indique o resultado dos planos de trabalho vinculados.
                Os dados do proponente não são exibidos ao avaliador.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={16} />
                  {evaluation.area}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span>{evaluation.edital}</span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Prazo: {evaluation.deadline}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-neutral/5 px-5 py-4 lg:min-w-[220px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                Nota ponderada
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">
                  {completedCriteria > 0 ? calculatedScore.toFixed(2) : "--"}
                </span>

                <span className="pb-1 text-sm text-neutral">/ 10</span>
              </div>

              <p className="mt-2 text-xs text-neutral">
                {completedCriteria} de {criteria.length} critério(s) preenchido(s)
              </p>
            </div>
          </div>
        </section>

        {/* ALERTA JUSTIFICATIVA */}
        <section
          className={
            canSendNonEvaluationJustification
              ? "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
              : "rounded-2xl border border-neutral/20 bg-white px-5 py-4"
          }
        >
          <div className="flex gap-3">
            <AlertCircle
              size={18}
              className={
                canSendNonEvaluationJustification
                  ? "mt-0.5 text-amber-700"
                  : "mt-0.5 text-neutral"
              }
            />

            <div>
              <p
                className={
                  canSendNonEvaluationJustification
                    ? "text-sm font-semibold text-amber-800"
                    : "text-sm font-semibold text-primary"
                }
              >
                Justificativa de não-avaliação
              </p>

              <p
                className={
                  canSendNonEvaluationJustification
                    ? "mt-1 text-sm leading-6 text-amber-700"
                    : "mt-1 text-sm leading-6 text-neutral"
                }
              >
                Conforme o item 4.2.2, a justificativa de não-avaliação deve ser enviada em até 3 dias do início.
                Início registrado em {evaluation.evaluationStartedAt}.{" "}
                {canSendNonEvaluationJustification
                  ? "O envio ainda está dentro do prazo."
                  : "O prazo para envio da justificativa já foi encerrado."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveForm("evaluation")}
                  className={
                    activeForm === "evaluation"
                      ? "inline-flex items-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                      : "inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                  }
                >
                  <ClipboardCheck size={16} />
                  Preencher avaliação
                </button>

                <button
                  type="button"
                  onClick={() => setActiveForm("justification")}
                  className={
                    activeForm === "justification"
                      ? "inline-flex items-center gap-2 rounded-xl border border-amber-600 bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                      : "inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                  }
                >
                  <Send size={16} />
                  Enviar justificativa
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ALERTAS */}
        {lastAction === "draft" && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Rascunho de avaliação salvo no protótipo
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Em uma versão integrada, essa ação salvaria a avaliação sem publicar o resultado final.
                </p>
              </div>
            </div>
          </section>
        )}

        {lastAction === "submit" && !isReadyToSubmit && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex gap-3">
              <AlertCircle size={18} className="mt-0.5 text-amber-700" />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Existem campos obrigatórios pendentes
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Preencha todos os critérios com nota e parecer textual, avalie todos os planos de trabalho vinculados
                  e informe o parecer geral antes de concluir a avaliação.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeForm === "evaluation" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* INDICADORES */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-neutral/30 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                      Edital
                    </p>

                    <p className="mt-2 text-lg font-bold text-primary">
                      {evaluation.edital}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ClipboardCheck size={20} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral">
                  Ano {evaluation.ano}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral/30 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                      Tipo de avaliação
                    </p>

                    <p className="mt-2 text-lg font-bold text-primary">
                      Projeto completo
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <FolderKanban size={20} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral">
                  Planos de trabalho vinculados
                </p>
              </div>

              <div className="rounded-2xl border border-neutral/30 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                      Submissão
                    </p>

                    <p className="mt-2 text-lg font-bold text-primary">
                      {evaluation.submittedAt}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <CalendarDays size={20} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral">
                  Prazo final em {evaluation.deadline}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral/30 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                      Critérios
                    </p>

                    <p className="mt-2 text-lg font-bold text-primary">
                      {completedCriteria}/7
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Star size={20} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral">
                  Avaliação ponderada em {calculatedScore.toFixed(2)}
                </p>
              </div>
            </section>

            <section className="mx-auto w-full max-w-7xl">
              <div className="space-y-6">
                {/* PROJETO COMPLETO */}
                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-primary">
                        Projeto completo para leitura
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-neutral">
                        Revise as informações submetidas antes de registrar a pontuação e o parecer.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <TextBlock title="Título" text={evaluation.projectTitle} />
                    <TextBlock title="Title" text={evaluation.projectTitleEn} />
                    <TextBlock title="Área" text={evaluation.area} />
                    <TextBlock title="ODS vinculado" text={evaluation.ods} />
                    <TextBlock title="Palavras-chave" text={evaluation.keywords} />
                    <TextBlock title="Keywords" text={evaluation.keywordsEn} />
                    <TextBlock title="Descrição resumida" text={evaluation.summary} />
                    <TextBlock title="Abstract" text={evaluation.abstract} />
                    <TextBlock title="Introdução e justificativa" text={evaluation.introduction} />
                    <TextBlock title="Objetivos" text={evaluation.objectives} />
                    <TextBlock title="Metodologia" text={evaluation.methodology} />
                    <TextBlock title="Resultados esperados" text={evaluation.expectedResults} />
                    <TextBlock title="Cronograma" text={evaluation.schedule} />
                    <TextBlock title="Referências" text={evaluation.references} />
                    <TextBlock title="Observações da submissão" text={evaluation.observations} />
                    <TextBlock title="PDF complementar" text={evaluation.complementaryPdf} />
                  </div>
                </section>

                {/* CRITÉRIOS */}
                <section className="rounded-2xl border border-neutral/30 bg-white">
                  <div className="border-b border-neutral/20 p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                        <ClipboardList size={20} />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold text-primary">
                          Critérios de avaliação
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-neutral">
                          Cada critério deve receber nota de 0 a 10 e parecer textual. A nota final é calculada de forma ponderada pelos pesos do edital.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral/10">
                      <thead className="bg-neutral/5">
                        <tr>
                          <th className="w-[38%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Critério e análise de julgamento
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Pontos
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Peso
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Nota
                          </th>

                          <th className="min-w-[280px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral">
                            Parecer textual
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-neutral/10 bg-white">
                        {criteria.map((criterion) => (
                          <tr key={criterion.id} className="align-top">
                            <td className="px-6 py-5">
                              <p className="text-sm font-semibold leading-6 text-primary">
                                {criterion.id}. {criterion.label}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm text-neutral">
                              {criterion.points}
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-primary">
                              {criterion.weight.toFixed(1).replace(".", ",")}
                            </td>

                            <td className="px-6 py-5">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={criterion.score}
                                onChange={(event) =>
                                  updateCriterionScore(
                                    criterion.id,
                                    event.target.value
                                  )
                                }
                                placeholder="0 a 10"
                                className="w-28 rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                              />
                            </td>

                            <td className="px-6 py-5">
                              <textarea
                                value={criterion.opinion}
                                onChange={(event) =>
                                  updateCriterionOpinion(
                                    criterion.id,
                                    event.target.value
                                  )
                                }
                                placeholder="Registre o parecer deste critério..."
                                className="min-h-[96px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-neutral/20 bg-neutral/5 px-6 py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-neutral">
                        Soma dos pesos:{" "}
                        <strong className="font-semibold text-primary">
                          {totalWeight.toFixed(1).replace(".", ",")}
                        </strong>
                      </p>

                      <p className="text-sm text-neutral">
                        Nota ponderada:{" "}
                        <strong className="font-semibold text-primary">
                          {completedCriteria > 0 ? calculatedScore.toFixed(2) : "Não calculada"}
                        </strong>
                      </p>
                    </div>
                  </div>
                </section>

                {/* PLANOS DE TRABALHO */}
                <section className="rounded-2xl border border-neutral/30 bg-white">
                  <div className="border-b border-neutral/20 p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                        <FolderKanban size={20} />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold text-primary">
                          Planos de trabalho vinculados
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-neutral">
                          Indique se cada plano de trabalho vinculado ao projeto está aprovado ou reprovado.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral/10">
                    {workPlans.map((workPlan) => (
                      <article key={workPlan.id} className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="text-base font-bold leading-6 text-primary">
                              {workPlan.title}
                            </h3>

                            <p className="mt-1 text-xs text-neutral">
                              Plano vinculado ao projeto • {workPlan.student}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              workPlan.decision
                            )}`}
                          >
                            {getStatusIcon(workPlan.decision)}
                            {workPlan.decision === "Selecione o resultado"
                              ? "Pendente"
                              : workPlan.decision}
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <TextBlock
                            title="Atividades previstas"
                            text={workPlan.activities}
                          />

                          <TextBlock
                            title="Resultados esperados"
                            text={workPlan.expectedResults}
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div>
                            <label className={labelClassName}>
                              Resultado do plano <span className="text-red-500">*</span>
                            </label>

                            <select
                              value={workPlan.decision}
                              onChange={(event) =>
                                updateWorkPlanDecision(
                                  workPlan.id,
                                  event.target.value as WorkPlanDecision
                                )
                              }
                              className={inputClassName}
                            >
                              <option value="Selecione o resultado">
                                Selecione o resultado
                              </option>
                              <option value="Aprovado">Aprovado</option>
                              <option value="Reprovado">Reprovado</option>
                            </select>
                          </div>

                          <div className="lg:col-span-2">
                            <label className={labelClassName}>
                              Parecer sobre o plano <span className="text-red-500">*</span>
                            </label>

                            <textarea
                              value={workPlan.opinion}
                              onChange={(event) =>
                                updateWorkPlanOpinion(
                                  workPlan.id,
                                  event.target.value
                                )
                              }
                              placeholder="Justifique a indicação de aprovado ou reprovado para este plano..."
                              className={textareaClassName}
                            />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* PARECER */}
                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <FileSignature size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-primary">
                        Parecer técnico geral
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-neutral">
                        Registre a síntese final da avaliação do projeto e dos planos de trabalho vinculados.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={labelClassName}>
                        Parecer geral <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={generalOpinion}
                        onChange={(event) => setGeneralOpinion(event.target.value)}
                        placeholder="Descreva a análise geral do projeto, destacando pontos fortes, fragilidades e justificativa da avaliação."
                        className={textareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Recomendações ou ajustes sugeridos
                      </label>

                      <textarea
                        value={recommendations}
                        onChange={(event) => setRecommendations(event.target.value)}
                        placeholder="Informe recomendações metodológicas, correções sugeridas ou observações adicionais."
                        className={textareaClassName}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </section>

            {/* AÇÕES */}
            <section className="sticky bottom-0 z-10 -mx-6 border-t border-neutral/20 bg-[#F3F4F6]/95 px-6 py-4 backdrop-blur">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-neutral/30 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Parecer da avaliação
                  </p>

                  <p className="mt-1 text-xs text-neutral">
                    Salve como rascunho ou conclua a avaliação para registrar o resultado final.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                  >
                    <Save size={16} />
                    Salvar rascunho
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                  >
                    <Send size={16} />
                    Concluir avaliação
                  </button>
                </div>
              </div>
            </section>
          </form>
        ) : (
          <form onSubmit={handleSubmitJustification} className="space-y-6">
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="text-base font-semibold text-primary">
                Envio de justificativa de não-avaliação
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral">
                Use este formulário apenas quando houver impedimento para realizar a avaliação. O envio deve ocorrer em até 3 dias do início da avaliação.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <SummaryItem
                  label="Início da avaliação"
                  value={evaluation.evaluationStartedAt}
                />

                <SummaryItem
                  label="Limite para justificativa"
                  value="Até 3 dias do início"
                />

                <SummaryItem
                  label="Situação"
                  value={
                    canSendNonEvaluationJustification
                      ? "Dentro do prazo"
                      : "Prazo encerrado"
                  }
                />
              </div>

              <div className="mt-5">
                <label className={labelClassName}>
                  Justificativa de não-avaliação <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={nonEvaluationJustification}
                  onChange={(event) =>
                    setNonEvaluationJustification(event.target.value)
                  }
                  disabled={!canSendNonEvaluationJustification}
                  placeholder="Descreva o motivo que impede a realização da avaliação..."
                  className={
                    canSendNonEvaluationJustification
                      ? "min-h-[180px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      : "min-h-[180px] w-full resize-y rounded-xl border border-neutral/20 bg-neutral/10 px-3 py-2.5 text-sm leading-6 text-neutral outline-none"
                  }
                />
              </div>

              {lastAction === "justify" &&
                (!canSendNonEvaluationJustification ||
                  nonEvaluationJustification.trim().length === 0) && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                    Não foi possível enviar. Verifique se o prazo ainda está aberto e se a justificativa foi preenchida.
                  </div>
                )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!canSendNonEvaluationJustification}
                  className={
                    canSendNonEvaluationJustification
                      ? "inline-flex items-center justify-center gap-2 rounded-xl border border-amber-600 bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                      : "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/10 px-5 py-2.5 text-sm font-semibold text-neutral"
                  }
                >
                  <Send size={16} />
                  Enviar justificativa
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </main>
  )
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>

      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral">
        {text}
      </p>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-6 text-primary">
        {value}
      </p>
    </div>
  )
}