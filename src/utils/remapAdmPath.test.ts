import { describe, expect, it } from "vitest"
import { remapAdmPath } from "./remapAdmPath"

describe("remapAdmPath", () => {
  it("troca prefixo /adm por /gestor", () => {
    expect(remapAdmPath("/adm/calls/Manage")).toBe("/gestor/calls/Manage")
    expect(remapAdmPath("/adm/settings/scholarships")).toBe("/gestor/settings/scholarships")
    expect(remapAdmPath("/adm/projetos/1/visualizar")).toBe("/gestor/projetos/1/visualizar")
  })

  it("mapeia admprojetos para /gestor/projetos", () => {
    expect(remapAdmPath("/adm/admprojetos")).toBe("/gestor/projetos")
    expect(remapAdmPath("/adm/admprojetos/foo")).toBe("/gestor/projetos/foo")
  })

  it("mapeia AdmCertificates", () => {
    expect(remapAdmPath("/adm/monitoring/AdmCertificates")).toBe("/gestor/monitoring/certificates")
  })

  it("ignora paths que não são /adm", () => {
    expect(remapAdmPath("/dashboard")).toBe("/dashboard")
    expect(remapAdmPath("/gestor/calls/Manage")).toBe("/gestor/calls/Manage")
  })
})
