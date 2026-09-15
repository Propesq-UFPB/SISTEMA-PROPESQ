import { describe, expect, it } from "vitest";
import type { ResearchProject } from "@/features/projects/types/project";
import type { WorkPlan as ApiWorkPlan } from "@/features/work-plans/types/workPlan";
import type {
  SelectableProject,
  WorkPlanDraft,
} from "@/features/work-plans/types/coordinatorWorkPlanForm";
import {
  buildCreateWorkPlanPayload,
  computeDuracaoPeriodoMeses,
  isCronogramaDentroDoPeriodo,
  isDraftReadyToSave,
  mapApiPlan,
  mapProject,
  matchesProjectFilters,
} from "./workPlanFormHelpers";

function projectFixture(
  overrides: Partial<SelectableProject> = {},
): SelectableProject {
  return {
    id: "10",
    codigo: "PROPESQ-2026-001",
    titulo: "Sistema inteligente de pesquisa",
    edital: "PIBIC 2026",
    coordenador: "Profa. Ana",
    unidade: "Depto A",
    centro: "CCEN",
    periodo: "2026-08-01 → 2027-07-31",
    status: "APROVADO",
    modalidadeBolsa: "PIBIC",
    totalPlanos: 0,
    ...overrides,
  };
}

function draftFixture(overrides: Partial<WorkPlanDraft> = {}): WorkPlanDraft {
  return {
    id: "plano-1",
    modalidade: "PIBIC",
    titulo: "Título do plano",
    title: "Work plan title",
    solicitarAcaoAfirmativa: false,
    periodoIni: "2026-08-01",
    periodoFim: "2027-07-31",
    introducaoJustificativa: "Introdução",
    objetivos: "Objetivos",
    metodologia: "Metodologia",
    cronogramaAtividades: [
      { id: "c1", atividade: "Revisão", mesInicio: 1, mesFim: 2 },
    ],
    referencias: "Referências",
    ...overrides,
  };
}

describe("matchesProjectFilters", () => {
  it("aceita projeto aprovado sem filtros", () => {
    expect(
      matchesProjectFilters(projectFixture(), {
        codigo: "",
        nome: "",
        modalidade: "Todas",
      }),
    ).toBe(true);
  });

  it("rejeita status não permitido", () => {
    expect(
      matchesProjectFilters(projectFixture({ status: "SUBMETIDO" }), {
        codigo: "",
        nome: "",
        modalidade: "Todas",
      }),
    ).toBe(false);
  });

  it("filtra por código, nome e modalidade", () => {
    const project = projectFixture();
    expect(
      matchesProjectFilters(project, {
        codigo: "2026-001",
        nome: "inteligente",
        modalidade: "PIBIC",
      }),
    ).toBe(true);
    expect(
      matchesProjectFilters(project, {
        codigo: "ZZZ",
        nome: "",
        modalidade: "Todas",
      }),
    ).toBe(false);
    expect(
      matchesProjectFilters(project, {
        codigo: "",
        nome: "outro",
        modalidade: "Todas",
      }),
    ).toBe(false);
    expect(
      matchesProjectFilters(project, {
        codigo: "",
        nome: "",
        modalidade: "PIBITI",
      }),
    ).toBe(false);
  });
});

describe("computeDuracaoPeriodoMeses", () => {
  it("calcula meses inclusivos", () => {
    expect(computeDuracaoPeriodoMeses("2026-08-01", "2027-07-31")).toBe(12);
  });

  it("retorna 0 para período inválido ou vazio", () => {
    expect(computeDuracaoPeriodoMeses("", "2027-07-31")).toBe(0);
    expect(computeDuracaoPeriodoMeses("2027-07-31", "2026-08-01")).toBe(0);
    expect(computeDuracaoPeriodoMeses("invalid", "2027-07-31")).toBe(0);
  });
});

describe("isCronogramaDentroDoPeriodo", () => {
  it("valida itens dentro da duração", () => {
    expect(
      isCronogramaDentroDoPeriodo(
        [{ id: "1", atividade: "A", mesInicio: 1, mesFim: 3 }],
        12,
      ),
    ).toBe(true);
  });

  it("rejeita fora do período ou duração zero", () => {
    expect(
      isCronogramaDentroDoPeriodo(
        [{ id: "1", atividade: "A", mesInicio: 1, mesFim: 13 }],
        12,
      ),
    ).toBe(false);
    expect(
      isCronogramaDentroDoPeriodo(
        [{ id: "1", atividade: "A", mesInicio: 1, mesFim: 1 }],
        0,
      ),
    ).toBe(false);
  });
});

describe("isDraftReadyToSave", () => {
  it("pronto quando projeto + campos + cronograma ok", () => {
    expect(isDraftReadyToSave(draftFixture(), true, true)).toBe(true);
  });

  it("bloqueia sem projeto, campos ou cronograma", () => {
    expect(isDraftReadyToSave(draftFixture(), false, true)).toBe(false);
    expect(
      isDraftReadyToSave(draftFixture({ titulo: "  " }), true, true),
    ).toBe(false);
    expect(isDraftReadyToSave(draftFixture(), true, false)).toBe(false);
    expect(
      isDraftReadyToSave(
        draftFixture({ cronogramaAtividades: [] }),
        true,
        true,
      ),
    ).toBe(false);
  });
});

describe("buildCreateWorkPlanPayload", () => {
  it("monta payload com shape esperada", () => {
    const payload = buildCreateWorkPlanPayload(
      projectFixture(),
      draftFixture({ solicitarAcaoAfirmativa: true, modalidade: "PIVIC" }),
    );

    expect(payload.pesquisa_id).toBe(10);
    expect(payload.modalidade).toBe("PIVIC");
    expect(payload.tipo_bolsa).toBe("VOLUNTARIO");
    expect(payload.direcionamento_plano).toBe("ACAO_AFIRMATIVA");
    expect(payload.corpo_plano_trabalho.titulo).toBe("Título do plano");
    expect(payload.atividades).toHaveLength(1);
    expect(payload.atividades[0].descricao).toBe("Revisão");
    expect(payload.atividades[0].meses.length).toBe(2);
  });
});

describe("mapProject / mapApiPlan", () => {
  it("mapeia campos essenciais do projeto", () => {
    const mapped = mapProject({
      id: 42,
      titulo: "Projeto X",
      codigo: "PX-1",
      situacao: "VALIDADO",
      unidade: "Lab",
      vigencia: "2026 → 2027",
    } as ResearchProject);

    expect(mapped).toMatchObject({
      id: "42",
      codigo: "PX-1",
      titulo: "Projeto X",
      status: "VALIDADO",
      unidade: "Lab",
      periodo: "2026 → 2027",
    });
  });

  it("mapeia campos essenciais do plano API", () => {
    const mapped = mapApiPlan({
      id: 7,
      pesquisa_id: 10,
      modalidade: "PIBIC",
      status: "RASCUNHO",
      tipo_bolsa: "BOLSISTA",
      cronograma_id: 1,
      direcionamento_plano: "AMPLA_CONCORRENCIA",
      corpo_plano_trabalho: {
        titulo: "Plano Y",
        introducao: "Intro",
        objetivos: "Obj",
        metodologia: "Met",
        referencias: "Ref",
      },
      atividades: [
        {
          id: 1,
          descricao: "Atividade",
          meses: [{ data: "2026-08-01" }, { data: "2026-09-01" }],
        },
      ],
    } as ApiWorkPlan);

    expect(mapped).toMatchObject({
      id: "7",
      modalidade: "PIBIC",
      titulo: "Plano Y",
      introducaoJustificativa: "Intro",
      objetivos: "Obj",
      metodologia: "Met",
      referencias: "Ref",
      solicitarAcaoAfirmativa: false,
    });
    expect(mapped.cronogramaAtividades[0]).toMatchObject({
      atividade: "Atividade",
      mesInicio: 1,
      mesFim: 2,
    });
  });
});
