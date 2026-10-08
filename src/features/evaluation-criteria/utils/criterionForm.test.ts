import { describe, expect, it } from "vitest"
import {
  ativoFilterToQuery,
  toCreatePayload,
  toUpdatePayload,
  validateCriterionForm,
  type CriterionFormValues,
} from "@/features/evaluation-criteria/utils/criterionForm"

const valid: CriterionFormValues = {
  nome: " Metodologia ",
  descricao: "   ",
  peso: "0,30",
  nota_maxima: "10",
  ativo: true,
}

describe("validateCriterionForm", () => {
  it("aceita formulário válido e omite descrição vazia no create", () => {
    expect(validateCriterionForm(valid)).toEqual({})
    expect(toCreatePayload(valid)).toEqual({
      nome: "Metodologia",
      peso: 0.3,
      nota_maxima: 10,
      ativo: true,
    })
  })

  it("envia descrição vazia no update para limpar o texto", () => {
    expect(toUpdatePayload(valid)).toEqual({
      nome: "Metodologia",
      descricao: "",
      peso: 0.3,
      nota_maxima: 10,
      ativo: true,
    })
  })

  it("rejeita nome vazio", () => {
    expect(validateCriterionForm({ ...valid, nome: "   " }).nome).toBe(
      "O nome é obrigatório.",
    )
  })

  it("rejeita nome acima de 255 caracteres", () => {
    expect(validateCriterionForm({ ...valid, nome: "a".repeat(256) }).nome).toBe(
      "O nome deve ter no máximo 255 caracteres.",
    )
  })

  it("rejeita peso abaixo de 0.01", () => {
    expect(validateCriterionForm({ ...valid, peso: "0" }).peso).toBe(
      "O peso deve ser no mínimo 0.01.",
    )
  })

  it("rejeita nota máxima abaixo de 0.01", () => {
    expect(validateCriterionForm({ ...valid, nota_maxima: "0.009" }).nota_maxima).toBe(
      "A nota máxima deve ser no mínimo 0.01.",
    )
  })
})

describe("ativoFilterToQuery", () => {
  it("mapeia o filtro da lista para o query param", () => {
    expect(ativoFilterToQuery("ativos")).toBe(true)
    expect(ativoFilterToQuery("inativos")).toBe(false)
    expect(ativoFilterToQuery("todos")).toBeUndefined()
  })
})
