import { apiRequest, buildQuery } from "@/services/apiClient"

export type DashboardKpis = {
  projetosAtivos: number
  editaisEmAndamento: number
  bolsistasVinculados: number
  relatoriosPendentes: number
  certificadosEmitidos: number
}

export type DashboardDeadline = {
  type: string
  title: string
  entityId: number
  entityType: "edital" | "cota_bolsa" | "projeto_pesquisa" | "relatorio"
  dueDate: string
  daysRemaining: number
}

export type DashboardSummary = {
  generatedAt: string
  kpis: DashboardKpis
  upcomingDeadlines: DashboardDeadline[]
}

const ENDPOINT = "/dashboard/summary"

export const dashboardService = {
  getSummary(upcomingDays = 60) {
    return apiRequest<DashboardSummary>(
      `${ENDPOINT}${buildQuery({ upcomingDays })}`,
    )
  },
}
