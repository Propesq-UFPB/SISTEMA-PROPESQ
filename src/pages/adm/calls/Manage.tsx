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
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { ApiError } from "@/services/apiClient";
import {
  editalService,
  type EditalListItem,
  type EditalStatusLookup,
  type StatusEdital,
} from "@/features/editais";

type EditDraft = {
  id: number;
  titulo: string;
  status: StatusEdital;
  inicio: string;
  fim: string;
};

const DEFAULT_STATUS_OPTIONS: EditalStatusLookup[] = [
  { id: "RASCUNHO", name: "Rascunho" },
  { id: "PUBLICADO", name: "Publicado" },
  { id: "ENCERRADO", name: "Encerrado" },
  { id: "ARQUIVADO", name: "Arquivado" },
];

function apiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function isISODate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function formatDate(value: string) {
  if (!isISODate(value)) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function splitFormattedPeriod(value: string) {
  const [inicio = "-", fim = "-"] = value.split(" a ");
  return { inicio, fim };
}

export default function AdmCallsManage() {
  const [editais, setEditais] = useState<EditalListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [statusOptions, setStatusOptions] = useState<EditalStatusLookup[]>(
    DEFAULT_STATUS_OPTIONS,
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const requestSequence = useRef(0);

  const loadEditais = useCallback(async (search: string) => {
    const sequence = ++requestSequence.current;
    setLoading(true);
    setLoadError(null);

    try {
      const response = await editalService.list({
        limit: 100,
        offset: 0,
        search: search.trim() || undefined,
      });

      if (sequence !== requestSequence.current) return;
      setEditais(response.results);
      setTotal(response.total);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setEditais([]);
      setTotal(0);
      setLoadError(
        apiErrorMessage(error, "Não foi possível carregar os editais."),
      );
    } finally {
      if (sequence === requestSequence.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadEditais(query);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [loadEditais, query]);

  useEffect(() => {
    let active = true;

    void editalService
      .statusLookup()
      .then(options => {
        if (active && options.length > 0) {
          setStatusOptions(options);
        }
      })
      .catch(() => {
        if (active) {
          setStatusOptions(DEFAULT_STATUS_OPTIONS);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const errors = useMemo(() => {
    if (!draft) return {};

    const validationErrors: Record<string, string> = {};

    if (!draft.titulo.trim()) {
      validationErrors.titulo = "Título é obrigatório.";
    }
    if (!isISODate(draft.inicio)) {
      validationErrors.inicio = "Informe a data inicial.";
    }
    if (!isISODate(draft.fim)) {
      validationErrors.fim = "Informe a data final.";
    }
    if (
      isISODate(draft.inicio) &&
      isISODate(draft.fim) &&
      draft.inicio > draft.fim
    ) {
      validationErrors.fim =
        "A data final não pode ser anterior à data inicial.";
    }

    return validationErrors;
  }, [draft]);

  const hasErrors = Object.keys(errors).length > 0;

  async function startEdit(edital: EditalListItem) {
    setLoadingEditId(edital.id);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const detail = await editalService.getById(edital.id);

      setEditingId(edital.id);
      setDraft({
        id: edital.id,
        titulo: detail.descricao,
        status: detail.status,
        inicio: toDateInput(detail.periodo_execucao_rel.inicio),
        fim: toDateInput(detail.periodo_execucao_rel.fim),
      });
    } catch (error) {
      setActionError(
        apiErrorMessage(
          error,
          "Não foi possível carregar os dados do edital para edição.",
        ),
      );
    } finally {
      setLoadingEditId(null);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setActionError(null);
  }

  async function saveEdit() {
    if (!draft || editingId === null || hasErrors) return;

    setSaving(true);
    setActionError(null);
    setSuccessMessage(null);

    try {
      await editalService.update(editingId, {
        titulo: draft.titulo.trim(),
        periodo_execucao: {
          inicio: draft.inicio,
          fim: draft.fim,
        },
        status: draft.status,
      });

      setEditais(current =>
        current.map(edital =>
          edital.id === editingId
            ? {
                ...edital,
                titulo: draft.titulo.trim(),
                periodo_execucao: `${formatDate(draft.inicio)} a ${formatDate(draft.fim)}`,
                status: draft.status,
              }
            : edital,
        ),
      );
      setEditingId(null);
      setDraft(null);
      setSuccessMessage("Alterações salvas com sucesso.");
    } catch (error) {
      setActionError(
        apiErrorMessage(error, "Não foi possível atualizar o edital."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (confirmDeleteId === null) return;

    setDeleting(true);
    setActionError(null);
    setSuccessMessage(null);

    try {
      await editalService.remove(confirmDeleteId);
      setEditais(current =>
        current.filter(edital => edital.id !== confirmDeleteId),
      );
      setTotal(current => Math.max(0, current - 1));
      setConfirmDeleteId(null);
      setSuccessMessage("Edital removido com sucesso.");
    } catch (error) {
      setConfirmDeleteId(null);
      setActionError(
        apiErrorMessage(error, "Não foi possível remover o edital."),
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Alterar/Remover Editais • PROPESQ</title>
      </Helmet>

      <Link
        to="/adm/calls/CreateCall"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para criação de edital
      </Link>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <BookOpen size={14} />
              Editais
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                Alterar/Remover Editais
              </h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Gerencie os editais cadastrados, altere título, período de
                execução e status, ou remova registros quando necessário.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
            <Settings size={16} />
            {total} editais
          </span>
        </div>
      </div>

      <div className="bg-white border border-neutral-light rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
            size={16}
          />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar por título ou status..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <span className="inline-flex items-center justify-center rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral">
          {total} resultado{total === 1 ? "" : "s"}
        </span>
      </div>

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          <CheckCircle2 size={16} />
          {successMessage}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertTriangle size={16} />
          {actionError}
        </div>
      )}

      <section className="bg-white border border-neutral-light rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-light flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-neutral">
            Editais cadastrados
          </p>
          <button
            type="button"
            onClick={() => void loadEditais(query)}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {loading && (
          <div className="p-8 flex items-center justify-center gap-2 text-sm text-neutral">
            <LoaderCircle size={18} className="animate-spin" />
            Carregando editais...
          </div>
        )}

        {!loading && loadError && (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadEditais(query)}
              className="text-sm font-semibold text-primary underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !loadError && editais.length === 0 && (
          <div className="p-8 text-sm text-neutral text-center">
            Nenhum edital encontrado.
          </div>
        )}

        {!loading && !loadError && (
          <div className="divide-y divide-neutral-light">
            {editais.map(edital => {
              const isEditing = editingId === edital.id && draft !== null;
              const period = splitFormattedPeriod(edital.periodo_execucao);

              return (
                <div key={edital.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral">
                          Título do Edital
                        </label>

                        {isEditing ? (
                          <>
                            <input
                              value={draft.titulo}
                              onChange={event =>
                                setDraft(current =>
                                  current
                                    ? {
                                        ...current,
                                        titulo: event.target.value,
                                      }
                                    : current,
                                )
                              }
                              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                errors.titulo
                                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                  : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                              }`}
                            />
                            {errors.titulo && (
                              <p className="text-[11px] text-red-500 font-semibold">
                                {errors.titulo}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-primary">
                            {edital.titulo}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral">
                            Status
                          </label>
                          {isEditing ? (
                            <select
                              value={draft.status}
                              onChange={event =>
                                setDraft(current =>
                                  current
                                    ? {
                                        ...current,
                                        status: event.target
                                          .value as StatusEdital,
                                      }
                                    : current,
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {statusOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="pt-1">
                              <Badge
                                status={edital.status}
                                label={
                                  statusOptions.find(
                                    option => option.id === edital.status,
                                  )?.name
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral">
                            Início da execução
                          </label>
                          {isEditing ? (
                            <>
                              <input
                                type="date"
                                value={draft.inicio}
                                onChange={event =>
                                  setDraft(current =>
                                    current
                                      ? {
                                          ...current,
                                          inicio: event.target.value,
                                        }
                                      : current,
                                  )
                                }
                                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                  errors.inicio
                                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                    : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              {errors.inicio && (
                                <p className="text-[11px] text-red-500 font-semibold">
                                  {errors.inicio}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-neutral">
                              {period.inicio}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral">
                            Fim da execução
                          </label>
                          {isEditing ? (
                            <>
                              <input
                                type="date"
                                value={draft.fim}
                                onChange={event =>
                                  setDraft(current =>
                                    current
                                      ? {
                                          ...current,
                                          fim: event.target.value,
                                        }
                                      : current,
                                  )
                                }
                                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                  errors.fim
                                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                    : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              {errors.fim && (
                                <p className="text-[11px] text-red-500 font-semibold">
                                  {errors.fim}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-neutral">{period.fim}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:min-w-[210px] justify-end">
                      {!isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void startEdit(edital)}
                            disabled={
                              loadingEditId !== null || editingId !== null
                            }
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingEditId === edital.id ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Pencil size={16} />
                            )}
                            {loadingEditId === edital.id
                              ? "Carregando..."
                              : "Editar"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(edital.id)}
                            disabled={editingId !== null}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                            Remover
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => void saveEdit()}
                            disabled={saving || hasErrors}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Save size={16} />
                            )}
                            {saving ? "Salvando..." : "Salvar"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={16} />
                            Cancelar
                          </button>

                          {hasErrors && (
                            <div className="flex items-center gap-2 text-[11px] text-red-600 font-semibold">
                              <AlertTriangle size={14} />
                              Corrija os campos para salvar
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-light overflow-hidden">
            <div className="p-4 border-b border-neutral-light">
              <p className="text-sm font-bold text-primary">
                Confirmar remoção
              </p>
              <p className="text-xs text-neutral mt-1">
                Essa ação remove o edital permanentemente. Se preferir, altere
                o status para <b>Arquivado</b>.
              </p>
            </div>

            <div className="p-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {deleting ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({
  status,
  label,
}: {
  status: StatusEdital;
  label?: string;
}) {
  const className =
    status === "PUBLICADO"
      ? "bg-primary/10 text-primary border-primary/20"
      : status === "RASCUNHO"
        ? "bg-neutral-light text-neutral border-neutral-light"
        : status === "ENCERRADO"
          ? "bg-amber-50 text-amber-700 border-amber-100"
          : "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${className}`}
    >
      {label ?? status}
    </span>
  );
}
