import { describe, expect, it } from "vitest"
import type { FormState } from "../types/projectFormWizard"
import { getEditalExecutionPeriod } from "./projectPeriod"
import {
  canAdvanceFromStep,
  checkCanGoStep2,
  checkCanGoStep4,
  checkCanGoStep5,
  formatCronogramaDuration,
  getProjectDurationInMonths,
  getScheduleMonth,
  initialState,
  isInternalSpecificDataValid,
  isSimpleEmail,
  splitKeywords,
  validateProjectAttachment,
} from "./projectFormHelpers"

function formWith(partial: Partial<FormState["gerais"]>): FormState {
  return {
    ...initialState,
    gerais: { ...initialState.gerais, ...partial },
  }
}

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

  it("valida email simples sem regex backtracking", () => {
    expect(isSimpleEmail("user@mail.com")).toBe(true)
    expect(isSimpleEmail("user@mail.co.uk")).toBe(true)
    expect(isSimpleEmail("@mail.com")).toBe(false)
    expect(isSimpleEmail("user@mail")).toBe(false)
    expect(isSimpleEmail("user mail@x.com")).toBe(false)
    expect(isSimpleEmail("a@b@c.d")).toBe(false)
  })

  it("libera step 2 só para tipo interno (externo desabilitado)", () => {
    expect(checkCanGoStep2(formWith({ tipo: "interno" }))).toBe(true)
    expect(checkCanGoStep2(formWith({ tipo: "externo" }))).toBe(false)
    expect(checkCanGoStep2(formWith({ tipo: null }))).toBe(false)
  })

  it("exige ODS e cronograma para avançar do step 3", () => {
    expect(checkCanGoStep4(initialState, true)).toBe(false)
    expect(
      checkCanGoStep4(
        formWith({
          objetivosDS: [{ id: 1, label: "ODS 1" }],
          cronograma: [
            { id: "c1", atividade: "A", mesInicio: 1, mesFim: 2 },
          ],
        }),
        true,
      ),
    ).toBe(true)
    expect(
      checkCanGoStep4(
        formWith({
          objetivosDS: [{ id: 1, label: "ODS 1" }],
          cronograma: [
            { id: "c1", atividade: "A", mesInicio: 1, mesFim: 2 },
          ],
        }),
        false,
      ),
    ).toBe(false)
  })

  it("exige membros no step 4 para projeto interno", () => {
    expect(checkCanGoStep5(formWith({ tipo: "interno" }), true)).toBe(false)
    expect(
      checkCanGoStep5(
        formWith({
          tipo: "interno",
          membros: [
            {
              id: "m1",
              categoria: "DOCENTE",
              userId: "1",
              nome: "A",
              papel: "Coordenador",
              email: "a@b.c",
              cargaHoraria: "10",
              cpf: "",
              sexo: "M",
              formacao: "Doutorado",
              tipoExterno: "",
            },
          ],
        }),
        true,
      ),
    ).toBe(true)
  })

  it("calcula duração e formata cronograma", () => {
    expect(getProjectDurationInMonths("2026-01-01", "2026-03-31")).toBe(3)
    expect(getProjectDurationInMonths("", "")).toBe(12)
    expect(formatCronogramaDuration(2, 2)).toBe("Mês 2")
    expect(formatCronogramaDuration(1, 4)).toBe("Mês 1 ao mês 4")
  })

  it("mapeia avanço por step a partir das flags", () => {
    const flags = {
      canGoStep2: true,
      canGoStep3: false,
      canGoStep4: false,
      canGoStep5: false,
      canGoStep6: false,
    }
    expect(canAdvanceFromStep(1, flags)).toBe(true)
    expect(canAdvanceFromStep(2, flags)).toBe(false)
    expect(canAdvanceFromStep(6, flags)).toBe(true)
  })
})
