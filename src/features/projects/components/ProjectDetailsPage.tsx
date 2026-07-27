import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, BookOpen, Loader2, Pencil, Save, Trash2, X } from "lucide-react"
import { projectService } from "../api/projectService"
import type { ResearchProject, UpdateResearchProjectPayload, UserRole } from "../types/project"
import { ApiError } from "@/services/apiClient"

const listPaths: Record<UserRole, string> = { DISCENTE: "/discente/projetos", COORDENADOR: "/coordenador/projetos", ADMINISTRADOR: "/adm/admprojetos", GESTOR: "/gestor/projetos" }

function Field({ label, value }: { label: string; value?: string | string[] }) {
  const display = Array.isArray(value) ? value.join(", ") : value
  return <div><p className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm text-neutral">{display || "—"}</p></div>
}

export default function ProjectDetailsPage({ role, editable = false }: { role: UserRole; editable?: boolean }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<ResearchProject | null>(null)
  const [editing, setEditing] = useState(editable)
  const [title, setTitle] = useState("")
  const [englishTitle, setEnglishTitle] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    projectService.getById(id).then((data) => { setProject(data); setTitle(data.titulo ?? ""); setEnglishTitle(data.title ?? ""); setEmail(data.email ?? "") })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o projeto."))
      .finally(() => setLoading(false))
  }, [id])

  async function save() {
    if (!id) return
    setSaving(true); setError("")
    const payload: UpdateResearchProjectPayload = { titulo: title, title: englishTitle, email }
    try { await projectService.update(id, payload); setProject((current) => current ? { ...current, titulo: title, title: englishTitle, email } : current); setEditing(false) }
    catch (err) { setError(err instanceof ApiError ? err.message : "Não foi possível atualizar o projeto.") }
    finally { setSaving(false) }
  }

  async function remove() {
    if (!id || !window.confirm("Deseja realmente excluir este projeto?")) return
    try { await projectService.remove(id); navigate(listPaths[role]) } catch (err) { setError(err instanceof ApiError ? err.message : "Não foi possível excluir o projeto.") }
  }

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center gap-2 text-neutral"><Loader2 className="animate-spin"/> Carregando projeto...</div>
  if (!project) return <div className="mx-auto max-w-4xl p-6"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error || "Projeto não encontrado."}</div></div>

  return <main className="min-h-screen bg-neutral-light"><div className="mx-auto max-w-6xl space-y-5 px-6 py-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><Link to={listPaths[role]} className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary"><ArrowLeft size={16}/> Voltar</Link>{role !== "DISCENTE" && <div className="flex gap-2">{editing ? <><button onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"><X size={16}/> Cancelar</button><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"><Save size={16}/>{saving ? "Salvando..." : "Salvar"}</button></> : <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"><Pencil size={16}/> Editar campos suportados</button>}{role === "ADMINISTRADOR" && <button onClick={remove} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"><Trash2 size={16}/> Excluir</button>}</div>}</div>
    {error && <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18}/>{error}</div>}
    <section className="rounded-2xl border border-neutral/20 bg-white p-6"><div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><BookOpen size={14}/> {project.codigo || `Projeto ${project.id}`}</div>{editing ? <div className="mt-5 grid gap-4"><label className="text-sm font-semibold text-primary">Título em português<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"/></label><label className="text-sm font-semibold text-primary">Título em inglês<input value={englishTitle} onChange={(e) => setEnglishTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"/></label><label className="text-sm font-semibold text-primary">E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2 font-normal text-neutral"/></label></div> : <><h1 className="mt-4 text-2xl font-bold text-primary">{project.titulo}</h1><p className="mt-2 text-sm italic text-neutral">{project.title || "—"}</p></>}</section>
    <section className="grid gap-4 rounded-2xl border border-neutral/20 bg-white p-6 md:grid-cols-2 lg:grid-cols-3"><Field label="Tipo" value={project.tipo}/><Field label="Categoria" value={project.categoria}/><Field label="Situação" value={project.situacao}/><Field label="E-mail" value={project.email}/><Field label="Cadastro" value={project.data_cadastro ? project.data_cadastro : "—"}/><Field label="Unidade" value={project.unidade}/><Field label="Palavras-chave" value={project.palavras_chave}/><Field label="Keywords" value={project.key_words}/><Field label="Objetivos relacionados" value={project.objetivos}/></section>
    <section className="space-y-5 rounded-2xl border border-neutral/20 bg-white p-6"><h2 className="text-lg font-bold text-primary">Corpo do projeto</h2><Field label="Resumo" value={project.corpo?.resumo}/><Field label="Abstract" value={project.corpo?.abstract}/><Field label="Introdução" value={project.corpo?.introducao}/><Field label="Objetivos" value={project.corpo?.objetivos}/><Field label="Metodologia" value={project.corpo?.metodologia}/><Field label="Resultados esperados" value={project.corpo?.resultados_esperados}/><Field label="Referências" value={project.corpo?.referencias}/></section>
    <section className="rounded-2xl border border-neutral/20 bg-white p-6"><h2 className="text-lg font-bold text-primary">Atividades</h2>{project.atividades?.length ? <div className="mt-4 space-y-3">{project.atividades.map((activity, index) => <div key={`${activity.descricao}-${index}`} className="rounded-xl border border-neutral/20 p-4"><p className="font-semibold text-primary">{activity.descricao}</p><p className="mt-1 text-sm text-neutral">Meses: {activity.meses?.map((m) => new Date(m).toLocaleDateString("pt-BR")).join(", ") || "—"}</p></div>)}</div> : <p className="mt-3 text-sm text-neutral">Nenhuma atividade retornada pelo back-end.</p>}</section>
  </div></main>
}
