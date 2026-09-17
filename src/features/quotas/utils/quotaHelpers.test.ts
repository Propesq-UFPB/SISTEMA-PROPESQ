import { describe, expect, it } from "vitest"
import type {
  QuotaDistributionItem,
  QuotaListFilters,
  QuotaReserveOptions,
} from "../types/quotas"
import {
  buildQuotaCsv,
  calcQuotaSummary,
  distributeQuotas,
  filterQuotaItems,
  formatNumber,
  getStatusClass,
  getStatusLabel,
  uniqueCenters,
} from "./quotaHelpers"

const noReserves: QuotaReserveOptions = {
  applyNewDoctorReserve: false,
  applyLeaveReserve: false,
  applyPriorityAreaReserve: false,
}

function itemFixture(
  overrides: Partial<QuotaDistributionItem> = {},
): QuotaDistributionItem {
  return {
    id: "1",
    rankingPosition: 1,
    coordinator: "Coord A",
    center: "CI",
    area: "Computação",
    projectTitle: "Projeto A",
    workPlanTitle: "Plano A",
    studentName: "Discente A",
    np: 9,
    ipi: 100,
    fppi: 10,
    ifc: 8,
    approvedPlans: 1,
    assignedQuotas: 0,
    quotaSource: "NAO_CONTEMPLADO",
    status: "NAO_CONTEMPLADO",
    eligibilityReason: "Apto",
    ...overrides,
  }
}

function defaultFilters(
  overrides: Partial<QuotaListFilters> = {},
): QuotaListFilters {
  return {
    search: "",
    selectedCenter: "TODOS",
    selectedSource: "TODAS",
    selectedStatus: "TODOS",
    selectedTab: "TODOS",
    ...overrides,
  }
}

describe("formatNumber", () => {
  it("formata com duas casas em pt-BR", () => {
    expect(formatNumber(9.82)).toBe("9,82")
  })
})

describe("getStatusLabel / getStatusClass", () => {
  it("mapeia rótulos e classes", () => {
    expect(getStatusLabel("CONTEMPLADO_CNPQ")).toBe("Contemplado CNPq")
    expect(getStatusClass("CONTEMPLADO_CNPQ")).toContain("blue")
    expect(getStatusClass("PENDENTE_REVISAO")).toContain("amber")
  })
})

describe("uniqueCenters", () => {
  it("retorna centros únicos ordenados", () => {
    const items = [
      itemFixture({ id: "1", center: "CT" }),
      itemFixture({ id: "2", center: "CI" }),
      itemFixture({ id: "3", center: "CI" }),
    ]

    expect(uniqueCenters(items)).toEqual(["CI", "CT"])
  })
})

describe("distributeQuotas", () => {
  it("marca pendente sem plano ou discente", () => {
    const ranking = [
      itemFixture({
        id: "p",
        rankingPosition: 1,
        approvedPlans: 0,
        studentName: undefined,
        ifc: 9,
      }),
    ]

    const result = distributeQuotas(ranking, 2, 2, noReserves)

    expect(result[0].status).toBe("PENDENTE_REVISAO")
    expect(result[0].quotaSource).toBe("NAO_CONTEMPLADO")
  })

  it("atribui CNPq antes de UFPB para IFC >= 7", () => {
    const ranking = [
      itemFixture({ id: "1", rankingPosition: 1, ifc: 9, approvedPlans: 1 }),
      itemFixture({
        id: "2",
        rankingPosition: 2,
        coordinator: "Coord B",
        ifc: 8,
        approvedPlans: 1,
      }),
    ]

    const result = distributeQuotas(ranking, 1, 1, noReserves)

    expect(result[0].status).toBe("CONTEMPLADO_CNPQ")
    expect(result[1].status).toBe("CONTEMPLADO_UFPB")
  })

  it("limita duas cotas por coordenador com IFC >= 7", () => {
    const ranking = [
      itemFixture({ id: "1", rankingPosition: 1, ifc: 9, approvedPlans: 2 }),
      itemFixture({ id: "2", rankingPosition: 2, ifc: 9, approvedPlans: 2 }),
      itemFixture({ id: "3", rankingPosition: 3, ifc: 9, approvedPlans: 2 }),
    ]

    const result = distributeQuotas(ranking, 3, 3, noReserves)
    const awarded = result.filter(
      (item) =>
        item.status === "CONTEMPLADO_CNPQ" ||
        item.status === "CONTEMPLADO_UFPB",
    )

    expect(awarded).toHaveLength(2)
    expect(result[2].status).toBe("VOLUNTARIO")
  })

  it("IFC < 7 só recebe UFPB residual", () => {
    const ranking = [
      itemFixture({
        id: "1",
        rankingPosition: 1,
        ifc: 6,
        approvedPlans: 1,
      }),
    ]

    const result = distributeQuotas(ranking, 2, 1, noReserves)

    expect(result[0].quotaSource).toBe("UFPB")
    expect(result[0].status).toBe("CONTEMPLADO_UFPB")
  })

  it("reservas de recém-doutor reordenam a atribuição", () => {
    const ranking = [
      itemFixture({
        id: "1",
        rankingPosition: 1,
        coordinator: "Coord A",
        ifc: 8,
      }),
      itemFixture({
        id: "2",
        rankingPosition: 2,
        coordinator: "Coord B",
        ifc: 8,
        isNewDoctor: true,
      }),
    ]

    const withReserve = distributeQuotas(ranking, 1, 0, {
      ...noReserves,
      applyNewDoctorReserve: true,
    })

    expect(withReserve.find((item) => item.id === "2")?.status).toBe(
      "CONTEMPLADO_CNPQ",
    )
    expect(withReserve.find((item) => item.id === "1")?.status).toBe(
      "VOLUNTARIO",
    )
  })
})

describe("filterQuotaItems", () => {
  const items: QuotaDistributionItem[] = [
    itemFixture({
      id: "1",
      coordinator: "Ana",
      center: "CI",
      status: "CONTEMPLADO_CNPQ",
      quotaSource: "CNPq",
    }),
    itemFixture({
      id: "2",
      coordinator: "Bruno",
      center: "CT",
      status: "VOLUNTARIO",
      quotaSource: "VOLUNTARIO",
    }),
  ]

  it("filtra por busca e tab", () => {
    expect(
      filterQuotaItems(items, defaultFilters({ search: "ana" })),
    ).toHaveLength(1)

    expect(
      filterQuotaItems(items, defaultFilters({ selectedTab: "VOLUNTARIOS" })),
    ).toEqual([items[1]])
  })

  it("filtra por centro e fonte", () => {
    expect(
      filterQuotaItems(items, defaultFilters({ selectedCenter: "CT" })),
    ).toHaveLength(1)

    expect(
      filterQuotaItems(items, defaultFilters({ selectedSource: "CNPq" })),
    ).toHaveLength(1)
  })
})

describe("calcQuotaSummary", () => {
  it("conta usos e restantes", () => {
    const distribution = [
      itemFixture({ status: "CONTEMPLADO_CNPQ" }),
      itemFixture({ id: "2", status: "CONTEMPLADO_UFPB" }),
      itemFixture({ id: "3", status: "VOLUNTARIO", approvedPlans: 1 }),
      itemFixture({
        id: "4",
        status: "PENDENTE_REVISAO",
        approvedPlans: 0,
        studentName: undefined,
      }),
    ]

    const summary = calcQuotaSummary(distribution, {
      cnpqTotal: 8,
      ufpbTotal: 7,
    })

    expect(summary.cnpqUsed).toBe(1)
    expect(summary.ufpbUsed).toBe(1)
    expect(summary.volunteers).toBe(1)
    expect(summary.pending).toBe(1)
    expect(summary.eligible).toBe(3)
    expect(summary.totalScholarships).toBe(2)
    expect(summary.cnpqRemaining).toBe(7)
    expect(summary.ufpbRemaining).toBe(6)
  })
})

describe("buildQuotaCsv", () => {
  it("serializa header e escapa aspas", () => {
    const csv = buildQuotaCsv([
      itemFixture({
        projectTitle: 'Projeto "X"',
        status: "CONTEMPLADO_CNPQ",
        quotaSource: "CNPq",
      }),
    ])

    expect(csv.startsWith('"Classificação";')).toBe(true)
    expect(csv).toContain('"Projeto ""X"""')
    expect(csv).toContain('"Contemplado CNPq"')
  })
})
