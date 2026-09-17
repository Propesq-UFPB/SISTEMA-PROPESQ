import type {
  CreateEditalPayload,
  Edital,
  EditalAnexoMeta,
  EditalCotaDistribuicaoPayload,
  StatusEdital,
  StatusInicialEdital,
  TipoEdital,
  TitulacaoMin,
  UpdateEditalPayload,
} from "../types/edital";

export type YesNo = "SIM" | "NAO";
export type EditalFormMode = "create" | "edit";

export type QuotaDistributionForm = {
  id: number;
  tipoBolsa: string;
  quantidade: string;
  fppiMin: string;
  mediaMinProj: string;
};

let nextQuotaDistributionId = 1;

export function createQuotaDistribution(
  values: Partial<Omit<QuotaDistributionForm, "id">> = {},
): QuotaDistributionForm {
  return {
    id: nextQuotaDistributionId++,
    tipoBolsa: "",
    quantidade: "0",
    fppiMin: "0,00",
    mediaMinProj: "0,0",
    ...values,
  };
}

export type EditalFormValues = {
  savedEditalId: number | null;
  status: StatusEdital;
  editalYear: string;
  code: string;
  descricao: string;
  submissionStart: string;
  submissionEnd: string;
  executionStart: string;
  executionEnd: string;
  titulacaoMinima: string;
  periodoCota: string;
  tipoEdital: string;
  limiteProjetosOrientador: string;
  limitePlanosOrientador: string;
  editalVoluntarios: YesNo;
  avaliacaoVigente: YesNo;
  apenasCoordenadorOrientaPlano: YesNo;
  apenasColaboradorVoluntarioCadastraProjeto: YesNo;
  professorSubstitutoCadastraProjeto: YesNo;
  tecnicoAdministrativoPodeCoordenar: YesNo;
  divulgarResultado: YesNo;
  distribuicaoCotasBolsas: YesNo;
  quotaDistributions: QuotaDistributionForm[];
  unidadeIds: number[];
  existingAnexo: EditalAnexoMeta | null;
};

export type CreateCallValidationInput = Readonly<{
  editalYear: string;
  descricao: string;
  submissionStart: string;
  submissionEnd: string;
  submissionDateError: string;
  executionStart: string;
  executionEnd: string;
  executionDateError: string;
  titulacaoMinima: string;
  periodoCota: string;
  tipoEdital: string;
  limiteProjetosOrientador: string;
  limitePlanosOrientador: string;
  distribuicaoCotasBolsas: YesNo;
  quotaDistributions: QuotaDistributionForm[];
}>;

export function yearNow() {
  return new Date().getFullYear();
}

export function emptyEditalFormValues(
  year = yearNow(),
): EditalFormValues {
  return {
    savedEditalId: null,
    status: "RASCUNHO",
    editalYear: String(year),
    code: "",
    descricao: "",
    submissionStart: "",
    submissionEnd: "",
    executionStart: "",
    executionEnd: "",
    titulacaoMinima: "",
    periodoCota: "",
    tipoEdital: "PESQUISA",
    limiteProjetosOrientador: "0",
    limitePlanosOrientador: "0",
    editalVoluntarios: "NAO",
    avaliacaoVigente: "NAO",
    apenasCoordenadorOrientaPlano: "NAO",
    apenasColaboradorVoluntarioCadastraProjeto: "NAO",
    professorSubstitutoCadastraProjeto: "NAO",
    tecnicoAdministrativoPodeCoordenar: "NAO",
    divulgarResultado: "NAO",
    distribuicaoCotasBolsas: "NAO",
    quotaDistributions: [createQuotaDistribution()],
    unidadeIds: [],
    existingAnexo: null,
  };
}

export function yesNoToBool(value: YesNo) {
  return value === "SIM";
}

export function boolToYesNo(value: boolean): YesNo {
  return value ? "SIM" : "NAO";
}

export function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDecimal(value: string) {
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatDecimal(value: number, fractionDigits: number) {
  return value.toFixed(fractionDigits).replace(".", ",");
}

export function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

export function toIsoDateTime(value: string) {
  if (!value) return value;
  if (value.includes("T")) return value;
  return `${value}T00:00:00.000Z`;
}

export function fileSignature(value: File) {
  return `${value.name}:${value.size}:${value.lastModified}:${value.type}`;
}

export function periodRangeError(
  start: string,
  end: string,
  message: string,
): string {
  if (!start || !end) return "";
  if (end < start) return message;
  return "";
}

export function hasPdfForPublish(
  file: File | null,
  existingAnexo: EditalAnexoMeta | null,
) {
  return Boolean(file) || Boolean(existingAnexo);
}

export function assertPdfFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Formato inválido. Envie um arquivo PDF.";
  }

  const maxMb = 25;
  const mb = file.size / (1024 * 1024);

  if (mb > maxMb) {
    return `Arquivo muito grande (${Math.round(mb)}MB). Limite: ${maxMb}MB.`;
  }

  return null;
}

function pushIf(errs: string[], condition: boolean, message: string) {
  if (condition) errs.push(message);
}

function collectDistribuicaoErrors(
  errs: string[],
  input: CreateCallValidationInput,
) {
  pushIf(
    errs,
    input.quotaDistributions.length === 0,
    "Adicione pelo menos uma distribuição de cotas.",
  );

  input.quotaDistributions.forEach((distribution, index) => {
    const label = `distribuição ${index + 1}`;

    pushIf(errs, !distribution.tipoBolsa, `Selecione o tipo da bolsa da ${label}.`);
    pushIf(
      errs,
      !distribution.quantidade.trim(),
      `Informe a quantidade de cotas da ${label}.`,
    );
    pushIf(
      errs,
      !distribution.fppiMin.trim(),
      `Informe o FPPI mínimo da ${label}.`,
    );
    pushIf(
      errs,
      !distribution.mediaMinProj.trim(),
      `Informe a média mínima dos projetos da ${label}.`,
    );
    pushIf(
      errs,
      parseInteger(distribution.quantidade) <= 0,
      `A quantidade de cotas da ${label} deve ser maior que zero.`,
    );
    pushIf(
      errs,
      parseDecimal(distribution.fppiMin) <= 0,
      `O FPPI mínimo da ${label} deve ser maior que zero.`,
    );
    pushIf(
      errs,
      parseDecimal(distribution.mediaMinProj) <= 0,
      `A média mínima dos projetos da ${label} deve ser maior que zero.`,
    );
  });
}

export function collectCreateErrors(
  input: CreateCallValidationInput,
): string[] {
  const errs: string[] = [];

  pushIf(errs, !input.editalYear.trim(), "Informe o ano do edital.");
  pushIf(errs, !input.descricao.trim(), "Informe a descrição do edital.");
  pushIf(
    errs,
    !input.submissionStart || !input.submissionEnd,
    "Informe o período de submissões.",
  );
  pushIf(errs, Boolean(input.submissionDateError), input.submissionDateError);
  pushIf(
    errs,
    !input.executionStart || !input.executionEnd,
    "Informe o período de execução do projeto.",
  );
  pushIf(errs, Boolean(input.executionDateError), input.executionDateError);
  pushIf(
    errs,
    !input.titulacaoMinima,
    "Informe a titulação mínima para solicitação de cotas.",
  );
  pushIf(errs, !input.periodoCota, "Selecione o período de cota.");
  pushIf(errs, !input.tipoEdital, "Selecione o tipo de edital.");
  pushIf(
    errs,
    !input.limiteProjetosOrientador.trim(),
    "Informe o limite de solicitações de projetos por orientador.",
  );
  pushIf(
    errs,
    !input.limitePlanosOrientador.trim(),
    "Informe o limite de planos de trabalho por orientador.",
  );
  pushIf(
    errs,
    parseInteger(input.limiteProjetosOrientador) < 0,
    "O limite de projetos não pode ser negativo.",
  );
  pushIf(
    errs,
    parseInteger(input.limitePlanosOrientador) < 0,
    "O limite de planos não pode ser negativo.",
  );

  if (input.distribuicaoCotasBolsas === "SIM") {
    collectDistribuicaoErrors(errs, input);
  }

  return errs;
}

function buildCotaRows(
  values: EditalFormValues,
): EditalCotaDistribuicaoPayload[] {
  if (values.distribuicaoCotasBolsas !== "SIM") return [];

  return values.quotaDistributions.map(distribution => ({
    id_bolsa: parseInteger(distribution.tipoBolsa),
    quantidade: parseInteger(distribution.quantidade),
    fppi_min: parseDecimal(distribution.fppiMin),
    media_min_proj: parseDecimal(distribution.mediaMinProj),
    exige_doutorado: values.titulacaoMinima === "DOUTORADO",
  }));
}

function buildSharedPayload(values: EditalFormValues) {
  return {
    descricao: values.descricao.trim(),
    ano: parseInteger(values.editalYear) || yearNow(),
    titulacao_min: values.titulacaoMinima as TitulacaoMin,
    tipo: values.tipoEdital as TipoEdital,
    limite_solicitacoes_orientador: parseInteger(
      values.limiteProjetosOrientador,
    ),
    cota_bolsa_id: parseInteger(values.periodoCota),
    limite_planos_orientador: parseInteger(values.limitePlanosOrientador),
    avaliacao_vigente: yesNoToBool(values.avaliacaoVigente),
    apenas_orient_coordena_plano: yesNoToBool(
      values.apenasCoordenadorOrientaPlano,
    ),
    tec_admin_coord_proj: yesNoToBool(
      values.tecnicoAdministrativoPodeCoordenar,
    ),
    divulgar_resultado: yesNoToBool(values.divulgarResultado),
    edital_para_voluntarios: yesNoToBool(values.editalVoluntarios),
    apenas_colab_vol_cadastra_plano: yesNoToBool(
      values.apenasColaboradorVoluntarioCadastraProjeto,
    ),
    prof_subst_cadastra_proj: yesNoToBool(
      values.professorSubstitutoCadastraProjeto,
    ),
    edital_cota_distribuicao: buildCotaRows(values),
    periodo_submissao: {
      inicio: toIsoDateTime(values.submissionStart),
      fim: toIsoDateTime(values.submissionEnd),
    },
    periodo_execucao: {
      inicio: toIsoDateTime(values.executionStart),
      fim: toIsoDateTime(values.executionEnd),
    },
  };
}

export function buildCreatePayload(
  values: EditalFormValues,
  nextStatus: StatusInicialEdital,
): CreateEditalPayload {
  return {
    codigo: values.code.trim() || undefined,
    status: nextStatus,
    ...buildSharedPayload(values),
  };
}

export function buildUpdatePayload(
  values: EditalFormValues,
  nextStatus: StatusEdital,
): UpdateEditalPayload {
  return {
    codigo: values.code.trim(),
    status: nextStatus,
    ...buildSharedPayload(values),
  };
}

export function hydrateEditalForm(edital: Edital): EditalFormValues {
  return {
    savedEditalId: edital.id,
    status: edital.status,
    editalYear: String(edital.ano),
    code: edital.codigo ?? "",
    descricao: edital.descricao,
    submissionStart: toDateInput(edital.periodo_submissoes.inicio),
    submissionEnd: toDateInput(edital.periodo_submissoes.fim),
    executionStart: toDateInput(edital.periodo_execucao_rel.inicio),
    executionEnd: toDateInput(edital.periodo_execucao_rel.fim),
    titulacaoMinima: edital.titulacao_min,
    periodoCota: String(edital.cota_bolsa?.id ?? ""),
    tipoEdital: edital.tipo,
    limiteProjetosOrientador: String(edital.limite_solicitacoes_orientador),
    limitePlanosOrientador: String(edital.limite_planos_orientador),
    editalVoluntarios: boolToYesNo(edital.edital_para_voluntarios),
    avaliacaoVigente: boolToYesNo(edital.avaliacao_vigente),
    apenasCoordenadorOrientaPlano: boolToYesNo(
      edital.apenas_orient_coordena_plano,
    ),
    apenasColaboradorVoluntarioCadastraProjeto: boolToYesNo(
      edital.apenas_colab_vol_cadastra_plano,
    ),
    professorSubstitutoCadastraProjeto: boolToYesNo(
      edital.prof_subst_cadastra_proj,
    ),
    tecnicoAdministrativoPodeCoordenar: boolToYesNo(
      edital.tec_admin_coord_proj,
    ),
    divulgarResultado: boolToYesNo(edital.divulgar_resultado),
    distribuicaoCotasBolsas:
      edital.edital_cota_distribuicao.length > 0 ? "SIM" : "NAO",
    quotaDistributions:
      edital.edital_cota_distribuicao.length > 0
        ? edital.edital_cota_distribuicao.map(row =>
            createQuotaDistribution({
              tipoBolsa: String(row.id_bolsa),
              quantidade: String(row.quantidade),
              fppiMin: formatDecimal(row.fppi_min, 2),
              mediaMinProj: formatDecimal(row.media_min_proj, 1),
            }),
          )
        : [createQuotaDistribution()],
    unidadeIds: edital.unidade_ids ?? [],
    existingAnexo: edital.anexo ?? null,
  };
}

export function validationInputFromValues(
  values: EditalFormValues,
  submissionDateError: string,
  executionDateError: string,
): CreateCallValidationInput {
  return {
    editalYear: values.editalYear,
    descricao: values.descricao,
    submissionStart: values.submissionStart,
    submissionEnd: values.submissionEnd,
    submissionDateError,
    executionStart: values.executionStart,
    executionEnd: values.executionEnd,
    executionDateError,
    titulacaoMinima: values.titulacaoMinima,
    periodoCota: values.periodoCota,
    tipoEdital: values.tipoEdital,
    limiteProjetosOrientador: values.limiteProjetosOrientador,
    limitePlanosOrientador: values.limitePlanosOrientador,
    distribuicaoCotasBolsas: values.distribuicaoCotasBolsas,
    quotaDistributions: values.quotaDistributions,
  };
}
