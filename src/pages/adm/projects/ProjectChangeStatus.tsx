// src/pages/admin/projects/ProjectChangeStatus.tsx
import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  FileText,
  FolderKanban,
  History,
  MessagesSquare,
  Search,
  ShieldCheck,
} from "lucide-react"

import { projetos } from "@/mock/data"

/* ================= TIPOS ================= */

type Projeto = {
  id: string | number
  titulo: string
  status?: string
  tipo?: "interno" | "externo"
  pesquisador?: string
  centro?: string
  unidade?: string
  prazo?: string
  dataInicio?: string
  dataFim?: string
}

type StatusPhaseKey = "CADASTRO" | "AVALIACAO" | "EXECUCAO" | "FINALIZACAO"

type StatusOption = {
  key: string
  label: string
  phase: StatusPhaseKey
  description?: string
}

type StatusAudit = {
  id: string
  when: string
  by: string
  from: string
  to: string
  note?: string
}

/* ================= UTIL ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

const normalize = (s: string) =>
  (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos

const statusPillClass = (status?: string) => {
  const s = normalize(status || "")
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("reprov") || s.includes("insuf") || s.includes("nao valid") || s.includes("não valid"))
    return "bg-red-100 text-red-800"
  if (s.includes("aguard") || s.includes("distrib") || s.includes("submet") || s.includes("anal") || s.includes("anál"))
    return "bg-amber-100 text-amber-800"
  if (s.includes("final") || s.includes("desativ") || s.includes("exclu")) return "bg-neutral-light text-neutral"
  return "bg-neutral-light text-neutral"
}

function formatPeriod(p: Projeto) {
  const ini = (p.dataInicio || "").slice(0, 10)
  const fim = (p.dataFim || p.prazo || "").slice(0, 10)
  if (!ini && !fim) return "—"
  return `${ini || "—"} → ${fim || "—"}`
}

/* ================= DADOS ================= */

const STATUS_OPTIONS: StatusOption[] = [
  // CADASTRO
  { key: "SUBMETIDO", label: "Submetido", phase: "CADASTRO", description: "Projeto criado e submetido para triagem." },
  { key: "AGUARDANDO_VALIDACAO", label: "Aguardando validação", phase: "CADASTRO", description: "Aguardando conferência/validação administrativa." },
  { key: "VALIDADO", label: "Validado", phase: "CADASTRO", description: "Cadastro conferido e aceito." },
  { key: "NAO_VALIDADO", label: "Não validado", phase: "CADASTRO", description: "Cadastro recusado/necessita correções." },
  { key: "CADASTRO_EM_ANDAMENTO", label: "Cadastro em andamento", phase: "CADASTRO", description: "Projeto em preenchimento/rascunho." },
  { key: "NECESSITA_CORRECAO", label: "Necessita correção", phase: "CADASTRO", description: "Cadastro devolvido ao proponente para ajustes." },
  { key: "CADASTRADO", label: "Cadastrado", phase: "CADASTRO", description: "Cadastro concluído (ainda pode não estar validado)." },

  // AVALIAÇÃO
  { key: "DIST_AUTOMATICA", label: "Distribuído para avaliação automática", phase: "AVALIACAO", description: "Entrou na fila/execução da avaliação automática." },
  { key: "DIST_MANUAL", label: "Distribuído para avaliação manual", phase: "AVALIACAO", description: "Atribuído a avaliadores para revisão manual." },
  { key: "AVALIACAO_INSUFICIENTE", label: "Avaliação insuficiente", phase: "AVALIACAO", description: "Pontuação/parecer insuficiente para aprovação." },
  { key: "APROVADO", label: "Aprovado", phase: "AVALIACAO", description: "Projeto aprovado para execução." },
  { key: "REPROVADO", label: "Reprovado", phase: "AVALIACAO", description: "Projeto reprovado." },
  { key: "AGUARDANDO_AVALIACAO", label: "Aguardando avaliação", phase: "AVALIACAO", description: "Cadastro finalizado e aguardando entrar em avaliação." },

  // EXECUÇÃO
  { key: "EM_EXECUCAO", label: "Em execução", phase: "EXECUCAO", description: "Projeto em andamento." },
  { key: "CADASTRADO_SEM_PLANO", label: "Cadastrado sem plano", phase: "EXECUCAO", description: "Cadastro ok, mas sem plano de trabalho associado." },

  // FINALIZAÇÃO
  { key: "FINALIZADO", label: "Finalizado", phase: "FINALIZACAO", description: "Projeto finalizado." },
  { key: "FINALIZADO_RENOVADO", label: "Finalizado (renovado)", phase: "FINALIZACAO", description: "Finalizado e renovado para novo ciclo." },
  { key: "DESATIVADO", label: "Desativado", phase: "FINALIZACAO", description: "Projeto desativado por decisão administrativa." },
  { key: "EXCLUIDO", label: "Excluído", phase: "FINALIZACAO", description: "Registro excluído." },
]

const PHASE_LABEL: Record<StatusPhaseKey, { title: string; help: string }> = {
  CADASTRO: { title: "Cadastro", help: "Estados de submissão e validação do cadastro." },
  AVALIACAO: { title: "Avaliação", help: "Estados do processo de avaliação (automática/manual)." },
  EXECUCAO: { title: "Execução", help: "Estados de acompanhamento do projeto aprovado." },
  FINALIZACAO: { title: "Finalização", help: "Estados finais do ciclo de vida do projeto." },
}

/* ================= COMPONENTES ================= */

function PhaseBlock({
  phase,
  currentKey,
  selectedKey,
  onSelect,
}: {
  phase: StatusPhaseKey
  currentKey: string
  selectedKey: string
  onSelect: (key: string) => void
}) {
  const items = STATUS_OPTIONS.filter((s) => s.phase === phase)

  return (
    <div className="rounded-2xl border border-neutral-light bg-neutral-light shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-light">
        <h3 className="text-sm font-bold text-primary">{PHASE_LABEL[phase].title}</h3>
        <p className="text-xs text-neutral/70 mt-1">{PHASE_LABEL[phase].help}</p>
      </div>

      <div className="p-3">
        {items.map((it) => {
          const isCurrent = it.key === currentKey
          const isSelected = it.key === selectedKey
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onSelect(it.key)}
              className={cx(
                "w-full text-left rounded-xl px-4 py-3 border transition-all flex items-start justify-between gap-4",
                isSelected ? "border-primary bg-primary/5" : "border-neutral-light hover:bg-neutral-light/40"
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">{it.label}</p>
                {it.description && (
                  <p className="text-xs text-neutral/70 mt-1 leading-relaxed">{it.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isCurrent && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                    Atual
                  </span>
                )}
                {isSelected && <Check size={16} className="text-primary mt-0.5" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ================= PÁGINA ================= */

export default function ProjectChangeStatus() {
  const { id } = useParams()
  const nav = useNavigate()

  // permite duas formas:
  // - /adm/projetos/:id/status (id já vem na rota)
  // - /adm/projetos/status (busca pelo código ou por texto)
  const [searchText, setSearchText] = useState(id ? String(id) : "")
  const [searchOpen, setSearchOpen] = useState(!id)

  const list = useMemo(() => projetos as Projeto[], [])

  // Busca:
  // - aceita ID exato (ex.: "4")
  // - aceita parte do título (ex.: "TinyML")
  // - aceita parte do pesquisador (ex.: "Ana Paula")
  // - aceita parte de centro/unidade
  const matches = useMemo(() => {
    const qRaw = (searchText || "").trim()
    if (!qRaw) return [] as Projeto[]

    const q = normalize(qRaw)
    const qIsNumeric = /^[0-9]+$/.test(qRaw)

    const scored = list
      .map((p) => {
        const pid = String(p.id)
        const nTitle = normalize(p.titulo)
        const nPesq = normalize(p.pesquisador || "")
        const nCentro = normalize(p.centro || "")
        const nUnid = normalize(p.unidade || "")
        const nStatus = normalize(p.status || "")

        let score = 0

        // ID
        if (pid === qRaw) score += 1000
        if (qIsNumeric && pid.startsWith(qRaw)) score += 400
        if (qIsNumeric && pid.includes(qRaw)) score += 250

        // Texto (título/pesquisador/etc.)
        if (nTitle === q) score += 700
        if (nTitle.startsWith(q)) score += 450
        if (nTitle.includes(q)) score += 250

        if (nPesq.startsWith(q)) score += 200
        if (nPesq.includes(q)) score += 120

        if (nCentro.startsWith(q)) score += 90
        if (nCentro.includes(q)) score += 60

        if (nUnid.startsWith(q)) score += 90
        if (nUnid.includes(q)) score += 60

        if (nStatus.includes(q)) score += 40

        return { p, score }
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.p)

    return scored
  }, [list, searchText])

  // Projeto ativo = 1º resultado mais relevante
  const project = useMemo(() => {
    return matches[0] || null
  }, [matches])

  // status atual (fallback para SUBMETIDO)
  const currentStatusKey = useMemo(() => {
    const cur = project?.status || ""
    const n = normalize(cur)

    if (!n) return "SUBMETIDO"
    if (n.includes("submet")) return "SUBMETIDO"
    if (n.includes("aguard") && n.includes("valid")) return "AGUARDANDO_VALIDACAO"
    if (n.includes("nao valid") || n.includes("não valid")) return "NAO_VALIDADO"
    if (n.includes("cadastro em andamento")) return "CADASTRO_EM_ANDAMENTO"
    if (n.includes("necessita correc") || n.includes("necessita correç")) return "NECESSITA_CORRECAO"
    if (n === "cadastrado" || n.includes("cadastrado")) return "CADASTRADO"
    if (n.includes("aguardando avaliacao") || n.includes("aguardando avaliação")) return "AGUARDANDO_AVALIACAO"
    if (n.includes("valid")) return "VALIDADO"
    if (n.includes("autom")) return "DIST_AUTOMATICA"
    if (n.includes("manual")) return "DIST_MANUAL"
    if (n.includes("insuf")) return "AVALIACAO_INSUFICIENTE"
    if (n.includes("aprov")) return "APROVADO"
    if (n.includes("reprov")) return "REPROVADO"
    if (n.includes("execu")) return "EM_EXECUCAO"
    if (n.includes("sem plano")) return "CADASTRADO_SEM_PLANO"
    if (n.includes("renov")) return "FINALIZADO_RENOVADO"
    if (n.includes("final")) return "FINALIZADO"
    if (n.includes("desativ")) return "DESATIVADO"
    if (n.includes("exclu")) return "EXCLUIDO"
    return "SUBMETIDO"
  }, [project?.status])

  const currentLabel = useMemo(() => {
    const opt = STATUS_OPTIONS.find((o) => o.key === currentStatusKey)
    return opt?.label || (project?.status || "Submetido")
  }, [currentStatusKey, project?.status])

  const [selectedKey, setSelectedKey] = useState<string>(currentStatusKey)
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  // mantém o selected sincronizado quando troca de projeto
  React.useEffect(() => {
    setSelectedKey(currentStatusKey)
    setNote("")
  }, [currentStatusKey])

  // Mock de histórico
  const history = useMemo<StatusAudit[]>(() => {
    if (!project) return []
    const baseFrom = "SUBMETIDO"
    return [
      { id: "h1", when: "2025-01-01 10:22", by: project.pesquisador || "Usuário", from: "—", to: baseFrom, note: "Cadastro submetido." },
      { id: "h2", when: "2025-01-03 15:10", by: "Administrador", from: baseFrom, to: currentStatusKey, note: "Atualização de triagem." },
    ]
  }, [project, currentStatusKey])

  const canApply = project && selectedKey && selectedKey !== currentStatusKey && !saving

  const applyChange = async () => {
    if (!canApply) return
    setSaving(true)
    try {
      // chamar API (PATCH/POST) para atualizar status
      await new Promise((r) => setTimeout(r, 700))

      // Como estamos no mock, não mutamos "projetos".
      // Simulamos sucesso e enviamos o usuário de volta para o detalhe:
      nav(`/adm/projetos/${project!.id}`, { replace: true })
    } finally {
      setSaving(false)
    }
  }

  const pickProject = (p: Projeto) => {
    setSearchText(String(p.id))
    setSearchOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Alterar Situação Projetos • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-6 py-6">

        {/* Botão voltar  */}
        <div className="mb-4">
          <Link
            to="/adm/projetos"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-neutral-light bg-white px-8 py-7 shadow-sm mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <MessagesSquare size={14} />
            Atualiação
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">

              <h1 className="mt-3 text-[28px] leading-tight font-bold tracking-tight text-primary">
                Atualizar projeto
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Atualize a situação do projeto, revise as informações e registre,
                quando necessário, uma observação para manter o histórico das
                alterações realizadas.
              </p>
            </div>

            {project && (
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Link
                  to={`/adm/projetos/${project.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50"
                >
                  <FolderKanban size={16} />
                  Ver projeto
                </Link>

                <span
                  className={cx(
                    "rounded-full px-4 py-2 text-xs font-bold",
                    statusPillClass(currentLabel)
                  )}
                >
                  {currentLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Busca de projeto */}
        <div className="rounded-2xl border border-neutral-light bg-white shadow-card overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-neutral-light"
          >
            <div className="flex items-center gap-2">
              <Search size={18} className="text-primary" />
              <div className="text-left">
                <p className="text-sm font-bold text-primary">Busca de projeto</p>
                <p className="text-xs text-neutral/70">
                  Pesquise por <b>código</b>, <b>título</b>, <b>coordenador</b>, <b>centro</b> ou <b>unidade</b>.
                </p>
              </div>
            </div>
            <ChevronDown size={18} className={cx("text-neutral transition-transform", searchOpen && "rotate-180")} />
          </button>

          {searchOpen && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-3 items-end">
                <div className="relative">
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
                    Buscar
                  </label>
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder='ex.: "4", "TinyML", "Ana Paula", "CCEN"'
                    className="mt-2 w-full rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />

                  {/* Sugestões */}
                  {searchText.trim() && (
                    <div className="mt-2 rounded-xl border border-neutral-light bg-white shadow-card overflow-hidden">
                      {matches.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-red-700">
                          Nenhum projeto encontrado para essa busca.
                        </div>
                      ) : (
                        <div className="divide-y divide-neutral-light">
                          {matches.map((p) => (
                            <button
                              key={String(p.id)}
                              type="button"
                              onClick={() => pickProject(p)}
                              className="w-full text-left px-4 py-3 hover:bg-neutral-light/40"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-primary truncate">
                                    #{p.id} • {p.titulo}
                                  </p>
                                  <p className="text-xs text-neutral/70 mt-1 truncate">
                                    Coord.: {p.pesquisador || "—"} • Centro: {p.centro || "—"} • Unidade: {p.unidade || "—"}
                                  </p>
                                </div>
                                <span className={cx("shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold", statusPillClass(p.status))}>
                                  {p.status || "—"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  Fechar
                </button>
              </div>

              {project && (
                <p className="mt-3 text-xs text-neutral/70">
                  Carregado: <b>#{project.id}</b> • {project.titulo}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        {!project ? (
          <div className="rounded-2xl border border-neutral-light bg-white shadow-card p-10 text-center">
            <p className="text-base text-neutral">Selecione um projeto para alterar a situação.</p>
            <p className="text-sm text-neutral/70 mt-1">Use a seção "Busca de projeto".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Situação atual + aplicar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-neutral-light bg-white shadow-card p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-primary">Situação atual</h2>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">Projeto</p>
                  <p className="text-sm font-semibold text-primary mt-1">{project.titulo}</p>
                  <p className="text-xs text-neutral/70 mt-1">
                    Coord.: {project.pesquisador || "—"} • Tipo: {project.tipo || "—"} • Período: {formatPeriod(project)}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">Situação atual</p>
                  <span className={cx("mt-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold", statusPillClass(currentLabel))}>
                    {currentLabel}
                  </span>
                </div>

                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
                    Observação (opcional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-2 w-full min-h-[110px] rounded-xl border border-neutral-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="Motivo/nota para auditoria…"
                  />
                  <p className="mt-2 text-[11px] text-neutral/70">
                    Dica: sempre registrar motivo em mudanças críticas (ex.: Reprovado, Excluído).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={applyChange}
                  disabled={!canApply}
                  className={cx(
                    "mt-6 w-full px-4 py-3 rounded-xl text-sm font-semibold",
                    canApply ? "bg-primary text-white hover:opacity-95" : "bg-neutral-light text-neutral cursor-not-allowed"
                  )}
                >
                  {saving ? "Aplicando..." : "Aplicar alteração"}
                </button>

                {!canApply && (
                  <p className="mt-3 text-xs text-neutral/70">
                    Selecione um novo status (diferente do atual) para habilitar.
                  </p>
                )}
              </div>

              {/* Histórico */}
              <div className="rounded-2xl border border-neutral-light bg-white shadow-card p-6">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-primary">Histórico de status</h2>
                </div>

                <div className="mt-4 space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="rounded-xl border border-neutral-light p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-primary">{h.to}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral/70">
                          <Clock size={12} />
                          {h.when}
                        </span>
                      </div>
                      <p className="text-xs text-neutral/70 mt-1">
                        {h.by} • {h.from} → {h.to}
                      </p>
                      {h.note && <p className="text-xs text-neutral mt-2">{h.note}</p>}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-neutral/70">
                  *Mock. Depois ligar no log/auditoria real (quem alterou, quando e motivo).
                </p>
              </div>
            </div>

            {/* Opções de status por fase */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-neutral-light bg-white shadow-card p-6">
                <p className="text-sm font-bold text-primary">Selecione o novo status</p>
                <p className="text-xs text-neutral/70 mt-1">
                  Os status estão agrupados por fase do ciclo de vida do projeto.
                </p>
                <div className="mt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">Selecionado</span>
                  <div className="mt-1">
                    <span className={cx("inline-flex px-3 py-1 rounded-full text-xs font-semibold", statusPillClass(STATUS_OPTIONS.find((o) => o.key === selectedKey)?.label))}>
                      {STATUS_OPTIONS.find((o) => o.key === selectedKey)?.label || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <PhaseBlock
                  phase="CADASTRO"
                  currentKey={currentStatusKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
                <PhaseBlock
                  phase="AVALIACAO"
                  currentKey={currentStatusKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
                <PhaseBlock
                  phase="EXECUCAO"
                  currentKey={currentStatusKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
                <PhaseBlock
                  phase="FINALIZACAO"
                  currentKey={currentStatusKey}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}