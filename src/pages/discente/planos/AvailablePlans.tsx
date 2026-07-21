import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, Eye, FolderKanban, Search } from "lucide-react"
import { workPlanService } from "@/features/work-plans/api/workPlanService"
import type { WorkPlan } from "@/features/work-plans/types/workPlan"

export default function AvailablePlans() {
  const [plans, setPlans] = useState<WorkPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    let active = true
    workPlanService.list({ limit: 100, offset: 0 })
      .then((response) => active && setPlans(response.results))
      .catch((requestError: unknown) => active && setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os planos."))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return plans
    return plans.filter((plan) => [
      plan.corpo_plano_trabalho?.titulo,
      plan.projeto_pesquisa?.titulo,
      plan.projeto_pesquisa?.codigo,
      plan.modalidade,
      plan.status,
    ].some((value) => String(value || "").toLowerCase().includes(term)))
  }, [plans, search])

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <header>
          <h1 className="text-2xl font-bold text-primary">Planos de trabalho</h1>
          <p className="mt-2 text-sm text-neutral">Listagem conectada ao endpoint <code>GET /work-plans</code>.</p>
        </header>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          O backend ainda não possui filtro de planos disponíveis por discente. Por enquanto, esta página mostra todos os planos cadastrados.
        </div>

        <label className="relative block max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, projeto ou modalidade" className="w-full rounded-xl border border-neutral/30 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </label>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
        {loading ? <div className="py-10 text-center text-sm text-neutral">Carregando planos...</div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral/30 bg-white p-10 text-center text-sm text-neutral">Nenhum plano encontrado.</div> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((plan) => (
              <article key={plan.id} className="rounded-2xl border border-neutral/30 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{plan.modalidade}</span>
                  <span className="rounded-full bg-neutral/10 px-2.5 py-1 text-neutral">{plan.status}</span>
                  <span className="rounded-full bg-neutral/10 px-2.5 py-1 text-neutral">{plan.tipo_bolsa}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-primary">{plan.corpo_plano_trabalho?.titulo || `Plano ${plan.id}`}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-neutral"><FolderKanban size={16} className="mt-0.5 shrink-0" />{plan.projeto_pesquisa?.codigo || plan.pesquisa_id} — {plan.projeto_pesquisa?.titulo || "Projeto vinculado"}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-neutral"><CalendarDays size={16} />{plan.atividades.length} atividade(s)</p>
                <Link to={`/discente/planos-disponiveis/${plan.id}`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"><Eye size={16} />Visualizar</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
