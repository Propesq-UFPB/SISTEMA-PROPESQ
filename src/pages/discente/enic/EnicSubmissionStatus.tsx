//não estamos usando essa pagina

import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  FolderKanban,
  CalendarDays,
  Clock3,
  UserRound,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ClipboardList,
  Pencil,
  Eye,
  Presentation,
} from "lucide-react"

type EnicStatus =
  | "RASCUNHO"
  | "PENDENTE"
  | "SUBMETIDO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type TimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type EnicSubmissionStatusData = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  evento: string
  modalidade: string
  prazo: string
  status: EnicStatus
  atualizadoEm?: string
  dataSubmissao?: string
  observacao?: string
  pendencia?: string
  timeline: TimelineStep[]
}

const SUBMISSIONS: EnicSubmissionStatusData[] = [
  {
    id: "enic_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    evento: "ENIC 2026",
    modalidade: "Resumo expandido",
    prazo: "15/08/2026",
    status: "RASCUNHO",
    atualizadoEm: "14/03/2026",
    observacao:
      "A submissão ainda está em elaboração. O trabalho pode ser editado antes do envio final ao evento.",
    timeline: [
      {
        titulo: "Submissão criada",
        data: "14/03/2026",
        status: "DONE",
        descricao: "O rascunho foi criado no sistema.",
      },
      {
        titulo: "Preenchimento do trabalho",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "O conteúdo ainda pode ser ajustado pelo discente.",
      },
      {
        titulo: "Envio ao evento",
        data: "Prazo até 15/08/2026",
        status: "PENDING",
      },
      {
        titulo: "Análise da comissão",
        data: "Aguardando submissão",
        status: "PENDING",
      },
    ],
  },
  {
    id: "enic_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    evento: "ENIC 2026",
    modalidade: "Resumo simples",
    prazo: "15/08/2026",
    status: "EM_ANALISE",
    atualizadoEm: "10/03/2026",
    dataSubmissao: "10/03/2026",
    observacao:
      "O trabalho foi submetido e está em análise pela comissão organizadora do ENIC.",
    timeline: [
      {
        titulo: "Submissão criada",
        data: "08/03/2026",
        status: "DONE",
      },
      {
        titulo: "Preenchimento finalizado",
        data: "09/03/2026",
        status: "DONE",
      },
      {
        titulo: "Envio realizado",
        data: "10/03/2026",
        status: "DONE",
        descricao: "A submissão foi registrada com sucesso no evento.",
      },
      {
        titulo: "Análise da comissão",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "A comissão avalia o conteúdo submetido.",
      },
      {
        titulo: "Resultado da submissão",
        data: "Aguardando conclusão da análise",
        status: "PENDING",
      },
    ],
  },
  {
    id: "enic_005",
    titulo: "Repositório Digital para Produção Discente",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    edital: "PROBEX 2024",
    orientador: "Profa. Lúcia Fernandes",
    evento: "ENIC 2024",
    modalidade: "Resumo expandido",
    prazo: "12/08/2024",
    status: "REJEITADO",
    atualizadoEm: "18/08/2024",
    dataSubmissao: "12/08/2024",
    observacao:
      "A submissão foi analisada e rejeitada por inadequação ao formato exigido pelo evento.",
    pendencia:
      "Revisar estrutura textual, aderência ao formato acadêmico e consistência do conteúdo antes de uma nova submissão futura.",
    timeline: [
      {
        titulo: "Submissão criada",
        data: "10/08/2024",
        status: "DONE",
      },
      {
        titulo: "Preenchimento finalizado",
        data: "12/08/2024",
        status: "DONE",
      },
      {
        titulo: "Envio realizado",
        data: "12/08/2024",
        status: "DONE",
      },
      {
        titulo: "Análise da comissão",
        data: "15/08/2024",
        status: "DONE",
      },
      {
        titulo: "Submissão rejeitada",
        data: "18/08/2024",
        status: "FAILED",
        descricao: "A comissão apontou inconsistências e inadequação formal.",
      },
    ],
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

function getStepIcon(status: TimelineStepStatus) {
  switch (status) {
    case "DONE":
      return <CheckCircle2 size={18} className="text-success" />
    case "CURRENT":
      return <Clock3 size={18} className="text-warning" />
    case "FAILED":
      return <AlertTriangle size={18} className="text-danger" />
    default:
      return <Circle size={18} className="text-neutral" />
  }
}

function getStepTitleClass(status: TimelineStepStatus) {
  switch (status) {
    case "DONE":
      return "text-primary"
    case "CURRENT":
      return "text-warning"
    case "FAILED":
      return "text-danger"
    default:
      return "text-neutral"
  }
}

function canEdit(status: EnicStatus) {
  return status === "RASCUNHO" || status === "PENDENTE" || status === "REJEITADO"
}

export default function EnicSubmissionStatus() {
  const { id } = useParams()

  const submission = SUBMISSIONS.find((item) => item.id === id) ?? SUBMISSIONS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Status da Submissão ENIC • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/enic/${submission.id}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para detalhes da submissão
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Presentation size={14} />
                  {submission.modalidade}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    submission.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(submission.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Acompanhamento da submissão ENIC
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Consulte a situação atual da submissão, o histórico de movimentações e eventuais observações da comissão.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              {canEdit(submission.status) && (
                <Link
                  to={`/discente/enic/${submission.id}/editar`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Pencil size={16} />
                  Editar submissão
                </Link>
              )}

              <Link
                to={`/discente/enic/${submission.id}`}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <Eye size={16} />
                Ver detalhes
              </Link>
            </div>
          </div>
        </header>

        {/* PENDÊNCIA */}
        {submission.pendencia && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {submission.pendencia}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.projetoTitulo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Orientador(a)</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.orientador}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Prazo</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.prazo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Data da submissão</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.dataSubmissao || "-"}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CONTEÚDO */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Linha do tempo da submissão
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5">
                {submission.timeline.map((step, index) => (
                  <div key={`${step.titulo}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      {index < submission.timeline.length - 1 && (
                        <div className="mt-2 h-full min-h-[32px] w-px bg-neutral/20" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className={`text-sm font-semibold ${getStepTitleClass(step.status)}`}>
                        {step.titulo}
                      </div>

                      <div className="mt-1 text-sm text-neutral">
                        {step.data}
                      </div>

                      {step.descricao && (
                        <p className="mt-2 text-sm text-neutral leading-6">
                          {step.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações do processo
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Título do trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {submission.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Evento</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.evento}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Modalidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.modalidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status atual</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(submission.status)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Última atualização</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.atualizadoEm || "-"}
                  </div>
                </div>
              </div>
            </Card>

            {submission.observacao && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Observação do processo
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div
                  className={`
                    rounded-xl px-4 py-4 text-sm leading-6
                    ${
                      submission.status === "REJEITADO"
                        ? "border border-warning/20 bg-warning/5 text-neutral"
                        : "border border-primary/20 bg-primary/5 text-neutral"
                    }
                  `}
                >
                  {submission.observacao}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resumo da situação
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    submission.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(submission.status)}
                </span>

                <p className="text-neutral leading-6">
                  {submission.status === "RASCUNHO" &&
                    "A submissão está em construção e ainda pode ser editada antes do envio."}

                  {submission.status === "PENDENTE" &&
                    "A submissão possui pendências e precisa de revisão antes do envio final."}

                  {submission.status === "SUBMETIDO" &&
                    "O trabalho foi submetido com sucesso ao evento."}

                  {submission.status === "EM_ANALISE" &&
                    "O conteúdo está sendo analisado pela comissão do ENIC."}

                  {submission.status === "APROVADO" &&
                    "O trabalho foi aprovado no processo do evento."}

                  {submission.status === "REJEITADO" &&
                    "A submissão foi rejeitada e requer ajustes substanciais para futura reapresentação."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Ações rápidas
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-3">
                {canEdit(submission.status) && (
                  <Link
                    to={`/discente/enic/${submission.id}/editar`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition
                    "
                  >
                    <Pencil size={16} />
                    Editar submissão
                  </Link>
                )}

                <Link
                  to={`/discente/enic/${submission.id}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <Eye size={16} />
                  Ver detalhes
                </Link>

                <Link
                  to={`/discente/projetos/${submission.projetoId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <ClipboardList size={16} />
                  Ver projeto
                </Link>

                <Link
                  to="/discente/enic"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar à lista
                </Link>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Recomendações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Acompanhe esta página para verificar mudanças no status da submissão.
                </li>
                <li className="leading-6">
                  Em caso de rejeição, revise o conteúdo e as exigências formais do evento.
                </li>
                <li className="leading-6">
                  Mantenha coerência entre o trabalho submetido e o projeto de origem.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}