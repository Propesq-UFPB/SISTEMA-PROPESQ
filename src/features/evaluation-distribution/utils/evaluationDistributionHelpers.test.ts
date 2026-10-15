import { describe, expect, it } from "vitest"
import type {
  Assignment,
  DistributableProject,
  DraftAssignment,
} from "../types/evaluationDistribution"
import {
  affinityLabel,
  areaSummary,
  assignmentSummary,
  candidateRows,
  computeIssues,
  confirmImpact,
  draftFromAssignments,
  groupByConsultant,
  matchesAssignmentFilter,
  toggleDraftAssignment,
} from "./evaluationDistributionHelpers"

const project = (id: number, area = "Ciência da Computação"): DistributableProject => ({
  id,
  code: `P-${id}`,
  title: `Projeto ${id}`,
  coordinator: null,
  unit: null,
  area: { id: 1, grandeArea: "Exatas", area, subArea: "", especialidade: "" },
  situacao: "SUBMETIDO",
})

const assignment = (
  id: number,
  projectId: number,
  consultantId: number,
  overrides: Partial<Assignment> = {},
): Assignment => ({
  id,
  projectId,
  consultantId,
  evaluatorName: `Consultor ${consultantId}`,
  status: "PENDENTE",
  reason: null,
  hasGrades: false,
  sentAt: "2026-10-01T00:00:00.000Z",
  answeredAt: null,
  ...overrides,
})

const draftItem = (
  projectId: number,
  consultantId: number,
  overrides: Partial<DraftAssignment> = {},
): DraftAssignment => ({
  projectId,
  consultantId,
  score: 160,
  origin: "AUTO",
  status: null,
  hasGrades: false,
  ...overrides,
})

describe("draftFromAssignments", () => {
  it("usa só convites ativos com consultor e marca como existentes", () => {
    const draft = draftFromAssignments([
      assignment(1, 10, 1, { status: "ACEITO", hasGrades: true }),
      assignment(2, 10, 2, { status: "RECUSADO" }),
      assignment(3, 10, 3),
      { ...assignment(4, 10, 4), consultantId: null },
    ])

    expect(draft).toEqual([
      draftItem(10, 1, { score: null, origin: "EXISTENTE", status: "ACEITO", hasGrades: true }),
      draftItem(10, 3, { score: null, origin: "EXISTENTE", status: "PENDENTE" }),
    ])
  })
})

describe("computeIssues", () => {
  it("lista projetos com menos consultores que o necessário", () => {
    const issues = computeIssues(
      [project(10), project(20), project(30)],
      [draftItem(10, 1), draftItem(10, 2), draftItem(20, 1)],
      2,
    )
    expect(issues).toEqual([
      { projectId: 20, missing: 1 },
      { projectId: 30, missing: 2 },
    ])
  })
})

describe("toggleDraftAssignment", () => {
  const candidate = { consultantId: 5, name: "C5", score: 60 }

  it("inclui como manual e remove ao clicar de novo", () => {
    const added = toggleDraftAssignment([], 10, candidate)
    expect(added).toEqual([draftItem(10, 5, { score: 60, origin: "MANUAL" })])
    expect(toggleDraftAssignment(added, 10, candidate)).toEqual([])
  })

  it("não remove convites com avaliação iniciada", () => {
    const draft = [draftItem(10, 5, { origin: "EXISTENTE", hasGrades: true })]
    expect(toggleDraftAssignment(draft, 10, candidate)).toBe(draft)
  })
})

describe("candidateRows", () => {
  it("calcula a carga no rascunho e prioriza quem já está no projeto", () => {
    const rows = candidateRows(
      [
        { consultantId: 1, name: "A", score: 160 },
        { consultantId: 2, name: "B", score: 60 },
      ],
      [draftItem(10, 2), draftItem(20, 1), draftItem(30, 1)],
      10,
      2,
    )

    expect(rows.map((r) => [r.consultantId, r.inDraft, r.draftLoad, r.overMax])).toEqual([
      [2, true, 1, false],
      [1, false, 2, true],
    ])
  })
})

describe("confirmImpact", () => {
  it("conta novos convites e remoções de convites sem nota", () => {
    const assignments = [
      assignment(1, 10, 1),
      assignment(2, 10, 2),
      assignment(3, 20, 3, { hasGrades: true, status: "ACEITO" }),
      assignment(4, 20, 4, { status: "RECUSADO" }),
    ]
    const draft = [draftItem(10, 1, { origin: "EXISTENTE" }), draftItem(20, 5)]

    expect(confirmImpact(assignments, draft)).toEqual({ newInvites: 1, removed: 1 })
  })
})

describe("resumos", () => {
  it("agrupa convites por status", () => {
    expect(
      assignmentSummary([
        assignment(1, 10, 1),
        assignment(2, 10, 2, { status: "ACEITO" }),
        assignment(3, 10, 3, { status: "RECUSADO" }),
      ]),
    ).toEqual({ total: 3, pendentes: 1, aceitos: 1, recusados: 1 })
  })

  it("classifica projetos por área ignorando convites recusados", () => {
    const summary = areaSummary(
      [project(10), project(20), project(30, "Matemática")],
      [
        assignment(1, 10, 1),
        assignment(2, 10, 2),
        assignment(3, 20, 1),
        assignment(4, 30, 1, { status: "RECUSADO" }),
      ],
      2,
    )

    expect(summary).toEqual([
      {
        area: "Exatas › Ciência da Computação",
        total: 2,
        pendentes: 0,
        distribuidos: 1,
        incompletos: 1,
      },
      { area: "Exatas › Matemática", total: 1, pendentes: 1, distribuidos: 0, incompletos: 0 },
    ])
  })

  it("descreve a afinidade calculada no backend", () => {
    expect(affinityLabel(160)).toBe("Mesma subárea")
    expect(affinityLabel(80)).toBe("Subárea (área adicional)")
    expect(affinityLabel(0)).toBe("Sem afinidade")
  })
})

describe("visões das atribuições", () => {
  it("agrupa por consultor e usa o nome em atribuições antigas sem consultor", () => {
    const groups = groupByConsultant([
      assignment(1, 10, 2),
      assignment(2, 20, 2),
      { ...assignment(3, 30, 9), consultantId: null, evaluatorName: "Antigo" },
      assignment(4, 30, 1),
    ])
    expect(groups.map((g) => [g.name, g.consultantId, g.assignments.length])).toEqual([
      ["Antigo", null, 1],
      ["Consultor 1", 1, 1],
      ["Consultor 2", 2, 2],
    ])
  })

  it("filtra por status, tratando 'avaliado' como convite com notas", () => {
    const graded = assignment(1, 10, 1, { status: "ACEITO", hasGrades: true })
    const accepted = assignment(2, 10, 2, { status: "ACEITO" })
    expect(matchesAssignmentFilter(graded, "AVALIADO")).toBe(true)
    expect(matchesAssignmentFilter(accepted, "AVALIADO")).toBe(false)
    expect(matchesAssignmentFilter(accepted, "ACEITO")).toBe(true)
    expect(matchesAssignmentFilter(accepted, "ALL")).toBe(true)
  })
})
