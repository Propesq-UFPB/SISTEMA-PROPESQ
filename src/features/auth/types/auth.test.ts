import { describe, expect, it } from "vitest"
import { mapBackendRole } from "./auth"

describe("mapBackendRole", () => {
  it("mapeia gestão para GESTOR", () => {
    expect(mapBackendRole("GESTOR")).toBe("GESTOR")
    expect(mapBackendRole("ADMIN")).toBe("GESTOR")
    expect(mapBackendRole("ADMINISTRADOR")).toBe("GESTOR")
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
