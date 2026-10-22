import { describe, expect, it } from "vitest"
import { ApiError } from "@/services/apiClient"
import { toConsultant } from "@/features/consultants/api/consultantService"
import type { ConsultantFormValues, KnowledgeArea } from "@/features/consultants/types/consultant"
import {
  apiErrorMessage,
  areaLabel,
  consultantTags,
  EMPTY_CONSULTANT_FORM,
  toConsultantPayload,
  validateConsultantForm,
} from "@/features/consultants/utils/consultantHelpers"

const area = (id: number, subArea = ""): KnowledgeArea => ({
  id,
  grandeArea: "Ciências Exatas e da Terra",
  area: "Ciência da Computação",
  subArea,
  especialidade: "",
})

const values: ConsultantFormValues = {
  user: { id: 7, nome: "Maria", email: "maria@ufpb.br" },
  isPropesq: true,
  isVoluntario: false,
  isCnpq: true,
  areaPrincipal: area(10),
  areasAdicionais: [area(11, "Teoria da Computação"), area(10)],
  ativo: true,
}

describe("toConsultantPayload", () => {
  it("envia usuario_id só na criação e remove a área principal das adicionais", () => {
    expect(toConsultantPayload(values, false)).toEqual({
      usuario_id: 7,
      area_principal_id: 10,
      areas_adicionais_ids: [11],
      is_propesq: true,
      is_voluntario: false,
      is_cnpq: true,
      ativo: true,
    })
    expect(toConsultantPayload(values, true)).not.toHaveProperty("usuario_id")
  })
})

describe("validateConsultantForm", () => {
  it("exige usuário e área principal", () => {
    expect(validateConsultantForm(EMPTY_CONSULTANT_FORM)).toEqual({
      user: expect.any(String),
      areaPrincipal: expect.any(String),
    })
    expect(validateConsultantForm(values)).toEqual({})
  })
})

describe("areaLabel", () => {
  it("ignora níveis vazios da hierarquia", () => {
    expect(areaLabel(area(1, "Teoria da Computação"))).toBe(
      "Ciências Exatas e da Terra › Ciência da Computação › Teoria da Computação",
    )
    expect(areaLabel(null)).toBe("—")
  })
})

describe("consultantTags", () => {
  it("lista os perfis marcados", () => {
    expect(consultantTags({ isPropesq: true, isVoluntario: true, isCnpq: true })).toEqual([
      "PROPESQ",
      "Voluntário",
      "CNPq",
    ])
    expect(consultantTags({ isPropesq: false, isVoluntario: false, isCnpq: false })).toEqual([])
  })
})

describe("apiErrorMessage", () => {
  it("junta mensagens de validação em lista e usa o fallback para erros desconhecidos", () => {
    const err = new ApiError(400, "", { message: ["Campo A inválido.", "Campo B inválido."] as never })
    expect(apiErrorMessage(err, "falhou")).toBe("Campo A inválido. Campo B inválido.")
    expect(apiErrorMessage(new ApiError(409, "Já existe."), "falhou")).toBe("Já existe.")
    expect(apiErrorMessage(new Error("x"), "falhou")).toBe("falhou")
  })
})

describe("toConsultant", () => {
  it("converte a resposta da API para o modelo do front", () => {
    const apiArea = {
      id: 10,
      grande_area: "Ciências Exatas e da Terra",
      area: "Ciência da Computação",
      sub_area: "",
      especialidade: "",
    }

    expect(
      toConsultant({
        id: 1,
        usuario: { id: 7, nome: "Maria", email: "maria@ufpb.br" },
        area_principal: apiArea,
        areas_adicionais: [{ ...apiArea, id: 11, sub_area: "Teoria da Computação" }],
        is_propesq: true,
        is_voluntario: false,
        is_cnpq: false,
        ativo: true,
        criado_em: "2026-10-15T00:00:00.000Z",
        atualizado_em: "2026-10-15T00:00:00.000Z",
      }),
    ).toEqual({
      id: 1,
      user: { id: 7, nome: "Maria", email: "maria@ufpb.br" },
      areaPrincipal: area(10),
      areasAdicionais: [area(11, "Teoria da Computação")],
      isPropesq: true,
      isVoluntario: false,
      isCnpq: false,
      ativo: true,
    })
  })
})
