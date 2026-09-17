import { describe, expect, it } from "vitest"
import type { Assignment, NotifyRoleMap } from "@/features/evaluators/types/evaluators"
import {
  assignmentsForCall,
  assignmentsMock,
  availableAreasMock,
  buildNotifyPreview,
  callsMock,
  countActive,
  countByEvaluator,
  countByType,
  evaluatorsMock,
  filterAndSortEvaluators,
  formatDate,
  getEvaluator,
  getInitials,
  getProject,
  pendingAssignments,
  projectsMock,
  roleLabel,
  sortCallsByBaseYear,
  submittedAssignments,
} from "@/features/evaluators/utils/evaluatorHelpers"

const allRolesOn: NotifyRoleMap = {
  INTERNO: true,
  EXTERNO: true,
  VOLUNTARIO: true,
  PROPESQ: true,
}

const onlyExterno: NotifyRoleMap = {
  INTERNO: false,
  EXTERNO: true,
  VOLUNTARIO: false,
  PROPESQ: false,
}

const allRolesOff: NotifyRoleMap = {
  INTERNO: false,
  EXTERNO: false,
  VOLUNTARIO: false,
  PROPESQ: false,
}

function assignmentFixture(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: "ax",
    callId: "c1",
    projectId: "P001",
    evaluatorId: "e2",
    blind: true,
    status: "PENDING",
    ...overrides,
  }
}

function namesOf(
  evaluators: { name: string }[],
): string[] {
  return evaluators.map((item) => item.name)
}

describe("roleLabel", () => {
  it("retorna rótulos em português", () => {
    expect(roleLabel("INTERNO")).toBe("Interno")
    expect(roleLabel("EXTERNO")).toBe("Externo")
    expect(roleLabel("VOLUNTARIO")).toBe("Voluntário")
    expect(roleLabel("PROPESQ")).toBe("PROPESQ")
  })
})

describe("getInitials", () => {
  it("usa os dois primeiros tokens", () => {
    expect(getInitials("Profa. Ana Souza")).toBe("PA")
  })

  it("funciona com um token, espaços extras e vazio", () => {
    expect(getInitials("Ana")).toBe("A")
    expect(getInitials("  Ana  Souza  ")).toBe("AS")
    expect(getInitials("")).toBe("")
  })
})

describe("formatDate", () => {
  it("formata YYYY-MM-DD e cai em Sem prazo", () => {
    expect(formatDate(undefined)).toBe("Sem prazo")
    expect(formatDate("")).toBe("Sem prazo")
    expect(formatDate("2025-09-20")).toBe("20/09/2025")
    expect(formatDate("2025-09")).toBe("Sem prazo")
    expect(formatDate("nope")).toBe("Sem prazo")
  })
})

describe("sortCallsByBaseYear", () => {
  it("ordena por ano desc sem mutar a entrada", () => {
    const input = [callsMock[1], callsMock[0]]
    const sorted = sortCallsByBaseYear(input)

    expect(sorted.map((call) => call.id)).toEqual(["c1", "c2"])
    expect(input[0].id).toBe("c2")
    expect(callsMock[0].id).toBe("c1")
    expect(callsMock[0].title).toBe("PIBIC - Pesquisa")
    expect(callsMock[1].title).toBe("PROBEX - Extensão")
  })
})

describe("filterAndSortEvaluators", () => {
  it("filtra por tipo EXTERNO", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "",
          typeFilter: "EXTERNO",
          statusFilter: "ALL",
        }),
      ),
    ).toEqual(["Prof. Bruno Lima"])
  })

  it("filtra por status INACTIVE", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "",
          typeFilter: "ALL",
          statusFilter: "INACTIVE",
        }),
      ),
    ).toEqual(["Profa. Carla Mendes"])
  })

  it("busca ciência de dados e ordena por localeCompare", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "ciência de dados",
          typeFilter: "ALL",
          statusFilter: "ALL",
        }),
      ),
    ).toEqual(["Prof. Diego Ramos", "Profa. Ana Souza"])
  })

  it("busca Interno via roleLabel e deixa inativo por último", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "Interno",
          typeFilter: "ALL",
          statusFilter: "ALL",
        }),
      ),
    ).toEqual([
      "Prof. Diego Ramos",
      "Profa. Ana Souza",
      "Profa. Carla Mendes",
    ])
  })

  it("faz trim da busca", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "  ana  ",
          typeFilter: "ALL",
          statusFilter: "ALL",
        }),
      ),
    ).toEqual(["Profa. Ana Souza"])
  })

  it("ordena ativos antes de inativos por nome", () => {
    expect(
      namesOf(
        filterAndSortEvaluators(evaluatorsMock, {
          search: "",
          typeFilter: "ALL",
          statusFilter: "ALL",
        }),
      ),
    ).toEqual([
      "Prof. Bruno Lima",
      "Prof. Diego Ramos",
      "Profa. Ana Souza",
      "Profa. Carla Mendes",
    ])
  })
})

describe("assignmentsForCall / pending / submitted", () => {
  it("separa por edital e status", () => {
    expect(assignmentsForCall(assignmentsMock, "c1")).toHaveLength(3)
    expect(assignmentsForCall(assignmentsMock, "c2")).toHaveLength(0)
    expect(pendingAssignments(assignmentsMock).map((item) => item.id)).toEqual([
      "a1",
      "a3",
    ])
    expect(submittedAssignments(assignmentsMock).map((item) => item.id)).toEqual([
      "a2",
    ])
  })

  it("compõe pending do edital c2 como vazio", () => {
    expect(
      pendingAssignments(assignmentsForCall(assignmentsMock, "c2")),
    ).toEqual([])
    expect(
      countByEvaluator(assignmentsForCall(assignmentsMock, "c2"), "e1"),
    ).toBe(0)
  })
})

describe("countByEvaluator", () => {
  it("conta SUBMITTED na carga", () => {
    expect(countByEvaluator(assignmentsMock, "e1")).toBe(1)
  })

  it("conta no recorte do edital c1", () => {
    expect(
      countByEvaluator(assignmentsForCall(assignmentsMock, "c1"), "e2"),
    ).toBe(1)
  })
})

describe("getProject / getEvaluator", () => {
  it("resolve hit e miss", () => {
    expect(getProject(projectsMock, "P001")?.title).toBe(
      "Detecção de presença com TinyML",
    )
    expect(getProject(projectsMock, "nope")).toBeNull()
    expect(getEvaluator(evaluatorsMock, "e2")?.name).toBe("Prof. Bruno Lima")
    expect(getEvaluator(evaluatorsMock, "nope")).toBeNull()
  })
})

describe("buildNotifyPreview", () => {
  const c1Pending = pendingAssignments(assignmentsMock)

  it("agrupa pendências ativas do edital", () => {
    const preview = buildNotifyPreview({
      pending: c1Pending,
      evaluators: evaluatorsMock,
      projects: projectsMock,
      notifyRole: allRolesOn,
    })

    expect(preview.map((item) => item.evaluator.name)).toEqual([
      "Prof. Bruno Lima",
      "Prof. Diego Ramos",
    ])
    expect(preview[0].projects.map((project) => project.id)).toEqual(["P002"])
    expect(preview[1].projects.map((project) => project.id)).toEqual(["P001"])
  })

  it("respeita filtro só EXTERNO", () => {
    const preview = buildNotifyPreview({
      pending: c1Pending,
      evaluators: evaluatorsMock,
      projects: projectsMock,
      notifyRole: onlyExterno,
    })

    expect(preview.map((item) => item.evaluator.name)).toEqual([
      "Prof. Bruno Lima",
    ])
  })

  it("retorna vazio com todos os papéis desligados", () => {
    expect(
      buildNotifyPreview({
        pending: c1Pending,
        evaluators: evaluatorsMock,
        projects: projectsMock,
        notifyRole: allRolesOff,
      }),
    ).toEqual([])
  })

  it("pula projectId inexistente e mantém o assignment real", () => {
    const preview = buildNotifyPreview({
      pending: [
        assignmentsMock[0],
        assignmentFixture({
          id: "ax",
          projectId: "missing",
          evaluatorId: "e2",
        }),
      ],
      evaluators: evaluatorsMock,
      projects: projectsMock,
      notifyRole: allRolesOn,
    })

    expect(preview.map((item) => item.evaluator.name)).toEqual([
      "Prof. Bruno Lima",
    ])
    expect(preview[0].projects.map((project) => project.id)).toEqual(["P002"])
  })

  it("pula avaliador inativo mesmo com pending", () => {
    expect(
      buildNotifyPreview({
        pending: [
          assignmentFixture({
            id: "ax",
            projectId: "P003",
            evaluatorId: "e3",
          }),
        ],
        evaluators: evaluatorsMock,
        projects: projectsMock,
        notifyRole: allRolesOn,
      }),
    ).toEqual([])
  })

  it("pula evaluatorId inexistente", () => {
    expect(
      buildNotifyPreview({
        pending: [
          assignmentFixture({
            id: "ax",
            projectId: "P001",
            evaluatorId: "missing",
          }),
        ],
        evaluators: evaluatorsMock,
        projects: projectsMock,
        notifyRole: allRolesOn,
      }),
    ).toEqual([])
  })
})

describe("countActive / countByType", () => {
  it("conta no banco inteiro", () => {
    expect(countActive(evaluatorsMock)).toBe(3)
    expect(countByType(evaluatorsMock, "EXTERNO")).toBe(1)
  })
})

describe("availableAreasMock", () => {
  it("exporta as cinco áreas do god file", () => {
    expect(availableAreasMock.map((area) => area.id)).toEqual([
      "cnpq_ai",
      "cnpq_cv",
      "cnpq_ds",
      "cnae_it",
      "cnae_ed",
    ])
  })
})
