import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CalendarDays, FileText, FolderKanban, Trash2 } from "lucide-react"
import { workPlanService } from "../api/workPlanService"
import type { WorkPlan } from "../types/workPlan"

type Props = {
  backTo: string
  canDelete?: boolean
}

function formatDate(value?: string) {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR")
}

export default function WorkPlanDetailsPage({ backTo, canDelete = false }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<WorkPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true

    workPlanService.getById(id)
      .then((response) => active && setPlan(response))
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar o plano.")
      })
      .finally(() => active && setLoading(false))

    return () => { active = false }
  }, [id])

  async function removePlan() {
    if (!plan || !window.confirm("Deseja realmente excluir este plano de trabalho?")) return
    setDeleting(true)
    setError("")
    try {
      await workPlanService.remove(plan.id)
      navigate(backTo)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível excluir o plano.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-sm text-neutral">Carregando plano de trabalho...</div>
  if (error && !plan) return <div className="p-8"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div></div>
  if (!plan) return <div className="p-8 text-center text-sm text-neutral">Plano não encontrado.</div>

  const body = plan.corpo_plano_trabalho

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to={backTo} className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:text-primary">
            <ArrowLeft size={16} /> Voltar
          </Link>
          {canDelete && (
            <button type="button" onClick={removePlan} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-60">
              <Trash2 size={16} /> {deleting ? "Excluindo..." : "Excluir plano"}
            </button>
          )}
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <section className="rounded-3xl border border-neutral/30 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">{plan.modalidade}</span>
            <span className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-neutral">{plan.status}</span>
            <span className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-neutral">{plan.tipo_bolsa}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-primary">{body?.titulo || `Plano de trabalho ${plan.id}`}</h1>
          <div className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <div><p className="text-xs uppercase text-neutral">Projeto</p><p className="mt-1 font-semibold text-primary">{plan.projeto_pesquisa?.codigo || plan.pesquisa_id} — {plan.projeto_pesquisa?.titulo || "Projeto vinculado"}</p></div>
            <div><p className="text-xs uppercase text-neutral">Direcionamento</p><p className="mt-1 font-semibold text-primary">{plan.direcionamento_plano}</p></div>
            <div><p className="text-xs uppercase text-neutral">Cronograma técnico</p><p className="mt-1 font-semibold text-primary">#{plan.cronograma_id}</p></div>
          </div>
        </section>

        {[
          ["Introdução e justificativa", body?.introducao],
          ["Objetivos", body?.objetivos],
          ["Metodologia", body?.metodologia],
          ["Referências", body?.referencias],
        ].map(([title, content]) => (
          <section key={title} className="rounded-2xl border border-neutral/30 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-primary"><FileText size={18} />{title}</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral">{content || "Não informado."}</p>
          </section>
        ))}

        <section className="rounded-2xl border border-neutral/30 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-primary"><CalendarDays size={18} />Atividades e cronograma</h2>
          <div className="mt-4 space-y-3">
            {plan.atividades.length === 0 ? <p className="text-sm text-neutral">Nenhuma atividade cadastrada.</p> : plan.atividades.map((activity, index) => (
              <div key={activity.id ?? index} className="rounded-xl border border-neutral/20 p-4">
                <p className="font-semibold text-primary">{activity.descricao}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activity.meses.map((month, monthIndex) => <span key={month.id ?? monthIndex} className="rounded-full bg-neutral/10 px-2.5 py-1 text-xs text-neutral">{formatDate(month.data)}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Link to={`/coordenador/projetos/${plan.pesquisa_id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><FolderKanban size={16} />Ver projeto vinculado</Link>
      </div>
    </main>
  )
}
