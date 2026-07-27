import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Info,
  Settings,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { ApiError } from "@/services/apiClient"
import {
  researchParametersService,
  type ResearchModuleParametersPayload,
} from "@/features/settings/api/researchParametersService"

type Params = ResearchModuleParametersPayload

function clampInt(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min

  return Math.min(max, Math.max(min, Math.trunc(v)))
}

function isEmailValid(email: string) {
  const value = email.trim()
  const at = value.indexOf("@")
  if (at <= 0 || value.includes("@", at + 1)) return false

  const local = value.slice(0, at)
  const domain = value.slice(at + 1)
  const dot = domain.indexOf(".")
  if (dot <= 0 || dot === domain.length - 1) return false

  // Mesma regra do antigo [^\s@]+ em cada parte, sem backtracking.
  return !/[\s@]/.test(local) && !/[\s@]/.test(domain)
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    return err.message || fallback
  }
  return fallback
}

function toParams(data: Params & { updatedAt?: string }): Params {
  return {
    lateSubmissionToleranceDays: data.lateSubmissionToleranceDays,
    maxRenewalsPerProject: data.maxRenewalsPerProject,
    maxProjectDurationMonths: data.maxProjectDurationMonths,
    maxQuotaRequestsPerProject: data.maxQuotaRequestsPerProject,
    maxWorkPlansPerAdvisor: data.maxWorkPlansPerAdvisor,
    scholarshipChangeCutoffDay: data.scholarshipChangeCutoffDay,
    emailScholarshipChanges: data.emailScholarshipChanges,
    emailInventionNotifications: data.emailInventionNotifications,
    allowPartialReportsIC: data.allowPartialReportsIC,
    allowIndependentENICSummaries: data.allowIndependentENICSummaries,
    enicSummariesPerReviewer: data.enicSummariesPerReviewer,
  }
}

const DEFAULTS: Params = {
  lateSubmissionToleranceDays: 0,
  maxRenewalsPerProject: 0,
  maxProjectDurationMonths: 12,
  maxQuotaRequestsPerProject: 1,
  maxWorkPlansPerAdvisor: 5,
  scholarshipChangeCutoffDay: 20,
  emailScholarshipChanges: "",
  emailInventionNotifications: "",
  allowPartialReportsIC: false,
  allowIndependentENICSummaries: false,
  enicSummariesPerReviewer: 5,
}

export default function AdmResearchModuleParameters({basePath = "/adm"}: {basePath?: string}) {
  // Depois: trocar por fetch/GET
  const [initial, setInitial] = useState<Params>(DEFAULTS)
  const [form, setForm] = useState<Params>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  )

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Params, string>> = {}

    if (form.lateSubmissionToleranceDays < 0) {
      e.lateSubmissionToleranceDays = "Não pode ser negativo."
    }

    if (form.maxRenewalsPerProject < 0) {
      e.maxRenewalsPerProject = "Não pode ser negativo."
    }

    if (form.maxProjectDurationMonths <= 0) {
      e.maxProjectDurationMonths = "Deve ser maior que zero."
    }

    if (form.maxQuotaRequestsPerProject <= 0) {
      e.maxQuotaRequestsPerProject = "Deve ser maior que zero."
    }

    if (form.maxWorkPlansPerAdvisor <= 0) {
      e.maxWorkPlansPerAdvisor = "Deve ser maior que zero."
    }

    if (form.scholarshipChangeCutoffDay < 1 || form.scholarshipChangeCutoffDay > 31) {
      e.scholarshipChangeCutoffDay = "Use um dia entre 1 e 31."
    }

    if (form.emailScholarshipChanges.trim() && !isEmailValid(form.emailScholarshipChanges)) {
      e.emailScholarshipChanges = "Email inválido."
    }

    if (
      form.emailInventionNotifications.trim() &&
      !isEmailValid(form.emailInventionNotifications)
    ) {
      e.emailInventionNotifications = "Email inválido."
    }

    if (form.enicSummariesPerReviewer <= 0) {
      e.enicSummariesPerReviewer = "Deve ser maior que zero."
    }

    return e
  }, [form])

  const hasErrors = Object.keys(errors).length > 0

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const data = await researchParametersService.get()
      const params = toParams(data)
      setInitial(params)
      setForm(params)
      if (data.updatedAt) {
        setSavedAt(new Date(data.updatedAt))
      }
    } catch (err) {
      setLoadError(errorMessage(err, "Não foi possível carregar os parâmetros."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function onSave() {
    if (hasErrors) return

    setSaving(true)
    setActionError(null)

    try {
      const saved = await researchParametersService.update(form)
      const params = toParams(saved)
      setInitial(params)
      setForm(params)
      setSavedAt(saved.updatedAt ? new Date(saved.updatedAt) : new Date())
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível salvar os parâmetros."))
    } finally {
      setSaving(false)
    }
  }

  function onReset() {
    setForm(initial)
    setSavedAt(null)
    setActionError(null)
  }

  let statusBadge: React.ReactNode
  if (loading) {
    statusBadge = (
      <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral">
        Carregando…
      </span>
    )
  } else if (hasErrors) {
    statusBadge = (
      <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        <AlertTriangle size={14} />
        Corrigir campos
      </span>
    )
  } else if (dirty) {
    statusBadge = (
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <AlertTriangle size={14} />
        Alterações não salvas
      </span>
    )
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        <CheckCircle2 size={14} />
        Sem alterações
      </span>
    )
  }

  let statusMessage: string
  if (loading) {
    statusMessage = "Carregando parâmetros do servidor…"
  } else if (hasErrors) {
    statusMessage = "Corrija os campos marcados para salvar."
  } else if (dirty) {
    statusMessage = "Há alterações não salvas."
  } else {
    statusMessage = "Sem alterações."
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Parâmetros do Módulo de Pesquisa • PROPESQ</title>
      </Helmet>

      <Link
        to={`${basePath}/settings/scholarships`}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para bolsas
      </Link>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <SlidersHorizontal size={14} />
              Configurações
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                Parâmetros do Módulo de Pesquisa
              </h1>

              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Defina regras globais que afetam submissões, projetos, bolsas, relatórios,
                notificações e distribuição de resumos do ENIC.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={onReset}
              disabled={!dirty || saving || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-neutral-light text-primary hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
              Restaurar
            </button>

            <button
              type="button"
              onClick={() => void onSave()}
              disabled={!dirty || hasErrors || saving || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void loadData()}
            className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 font-medium hover:bg-red-100"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <h2 className="text-sm font-semibold text-primary">Status das configurações</h2>
            </div>

            <p className="text-sm text-neutral">
              Acompanhe se existem alterações pendentes ou erros de preenchimento antes de salvar.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {statusBadge}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />

          <p className="text-xs text-neutral">
            {statusMessage}
            {savedAt ? ` • Último salvamento: ${savedAt.toLocaleString()}` : ""}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-neutral-light rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-primary">Submissões e Projetos</h2>

          <FieldNumber
            label="Tolerância para submissão após o prazo do edital (dias)"
            value={form.lateSubmissionToleranceDays}
            min={0}
            max={365}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, lateSubmissionToleranceDays: v }))}
            error={errors.lateSubmissionToleranceDays}
            hint="Ex.: 0 (não permite), 2 (até 2 dias após encerrar)."
          />

          <FieldNumber
            label="Quantidade máxima de renovações por projeto"
            value={form.maxRenewalsPerProject}
            min={0}
            max={20}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, maxRenewalsPerProject: v }))}
            error={errors.maxRenewalsPerProject}
            hint="Quantas vezes um projeto pode ser renovado."
          />

          <FieldNumber
            label="Duração máxima permitida para novos projetos (meses)"
            value={form.maxProjectDurationMonths}
            min={1}
            max={120}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, maxProjectDurationMonths: v }))}
            error={errors.maxProjectDurationMonths}
            hint="Ex.: 12, 18, 24."
          />

          <FieldNumber
            label="Limite de solicitações de cotas por projeto"
            value={form.maxQuotaRequestsPerProject}
            min={1}
            max={99}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, maxQuotaRequestsPerProject: v }))}
            error={errors.maxQuotaRequestsPerProject}
            hint="Controla quantas solicitações de cota o projeto pode fazer."
          />
        </section>

        <section className="bg-white border border-neutral-light rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-primary">Bolsas, Relatórios e ENIC</h2>

          <FieldNumber
            label="Limite de Planos de Trabalho por orientador"
            value={form.maxWorkPlansPerAdvisor}
            min={1}
            max={200}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, maxWorkPlansPerAdvisor: v }))}
            error={errors.maxWorkPlansPerAdvisor}
            hint="Ex.: 5, 10, 20."
          />

          <FieldNumber
            label="Dia limite para alterações de bolsistas valerem no mês corrente"
            value={form.scholarshipChangeCutoffDay}
            min={1}
            max={31}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, scholarshipChangeCutoffDay: v }))}
            error={errors.scholarshipChangeCutoffDay}
            hint="Ex.: 20 significa: mudanças até dia 20 valem no mês atual."
          />

          <FieldText
            label="Email para recebimento de notificação de alterações de bolsistas"
            value={form.emailScholarshipChanges}
            placeholder="ex.: bolsas@ufpb.br"
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, emailScholarshipChanges: v }))}
            error={errors.emailScholarshipChanges}
            hint="Pode ser um email institucional ou lista de distribuição."
          />

          <FieldText
            label="Email para recebimento de notificações de invenção"
            value={form.emailInventionNotifications}
            placeholder="ex.: inovacao@ufpb.br"
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, emailInventionNotifications: v }))}
            error={errors.emailInventionNotifications}
            hint="Usado quando houver fluxo/registro de invenção."
          />

          <FieldToggle
            label="Permite envio de relatórios parciais pelos alunos de iniciação científica?"
            value={form.allowPartialReportsIC}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, allowPartialReportsIC: v }))}
          />

          <FieldToggle
            label="Permite envio de resumos do ENIC independentes?"
            value={form.allowIndependentENICSummaries}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, allowIndependentENICSummaries: v }))}
          />

          <FieldNumber
            label="Quantidade de resumos distribuídos para avaliadores no ENIC"
            value={form.enicSummariesPerReviewer}
            min={1}
            max={100}
            disabled={loading}
            onChange={(v) => setForm((p) => ({ ...p, enicSummariesPerReviewer: v }))}
            error={errors.enicSummariesPerReviewer}
            hint="Quantos resumos cada avaliador recebe na distribuição automática."
          />
        </section>
      </div>
    </div>
  )
}

function FieldNumber(props: Readonly<{
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  hint?: string
  error?: string
  disabled?: boolean
}>) {
  const { label, value, min, max, onChange, hint, error, disabled } = props

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral">{label}</label>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(clampInt(Number(e.target.value), min, max))}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm outline-none disabled:opacity-60
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-neutral-light focus:ring-2 focus:ring-primary/20"
          }
        `}
      />

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function FieldText(props: Readonly<{
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  disabled?: boolean
}>) {
  const { label, value, placeholder, onChange, hint, error, disabled } = props

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral">{label}</label>

      <input
        type="email"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm outline-none disabled:opacity-60
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-neutral-light focus:ring-2 focus:ring-primary/20"
          }
        `}
      />

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function FieldToggle(props: Readonly<{
  label: string
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}>) {
  const { label, value, onChange, disabled } = props

  return (
    <div className="flex items-center justify-between gap-3 border border-neutral-light rounded-xl p-3">
      <p className="text-xs font-bold text-neutral">{label}</p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full transition-colors
          disabled:opacity-60 disabled:cursor-not-allowed
          ${value ? "bg-primary" : "bg-neutral-light"}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
        `}
        aria-pressed={value}
      >
        <span
          className={`
            inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform
            ${value ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  )
}
