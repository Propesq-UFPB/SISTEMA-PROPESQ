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
  CalendarDays,
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

type ScheduleKey =
  | "SUBMISSION_WINDOW"
  | "EVALUATION_WINDOW"
  | "NOMINATION_WINDOW"
  | "REPORTS_WINDOW"
  | "ENIC_WINDOW"
  | "RESULTS_WINDOW"

type ScheduleRange = {
  start: string // yyyy-mm-dd
  end: string // yyyy-mm-dd
}

type CallSchedule = Record<ScheduleKey, ScheduleRange>

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

const SCHEDULE_LABEL: Record<ScheduleKey, string> = {
  SUBMISSION_WINDOW: "Janela de Submissão",
  EVALUATION_WINDOW: "Janela de Avaliação",
  NOMINATION_WINDOW: "Janela de Indicação",
  REPORTS_WINDOW: "Janela de Relatórios",
  ENIC_WINDOW: "Janela ENIC",
  RESULTS_WINDOW: "Janela de Publicação/Consulta de Resultados",
}

const SCHEDULE_HELP: Record<ScheduleKey, string> = {
  SUBMISSION_WINDOW: "Período em que docentes podem submeter projetos.",
  EVALUATION_WINDOW: "Período em que avaliadores podem avaliar propostas.",
  NOMINATION_WINDOW: "Período em que a indicação de bolsistas fica disponível.",
  REPORTS_WINDOW: "Período em que relatórios parcial/final podem ser enviados.",
  ENIC_WINDOW: "Período de submissão de resumo/ENIC.",
  RESULTS_WINDOW: "Período em que resultados podem ser publicados/consultados.",
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

function defaultSchedule(baseYear: number): CallSchedule {
  const y = baseYear
  // mock “safe default”
  const mk = (m1: number, d1: number, m2: number, d2: number) => ({
    start: `${y}-${String(m1).padStart(2, "0")}-${String(d1).padStart(2, "0")}`,
    end: `${y}-${String(m2).padStart(2, "0")}-${String(d2).padStart(2, "0")}`,
  })
  return {
    SUBMISSION_WINDOW: mk(1, 1, 2, 15),
    EVALUATION_WINDOW: mk(2, 16, 3, 10),
    NOMINATION_WINDOW: mk(3, 11, 3, 25),
    REPORTS_WINDOW: mk(4, 1, 11, 30),
    ENIC_WINDOW: mk(8, 1, 8, 31),
    RESULTS_WINDOW: mk(3, 11, 12, 31),
  }
}

function countTrue(obj: Record<string, boolean>) {
  return Object.values(obj).filter(Boolean).length
}

function badge(active: boolean) {
  return active
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-neutral-50 text-neutral border-neutral-light"
}

function toDate(value: string) {
  // yyyy-mm-dd -> Date (local)
  const [yy, mm, dd] = value.split("-").map((n) => Number(n))
  return new Date(yy, (mm ?? 1) - 1, dd ?? 1, 0, 0, 0, 0)
}

function isValidRange(r: ScheduleRange) {
  if (!r.start || !r.end) return false
  const a = toDate(r.start).getTime()
  const b = toDate(r.end).getTime()
  return Number.isFinite(a) && Number.isFinite(b) && a <= b
}

function isNowWithin(r: ScheduleRange, now: Date) {
  if (!isValidRange(r)) return false
  const t = now.getTime()
  const a = toDate(r.start).getTime()
  const b = toDate(r.end).getTime()
  // inclui o dia final
  const endInclusive = b + 24 * 60 * 60 * 1000 - 1
  return t >= a && t <= endInclusive
}

// quais permissões dependem de qual janela do cronograma
const PERMISSION_TO_SCHEDULE: Partial<Record<PermissionKey, ScheduleKey>> = {
  SUBMISSION: "SUBMISSION_WINDOW",
  EVALUATION: "EVALUATION_WINDOW",
  NOMINATION: "NOMINATION_WINDOW",
  UPLOAD_REPORTS: "REPORTS_WINDOW",
  ENIC_SUBMISSION: "ENIC_WINDOW",
  VIEW_RESULTS: "RESULTS_WINDOW",
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
  const [workflowByCall, setWorkflowByCall] = useState<Record<string, Record<StateKey, Record<PermissionKey, boolean>>>>(() => ({
    call_2026_01: defaultWorkflow(),
    call_2026_02: defaultWorkflow(),
    call_2025_03: defaultWorkflow(),
  }))

  // cronograma por edital
  const [scheduleByCall, setScheduleByCall] = useState<Record<string, CallSchedule>>(() => ({
    call_2026_01: defaultSchedule(2026),
    call_2026_02: defaultSchedule(2026),
    call_2025_03: defaultSchedule(2025),
  }))

  // UI state
  const [dirty, setDirty] = useState(false)

  const now = useMemo(() => new Date(), [])
  const currentState = selectedCall?.currentState ?? "DRAFT"
  const workflowForCall = workflowByCall[selectedCallId] ?? defaultWorkflow()
  const scheduleForCall = scheduleByCall[selectedCallId] ?? defaultSchedule(selectedCall?.baseYear ?? new Date().getFullYear())

  const perms = workflowForCall[currentState]
  const enabledCount = useMemo(() => countTrue(perms), [perms])

  // Permissões efetivas: workflow + cronograma do edital
  const effectivePerms = useMemo(() => {
    const out = { ...perms } as Record<PermissionKey, boolean>
    ;(Object.keys(PERMISSION_LABEL) as PermissionKey[]).forEach((k) => {
      const scheduleKey = PERMISSION_TO_SCHEDULE[k]
      if (!scheduleKey) return
      const windowActive = isNowWithin(scheduleForCall[scheduleKey], new Date())
      out[k] = Boolean(perms[k] && windowActive)
    })
    return out
  }, [perms, scheduleForCall])

  const effectiveEnabledCount = useMemo(() => countTrue(effectivePerms as any), [effectivePerms])

  const scheduleIssues = useMemo(() => {
    const issues: string[] = []

    ;(Object.keys(SCHEDULE_LABEL) as ScheduleKey[]).forEach((k) => {
      const r = scheduleForCall[k]
      if (!isValidRange(r)) {
        issues.push(`${SCHEDULE_LABEL[k]} está inválida (início > fim ou vazio).`)
      }
    })

    // heurísticas simples ( ajustar)
    if (isValidRange(scheduleForCall.SUBMISSION_WINDOW) && isValidRange(scheduleForCall.EVALUATION_WINDOW)) {
      const subEnd = toDate(scheduleForCall.SUBMISSION_WINDOW.end).getTime()
      const evalStart = toDate(scheduleForCall.EVALUATION_WINDOW.start).getTime()
      if (evalStart <= subEnd) {
        issues.push("Avaliação começa antes (ou no mesmo dia) do fim da submissão. Verifique se isso é desejado.")
      }
    }

    return issues
  }, [scheduleForCall])

  const warnings = useMemo(() => {
    const w: string[] = []

    // workflow incoerente
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

    // cronograma vs permissões efetivas
    const scheduleBlocked = (Object.keys(PERMISSION_LABEL) as PermissionKey[]).filter(
      (k) => perms[k] && !effectivePerms[k]
    )
    if (scheduleBlocked.length > 0) {
      w.push(
        `Algumas permissões estão marcadas como ativas no workflow, mas estão bloqueadas pelo cronograma do edital: ${scheduleBlocked
          .map((k) => PERMISSION_LABEL[k])
          .join(", ")}.`
      )
    }

    return w
  }, [currentState, perms, effectivePerms])

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
    setScheduleByCall((prev) => ({ ...prev, [selectedCall.id]: defaultSchedule(selectedCall.baseYear) }))
    setDirty(true)
  }

  function saveWorkflow() {
    // TODO: API persist workflow + currentState + cronograma do edital selecionado
    setDirty(false)
    alert("Workflow + Cronograma salvos (placeholder).")
  }

  function setScheduleRange(key: ScheduleKey, patch: Partial<ScheduleRange>) {
    setScheduleByCall((prev) => ({
      ...prev,
      [selectedCallId]: {
        ...(prev[selectedCallId] ?? defaultSchedule(selectedCall?.baseYear ?? new Date().getFullYear())),
        [key]: {
          ...(prev[selectedCallId]?.[key] ?? scheduleForCall[key]),
          ...patch,
        },
      },
    }))
    setDirty(true)
  }

  const preview = useMemo(() => {
    return [
      {
        title: "Docente",
        items: [
          { label: "Submeter projeto", allowed: effectivePerms.SUBMISSION, raw: perms.SUBMISSION },
          { label: "Indicar bolsistas", allowed: effectivePerms.NOMINATION, raw: perms.NOMINATION },
          { label: "Enviar relatórios", allowed: effectivePerms.UPLOAD_REPORTS, raw: perms.UPLOAD_REPORTS },
          { label: "Submeter ENIC", allowed: effectivePerms.ENIC_SUBMISSION, raw: perms.ENIC_SUBMISSION },
          { label: "Ver resultados", allowed: effectivePerms.VIEW_RESULTS, raw: perms.VIEW_RESULTS },
        ],
      },
      {
        title: "Discente",
        items: [
          { label: "Enviar relatórios", allowed: effectivePerms.UPLOAD_REPORTS, raw: perms.UPLOAD_REPORTS },
          { label: "Submeter ENIC", allowed: effectivePerms.ENIC_SUBMISSION, raw: perms.ENIC_SUBMISSION },
          { label: "Ver resultados", allowed: effectivePerms.VIEW_RESULTS, raw: perms.VIEW_RESULTS },
        ],
      },
      {
        title: "Avaliador/Gestor",
        items: [
          { label: "Avaliar projetos", allowed: effectivePerms.EVALUATION, raw: perms.EVALUATION },
          { label: "Ver resultados", allowed: effectivePerms.VIEW_RESULTS, raw: perms.VIEW_RESULTS },
        ],
      },
    ]
  }, [perms, effectivePerms])

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
        <title>Cronograma • PROPESQ</title>
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
                Selecione um edital para alterar o status, configurar permissões e ajustar o cronograma
                (vinculado ao edital).
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

          <div className="flex items-center gap-2 flex-wrap">
            {dirty && (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle size={14} />
                Alterações não salvas
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-neutral-50 text-neutral border-neutral-light">
              <Info size={14} />
              Permissões (workflow): <span className="font-bold">{enabledCount}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-green-50 text-green-800 border-green-200">
              <Check size={14} />
              Permissões efetivas (cronograma): <span className="font-bold">{effectiveEnabledCount}</span>
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
                  setDirty(false)
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

      {/* ===== Cronograma ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} />
            <h2 className="text-sm font-semibold text-primary">Cronograma do edital</h2>
          </div>

          <div className="rounded-full px-3 py-1 text-xs font-semibold border bg-neutral-50 text-neutral border-neutral-light inline-flex items-center gap-2">
            <Info size={14} />
            O cronograma abaixo pertence a: <span className="font-bold">{selectedCall.title}</span>
          </div>
        </div>

        {scheduleIssues.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Problemas no cronograma</p>
                <ul className="list-disc list-inside text-sm text-amber-900/90 mt-1 space-y-1">
                  {scheduleIssues.map((w, i) => (
                    <li key={`${w}_${i}`}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(SCHEDULE_LABEL) as ScheduleKey[]).map((k) => {
            const range = scheduleForCall[k]
            const ok = isValidRange(range)
            const activeNow = ok ? isNowWithin(range, new Date()) : false

            return (
              <div key={k} className={`rounded-xl border p-4 ${activeNow ? "border-primary/30 bg-primary/10" : "border-neutral-light"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{SCHEDULE_LABEL[k]}</p>
                    <p className="text-xs text-neutral mt-1">{SCHEDULE_HELP[k]}</p>
                  </div>

                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(activeNow)}`}>
                    {activeNow ? <Check size={14} /> : <X size={14} />}
                    {activeNow ? "Ativa agora" : "Inativa"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="text-xs text-neutral">
                    Início
                    <input
                      type="date"
                      value={range.start}
                      onChange={(e) => setScheduleRange(k, { start: e.target.value })}
                      className="mt-1 w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                  </label>

                  <label className="text-xs text-neutral">
                    Fim
                    <input
                      type="date"
                      value={range.end}
                      onChange={(e) => setScheduleRange(k, { end: e.target.value })}
                      className="mt-1 w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                  </label>
                </div>

                {!ok && (
                  <p className="mt-2 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Intervalo inválido. Verifique as datas.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Regras: mesmo que o workflow esteja “Ativo”, a ação só aparece/funciona se a <span className="font-semibold">janela do cronograma</span>{" "}
            correspondente estiver ativa para este edital.
          </p>
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

        {(warnings.length > 0 || scheduleIssues.length > 0) && (
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
              Liberar tudo (workflow)
            </button>
            <button
              type="button"
              onClick={() => setAllForState(false)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
            >
              <Lock size={16} />
              Bloquear tudo (workflow)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(PERMISSION_LABEL) as PermissionKey[]).map((k) => {
            const enabled = perms[k]
            const effective = effectivePerms[k]
            const scheduleKey = PERMISSION_TO_SCHEDULE[k]
            const range = scheduleKey ? scheduleForCall[scheduleKey] : null
            const windowOk = range ? isValidRange(range) : true

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
                    <div>
                      <p className="text-sm font-semibold text-primary">{PERMISSION_LABEL[k]}</p>
                      {scheduleKey && (
                        <p className="text-[11px] text-neutral mt-0.5">
                          Depende do cronograma: <span className="font-semibold">{SCHEDULE_LABEL[scheduleKey]}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(enabled)}`}
                      title="Configuração do workflow (por status)"
                    >
                      {enabled ? <Check size={14} /> : <X size={14} />}
                      {enabled ? "Ativo (workflow)" : "Inativo (workflow)"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(effective)}`}
                      title="Resultado final após aplicar o cronograma do edital"
                    >
                      {effective ? <Unlock size={14} /> : <Lock size={14} />}
                      {effective ? "Liberado (efetivo)" : "Bloqueado (cronograma)"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral mt-2">{PERMISSION_HELP[k]}</p>

                {scheduleKey && range && windowOk && (
                  <p className="text-[11px] text-neutral mt-2">
                    Janela: <span className="font-semibold">{range.start}</span> até{" "}
                    <span className="font-semibold">{range.end}</span>
                  </p>
                )}

                {scheduleKey && range && !windowOk && (
                  <p className="mt-2 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    A janela do cronograma associada está inválida; isso bloqueia a permissão efetiva.
                  </p>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-neutral">
          As permissões são configuradas <span className="font-semibold">por edital</span> e aplicadas conforme o status{" "}
          <span className="font-semibold">e</span> as janelas do cronograma deste edital.
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
                {block.items.map((it) => {
                  const scheduleNote = it.raw && !it.allowed
                  return (
                    <div key={it.label} className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral">{it.label}</span>
                        {scheduleNote && (
                          <span className="text-[11px] text-amber-800 inline-flex items-center gap-1 mt-0.5">
                            <AlertTriangle size={12} />
                            Bloqueado pelo cronograma
                          </span>
                        )}
                      </div>

                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badge(it.allowed)}`}>
                        {it.allowed ? <Unlock size={14} /> : <Lock size={14} />}
                        {it.allowed ? "Liberado" : "Bloqueado"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Sugestão de backend: persistir <span className="font-semibold">workflow</span> +{" "}
            <span className="font-semibold">cronograma</span> por edital. No runtime, compute “permissão efetiva” =
            workflow(status) AND janela_ativa(cronograma).
          </p>
        </div>
      </section>
    </div>
  )
}