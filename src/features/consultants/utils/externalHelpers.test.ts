import { describe, expect, it } from "vitest"
import { toConsultant, toExternalConsultant } from "@/features/consultants/api/consultantService"
import type { ExternalFormValues, KnowledgeArea } from "@/features/consultants/types/consultant"
import {
  EMPTY_EXTERNAL_FORM,
  endOfDayIso,
  linkStatusLabel,
  toExternalFormValues,
  toExternalPayload,
  validateExternalForm,
} from "@/features/consultants/utils/externalHelpers"

const area = (id: number): KnowledgeArea => ({
  id,
  grandeArea: "Ciências Exatas e da Terra",
  area: "Ciência da Computação",
  subArea: "",
  especialidade: "",
})

const values: ExternalFormValues = {
  ...EMPTY_EXTERNAL_FORM,
  nome: "  Ana Souza ",
  email: "ana@ufpe.br",
  instituicao: "UFPE",
  titulacao: "DOUTORADO",
  cpf: "123.456.789-09",
  areaPrincipal: area(10),
  areasAdicionais: [area(11), area(10)],
}

const now = new Date(2026, 10, 5, 12)

describe("validateExternalForm", () => {
  it("exige nome, e-mail, instituição e área principal", () => {
    expect(Object.keys(validateExternalForm(EMPTY_EXTERNAL_FORM, now)).sort()).toEqual([
      "areaPrincipal",
      "email",
      "instituicao",
      "nome",
    ])
    expect(validateExternalForm(values, now)).toEqual({})
  })

  it("valida CPF, Lattes, ORCID e validade do link só quando preenchidos", () => {
    const errors = validateExternalForm(
      { ...values, cpf: "123", lattesUrl: "lattes", orcid: "12", linkExpiraEm: "2026-11-04" },
      now,
    )
    expect(Object.keys(errors).sort()).toEqual(["cpf", "lattesUrl", "linkExpiraEm", "orcid"])

    expect(
      validateExternalForm(
        {
          ...values,
          lattesUrl: "http://lattes.cnpq.br/123",
          orcid: "0000-0002-1825-009X",
          linkExpiraEm: "2026-11-05",
        },
        now,
      ),
    ).toEqual({})
  })
})

describe("toExternalPayload", () => {
  it("na criação omite opcionais vazios, limpa o CPF e envia a validade como fim do dia", () => {
    const payload = toExternalPayload({ ...values, linkExpiraEm: "2027-03-31" }, false)

    expect(payload).toMatchObject({
      nome: "Ana Souza",
      cpf: "12345678909",
      titulacao: "DOUTORADO",
      area_principal_id: 10,
      areas_adicionais_ids: [11],
      link_expira_em: endOfDayIso("2027-03-31"),
    })
    expect(payload.telefone).toBeUndefined()
    expect(payload.orcid).toBeUndefined()
    expect(new Date(payload.link_expira_em!).getHours()).toBe(23)
  })

  it("na edição envia null para limpar opcionais e nunca envia validade de link", () => {
    const payload = toExternalPayload(
      { ...values, cpf: "", titulacao: "", linkExpiraEm: "2027-03-31" },
      true,
    )

    expect(payload).toMatchObject({ cpf: null, titulacao: null, telefone: null, orcid: null })
    expect(payload).not.toHaveProperty("link_expira_em")
  })
})

describe("linkStatusLabel", () => {
  it("descreve a situação do link", () => {
    const base = { criadoEm: "2026-11-01T10:00:00Z", expiraEm: null, ultimoAcessoEm: null }
    expect(linkStatusLabel({ ...base, ativo: true })).toBe("Válido")
    expect(linkStatusLabel({ ...base, ativo: true, expiraEm: "2027-03-31T23:59:59Z" })).toMatch(
      /^Válido até /,
    )
    expect(linkStatusLabel({ ...base, ativo: false })).toBe("Revogado ou expirado")
    expect(linkStatusLabel({ ...base, ativo: false, criadoEm: null })).toBe("Nenhum link gerado")
  })
})

describe("mapeamento da API", () => {
  const row = {
    id: 7,
    usuario: { id: 50, nome: "Ana Souza", email: "ana@ufpe.br" },
    tipo: "EXTERNO" as const,
    externo: {
      instituicao: "UFPE",
      titulacao: "DOUTORADO" as const,
      cpf: "12345678909",
      pais: "Brasil",
      telefone: null,
      lattes_url: "http://lattes.cnpq.br/1",
      orcid: null,
      observacao: null,
    },
    area_principal: {
      id: 10,
      grande_area: "Ciências Exatas e da Terra",
      area: "Ciência da Computação",
      sub_area: "",
      especialidade: "",
    },
    areas_adicionais: [],
    is_propesq: false,
    is_voluntario: true,
    is_cnpq: false,
    ativo: true,
    criado_em: "",
    atualizado_em: "",
  }

  it("converte o avaliador externo e a situação do link", () => {
    const consultant = toExternalConsultant({
      ...row,
      link: {
        ativo: true,
        criado_em: "2026-11-05T10:00:00Z",
        expira_em: null,
        ultimo_acesso_em: null,
      },
    })

    expect(consultant).toMatchObject({
      tipo: "EXTERNO",
      externo: { instituicao: "UFPE", lattesUrl: "http://lattes.cnpq.br/1" },
      link: { ativo: true, criadoEm: "2026-11-05T10:00:00Z" },
    })
    expect(toExternalFormValues(consultant)).toMatchObject({
      nome: "Ana Souza",
      instituicao: "UFPE",
      titulacao: "DOUTORADO",
      telefone: "",
      isVoluntario: true,
      linkExpiraEm: "",
    })
  })

  it("trata respostas sem tipo como avaliador interno", () => {
    const { tipo: _tipo, externo: _externo, ...semTipo } = row
    expect(toConsultant(semTipo)).toMatchObject({ tipo: "INTERNO", externo: null })
  })
})
