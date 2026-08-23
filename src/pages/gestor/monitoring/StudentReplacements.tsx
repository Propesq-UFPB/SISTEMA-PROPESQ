import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Users,
  Search,
  History,
  ChevronDown,
  Eye,
  FileText,
  Download,
  ArrowRightLeft,
  Info,
  User,
  BookOpen,
  SlidersHorizontal,
  X,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }

type Student = {
  id: string
  name: string
  institution: "UFPB" | "EXTERNA"
  level: "MEDIO" | "SUPERIOR" | "POS"
  doc?: string
}

type ReplacementChange = {
  id: string
  at: string
  by: string
  action: "REQUESTED" | "EDITED"
  note?: string
  fromStudent?: Student
  toStudent?: Student
}

type ReplacementRequest = {
  id: string
  callId: string
  projectId: string
  projectTitle: string
  advisor: string
  currentStudent: Student
  newStudent: Student
  reason: string
  createdAt: string
  updatedAt?: string
  history: ReplacementChange[]
}

function chip(text: string) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-neutral-50 text-neutral border-neutral-light">
      {text}
    </span>
  )
}

function statusChip() {
  return chip("Registrado")
}

function formatStudent(s: Student) {
  const inst = s.institution === "UFPB" ? "UFPB" : "Externa"
  const lvl =
    s.level === "MEDIO"
      ? "Ens. médio"
      : s.level === "SUPERIOR"
      ? "Graduação"
      : "Pós"
  return `${s.name} • ${inst} • ${lvl}`
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
      <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-neutral-light/60 p-2">{icon}</span>
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
  subtitle,
  meta,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  meta?: string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">{title}</p>
        {subtitle ? (
          <p className="mt-1 break-words text-sm text-neutral">{subtitle}</p>
        ) : null}
        {meta ? <p className="mt-1 text-xs text-neutral">{meta}</p> : null}
      </div>
    </div>
  )
}

function Row({
  checked,
  onCheck,
  label,
  field,
}: {
  checked: boolean
  onCheck: (value: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[170px_minmax(0,1fr)] md:items-start">
      <label className="flex items-center gap-2 pt-1 text-[13px] font-medium text-primary">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="accent-primary"
        />
        <span>{label}</span>
      </label>
      <div className={checked ? "opacity-100" : "pointer-events-none opacity-50"}>
        {field}
      </div>
    </div>
  )
}

export default function StudentReplacements() {
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])

  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")

  const [requests] = useState<ReplacementRequest[]>([
    {
      id: "r1",
      callId: "call_2026_01",
      projectId: "p2",
      projectTitle: "Otimização de energia em datacenters",
      advisor: "Prof. Diego Ramos",
      currentStudent: {
        id: "s1",
        name: "Discente Luiza",
        institution: "UFPB",
        level: "SUPERIOR",
        doc: "20201234",
      },
      newStudent: {
        id: "s9",
        name: "Discente Marcos",
        institution: "UFPB",
        level: "SUPERIOR",
        doc: "20209999",
      },
      reason: "Desligamento do discente por incompatibilidade de horários.",
      createdAt: "2026-01-18T15:30:00Z",
      updatedAt: "2026-01-18T15:30:00Z",
      history: [
        {
          id: "h1",
          at: "2026-01-18T15:30:00Z",
          by: "Coordenador do projeto",
          action: "REQUESTED",
          note: "Solicitação registrada no sistema.",
          fromStudent: {
            id: "s1",
            name: "Discente Luiza",
            institution: "UFPB",
            level: "SUPERIOR",
          },
          toStudent: {
            id: "s9",
            name: "Discente Marcos",
            institution: "UFPB",
            level: "SUPERIOR",
          },
        },
      ],
    },
    {
      id: "r2",
      callId: "call_2026_01",
      projectId: "p1",
      projectTitle: "Detecção de presença com TinyML",
      advisor: "Profa. Ana Souza",
      currentStudent: {
        id: "s2",
        name: "Discente João",
        institution: "UFPB",
        level: "SUPERIOR",
      },
      newStudent: {
        id: "s3",
        name: "Discente Maria",
        institution: "UFPB",
        level: "SUPERIOR",
      },
      reason: "Substituição por desempenho acadêmico.",
      createdAt: "2026-01-10T11:10:00Z",
      updatedAt: "2026-01-12T09:02:00Z",
      history: [
        {
          id: "h2",
          at: "2026-01-10T11:10:00Z",
          by: "Coordenador do projeto",
          action: "REQUESTED",
          note: "Solicitação registrada no sistema.",
          fromStudent: {
            id: "s2",
            name: "Discente João",
            institution: "UFPB",
            level: "SUPERIOR",
          },
          toStudent: {
            id: "s3",
            name: "Discente Maria",
            institution: "UFPB",
            level: "SUPERIOR",
          },
        },
        {
          id: "h4",
          at: "2026-01-12T09:02:00Z",
          by: "Sistema",
          action: "EDITED",
          note: "Registro atualizado.",
        },
      ],
    },
    {
      id: "r3",
      callId: "call_2025_03",
      projectId: "p8",
      projectTitle: "Modelagem preditiva para indicadores acadêmicos",
      advisor: "Prof. Carlos Lima",
      currentStudent: {
        id: "s7",
        name: "Discente Helena",
        institution: "UFPB",
        level: "SUPERIOR",
      },
      newStudent: {
        id: "s8",
        name: "Discente Pedro",
        institution: "EXTERNA",
        level: "SUPERIOR",
      },
      reason: "Readequação do vínculo discente.",
      createdAt: "2025-08-04T14:10:00Z",
      updatedAt: "2025-08-07T09:25:00Z",
      history: [
        {
          id: "h9",
          at: "2025-08-04T14:10:00Z",
          by: "Coordenador do projeto",
          action: "REQUESTED",
          note: "Solicitação registrada no sistema.",
        },
      ],
    },
  ])

  const [q, setQ] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const [useProjeto, setUseProjeto] = useState(false)
  const [projeto, setProjeto] = useState("")

  const [useOrientador, setUseOrientador] = useState(false)
  const [orientador, setOrientador] = useState("")

  const [useDiscenteAtual, setUseDiscenteAtual] = useState(false)
  const [discenteAtual, setDiscenteAtual] = useState("")

  const [useNovoDiscente, setUseNovoDiscente] = useState(false)
  const [novoDiscente, setNovoDiscente] = useState("")

  const [useAno, setUseAno] = useState(false)
  const [ano, setAno] = useState("")

  const [openId, setOpenId] = useState<string | null>(null)

  function clearAll() {
    setQ("")
    setAdvancedOpen(false)

    setUseProjeto(false)
    setProjeto("")

    setUseOrientador(false)
    setOrientador("")

    setUseDiscenteAtual(false)
    setDiscenteAtual("")

    setUseNovoDiscente(false)
    setNovoDiscente("")

    setUseAno(false)
    setAno("")
  }

  const list = useMemo(() => {
    const nq = q.trim().toLowerCase()

    return requests
      .filter((r) => r.callId === selectedCallId)
      .filter((r) => {
        if (!nq) return true

        return (
          r.projectTitle.toLowerCase().includes(nq) ||
          r.advisor.toLowerCase().includes(nq) ||
          r.currentStudent.name.toLowerCase().includes(nq) ||
          r.newStudent.name.toLowerCase().includes(nq) ||
          r.projectId.toLowerCase().includes(nq)
        )
      })
      .filter((r) => {
        if (useProjeto && projeto.trim()) {
          if (!r.projectTitle.toLowerCase().includes(projeto.trim().toLowerCase()))
            return false
        }

        if (useOrientador && orientador.trim()) {
          if (!r.advisor.toLowerCase().includes(orientador.trim().toLowerCase()))
            return false
        }

        if (useDiscenteAtual && discenteAtual.trim()) {
          if (
            !r.currentStudent.name
              .toLowerCase()
              .includes(discenteAtual.trim().toLowerCase())
          )
            return false
        }

        if (useNovoDiscente && novoDiscente.trim()) {
          if (
            !r.newStudent.name
              .toLowerCase()
              .includes(novoDiscente.trim().toLowerCase())
          )
            return false
        }

        if (useAno && ano.trim()) {
          const requestYear = new Date(r.createdAt).getFullYear().toString()
          if (requestYear !== ano.trim()) return false
        }

        return true
      })
      .sort((a, b) =>
        (a.updatedAt ?? a.createdAt) < (b.updatedAt ?? b.createdAt) ? 1 : -1
      )
  }, [
    requests,
    selectedCallId,
    q,
    useProjeto,
    projeto,
    useOrientador,
    orientador,
    useDiscenteAtual,
    discenteAtual,
    useNovoDiscente,
    novoDiscente,
    useAno,
    ano,
  ])

  const openReq = useMemo(
    () => list.find((r) => r.id === openId) ?? null,
    [list, openId]
  )

  const stats = useMemo(() => {
    const all = requests.filter((r) => r.callId === selectedCallId)
    return {
      total: all.length,
    }
  }, [requests, selectedCallId])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
      <Helmet>
        <title>Substituições de Discentes • PROPESQ</title>
      </Helmet>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
              <ArrowRightLeft size={14} />
              Substituições
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                Substituições de Discentes
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-neutral">
                Página de visualização: acompanhe as trocas (discente antigo →
                discente novo) e o histórico registrado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4 rounded-xl border border-neutral-light bg-white p-5">
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Contexto</h2>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
          <label className="text-sm md:col-span-8">
            <span className="mb-1 block text-xs text-neutral">Edital</span>
            <div className="relative">
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
              />
              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setOpenId(null)
                }}
                className="w-full appearance-none rounded-lg border border-neutral-light bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
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

          <div className="md:col-span-4">
            <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
              <p className="text-xs text-neutral">Total</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Section title="Solicitações" icon={<Users size={18} />}>
            <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-light bg-white shadow-card">
              <div className="flex flex-col gap-3 border-b border-neutral-light p-4 md:flex-row md:items-center md:gap-4 md:p-5">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                  />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por projeto, orientador, discente ou código…"
                    className="w-full rounded-xl border border-neutral-light py-2 pl-8 pr-3 text-[13px] leading-5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-[13px] font-semibold text-primary hover:bg-neutral-light/50"
                  >
                    <SlidersHorizontal size={15} />
                    Busca avançada
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-[13px] font-semibold text-neutral hover:bg-neutral-light/50"
                  >
                    <X size={15} />
                    Limpar
                  </button>
                </div>
              </div>

              {advancedOpen && (
                <div className="space-y-4 p-4 md:p-5">
                  <div className="text-xs text-neutral/70">
                    Marque a caixa à esquerda para{" "}
                    <span className="font-semibold">ativar</span> cada filtro.
                  </div>

                  <div className="grid gap-3">
                    <Row
                      checked={useProjeto}
                      onCheck={setUseProjeto}
                      label="Projeto:"
                      field={
                        <input
                          className="w-full max-w-3xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
                          value={projeto}
                          onChange={(e) => setProjeto(e.target.value)}
                          placeholder="Título do projeto…"
                        />
                      }
                    />

                    <Row
                      checked={useOrientador}
                      onCheck={setUseOrientador}
                      label="Orientador:"
                      field={
                        <input
                          className="w-full max-w-2xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
                          value={orientador}
                          onChange={(e) => setOrientador(e.target.value)}
                          placeholder="Nome do orientador…"
                        />
                      }
                    />

                    <Row
                      checked={useDiscenteAtual}
                      onCheck={setUseDiscenteAtual}
                      label="Discente atual:"
                      field={
                        <input
                          className="w-full max-w-2xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
                          value={discenteAtual}
                          onChange={(e) => setDiscenteAtual(e.target.value)}
                          placeholder="Nome do discente atual…"
                        />
                      }
                    />

                    <Row
                      checked={useNovoDiscente}
                      onCheck={setUseNovoDiscente}
                      label="Novo discente:"
                      field={
                        <input
                          className="w-full max-w-2xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
                          value={novoDiscente}
                          onChange={(e) => setNovoDiscente(e.target.value)}
                          placeholder="Nome do novo discente…"
                        />
                      }
                    />

                    <Row
                      checked={useAno}
                      onCheck={setUseAno}
                      label="Ano:"
                      field={
                        <input
                          className="w-24 rounded-sm border border-border px-2 py-1.5 text-[13px]"
                          value={ano}
                          onChange={(e) => setAno(e.target.value)}
                          placeholder="Ex.: 2026"
                        />
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {list.map((r) => {
                const active = r.id === openId

                return (
                  <button
                    key={r.id}
                    onClick={() =>
                      setOpenId((prev) => (prev === r.id ? null : r.id))
                    }
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-neutral-light bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-primary">
                          {r.projectTitle}
                        </p>

                        <p className="mt-1 text-xs text-neutral">
                          Orientador:{" "}
                          <span className="font-semibold text-primary">
                            {r.advisor}
                          </span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 text-xs text-neutral">
                            <User size={14} /> {r.currentStudent.name}
                          </span>
                          <ArrowRightLeft
                            size={14}
                            className="text-neutral"
                          />
                          <span className="inline-flex items-center gap-2 text-xs text-neutral">
                            <User size={14} /> {r.newStudent.name}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs text-neutral">
                          {r.reason}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {statusChip()}
                        <span className="text-[11px] text-neutral">
                          {new Date(
                            r.updatedAt ?? r.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {list.length === 0 && (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-center text-sm text-neutral">
                  Nenhuma solicitação encontrada para este edital.
                </div>
              )}
            </div>
          </Section>
        </div>

        <div className="lg:col-span-5">
          <Section title="Detalhes & Histórico" icon={<History size={18} />}>
            {!openReq ? (
              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-center text-sm text-neutral">
                Pressione em uma solicitação para ver o histórico do projeto.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        {openReq.projectTitle}
                      </p>
                      <p className="mt-1 text-xs text-neutral">
                        Orientador:{" "}
                        <span className="font-semibold text-primary">
                          {openReq.advisor}
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">{statusChip()}</div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="rounded-lg border border-neutral-light bg-white p-3">
                      <p className="mb-1 text-xs text-neutral">
                        Discente atual (antes)
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatStudent(openReq.currentStudent)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-neutral-light bg-white p-3">
                      <p className="mb-1 text-xs text-neutral">
                        Novo discente (indicado)
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatStudent(openReq.newStudent)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-neutral">
                    Motivo: <span className="text-neutral">{openReq.reason}</span>
                  </p>
                </div>

                <div className="space-y-4 rounded-xl border border-neutral-light bg-white p-4">
                  <p className="text-sm font-semibold text-primary">
                    Linha do tempo
                  </p>

                  <div className="space-y-4">
                    {openReq.history
                      .slice()
                      .sort((a, b) => (a.at < b.at ? 1 : -1))
                      .map((h) => {
                        const when = new Date(h.at).toLocaleString()
                        const icon = <Eye size={18} className="text-neutral" />
                        const title =
                          h.action === "REQUESTED"
                            ? "Substituição registrada"
                            : "Registro atualizado"

                        const subtitle =
                          h.fromStudent && h.toStudent
                            ? `${h.fromStudent.name} → ${h.toStudent.name}`
                            : h.note

                        return (
                          <TimelineItem
                            key={h.id}
                            icon={icon}
                            title={title}
                            subtitle={subtitle}
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