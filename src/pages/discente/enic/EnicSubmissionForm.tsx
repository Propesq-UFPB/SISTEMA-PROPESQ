// não to usando

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
  AlertTriangle,
  CheckCircle2,
  Upload,
} from "lucide-react"

type EnicStatus = "RASCUNHO" | "PENDENTE" | "REJEITADO"

type EnicDraft = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  evento: string
  prazo: string
  status: EnicStatus
  observacao?: string
}

type FormData = {
  titulo: string
  projetoId: string
  modalidadeApresentacao: string
  resumo: string
  palavrasChave: string
  title: string
  abstract: string
  keywords: string
  introducao: string
  metodologia: string
  resultados: string
  conclusoes: string
  referencias: string
  anexoPdf: File | null
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const DRAFTS: EnicDraft[] = [
  {
    id: "enic_001",
    titulo: "Submissão ENIC 2026",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    evento: "ENIC 2026",
    prazo: "15/08/2026",
    status: "RASCUNHO",
  },
  {
    id: "enic_005",
    titulo: "Submissão ENIC 2024",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    edital: "PROBEX 2024",
    orientador: "Profa. Lúcia Fernandes",
    evento: "ENIC 2024",
    prazo: "12/08/2024",
    status: "REJEITADO",
    observacao:
      "A submissão anterior apresentou inconsistências na estrutura do texto e inadequação ao formato exigido pelo evento.",
  },
]

const AVAILABLE_PROJECTS = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
  },
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    orientador: "Profa. Helena Costa",
    edital: "PIBITI 2026",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    orientador: "Prof. Ricardo Lima",
    edital: "PIBIC 2025",
  },
]

const INITIAL_FORM: FormData = {
  titulo: "",
  projetoId: "",
  modalidadeApresentacao: "",
  resumo: "",
  palavrasChave: "",
  title: "",
  abstract: "",
  keywords: "",
  introducao: "",
  metodologia: "",
  resultados: "",
  conclusoes: "",
  referencias: "",
  anexoPdf: null,
  aceiteInformacoes: false,
}

function getStatusLabel(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PENDENTE":
      return "Pendente"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return status
  }
}

function getStatusClasses(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.titulo.trim()) errors.titulo = "Informe o título."
  if (!data.projetoId.trim()) errors.projetoId = "Selecione um projeto vinculado."
  if (!data.modalidadeApresentacao.trim()) {
    errors.modalidadeApresentacao = "Selecione a indicação de modalidade."
  }
  if (!data.resumo.trim()) errors.resumo = "Informe o resumo."
  if (!data.palavrasChave.trim()) errors.palavrasChave = "Informe as palavras-chave."
  if (!data.title.trim()) errors.title = "Informe o title."
  if (!data.abstract.trim()) errors.abstract = "Informe o abstract."
  if (!data.keywords.trim()) errors.keywords = "Informe as keywords."
  if (!data.introducao.trim()) errors.introducao = "Informe a introdução."
  if (!data.metodologia.trim()) errors.metodologia = "Informe a metodologia."
  if (!data.resultados.trim()) errors.resultados = "Informe os resultados."
  if (!data.conclusoes.trim()) errors.conclusoes = "Informe as conclusões."
  if (!data.referencias.trim()) errors.referencias = "Informe as referências."
  if (!data.anexoPdf) errors.anexoPdf = "Anexe o arquivo em PDF."

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function EnicSubmissionForm() {
  const { id } = useParams()

  const draft = DRAFTS.find((item) => item.id === id) ?? {
    id: "novo",
    titulo: "Nova Submissão ENIC",
    projetoId: "",
    projetoTitulo: "",
    edital: "-",
    orientador: "-",
    evento: "ENIC 2026",
    prazo: "15/08/2026",
    status: "RASCUNHO" as EnicStatus,
  }

  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<"save" | "submit" | "">("")

  const selectedProject = useMemo(() => {
    return AVAILABLE_PROJECTS.find((project) => project.id === form.projetoId)
  }, [form.projetoId])

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
      setSuccessMessage("Rascunho da submissão salvo com sucesso.")
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
      setSuccessMessage("Submissão ENIC enviada com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Submissão ENIC • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* BOTÃO VOLTAR */}
          <div className="flex items-center justify-between">
            <Link
              to="/discente/enic/submissions"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para submissões
            </Link>
          </div>

          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      draft.status
                    )}`}
                  >
                    <FileText size={14} />
                    {getStatusLabel(draft.status)}
                  </span>

                  <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    {draft.evento}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-primary">
                  {draft.id === "novo" ? "Nova submissão ENIC" : draft.titulo}
                </h1>

                <p className="max-w-4xl text-sm leading-6 text-neutral">
                  Preencha os campos obrigatórios do trabalho e anexe o PDF para
                  realizar a submissão.
                </p>
              </div>
            </div>
          </header>

          {/* OBSERVAÇÃO */}
          {draft.observacao && (
            <div className="w-full rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <div>
                  <span className="font-semibold text-warning">
                    Observação da submissão anterior:
                  </span>{" "}
                  {draft.observacao}
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO */}
          <section className="w-full rounded-2xl border border-neutral/30 bg-white p-6">
            <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
              <div className="min-w-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="rounded-2xl border border-neutral/30 bg-white p-6">
                    <h2 className="mb-5 text-sm font-semibold text-primary">
                      Dados da submissão
                    </h2>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Título *
                        </label>
                        <input
                          type="text"
                          value={form.titulo}
                          onChange={(e) => updateField("titulo", e.target.value)}
                          className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Digite o título"
                        />
                        {errors.titulo && (
                          <p className="mt-1 text-xs text-danger">{errors.titulo}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Projeto vinculado *
                        </label>
                        <select
                          value={form.projetoId}
                          onChange={(e) => updateField("projetoId", e.target.value)}
                          className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                        >
                          <option value="">Selecione um projeto</option>
                          {AVAILABLE_PROJECTS.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.titulo}
                            </option>
                          ))}
                        </select>
                        {errors.projetoId && (
                          <p className="mt-1 text-xs text-danger">{errors.projetoId}</p>
                        )}
                      </div>

                      {selectedProject && (
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
                          <div className="font-semibold text-primary">
                            Projeto selecionado
                          </div>

                          <div className="mt-2 space-y-1 text-neutral">
                            <p>
                              <span className="font-medium text-primary">Projeto:</span>{" "}
                              {selectedProject.titulo}
                            </p>
                            <p>
                              <span className="font-medium text-primary">
                                Orientador(a):
                              </span>{" "}
                              {selectedProject.orientador}
                            </p>
                            <p>
                              <span className="font-medium text-primary">Edital:</span>{" "}
                              {selectedProject.edital}
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Resumo *
                        </label>
                        <textarea
                          value={form.resumo}
                          onChange={(e) => updateField("resumo", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Digite o resumo"
                        />
                        {errors.resumo && (
                          <p className="mt-1 text-xs text-danger">{errors.resumo}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Palavras-Chave *
                        </label>
                        <input
                          type="text"
                          value={form.palavrasChave}
                          onChange={(e) => updateField("palavrasChave", e.target.value)}
                          className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Ex.: acessibilidade, pesquisa, inovação"
                        />
                        {errors.palavrasChave && (
                          <p className="mt-1 text-xs text-danger">
                            {errors.palavrasChave}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Enter the title in English"
                        />
                        {errors.title && (
                          <p className="mt-1 text-xs text-danger">{errors.title}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Abstract *
                        </label>
                        <textarea
                          value={form.abstract}
                          onChange={(e) => updateField("abstract", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Enter the abstract in English"
                        />
                        {errors.abstract && (
                          <p className="mt-1 text-xs text-danger">{errors.abstract}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Keywords *
                        </label>
                        <input
                          type="text"
                          value={form.keywords}
                          onChange={(e) => updateField("keywords", e.target.value)}
                          className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Ex.: research, innovation, technology"
                        />
                        {errors.keywords && (
                          <p className="mt-1 text-xs text-danger">{errors.keywords}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Introdução *
                        </label>
                        <textarea
                          value={form.introducao}
                          onChange={(e) => updateField("introducao", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Descreva a introdução"
                        />
                        {errors.introducao && (
                          <p className="mt-1 text-xs text-danger">{errors.introducao}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Metodologia *
                        </label>
                        <textarea
                          value={form.metodologia}
                          onChange={(e) => updateField("metodologia", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Descreva a metodologia"
                        />
                        {errors.metodologia && (
                          <p className="mt-1 text-xs text-danger">{errors.metodologia}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Resultados *
                        </label>
                        <textarea
                          value={form.resultados}
                          onChange={(e) => updateField("resultados", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Descreva os resultados"
                        />
                        {errors.resultados && (
                          <p className="mt-1 text-xs text-danger">{errors.resultados}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Conclusões *
                        </label>
                        <textarea
                          value={form.conclusoes}
                          onChange={(e) => updateField("conclusoes", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Descreva as conclusões"
                        />
                        {errors.conclusoes && (
                          <p className="mt-1 text-xs text-danger">{errors.conclusoes}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          Referências *
                        </label>
                        <textarea
                          value={form.referencias}
                          onChange={(e) => updateField("referencias", e.target.value)}
                          rows={5}
                          className="w-full resize-none rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          placeholder="Informe as referências bibliográficas"
                        />
                        {errors.referencias && (
                          <p className="mt-1 text-xs text-danger">{errors.referencias}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-primary">
                            Anexo PDF *
                          </label>
                          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral/30 bg-white px-4 py-3 text-sm text-neutral transition hover:border-primary/40">
                            <Upload size={16} className="text-primary" />
                            <span>
                              {form.anexoPdf
                                ? form.anexoPdf.name
                                : "Selecionar arquivo PDF"}
                            </span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateField("anexoPdf", e.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                          {errors.anexoPdf && (
                            <p className="mt-1 text-xs text-danger">{errors.anexoPdf}</p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-primary">
                            Indicação de modalidade *
                          </label>
                          <select
                            value={form.modalidadeApresentacao}
                            onChange={(e) =>
                              updateField("modalidadeApresentacao", e.target.value)
                            }
                            className="w-full rounded-xl border border-neutral/30 bg-white px-4 py-3 text-sm text-primary outline-none focus:border-primary"
                          >
                            <option value="">Selecione</option>
                            <option value="ORAL">Oral</option>
                            <option value="POSTER">Pôster</option>
                          </select>
                          {errors.modalidadeApresentacao && (
                            <p className="mt-1 text-xs text-danger">
                              {errors.modalidadeApresentacao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-start gap-3 text-sm text-primary">
                          <input
                            type="checkbox"
                            checked={form.aceiteInformacoes}
                            onChange={(e) =>
                              updateField("aceiteInformacoes", e.target.checked)
                            }
                            className="mt-0.5 h-4 w-4 rounded border-neutral/40"
                          />
                          <span>
                            Declaro que as informações da submissão são verdadeiras e
                            atendem às exigências do evento.
                          </span>
                        </label>
                        {errors.aceiteInformacoes && (
                          <p className="mt-1 text-xs text-danger">
                            {errors.aceiteInformacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

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

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                      to="/discente/enic"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
                    >
                      Cancelar
                    </Link>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:opacity-60"
                    >
                      <Save size={16} />
                      {saving ? "Salvando..." : "Salvar rascunho"}
                    </button>

                    <button
                      type="submit"
                      disabled={saving || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      <Send size={16} />
                      {submitting ? "Enviando..." : "Submeter trabalho"}
                    </button>
                  </div>
                </form>
              </div>

              <aside className="min-w-0 space-y-6">
                <div className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <h2 className="mb-5 text-sm font-semibold text-primary">
                    Orientações
                  </h2>

                  <ul className="space-y-4 text-sm leading-6 text-neutral">
                    <li>
                      Verifique se o PDF anexado corresponde à versão final do trabalho.
                    </li>
                    <li>
                      Revise introdução, metodologia, resultados e conclusões antes da
                      submissão.
                    </li>
                    <li>Confirme a modalidade desejada para apresentação.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <h2 className="mb-5 text-sm font-semibold text-primary">
                    Dados da submissão
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-neutral">Evento</div>
                      <div className="mt-1 font-medium text-primary">{draft.evento}</div>
                    </div>

                    <div>
                      <div className="text-neutral">Prazo final</div>
                      <div className="mt-1 font-medium text-primary">{draft.prazo}</div>
                    </div>

                    <div>
                      <div className="text-neutral">Status</div>
                      <div className="mt-1 font-medium text-primary">
                        {getStatusLabel(draft.status)}
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral">Edital vinculado</div>
                      <div className="mt-1 font-medium text-primary">
                        {selectedProject?.edital || draft.edital}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <h2 className="mb-5 text-sm font-semibold text-primary">
                    Recomendações
                  </h2>

                  <div className="space-y-4 text-sm text-neutral">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 text-success" />
                      <span>Salve o rascunho durante o preenchimento.</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <FolderKanban size={16} className="mt-0.5 text-primary" />
                      <span>Garanta aderência do trabalho ao projeto vinculado.</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}