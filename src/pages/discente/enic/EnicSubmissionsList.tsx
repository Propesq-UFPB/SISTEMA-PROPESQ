// não to usando

import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  FileText,
  CalendarDays,
  BadgeCheck,
  Clock3,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Presentation,
} from "lucide-react"

type EnicStatus =
  | "RASCUNHO"
  | "PENDENTE"
  | "SUBMETIDO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"

type EnicSubmission = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  evento: string
  modalidade: string
  prazo: string
  status: EnicStatus
  atualizadoEm?: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
}

const SUBMISSIONS: EnicSubmission[] = [
  {
    id: "enic_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    evento: "ENIC 2026",
    modalidade: "Resumo expandido",
    prazo: "15/08/2026",
    status: "RASCUNHO",
    atualizadoEm: "14/03/2026",
    possuiPendencia: false,
    resumo:
      "Submissão em elaboração vinculada ao projeto de desenvolvimento de plataforma acadêmica institucional.",
  },
  {
    id: "enic_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    evento: "ENIC 2026",
    modalidade: "Resumo simples",
    prazo: "15/08/2026",
    status: "SUBMETIDO",
    atualizadoEm: "10/03/2026",
    possuiPendencia: false,
    resumo:
      "Trabalho submetido ao ENIC com foco em classificação de produção científica utilizando técnicas de IA.",
  },
  {
    id: "enic_003",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    evento: "ENIC 2025",
    modalidade: "Resumo expandido",
    prazo: "10/08/2025",
    status: "EM_ANALISE",
    atualizadoEm: "08/08/2025",
    possuiPendencia: false,
    resumo:
      "Submissão encaminhada ao evento e aguardando retorno da comissão avaliadora.",
  },
]

function getStatusLabel(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PENDENTE":
      return "Pendente"
    case "SUBMETIDO":
      return "Submetido"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return status
  }
}

function getStatusClasses(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "SUBMETIDO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getPrimaryActionLabel(item: EnicSubmission) {
  if (
    item.status === "RASCUNHO" ||
    item.status === "PENDENTE" ||
    item.status === "REJEITADO"
  ) {
    return "Editar submissão"
  }

  return "Visualizar"
}

function getPrimaryAction(item: EnicSubmission) {
  if (
    item.status === "RASCUNHO" ||
    item.status === "PENDENTE" ||
    item.status === "REJEITADO"
  ) {
    return `/discente/enic/${item.id}/editar`
  }

  return `/discente/enic/${item.id}`
}

export default function EnicSubmissionsList() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Submissões ENIC • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">
              Submissões ENIC
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Gerencie seus trabalhos submetidos ao ENIC e acompanhe o andamento
              das análises.
            </p>
          </header>

          {/* LISTA */}
          <section className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            {SUBMISSIONS.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhuma submissão encontrada
                </div>

                <p className="mt-1 text-sm text-neutral">
                  Quando houver submissões ENIC cadastradas, elas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {SUBMISSIONS.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-neutral/20 bg-white p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {/* TOPO */}
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-primary">
                              {item.titulo}
                            </h3>

                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              <Presentation size={14} />
                              {item.modalidade}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "APROVADO" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "EM_ANALISE" ||
                                item.status === "PENDENTE" ||
                                item.status === "SUBMETIDO" ? (
                                <Clock3 size={14} />
                              ) : item.status === "REJEITADO" ? (
                                <AlertTriangle size={14} />
                              ) : (
                                <FileText size={14} />
                              )}

                              {getStatusLabel(item.status)}
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-neutral">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row xl:min-w-[210px] xl:flex-col">
                          <Link
                            to={getPrimaryAction(item)}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              transition hover:opacity-90
                            "
                          >
                            <Pencil size={16} />
                            {getPrimaryActionLabel(item)}
                          </Link>

                          <Link
                            to={`/discente/enic/${item.id}`}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl border border-primary
                              px-4 py-3 text-sm font-medium text-primary
                              transition hover:bg-primary/5
                            "
                          >
                            <Eye size={16} />
                            Detalhes
                          </Link>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Projeto
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.projetoTitulo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Prazo
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.prazo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Evento
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.evento}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <Clock3 size={15} />
                            Última atualização
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.atualizadoEm || "-"}
                          </div>
                        </div>
                      </div>

                      {/* PENDÊNCIA */}
                      {item.possuiPendencia && item.pendenciaTexto && (
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
                              {item.pendenciaTexto}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}