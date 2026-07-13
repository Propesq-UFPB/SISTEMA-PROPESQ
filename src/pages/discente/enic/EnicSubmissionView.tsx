// não to usando

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  ArrowLeft,
  FolderKanban,
  CalendarDays,
  BadgeCheck,
  Clock3,
  UserRound,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Presentation,
  BookOpen,
  Eye,
} from "lucide-react"

type EnicStatus =
  | "RASCUNHO"
  | "PENDENTE"
  | "SUBMETIDO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"

type EnicSubmissionDetails = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  evento: string
  modalidade: string
  areaTematica: string
  prazo: string
  status: EnicStatus
  atualizadoEm?: string
  dataSubmissao?: string
  resumo: string
  metodologia: string
  resultados: string
  conclusoes: string
  palavrasChave: string[]
  coautores: string[]
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const SUBMISSIONS: EnicSubmissionDetails[] = [
  {
    id: "enic_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    evento: "ENIC 2026",
    modalidade: "Resumo expandido",
    areaTematica: "Sistemas de Informação",
    prazo: "15/08/2026",
    status: "RASCUNHO",
    atualizadoEm: "14/03/2026",
    resumo:
      "Este trabalho apresenta o desenvolvimento de uma plataforma digital para apoiar a gestão de pesquisa acadêmica, incluindo fluxos de inscrição, acompanhamento de projetos, relatórios e indicadores institucionais.",
    metodologia:
      "A metodologia adotada envolveu levantamento de requisitos, modelagem de fluxos, prototipação de interfaces e estruturação incremental das telas e módulos do sistema.",
    resultados:
      "Foram estruturadas páginas e fluxos para os módulos de perfil, editais, projetos, relatórios e submissões acadêmicas, com foco na experiência do discente e na organização institucional.",
    conclusoes:
      "Os resultados demonstram a viabilidade de uma solução digital integrada para apoiar a gestão acadêmica de pesquisa, com potencial para ampliar a rastreabilidade e a eficiência dos processos.",
    palavrasChave: [
      "plataforma digital",
      "pesquisa acadêmica",
      "gestão institucional",
    ],
    coautores: ["Prof. André Silva"],
    observacoes: [
      "A submissão ainda está em rascunho e pode ser editada livremente.",
      "Revise a estrutura do resumo antes da submissão final.",
    ],
    possuiPendencia: false,
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
    areaTematica: "Inteligência Artificial",
    prazo: "15/08/2026",
    status: "SUBMETIDO",
    atualizadoEm: "10/03/2026",
    dataSubmissao: "10/03/2026",
    resumo:
      "O trabalho investiga o uso de técnicas de inteligência artificial para classificação e organização de produção científica institucional.",
    metodologia:
      "Foram utilizadas etapas de coleta de dados, preparação de atributos, avaliação de metadados e análise de abordagens de classificação automatizada.",
    resultados:
      "Os resultados iniciais indicam potencial de apoio à organização de bases científicas e à melhoria de processos institucionais de catalogação.",
    conclusoes:
      "A abordagem proposta mostra-se promissora para apoiar a classificação de dados científicos em ambientes acadêmicos.",
    palavrasChave: ["IA", "classificação", "produção científica"],
    coautores: ["Profa. Helena Costa"],
    observacoes: [
      "A submissão foi registrada com sucesso no evento.",
      "O trabalho aguarda movimentação da comissão do ENIC.",
    ],
    possuiPendencia: false,
  },
  {
    id: "enic_003",
    titulo: "Dashboard Analítico para Indicadores de Iniciação Científica",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    evento: "ENIC 2025",
    modalidade: "Resumo expandido",
    areaTematica: "Ciência de Dados",
    prazo: "20/08/2025",
    status: "REJEITADO",
    atualizadoEm: "18/08/2025",
    dataSubmissao: "16/08/2025",
    resumo:
      "O estudo propõe uma interface analítica para acompanhamento de indicadores acadêmicos relacionados à iniciação científica.",
    metodologia:
      "Foi realizada análise de requisitos institucionais, prototipação de dashboards, organização de indicadores e modelagem da experiência de uso.",
    resultados:
      "A proposta resultou em telas estruturadas para leitura de métricas, filtros e painéis com foco em monitoramento acadêmico.",
    conclusoes:
      "A solução demonstrou potencial de apoio à gestão, mas necessita de maior consolidação dos resultados apresentados na submissão.",
    palavrasChave: ["dashboard", "indicadores", "iniciação científica"],
    coautores: ["Prof. Ricardo Lima"],
    observacoes: [
      "A comissão solicitou revisão do texto submetido.",
      "Ajuste especialmente os resultados e a conclusão.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "A submissão precisa ser revisada conforme as observações da comissão antes de novo envio.",
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
      return "border-primary/30 bg-primary/10 text-primary"
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

function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`w-full rounded-3xl border border-neutral/20 bg-white p-6 sm:p-7 ${className}`}
    >
      <div className="mb-5">
        <div className="text-sm font-semibold text-primary">{title}</div>
        {description ? (
          <div className="mt-1 text-sm text-neutral">{description}</div>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="h-full rounded-2xl border border-neutral/20 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral">
            {label}
          </div>
          <div className="mt-1 text-sm font-semibold leading-7 text-primary">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EnicSubmissionView() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    SUBMISSIONS[0].id
  )

  const submission = useMemo(
    () =>
      SUBMISSIONS.find((item) => item.id === selectedSubmissionId) ??
      SUBMISSIONS[0],
    [selectedSubmissionId]
  )

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Submissões ENIC • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/discente/enic/submissions"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para submissões
            </Link>
          </div>

          <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Presentation size={14} />
                  Submissões do ENIC
                </span>

                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    submission.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(submission.status)}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-primary sm:text-3xl">
                  {submission.titulo}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral sm:text-base">
                  Consulte os detalhes da submissão vinculada ao ENIC, acompanhe
                  o status atual e visualize o conteúdo acadêmico informado.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Projeto
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-7 text-primary">
                    {submission.projetoTitulo}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Orientador
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-7 text-primary">
                    {submission.orientador}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Submetido em
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-7 text-primary">
                    {submission.dataSubmissao || "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Evento
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-7 text-primary">
                    {submission.evento}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {submission.possuiPendencia && submission.pendenciaTexto && (
            <div className="w-full rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <div className="text-sm leading-6 text-neutral">
                  <span className="font-semibold text-warning">
                    Pendência identificada:
                  </span>{" "}
                  {submission.pendenciaTexto}
                </div>
              </div>
            </div>
          )}

          <SectionCard
            title="Seleção de submissão"
            description="Escolha qual submissão deseja consultar."
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Submissão
              </label>
              <select
                value={selectedSubmissionId}
                onChange={(e) => setSelectedSubmissionId(e.target.value)}
                className="w-full rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
              >
                {SUBMISSIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.titulo} • {item.evento} •{" "}
                    {getStatusLabel(item.status)}
                  </option>
                ))}
              </select>
            </div>
          </SectionCard>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              icon={<FolderKanban size={18} />}
              label="Projeto"
              value={
                <span className="block leading-7">{submission.projetoTitulo}</span>
              }
            />
            <InfoCard
              icon={<UserRound size={18} />}
              label="Orientador"
              value={submission.orientador}
            />
            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Data da submissão"
              value={submission.dataSubmissao || "-"}
            />
            <InfoCard
              icon={<Clock3 size={18} />}
              label="Última atualização"
              value={submission.atualizadoEm || "-"}
            />
          </section>

          <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              <SectionCard title="Informações gerais">
                <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-2">
                  <div className="md:col-span-2">
                    <div className="text-neutral">Título da submissão</div>
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
                    <div className="text-neutral">Status</div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          submission.status
                        )}`}
                      >
                        {getStatusLabel(submission.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral">Edital</div>
                    <div className="mt-1 font-medium text-primary">
                      {submission.edital}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral">Modalidade</div>
                    <div className="mt-1 font-medium text-primary">
                      {submission.modalidade}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-neutral">Área temática</div>
                    <div className="mt-1 font-medium text-primary">
                      {submission.areaTematica}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral">Prazo</div>
                    <div className="mt-1 font-medium text-primary">
                      {submission.prazo}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral">Submetido em</div>
                    <div className="mt-1 font-medium text-primary">
                      {submission.dataSubmissao || "-"}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Conteúdo submetido">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                    <h3 className="text-sm font-semibold text-primary">Resumo</h3>
                    <p className="mt-3 text-sm leading-7 text-neutral text-justify">
                      {submission.resumo}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                    <h3 className="text-sm font-semibold text-primary">
                      Metodologia
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral text-justify">
                      {submission.metodologia}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                    <h3 className="text-sm font-semibold text-primary">
                      Resultados
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral text-justify">
                      {submission.resultados}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                    <h3 className="text-sm font-semibold text-primary">
                      Conclusões
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral text-justify">
                      {submission.conclusoes}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Palavras-chave">
                <div className="flex flex-wrap gap-2">
                  {submission.palavrasChave.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Coautoria">
                <ul className="space-y-3 text-sm text-neutral">
                  {submission.coautores.length === 0 ? (
                    <li>Nenhum coautor informado.</li>
                  ) : (
                    submission.coautores.map((author) => (
                      <li
                        key={author}
                        className="flex items-start gap-3 rounded-2xl border border-neutral/20 bg-neutral-light p-4"
                      >
                        <BookOpen size={16} className="mt-0.5 text-primary" />
                        <span>{author}</span>
                      </li>
                    ))
                  )}
                </ul>
              </SectionCard>
            </div>

            <aside className="min-w-0 space-y-6">
              <SectionCard title="Resumo da situação">
                <div className="space-y-4 text-sm">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                      submission.status
                    )}`}
                  >
                    <BadgeCheck size={14} />
                    {getStatusLabel(submission.status)}
                  </span>

                  <p className="leading-6 text-neutral">
                    {submission.status === "RASCUNHO" &&
                      "A submissão está em elaboração e ainda não foi enviada para avaliação."}
                    {submission.status === "PENDENTE" &&
                      "A submissão está pendente de regularização antes da etapa seguinte."}
                    {submission.status === "SUBMETIDO" &&
                      "A submissão foi registrada com sucesso e está disponível para consulta."}
                    {submission.status === "EM_ANALISE" &&
                      "A submissão está em análise pela comissão ou equipe responsável."}
                    {submission.status === "APROVADO" &&
                      "A submissão foi avaliada e aprovada com sucesso."}
                    {submission.status === "REJEITADO" &&
                      "A submissão recebeu devolutiva e precisa de ajustes."}
                  </p>
                </div>
              </SectionCard>

              <SectionCard title="Observações e orientações">
                <ul className="space-y-3">
                  {submission.observacoes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-neutral/20 bg-neutral-light p-4 text-sm text-neutral"
                    >
                      {submission.status === "APROVADO" ? (
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 text-success"
                        />
                      ) : (
                        <ClipboardList
                          size={16}
                          className="mt-0.5 text-primary"
                        />
                      )}
                      <span className="leading-6">{item}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Navegação">
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/discente/projetos/${submission.projetoId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                  >
                    <Eye size={16} />
                    Ver projeto
                  </Link>

                  <Link
                    to="/discente/enic"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
                  >
                    <ArrowLeft size={16} />
                    Voltar à lista
                  </Link>
                </div>
              </SectionCard>
            </aside>
          </section>
        </div>
      </div>
    </div>
  )
}