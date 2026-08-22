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
  categoria: string;
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
  tipoBolsa: string;
  quantidadeCotas: string;
  fppiMinimo: string;
  mediaMinimaProjetos: string;
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
  categoria: string;
  limiteProjetosOrientador: string;
  limitePlanosOrientador: string;
  distribuicaoCotasBolsas: YesNo;
  tipoBolsa: string;
  quantidadeCotas: string;
  fppiMinimo: string;
  mediaMinimaProjetos: string;
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
    categoria: "",
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
    tipoBolsa: "",
    quantidadeCotas: "0",
    fppiMinimo: "0,00",
    mediaMinimaProjetos: "0,0",
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
  pushIf(errs, !input.tipoBolsa, "Selecione o tipo da bolsa.");
  pushIf(errs, !input.quantidadeCotas.trim(), "Informe a quantidade de cotas.");
  pushIf(errs, !input.fppiMinimo.trim(), "Informe o FPPI mínimo.");
  pushIf(
    errs,
    !input.mediaMinimaProjetos.trim(),
    "Informe a média mínima dos projetos.",
  );
  pushIf(
    errs,
    parseInteger(input.quantidadeCotas) < 0,
    "A quantidade de cotas não pode ser negativa.",
  );
  pushIf(
    errs,
    parseDecimal(input.fppiMinimo) < 0,
    "O FPPI mínimo não pode ser negativo.",
  );
  pushIf(
    errs,
    parseDecimal(input.mediaMinimaProjetos) < 0,
    "A média mínima dos projetos não pode ser negativa.",
  );
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
  pushIf(errs, !input.categoria, "Selecione a categoria do edital.");
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

  return [
    {
      id_bolsa: parseInteger(values.tipoBolsa),
      quantidade: parseInteger(values.quantidadeCotas),
      fppi_min: parseDecimal(values.fppiMinimo),
      media_min_proj: parseDecimal(values.mediaMinimaProjetos),
      exige_doutorado: values.titulacaoMinima === "DOUTORADO",
    },
  ];
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
    categoria_id: parseInteger(values.categoria),
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
  const row = edital.edital_cota_distribuicao[0];

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
    categoria: String(edital.categoria.id),
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
    distribuicaoCotasBolsas: row ? "SIM" : "NAO",
    tipoBolsa: row ? String(row.id_bolsa) : "",
    quantidadeCotas: row ? String(row.quantidade) : "0",
    fppiMinimo: row ? formatDecimal(row.fppi_min, 2) : "0,00",
    mediaMinimaProjetos: row ? formatDecimal(row.media_min_proj, 1) : "0,0",
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
    categoria: values.categoria,
    limiteProjetosOrientador: values.limiteProjetosOrientador,
    limitePlanosOrientador: values.limitePlanosOrientador,
    distribuicaoCotasBolsas: values.distribuicaoCotasBolsas,
    tipoBolsa: values.tipoBolsa,
    quantidadeCotas: values.quantidadeCotas,
    fppiMinimo: values.fppiMinimo,
    mediaMinimaProjetos: values.mediaMinimaProjetos,
  };
}
