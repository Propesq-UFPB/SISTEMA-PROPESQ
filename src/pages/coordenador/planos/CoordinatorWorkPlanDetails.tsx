// src/pages/coordenador/planos/CoordinatorWorkPlanDetails.tsx

import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  GraduationCap,
  History,
  Info,
  RefreshCcw,
  Repeat2,
  Send,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react"

/* ================= TIPOS ================= */

type PlanoStatus = "APROVADO" | "REPROVADO" | "COM_BOLSA" | "VOLUNTARIO"

type ModalidadePlano = "PIBIC" | "PIBIC-AF" | "PIBITI" | "PIVIC" | "PIVITI"

type SituacaoPagamento =
  | "NAO_SE_APLICA"
  | "AGUARDANDO_IMPLANTACAO"
  | "ATIVO"
  | "SUSPENSO"
  | "FINALIZADO"
  | "PENDENTE_DOCUMENTACAO"

type TipoHistoricoDiscente =
  | "INDICACAO_INICIAL"
  | "SUBSTITUICAO"
  | "CANCELAMENTO_INDICACAO"
  | "REMANEJAMENTO"

type TipoRelatorio = "PARCIAL" | "FINAL"

type SituacaoRelatorio = "PENDENTE" | "ENVIADO" | "APROVADO" | "NAO_OBRIGATORIO"

type Discente = {
  id: string
  nome: string
  matricula: string
  curso: string
  email: string
  tipoVinculo: "BOLSISTA" | "VOLUNTARIO"
  dataInicio: string
  dataFim?: string
}

type HistoricoDiscente = {
  id: string
  tipo: TipoHistoricoDiscente
  data: string
  discente: string
  matricula: string
  descricao: string
  responsavel: string
}

type PagamentoBolsa = {
  situacao: SituacaoPagamento
  banco?: string
  agencia?: string
  conta?: string
  inicioVigencia?: string
  fimVigencia?: string
  ultimoPagamento?: string
  proximoPagamento?: string
  observacao?: string
}

type RelatorioPlano = {
  tipo: TipoRelatorio
  situacao: SituacaoRelatorio
  obrigatorioParaCancelamento: boolean
  dataEnvio?: string
  dataAprovacao?: string
  observacao?: string
}

type PlanoDetalhes = {
  id: string
  codigo: string
  titulo: string
  title: string
  modalidade: ModalidadePlano
  status: PlanoStatus
  projeto: {
    id: string
    codigo: string
    titulo: string
    edital: string
    coordenador: string
    periodo: string
  }
  discenteAtual: Discente
  historicoDiscentes: HistoricoDiscente[]
  pagamentoBolsa: PagamentoBolsa
  relatorios: RelatorioPlano[]
  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  referencias: string
  cronograma: Array<{
    mes: string
    atividade: string
  }>
}

/* ================= MOCK ================= */

const planosMock: PlanoDetalhes[] = [
  {
    id: "1",
    codigo: "PLANO-2026-001",
    titulo: "Análise de requisitos e validação do sistema de acompanhamento",
    title: "Requirements Analysis and Validation of the Monitoring System",
    modalidade: "PIBIC",
    status: "COM_BOLSA",
    projeto: {
      id: "1",
      codigo: "PROPESQ-2026-001",
      titulo: "Sistema inteligente para acompanhamento de projetos de pesquisa",
      edital: "PIBIC 2026",
      coordenador: "Profa. Mariana Silva",
      periodo: "2026-08-01 → 2027-07-31",
    },
    discenteAtual: {
      id: "d1",
      nome: "Ana Beatriz Lima",
      matricula: "202600001",
      curso: "Ciência da Computação",
      email: "ana.beatriz@academico.ufpb.br",
      tipoVinculo: "BOLSISTA",
      dataInicio: "2026-08-01",
    },
    historicoDiscentes: [
      {
        id: "h1",
        tipo: "INDICACAO_INICIAL",
        data: "2026-07-20",
        discente: "Ana Beatriz Lima",
        matricula: "202600001",
        descricao: "Discente indicada inicialmente para execução do plano.",
        responsavel: "Profa. Mariana Silva",
      },
      {
        id: "h2",
        tipo: "REMANEJAMENTO",
        data: "2026-08-05",
        discente: "Ana Beatriz Lima",
        matricula: "202600001",
        descricao: "Plano remanejado de voluntário para bolsista.",
        responsavel: "Coordenação PROPESQ",
      },
    ],
    pagamentoBolsa: {
      situacao: "ATIVO",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "98765-4",
      inicioVigencia: "2026-08-01",
      fimVigencia: "2027-07-31",
      ultimoPagamento: "2026-10-10",
      proximoPagamento: "2026-11-10",
      observacao: "Bolsa ativa e sem pendências documentais.",
    },
    relatorios: [
      {
        tipo: "PARCIAL",
        situacao: "APROVADO",
        obrigatorioParaCancelamento: true,
        dataEnvio: "2027-01-20",
        dataAprovacao: "2027-01-25",
      },
      {
        tipo: "FINAL",
        situacao: "PENDENTE",
        obrigatorioParaCancelamento: true,
        observacao:
          "Obrigatório em caso de cancelamento após período final de execução.",
      },
    ],
    introducaoJustificativa:
      "Este plano contribui para a validação de funcionalidades essenciais do sistema de acompanhamento de projetos.",
    objetivos:
      "Analisar requisitos, validar fluxos de uso e apoiar a consolidação dos instrumentos de acompanhamento.",
    metodologia:
      "Serão realizadas reuniões periódicas, revisão dos requisitos, testes funcionais e registro das evidências de validação.",
    referencias:
      "Referências relacionadas à gestão de projetos, sistemas acadêmicos e acompanhamento institucional.",
    cronograma: [
      {
        mes: "Mês 1",
        atividade: "Revisão dos requisitos e alinhamento metodológico.",
      },
      {
        mes: "Mês 2",
        atividade: "Mapeamento dos fluxos principais do sistema.",
      },
      {
        mes: "Mês 3",
        atividade: "Validação dos formulários e regras de negócio.",
      },
    ],
  },
  {
    id: "2",
    codigo: "PLANO-2026-002",
    titulo: "Prototipação de módulos computacionais para ambientes educacionais",
    title: "Prototyping Computational Modules for Educational Environments",
    modalidade: "PIVIC",
    status: "VOLUNTARIO",
    projeto: {
      id: "2",
      codigo: "PROPESQ-2026-014",
      titulo: "Aplicação de visão computacional em ambientes educacionais",
      edital: "PIVIC 2026",
      coordenador: "Prof. João Pereira",
      periodo: "2026-08-01 → 2027-07-31",
    },
    discenteAtual: {
      id: "d2",
      nome: "Carlos Eduardo Santos",
      matricula: "202600002",
      curso: "Engenharia de Computação",
      email: "carlos.santos@academico.ufpb.br",
      tipoVinculo: "VOLUNTARIO",
      dataInicio: "2026-08-01",
    },
    historicoDiscentes: [
      {
        id: "h3",
        tipo: "INDICACAO_INICIAL",
        data: "2026-07-22",
        discente: "Carlos Eduardo Santos",
        matricula: "202600002",
        descricao: "Discente indicado como voluntário.",
        responsavel: "Prof. João Pereira",
      },
    ],
    pagamentoBolsa: {
      situacao: "NAO_SE_APLICA",
      observacao: "Plano atualmente cadastrado como voluntário.",
    },
    relatorios: [
      {
        tipo: "PARCIAL",
        situacao: "PENDENTE",
        obrigatorioParaCancelamento: true,
        observacao:
          "Para cancelar o plano nesta fase, o relatório parcial deve ser enviado.",
      },
      {
        tipo: "FINAL",
        situacao: "NAO_OBRIGATORIO",
        obrigatorioParaCancelamento: false,
      },
    ],
    introducaoJustificativa:
      "O plano apoia a prototipação de módulos computacionais do projeto.",
    objetivos:
      "Desenvolver protótipos, testar componentes e documentar os resultados obtidos.",
    metodologia:
      "Implementação incremental, testes de funcionamento e análise dos resultados.",
    referencias:
      "Referências técnicas sobre prototipação, visão computacional e tecnologias educacionais.",
    cronograma: [
      {
        mes: "Mês 1",
        atividade: "Levantamento técnico e preparação do ambiente.",
      },
      {
        mes: "Mês 2",
        atividade: "Implementação inicial dos módulos.",
      },
    ],
  },
]

/* ================= HELPERS ================= */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function getStatusLabel(status: PlanoStatus) {
  const map: Record<PlanoStatus, string> = {
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    COM_BOLSA: "Com bolsa",
    VOLUNTARIO: "Voluntário",
  }

  return map[status]
}

function getStatusClasses(status: PlanoStatus) {
  const map: Record<PlanoStatus, string> = {
    APROVADO: "border-green-200 bg-green-50 text-green-700",
    REPROVADO: "border-red-200 bg-red-50 text-red-700",
    COM_BOLSA: "border-primary/20 bg-primary/5 text-primary",
    VOLUNTARIO: "border-amber-200 bg-amber-50 text-amber-700",
  }

  return map[status]
}

function getPagamentoLabel(situacao: SituacaoPagamento) {
  const map: Record<SituacaoPagamento, string> = {
    NAO_SE_APLICA: "Não se aplica",
    AGUARDANDO_IMPLANTACAO: "Aguardando implantação",
    ATIVO: "Ativo",
    SUSPENSO: "Suspenso",
    FINALIZADO: "Finalizado",
    PENDENTE_DOCUMENTACAO: "Pendente de documentação",
  }

  return map[situacao]
}

function getPagamentoClasses(situacao: SituacaoPagamento) {
  const map: Record<SituacaoPagamento, string> = {
    NAO_SE_APLICA: "border-neutral/20 bg-neutral/5 text-neutral",
    AGUARDANDO_IMPLANTACAO: "border-amber-200 bg-amber-50 text-amber-700",
    ATIVO: "border-green-200 bg-green-50 text-green-700",
    SUSPENSO: "border-red-200 bg-red-50 text-red-700",
    FINALIZADO: "border-blue-200 bg-blue-50 text-blue-700",
    PENDENTE_DOCUMENTACAO: "border-red-200 bg-red-50 text-red-700",
  }

  return map[situacao]
}

function getRelatorioLabel(situacao: SituacaoRelatorio) {
  const map: Record<SituacaoRelatorio, string> = {
    PENDENTE: "Pendente",
    ENVIADO: "Enviado",
    APROVADO: "Aprovado",
    NAO_OBRIGATORIO: "Não obrigatório",
  }

  return map[situacao]
}

function getRelatorioClasses(situacao: SituacaoRelatorio) {
  const map: Record<SituacaoRelatorio, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-700",
    ENVIADO: "border-blue-200 bg-blue-50 text-blue-700",
    APROVADO: "border-green-200 bg-green-50 text-green-700",
    NAO_OBRIGATORIO: "border-neutral/20 bg-neutral/5 text-neutral",
  }

  return map[situacao]
}

function getHistoricoTipoLabel(tipo: TipoHistoricoDiscente) {
  const map: Record<TipoHistoricoDiscente, string> = {
    INDICACAO_INICIAL: "Indicação inicial",
    SUBSTITUICAO: "Substituição",
    CANCELAMENTO_INDICACAO: "Cancelamento de indicação",
    REMANEJAMENTO: "Remanejamento",
  }

  return map[tipo]
}

function isBolsaStatus(status: PlanoStatus) {
  return status === "COM_BOLSA"
}

function isVoluntarioStatus(status: PlanoStatus) {
  return status === "VOLUNTARIO"
}

/* ================= COMPONENTES ================= */

function PageCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-neutral/20 px-6 py-4">
        {icon ? (
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-2 text-primary">
            {icon}
          </div>
        ) : null}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle ? (
            <p className="mt-1 text-xs leading-5 text-neutral">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  )
}

function InfoItem({
  label,
  value,
  preWrap,
}: {
  label: string
  value?: string
  preWrap?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p
        className={cx(
          "mt-1 text-sm leading-6 text-primary",
          preWrap && "whitespace-pre-wrap"
        )}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        className
      )}
    >
      {children}
    </span>
  )
}

function StatusIcon({ status }: { status: PlanoStatus }) {
  if (status === "REPROVADO") return <XCircle size={15} />
  if (status === "VOLUNTARIO") return <UserRound size={15} />
  if (status === "COM_BOLSA") return <Banknote size={15} />

  return <CheckCircle2 size={15} />
}

/* ================= PÁGINA ================= */

export default function CoordinatorWorkPlanDetails() {
  const { id } = useParams()

  const plano = useMemo(() => {
    return planosMock.find((item) => item.id === id) || planosMock[0]
  }, [id])

  const [remanejamentoTipo, setRemanejamentoTipo] = useState<
    "VOLUNTARIO_PARA_BOLSISTA" | "BOLSISTA_PARA_VOLUNTARIO" | ""
  >("")
  const [remanejamentoJustificativa, setRemanejamentoJustificativa] =
    useState("")
  const [remanejamentoEnviado, setRemanejamentoEnviado] = useState(false)

  const [cancelamentoJustificativa, setCancelamentoJustificativa] = useState("")
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false)
  const [cancelamentoSolicitado, setCancelamentoSolicitado] = useState(false)

  const relatoriosObrigatoriosPendentes = useMemo(() => {
    return plano.relatorios.filter(
      (relatorio) =>
        relatorio.obrigatorioParaCancelamento &&
        relatorio.situacao !== "APROVADO"
    )
  }, [plano.relatorios])

  const podeSolicitarCancelamento =
    relatoriosObrigatoriosPendentes.length === 0 &&
    cancelamentoJustificativa.trim().length >= 20 &&
    confirmarCancelamento

  const podeSolicitarRemanejamento =
    remanejamentoTipo && remanejamentoJustificativa.trim().length >= 20

  const remanejamentoDisponivel =
    plano.status === "COM_BOLSA" || plano.status === "VOLUNTARIO"

  const sugestaoRemanejamento = isVoluntarioStatus(plano.status)
    ? "VOLUNTARIO_PARA_BOLSISTA"
    : isBolsaStatus(plano.status)
      ? "BOLSISTA_PARA_VOLUNTARIO"
      : ""

  function solicitarRemanejamento() {
    if (!podeSolicitarRemanejamento) return
    setRemanejamentoEnviado(true)
  }

  function solicitarCancelamento() {
    if (!podeSolicitarCancelamento) return
    setCancelamentoSolicitado(true)
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        <section className="rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusClasses(plano.status)}>
                  <StatusIcon status={plano.status} />
                  {getStatusLabel(plano.status)}
                </Badge>

                <Badge className="border-neutral/20 bg-neutral/5 text-neutral">
                  <FileText size={14} />
                  {plano.modalidade}
                </Badge>

                <Badge
                  className={getPagamentoClasses(plano.pagamentoBolsa.situacao)}
                >
                  <Banknote size={14} />
                  Pagamento: {getPagamentoLabel(plano.pagamentoBolsa.situacao)}
                </Badge>
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary">
                {plano.titulo}
              </h1>

              <p className="mt-1 text-sm text-neutral">{plano.title}</p>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-neutral">
                Detalhamento do plano de trabalho, vínculo discente, situação de
                bolsa, histórico de indicações/substituições e ações
                administrativas de remanejamento ou cancelamento.
              </p>
            </div>

            <div className="grid w-full gap-3 rounded-2xl border border-neutral/20 bg-neutral/5 p-4 sm:grid-cols-2 lg:w-[360px]">
              <InfoItem label="Código do plano" value={plano.codigo} />
              <InfoItem label="Edital" value={plano.projeto.edital} />
              <InfoItem label="Projeto" value={plano.projeto.codigo} />
              <InfoItem label="Período" value={plano.projeto.periodo} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <PageCard
              title="Dados do plano"
              subtitle="Informações principais do plano vinculado ao projeto."
              icon={<FileText size={18} />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <InfoItem label="Projeto vinculado" value={plano.projeto.titulo} />
                </div>

                <InfoItem label="Código do projeto" value={plano.projeto.codigo} />
                <InfoItem label="Coordenador" value={plano.projeto.coordenador} />
                <InfoItem label="Modalidade" value={plano.modalidade} />
                <InfoItem label="Status do plano" value={getStatusLabel(plano.status)} />

                <div className="md:col-span-2">
                  <InfoItem
                    label="Introdução / justificativa"
                    value={plano.introducaoJustificativa}
                    preWrap
                  />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Objetivos" value={plano.objetivos} preWrap />
                </div>

                <div className="md:col-span-2">
                  <InfoItem
                    label="Metodologia"
                    value={plano.metodologia}
                    preWrap
                  />
                </div>

                <div className="md:col-span-2">
                  <InfoItem
                    label="Referências"
                    value={plano.referencias}
                    preWrap
                  />
                </div>
              </div>
            </PageCard>

            <PageCard
              title="Cronograma"
              subtitle="Atividades previstas para execução do plano de trabalho."
              icon={<CalendarDays size={18} />}
            >
              <div className="space-y-3">
                {plano.cronograma.map((item, index) => (
                  <div
                    key={`${item.mes}-${index}`}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-neutral/20 bg-white p-4 md:grid-cols-[120px_1fr]"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase text-neutral">
                        Período
                      </p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {item.mes}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-neutral">
                        Atividade
                      </p>
                      <p className="mt-1 text-sm leading-6 text-primary">
                        {item.atividade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PageCard>

            <PageCard
              title="Histórico de indicações e substituições"
              subtitle="Registro do discente atual e das movimentações realizadas no plano."
              icon={<History size={18} />}
            >
              <div className="relative space-y-4">
                {plano.historicoDiscentes.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative rounded-2xl border border-neutral/20 bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="border-primary/20 bg-primary/5 text-primary">
                            {getHistoricoTipoLabel(item.tipo)}
                          </Badge>

                          <span className="text-xs font-semibold text-neutral">
                            {item.data}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-bold text-primary">
                          {item.discente}
                        </p>

                        <p className="mt-1 text-xs text-neutral">
                          Matrícula {item.matricula}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-neutral">
                          {item.descricao}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-3 py-2">
                        <p className="text-[11px] font-bold uppercase text-neutral">
                          Responsável
                        </p>
                        <p className="mt-1 text-xs font-semibold text-primary">
                          {item.responsavel}
                        </p>
                      </div>
                    </div>

                    {index === 0 ? (
                      <span className="mt-3 inline-flex text-[11px] font-semibold text-neutral">
                        Primeiro vínculo registrado
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </PageCard>

            <PageCard
              title="Relatórios vinculados"
              subtitle="A lógica de cancelamento considera a obrigatoriedade dos relatórios parcial e/ou final."
              icon={<FileCheck2 size={18} />}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {plano.relatorios.map((relatorio) => (
                  <div
                    key={relatorio.tipo}
                    className="rounded-2xl border border-neutral/20 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral">
                          Relatório
                        </p>

                        <p className="mt-1 text-sm font-bold text-primary">
                          {relatorio.tipo === "PARCIAL"
                            ? "Relatório parcial"
                            : "Relatório final"}
                        </p>
                      </div>

                      <Badge className={getRelatorioClasses(relatorio.situacao)}>
                        {getRelatorioLabel(relatorio.situacao)}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      <InfoItem
                        label="Obrigatório para cancelamento"
                        value={
                          relatorio.obrigatorioParaCancelamento ? "Sim" : "Não"
                        }
                      />

                      {relatorio.dataEnvio ? (
                        <InfoItem label="Data de envio" value={relatorio.dataEnvio} />
                      ) : null}

                      {relatorio.dataAprovacao ? (
                        <InfoItem
                          label="Data de aprovação"
                          value={relatorio.dataAprovacao}
                        />
                      ) : null}

                      {relatorio.observacao ? (
                        <InfoItem
                          label="Observação"
                          value={relatorio.observacao}
                          preWrap
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </PageCard>
          </div>

          <aside className="space-y-6">
            <PageCard
              title="Discente atual"
              subtitle="Discente atualmente vinculado ao plano."
              icon={<GraduationCap size={18} />}
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
                  <p className="text-sm font-bold text-primary">
                    {plano.discenteAtual.nome}
                  </p>

                  <p className="mt-1 text-xs text-neutral">
                    {plano.discenteAtual.email}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="border-neutral/20 bg-white text-neutral">
                      {plano.discenteAtual.matricula}
                    </Badge>

                    <Badge
                      className={
                        plano.discenteAtual.tipoVinculo === "BOLSISTA"
                          ? "border-primary/20 bg-primary/5 text-primary"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }
                    >
                      {plano.discenteAtual.tipoVinculo === "BOLSISTA"
                        ? "Bolsista"
                        : "Voluntário"}
                    </Badge>
                  </div>
                </div>

                <InfoItem label="Curso" value={plano.discenteAtual.curso} />
                <InfoItem
                  label="Início do vínculo"
                  value={plano.discenteAtual.dataInicio}
                />
                <InfoItem
                  label="Fim do vínculo"
                  value={plano.discenteAtual.dataFim || "Vínculo ativo"}
                />
              </div>
            </PageCard>

            <PageCard
              title="Pagamento da bolsa"
              subtitle="Situação financeira vinculada ao plano."
              icon={<Banknote size={18} />}
            >
              <div className="space-y-4">
                <Badge className={getPagamentoClasses(plano.pagamentoBolsa.situacao)}>
                  {getPagamentoLabel(plano.pagamentoBolsa.situacao)}
                </Badge>

                <div className="grid grid-cols-1 gap-4">
                  <InfoItem label="Banco" value={plano.pagamentoBolsa.banco} />
                  <InfoItem label="Agência" value={plano.pagamentoBolsa.agencia} />
                  <InfoItem label="Conta" value={plano.pagamentoBolsa.conta} />
                  <InfoItem
                    label="Início da vigência"
                    value={plano.pagamentoBolsa.inicioVigencia}
                  />
                  <InfoItem
                    label="Fim da vigência"
                    value={plano.pagamentoBolsa.fimVigencia}
                  />
                  <InfoItem
                    label="Último pagamento"
                    value={plano.pagamentoBolsa.ultimoPagamento}
                  />
                  <InfoItem
                    label="Próximo pagamento"
                    value={plano.pagamentoBolsa.proximoPagamento}
                  />
                  <InfoItem
                    label="Observação"
                    value={plano.pagamentoBolsa.observacao}
                    preWrap
                  />
                </div>
              </div>
            </PageCard>

            <PageCard
              title="Solicitar remanejamento"
              subtitle="Permite solicitar mudança voluntário ↔ bolsista, conforme item 10.11."
              icon={<Repeat2 size={18} />}
            >
              {!remanejamentoDisponivel ? (
                <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                  <p className="text-sm font-semibold text-primary">
                    Remanejamento indisponível.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral">
                    Apenas planos com status voluntário ou com bolsa permitem
                    solicitar remanejamento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-neutral">
                      Tipo de remanejamento
                    </label>

                    <select
                      value={remanejamentoTipo || sugestaoRemanejamento}
                      onChange={(event) =>
                        setRemanejamentoTipo(
                          event.target.value as
                            | "VOLUNTARIO_PARA_BOLSISTA"
                            | "BOLSISTA_PARA_VOLUNTARIO"
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      {isVoluntarioStatus(plano.status) ? (
                        <option value="VOLUNTARIO_PARA_BOLSISTA">
                          Voluntário → Bolsista
                        </option>
                      ) : null}

                      {isBolsaStatus(plano.status) ? (
                        <option value="BOLSISTA_PARA_VOLUNTARIO">
                          Bolsista → Voluntário
                        </option>
                      ) : null}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-neutral">
                      Justificativa
                    </label>

                    <textarea
                      value={remanejamentoJustificativa}
                      onChange={(event) =>
                        setRemanejamentoJustificativa(event.target.value)
                      }
                      className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Explique o motivo da solicitação de remanejamento."
                    />

                    <p className="mt-1 text-[11px] text-neutral">
                      Mínimo recomendado: 20 caracteres.
                    </p>
                  </div>

                  {remanejamentoEnviado ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="text-sm font-bold text-green-800">
                        Solicitação enviada.
                      </p>

                      <p className="mt-1 text-xs text-green-800/80">
                        O pedido de remanejamento foi registrado para análise.
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={solicitarRemanejamento}
                    disabled={!podeSolicitarRemanejamento}
                    className={cx(
                      "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                      podeSolicitarRemanejamento
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "cursor-not-allowed bg-neutral/10 text-neutral"
                    )}
                  >
                    <Send size={16} />
                    Solicitar remanejamento
                  </button>
                </div>
              )}
            </PageCard>

            <PageCard
              title="Cancelar plano"
              subtitle="Cancelamento condicionado aos relatórios obrigatórios, conforme itens 10.7.1 e 10.7.2."
              icon={<Trash2 size={18} />}
            >
              <div className="space-y-4">
                {relatoriosObrigatoriosPendentes.length > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-2">
                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-700"
                      />

                      <div>
                        <p className="text-sm font-bold text-amber-800">
                          Cancelamento bloqueado.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-800/80">
                          Existem relatórios obrigatórios pendentes para permitir
                          o cancelamento do plano.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {relatoriosObrigatoriosPendentes.map((relatorio) => (
                        <div
                          key={relatorio.tipo}
                          className="rounded-lg border border-amber-200 bg-white/60 px-3 py-2 text-xs font-semibold text-amber-800"
                        >
                          {relatorio.tipo === "PARCIAL"
                            ? "Relatório parcial"
                            : "Relatório final"}{" "}
                          — {getRelatorioLabel(relatorio.situacao)}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex gap-2">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-sm font-bold text-green-800">
                          Cancelamento liberado.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-800/80">
                          Os relatórios obrigatórios para esta etapa estão
                          regularizados.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold uppercase text-neutral">
                    Justificativa do cancelamento
                  </label>

                  <textarea
                    value={cancelamentoJustificativa}
                    onChange={(event) =>
                      setCancelamentoJustificativa(event.target.value)
                    }
                    className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Descreva a justificativa para solicitar o cancelamento do plano."
                  />

                  <p className="mt-1 text-[11px] text-neutral">
                    Mínimo recomendado: 20 caracteres.
                  </p>
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-neutral/20 bg-neutral/5 p-3">
                  <input
                    type="checkbox"
                    checked={confirmarCancelamento}
                    onChange={(event) =>
                      setConfirmarCancelamento(event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-neutral/30 text-primary focus:ring-primary"
                  />

                  <span className="text-xs leading-5 text-neutral">
                    Confirmo que verifiquei a situação dos relatórios
                    obrigatórios antes de solicitar o cancelamento deste plano.
                  </span>
                </label>

                {cancelamentoSolicitado ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-bold text-green-800">
                      Solicitação de cancelamento registrada.
                    </p>

                    <p className="mt-1 text-xs text-green-800/80">
                      O pedido foi enviado para análise administrativa.
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={solicitarCancelamento}
                  disabled={!podeSolicitarCancelamento}
                  className={cx(
                    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                    podeSolicitarCancelamento
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "cursor-not-allowed bg-neutral/10 text-neutral"
                  )}
                >
                  <Trash2 size={16} />
                  Solicitar cancelamento
                </button>

                <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-3">
                  <div className="flex gap-2">
                    <Info size={16} className="mt-0.5 shrink-0 text-neutral" />

                    <p className="text-xs leading-5 text-neutral">
                      A regra implementada considera que relatórios marcados como
                      obrigatórios precisam estar aprovados antes do envio da
                      solicitação de cancelamento.
                    </p>
                  </div>
                </div>
              </div>
            </PageCard>
          </aside>
        </div>

        <section className="rounded-2xl border border-neutral/30 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-2 text-primary">
                <Clock size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-primary">
                  Registro administrativo
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral">
                  As ações de remanejamento e cancelamento nesta página simulam
                  o envio para análise. Na integração com backend, elas devem
                  gerar registros no histórico do plano.
                </p>
              </div>
            </div>

            <Link
              to={`/coordenador/projetos/${plano.projeto.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
            >
              Ver projeto vinculado
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}