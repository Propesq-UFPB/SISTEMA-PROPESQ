import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Workflow,
  ShieldCheck,
  Save,
  Info,
  Check,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  ClipboardCheck,
  UserCheck,
  Send,
  RotateCcw,
  BookOpen,
  ChevronDown,
} from "lucide-react"

type StateKey =
  | "DRAFT"
  | "OPEN_REGISTRATIONS"
  | "UNDER_REVIEW"
  | "PARTIAL_RESULT"
  | "FINAL_RESULT"
  | "CLOSED"

type PermissionKey =
  | "SUBMISSION"
  | "NOMINATION"
  | "EVALUATION"
  | "VIEW_RESULTS"
  | "UPLOAD_REPORTS"
  | "ENIC_SUBMISSION"

type Call = {
  id: string
  title: string
  baseYear: number
  currentState: StateKey
}

const STATE_LABEL: Record<StateKey, string> = {
  DRAFT: "Rascunho",
  OPEN_REGISTRATIONS: "Inscrições abertas",
  UNDER_REVIEW: "Em avaliação",
  PARTIAL_RESULT: "Resultado parcial",
  FINAL_RESULT: "Resultado final",
  CLOSED: "Encerrado",
}

const STATE_HELP: Record<StateKey, string> = {
  DRAFT: "Configuração interna. Nada público para docentes/discentes.",
  OPEN_REGISTRATIONS: "Docentes podem submeter projetos durante o período de submissão.",
  UNDER_REVIEW: "Submissão fechada. Avaliadores podem avaliar propostas.",
  PARTIAL_RESULT: "Resultados parciais visíveis; indicação pode ser liberada conforme regra do edital.",
  FINAL_RESULT: "Resultado final publicado; indicação pode permanecer aberta por janela definida.",
  CLOSED: "Encerramento do edital. Somente consulta/histórico.",
}

const PERMISSION_LABEL: Record<PermissionKey, string> = {
  SUBMISSION: "Liberar submissão de projetos",
  NOMINATION: "Liberar indicação de bolsistas",
  EVALUATION: "Liberar avaliação",
  VIEW_RESULTS: "Permitir visualizar resultados",
  UPLOAD_REPORTS: "Liberar entrega de relatórios",
  ENIC_SUBMISSION: "Liberar submissão ENIC",
}

const PERMISSION_HELP: Record<PermissionKey, string> = {
  SUBMISSION: "Mostra/habilita o botão de “Submeter projeto” para docentes.",
  NOMINATION: "Habilita a etapa de indicação após resultado.",
  EVALUATION: "Habilita formulários/área de avaliação para avaliadores/gestão.",
  VIEW_RESULTS: "Exibe resultado parcial/final para público elegível.",
  UPLOAD_REPORTS: "Permite envio de relatório parcial/final conforme cronograma.",
  ENIC_SUBMISSION: "Permite envio de resumo para ENIC dentro do prazo.",
}

const PERMISSION_ICON: Record<PermissionKey, React.ReactNode> = {
  SUBMISSION: <Send size={16} />,
  NOMINATION: <UserCheck size={16} />,
  EVALUATION: <ClipboardCheck size={16} />,
  VIEW_RESULTS: <Eye size={16} />,
  UPLOAD_REPORTS: <ShieldCheck size={16} />,
  ENIC_SUBMISSION: <Workflow size={16} />,
}

function defaultWorkflow() {
  return {
    DRAFT: {
      SUBMISSION: false,
      NOMINATION: false,
      EVALUATION: false,
      VIEW_RESULTS: false,
      UPLOAD_REPORTS: false,
      ENIC_SUBMISSION: false,
    },
    OPEN_REGISTRATIONS: {
      SUBMISSION: true,
      NOMINATION: false,
      EVALUATION: false,
      VIEW_RESULTS: false,
      UPLOAD_REPORTS: false,
      ENIC_SUBMISSION: false,
    },
    UNDER_REVIEW: {
      SUBMISSION: false,
      NOMINATION: false,
      EVALUATION: true,
      VIEW_RESULTS: false,
      UPLOAD_REPORTS: false,
      ENIC_SUBMISSION: false,
    },
    PARTIAL_RESULT: {
      SUBMISSION: false,
      NOMINATION: true,
      EVALUATION: false,
      VIEW_RESULTS: true,
      UPLOAD_REPORTS: true,
      ENIC_SUBMISSION: true,
    },
    FINAL_RESULT: {
      SUBMISSION: false,
      NOMINATION: true,
      EVALUATION: false,
      VIEW_RESULTS: true,
      UPLOAD_REPORTS: true,
      ENIC_SUBMISSION: true,
    },
    CLOSED: {
      SUBMISSION: false,
      NOMINATION: false,
      EVALUATION: false,
      VIEW_RESULTS: true,
      UPLOAD_REPORTS: false,
      ENIC_SUBMISSION: false,
    },
  } as Record<StateKey, Record<PermissionKey, boolean>>
}

function countTrue(obj: Record<string, boolean>) {
  return Object.values(obj).filter(Boolean).length
}

function badge(active: boolean) {
  return active
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-neutral-50 text-neutral border-neutral-light"
}

export default function CallWorkflow() {
  // ===== Vários editais (mock) =====
  const [calls, setCalls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026, currentState: "OPEN_REGISTRATIONS" },
    { id: "call_2026_02", title: "Edital Inovação 02/2026", baseYear: 2026, currentState: "UNDER_REVIEW" },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025, currentState: "FINAL_RESULT" },
  ])

  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id ?? "")
  const selectedCall = useMemo(
    () => calls.find((c) => c.id === selectedCallId) ?? null,
    [calls, selectedCallId]
  )

  // workflow por edital (cada edital pode ter regras diferentes)
  const [workflowByCall, setWorkflowByCall] = useState<Record<string, Record<StateKey, Record<PermissionKey, boolean>>>>(
    () => ({
      call_2026_01: defaultWorkflow(),
      call_2026_02: defaultWorkflow(),
      call_2025_03: defaultWorkflow(),
    })
  )

  // UI state
  const [dirty, setDirty] = useState(false)

  const currentState = selectedCall?.currentState ?? "DRAFT"
  const workflowForCall = workflowByCall[selectedCallId] ?? defaultWorkflow()
  const perms = workflowForCall[currentState]
  const enabledCount = useMemo(() => countTrue(perms), [perms])

  const warnings = useMemo(() => {
    const w: string[] = []
    if (currentState === "OPEN_REGISTRATIONS" && perms.NOMINATION) {
      w.push("Indicação habilitada durante inscrições abertas. Normalmente é pós-resultado.")
    }
    if ((currentState === "PARTIAL_RESULT" || currentState === "FINAL_RESULT") && !perms.VIEW_RESULTS) {
      w.push("Estado de resultado sem permissão de visualizar resultados.")
    }
    if (currentState === "UNDER_REVIEW" && perms.SUBMISSION) {
      w.push("Submissão habilitada durante avaliação (pode gerar inconsistência).")
    }
    if (currentState === "CLOSED" && (perms.SUBMISSION || perms.NOMINATION || perms.EVALUATION)) {
      w.push("Edital encerrado com ações críticas liberadas.")
    }
    return w
  }, [currentState, perms])

  function setCallState(next: StateKey) {
    if (!selectedCall) return
    setCalls((prev) => prev.map((c) => (c.id === selectedCall.id ? { ...c, currentState: next } : c)))
    setDirty(true)
    // TODO: API -> PATCH /calls/:id/state
  }

  function togglePermission(key: PermissionKey) {
    setWorkflowByCall((prev) => ({
      ...prev,
      [selectedCallId]: {
        ...(prev[selectedCallId] ?? defaultWorkflow()),
        [currentState]: {
          ...(prev[selectedCallId]?.[currentState] ?? defaultWorkflow()[currentState]),
          [key]: !((prev[selectedCallId]?.[currentState] ?? defaultWorkflow()[currentState])[key]),
        },
      },
    }))
    setDirty(true)
    // TODO: API -> PATCH workflow por edital
  }

  function setAllForState(value: boolean) {
    setWorkflowByCall((prev) => ({
      ...prev,
      [selectedCallId]: {
        ...(prev[selectedCallId] ?? defaultWorkflow()),
        [currentState]: Object.fromEntries(
          (Object.keys(PERMISSION_LABEL) as PermissionKey[]).map((k) => [k, value])
        ) as Record<PermissionKey, boolean>,
      },
    }))
    setDirty(true)
  }

  function restoreDefaultsForCall() {
    if (!selectedCall) return
    setWorkflowByCall((prev) => ({ ...prev, [selectedCall.id]: defaultWorkflow() }))
    setDirty(true)
  }

  function saveWorkflow() {
    // TODO: API persist workflow + currentState do edital selecionado
    setDirty(false)
    alert("Workflow salvo (placeholder).")
  }

  const preview = useMemo(() => {
    return [
      {
        title: "Docente",
        items: [
          { label: "Submeter projeto", allowed: perms.SUBMISSION },
          { label: "Indicar bolsistas", allowed: perms.NOMINATION },
          { label: "Enviar relatórios", allowed: perms.UPLOAD_REPORTS },
          { label: "Submeter ENIC", allowed: perms.ENIC_SUBMISSION },
          { label: "Ver resultados", allowed: perms.VIEW_RESULTS },
        ],
      },
      {
        title: "Discente",
        items: [
          { label: "Enviar relatórios", allowed: perms.UPLOAD_REPORTS },
          { label: "Submeter ENIC", allowed: perms.ENIC_SUBMISSION },
          { label: "Ver resultados", allowed: perms.VIEW_RESULTS },
        ],
      },
      {
        title: "Avaliador/Gestor",
        items: [
          { label: "Avaliar projetos", allowed: perms.EVALUATION },
          { label: "Ver resultados", allowed: perms.VIEW_RESULTS },
        ],
      },
    ]
  }, [perms])

  if (!selectedCall) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <Helmet>
          <title>Gestão de Estados do Edital • PROPESQ</title>
        </Helmet>
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-primary">Gestão de Estados do Edital</h1>
          <p className="text-sm text-neutral">Nenhum edital encontrado.</p>
        </header>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Gestão de Estados do Edital • PROPESQ</title>
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
              <h1 className="text-2xl font-bold text-primary">Gestão de Estados do Edital</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Selecione um edital para alterar o status e configurar permissões que liberam/bloqueiam ações no
                sistema.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={restoreDefaultsForCall}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-neutral-light text-primary hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw size={16} />
              Restaurar padrão
            </button>

            <button
              type="button"
              onClick={saveWorkflow}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors"
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* ===== Seleção do edital ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <h2 className="text-sm font-semibold text-primary">Edital selecionado</h2>
          </div>

          <div className="flex items-center gap-2">
            {dirty && (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle size={14} />
                Alterações não salvas
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-neutral-50 text-neutral border-neutral-light">
              <Info size={14} />
              Permissões ativas: <span className="font-bold">{enabledCount}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="text-sm md:col-span-2">
            <span className="block text-xs text-neutral mb-1">Escolha o edital</span>
            <div className="relative">
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setDirty(false) // troca de contexto; ajuste se preferir manter dirty e avisar
                }}
                className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {calls
                  .slice()
                  .sort((a, b) => b.baseYear - a.baseYear)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {c.baseYear} • {STATE_LABEL[c.currentState]}
                    </option>
                  ))}
              </select>
            </div>
          </label>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Status atual</p>
            <p className="text-sm font-semibold text-primary">{STATE_LABEL[currentState]}</p>
            <p className="text-[11px] text-neutral mt-1">{STATE_HELP[currentState]}</p>
          </div>
        </div>
      </section>

      {/* ===== Estado atual (por edital) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Workflow size={18} />
          <h2 className="text-sm font-semibold text-primary">Alterar status do edital</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATE_LABEL) as StateKey[]).map((k) => {
            const active = k === currentState
            return (
              <button
                key={k}
                onClick={() => setCallState(k)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors
                  ${active ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}
                `}
              >
                {STATE_LABEL[k]}
              </button>
            )
          })}
        </div>

        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Avisos</p>
                <ul className="list-disc list-inside text-sm text-amber-900/90 mt-1 space-y-1">
                  {warnings.map((w, i) => (
                    <li key={`${w}_${i}`}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== Permissões (por estado do edital selecionado) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <h2 className="text-sm font-semibold text-primary">Permissões no estado atual</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllForState(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:opacity-95"
            >
              <Unlock size={16} />
              Liberar tudo
            </button>
            <button
              type="button"
              onClick={() => setAllForState(false)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
            >
              <Lock size={16} />
              Bloquear tudo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(PERMISSION_LABEL) as PermissionKey[]).map((k) => {
            const enabled = perms[k]
            return (
              <button
                key={k}
                type="button"
                onClick={() => togglePermission(k)}
                className={`text-left rounded-xl border p-4 transition-colors
                  ${enabled ? "border-primary/30 bg-primary/10" : "border-neutral-light hover:bg-neutral-50"}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral">{PERMISSION_ICON[k]}</span>
                    <p className="text-sm font-semibold text-primary">{PERMISSION_LABEL[k]}</p>
                  </div>

                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(enabled)}`}>
                    {enabled ? <Check size={14} /> : <X size={14} />}
                    {enabled ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <p className="text-xs text-neutral mt-2">{PERMISSION_HELP[k]}</p>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-neutral">
          As permissões são configuradas <span className="font-semibold">por edital</span> e aplicadas conforme o status atual.
        </p>
      </section>

      {/* ===== Preview ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Eye size={18} />
          <h2 className="text-sm font-semibold text-primary">Prévia (impacto por perfil)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {preview.map((block) => (
            <div key={block.title} className="rounded-xl border border-neutral-light p-4">
              <p className="text-sm font-semibold text-primary">{block.title}</p>
              <div className="mt-3 space-y-2">
                {block.items.map((it) => (
                  <div key={it.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral">{it.label}</span>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(it.allowed)}`}>
                      {it.allowed ? <Unlock size={14} /> : <Lock size={14} />}
                      {it.allowed ? "Liberado" : "Bloqueado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Sugestão: combine <span className="font-semibold">status</span> + <span className="font-semibold">cronograma crítico</span> no backend
            (ex.: “Inscrições abertas” só libera submissão se a janela de submissão estiver ativa).
          </p>
        </div>
      </section>
    </div>
  )
}