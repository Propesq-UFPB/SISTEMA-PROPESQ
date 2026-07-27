import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ChevronLeft, ChevronRight, Eye, FolderKanban, Loader2, Plus, Search } from "lucide-react"
import { projectService } from "../api/projectService"
import type { ResearchProject, UserRole } from "../types/project"
import { ApiError } from "@/services/apiClient"

const PAGE_SIZE = 10

const paths: Record<UserRole, { details: (id: number) => string; create?: string }> = {
  DISCENTE: { details: (id) => `/discente/projetos/${id}` },
  COORDENADOR: { details: (id) => `/coordenador/projetos/${id}`, create: "/coordenador/projetos/novo" },
  ADMINISTRADOR: { details: (id) => `/adm/projetos/${id}/visualizar`, create: "/adm/projetos/novo" },
  GESTOR: { details: (id) => `/gestor/projetos/${id}/visualizar`, create: "/gestor/projetos/novo"},
}

function statusClass(status: string) {
  const value = status.toLowerCase()
  if (value.includes("aprov") || value.includes("defer")) return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (value.includes("reprov") || value.includes("indefer")) return "border-red-200 bg-red-50 text-red-700"
  if (value.includes("avali") || value.includes("submet")) return "border-blue-200 bg-blue-50 text-blue-700"
  return "border-amber-200 bg-amber-50 text-amber-700"
}

export default function ProjectListPage({ role, title = "Projetos de pesquisa" }: { role: UserRole; title?: string }) {
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    projectService.list({ limit: PAGE_SIZE, offset })
      .then((response) => {
        if (!active) return
        setProjects(response.results ?? [])
        setTotal(response.total ?? 0)
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar os projetos.")
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [offset])

  const statuses = useMemo(() => Array.from(new Set(projects.map((p) => p.situacao).filter(Boolean))), [projects])
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesText = !term || [project.titulo, project.title, project.codigo, project.categoria, project.situacao]
        .some((value) => String(value ?? "").toLowerCase().includes(term))
      return matchesText && (!status || project.situacao === status)
    })
  }, [projects, search, status])

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral/20 bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><FolderKanban size={14}/> Módulo de projetos</div>
            <h1 className="mt-3 text-2xl font-bold text-primary">{title}</h1>
            <p className="mt-1 text-sm text-neutral">Dados carregados pelo endpoint <code>/research-projects</code>.</p>
          </div>
          {paths[role].create && <Link to={paths[role].create!} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/> Novo projeto</Link>}
        </section>

        <section className="rounded-2xl border border-neutral/20 bg-white shadow-card">
          <div className="grid gap-3 border-b border-neutral/20 p-4 md:grid-cols-[1fr_260px]">
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar os resultados desta página..." className="w-full rounded-xl border border-neutral/20 py-2.5 pl-9 pr-3 text-sm"/></div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-neutral/20 bg-white px-3 py-2.5 text-sm"><option value="">Todas as situações</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
          </div>

          {loading ? <div className="flex items-center justify-center gap-2 p-12 text-neutral"><Loader2 className="animate-spin"/> Carregando projetos...</div>
          : error ? <div className="m-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18}/><div><strong>Falha na consulta.</strong><p>{error}</p></div></div>
          : filtered.length === 0 ? <div className="p-12 text-center text-sm text-neutral">Nenhum projeto encontrado.</div>
          : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-neutral-light/60 text-xs uppercase text-neutral"><tr><th className="px-5 py-3">Código</th><th className="px-5 py-3">Título</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Situação</th><th className="px-5 py-3">Cadastro</th><th className="px-5 py-3 text-right">Ações</th></tr></thead><tbody>{filtered.map((project) => <tr key={project.id} className="border-t border-neutral/15"><td className="px-5 py-4 font-medium text-primary">{project.codigo || project.id}</td><td className="px-5 py-4"><p className="font-semibold text-primary">{project.titulo}</p><p className="mt-1 text-xs text-neutral">{project.title || "Título em inglês não informado"}</p></td><td className="px-5 py-4 text-neutral">{project.categoria || "—"}</td><td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(project.situacao || "")}`}>{project.situacao || "Não informada"}</span></td><td className="px-5 py-4 text-neutral">{project.data_cadastro ? project.data_cadastro : "—"}</td><td className="px-5 py-4 text-right"><Link to={paths[role].details(project.id)} className="inline-flex items-center gap-2 rounded-lg border border-neutral/20 px-3 py-2 font-semibold text-primary hover:bg-primary/5"><Eye size={15}/> Visualizar</Link></td></tr>)}</tbody></table></div>}

          <div className="flex items-center justify-between border-t border-neutral/20 p-4 text-sm text-neutral"><span>Página {currentPage} de {totalPages} • {total} registros</span><div className="flex gap-2"><button disabled={offset === 0 || loading} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))} className="rounded-lg border border-neutral/20 p-2 disabled:opacity-40"><ChevronLeft size={17}/></button><button disabled={offset + PAGE_SIZE >= total || loading} onClick={() => setOffset(offset + PAGE_SIZE)} className="rounded-lg border border-neutral/20 p-2 disabled:opacity-40"><ChevronRight size={17}/></button></div></div>
        </section>
        <p className="text-xs text-neutral">A busca textual e o filtro de situação são aplicados apenas sobre a página carregada. O back-end ainda não oferece filtros de pesquisa.</p>
      </div>
    </main>
  )
}
