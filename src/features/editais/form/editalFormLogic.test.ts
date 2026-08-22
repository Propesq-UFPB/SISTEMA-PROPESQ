import { describe, expect, it } from "vitest";
import type { Edital } from "../types/edital";
import {
  assertPdfFile,
  buildCreatePayload,
  buildUpdatePayload,
  collectCreateErrors,
  emptyEditalFormValues,
  hasPdfForPublish,
  hydrateEditalForm,
  toIsoDateTime,
  validationInputFromValues,
} from "./editalFormLogic";

const anexo = { id: 1, nome: "a.pdf", tipo: "pdf" };

function fixture(overrides: Partial<Edital> = {}): Edital {
  return {
    id: 11,
    codigo: "ED-1",
    descricao: "Edital PIBIC",
    status: "PUBLICADO",
    ano: 2026,
    titulacao_min: "DOUTORADO",
    tipo: "PESQUISA",
    limite_solicitacoes_orientador: 2,
    limite_planos_orientador: 4,
    avaliacao_vigente: true,
    apenas_orient_coordena_plano: false,
    tec_admin_coord_proj: false,
    divulgar_resultado: true,
    edital_para_voluntarios: true,
    apenas_colab_vol_cadastra_plano: false,
    prof_subst_cadastra_proj: false,
    categoria: { id: 5, denominacao: "IC" },
    cota_bolsa: { id: 7, codigo: "C1", descricao: "2026" },
    periodo_submissoes: {
      id: 1,
      inicio: "2026-02-01T00:00:00.000Z",
      fim: "2026-03-15T00:00:00.000Z",
    },
    periodo_execucao_rel: {
      id: 2,
      inicio: "2026-04-01T00:00:00.000Z",
      fim: "2027-03-31T00:00:00.000Z",
    },
    edital_cota_distribuicao: [
      {
        id: 1,
        id_edital: 11,
        id_bolsa: 4,
        quantidade: 10,
        fppi_min: 10.5,
        media_min_proj: 7,
        exige_doutorado: true,
      },
    ],
    unidade_ids: [1, 2],
    anexo,
    ...overrides,
  };
}

describe("hydrateEditalForm", () => {
  it("corta datas ISO para input date", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.executionStart).toBe("2026-04-01");
  });

  it("converte flags booleanas para SIM/NAO", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.editalVoluntarios).toBe("SIM");
  });

  it("hidrata periodoCota a partir de cota_bolsa.id", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.periodoCota).toBe("7");
  });

  it("hidrata a primeira linha de cotas", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.distribuicaoCotasBolsas).toBe("SIM");
    expect(values.tipoBolsa).toBe("4");
  });

  it("hidrata cotas vazias como NAO", () => {
    const values = hydrateEditalForm(
      fixture({ edital_cota_distribuicao: [] }),
    );
    expect(values.distribuicaoCotasBolsas).toBe("NAO");
  });

  it("hidrata anexo existente", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.existingAnexo).toEqual(anexo);
  });

  it("hidrata anexo null", () => {
    const values = hydrateEditalForm(fixture({ anexo: null }));
    expect(values.existingAnexo).toBeNull();
  });

  it("hidrata unidades", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.unidadeIds).toEqual([1, 2]);
  });

  it("formata decimais com vírgula", () => {
    const values = hydrateEditalForm(fixture());
    expect(values.fppiMinimo).toBe("10,50");
    expect(values.mediaMinimaProjetos).toBe("7,0");
  });
});

describe("hasPdfForPublish", () => {
  const file = new File(["x"], "a.pdf", { type: "application/pdf" });

  it("aceita anexo existente sem file", () => {
    expect(hasPdfForPublish(null, anexo)).toBe(true);
  });

  it("rejeita sem file e sem anexo", () => {
    expect(hasPdfForPublish(null, null)).toBe(false);
  });

  it("aceita file sem anexo", () => {
    expect(hasPdfForPublish(file, null)).toBe(true);
  });
});

describe("payloads", () => {
  it("buildCreatePayload monta rascunho com ISO e omite codigo vazio", () => {
    const values = emptyEditalFormValues(2026);
    values.descricao = "Novo";
    values.submissionStart = "2026-02-01";
    values.submissionEnd = "2026-03-01";
    values.executionStart = "2026-04-01";
    values.executionEnd = "2027-03-31";
    values.titulacaoMinima = "DOUTORADO";
    values.periodoCota = "7";
    values.categoria = "5";

    const payload = buildCreatePayload(values, "RASCUNHO");

    expect(payload.status).toBe("RASCUNHO");
    expect(payload.periodo_submissao.inicio).toBe(
      "2026-02-01T00:00:00.000Z",
    );
    expect(payload.codigo).toBeUndefined();
  });

  it("buildUpdatePayload aceita ENCERRADO e campos completos", () => {
    const values = hydrateEditalForm(fixture());
    const payload = buildUpdatePayload(values, "ENCERRADO");

    expect(payload.status).toBe("ENCERRADO");
    expect(payload.descricao).toBe("Edital PIBIC");
    expect(payload.ano).toBe(2026);
    expect(payload.tipo).toBe("PESQUISA");
    expect(payload.categoria_id).toBe(5);
    expect(payload.cota_bolsa_id).toBe(7);
    expect(payload.edital_para_voluntarios).toBe(true);
    expect(payload.periodo_execucao?.inicio).toBe(
      "2026-04-01T00:00:00.000Z",
    );
    expect(payload.edital_cota_distribuicao).toHaveLength(1);
  });

  it("buildUpdatePayload envia cotas vazias quando NAO", () => {
    const values = hydrateEditalForm(fixture({ edital_cota_distribuicao: [] }));
    const payload = buildUpdatePayload(values, "RASCUNHO");
    expect(payload.edital_cota_distribuicao).toEqual([]);
  });

  it("buildUpdatePayload manda codigo vazio para apagar no backend", () => {
    const values = hydrateEditalForm(fixture());
    values.code = "";
    expect(buildUpdatePayload(values, "RASCUNHO").codigo).toBe("");
  });
});

describe("collectCreateErrors", () => {
  it("exige descrição", () => {
    const values = emptyEditalFormValues();
    const errors = collectCreateErrors(
      validationInputFromValues(values, "", ""),
    );
    expect(errors).toContain("Informe a descrição do edital.");
  });

  it("exige bolsa quando distribuição está SIM", () => {
    const values = emptyEditalFormValues();
    values.distribuicaoCotasBolsas = "SIM";
    const errors = collectCreateErrors(
      validationInputFromValues(values, "", ""),
    );
    expect(errors).toContain("Selecione o tipo da bolsa.");
  });
});

describe("toIsoDateTime", () => {
  it("preserva vazio, acrescenta T, e deixa ISO intacto", () => {
    expect(toIsoDateTime("")).toBe("");
    expect(toIsoDateTime("2026-04-01")).toBe("2026-04-01T00:00:00.000Z");
    expect(toIsoDateTime("2026-04-01T12:00:00.000Z")).toBe(
      "2026-04-01T12:00:00.000Z",
    );
  });
});

describe("emptyEditalFormValues", () => {
  it("começa em PESQUISA sem anexo", () => {
    const values = emptyEditalFormValues();
    expect(values.tipoEdital).toBe("PESQUISA");
    expect(values.existingAnexo).toBeNull();
  });
});

describe("assertPdfFile", () => {
  it("rejeita tipo diferente de PDF", () => {
    const file = new File(["x"], "a.txt", { type: "text/plain" });
    expect(assertPdfFile(file)).toBe(
      "Formato inválido. Envie um arquivo PDF.",
    );
  });

  it("rejeita arquivo maior que 25MB", () => {
    const file = new File(["x"], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 26 * 1024 * 1024 });
    expect(assertPdfFile(file)).toMatch(/Arquivo muito grande/);
  });
});
