import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { ApiError } from "@/services/apiClient"
import { projectService } from "../api/projectService"
import type {
  ResearchProject,
  UpdateResearchProjectPayload,
  UserRole,
} from "../types/project"

const listPaths: Record<UserRole, string> = {
  DISCENTE: "/discente/projetos",
  COORDENADOR: "/coordenador/projetos",
  GESTOR: "/gestor/projetos",
}

function Field({
  label,
  value,
}: {
  label: string
  value?: string | string[] | null
}) {
  const display =
    value === null
      ? "Não informado"
      : Array.isArray(value)
        ? value.join(", ")
        : value

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-neutral">
        {display || "—"}
      </p>
    </div>
  )
}

export default function ProjectDetailsPage({
  role,
  editable = false,
}: {
  role: UserRole
  editable?: boolean
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<ResearchProject | null>(null)
  const [editing, setEditing] = useState(editable)
  const [title, setTitle] = useState("")
  const [englishTitle, setEnglishTitle] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return

    projectService
      .getById(id)
      .then((data) => {
        setProject(data)
        setTitle(data.titulo ?? "")
        setEnglishTitle(data.title ?? "")
        setEmail(data.email ?? "")
      })
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível carregar o projeto.",
        ),
      )
      .finally(() => setLoading(false))
  }, [id])

  async function openAttachment() {
    if (!id || !project?.anexo) return

    const viewer = window.open("", "_blank")
    if (viewer) viewer.opener = null
    setPdfLoading(true)
    setError("")

    try {
      const blob = await projectService.getAttachment(id)
      const objectUrl = URL.createObjectURL(blob)

      if (viewer) {
        viewer.location.href = objectUrl
      } else {
        const link = document.createElement("a")
        link.href = objectUrl
        link.target = "_blank"
        link.rel = "noreferrer"
        link.click()
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
    } catch (err) {
      viewer?.close()
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível abrir o PDF associado.",
      )
    } finally {
      setPdfLoading(false)
    }
  }

  async function save() {
    if (!id) return
    setSaving(true)
    setError("")
    const payload: UpdateResearchProjectPayload = {
      titulo: title,
      title: englishTitle,
      email,
    }

    try {
      await projectService.update(id, payload)
      setProject((current) =>
        current
          ? { ...current, titulo: title, title: englishTitle, email }
          : current,
      )
      setEditing(false)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar o projeto.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!id || !window.confirm("Deseja realmente excluir este projeto?")) return

    try {
      await projectService.remove(id)
      navigate(listPaths[role])
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir o projeto.",
      )
    }
  }

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-neutral">
        <Loader2 className="animate-spin" /> Carregando projeto...
      </div>
    )

  if (!project)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error || "Projeto não encontrado."}
        </div>
      </div>
    )

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={listPaths[role]}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>

          {role !== "DISCENTE" && (
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Save size={16} />
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  <Pencil size={16} /> Editar campos suportados
                </button>
              )}
              {role === "GESTOR" && (
                <button
                  onClick={remove}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-neutral/20 bg-white p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <BookOpen size={14} /> {project.codigo || `Projeto ${project.id}`}
          </div>

          {editing ? (
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold text-primary">
                Título em português
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"
                />
              </label>
              <label className="text-sm font-semibold text-primary">
                Título em inglês
                <input
                  value={englishTitle}
                  onChange={(event) => setEnglishTitle(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"
                />
              </label>
              <label className="text-sm font-semibold text-primary">
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"
                />
              </label>
            </div>
          ) : (
            <>
              <h1 className="mt-4 text-2xl font-bold text-primary">
                {project.titulo}
              </h1>
              <p className="mt-2 text-sm italic text-neutral">
                {project.title || "—"}
              </p>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-neutral/20 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Tipo" value={project.tipo} />
            <Field label="Categoria" value={project.categoria} />
            <Field label="Situação" value={project.situacao} />
            <Field label="E-mail" value={project.email} />
            <Field label="Cadastro" value={project.data_cadastro} />
            <Field label="Unidade" value={project.unidade} />
            <Field label="Palavras-chave" value={project.palavras_chave} />
            <Field label="Keywords" value={project.key_words} />
          </div>

          <div className="mt-6 border-t border-neutral/20 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
              Objetivos relacionados
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.objetivos.length ? (
                project.objetivos.map((objective) => (
                  <span
                    key={objective.id}
                    className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-3 py-2 text-xs font-semibold text-white"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-white/30 bg-white/15 text-[11px]">
                      {objective.id}
                    </span>
                    <span>{objective.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-sm text-neutral">—</span>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-neutral/20 bg-white p-6">
          <h2 className="text-lg font-bold text-primary">Corpo do projeto</h2>
          <Field label="Resumo" value={project.corpo?.resumo} />
          <Field label="Abstract" value={project.corpo?.abstract} />
          <Field label="Introdução" value={project.corpo?.introducao} />
          <Field label="Objetivos" value={project.corpo?.objetivos} />
          <Field label="Metodologia" value={project.corpo?.metodologia} />
          <Field
            label="Resultados esperados"
            value={project.corpo?.resultados_esperados}
          />
          <Field label="Referências" value={project.corpo?.referencias} />
        </section>

        <section className="rounded-2xl border border-neutral/20 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
            <Users size={18} /> Membros cadastrados
          </h2>
          {project.membros?.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {project.membros.map((member) => (
                <div
                  key={`${member.categoria}-${member.id}`}
                  className="rounded-xl border border-neutral/20 p-4"
                >
                  <p className="font-semibold text-primary">{member.nome}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field label="E-mail" value={member.email} />
                    <Field label="Papel" value={member.funcao} />
                    <Field label="Vínculo" value={member.categoria} />
                    <Field
                      label="Carga horária"
                      value={
                        member.carga_horaria
                          ? `${member.carga_horaria}h`
                          : "Não informada"
                      }
                    />
                    {member.tipo && (
                      <Field label="Tipo externo" value={member.tipo} />
                    )}
                    {member.formacao && (
                      <Field label="Formação" value={member.formacao} />
                    )}
                    {member.sexo && <Field label="Sexo" value={member.sexo} />}
                    {member.cpf && <Field label="CPF" value={member.cpf} />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-neutral">
              Nenhum membro cadastrado.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral/20 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
            <FileText size={18} /> PDF associado
          </h2>
          {!project.anexo ? (
            <p className="mt-3 text-sm text-neutral">
              Nenhum PDF associado ao projeto.
            </p>
          ) : (
            <button
              type="button"
              onClick={openAttachment}
              disabled={pdfLoading}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-neutral/20 bg-neutral/5 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-wait disabled:opacity-70"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-white">
                {pdfLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-primary">
                  {project.anexo.nome}
                </span>
                <span className="mt-1 block text-xs text-neutral">
                  Clique para abrir o arquivo
                </span>
              </span>
              <ExternalLink size={18} className="shrink-0 text-primary" />
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-neutral/20 bg-white p-6">
          <h2 className="text-lg font-bold text-primary">Atividades</h2>
          {project.atividades?.length ? (
            <div className="mt-4 space-y-3">
              {project.atividades.map((activity, index) => (
                <div
                  key={`${activity.descricao}-${index}`}
                  className="rounded-xl border border-neutral/20 p-4"
                >
                  <p className="font-semibold text-primary">
                    {activity.descricao}
                  </p>
                  <p className="mt-1 text-sm text-neutral">
                    Meses:{" "}
                    {activity.meses
                      ?.map((month) =>
                        new Date(month).toLocaleDateString("pt-BR"),
                      )
                      .join(", ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-neutral">
              Nenhuma atividade retornada pelo backend.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
