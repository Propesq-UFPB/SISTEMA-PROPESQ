import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  FileCheck,
  Search,
  BookOpen,
  ChevronDown,
  Info,
  FolderOpen,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Clock3,
  Users,
  History,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }

type ReportStatus = "PENDING" | "VALIDATED" | "REJECTED"

type ReportType = "PARTIAL" | "FINAL" | "OTHER"

type Report = {
  id: string
  projectId: string
  projectTitle: string
  advisor: string
  student: string
  type: ReportType
  submittedAt: string // ISO
  status: ReportStatus
  fileName: string
  notes?: string
  history: {
    id: string
    at: string
    by: string
    action: "SUBMITTED" | "VALIDATED" | "REJECTED" | "COMMENTED"
    message?: string
  }[]
}

type ProjectGroup = {
  projectId: string
  projectTitle: string
  advisor: string
  student: string
  reports: Report[]
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function statusChip(s: ReportStatus) {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border"
  if (s === "VALIDATED") return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>Validado</span>
  if (s === "REJECTED") return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Rejeitado</span>
  return <span className={`${base} bg-amber-50 text-amber-800 border-amber-200`}>Pendente</span>
}

function typeLabel(t: ReportType) {
  if (t === "PARTIAL") return "Parcial"
  if (t === "FINAL") return "Final"
  return "Outro"
}

function Section({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-neutral-light bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-neutral-light/60">{icon}</span>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  )
}

function TimelineItem({
  icon,
  title,
  meta,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  meta: string
  subtitle?: string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">{title}</p>
        {subtitle ? <p className="text-sm text-neutral mt-1 break-words">{subtitle}</p> : null}
        <p className="text-xs text-neutral mt-1">{meta}</p>
      </div>
    </div>
  )
}

export default function ReportValidation() {
  // ===== Edital selecionado =====
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])
  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")

  // ===== Mock: relatórios (vários por projeto) =====
  const [reportsByCall, setReportsByCall] = useState<Record<string, Report[]>>({
    call_2026_01: [
      {
        id: "rep_1001",
        projectId: "p1",
        projectTitle: "Detecção de presença com TinyML",
        advisor: "Profa. Ana Souza",
        student: "Discente Maria",
        type: "PARTIAL",
        submittedAt: "2026-02-02T12:30:00Z",
        status: "PENDING",
        fileName: "relatorio_parcial_p1.pdf",
        history: [{ id: "h1", at: "2026-02-02T12:30:00Z", by: "Discente", action: "SUBMITTED" }],
      },
      {
        id: "rep_1002",
        projectId: "p1",
        projectTitle: "Detecção de presença com TinyML",
        advisor: "Profa. Ana Souza",
        student: "Discente Maria",
        type: "OTHER",
        submittedAt: "2026-02-10T18:10:00Z",
        status: "REJECTED",
        fileName: "anexo_complementar_p1.pdf",
        notes: "Arquivo ilegível. Reenviar.",
        history: [
          { id: "h2", at: "2026-02-10T18:10:00Z", by: "Discente", action: "SUBMITTED" },
          { id: "h3", at: "2026-02-11T09:00:00Z", by: "Administrador", action: "REJECTED", message: "Arquivo ilegível. Reenviar." },
        ],
      },
      {
        id: "rep_1003",
        projectId: "p2",
        projectTitle: "Otimização de energia em datacenters",
        advisor: "Prof. Diego Ramos",
        student: "Discente Marcos",
        type: "FINAL",
        submittedAt: "2026-03-15T14:00:00Z",
        status: "VALIDATED",
        fileName: "relatorio_final_p2.pdf",
        history: [
          { id: "h4", at: "2026-03-15T14:00:00Z", by: "Discente", action: "SUBMITTED" },
          { id: "h5", at: "2026-03-16T10:40:00Z", by: "Administrador", action: "VALIDATED", message: "OK." },
        ],
      },
    ],
    call_2025_03: [],
  })

  // ===== UI state =====
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"ALL" | ReportStatus>("ALL")
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
  const [selectedReportIds, setSelectedReportIds] = useState<Record<string, boolean>>({})
  const [openReportId, setOpenReportId] = useState<string | null>(null)

  const reports = reportsByCall[selectedCallId] ?? []

  // ===== agrupamento por projeto (para mostrar “vários relatórios por projeto”) =====
  const grouped: ProjectGroup[] = useMemo(() => {
    const nq = q.trim().toLowerCase()

    const filtered = reports
      .filter((r) => (status === "ALL" ? true : r.status === status))
      .filter((r) => {
        if (!nq) return true
        return (
          r.projectTitle.toLowerCase().includes(nq) ||
          r.student.toLowerCase().includes(nq) ||
          r.advisor.toLowerCase().includes(nq) ||
          r.id.toLowerCase().includes(nq)
        )
      })

    const map = new Map<string, ProjectGroup>()
    for (const r of filtered) {
      const key = r.projectId
      const existing = map.get(key)
      if (!existing) {
        map.set(key, {
          projectId: r.projectId,
          projectTitle: r.projectTitle,
          advisor: r.advisor,
          student: r.student,
          reports: [r],
        })
      } else {
        existing.reports.push(r)
      }
    }

    const list = Array.from(map.values())
    for (const g of list) {
      g.reports.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
    }

    // ordena por último envio (mais recente)
    list.sort((a, b) => (a.reports[0]?.submittedAt ?? "") < (b.reports[0]?.submittedAt ?? "") ? 1 : -1)
    return list
  }, [reports, q, status])

  const stats = useMemo(() => {
    const all = reports
    return {
      total: all.length,
      pending: all.filter((r) => r.status === "PENDING").length,
      validated: all.filter((r) => r.status === "VALIDATED").length,
      rejected: all.filter((r) => r.status === "REJECTED").length,
    }
  }, [reports])

  const openReport = useMemo(() => reports.find((r) => r.id === openReportId) ?? null, [reports, openReportId])

  const selectedIds = useMemo(() => Object.keys(selectedReportIds).filter((id) => selectedReportIds[id]), [selectedReportIds])

  const selectedPendingOnly = useMemo(() => {
    if (selectedIds.length === 0) return false
    const selectedReports = selectedIds.map((id) => reports.find((r) => r.id === id)).filter(Boolean) as Report[]
    return selectedReports.length > 0 && selectedReports.every((r) => r.status === "PENDING")
  }, [selectedIds, reports])

  function toggleSelect(reportId: string) {
    setSelectedReportIds((prev) => ({ ...prev, [reportId]: !prev[reportId] }))
  }

  function clearSelection() {
    setSelectedReportIds({})
  }

  function validateOne(reportId: string) {
    setReportsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((r) => {
        if (r.id !== reportId) return r
        return {
          ...r,
          status: "VALIDATED",
          history: [
            ...r.history,
            { id: uid("h"), at: new Date().toISOString(), by: "Administrador", action: "VALIDATED", message: "Validado." },
          ],
        }
      }),
    }))
  }

  function rejectOne(reportId: string) {
    setReportsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((r) => {
        if (r.id !== reportId) return r
        return {
          ...r,
          status: "REJECTED",
          notes: r.notes ?? "Rejeitado. Ajustar e reenviar.",
          history: [
            ...r.history,
            { id: uid("h"), at: new Date().toISOString(), by: "Administrador", action: "REJECTED", message: "Rejeitado." },
          ],
        }
      }),
    }))
  }

  function validateBatch() {
    if (!selectedPendingOnly) return
    const ids = new Set(selectedIds)
    setReportsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((r) => {
        if (!ids.has(r.id)) return r
        return {
          ...r,
          status: "VALIDATED",
          history: [
            ...r.history,
            { id: uid("h"), at: new Date().toISOString(), by: "Administrador", action: "VALIDATED", message: "Validado em lote." },
          ],
        }
      }),
    }))
    clearSelection()
    alert("Validação em lote concluída (placeholder).")
  }

  function download(reportId: string) {
    alert(`Download do arquivo do relatório ${reportId} (placeholder).`)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Validação de Relatórios • PROPESQ</title>
      </Helmet>

      <Link
        to="/adm/monitoring/replacements"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para substituições
      </Link>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <FileCheck size={14} />
              Relatórios
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Validação de Relatórios</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Relatórios são vinculados a projetos — um projeto pode ter vários relatórios. Use a lista por
                projeto para revisar, validar ou rejeitar.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={validateBatch}
              disabled={!selectedPendingOnly}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors
                ${!selectedPendingOnly ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
              `}
            >
              <FileCheck size={16} />
              Validar em lote
            </button>
          </div>
        </div>
      </div>

      {/* Contexto do edital + KPIs */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Contexto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <label className="md:col-span-7 text-sm">
            <span className="block text-xs text-neutral mb-1">Edital</span>
            <div className="relative">
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setExpandedProjectId(null)
                  setOpenReportId(null)
                  clearSelection()
                }}
                className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {calls
                  .slice()
                  .sort((a, b) => b.baseYear - a.baseYear)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {c.baseYear}
                    </option>
                  ))}
              </select>
            </div>
          </label>

          <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
              <p className="text-xs text-neutral">Total</p>
              <p className="text-xl font-bold text-primary mt-1">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs text-amber-800">Pendentes</p>
              <p className="text-xl font-bold text-amber-900 mt-1">{stats.pending}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-xs text-green-700">Validados</p>
              <p className="text-xl font-bold text-green-800 mt-1">{stats.validated}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs text-red-700">Rejeitados</p>
              <p className="text-xl font-bold text-red-800 mt-1">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Dica: valide primeiro os <span className="font-semibold text-primary">pendentes</span> e mantenha um histórico de ações (submetido, validado, rejeitado, comentários).
          </p>
        </div>
      </section>

      {/* Lista por projeto + Detalhe do relatório */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LISTA (por projeto) */}
        <div className="lg:col-span-7">
          <Section title="Relatórios por Projeto" icon={<FolderOpen size={18} />}>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Buscar por projeto, discente, ID do relatório..."
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any)
                    setExpandedProjectId(null)
                    setOpenReportId(null)
                    clearSelection()
                  }}
                  className="border border-neutral-light rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="VALIDATED">Validados</option>
                  <option value="REJECTED">Rejeitados</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {grouped.map((g) => {
                const expanded = expandedProjectId === g.projectId
                const pendingCount = g.reports.filter((r) => r.status === "PENDING").length
                return (
                  <div key={g.projectId} className="rounded-xl border border-neutral-light bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedProjectId((prev) => (prev === g.projectId ? null : g.projectId))
                      }}
                      className="w-full text-left p-4 hover:bg-neutral-50 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{g.projectTitle}</p>
                          <p className="text-xs text-neutral mt-1">
                            <span className="font-semibold text-primary">{g.student}</span> • Orientador:{" "}
                            <span className="font-semibold text-primary">{g.advisor}</span>
                          </p>
                          <p className="text-xs text-neutral mt-2">
                            Relatórios: <span className="font-semibold text-primary">{g.reports.length}</span>
                            {pendingCount > 0 ? (
                              <>
                                {" "}
                                • Pendentes: <span className="font-semibold text-amber-900">{pendingCount}</span>
                              </>
                            ) : null}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-[11px] text-neutral">
                            Último envio: {new Date(g.reports[0].submittedAt).toLocaleString()}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`text-neutral transition-transform ${expanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-neutral-light p-4 space-y-2">
                        {g.reports.map((r) => {
                          const active = r.id === openReportId
                          return (
                            <div
                              key={r.id}
                              className={`rounded-lg border p-3 flex items-start justify-between gap-3 ${
                                active ? "border-primary bg-primary/5" : "border-neutral-light bg-white"
                              }`}
                            >
                              <label className="flex items-start gap-3 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={!!selectedReportIds[r.id]}
                                  onChange={() => toggleSelect(r.id)}
                                  disabled={r.status !== "PENDING"}
                                  className="mt-1"
                                  aria-label="Selecionar relatório"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-primary truncate">
                                    {typeLabel(r.type)} • {r.id}
                                  </p>
                                  <p className="text-xs text-neutral mt-1">
                                    Enviado em {new Date(r.submittedAt).toLocaleString()} • Arquivo:{" "}
                                    <span className="font-semibold text-primary">{r.fileName}</span>
                                  </p>
                                  {r.notes ? <p className="text-xs text-neutral mt-1">Obs.: {r.notes}</p> : null}
                                </div>
                              </label>

                              <div className="shrink-0 flex items-center gap-2">
                                {statusChip(r.status)}
                                <button
                                  type="button"
                                  onClick={() => setOpenReportId(r.id)}
                                  className="p-2 rounded-lg hover:bg-neutral-50"
                                  aria-label="Ver detalhes"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {grouped.length === 0 && (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhum relatório encontrado para este edital/filtro.
                </div>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start justify-between gap-3 flex-col md:flex-row">
                <div className="text-xs text-neutral">
                  Selecionados: <span className="font-semibold text-primary">{selectedIds.length}</span>
                  <p className="mt-1">Obs.: apenas relatórios pendentes podem ser validados em lote.</p>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-white"
                >
                  Limpar seleção
                </button>
              </div>
            )}
          </Section>
        </div>

        {/* DETALHES do relatório */}
        <div className="lg:col-span-5">
          <Section title="Detalhes do Relatório" icon={<FileText size={18} />}>
            {!openReport ? (
              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                Selecione um relatório para ver detalhes e histórico.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">{openReport.projectTitle}</p>
                      <p className="text-xs text-neutral mt-1">
                        <span className="font-semibold text-primary">{openReport.student}</span> • Orientador:{" "}
                        <span className="font-semibold text-primary">{openReport.advisor}</span>
                      </p>
                      <p className="text-xs text-neutral mt-2">
                        Relatório: <span className="font-semibold text-primary">{typeLabel(openReport.type)}</span> •{" "}
                        <span className="font-semibold text-primary">{openReport.id}</span>
                      </p>
                      <p className="text-xs text-neutral mt-1">
                        Enviado em {new Date(openReport.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="shrink-0">{statusChip(openReport.status)}</div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => download(openReport.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-white"
                    >
                      <Download size={16} />
                      Baixar PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Abrir visualizador (placeholder)")}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-white"
                    >
                      <Eye size={16} />
                      Visualizar
                    </button>
                  </div>
                </div>

                {openReport.status === "PENDING" && (
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => validateOne(openReport.id)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90 w-full"
                    >
                      <CheckCircle2 size={16} />
                      Validar
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectOne(openReport.id)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-700 bg-red-50 hover:opacity-95 w-full"
                    >
                      <XCircle size={16} />
                      Rejeitar
                    </button>
                  </div>
                )}

                <div className="rounded-xl border border-neutral-light bg-white p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <History size={18} />
                    <p className="text-sm font-semibold text-primary">Histórico</p>
                  </div>

                  <div className="space-y-4">
                    {openReport.history
                      .slice()
                      .sort((a, b) => (a.at < b.at ? 1 : -1))
                      .map((h) => {
                        const when = new Date(h.at).toLocaleString()
                        const icon =
                          h.action === "VALIDATED" ? (
                            <CheckCircle2 size={18} className="text-green-700" />
                          ) : h.action === "REJECTED" ? (
                            <XCircle size={18} className="text-red-700" />
                          ) : h.action === "SUBMITTED" ? (
                            <Clock3 size={18} className="text-amber-700" />
                          ) : (
                            <Users size={18} className="text-neutral" />
                          )

                        const title =
                          h.action === "VALIDATED"
                            ? "Validado"
                            : h.action === "REJECTED"
                            ? "Rejeitado"
                            : h.action === "SUBMITTED"
                            ? "Enviado"
                            : "Comentado"

                        return (
                          <TimelineItem
                            key={h.id}
                            icon={icon}
                            title={title}
                            subtitle={h.message}
                            meta={`Por: ${h.by} • ${when}`}
                          />
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}