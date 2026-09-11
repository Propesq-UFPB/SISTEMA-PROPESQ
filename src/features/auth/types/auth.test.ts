import { describe, expect, it } from "vitest"
import { isLegacyAdminRole, mapBackendRole } from "./auth"

describe("mapBackendRole", () => {
  it("mapeia GESTOR", () => {
    expect(mapBackendRole("GESTOR")).toBe("GESTOR")
  })

  it("ADMIN legado não vira GESTOR", () => {
    expect(mapBackendRole("ADMIN")).toBe("DISCENTE")
    expect(mapBackendRole("ADMINISTRADOR")).toBe("DISCENTE")
  })

  it("mapeia discente e coordenador", () => {
    expect(mapBackendRole("ALUNO")).toBe("DISCENTE")
    expect(mapBackendRole("DISCENTE")).toBe("DISCENTE")
    expect(mapBackendRole("COORDENADOR")).toBe("COORDENADOR")
  })

  it("desconhecido cai em DISCENTE", () => {
    expect(mapBackendRole("FOO")).toBe("DISCENTE")
    expect(mapBackendRole(undefined)).toBe("DISCENTE")
  })
})

describe("isLegacyAdminRole", () => {
  it("detecta ADMIN e ADMINISTRADOR", () => {
    expect(isLegacyAdminRole("ADMIN")).toBe(true)
    expect(isLegacyAdminRole("administrador")).toBe(true)
    expect(isLegacyAdminRole("GESTOR")).toBe(false)
  })
})
