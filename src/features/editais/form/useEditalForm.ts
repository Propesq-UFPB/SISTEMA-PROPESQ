import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { ApiError } from "@/services/apiClient";
import {
  scholarshipSettingsService,
  type ScholarshipLookup,
} from "@/features/settings/api/scholarshipSettingsService";
import {
  categorySettingsService,
  type CategoryLookup,
} from "@/features/settings/api/categorySettingsService";
import {
  academicUnitService,
  type AcademicUnitLookup,
} from "@/features/settings/api/academicUnitService";
import { editalService } from "@/features/editais/api/editalService";
import type {
  CotaBolsaLookup,
  Edital,
  EditalAnexoMeta,
  EditalStatusLookup,
  EditalTypeLookup,
  StatusEdital,
  StatusInicialEdital,
} from "@/features/editais/types/edital";
import {
  assertPdfFile,
  buildCreatePayload,
  buildUpdatePayload,
  collectCreateErrors,
  emptyEditalFormValues,
  fileSignature,
  hasPdfForPublish,
  hydrateEditalForm,
  periodRangeError,
  validationInputFromValues,
  yearNow,
  type EditalFormMode,
  type EditalFormValues,
  type YesNo,
} from "./editalFormLogic";

const DEFAULT_STATUS_OPTIONS: EditalStatusLookup[] = [
  { id: "RASCUNHO", name: "Rascunho" },
  { id: "PUBLICADO", name: "Publicado" },
  { id: "ENCERRADO", name: "Encerrado" },
  { id: "ARQUIVADO", name: "Arquivado" },
];

function apiErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

function submitFailureMessage(
  mode: EditalFormMode,
  nextStatus: StatusEdital,
): string {
  if (mode === "edit") return "Não foi possível salvar o edital.";
  if (nextStatus === "PUBLICADO") return "Não foi possível publicar o edital.";
  return "Não foi possível salvar o rascunho.";
}

function periodsComplete(
  submissionStart: string,
  submissionEnd: string,
  executionStart: string,
  executionEnd: string,
  submissionDateError: string,
  executionDateError: string,
): boolean {
  return (
    Boolean(submissionStart) &&
    Boolean(submissionEnd) &&
    Boolean(executionStart) &&
    Boolean(executionEnd) &&
    !submissionDateError &&
    !executionDateError
  );
}

async function loadLookupOptions<T>(
  fetch: () => Promise<T[]>,
  errorMessage: string,
  onSuccess: (rows: T[]) => void,
  onError: (message: string) => void,
) {
  try {
    onSuccess(await fetch());
  } catch (err) {
    onSuccess([]);
    onError(apiErrorMessage(err, errorMessage));
  }
}

function useLookupLoader<T>(
  fetch: () => Promise<T[]>,
  errorMessage: string,
) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef(fetch);

  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    await loadLookupOptions(fetchRef.current, errorMessage, setOptions, setError);
    setLoading(false);
  }, [errorMessage]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { options, loading, error, reload };
}

export type EditalFormModel = {
  mode: EditalFormMode;
  readOnly: boolean;
  fieldsLocked: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  file: File | null;
  fileError: string;
  existingAnexo: EditalAnexoMeta | null;
  fileName: string;
  fileSizeMb: number;
  hasPdf: boolean;
  editalYear: string;
  setEditalYear: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  descricao: string;
  setDescricao: (value: string) => void;
  submissionStart: string;
  setSubmissionStart: (value: string) => void;
  submissionEnd: string;
  setSubmissionEnd: (value: string) => void;
  executionStart: string;
  setExecutionStart: (value: string) => void;
  executionEnd: string;
  setExecutionEnd: (value: string) => void;
  submissionDateError: string;
  executionDateError: string;
  titulacaoMinima: string;
  setTitulacaoMinima: (value: string) => void;
  periodoCota: string;
  setPeriodoCota: (value: string) => void;
  tipoEdital: string;
  setTipoEdital: (value: string) => void;
  categoria: string;
  setCategoria: (value: string) => void;
  limiteProjetosOrientador: string;
  setLimiteProjetosOrientador: (value: string) => void;
  limitePlanosOrientador: string;
  setLimitePlanosOrientador: (value: string) => void;
  editalVoluntarios: YesNo;
  setEditalVoluntarios: (value: YesNo) => void;
  avaliacaoVigente: YesNo;
  setAvaliacaoVigente: (value: YesNo) => void;
  apenasCoordenadorOrientaPlano: YesNo;
  setApenasCoordenadorOrientaPlano: (value: YesNo) => void;
  apenasColaboradorVoluntarioCadastraProjeto: YesNo;
  setApenasColaboradorVoluntarioCadastraProjeto: (value: YesNo) => void;
  professorSubstitutoCadastraProjeto: YesNo;
  setProfessorSubstitutoCadastraProjeto: (value: YesNo) => void;
  tecnicoAdministrativoPodeCoordenar: YesNo;
  setTecnicoAdministrativoPodeCoordenar: (value: YesNo) => void;
  divulgarResultado: YesNo;
  setDivulgarResultado: (value: YesNo) => void;
  distribuicaoCotasBolsas: YesNo;
  setDistribuicaoCotasBolsas: (value: YesNo) => void;
  tipoBolsa: string;
  setTipoBolsa: (value: string) => void;
  quantidadeCotas: string;
  setQuantidadeCotas: (value: string) => void;
  fppiMinimo: string;
  setFppiMinimo: (value: string) => void;
  mediaMinimaProjetos: string;
  setMediaMinimaProjetos: (value: string) => void;
  bolsaOptions: ScholarshipLookup[];
  bolsaLoading: boolean;
  bolsaError: string | null;
  loadBolsaOptions: () => Promise<void>;
  cotaBolsaOptions: CotaBolsaLookup[];
  cotaBolsaLoading: boolean;
  cotaBolsaError: string | null;
  loadCotaBolsaOptions: () => Promise<void>;
  tipoEditalOptions: EditalTypeLookup[];
  tipoEditalLoading: boolean;
  tipoEditalError: string | null;
  loadTipoEditalOptions: () => Promise<void>;
  categoriaOptions: CategoryLookup[];
  categoriaLoading: boolean;
  categoriaError: string | null;
  loadCategoriaOptions: () => Promise<void>;
  unidadeOptions: AcademicUnitLookup[];
  unidadeLoading: boolean;
  unidadeError: string | null;
  loadUnidadeOptions: () => Promise<void>;
  unidadeIds: number[];
  status: StatusEdital;
  setStatus: (value: StatusEdital) => void;
  statusOptions: EditalStatusLookup[];
  savedEditalId: number | null;
  submitError: string | null;
  isSubmitting: boolean;
  canSaveDraft: boolean;
  canPublish: boolean;
  canSaveEdit: boolean;
  periodsOk: boolean;
  onPickFile: (file?: File | null) => void;
  previewPdf: () => Promise<void>;
  removeFile: () => void;
  autoCodeFromDescricao: () => void;
  toggleUnidade: (id: number) => void;
  saveDraft: () => void;
  publish: () => void;
  submitEdital: (nextStatus: StatusEdital) => Promise<void>;
};

export type EditalFormProps = {
  mode: EditalFormMode;
  initialEdital?: Edital;
  readOnly?: boolean;
  onCancel?: () => void;
  onSaved?: (result: {
    id: number;
    status: StatusEdital;
    created: boolean;
  }) => void;
};

export function useEditalForm({
  mode,
  initialEdital,
  readOnly = false,
  onSaved,
}: Readonly<EditalFormProps>): EditalFormModel {
  const seed = initialEdital
    ? hydrateEditalForm(initialEdital)
    : emptyEditalFormValues();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [existingAnexo, setExistingAnexo] = useState<EditalAnexoMeta | null>(
    seed.existingAnexo,
  );
  const fileName = file?.name ?? existingAnexo?.nome ?? "";

  const [editalYear, setEditalYear] = useState<string>(seed.editalYear);
  const [code, setCode] = useState(seed.code);
  const [descricao, setDescricao] = useState(seed.descricao);
  const [submissionStart, setSubmissionStart] = useState(seed.submissionStart);
  const [submissionEnd, setSubmissionEnd] = useState(seed.submissionEnd);
  const [executionStart, setExecutionStart] = useState(seed.executionStart);
  const [executionEnd, setExecutionEnd] = useState(seed.executionEnd);
  const [titulacaoMinima, setTitulacaoMinima] = useState(seed.titulacaoMinima);
  const [periodoCota, setPeriodoCota] = useState(seed.periodoCota);
  const [tipoEdital, setTipoEdital] = useState(seed.tipoEdital);
  const [categoria, setCategoria] = useState(seed.categoria);
  const [limiteProjetosOrientador, setLimiteProjetosOrientador] = useState(
    seed.limiteProjetosOrientador,
  );
  const [limitePlanosOrientador, setLimitePlanosOrientador] = useState(
    seed.limitePlanosOrientador,
  );
  const [editalVoluntarios, setEditalVoluntarios] = useState<YesNo>(
    seed.editalVoluntarios,
  );
  const [avaliacaoVigente, setAvaliacaoVigente] = useState<YesNo>(
    seed.avaliacaoVigente,
  );
  const [apenasCoordenadorOrientaPlano, setApenasCoordenadorOrientaPlano] =
    useState<YesNo>(seed.apenasCoordenadorOrientaPlano);
  const [
    apenasColaboradorVoluntarioCadastraProjeto,
    setApenasColaboradorVoluntarioCadastraProjeto,
  ] = useState<YesNo>(seed.apenasColaboradorVoluntarioCadastraProjeto);
  const [
    professorSubstitutoCadastraProjeto,
    setProfessorSubstitutoCadastraProjeto,
  ] = useState<YesNo>(seed.professorSubstitutoCadastraProjeto);
  const [
    tecnicoAdministrativoPodeCoordenar,
    setTecnicoAdministrativoPodeCoordenar,
  ] = useState<YesNo>(seed.tecnicoAdministrativoPodeCoordenar);
  const [divulgarResultado, setDivulgarResultado] = useState<YesNo>(
    seed.divulgarResultado,
  );
  const [distribuicaoCotasBolsas, setDistribuicaoCotasBolsas] = useState<YesNo>(
    seed.distribuicaoCotasBolsas,
  );
  const [tipoBolsa, setTipoBolsa] = useState(seed.tipoBolsa);
  const [quantidadeCotas, setQuantidadeCotas] = useState(seed.quantidadeCotas);
  const [fppiMinimo, setFppiMinimo] = useState(seed.fppiMinimo);
  const [mediaMinimaProjetos, setMediaMinimaProjetos] = useState(
    seed.mediaMinimaProjetos,
  );
  const [unidadeIds, setUnidadeIds] = useState<number[]>(seed.unidadeIds);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedEditalId, setSavedEditalId] = useState<number | null>(
    seed.savedEditalId,
  );
  const uploadedFileSignatureRef = useRef<string | null>(null);
  const [status, setStatus] = useState<StatusEdital>(seed.status);
  const [statusOptions, setStatusOptions] = useState<EditalStatusLookup[]>(
    DEFAULT_STATUS_OPTIONS,
  );

  const bolsaLoader = useLookupLoader(
    () => scholarshipSettingsService.lookup(),
    "Não foi possível carregar os tipos de bolsa.",
  );
  const cotaBolsaLoader = useLookupLoader(
    () => editalService.cotaBolsaLookup(),
    "Não foi possível carregar os períodos de cota.",
  );
  const tipoEditalLoader = useLookupLoader(
    () => editalService.typeLookup(),
    "Não foi possível carregar os tipos de edital.",
  );
  const categoriaLoader = useLookupLoader(
    () => categorySettingsService.lookup(),
    "Não foi possível carregar as categorias.",
  );
  const unidadeLoader = useLookupLoader(
    () => academicUnitService.lookup(),
    "Não foi possível carregar as unidades acadêmicas.",
  );

  useEffect(() => {
    if (mode !== "edit") return;
    let active = true;
    void editalService
      .statusLookup()
      .then(options => {
        if (active && options.length > 0) setStatusOptions(options);
      })
      .catch(() => {
        if (active) setStatusOptions(DEFAULT_STATUS_OPTIONS);
      });
    return () => {
      active = false;
    };
  }, [mode]);

  const fileSizeMb = useMemo(() => {
    if (!file) return 0;
    return Math.round((file.size / (1024 * 1024)) * 10) / 10;
  }, [file]);

  const submissionDateError = useMemo(
    () =>
      periodRangeError(
        submissionStart,
        submissionEnd,
        "O fim do período de submissões não pode ser anterior ao início.",
      ),
    [submissionStart, submissionEnd],
  );

  const executionDateError = useMemo(
    () =>
      periodRangeError(
        executionStart,
        executionEnd,
        "O fim do período de execução não pode ser anterior ao início.",
      ),
    [executionStart, executionEnd],
  );

  const createErrors = useMemo(
    () =>
      collectCreateErrors({
        editalYear,
        descricao,
        submissionStart,
        submissionEnd,
        submissionDateError,
        executionStart,
        executionEnd,
        executionDateError,
        titulacaoMinima,
        periodoCota,
        tipoEdital,
        categoria,
        limiteProjetosOrientador,
        limitePlanosOrientador,
        distribuicaoCotasBolsas,
        tipoBolsa,
        quantidadeCotas,
        fppiMinimo,
        mediaMinimaProjetos,
      }),
    [
      editalYear,
      descricao,
      submissionStart,
      submissionEnd,
      submissionDateError,
      executionStart,
      executionEnd,
      executionDateError,
      titulacaoMinima,
      periodoCota,
      tipoEdital,
      categoria,
      limiteProjetosOrientador,
      limitePlanosOrientador,
      distribuicaoCotasBolsas,
      tipoBolsa,
      quantidadeCotas,
      fppiMinimo,
      mediaMinimaProjetos,
    ],
  );

  const hasPdf = hasPdfForPublish(file, existingAnexo);
  const fieldsLocked = readOnly;
  const requiredErrors = hasPdf
    ? createErrors
    : [...createErrors, "Faça upload do PDF do edital."];
  const canSaveDraft =
    createErrors.length === 0 && !isSubmitting && !fieldsLocked;
  const canPublish =
    requiredErrors.length === 0 && !isSubmitting && !fieldsLocked;
  const canSaveEdit =
    createErrors.length === 0 &&
    !isSubmitting &&
    !fieldsLocked &&
    (status !== "PUBLICADO" || hasPdf);
  const periodsOk = periodsComplete(
    submissionStart,
    submissionEnd,
    executionStart,
    executionEnd,
    submissionDateError,
    executionDateError,
  );

  const currentValues = useCallback((): EditalFormValues => {
    return {
      savedEditalId,
      status,
      editalYear,
      code,
      descricao,
      submissionStart,
      submissionEnd,
      executionStart,
      executionEnd,
      titulacaoMinima,
      periodoCota,
      tipoEdital,
      categoria,
      limiteProjetosOrientador,
      limitePlanosOrientador,
      editalVoluntarios,
      avaliacaoVigente,
      apenasCoordenadorOrientaPlano,
      apenasColaboradorVoluntarioCadastraProjeto,
      professorSubstitutoCadastraProjeto,
      tecnicoAdministrativoPodeCoordenar,
      divulgarResultado,
      distribuicaoCotasBolsas,
      tipoBolsa,
      quantidadeCotas,
      fppiMinimo,
      mediaMinimaProjetos,
      unidadeIds,
      existingAnexo,
    };
  }, [
    savedEditalId,
    status,
    editalYear,
    code,
    descricao,
    submissionStart,
    submissionEnd,
    executionStart,
    executionEnd,
    titulacaoMinima,
    periodoCota,
    tipoEdital,
    categoria,
    limiteProjetosOrientador,
    limitePlanosOrientador,
    editalVoluntarios,
    avaliacaoVigente,
    apenasCoordenadorOrientaPlano,
    apenasColaboradorVoluntarioCadastraProjeto,
    professorSubstitutoCadastraProjeto,
    tecnicoAdministrativoPodeCoordenar,
    divulgarResultado,
    distribuicaoCotasBolsas,
    tipoBolsa,
    quantidadeCotas,
    fppiMinimo,
    mediaMinimaProjetos,
    unidadeIds,
    existingAnexo,
  ]);

  const submitEdital = useCallback(
    async (nextStatus: StatusEdital) => {
      const values = { ...currentValues(), status: nextStatus };
      const errors = collectCreateErrors(
        validationInputFromValues(
          values,
          submissionDateError,
          executionDateError,
        ),
      );

      if (nextStatus === "PUBLICADO" && !hasPdfForPublish(file, existingAnexo)) {
        errors.push("Faça upload do PDF do edital.");
      }

      if (errors.length > 0) {
        setSubmitError(errors[0]);
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const created = savedEditalId === null;
        let editalId = savedEditalId;

        if (editalId === null) {
          const edital = await editalService.create(
            buildCreatePayload(values, nextStatus as StatusInicialEdital),
          );
          editalId = edital.id;
          setSavedEditalId(editalId);
        } else {
          await editalService.update(
            editalId,
            buildUpdatePayload(values, nextStatus),
          );
        }

        if (file) {
          const signature = fileSignature(file);

          if (uploadedFileSignatureRef.current !== signature) {
            const uploaded = await editalService.uploadAttachment(editalId, file);
            uploadedFileSignatureRef.current = signature;
            setExistingAnexo({
              id: uploaded.id,
              nome: uploaded.nome,
              tipo: uploaded.tipo,
            });
          }
        }

        await editalService.setAcademicUnits(editalId, unidadeIds);

        setStatus(nextStatus);
        onSaved?.({ id: editalId, status: nextStatus, created });
      } catch (err) {
        setSubmitError(
          apiErrorMessage(err, submitFailureMessage(mode, nextStatus)),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      currentValues,
      submissionDateError,
      executionDateError,
      file,
      existingAnexo,
      savedEditalId,
      unidadeIds,
      mode,
      onSaved,
    ],
  );

  const onPickFile = useCallback((picked?: File | null) => {
    setFileError("");

    if (!picked) {
      setFile(null);
      return;
    }

    const invalid = assertPdfFile(picked);
    if (invalid) {
      setFile(null);
      setFileError(invalid);
      return;
    }

    setFile(picked);
  }, []);

  const previewPdf = useCallback(async () => {
    try {
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        return;
      }

      if (savedEditalId === null) {
        setFileError("Selecione um PDF ou salve o edital com anexo primeiro.");
        return;
      }

      const blob = await editalService.getAnexo(savedEditalId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setFileError(
        apiErrorMessage(err, "Não foi possível visualizar o PDF do edital."),
      );
    }
  }, [file, savedEditalId]);

  const removeFile = useCallback(() => {
    setFile(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const autoCodeFromDescricao = useCallback(() => {
    const y = editalYear?.trim() || String(yearNow());

    const clean = descricao
      .trim()
      .toUpperCase()
      .replace(/[^\p{L}\p{N}]+/gu, "_")
      .replace(/^_/, "")
      .replace(/_$/, "");

    setCode(`${clean}_${y}`.slice(0, 40));
  }, [editalYear, descricao]);

  const toggleUnidade = useCallback((id: number) => {
    setUnidadeIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  }, []);

  const saveDraft = useCallback(() => {
    void submitEdital("RASCUNHO");
  }, [submitEdital]);

  const publish = useCallback(() => {
    void submitEdital("PUBLICADO");
  }, [submitEdital]);

  return {
    mode,
    readOnly,
    fieldsLocked,
    inputRef,
    file,
    fileError,
    existingAnexo,
    fileName,
    fileSizeMb,
    hasPdf,
    editalYear,
    setEditalYear,
    code,
    setCode,
    descricao,
    setDescricao,
    submissionStart,
    setSubmissionStart,
    submissionEnd,
    setSubmissionEnd,
    executionStart,
    setExecutionStart,
    executionEnd,
    setExecutionEnd,
    submissionDateError,
    executionDateError,
    titulacaoMinima,
    setTitulacaoMinima,
    periodoCota,
    setPeriodoCota,
    tipoEdital,
    setTipoEdital,
    categoria,
    setCategoria,
    limiteProjetosOrientador,
    setLimiteProjetosOrientador,
    limitePlanosOrientador,
    setLimitePlanosOrientador,
    editalVoluntarios,
    setEditalVoluntarios,
    avaliacaoVigente,
    setAvaliacaoVigente,
    apenasCoordenadorOrientaPlano,
    setApenasCoordenadorOrientaPlano,
    apenasColaboradorVoluntarioCadastraProjeto,
    setApenasColaboradorVoluntarioCadastraProjeto,
    professorSubstitutoCadastraProjeto,
    setProfessorSubstitutoCadastraProjeto,
    tecnicoAdministrativoPodeCoordenar,
    setTecnicoAdministrativoPodeCoordenar,
    divulgarResultado,
    setDivulgarResultado,
    distribuicaoCotasBolsas,
    setDistribuicaoCotasBolsas,
    tipoBolsa,
    setTipoBolsa,
    quantidadeCotas,
    setQuantidadeCotas,
    fppiMinimo,
    setFppiMinimo,
    mediaMinimaProjetos,
    setMediaMinimaProjetos,
    bolsaOptions: bolsaLoader.options,
    bolsaLoading: bolsaLoader.loading,
    bolsaError: bolsaLoader.error,
    loadBolsaOptions: bolsaLoader.reload,
    cotaBolsaOptions: cotaBolsaLoader.options,
    cotaBolsaLoading: cotaBolsaLoader.loading,
    cotaBolsaError: cotaBolsaLoader.error,
    loadCotaBolsaOptions: cotaBolsaLoader.reload,
    tipoEditalOptions: tipoEditalLoader.options,
    tipoEditalLoading: tipoEditalLoader.loading,
    tipoEditalError: tipoEditalLoader.error,
    loadTipoEditalOptions: tipoEditalLoader.reload,
    categoriaOptions: categoriaLoader.options,
    categoriaLoading: categoriaLoader.loading,
    categoriaError: categoriaLoader.error,
    loadCategoriaOptions: categoriaLoader.reload,
    unidadeOptions: unidadeLoader.options,
    unidadeLoading: unidadeLoader.loading,
    unidadeError: unidadeLoader.error,
    loadUnidadeOptions: unidadeLoader.reload,
    unidadeIds,
    status,
    setStatus,
    statusOptions,
    savedEditalId,
    submitError,
    isSubmitting,
    canSaveDraft,
    canPublish,
    canSaveEdit,
    periodsOk,
    onPickFile,
    previewPdf,
    removeFile,
    autoCodeFromDescricao,
    toggleUnidade,
    saveDraft,
    publish,
    submitEdital,
  };
}
