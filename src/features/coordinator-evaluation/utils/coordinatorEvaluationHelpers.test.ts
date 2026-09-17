import { describe, expect, it } from "vitest"
import type {
  Criterion,
  EvaluationWorkPlan,
} from "../types/coordinatorEvaluation"
import {
  areAllCriteriaFilled,
  areAllWorkPlansEvaluated,
  calcTotalWeight,
  calcWeightedScore,
  canSendNonEvaluationJustification,
  countCompletedCriteria,
  getDaysBetween,
  getHistoryDotClass,
  getStatusClass,
  isReadyToSubmit,
  isValidCriterionScore,
  parseBrazilianDate,
} from "./coordinatorEvaluationHelpers"

function criterionFixture(overrides: Partial<Criterion> = {}): Criterion {
  return {
    id: 1,
    label: "Critério",
    points: "0 a 10",
    weight: 1,
    score: "",
    opinion: "",
    ...overrides,
  }
}

function workPlanFixture(
  overrides: Partial<EvaluationWorkPlan> = {},
): EvaluationWorkPlan {
  return {
    id: 1,
    title: "Plano",
    student: "Discente",
    activities: "Atividades",
    expectedResults: "Resultados",
    decision: "Selecione o resultado",
    opinion: "",
    ...overrides,
  }
}

describe("parseBrazilianDate", () => {
  it("interpreta dd/mm/yyyy", () => {
    const date = parseBrazilianDate("15/05/2026")

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(4)
    expect(date.getDate()).toBe(15)
  })
})

describe("getDaysBetween", () => {
  it("calcula diferença em dias inteiros", () => {
    expect(getDaysBetween("15/05/2026", new Date(2026, 4, 18))).toBe(3)
    expect(getDaysBetween("15/05/2026", new Date(2026, 4, 15))).toBe(0)
  })
})

describe("canSendNonEvaluationJustification", () => {
  it("permite envio até 3 dias", () => {
    expect(canSendNonEvaluationJustification(0)).toBe(true)
    expect(canSendNonEvaluationJustification(3)).toBe(true)
    expect(canSendNonEvaluationJustification(4)).toBe(false)
  })
})

describe("getStatusClass", () => {
  it("mapeia status de avaliação e decisão de plano", () => {
    expect(getStatusClass("Realizada")).toContain("emerald")
    expect(getStatusClass("Aprovado")).toContain("emerald")
    expect(getStatusClass("Justificativa enviada")).toContain("amber")
    expect(getStatusClass("Em avaliação")).toContain("violet")
    expect(getStatusClass("Pendente")).toContain("blue")
    expect(getStatusClass("Reprovado")).toContain("red")
    expect(getStatusClass("Selecione o resultado")).toContain("neutral")
  })
})

describe("getHistoryDotClass", () => {
  it("mapeia status de histórico", () => {
    expect(getHistoryDotClass("success")).toBe("bg-emerald-500")
    expect(getHistoryDotClass("info")).toBe("bg-blue-500")
    expect(getHistoryDotClass("warning")).toBe("bg-amber-500")
    expect(getHistoryDotClass("danger")).toBe("bg-red-500")
    expect(getHistoryDotClass("neutral")).toBe("bg-neutral/50")
  })
})

describe("score helpers", () => {
  it("soma pesos e calcula média ponderada", () => {
    const criteria = [
      criterionFixture({ id: 1, weight: 1, score: "10" }),
      criterionFixture({ id: 2, weight: 3, score: "5" }),
    ]

    expect(calcTotalWeight(criteria)).toBe(4)
    expect(calcWeightedScore(criteria, 4)).toBe(6.25)
    expect(countCompletedCriteria(criteria)).toBe(2)
  })

  it("ignora scores vazios na média", () => {
    const criteria = [
      criterionFixture({ weight: 1, score: "10" }),
      criterionFixture({ id: 2, weight: 1, score: "" }),
    ]

    expect(calcWeightedScore(criteria, 2)).toBe(5)
    expect(countCompletedCriteria(criteria)).toBe(1)
  })
})

describe("readiness helpers", () => {
  it("exige nota válida e parecer em todos os critérios", () => {
    const incomplete = [criterionFixture({ score: "8", opinion: "" })]
    const complete = [criterionFixture({ score: "8", opinion: "ok" })]

    expect(areAllCriteriaFilled(incomplete)).toBe(false)
    expect(areAllCriteriaFilled(complete)).toBe(true)
  })

  it("exige decisão e parecer em todos os planos", () => {
    const incomplete = [workPlanFixture({ decision: "Aprovado", opinion: "" })]
    const complete = [
      workPlanFixture({ decision: "Aprovado", opinion: "aprovado" }),
    ]

    expect(areAllWorkPlansEvaluated(incomplete)).toBe(false)
    expect(areAllWorkPlansEvaluated(complete)).toBe(true)
  })

  it("isReadyToSubmit combina critérios, planos e parecer geral", () => {
    const criteria = [criterionFixture({ score: "8", opinion: "ok" })]
    const workPlans = [
      workPlanFixture({ decision: "Aprovado", opinion: "ok" }),
    ]

    expect(isReadyToSubmit(criteria, workPlans, "")).toBe(false)
    expect(isReadyToSubmit(criteria, workPlans, "parecer")).toBe(true)
  })
})

describe("isValidCriterionScore", () => {
  it("aceita vazio e valores entre 0 e 10", () => {
    expect(isValidCriterionScore("")).toBe(true)
    expect(isValidCriterionScore("0")).toBe(true)
    expect(isValidCriterionScore("10")).toBe(true)
    expect(isValidCriterionScore("11")).toBe(false)
    expect(isValidCriterionScore("abc")).toBe(false)
  })
})
