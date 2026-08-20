import React, { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import {
  AlertTriangle,
  BookOpen,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { ApiError } from "@/services/apiClient";
import {
  editalService,
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

export default function CoordinatorEditais() {
  const [editais, setEditais] = useState<EditalListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusOptions, setStatusOptions] = useState<EditalStatusLookup[]>(
    DEFAULT_STATUS_OPTIONS,
  );
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Editais • PROPESQ</title>
      </Helmet>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <BookOpen size={14} />
              Editais
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                Consultar Editais
              </h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Visualize os editais cadastrados, com título, período de execução
                e status. Esta tela é somente consulta.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
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
            <div className="flex items-center justify-center gap-2 text-sm text-red-600">
              <AlertTriangle size={16} />
              {loadError}
            </div>
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
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-neutral">
                        Título do Edital
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {edital.titulo}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-neutral">
                          Status
                        </p>
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
                        <p className="text-[11px] font-bold text-neutral">
                          Início da execução
                        </p>
                        <p className="text-sm text-neutral">{period.inicio}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-neutral">
                          Fim da execução
                        </p>
                        <p className="text-sm text-neutral">{period.fim}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
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
  const className = BADGE_STATUS_CLASS[status] ?? "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${className}`}
    >
      {label ?? status}
    </span>
  );
}
