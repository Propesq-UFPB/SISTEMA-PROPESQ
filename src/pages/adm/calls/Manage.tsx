import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Settings,
} from "lucide-react"

type CallStatus = "RASCUNHO" | "PUBLICADO" | "ENCERRADO" | "ARQUIVADO"

type Call = {
  id: string
  title: string
  status: CallStatus
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

const MOCK_CALLS: Call[] = [
  {
    id: "call_001",
    title: "Edital PIBIC 2026",
    status: "PUBLICADO",
    startDate: "2026-02-01",
    endDate: "2026-03-15",
  },
  {
    id: "call_002",
    title: "Edital PROBEX 2026",
    status: "RASCUNHO",
    startDate: "2026-02-10",
    endDate: "2026-04-01",
  },
  {
    id: "call_003",
    title: "Edital ENIC 2025",
    status: "ENCERRADO",
    startDate: "2025-06-01",
    endDate: "2025-07-10",
  },
]

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function isISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

export default function AdmCallsManage() {
  // Trocar por GET /calls
  const [calls, setCalls] = useState<Call[]>(MOCK_CALLS)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Call | null>(null)

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  const filtered = useMemo(() => {
    const q = normalize(query)

    if (!q) return calls

    return calls.filter((c) => normalize(c.title).includes(q) || normalize(c.status).includes(q))
  }, [calls, query])

  const errors = useMemo(() => {
    if (!draft) return {}

    const e: Record<string, string> = {}

    if (!draft.title.trim()) e.title = "Título é obrigatório."
    if (!isISODate(draft.startDate)) e.startDate = "Use formato YYYY-MM-DD."
    if (!isISODate(draft.endDate)) e.endDate = "Use formato YYYY-MM-DD."

    if (isISODate(draft.startDate) && isISODate(draft.endDate) && draft.startDate > draft.endDate) {
      e.endDate = "Data final não pode ser menor que a inicial."
    }

    return e
  }, [draft])

  const hasErrors = Object.keys(errors).length > 0

  function startEdit(call: Call) {
    setSavedOk(false)
    setEditingId(call.id)
    setDraft({ ...call })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  async function saveEdit() {
    if (!draft || !editingId || hasErrors) return

    setSaving(true)
    setSavedOk(false)

    try {
      // trocar por PUT /calls/:id
      await new Promise((r) => setTimeout(r, 450))

      setCalls((prev) => prev.map((c) => (c.id === editingId ? draft : c)))
      setEditingId(null)
      setDraft(null)
      setSavedOk(true)

      setTimeout(() => setSavedOk(false), 1800)
    } finally {
      setSaving(false)
    }
  }

  function askDelete(id: string) {
    setConfirmDeleteId(id)
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return

    const id = confirmDeleteId
    setConfirmDeleteId(null)

    // trocar por DELETE /calls/:id ou soft-delete
    await new Promise((r) => setTimeout(r, 250))

    setCalls((prev) => prev.filter((c) => c.id !== id))
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

      {/* ===== Header  ===== */}
      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <BookOpen size={14} />
              Editais
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Alterar/Remover Editais</h1>

              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Gerencie os editais cadastrados, edite metadados básicos e remova ou arquive registros
                quando necessário.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {savedOk && (
              <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <CheckCircle2 size={16} />
                Alterações salvas
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
              <Settings size={16} />
              {calls.length} editais
            </span>
          </div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="bg-white border border-neutral-light rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={16} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou status..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <span className="inline-flex items-center justify-center rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral">
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Lista */}
      <section className="bg-white border border-neutral-light rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-light">
          <p className="text-xs font-bold uppercase tracking-wide text-neutral">Editais cadastrados</p>
        </div>

        <div className="divide-y divide-neutral-light">
          {filtered.length === 0 && <div className="p-6 text-sm text-neutral">Nenhum edital encontrado.</div>}

          {filtered.map((c) => {
            const isEditing = editingId === c.id
            const row = isEditing && draft ? draft : c

            return (
              <div key={c.id} className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                  {/* Dados */}
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral">Título do Edital</label>

                      {isEditing ? (
                        <>
                          <input
                            value={row.title}
                            onChange={(e) => setDraft((p) => (p ? { ...p, title: e.target.value } : p))}
                            className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                              errors.title
                                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                            }`}
                          />

                          {errors.title && <p className="text-[11px] text-red-500 font-semibold">{errors.title}</p>}
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-primary">{c.title}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral">Status</label>

                        {isEditing ? (
                          <select
                            value={row.status}
                            onChange={(e) =>
                              setDraft((p) => (p ? { ...p, status: e.target.value as CallStatus } : p))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="RASCUNHO">RASCUNHO</option>
                            <option value="PUBLICADO">PUBLICADO</option>
                            <option value="ENCERRADO">ENCERRADO</option>
                            <option value="ARQUIVADO">ARQUIVADO</option>
                          </select>
                        ) : (
                          <div className="pt-1">
                            <Badge status={c.status} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral">Início</label>

                        {isEditing ? (
                          <>
                            <input
                              type="date"
                              value={row.startDate}
                              onChange={(e) => setDraft((p) => (p ? { ...p, startDate: e.target.value } : p))}
                              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                errors.startDate
                                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                  : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                              }`}
                            />

                            {errors.startDate && (
                              <p className="text-[11px] text-red-500 font-semibold">{errors.startDate}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-neutral">{c.startDate}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral">Fim</label>

                        {isEditing ? (
                          <>
                            <input
                              type="date"
                              value={row.endDate}
                              onChange={(e) => setDraft((p) => (p ? { ...p, endDate: e.target.value } : p))}
                              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                errors.endDate
                                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                  : "border-neutral-light focus:ring-2 focus:ring-primary/20"
                              }`}
                            />

                            {errors.endDate && (
                              <p className="text-[11px] text-red-500 font-semibold">{errors.endDate}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-neutral">{c.endDate}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex lg:flex-col gap-2 lg:min-w-[210px] justify-end">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => startEdit(c)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => askDelete(c.id)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={saving || hasErrors}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={16} />
                          {saving ? "Salvando..." : "Salvar"}
                        </button>

                        <button
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
            )
          })}
        </div>
      </section>

      {/* Modal confirmação remoção */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-light overflow-hidden">
            <div className="p-4 border-b border-neutral-light">
              <p className="text-sm font-bold text-primary">Confirmar remoção</p>

              <p className="text-xs text-neutral mt-1">
                Essa ação remove o edital da listagem. Se preferir, você pode trocar o status para{" "}
                <b>ARQUIVADO</b> ao invés de remover.
              </p>
            </div>

            <div className="p-4 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:opacity-90"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Badge({ status }: { status: CallStatus }) {
  const cls =
    status === "PUBLICADO"
      ? "bg-primary/10 text-primary border-primary/20"
      : status === "RASCUNHO"
        ? "bg-neutral-light text-neutral border-neutral-light"
        : status === "ENCERRADO"
          ? "bg-amber-50 text-amber-700 border-amber-100"
          : "bg-slate-50 text-slate-700 border-slate-100"

  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {status}
    </span>
  )
}