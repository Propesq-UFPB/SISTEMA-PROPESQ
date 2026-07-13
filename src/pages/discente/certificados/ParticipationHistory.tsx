import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  Award,
  FileText,
  CalendarDays,
  BadgeCheck,
  Eye,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Download,
} from "lucide-react"

type ParticipationType =
  | "PESQUISA"
  | "EXTENSAO"
  | "ENIC"
  | "BOLSISTA"
  | "VOLUNTARIO"

type ParticipationStatus =
  | "CONCLUIDA"
  | "EM_ANDAMENTO"
  | "PENDENTE_REGISTRO"
  | "INDEFERIDA"

type ParticipationItem = {
  id: string
  titulo: string
  tipo: ParticipationType
  status: ParticipationStatus
  planoTrabalhoId?: string
  planoTrabalhoTitulo?: string
  declaracaoId?: string
  referencia: string
  periodo: string
  cargaHoraria?: string
  resumo: string
  possuiDeclaracao: boolean
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const PARTICIPATIONS: ParticipationItem[] = [
  {
    id: "part_001",
    titulo: "Declaração de Participação em Plano de Trabalho PIBIC 2026",
    tipo: "PESQUISA",
    status: "EM_ANDAMENTO",
    planoTrabalhoId: "1",
    planoTrabalhoTitulo:
      "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    cargaHoraria: "20h semanais",
    resumo:
      "Participação discente vinculada ao plano de trabalho de iniciação científica. A declaração será disponibilizada após validação institucional.",
    possuiDeclaracao: false,
    possuiPendencia: false,
  },
  {
    id: "part_002",
    titulo: "Declaração de Participação como Bolsista",
    tipo: "BOLSISTA",
    status: "CONCLUIDA",
    planoTrabalhoId: "1",
    planoTrabalhoTitulo:
      "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    declaracaoId: "decl_002",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    cargaHoraria: "20h semanais",
    resumo:
      "Declaração emitida para participação como bolsista em plano de trabalho de iniciação científica.",
    possuiDeclaracao: true,
    possuiPendencia: false,
  },
  {
    id: "part_003",
    titulo: "Declaração de Participação em Apresentação no ENIC",
    tipo: "ENIC",
    status: "CONCLUIDA",
    planoTrabalhoId: "3",
    planoTrabalhoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    declaracaoId: "decl_003",
    referencia: "ENIC 2025",
    periodo: "20/08/2025",
    resumo:
      "Declaração referente à participação em apresentação de trabalho vinculada ao plano de trabalho.",
    possuiDeclaracao: true,
    possuiPendencia: false,
  },
  {
    id: "part_004",
    titulo: "Declaração de Participação Voluntária",
    tipo: "VOLUNTARIO",
    status: "PENDENTE_REGISTRO",
    planoTrabalhoId: "2",
    planoTrabalhoTitulo:
      "IA Aplicada à Classificação de Produção Científica",
    referencia: "PIBITI 2026",
    periodo: "10/05/2026 a 30/11/2026",
    resumo:
      "Participação voluntária vinculada ao plano de trabalho, aguardando consolidação institucional do registro.",
    possuiDeclaracao: false,
    possuiPendencia: true,
    pendenciaTexto:
      "A emissão da declaração depende da conclusão e validação definitiva do vínculo no plano de trabalho.",
  },
  {
    id: "part_005",
    titulo: "Declaração de Participação em Plano de Trabalho PROBEX 2024",
    tipo: "EXTENSAO",
    status: "INDEFERIDA",
    planoTrabalhoId: "5",
    planoTrabalhoTitulo: "Repositório Digital para Produção Discente",
    referencia: "PROBEX 2024",
    periodo: "10/08/2024 a 15/10/2024",
    resumo:
      "Solicitação de declaração não aprovada por inconsistência no encerramento do vínculo ao plano de trabalho.",
    possuiDeclaracao: false,
    possuiPendencia: true,
    pendenciaTexto:
      "A participação precisa ser regularizada no plano de trabalho para futura emissão da declaração.",
  },
]

function getTypeLabel(type: ParticipationType) {
  switch (type) {
    case "PESQUISA":
      return "Pesquisa"
    case "EXTENSAO":
      return "Extensão"
    case "ENIC":
      return "ENIC"
    case "BOLSISTA":
      return "Bolsista"
    case "VOLUNTARIO":
      return "Voluntário"
    default:
      return type
  }
}

function getTypeClasses(type: ParticipationType) {
  switch (type) {
    case "PESQUISA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-success/30 bg-success/10 text-success"
    case "ENIC":
      return "border-warning/30 bg-warning/10 text-warning"
    case "BOLSISTA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "VOLUNTARIO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ParticipationStatus) {
  switch (status) {
    case "CONCLUIDA":
      return "Concluída"
    case "EM_ANDAMENTO":
      return "Em andamento"
    case "PENDENTE_REGISTRO":
      return "Pendente de registro"
    case "INDEFERIDA":
      return "Indeferida"
    default:
      return status
  }
}

function getStatusClasses(status: ParticipationStatus) {
  switch (status) {
    case "CONCLUIDA":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ANDAMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE_REGISTRO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "INDEFERIDA":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function ParticipationDeclaration() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Declaração de Participação • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">
              Declaração de Participação
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Consulte suas declarações de participação emitidas a partir dos
              planos de trabalho vinculados ao seu perfil acadêmico.
            </p>
          </header>

          {/* LISTA */}
          <section className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            {PARTICIPATIONS.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhuma declaração encontrada
                </div>

                <p className="mt-1 text-sm text-neutral">
                  Quando houver declarações vinculadas aos seus planos de
                  trabalho, elas aparecerão nesta página.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {PARTICIPATIONS.map((item) => (
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

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                                item.tipo
                              )}`}
                            >
                              <ClipboardList size={14} />
                              {getTypeLabel(item.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "CONCLUIDA" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "INDEFERIDA" ? (
                                <AlertTriangle size={14} />
                              ) : (
                                <Clock3 size={14} />
                              )}

                              {getStatusLabel(item.status)}
                            </span>

                            {item.possuiDeclaracao && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                <Award size={14} />
                                Declaração disponível
                              </span>
                            )}
                          </div>

                          <p className="text-sm leading-6 text-neutral">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row xl:min-w-[220px] xl:flex-col">
                          {item.planoTrabalhoId && (
                            <Link
                              to={`/discente/planos-disponiveis/${item.planoTrabalhoId}`}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl border border-primary
                                px-4 py-3 text-sm font-medium text-primary
                                transition hover:bg-primary/5
                              "
                            >
                              <Eye size={16} />
                              Ver plano de trabalho
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={!item.possuiDeclaracao}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              transition hover:opacity-90
                              disabled:opacity-50
                            "
                          >
                            <Download size={16} />
                            Baixar declaração
                          </button>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <ClipboardList size={15} />
                            Plano de trabalho
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.planoTrabalhoTitulo || "-"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <BadgeCheck size={15} />
                            Referência
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.referencia}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <CalendarDays size={15} />
                            Período
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.periodo}
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FileText size={15} />
                            Carga horária
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.cargaHoraria || "-"}
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