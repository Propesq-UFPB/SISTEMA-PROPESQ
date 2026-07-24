import React, { useCallback, useEffect, useState } from "react"
import Card from "@/components/Card"
import { Helmet } from "react-helmet"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/services/apiClient"
import {
  dashboardService,
  type DashboardDeadline,
  type DashboardKpis,
} from "@/features/dashboard/api/dashboardService"

const KPI_LABELS: Array<{ key: keyof DashboardKpis; title: string }> = [
  { key: "projetosAtivos", title: "Projetos ativos" },
  { key: "editaisEmAndamento", title: "Editais em andamento" },
  { key: "bolsistasVinculados", title: "Bolsistas vinculados" },
  { key: "relatoriosPendentes", title: "Relatórios pendentes" },
  { key: "certificadosEmitidos", title: "Certificados emitidos" },
]

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    return err.message || fallback
  }
  return fallback
}

function formatDateBr(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split("-")
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [kpis, setKpis] = useState<DashboardKpis | null>(null)
  const [deadlines, setDeadlines] = useState<DashboardDeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const summary = await dashboardService.getSummary(60)
      setKpis(summary.kpis)
      setDeadlines(summary.upcomingDeadlines)
    } catch (err) {
      setLoadError(errorMessage(err, "Não foi possível carregar o painel."))
      setKpis(null)
      setDeadlines([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  let deadlinesContent: React.ReactNode
  if (loading) {
    deadlinesContent = (
      <p className="text-sm text-neutral">Carregando…</p>
    )
  } else if (deadlines.length === 0) {
    deadlinesContent = (
      <p className="text-sm text-neutral">
        Nenhum prazo nos próximos 60 dias.
      </p>
    )
  } else {
    deadlinesContent = (
      <ul className="space-y-4">
        {deadlines.map((prazo) => (
          <li
            key={`${prazo.entityType}-${prazo.entityId}-${prazo.type}-${prazo.dueDate}`}
            className="
              flex
              items-center
              justify-between
              border-b
              border-neutral/20
              pb-3
              text-sm
            "
          >
            <span className="text-neutral">{prazo.title}</span>

            <span
              className="
                px-4
                py-1.5
                rounded-full
                text-sm
                font-semibold
                border
                border-primary
                text-primary
                min-w-[110px]
                text-center
              "
            >
              {formatDateBr(prazo.dueDate)}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Dashboard • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Painel Administrativo
          </h1>
          <p className="mt-1 text-base text-neutral">
            Olá, {user?.name ?? "Administrador"}.
          </p>
        </header>

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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {KPI_LABELS.map((ind) => (
            <Card
              key={ind.key}
              title=""
              className="
                bg-white
                border-2
                border-primary
                rounded-3xl
                py-3
                text-center
              "
            >
              <div className="space-y-1">
                <div className="text-base font-bold text-primary">
                  {loading ? "…" : (kpis?.[ind.key] ?? "—")}
                </div>

                <div className="text-base font-medium text-primary">
                  {ind.title}
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1">
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Próximos prazos
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            {deadlinesContent}
          </Card>
        </section>
      </div>
    </div>
  )
}
