import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  FolderKanban,
  UserRound,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  BadgeCheck,
} from "lucide-react"

type ReportStatus = "PENDENTE" | "EM_PREENCHIMENTO" | "REJEITADO" | "ENVIADO"

type FinalReportData = {
  id: string
  titulo: string
  projetoTitulo: string
  edital: string
  orientador: string
  periodo: string
  prazo: string
  status: ReportStatus
  observacao?: string
}

type FormData = {
  resumo: string
  palavrasChave: string
  title: string
  abstract: string
  keywords: string
  introducao: string
  procedimentosMetodologicos: string
  resultadosDiscussao: string
  conclusoes: string
  referencias: string
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const REPORTS: FinalReportData[] = [
  {
    id: "2",
    titulo: "Relatório Final PIBITI 2026",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "EM_PREENCHIMENTO",
  },
  {
    id: "5",
    titulo: "Relatório Final PIBIC 2025",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazo: "05/12/2025",
    status: "REJEITADO",
    observacao:
      "Apresentar com maior clareza a estrutura do texto final, incluindo resumo, abstract, resultados e referências.",
  },
]

const INITIAL_FORM: FormData = {
  resumo: "",
  palavrasChave: "",
  title: "",
  abstract: "",
  keywords: "",
  introducao: "",
  procedimentosMetodologicos: "",
  resultadosDiscussao: "",
  conclusoes: "",
  referencias: "",
  aceiteInformacoes: false,
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "EM_PREENCHIMENTO":
      return "Em preenchimento"
    case "REJEITADO":
      return "Rejeitado"
    case "ENVIADO":
      return "Enviado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_PREENCHIMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "ENVIADO":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.resumo.trim()) {
    errors.resumo = "Informe o resumo."
  } else if (data.resumo.trim().length < 20) {
    errors.resumo = "Descreva melhor o resumo."
  }

  if (!data.palavrasChave.trim()) {
    errors.palavrasChave = "Informe as palavras-chave."
  }

  if (!data.title.trim()) {
    errors.title = "Informe o title."
  } else if (data.title.trim().length < 5) {
    errors.title = "Informe um título em inglês mais completo."
  }

  if (!data.abstract.trim()) {
    errors.abstract = "Informe o abstract."
  } else if (data.abstract.trim().length < 20) {
    errors.abstract = "Descreva melhor o abstract."
  }

  if (!data.keywords.trim()) {
    errors.keywords = "Informe as keywords."
  }

  if (!data.introducao.trim()) {
    errors.introducao = "Informe a introdução."
  } else if (data.introducao.trim().length < 30) {
    errors.introducao = "Descreva melhor a introdução."
  }

  if (!data.procedimentosMetodologicos.trim()) {
    errors.procedimentosMetodologicos = "Informe os procedimentos metodológicos."
  } else if (data.procedimentosMetodologicos.trim().length < 30) {
    errors.procedimentosMetodologicos =
      "Descreva melhor os procedimentos metodológicos."
  }

  if (!data.resultadosDiscussao.trim()) {
    errors.resultadosDiscussao = "Informe os resultados e discussão."
  } else if (data.resultadosDiscussao.trim().length < 30) {
    errors.resultadosDiscussao = "Descreva melhor os resultados e discussão."
  }

  if (!data.conclusoes.trim()) {
    errors.conclusoes = "Informe as conclusões."
  } else if (data.conclusoes.trim().length < 20) {
    errors.conclusoes = "Descreva melhor as conclusões."
  }

  if (!data.referencias.trim()) {
    errors.referencias = "Informe as referências."
  } else if (data.referencias.trim().length < 10) {
    errors.referencias = "Descreva melhor as referências."
  }

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function FinalReportForm() {
  const { id } = useParams()

  const report = REPORTS.find((item) => item.id === id) ?? REPORTS[0]

  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<"save" | "submit" | "">("")

  const currentStatus = report.status
  const currentObservation = report.observacao ?? ""

  const progress = useMemo(() => {
    const fields = [
      form.resumo,
      form.palavrasChave,
      form.title,
      form.abstract,
      form.keywords,
      form.introducao,
      form.procedimentosMetodologicos,
      form.resultadosDiscussao,
      form.conclusoes,
      form.referencias,
    ]

    const filled = fields.filter((value) => value.trim().length > 0).length

    return Math.round((filled / fields.length) * 100)
  }, [form])

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
    setSuccessMessage("")
    setSuccessType("")
  }

  function handleSave() {
    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      setSuccessType("save")
      setSuccessMessage("Rascunho salvo com sucesso.")
    }, 700)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSuccessMessage("")
    setSuccessType("")

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSuccessType("submit")
      setSuccessMessage("Relatório final enviado com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatório Final • PROPESQ</title>
      </Helmet>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
  
          {/* VOLTAR */}
          <div>
            <Link
              to="/discente/relatorios"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              Voltar para relatórios
            </Link>
          </div>
  
          {/* HEADER */}
          <header className="rounded-2xl border border-neutral/20 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">
              {report.titulo}
            </h1>
  
            <p className="mt-2 text-sm text-neutral">
              Preencha o relatório final vinculado ao projeto abaixo. O
                projeto, edital e orientador já estão definidos a partir do
                relatório selecionado.
            </p>
          </header>

        {currentObservation && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-warning"
              />

              <div>
                <span className="font-semibold text-warning">
                  Observação da avaliação anterior:
                </span>{" "}
                {currentObservation}
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Preenchimento do relatório final
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                        Projeto
                      </div>

                      <div className="mt-1 text-sm font-semibold text-primary">
                        {report.projetoTitulo}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                        Edital
                      </div>

                      <div className="mt-1 text-sm font-semibold text-primary">
                        {report.edital}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                        Período
                      </div>

                      <div className="mt-1 text-sm font-semibold text-primary">
                        {report.periodo}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                        Orientador(a)
                      </div>

                      <div className="mt-1 text-sm font-semibold text-primary">
                        {report.orientador}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resumo *
                    </label>

                    <textarea
                      value={form.resumo}
                      onChange={(e) => updateField("resumo", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Escreva o resumo do trabalho."
                    />

                    {errors.resumo && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resumo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Palavras-chave *
                    </label>

                    <input
                      type="text"
                      value={form.palavrasChave}
                      onChange={(e) =>
                        updateField("palavrasChave", e.target.value)
                      }
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                      placeholder="Ex.: inteligência artificial; classificação; pesquisa científica"
                    />

                    {errors.palavrasChave && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.palavrasChave}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Title *
                    </label>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                      placeholder="Write the title in English"
                    />

                    {errors.title && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Abstract *
                    </label>

                    <textarea
                      value={form.abstract}
                      onChange={(e) => updateField("abstract", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Write the abstract in English."
                    />

                    {errors.abstract && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.abstract}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Keywords *
                    </label>

                    <input
                      type="text"
                      value={form.keywords}
                      onChange={(e) => updateField("keywords", e.target.value)}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                      placeholder="Ex.: artificial intelligence; scientific production; classification"
                    />

                    {errors.keywords && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.keywords}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Introdução *
                    </label>

                    <textarea
                      value={form.introducao}
                      onChange={(e) => updateField("introducao", e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Apresente o contexto, problema, justificativa e objetivos."
                    />

                    {errors.introducao && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.introducao}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Procedimentos metodológicos *
                    </label>

                    <textarea
                      value={form.procedimentosMetodologicos}
                      onChange={(e) =>
                        updateField(
                          "procedimentosMetodologicos",
                          e.target.value
                        )
                      }
                      rows={5}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Descreva materiais, métodos, etapas e procedimentos adotados."
                    />

                    {errors.procedimentosMetodologicos && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.procedimentosMetodologicos}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resultados e discussão *
                    </label>

                    <textarea
                      value={form.resultadosDiscussao}
                      onChange={(e) =>
                        updateField("resultadosDiscussao", e.target.value)
                      }
                      rows={6}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Apresente os principais resultados obtidos e discuta seus significados."
                    />

                    {errors.resultadosDiscussao && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resultadosDiscussao}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Conclusões *
                    </label>

                    <textarea
                      value={form.conclusoes}
                      onChange={(e) => updateField("conclusoes", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Apresente as conclusões finais do trabalho."
                    />

                    {errors.conclusoes && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.conclusoes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Referências *
                    </label>

                    <textarea
                      value={form.referencias}
                      onChange={(e) =>
                        updateField("referencias", e.target.value)
                      }
                      rows={5}
                      className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary resize-none"
                      placeholder="Liste as referências utilizadas."
                    />

                    {errors.referencias && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.referencias}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-4">
                    <label className="flex items-start gap-3 text-sm text-neutral">
                      <input
                        type="checkbox"
                        checked={form.aceiteInformacoes}
                        onChange={(e) =>
                          updateField("aceiteInformacoes", e.target.checked)
                        }
                        className="mt-1"
                      />

                      <span>
                        Declaro que as informações apresentadas neste relatório
                        final são verdadeiras e representam adequadamente o
                        conteúdo submetido.
                      </span>
                    </label>

                    {errors.aceiteInformacoes && (
                      <p className="mt-2 text-xs text-danger">
                        {errors.aceiteInformacoes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {(successMessage || Object.keys(errors).length > 0) && (
                <div className="space-y-2">
                  {successMessage && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                        successType === "submit"
                          ? "border border-success/30 bg-success/10 text-success"
                          : "border border-primary/30 bg-primary/10 text-primary"
                      }`}
                    >
                      {successMessage}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <Link
                  to="/discente/relatorios"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  Cancelar
                </Link>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || submitting}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition disabled:opacity-60
                  "
                >
                  <Save size={16} />
                  {saving ? "Salvando..." : "Salvar rascunho"}
                </button>

                <button
                  type="submit"
                  disabled={saving || submitting}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition disabled:opacity-60
                  "
                >
                  <Send size={16} />
                  {submitting ? "Enviando..." : "Enviar relatório"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados do relatório
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Título</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Projeto</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.projetoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.edital}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.periodo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Prazo final</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.prazo}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Recomendações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-3 text-sm text-neutral">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>
                    Mantenha consistência entre resumo, abstract e seções
                    principais.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>
                    Apresente resultados com clareza e discussão bem conectada.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>
                    Confirme se todas as referências citadas estão listadas.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}