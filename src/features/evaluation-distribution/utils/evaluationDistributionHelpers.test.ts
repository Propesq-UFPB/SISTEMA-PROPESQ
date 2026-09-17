import { describe, expect, it } from "vitest"
import type {
  Assignment,
  DistributableProject,
  DraftAssignment,
  Evaluator,
} from "../types/evaluationDistribution"
import {
  assignmentStatusClass,
  assignmentStatusLabel,
  affinityScore,
  buildSmartDistribution,
  getEvaluatorProjectedLoad,
  getProjectActiveCount,
  hasConflict,
  MIN_EVALUATORS_PER_PROJECT,
  smartScore,
} from "./evaluationDistributionHelpers"

function projectFixture(
  overrides: Partial<DistributableProject> = {},
): DistributableProject {
  return {
    id: 1,
    code: "PVH-2026-001",
    title: "Projeto de teste",
    coordinator: "Dr. Teste",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Inteligência Artificial",
    especialidade: "PLN",
    status: "PENDENTE",
    ...overrides,
  }
}

function evaluatorFixture(overrides: Partial<Evaluator> = {}): Evaluator {
  return {
    id: 1,
    name: "Prof. Avaliador",
    unit: "CT",
    email: "avaliador@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra"],
    areas: ["Ciência da Computação"],
    subareas: ["Inteligência Artificial"],
    maxAssignments: 4,
    currentAssignments: 1,
    ...overrides,
  }
}

describe("assignmentStatusLabel", () => {
  it("retorna rótulos em português", () => {
    expect(assignmentStatusLabel("PENDENTE")).toBe("Pendente")
    expect(assignmentStatusLabel("ACEITO")).toBe("Aceito")
    expect(assignmentStatusLabel("RECUSADO")).toBe("Recusado")
  })
})

describe("assignmentStatusClass", () => {
  it("retorna classes de cor por status", () => {
    expect(assignmentStatusClass("PENDENTE")).toContain("amber")
    expect(assignmentStatusClass("ACEITO")).toContain("emerald")
    expect(assignmentStatusClass("RECUSADO")).toContain("red")
  })
})

describe("hasConflict", () => {
  it("detecta conflito por unidade", () => {
    const project = projectFixture({ unit: "CI" })
    const evaluator = evaluatorFixture({ unit: "CI" })

    expect(hasConflict(project, evaluator)).toBe(true)
  })

  it("detecta conflito por coordenador", () => {
    const project = projectFixture({ coordinator: "Dr. Teste" })
    const evaluator = evaluatorFixture({ name: "Dr. Teste" })

    expect(hasConflict(project, evaluator)).toBe(true)
  })

  it("não detecta conflito quando unidade e nome diferem", () => {
    const project = projectFixture({ unit: "CI", coordinator: "Dr. A" })
    const evaluator = evaluatorFixture({ unit: "CT", name: "Dr. B" })

    expect(hasConflict(project, evaluator)).toBe(false)
  })
})

describe("affinityScore", () => {
  it("soma pontos por grande área, área e subárea", () => {
    const project = projectFixture()
    const evaluator = evaluatorFixture()

    expect(affinityScore(project, evaluator)).toBe(6)
  })

  it("retorna 0 sem correspondência", () => {
    const project = projectFixture({
      grandeArea: "Ciências Humanas",
      area: "Educação",
      subarea: "Políticas Educacionais",
    })
    const evaluator = evaluatorFixture()

    expect(affinityScore(project, evaluator)).toBe(0)
  })
})

describe("getProjectActiveCount", () => {
  it("conta atribuições ativas e rascunhos", () => {
    const assignments: Assignment[] = [
      { id: 1, projectId: 1, evaluatorId: 1, status: "ACEITO", sentAt: "2026-01-01" },
      { id: 2, projectId: 1, evaluatorId: 2, status: "RECUSADO", sentAt: "2026-01-01" },
    ]
    const drafts: DraftAssignment[] = [
      { id: 10, projectId: 1, evaluatorId: 3, score: 4, generatedBy: "AUTO" },
    ]

    expect(getProjectActiveCount(1, assignments, drafts)).toBe(2)
  })
})

describe("getEvaluatorProjectedLoad", () => {
  it("soma carga atual com rascunhos", () => {
    const evaluators = [evaluatorFixture({ id: 1, currentAssignments: 2 })]
    const drafts: DraftAssignment[] = [
      { id: 10, projectId: 1, evaluatorId: 1, score: 4, generatedBy: "AUTO" },
      { id: 11, projectId: 2, evaluatorId: 1, score: 3, generatedBy: "AUTO" },
    ]

    expect(getEvaluatorProjectedLoad(1, evaluators, drafts)).toBe(4)
  })

  it("retorna 0 para avaliador inexistente", () => {
    expect(getEvaluatorProjectedLoad(99, [evaluatorFixture()], [])).toBe(0)
  })
})

describe("smartScore", () => {
  it("prioriza afinidade e penaliza carga", () => {
    const project = projectFixture()
    const evaluator = evaluatorFixture({ currentAssignments: 0, maxAssignments: 4 })

    const score = smartScore({
      project,
      evaluator,
      evaluators: [evaluator],
      draftAssignments: [],
    })

    expect(score).toBe(600)
  })
})

describe("buildSmartDistribution", () => {
  it("distribui avaliadores para projetos pendentes", () => {
    const projects = [
      projectFixture({ id: 10, status: "PENDENTE" }),
      projectFixture({ id: 20, status: "DISTRIBUIDO" }),
    ]
    const evaluators = [
      evaluatorFixture({ id: 1, currentAssignments: 0 }),
      evaluatorFixture({ id: 2, currentAssignments: 0, name: "Prof. B", unit: "CEAR" }),
    ]

    const result = buildSmartDistribution({
      projects,
      evaluators,
      assignments: [],
    })

    expect(result.draftAssignments.length).toBe(MIN_EVALUATORS_PER_PROJECT)
    expect(result.draftAssignments.every((d) => d.projectId === 10)).toBe(true)
    expect(result.issues).toHaveLength(0)
    result.draftAssignments.forEach((draft) => {
      expect(draft).toMatchObject({
        projectId: 10,
        generatedBy: "AUTO",
      })
      expect(typeof draft.id).toBe("number")
      expect(typeof draft.evaluatorId).toBe("number")
      expect(typeof draft.score).toBe("number")
    })
  })

  it("registra issues quando não há avaliadores elegíveis", () => {
    const projects = [projectFixture({ id: 10, status: "PENDENTE", unit: "CI" })]
    const evaluators = [
      evaluatorFixture({
        id: 1,
        unit: "CI",
        unavailable: false,
        currentAssignments: 4,
        maxAssignments: 4,
      }),
    ]

    const result = buildSmartDistribution({
      projects,
      evaluators,
      assignments: [],
    })

    expect(result.draftAssignments).toHaveLength(0)
    expect(result.issues).toHaveLength(1)
    expect(result.issues[0]).toMatchObject({
      projectId: 10,
      missing: MIN_EVALUATORS_PER_PROJECT,
    })
    expect(result.issues[0].reason).toContain("avaliadores elegíveis")
  })
})
