import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Check, Eye, FolderKanban, Search } from "lucide-react"
import { workPlanService } from "@/features/work-plans/api/workPlanService"
import type { AvailableWorkPlan } from "@/features/work-plans/types/workPlan"
import { ApiError } from "@/services/apiClient"

const PAGE_SIZE = 10

export default function AvailablePlans() {
  const [plans, setPlans] = useState<AvailableWorkPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [reload, setReload] = useState(0)
  const [registered, setRegistered] = useState<Record<number, boolean>>({})
  const [pending, setPending] = useState<Record<number, boolean>>({})
  const [interestErrors, setInterestErrors] = useState<Record<number, string>>({})
  const inFlight = useRef(new Set<number>())

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    workPlanService.availableForInterest({ limit: PAGE_SIZE, offset })
      .then((response) => {
        if (!active) return
        setPlans(response.results)
        setTotal(response.total)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setPlans([])
        setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os planos.")
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [offset, reload])

  async function registerInterest(id: number) {
    if (inFlight.current.has(id) || registered[id]) return
    inFlight.current.add(id)
    setPending(current => ({ ...current, [id]: true }))
    setInterestErrors(current => ({ ...current, [id]: "" }))
    try {
      await workPlanService.registerInterest(id)
      setRegistered(current => ({ ...current, [id]: true }))
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 409) {
        setRegistered(current => ({ ...current, [id]: true }))
      } else {
        setInterestErrors(current => ({ ...current, [id]: requestError instanceof Error ? requestError.message : "Não foi possível registrar o interesse. Tente novamente." }))
      }
    } finally {
      inFlight.current.delete(id)
      setPending(current => ({ ...current, [id]: false }))
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return plans.filter(plan => [
      plan.corpo_plano_trabalho?.titulo,
      plan.projeto_pesquisa.titulo,
      plan.projeto_pesquisa.edital_rel.descricao,
      plan.modalidade,
    ].some(value => String(value || "").toLowerCase().includes(term)))
  }, [plans, search])

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <header>
          <h1 className="text-2xl font-bold text-primary">Planos disponíveis para interesse</h1>
          <p className="mt-2 text-sm text-neutral">Conheça os planos de projetos vinculados a editais publicados e registre seu interesse em participar.</p>
        </header>

        <label className="relative block max-w-xl">
          <span className="sr-only">Buscar nos planos desta página</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar nesta página por título, projeto, edital ou modalidade" className="w-full rounded-xl border border-neutral/30 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </label>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}<button onClick={() => setReload(value => value + 1)} className="ml-3 underline">Tentar novamente</button></div>}
        {loading ? <div role="status" className="py-10 text-center text-sm text-neutral">Carregando planos...</div> : !error && (filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral/30 bg-white p-10 text-center text-sm text-neutral">{search ? "Nenhum plano corresponde à busca nesta página." : "Nenhum plano disponível nesta página."}</div> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map(plan => (
              <article key={plan.id} className="rounded-2xl border border-neutral/30 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{plan.modalidade}</span>
                  <span className="rounded-full bg-neutral/10 px-2.5 py-1 text-neutral">{plan.bolsa_id ? `Bolsa ${plan.bolsa_id}` : "Sem bolsa"}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-primary">{plan.corpo_plano_trabalho?.titulo || `Plano ${plan.id}`}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-neutral"><FolderKanban size={16} className="mt-0.5 shrink-0" />{plan.projeto_pesquisa.titulo}</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-neutral"><BookOpen size={16} className="mt-0.5 shrink-0" />{plan.projeto_pesquisa.edital_rel.descricao}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={`/discente/planos-disponiveis/${plan.id}`} className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary"><Eye size={16} />Visualizar</Link>
                  <button disabled={pending[plan.id] || registered[plan.id]} onClick={() => void registerInterest(plan.id)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {registered[plan.id] && <Check size={16} />}
                    {registered[plan.id] ? "Interesse registrado" : pending[plan.id] ? "Registrando..." : "Registrar interesse"}
                  </button>
                </div>
                <div aria-live="polite">
                  {registered[plan.id] && <p className="mt-3 text-sm text-emerald-700">Seu interesse neste plano está registrado.</p>}
                  {interestErrors[plan.id] && <p role="alert" className="mt-3 text-sm text-red-700">{interestErrors[plan.id]}</p>}
                </div>
              </article>
            ))}
          </div>
        ))}
        {!error && <nav aria-label="Paginação dos planos" className="flex items-center justify-between gap-3 text-sm text-neutral">
          <span>Página {Math.floor(offset / PAGE_SIZE) + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))} • {total} planos</span>
          <div className="flex gap-2">
            <button disabled={loading || offset === 0} onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))} className="rounded-lg border border-neutral/30 px-3 py-2 disabled:opacity-40">Anterior</button>
            <button disabled={loading || offset + PAGE_SIZE >= total} onClick={() => setOffset(value => value + PAGE_SIZE)} className="rounded-lg border border-neutral/30 px-3 py-2 disabled:opacity-40">Próxima</button>
          </div>
        </nav>}
      </div>
    </main>
  )
}
