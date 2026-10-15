import { describe, expect, it } from "vitest"
import type { EvaluationInvitation } from "../types/invitation"
import {
  EMPTY_FILTERS,
  editalOptions,
  filterInvitations,
  invitationStage,
  invitationSummary,
  yearOptions,
} from "./invitationHelpers"

const invitation = (
  id: number,
  overrides: Partial<EvaluationInvitation> = {},
): EvaluationInvitation => ({
  id,
  status: "PENDENTE",
  reason: null,
  hasGrades: false,
  sentAt: "2026-10-01T00:00:00.000Z",
  answeredAt: null,
  project: {
    id,
    code: `P-${id}`,
    title: `Projeto ${id}`,
    area: { id: 1, grandeArea: "Exatas", area: "Computação", subArea: "IA", especialidade: "" },
  },
  edital: { id: 1, label: "PIBIC 2026", year: 2026 },
  ...overrides,
})

describe("invitationStage", () => {
  it("deriva a situação do convite a partir do status e das notas", () => {
    expect(invitationStage({ status: "PENDENTE", hasGrades: false })).toBe("CONVITE")
    expect(invitationStage({ status: "ACEITO", hasGrades: false })).toBe("AGUARDANDO")
    expect(invitationStage({ status: "ACEITO", hasGrades: true })).toBe("REALIZADA")
    expect(invitationStage({ status: "RECUSADO", hasGrades: false })).toBe("RECUSADA")
  })
})

describe("filterInvitations", () => {
  const list = [
    invitation(1),
    invitation(2, { status: "ACEITO", edital: { id: 2, label: "PIBITI 2025", year: 2025 } }),
    invitation(3, { status: "RECUSADO", project: { ...invitation(3).project, title: "Genômica" } }),
  ]

  it("filtra por texto, edital, situação e ano", () => {
    expect(filterInvitations(list, { ...EMPTY_FILTERS, search: "genomica" }).map((i) => i.id)).toEqual([3])
    expect(filterInvitations(list, { ...EMPTY_FILTERS, editalId: 2 }).map((i) => i.id)).toEqual([2])
    expect(filterInvitations(list, { ...EMPTY_FILTERS, stage: "CONVITE" }).map((i) => i.id)).toEqual([1])
    expect(filterInvitations(list, { ...EMPTY_FILTERS, year: 2026 }).map((i) => i.id)).toEqual([1, 3])
  })

  it("gera resumo e opções dos filtros", () => {
    expect(invitationSummary(list)).toEqual({
      total: 3,
      convites: 1,
      aguardando: 1,
      realizadas: 0,
      recusadas: 1,
    })
    expect(editalOptions(list)).toEqual([
      { id: 1, label: "PIBIC 2026" },
      { id: 2, label: "PIBITI 2025" },
    ])
    expect(yearOptions(list)).toEqual([2026, 2025])
  })
})
