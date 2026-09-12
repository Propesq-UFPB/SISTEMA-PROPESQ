import { describe, expect, it } from "vitest"
import {
  getScheduleMonth,
  isInternalSpecificDataValid,
  splitKeywords,
  validateProjectAttachment,
} from "./ProjectFormWizard"
import { getEditalExecutionPeriod } from "../utils/projectPeriod"

describe("validações do cadastro de projeto", () => {
  it("normaliza palavras-chave separadas por vírgula ou ponto e vírgula", () => {
    expect(splitKeywords(" pesquisa, inovação; pesquisa ")).toEqual([
      "pesquisa",
      "inovação",
    ])
  })

  it("converte os meses relativos do cronograma em datas", () => {
    expect(getScheduleMonth("2026-11-15", 1)).toBe("2026-11-01")
    expect(getScheduleMonth("2026-11-15", 3)).toBe("2027-01-01")
  })

  it("usa o período de execução do edital como período do projeto", () => {
    expect(
      getEditalExecutionPeriod({
        periodo_execucao_rel: {
          inicio: "2026-08-01T00:00:00.000Z",
          fim: "2027-07-31T00:00:00.000Z",
        },
      }),
    ).toEqual({
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
    })
  })

  it("exige grupo apenas quando o vínculo é marcado", () => {
    const base = {
      vinculadoGrupo: "Não" as const,
      grupoPesquisa: "",
      possuiProtocoloEtica: "Não" as const,
      comiteEticaNome: "",
      protocoloEtica: "",
    }
    expect(isInternalSpecificDataValid("Linha obrigatória", base)).toBe(true)
    expect(
      isInternalSpecificDataValid("Linha obrigatória", {
        ...base,
        vinculadoGrupo: "Sim",
      }),
    ).toBe(false)
  })

  it("exige comitê e protocolo somente quando a opção é marcada", () => {
    const marked = {
      vinculadoGrupo: "Não" as const,
      grupoPesquisa: "",
      possuiProtocoloEtica: "Sim" as const,
      comiteEticaNome: "CEP/UFPB",
      protocoloEtica: "",
    }
    expect(isInternalSpecificDataValid("Linha", marked)).toBe(false)
    expect(
      isInternalSpecificDataValid("Linha", {
        ...marked,
        protocoloEtica: "12345",
      }),
    ).toBe(true)
  })

  it("valida formato e limite do arquivo", () => {
    expect(validateProjectAttachment(new File(["x"], "projeto.txt"))).toContain(
      "PDF",
    )
    expect(
      validateProjectAttachment(
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], "projeto.pdf", {
          type: "application/pdf",
        }),
      ),
    ).toContain("10 MB")
  })
})
