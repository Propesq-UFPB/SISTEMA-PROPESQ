import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  FileText,
  FileSignature,
  CalendarDays,
  BadgeCheck,
  Clock3,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
} from "lucide-react"

type ReportType = "PARCIAL" | "FINAL"
type ReportStatus = "PENDENTE" | "ENVIADO" | "EM_ANALISE" | "APROVADO"

type StudentReport = {
  id: string
  titulo: string
  tipo: ReportType
  projetoTitulo: string
  edital: string
  periodo: string
  prazo: string
  status: ReportStatus
  atualizadoEm?: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
  actionLabel: string
  actionPath: string
  actionType: "PREENCHER" | "VISUALIZAR"
}

const REPORTS: StudentReport[] = [
  {
    id: "1",
    titulo: "Relatório Parcial Pendente",
    tipo: "PARCIAL",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    periodo: "2026.1",
    prazo: "30/06/2026",
    status: "PENDENTE",
    possuiPendencia: true,
    pendenciaTexto:
      "O relatório parcial ainda não foi preenchido. Acesse o formulário para enviar as informações solicitadas.",
    resumo:
      "Relatório parcial referente ao acompanhamento das atividades desenvolvidas no primeiro ciclo do projeto.",
    actionLabel: "Preencher relatório parcial",
    actionPath: "/discente/relatorios/1/parcial",
    actionType: "PREENCHER",
  },
  {
    id: "2",
    titulo: "Relatório Final Pendente",
    tipo: "FINAL",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "PENDENTE",
    possuiPendencia: true,
    pendenciaTexto:
      "O relatório final está pendente. Preencha o formulário final para concluir o acompanhamento do projeto.",
    resumo:
      "Relatório final com consolidação das atividades, resultados obtidos e contribuições do discente ao projeto.",
    actionLabel: "Preencher relatório final",
    actionPath: "/discente/relatorios/2/final",
    actionType: "PREENCHER",
  },
  {
    id: "3",
    titulo: "Relatório Enviado",
    tipo: "PARCIAL",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    periodo: "2025.2",
    prazo: "20/12/2025",
    status: "ENVIADO",
    atualizadoEm: "18/12/2025",
    possuiPendencia: false,
    resumo:
      "Relatório já enviado pelo discente e disponível para consulta das informações submetidas.",
    actionLabel: "Visualizar relatório enviado",
    actionPath: "/discente/relatorios/3/visualizar",
    actionType: "VISUALIZAR",
  },
]

function getTypeLabel(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "Relatório Parcial"
    case "FINAL":
      return "Relatório Final"
    default:
      return type
  }
}

function getTypeClasses(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "border-primary/30 bg-primary/10 text-primary"
    case "FINAL":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "ENVIADO":
      return "Enviado"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENVIADO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return <Clock3 size={14} />
    case "ENVIADO":
      return <BadgeCheck size={14} />
    case "EM_ANALISE":
      return <Clock3 size={14} />
    case "APROVADO":
      return <CheckCircle2 size={14} />
    default:
      return <BadgeCheck size={14} />
  }
}

export default function ReportsList() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Lista de Relatórios • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="rounded-2xl border border-neutral/20 bg-white px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">
            Lista de Relatórios
          </h1>

          <p className="mt-2 text-sm text-neutral">
            Acompanhe os relatórios vinculados aos seus projetos. Nesta página,
            você pode acessar relatórios pendentes para preenchimento ou
            consultar relatórios já enviados.
          </p>
        </header>

        {/* LISTA */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="space-y-5">
            {REPORTS.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-neutral/20 bg-white p-5 transition hover:border-primary/20"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-primary">
                          {report.titulo}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                            report.tipo
                          )}`}
                        >
                          {report.tipo === "FINAL" ? (
                            <FileSignature size={14} />
                          ) : (
                            <FileText size={14} />
                          )}
                          {getTypeLabel(report.tipo)}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {getStatusLabel(report.status)}
                        </span>
                      </div>

                      <p className="max-w-4xl text-sm leading-6 text-neutral">
                        {report.resumo}
                      </p>
                    </div>

                    <div className="xl:min-w-[260px]">
                      <Link
                        to={report.actionPath}
                        className={
                          report.actionType === "VISUALIZAR"
                            ? "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                            : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        }
                      >
                        {report.actionType === "VISUALIZAR" ? (
                          <Eye size={16} />
                        ) : (
                          <Pencil size={16} />
                        )}
                        {report.actionLabel}
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-neutral">
                        <FolderKanban size={15} />
                        Projeto
                      </div>

                      <div className="mt-1 font-medium text-primary">
                        {report.projetoTitulo}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-neutral">
                        <CalendarDays size={15} />
                        Prazo
                      </div>

                      <div className="mt-1 font-medium text-primary">
                        {report.prazo}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-neutral">
                        <BadgeCheck size={15} />
                        Edital
                      </div>

                      <div className="mt-1 font-medium text-primary">
                        {report.edital}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-neutral">
                        <Clock3 size={15} />
                        Última atualização
                      </div>

                      <div className="mt-1 font-medium text-primary">
                        {report.atualizadoEm || "-"}
                      </div>
                    </div>
                  </div>

                  {report.possuiPendencia && report.pendenciaTexto && (
                    <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-neutral">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={16}
                          className="mt-0.5 shrink-0 text-warning"
                        />

                        <div>
                          <span className="font-semibold text-warning">
                            Pendência identificada:
                          </span>{" "}
                          {report.pendenciaTexto}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}