import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { ApiError } from "@/services/apiClient";
import {
  EditalForm,
  editalService,
  type Edital,
  type EditalListItem,
  type EditalStatusLookup,
  type StatusEdital,
} from "@/features/editais";

const DEFAULT_STATUS_OPTIONS: EditalStatusLookup[] = [
  { id: "RASCUNHO", name: "Rascunho" },
  { id: "PUBLICADO", name: "Publicado" },
  { id: "ENCERRADO", name: "Encerrado" },
  { id: "ARQUIVADO", name: "Arquivado" },
];

function apiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
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
  const [view, setView] = useState<"list" | "form">("list");
  const [editingEdital, setEditingEdital] = useState<Edital | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);

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

  async function startEdit(edital: EditalListItem) {
    setLoadingEditId(edital.id);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const detail = await editalService.getById(edital.id);
      setEditingEdital(detail);
      setView("form");
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

  function backToList() {
    setView("list");
    setEditingEdital(null);
    setActionError(null);
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

  if (view === "form" && editingEdital) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <Helmet>
          <title>Alterar edital • PROPESQ</title>
        </Helmet>

        <button
          type="button"
          onClick={backToList}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Voltar para a lista
        </button>

        <div className="rounded-2xl border border-neutral-light bg-white p-6">
          <h1 className="text-2xl font-bold text-primary">Alterar edital</h1>
          <p className="text-sm text-neutral mt-1 max-w-2xl">
            Atualize o cadastro completo deste edital, incluindo anexo, unidades,
            cotas e status.
          </p>
        </div>

        <EditalForm
          key={editingEdital.id}
          mode="edit"
          initialEdital={editingEdital}
          onCancel={backToList}
          onSaved={() => {
            backToList();
            setSuccessMessage("Alterações salvas com sucesso.");
            void loadEditais(query);
          }}
        />
      </div>
    );
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
                Gerencie os editais cadastrados, edite o cadastro completo ou
                remova registros quando necessário.
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
        <output
          className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          <CheckCircle2 size={16} />
          {successMessage}
        </output>
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
              const period = splitFormattedPeriod(edital.periodo_execucao);

              return (
                <div key={edital.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-neutral">
                          Título do Edital
                        </span>
                        <p className="text-sm font-semibold text-primary">
                          {edital.titulo}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-neutral">
                            Status
                          </span>
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
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-neutral">
                            Início da execução
                          </span>
                          <p className="text-sm text-neutral">{period.inicio}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-neutral">
                            Fim da execução
                          </span>
                          <p className="text-sm text-neutral">{period.fim}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:min-w-[210px] justify-end">
                      <button
                        type="button"
                        onClick={() => void startEdit(edital)}
                        disabled={loadingEditId !== null}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingEditId === edital.id ? (
                          <LoaderCircle size={16} className="animate-spin" />
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
                        disabled={loadingEditId !== null}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
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

const BADGE_STATUS_CLASS: Record<StatusEdital, string> = {
  PUBLICADO: "bg-primary/10 text-primary border-primary/20",
  RASCUNHO: "bg-neutral-light text-neutral border-neutral-light",
  ENCERRADO: "bg-amber-50 text-amber-700 border-amber-100",
  ARQUIVADO: "bg-slate-50 text-slate-700 border-slate-100",
};

function Badge({
  status,
  label,
}: Readonly<{
  status: StatusEdital;
  label?: string;
}>) {
  const className =
    BADGE_STATUS_CLASS[status] ?? "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${className}`}
    >
      {label ?? status}
    </span>
  );
}
