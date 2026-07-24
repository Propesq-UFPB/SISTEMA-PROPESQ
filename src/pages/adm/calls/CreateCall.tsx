import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  CalendarRange,
  Save,
  X,
  Check,
  Info,
  Eye,
  Clock,
  RotateCcw,
  GraduationCap,
  Layers,
  Users,
  SlidersHorizontal,
  ListChecks,
} from "lucide-react";
import { ApiError } from "@/services/apiClient";
import {
  scholarshipSettingsService,
  type ScholarshipLookup,
} from "@/features/settings/api/scholarshipSettingsService";
import {
  editalService,
  type CotaBolsaLookup,
  type CreateEditalPayload,
  type EditalTypeLookup,
  type StatusInicialEdital,
  type TipoEdital,
  type TitulacaoMin,
} from "@/features/editais";
import {
  categorySettingsService,
  type CategoryLookup,
} from "@/features/settings/api/categorySettingsService";

type YesNo = "SIM" | "NAO";

function yearNow() {
  return new Date().getFullYear();
}

function yesNoToBool(value: YesNo) {
  return value === "SIM";
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDecimal(value: string) {
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIsoDateTime(value: string) {
  if (!value) return value;
  if (value.includes("T")) return value;
  return `${value}T00:00:00.000Z`;
}

function fileSignature(value: File) {
  return `${value.name}:${value.size}:${value.lastModified}:${value.type}`;
}

function apiErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

type YesNoFieldProps = Readonly<{
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}>;

// Small reusable Sim/Não radio field, mirroring the legacy SIGAA widget.
function YesNoField({ label, value, onChange }: YesNoFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-neutral-light last:border-b-0">
      <span className="text-sm text-primary">
        {label} <span className="text-red-500">*</span>
      </span>

      <div className="flex items-center gap-4 shrink-0">
        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={value === "SIM"}
            onChange={() => onChange("SIM")}
            className="accent-primary"
          />
          Sim
        </label>

        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={value === "NAO"}
            onChange={() => onChange("NAO")}
            className="accent-primary"
          />
          Não
        </label>
      </div>
    </div>
  );
}

export default function CreateCall() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ===== File =====
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const fileName = file?.name ?? "";

  // ===== Dados do Edital (required) =====
  const [editalYear, setEditalYear] = useState<string>(String(yearNow())); // Ano do Edital *
  const [code, setCode] = useState(""); // Código (não obrigatório)
  const [descricao, setDescricao] = useState(""); // Descrição *

  const [submissionStart, setSubmissionStart] = useState(""); // Período de Submissões *
  const [submissionEnd, setSubmissionEnd] = useState("");

  const [executionStart, setExecutionStart] = useState(""); // Período de Execução do Projeto *
  const [executionEnd, setExecutionEnd] = useState("");

  const [titulacaoMinima, setTitulacaoMinima] = useState(""); // Titulação mínima para solicitação de cotas *
  const [periodoCota, setPeriodoCota] = useState(""); // Período de Cota *
  const [tipoEdital, setTipoEdital] = useState("PESQUISA"); // Tipo Edital *
  const [categoria, setCategoria] = useState(""); // Categoria *

  const [limiteProjetosOrientador, setLimiteProjetosOrientador] = useState("0"); // *
  const [limitePlanosOrientador, setLimitePlanosOrientador] = useState("0"); // *

  // ===== Regras do Edital (Sim/Não, todos obrigatórios) =====
  const [editalVoluntarios, setEditalVoluntarios] = useState<YesNo>("NAO");
  const [avaliacaoVigente, setAvaliacaoVigente] = useState<YesNo>("NAO");
  const [apenasCoordenadorOrientaPlano, setApenasCoordenadorOrientaPlano] =
    useState<YesNo>("NAO");
  const [
    apenasColaboradorVoluntarioCadastraProjeto,
    setApenasColaboradorVoluntarioCadastraProjeto,
  ] = useState<YesNo>("NAO");
  const [
    professorSubstitutoCadastraProjeto,
    setProfessorSubstitutoCadastraProjeto,
  ] = useState<YesNo>("NAO");
  const [
    tecnicoAdministrativoPodeCoordenar,
    setTecnicoAdministrativoPodeCoordenar,
  ] = useState<YesNo>("NAO");
  const [distribuicaoCotasBolsas, setDistribuicaoCotasBolsas] =
    useState<YesNo>("NAO");

  // ===== Parâmetros da Distribuição de Cotas (obrigatórios, somente se Distribuição = Sim) =====
  const [tipoBolsa, setTipoBolsa] = useState("");
  const [quantidadeCotas, setQuantidadeCotas] = useState("0");
  const [fppiMinimo, setFppiMinimo] = useState("0,00");
  const [mediaMinimaProjetos, setMediaMinimaProjetos] = useState("0,0");

  const [bolsaOptions, setBolsaOptions] = useState<ScholarshipLookup[]>([]);
  const [bolsaLoading, setBolsaLoading] = useState(true);
  const [bolsaError, setBolsaError] = useState<string | null>(null);

  const [cotaBolsaOptions, setCotaBolsaOptions] = useState<CotaBolsaLookup[]>(
    [],
  );
  const [cotaBolsaLoading, setCotaBolsaLoading] = useState(true);
  const [cotaBolsaError, setCotaBolsaError] = useState<string | null>(null);

  const [tipoEditalOptions, setTipoEditalOptions] = useState<
    EditalTypeLookup[]
  >([]);
  const [tipoEditalLoading, setTipoEditalLoading] = useState(true);
  const [tipoEditalError, setTipoEditalError] = useState<string | null>(null);

  const [categoriaOptions, setCategoriaOptions] = useState<CategoryLookup[]>(
    [],
  );
  const [categoriaLoading, setCategoriaLoading] = useState(true);
  const [categoriaError, setCategoriaError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedEditalId, setSavedEditalId] = useState<number | null>(null);
  const uploadedFileSignatureRef = useRef<string | null>(null);

  // ===== Status =====
  const [status, setStatus] = useState<StatusInicialEdital>("RASCUNHO");

  const loadBolsaOptions = useCallback(async () => {
    setBolsaLoading(true);
    setBolsaError(null);

    try {
      const rows = await scholarshipSettingsService.lookup();
      setBolsaOptions(rows);
    } catch (err) {
      setBolsaOptions([]);
      setBolsaError(
        apiErrorMessage(err, "Não foi possível carregar os tipos de bolsa."),
      );
    } finally {
      setBolsaLoading(false);
    }
  }, []);

  const loadCotaBolsaOptions = useCallback(async () => {
    setCotaBolsaLoading(true);
    setCotaBolsaError(null);

    try {
      const rows = await editalService.cotaBolsaLookup();
      setCotaBolsaOptions(rows);
    } catch (err) {
      setCotaBolsaOptions([]);
      setCotaBolsaError(
        apiErrorMessage(err, "Não foi possível carregar os períodos de cota."),
      );
    } finally {
      setCotaBolsaLoading(false);
    }
  }, []);

  const loadTipoEditalOptions = useCallback(async () => {
    setTipoEditalLoading(true);
    setTipoEditalError(null);

    try {
      const rows = await editalService.typeLookup();
      setTipoEditalOptions(rows);
    } catch (err) {
      setTipoEditalOptions([]);
      setTipoEditalError(
        apiErrorMessage(err, "Não foi possível carregar os tipos de edital."),
      );
    } finally {
      setTipoEditalLoading(false);
    }
  }, []);

  const loadCategoriaOptions = useCallback(async () => {
    setCategoriaLoading(true);
    setCategoriaError(null);

    try {
      const rows = await categorySettingsService.lookup();
      setCategoriaOptions(rows);
    } catch (err) {
      setCategoriaOptions([]);
      setCategoriaError(
        apiErrorMessage(err, "Não foi possível carregar as categorias."),
      );
    } finally {
      setCategoriaLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBolsaOptions();
    void loadCotaBolsaOptions();
    void loadTipoEditalOptions();
    void loadCategoriaOptions();
  }, [
    loadBolsaOptions,
    loadCotaBolsaOptions,
    loadTipoEditalOptions,
    loadCategoriaOptions,
  ]);

  // ===== Derived =====
  const fileSizeMb = useMemo(() => {
    if (!file) return 0;
    return Math.round((file.size / (1024 * 1024)) * 10) / 10;
  }, [file]);

  const submissionDateError = useMemo(() => {
    if (!submissionStart || !submissionEnd) return "";
    if (submissionEnd < submissionStart)
      return "O fim do período de submissões não pode ser anterior ao início.";
    return "";
  }, [submissionStart, submissionEnd]);

  const executionDateError = useMemo(() => {
    if (!executionStart || !executionEnd) return "";
    if (executionEnd < executionStart)
      return "O fim do período de execução não pode ser anterior ao início.";
    return "";
  }, [executionStart, executionEnd]);

  const createErrors = useMemo(() => {
    const errs: string[] = [];

    if (!editalYear.trim()) errs.push("Informe o ano do edital.");
    if (!descricao.trim()) errs.push("Informe a descrição do edital.");
    if (!submissionStart || !submissionEnd)
      errs.push("Informe o período de submissões.");
    if (submissionDateError) errs.push(submissionDateError);
    if (!executionStart || !executionEnd)
      errs.push("Informe o período de execução do projeto.");
    if (executionDateError) errs.push(executionDateError);
    if (!titulacaoMinima)
      errs.push("Informe a titulação mínima para solicitação de cotas.");
    if (!periodoCota) errs.push("Selecione o período de cota.");
    if (!tipoEdital) errs.push("Selecione o tipo de edital.");
    if (!categoria) errs.push("Selecione a categoria do edital.");
    if (!limiteProjetosOrientador.trim())
      errs.push("Informe o limite de solicitações de projetos por orientador.");
    if (!limitePlanosOrientador.trim())
      errs.push("Informe o limite de planos de trabalho por orientador.");
    if (parseInteger(limiteProjetosOrientador) < 0)
      errs.push("O limite de projetos não pode ser negativo.");
    if (parseInteger(limitePlanosOrientador) < 0)
      errs.push("O limite de planos não pode ser negativo.");

    if (distribuicaoCotasBolsas === "SIM") {
      if (!tipoBolsa) errs.push("Selecione o tipo da bolsa.");
      if (!quantidadeCotas.trim()) errs.push("Informe a quantidade de cotas.");
      if (!fppiMinimo.trim()) errs.push("Informe o FPPI mínimo.");
      if (!mediaMinimaProjetos.trim())
        errs.push("Informe a média mínima dos projetos.");
      if (parseInteger(quantidadeCotas) < 0)
        errs.push("A quantidade de cotas não pode ser negativa.");
      if (parseDecimal(fppiMinimo) < 0)
        errs.push("O FPPI mínimo não pode ser negativo.");
      if (parseDecimal(mediaMinimaProjetos) < 0)
        errs.push("A média mínima dos projetos não pode ser negativa.");
    }

    return errs;
  }, [
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
  ]);

  const requiredErrors = useMemo(() => {
    if (file) return createErrors;
    return [...createErrors, "Faça upload do PDF do edital."];
  }, [createErrors, file]);

  const canSaveDraft =
    createErrors.length === 0 &&
    !isSubmitting &&
    status !== "PUBLICADO";
  const canPublish =
    requiredErrors.length === 0 &&
    !isSubmitting &&
    status !== "PUBLICADO";

  function buildPayload(nextStatus: StatusInicialEdital): CreateEditalPayload {
    return {
      codigo: code.trim() || undefined,
      descricao: descricao.trim(),
      status: nextStatus,
      titulacao_min: titulacaoMinima as TitulacaoMin,
      tipo: tipoEdital as TipoEdital,
      limite_solicitacoes_orientador: parseInteger(limiteProjetosOrientador),
      cota_bolsa_id: parseInteger(periodoCota),
      limite_planos_orientador: parseInteger(limitePlanosOrientador),
      avaliacao_vigente: yesNoToBool(avaliacaoVigente),
      apenas_orient_coordena_plano: yesNoToBool(apenasCoordenadorOrientaPlano),
      tec_admin_coord_proj: yesNoToBool(tecnicoAdministrativoPodeCoordenar),
      divulgar_resultado: false,
      categoria_id: parseInteger(categoria),
      edital_cota_distribuicao:
        distribuicaoCotasBolsas === "SIM"
          ? [
              {
                quantidade: parseInteger(quantidadeCotas),
                fppi_min: parseDecimal(fppiMinimo),
                media_min_proj: parseDecimal(mediaMinimaProjetos),
                exige_doutorado: titulacaoMinima === "DOUTORADO",
              },
            ]
          : [],
      periodo_submissao: {
        inicio: toIsoDateTime(submissionStart),
        fim: toIsoDateTime(submissionEnd),
      },
      periodo_execucao: {
        inicio: toIsoDateTime(executionStart),
        fim: toIsoDateTime(executionEnd),
      },
    };
  }

  async function submitEdital(nextStatus: StatusInicialEdital) {
    const errors =
      nextStatus === "PUBLICADO" ? requiredErrors : createErrors;

    if (errors.length > 0) {
      setSubmitError(errors[0]);
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const isExistingEdital = savedEditalId !== null;
      const updatePayload = {
        titulo: descricao.trim(),
        periodo_execucao: {
          inicio: toIsoDateTime(executionStart),
          fim: toIsoDateTime(executionEnd),
        },
        status: nextStatus,
      };
      let editalId = savedEditalId;

      if (editalId === null) {
        const edital = await editalService.create(buildPayload(nextStatus));
        editalId = edital.id;
        setSavedEditalId(editalId);
      } else if (nextStatus === "RASCUNHO") {
        await editalService.update(editalId, updatePayload);
      }

      if (file) {
        const signature = fileSignature(file);

        if (uploadedFileSignatureRef.current !== signature) {
          await editalService.uploadAttachment(editalId, file);
          uploadedFileSignatureRef.current = signature;
        }
      }

      if (isExistingEdital && nextStatus === "PUBLICADO") {
        await editalService.update(editalId, updatePayload);
      }

      setStatus(nextStatus);
      setSuccessMessage(
        nextStatus === "PUBLICADO"
          ? !isExistingEdital
            ? "Edital cadastrado e publicado com sucesso."
            : "Edital publicado com sucesso."
          : !isExistingEdital
            ? "Rascunho cadastrado com sucesso. A publicação nesta aba reutilizará este registro."
            : "Rascunho atualizado com sucesso.",
      );
    } catch (err) {
      setSubmitError(
        apiErrorMessage(
          err,
          nextStatus === "PUBLICADO"
            ? "Não foi possível publicar o edital."
            : "Não foi possível salvar o rascunho.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ===== Handlers =====
  function onPickFile(f?: File | null) {
    setFileError("");

    if (!f) {
      setFile(null);
      return;
    }

    if (f.type !== "application/pdf") {
      setFile(null);
      setFileError("Formato inválido. Envie um arquivo PDF.");
      return;
    }

    const maxMb = 25;
    const mb = f.size / (1024 * 1024);

    if (mb > maxMb) {
      setFile(null);
      setFileError(
        `Arquivo muito grande (${Math.round(mb)}MB). Limite: ${maxMb}MB.`,
      );
      return;
    }

    setFile(f);
  }

  function removeFile() {
    setFile(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function autoCodeFromDescricao() {
    const y = editalYear?.trim() || String(yearNow());

    const clean = descricao
      .trim()
      .toUpperCase()
      .replace(/[^\p{L}\p{N}]+/gu, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    setCode(`${clean}_${y}`.slice(0, 40));
  }

  function saveDraft() {
    void submitEdital("RASCUNHO");
  }

  function publish() {
    void submitEdital("PUBLICADO");
  }

  function resetForm() {
    setFile(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";

    setEditalYear(String(yearNow()));
    setCode("");
    setDescricao("");
    setSubmissionStart("");
    setSubmissionEnd("");
    setExecutionStart("");
    setExecutionEnd("");
    setTitulacaoMinima("");
    setPeriodoCota("");
    setTipoEdital("PESQUISA");
    setCategoria("");
    setLimiteProjetosOrientador("0");
    setLimitePlanosOrientador("0");

    setEditalVoluntarios("NAO");
    setAvaliacaoVigente("NAO");
    setApenasCoordenadorOrientaPlano("NAO");
    setApenasColaboradorVoluntarioCadastraProjeto("NAO");
    setProfessorSubstitutoCadastraProjeto("NAO");
    setTecnicoAdministrativoPodeCoordenar("NAO");
    setDistribuicaoCotasBolsas("NAO");

    setTipoBolsa("");
    setQuantidadeCotas("0");
    setFppiMinimo("0,00");
    setMediaMinimaProjetos("0,0");

    setStatus("RASCUNHO");
    setSavedEditalId(null);
    uploadedFileSignatureRef.current = null;
    setSubmitError(null);
    setSuccessMessage(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Criar Edital • PROPESQ</title>
      </Helmet>

      {/* ===== Header ===== */}
      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">Criar Edital</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Registre um novo edital, envie o PDF oficial e informe os campos
                obrigatórios do cadastro para controle de cotas, vigência,
                publicação e acompanhamento administrativo.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-neutral-light text-primary hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw size={16} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* ===== Progresso / Estado ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Status do registro
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border
              ${
                status === "PUBLICADO"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-neutral-50 text-neutral border-neutral-light"
              }`}
          >
            {status === "PUBLICADO" ? <Check size={14} /> : <Info size={14} />}
            {status === "PUBLICADO" ? "Publicado" : "Rascunho"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">PDF</p>
            <p className="text-sm font-semibold text-primary">
              {file ? "OK" : "Pendente"}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Descrição</p>
            <p className="text-sm font-semibold text-primary">
              {descricao.trim() ? "OK" : "Pendente"}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Ano do Edital</p>
            <p className="text-sm font-semibold text-primary">
              {editalYear.trim() ? "OK" : "Pendente"}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Períodos</p>
            <p className="text-sm font-semibold text-primary">
              {submissionStart &&
              submissionEnd &&
              executionStart &&
              executionEnd &&
              !submissionDateError &&
              !executionDateError
                ? "OK"
                : "Pendente"}
            </p>
          </div>
        </div>

      </section>

      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-6">
        {/* ===== Upload PDF ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={18} />
            <h2 className="text-sm font-semibold text-primary">
              PDF do Edital
            </h2>
          </div>

          <div className="rounded-lg border border-dashed border-neutral-light p-6">
            <label className="block text-sm text-neutral cursor-pointer">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />

              <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-light/60">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-primary">
                      {file
                        ? "PDF selecionado"
                        : "Clique para selecionar o PDF"}
                    </p>

                    <p className="text-xs text-neutral mt-1">
                      {file
                        ? `${fileName} • ${fileSizeMb}MB`
                        : "Somente PDF • limite sugerido: 25MB"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file && (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
                        onClick={() =>
                          alert(
                            "Preview (placeholder). Aqui você pode abrir o PDF em um viewer.",
                          )
                        }
                      >
                        <Eye size={16} />
                        Visualizar
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                        onClick={removeFile}
                      >
                        <X size={16} />
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          {fileError && <p className="text-sm text-red-600">{fileError}</p>}
        </div>

        {/* ===== Dados do Edital ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Dados do Edital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Ano do Edital <span className="text-red-500">*</span>
              </span>
              <input
                value={editalYear}
                onChange={(e) => setEditalYear(e.target.value)}
                inputMode="numeric"
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: 2026"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Código</span>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: EDITAL_PIBIC_2026"
                />
                <button
                  type="button"
                  onClick={autoCodeFromDescricao}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 whitespace-nowrap"
                >
                  Gerar
                </button>
              </div>
              <p className="text-[11px] text-neutral mt-1">
                Campo não obrigatório. Pode ficar em branco.
              </p>
            </label>

            <label className="text-sm md:col-span-2">
              <span className="block text-xs text-neutral mb-1">
                Descrição <span className="text-red-500">*</span>
              </span>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: PIBIC 2026"
              />
            </label>
          </div>
        </div>

        {/* ===== Períodos ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange size={18} />
            <h2 className="text-sm font-semibold text-primary">Períodos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-neutral mb-1">
                Período de Submissões <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={submissionStart}
                  onChange={(e) => setSubmissionStart(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-neutral">a</span>
                <input
                  type="date"
                  value={submissionEnd}
                  onChange={(e) => setSubmissionEnd(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {submissionDateError && (
                <p className="text-xs text-red-600 mt-1">
                  {submissionDateError}
                </p>
              )}
            </div>

            <div>
              <span className="block text-xs text-neutral mb-1">
                Período de Execução do Projeto{" "}
                <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={executionStart}
                  onChange={(e) => setExecutionStart(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-neutral">a</span>
                <input
                  type="date"
                  value={executionEnd}
                  onChange={(e) => setExecutionEnd(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {executionDateError && (
                <p className="text-xs text-red-600 mt-1">
                  {executionDateError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== Classificação e Cotas ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Classificação e Cotas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Titulação mínima para a solicitação de cotas{" "}
                <span className="text-red-500">*</span>
              </span>
              <select
                value={titulacaoMinima}
                onChange={(e) => setTitulacaoMinima(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">-- SELECIONE --</option>
                <option value="GRADUACAO">Graduação</option>
                <option value="ESPECIALIZACAO">Especialização</option>
                <option value="MESTRADO">Mestrado</option>
                <option value="DOUTORADO">Doutorado</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Período de Cota <span className="text-red-500">*</span>
              </span>
              <select
                value={periodoCota}
                onChange={(e) => setPeriodoCota(e.target.value)}
                disabled={cotaBolsaLoading || Boolean(cotaBolsaError)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                <option value="">
                  {cotaBolsaLoading ? "Carregando..." : "-- SELECIONE --"}
                </option>
                {!cotaBolsaLoading &&
                  !cotaBolsaError &&
                  cotaBolsaOptions.length === 0 && (
                    <option value="" disabled>
                      Cadastre uma cota bolsa no backend
                    </option>
                  )}
                {cotaBolsaOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {cotaBolsaError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-2 flex-wrap">
                  <span>{cotaBolsaError}</span>
                  <button
                    type="button"
                    onClick={() => void loadCotaBolsaOptions()}
                    className="underline font-semibold"
                  >
                    Tentar novamente
                  </button>
                </p>
              )}
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Tipo Edital <span className="text-red-500">*</span>
              </span>
              <select
                value={tipoEdital}
                onChange={(e) => setTipoEdital(e.target.value)}
                disabled={tipoEditalLoading || Boolean(tipoEditalError)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                {tipoEditalLoading && (
                  <option value={tipoEdital}>Carregando...</option>
                )}
                {!tipoEditalLoading && tipoEditalOptions.length === 0 && (
                  <option value="PESQUISA">Pesquisa</option>
                )}
                {tipoEditalOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {tipoEditalError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-2 flex-wrap">
                  <span>{tipoEditalError}</span>
                  <button
                    type="button"
                    onClick={() => void loadTipoEditalOptions()}
                    className="underline font-semibold"
                  >
                    Tentar novamente
                  </button>
                </p>
              )}
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Categoria <span className="text-red-500">*</span>
              </span>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                disabled={categoriaLoading || Boolean(categoriaError)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                <option value="">
                  {categoriaLoading ? "Carregando..." : "-- SELECIONE --"}
                </option>
                {!categoriaLoading &&
                  !categoriaError &&
                  categoriaOptions.length === 0 && (
                    <option value="" disabled>
                      Cadastre uma categoria
                    </option>
                  )}
                {categoriaOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {categoriaError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-2 flex-wrap">
                  <span>{categoriaError}</span>
                  <button
                    type="button"
                    onClick={() => void loadCategoriaOptions()}
                    className="underline font-semibold"
                  >
                    Tentar novamente
                  </button>
                </p>
              )}
            </label>
          </div>
        </div>

        {/* ===== Limites por orientador ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Limites por Orientador
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Limite de solicitações de projetos por orientador{" "}
                <span className="text-red-500">*</span>
              </span>
              <input
                value={limiteProjetosOrientador}
                onChange={(e) => setLimiteProjetosOrientador(e.target.value)}
                inputMode="numeric"
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Limite de Planos de trabalho por orientador{" "}
                <span className="text-red-500">*</span>
              </span>
              <input
                value={limitePlanosOrientador}
                onChange={(e) => setLimitePlanosOrientador(e.target.value)}
                inputMode="numeric"
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
        </div>

        {/* ===== Regras do Edital ===== */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <ListChecks size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Regras do Edital
            </h2>
          </div>

          <div className="rounded-xl border border-neutral-light px-4">
            <YesNoField
              label="Edital para Voluntários?"
              value={editalVoluntarios}
              onChange={setEditalVoluntarios}
            />
            <YesNoField
              label="Avaliação Vigente?"
              value={avaliacaoVigente}
              onChange={setAvaliacaoVigente}
            />
            <YesNoField
              label="Apenas Coordenador Orienta Plano"
              value={apenasCoordenadorOrientaPlano}
              onChange={setApenasCoordenadorOrientaPlano}
            />
            <YesNoField
              label="Apenas Colaborador Voluntário Cadastra Projeto"
              value={apenasColaboradorVoluntarioCadastraProjeto}
              onChange={setApenasColaboradorVoluntarioCadastraProjeto}
            />
            <YesNoField
              label="Professor Substituto Cadastra Projeto"
              value={professorSubstitutoCadastraProjeto}
              onChange={setProfessorSubstitutoCadastraProjeto}
            />
            <YesNoField
              label="Técnico-Administrativo Pode Coordenar Projeto?"
              value={tecnicoAdministrativoPodeCoordenar}
              onChange={setTecnicoAdministrativoPodeCoordenar}
            />
            <YesNoField
              label="Distribuição de Cotas de Bolsas?"
              value={distribuicaoCotasBolsas}
              onChange={setDistribuicaoCotasBolsas}
            />
          </div>
        </div>

        {/* ===== Parâmetros da Distribuição de Cotas (condicional) ===== */}
        {distribuicaoCotasBolsas === "SIM" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <h2 className="text-sm font-semibold text-primary">
                Parâmetros da Distribuição de Cotas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Tipo da bolsa <span className="text-red-500">*</span>
                </span>
                <select
                  value={tipoBolsa}
                  onChange={(e) => setTipoBolsa(e.target.value)}
                  disabled={bolsaLoading || Boolean(bolsaError)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                >
                  <option value="">
                    {bolsaLoading ? "Carregando..." : "-- SELECIONE --"}
                  </option>
                  {!bolsaLoading &&
                    !bolsaError &&
                    bolsaOptions.length === 0 && (
                      <option value="" disabled>
                        Cadastre um tipo de bolsa nas configurações
                      </option>
                    )}
                  {bolsaOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.descricao}
                    </option>
                  ))}
                </select>
                {bolsaError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-2 flex-wrap">
                    <span>{bolsaError}</span>
                    <button
                      type="button"
                      onClick={() => void loadBolsaOptions()}
                      className="underline font-semibold"
                    >
                      Tentar novamente
                    </button>
                  </p>
                )}
                {!bolsaLoading && !bolsaError && bolsaOptions.length === 0 && (
                  <p className="mt-1 text-xs text-neutral">
                    Nenhum tipo cadastrado.{" "}
                    <Link
                      to="/adm/settings/scholarships"
                      className="text-primary font-semibold underline"
                    >
                      Ir para Entidades & Tipos de Bolsa
                    </Link>
                  </p>
                )}
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Quantidade <span className="text-red-500">*</span>
                </span>
                <input
                  value={quantidadeCotas}
                  onChange={(e) => setQuantidadeCotas(e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  FPPI Mínimo <span className="text-red-500">*</span>
                </span>
                <input
                  value={fppiMinimo}
                  onChange={(e) => setFppiMinimo(e.target.value)}
                  inputMode="decimal"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Média Mínima dos Projetos{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  value={mediaMinimaProjetos}
                  onChange={(e) => setMediaMinimaProjetos(e.target.value)}
                  inputMode="decimal"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </div>
        )}

        {/* ===== Actions ===== */}
        <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 w-full md:w-auto"
          >
            Limpar
          </button>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={saveDraft}
              disabled={!canSaveDraft}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
                ${!canSaveDraft ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
            >
              <Save size={16} />
              {isSubmitting ? "Salvando..." : "Salvar rascunho"}
            </button>

            <button
              type="button"
              onClick={publish}
              disabled={!canPublish || isSubmitting}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border w-full md:w-auto
                ${
                  !canPublish || isSubmitting
                    ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                    : "border-green-200 bg-green-50 text-green-700 hover:opacity-95"
                }`}
            >
              <Check size={16} />
              {isSubmitting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}
      </section>
    </div>
  );
}
