import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { workPlanService } from "../api/workPlanService"
import type { WorkPlan } from "../types/workPlan"

const PAGE_SIZE = 10

export function ProjectWorkPlans({ projectId }: { projectId: number }) {
  const location = useLocation()
  const backTo = `${location.pathname}${location.search}${location.hash}`
  const [plans, setPlans] = useState<WorkPlan[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    workPlanService.list({ pesquisa_id: projectId, limit: PAGE_SIZE, offset })
      .then(page => { if (active) { setPlans(page.results); setTotal(page.total) } })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Não foi possível carregar os planos.") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [projectId, offset, reload])

  return (
    <section className="rounded-2xl border border-neutral/20 bg-white p-6">
      <h2 className="text-lg font-bold text-primary">Planos cadastrados</h2>
      {loading ? <p role="status" className="mt-3 text-sm text-neutral">Carregando planos...</p> : error ? (
        <div role="alert" className="mt-3 text-sm text-red-700">{error}
          <button onClick={() => setReload(value => value + 1)} className="ml-3 underline">Tentar novamente</button>
        </div>
      ) : plans.length === 0 ? <p className="mt-3 text-sm text-neutral">Nenhum plano cadastrado neste projeto.</p> : (
        <>
          <ul className="mt-4 space-y-3">
            {plans.map(plan => (
              <li key={plan.id} className="rounded-xl border border-neutral/20 p-4">
                <Link to={`/coordenador/planos/${plan.id}`} state={{ backTo }} className="font-semibold text-primary underline">
                  {plan.corpo_plano_trabalho?.titulo || `Plano ${plan.id}`}
                </Link>
                <p className="mt-1 text-sm text-neutral">{plan.modalidade} • {plan.status}</p>
              </li>
            ))}
          </ul>
          <nav aria-label="Paginação dos planos do projeto" className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span>{total} plano(s) • Página {Math.floor(offset / PAGE_SIZE) + 1}</span>
            <div className="flex gap-3">
              <button disabled={offset === 0} onClick={() => setOffset(value => value - PAGE_SIZE)} className="text-primary disabled:opacity-40">Anterior</button>
              <button disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(value => value + PAGE_SIZE)} className="text-primary disabled:opacity-40">Próxima</button>
            </div>
          </nav>
        </>
      )}
    </section>
  )
}
