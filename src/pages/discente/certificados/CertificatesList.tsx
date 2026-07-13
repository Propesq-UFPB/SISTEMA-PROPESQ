import React from "react"
import { Helmet } from "react-helmet"
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Download,
  FolderKanban,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

type CertificateType =
  | "PARTICIPACAO"
  | "BOLSISTA"
  | "VOLUNTARIO"
  | "ENIC"
  | "RELATORIO"

type CertificateStatus =
  | "DISPONIVEL"
  | "EM_PROCESSAMENTO"
  | "PENDENTE"
  | "INDEFERIDO"

type StudentCertificate = {
  id: string
  titulo: string
  tipo: CertificateType
  status: CertificateStatus
  projetoId?: string
  projetoTitulo?: string
  referencia: string
  periodo: string
  emitidoEm?: string
  resumo: string
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const CERTIFICATES: StudentCertificate[] = [
  {
    id: "cert_001",
    titulo: "Certificado de Participação em Projeto de Pesquisa",
    tipo: "PARTICIPACAO",
    status: "DISPONIVEL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    emitidoEm: "10/01/2027",
    resumo:
      "Certificado referente à participação discente no projeto de pesquisa vinculado ao edital PIBIC 2026.",
    possuiPendencia: false,
  },
  {
    id: "cert_002",
    titulo: "Certificado de Bolsista de Iniciação Científica",
    tipo: "BOLSISTA",
    status: "DISPONIVEL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    referencia: "PIBIC 2026",
    periodo: "01/05/2026 a 31/12/2026",
    emitidoEm: "10/01/2027",
    resumo:
      "Certificado emitido para discente bolsista de iniciação científica.",
    possuiPendencia: false,
  },
  {
    id: "cert_003",
    titulo: "Certificado de Apresentação no ENIC 2025",
    tipo: "ENIC",
    status: "DISPONIVEL",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    referencia: "ENIC 2025",
    periodo: "20/08/2025",
    emitidoEm: "30/08/2025",
    resumo: "Certificado de apresentação de trabalho acadêmico no ENIC 2025.",
    possuiPendencia: false,
  },
]

function getTypeLabel(type: CertificateType) {
  switch (type) {
    case "PARTICIPACAO":
      return "Participação"
    case "BOLSISTA":
      return "Bolsista"
    case "VOLUNTARIO":
      return "Voluntário"
    case "ENIC":
      return "ENIC"
    case "RELATORIO":
      return "Relatório"
    default:
      return type
  }
}

function getTypeClasses(type: CertificateType) {
  switch (type) {
    case "PARTICIPACAO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "BOLSISTA":
      return "border-success/30 bg-success/10 text-success"
    case "VOLUNTARIO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "ENIC":
      return "border-warning/30 bg-warning/10 text-warning"
    case "RELATORIO":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: CertificateStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_PROCESSAMENTO":
      return "Em processamento"
    case "PENDENTE":
      return "Pendente"
    case "INDEFERIDO":
      return "Indeferido"
    default:
      return status
  }
}

function getStatusClasses(status: CertificateStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_PROCESSAMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "INDEFERIDO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function CertificatesList() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Certificados • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Certificados</h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Consulte certificados emitidos, documentos em processamento e
              pendências relacionadas à sua participação acadêmica.
            </p>
          </header>

          {/* LISTA */}
          <section className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            {CERTIFICATES.length === 0 ? (
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
                <div className="text-base font-semibold text-primary">
                  Nenhum certificado encontrado
                </div>

                <p className="mt-1 text-sm text-neutral">
                  Quando houver certificados vinculados ao seu perfil, eles
                  aparecerão nesta página.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {CERTIFICATES.map((item) => (
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
                              <Award size={14} />
                              {getTypeLabel(item.tipo)}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status === "DISPONIVEL" ? (
                                <CheckCircle2 size={14} />
                              ) : item.status === "INDEFERIDO" ? (
                                <AlertTriangle size={14} />
                              ) : (
                                <Clock3 size={14} />
                              )}

                              {getStatusLabel(item.status)}
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-neutral">
                            {item.resumo}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row xl:min-w-[210px] xl:flex-col">
                          <button
                            type="button"
                            disabled={item.status !== "DISPONIVEL"}
                            className="
                              inline-flex items-center justify-center gap-2
                              rounded-xl bg-primary px-4 py-3
                              text-sm font-semibold text-white
                              transition hover:opacity-90
                              disabled:opacity-50
                            "
                          >
                            <Download size={16} />
                            Baixar
                          </button>
                        </div>
                      </div>

                      {/* META */}
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                          <div className="flex items-center gap-2 text-neutral">
                            <FolderKanban size={15} />
                            Projeto / vínculo
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.projetoTitulo || "-"}
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
                            <Clock3 size={15} />
                            Emitido em
                          </div>

                          <div className="mt-1 font-medium text-primary">
                            {item.emitidoEm || "-"}
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