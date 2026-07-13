import React, { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FileText,
  FolderKanban,
  CalendarDays,
  BadgeCheck,
  Clock3,
  UserRound,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
} from "lucide-react"

type ReportType = "PARCIAL" | "FINAL"

type ReportStatus =
  | "PENDENTE"
  | "EM_PREENCHIMENTO"
  | "ENVIADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"
  | "ATRASADO"

type ReportBody = {
  atividadesRealizadas?: string
  comparacaoPlanoExecutado?: string
  outrasAtividades?: string
  resultadosPreliminares?: string
  resultadosFinais?: string
  produtosGerados?: string
  contribuicoesFormacao?: string
  dificuldades?: string
  conclusoes?: string
}

type ReportDetails = {
  id: string
  titulo: string
  tipo: ReportType
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  periodo: string
  prazo: string
  status: ReportStatus
  atualizadoEm?: string
  dataEnvio?: string
  discente: string
  cota: string
  possuiParecer: boolean
  parecerEmitidoEm?: string
  parecerTexto?: string
  resumo: string
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
  corpo: ReportBody
}

const REPORTS: ReportDetails[] = [
  {
    id: "3",
    titulo: "Relatório Parcial PIBIC 2026",
    tipo: "PARCIAL",
    projetoId: "proj_001",
    projetoTitulo:
      "PVL20220-2025 - Plataforma Inteligente para Visualização de Dados Aplicada à Gestão do PIBIC na UFPB",
    edital: "PIBIC 2026",
    orientador: "TIAGO MARITAN UGULINO DE ARAUJO",
    periodo: "2026.1",
    prazo: "30/06/2026",
    status: "ENVIADO",
    atualizadoEm: "01/04/2026",
    dataEnvio: "30/03/2026 20:53",
    discente: "20220071188 - MARIANA DA SILVA MARTINS",
    cota: "2025-2026 PIBIC-CNPQ-UFPB",
    possuiParecer: true,
    parecerEmitidoEm: "01/04/2026",
    parecerTexto: "Aluno dedicado.",
    resumo:
      "Acompanhe o relatório submetido, visualize o conteúdo enviado e consulte o parecer emitido para este registro.",
    observacoes: [
      "Caso exista parecer, ele será exibido ao final do conteúdo.",
      "Relatórios rejeitados ou em preenchimento podem ser editados.",
    ],
    possuiPendencia: false,
    corpo: {
      atividadesRealizadas:
        "Durante o período avaliado, foram realizadas atividades voltadas ao levantamento de requisitos, à definição da estrutura funcional da plataforma e ao desenvolvimento inicial da interface web do sistema proposto para a PROPESQ. O trabalho iniciou-se com uma série de reuniões de alinhamento com a equipe e com vinculadas à PROPESQ. Também foram realizados encontros de acompanhamento das atividades do projeto, nos quais foram discutidos o escopo do sistema, os perfis de usuários contemplados, as funcionalidades prioritárias e a organização dos módulos da plataforma. No âmbito técnico, foram desenvolvidas atividades de pesquisa, análise e prototipação da interface, incluindo a definição de componentes visuais, organização das telas, estruturação da navegação entre páginas e estudo de soluções adequadas para visualização de informações e indicadores. Além disso, foi iniciada a implementação frontend da plataforma, com foco na construção de páginas e componentes compatíveis com os requisitos levantados ao longo das discussões realizadas. Por fim, o progresso das atividades foi validado em reuniões de apresentação e feedback.",
      comparacaoPlanoExecutado:
        "O projeto manteve-se alinhado ao plano de trabalho original, especialmente no que tange à concepção da interface e aos requisitos de acessibilidade e usabilidade. No entanto, para garantir a consistência da plataforma, houve uma adequação metodológica: concentrou-se o esforço inicial na estruturação funcional e na prototipação detalhada, em detrimento da implementação imediata de funcionalidades técnicas. Dessa forma, as atividades executadas focaram na definição da arquitetura de telas e fluxos de navegação. Embora a integração plena com APIs e a entrega de painéis interativos finais estejam previstas para a próxima etapa, o trabalho desenvolvido até aqui assegura que a entrega final esteja em total convergência com as necessidades da PROPESQ.",
      outrasAtividades:
        "Além das metas estipuladas no plano de trabalho, o período contemplou atividades complementares para a formação técnica. Foram realizados estudos sobre desenvolvimento de interfaces web, organização de sistemas modulares, boas práticas de usabilidade, acessibilidade digital e estruturação de aplicações orientadas a dados. Essas atividades, embora não correspondam diretamente a entregas formais do plano de trabalho, contribuíram para qualificar a execução das tarefas previstas e para aprimorar a compreensão sobre o papel da interface na mediação entre usuários e dados institucionais.",
      resultadosPreliminares:
        "Como resultado preliminar, destaca-se a consolidação de uma base inicial de requisitos funcionais e informativos para a plataforma vinculada à PROPESQ, construída a partir de discussões, reuniões de alinhamento e análise das demandas institucionais observadas ao longo do período. Outro resultado importante foi a elaboração e evolução de protótipos e componentes de interface, com definição inicial da organização visual da plataforma, dos módulos principais e dos fluxos de navegação. Esse material serviu como suporte para validar escolhas de estrutura e para orientar a implementação técnica da camada frontend. Além disso, foi iniciada a construção prática da interface web, resultando no desenvolvimento preliminar de páginas, componentes e estruturas de navegação coerentes com os requisitos levantados. De modo geral, os resultados alcançados até o momento indicam que o projeto avançou de forma consistente na etapa de estruturação conceitual e técnica da interface, criando bases sólidas para a continuidade do desenvolvimento e para a evolução futura dos painéis e recursos de visualização de dados.",
    },
  },
  {
    id: "2",
    titulo: "Relatório Final PIBIC 2026",
    tipo: "FINAL",
    projetoId: "proj_001",
    projetoTitulo:
      "PVL20220-2025 - Plataforma Inteligente para Visualização de Dados Aplicada à Gestão do PIBIC na UFPB",
    edital: "PIBIC 2026",
    orientador: "TIAGO MARITAN",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "EM_ANALISE",
    atualizadoEm: "15/12/2026",
    dataEnvio: "15/12/2026 18:14",
    discente: "20220071188 - MARIANA DA SILVA MARTINS",
    cota: "2025-2026 PIBIC-CNPQ-UFPB",
    possuiParecer: false,
    resumo:
      "Visualize o conteúdo consolidado do relatório final submetido e acompanhe a situação da análise.",
    observacoes: [
      "Relatórios finais apresentam resultados consolidados do projeto.",
      "O parecer só aparece após emissão pelo avaliador ou orientador.",
      "Enquanto estiver em análise, o envio permanece somente para consulta.",
    ],
    possuiPendencia: false,
    corpo: {
      resultadosFinais:
        "Ao final da execução, foi consolidada a estrutura principal da interface do sistema, com organização modular das telas, definição de navegação entre páginas e implementação de componentes reutilizáveis para exibição de dados acadêmicos. Também foram amadurecidos os fluxos de uso do discente e da administração, permitindo melhor acompanhamento dos projetos, relatórios e vínculos institucionais.",
      produtosGerados:
        "Foram produzidos protótipos navegáveis, componentes de interface, páginas funcionais do sistema e documentação de apoio às decisões de design e implementação.",
      contribuicoesFormacao:
        "A participação no projeto contribuiu significativamente para a formação em desenvolvimento frontend, organização de sistemas acadêmicos, integração entre requisitos e interface e aplicação prática de conceitos de acessibilidade e usabilidade.",
      dificuldades:
        "As principais dificuldades envolveram a consolidação de requisitos em constante refinamento, a necessidade de equilibrar padronização visual com regras específicas do domínio e o encadeamento entre fluxos distintos de usuário.",
      conclusoes:
        "O projeto permitiu desenvolver uma base consistente para evolução da plataforma, integrando visão de produto, modelagem de fluxos e implementação de interfaces com foco em clareza, acompanhamento e aderência ao contexto institucional da PROPESQ.",
    },
  },
  {
    id: "1",
    titulo: "Relatório Final PIBIC 2025",
    tipo: "FINAL",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "PROF. LUCIANO",
    periodo: "2025.1",
    prazo: "05/12/2025",
    status: "REJEITADO",
    atualizadoEm: "07/12/2025",
    dataEnvio: "05/12/2025 17:40",
    discente: "20220071188 - MARIANA DA SILVA MARTINS",
    cota: "2024-2025 PIBIC-UFPB",
    possuiParecer: true,
    parecerEmitidoEm: "07/12/2025",
    parecerTexto:
      "Apresentar com maior clareza os resultados finais obtidos, os produtos gerados e as conclusões decorrentes da execução do projeto.",
    resumo:
      "Relatório final devolvido para ajustes após análise. O discente pode consultar o conteúdo enviado e o parecer correspondente.",
    observacoes: [
      "O parecer está disponível ao final da página.",
      "Esse relatório pode ser corrigido e reenviado.",
      "Revise principalmente resultados finais, produtos e conclusões.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "O relatório precisa ser ajustado conforme observações do avaliador e reenviado dentro do prazo complementar.",
    corpo: {
      resultadosFinais:
        "Foram consolidados os principais componentes analíticos do painel, com definição de indicadores, visualizações e estrutura de acompanhamento para apoio à gestão.",
      produtosGerados:
        "Protótipos, telas funcionais, modelos visuais de dashboards e documentação descritiva de métricas.",
      contribuicoesFormacao:
        "A experiência ampliou a compreensão sobre design de dashboards, organização de indicadores e aplicação prática de frontend em contexto institucional.",
      dificuldades:
        "Houve dificuldade em consolidar requisitos e em alinhar alguns critérios de exibição de métricas ao uso real esperado.",
      conclusoes:
        "O projeto avançou na construção de uma base consistente para acompanhamento dos indicadores, mas ainda exige refinamentos para melhor consolidação da entrega final.",
    },
  },
]

function getTypeLabel(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "Parcial"
    case "FINAL":
      return "Final"
    default:
      return type
  }
}

function getTypeClasses(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "border-primary/30 bg-primary/10 text-primary"
    case "FINAL":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "EM_PREENCHIMENTO":
      return "Em preenchimento"
    case "ENVIADO":
      return "Enviado"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    case "ATRASADO":
      return "Atrasado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_PREENCHIMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "ENVIADO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "ATRASADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getEditPath(report: ReportDetails) {
  if (report.tipo === "PARCIAL") {
    return `/discente/relatorios/${report.id}/parcial`
  }

  return `/discente/relatorios/${report.id}/final`
}

function buildSections(report: ReportDetails) {
  if (report.tipo === "PARCIAL") {
    return [
      {
        title: "Atividades realizadas",
        content: report.corpo.atividadesRealizadas,
      },
      {
        title: "Comparação entre o plano original e o executado",
        content: report.corpo.comparacaoPlanoExecutado,
      },
      {
        title: "Outras atividades",
        content: report.corpo.outrasAtividades,
      },
      {
        title: "Resultados preliminares",
        content: report.corpo.resultadosPreliminares,
      },
    ].filter((item) => item.content)
  }

  return [
    {
      title: "Resultados finais",
      content: report.corpo.resultadosFinais,
    },
    {
      title: "Produtos gerados",
      content: report.corpo.produtosGerados,
    },
    {
      title: "Contribuições para a formação",
      content: report.corpo.contribuicoesFormacao,
    },
    {
      title: "Dificuldades encontradas",
      content: report.corpo.dificuldades,
    },
    {
      title: "Conclusões",
      content: report.corpo.conclusoes,
    },
  ].filter((item) => item.content)
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
    <div className="rounded-2xl border border-neutral/20 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-neutral">
            {label}
          </div>

          <div className="mt-1 text-sm font-semibold leading-6 text-primary">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportView() {
  const { id } = useParams()

  const report = REPORTS.find((item) => item.id === id) ?? REPORTS[0]

  const sections = useMemo(() => buildSections(report), [report])

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Consultar Relatório • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/discente/relatorios"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
          >
            <ArrowLeft size={16} />
            Voltar para relatórios
          </Link>
        </div>

        <section className="rounded-3xl border border-neutral/20 bg-white p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <FileText size={14} />
                Relatório vinculado
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                  report.tipo
                )}`}
              >
                {getTypeLabel(report.tipo)}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  report.status
                )}`}
              >
                <BadgeCheck size={14} />
                {getStatusLabel(report.status)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">
                {report.titulo}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral sm:text-base">
                Consulte o conteúdo enviado, acompanhe o status do relatório e
                visualize o parecer quando disponível.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                  Projeto
                </div>

                <div className="mt-1 text-sm font-semibold leading-6 text-primary">
                  {report.projetoTitulo}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                  Orientador
                </div>

                <div className="mt-1 text-sm font-semibold leading-6 text-primary">
                  {report.orientador}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                  Enviado em
                </div>

                <div className="mt-1 text-sm font-semibold leading-6 text-primary">
                  {report.dataEnvio || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                  Parecer
                </div>

                <div className="mt-1 text-sm font-semibold leading-6 text-primary">
                  {report.possuiParecer ? "Disponível" : "Aguardando emissão"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {report.possuiPendencia && report.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-warning"
              />

              <div className="text-sm leading-6 text-neutral">
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {report.pendenciaTexto}
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<FolderKanban size={18} />}
            label="Projeto"
            value={<span className="line-clamp-3">{report.projetoTitulo}</span>}
          />

          <InfoCard
            icon={<UserRound size={18} />}
            label="Orientador"
            value={report.orientador}
          />

          <InfoCard
            icon={<CalendarDays size={18} />}
            label="Data de envio"
            value={report.dataEnvio || "-"}
          />

          <InfoCard
            icon={<Clock3 size={18} />}
            label="Última atualização"
            value={report.atualizadoEm || "-"}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações gerais
                </h2>
              }
              className="rounded-3xl border border-neutral/20 bg-white p-6"
            >
              <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="text-neutral">Título do relatório</div>

                  <div className="mt-1 font-semibold text-primary">
                    {report.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo</div>

                  <div className="mt-1 font-medium text-primary">
                    {getTypeLabel(report.tipo)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status</div>

                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                        report.status
                      )}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital</div>

                  <div className="mt-1 font-medium text-primary">
                    {report.edital}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>

                  <div className="mt-1 font-medium text-primary">
                    {report.periodo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Resumo</div>

                  <p className="mt-1 leading-6 text-primary">
                    {report.resumo}
                  </p>
                </div>

                <div>
                  <div className="text-neutral">Discente</div>

                  <div className="mt-1 font-medium text-primary">
                    {report.discente}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Cota</div>

                  <div className="mt-1 font-medium text-primary">
                    {report.cota}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Conteúdo enviado
                </h2>
              }
              className="rounded-3xl border border-neutral/20 bg-white p-6"
            >
              <div className="space-y-6">
                {sections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-2xl border border-neutral/20 bg-neutral-light p-5"
                  >
                    <h3 className="text-sm font-semibold text-primary">
                      {section.title}
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral text-justify">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Parecer emitido
                </h2>
              }
              className="rounded-3xl border border-neutral/20 bg-white p-6"
            >
              {report.possuiParecer ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                      <MessageSquareText size={14} />
                      Parecer disponível
                    </span>

                    {report.parecerEmitidoEm && (
                      <span className="text-sm text-neutral">
                        Emitido em {report.parecerEmitidoEm}
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-sm leading-7 text-neutral">
                    {report.parecerTexto}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-4 text-sm leading-7 text-neutral">
                  Ainda não há parecer emitido para este relatório.
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resumo da situação
                </h2>
              }
              className="rounded-3xl border border-neutral/20 bg-white p-6"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    report.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(report.status)}
                </span>

                <p className="leading-6 text-neutral">
                  {report.status === "PENDENTE" &&
                    "O relatório ainda não foi iniciado e aguarda preenchimento pelo discente."}
                  {report.status === "EM_PREENCHIMENTO" &&
                    "O relatório está em elaboração e pode ser atualizado antes do envio."}
                  {report.status === "ENVIADO" &&
                    "O relatório foi enviado e pode ser consultado com o conteúdo submetido."}
                  {report.status === "EM_ANALISE" &&
                    "O relatório foi enviado e está em análise pela equipe ou orientador responsável."}
                  {report.status === "APROVADO" &&
                    "O relatório foi avaliado e aprovado com sucesso."}
                  {report.status === "REJEITADO" &&
                    "O relatório exige ajustes antes de nova submissão."}
                  {report.status === "ATRASADO" &&
                    "O prazo regular foi ultrapassado e o relatório segue pendente."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações e orientações
                </h2>
              }
              className="rounded-3xl border border-neutral/20 bg-white p-6"
            >
              <ul className="space-y-3">
                {report.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-neutral/20 bg-neutral-light p-4 text-sm text-neutral"
                  >
                    {report.status === "APROVADO" ? (
                      <CheckCircle2 size={16} className="mt-0.5 text-success" />
                    ) : (
                      <ClipboardList size={16} className="mt-0.5 text-primary" />
                    )}

                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {(report.status === "PENDENTE" ||
              report.status === "EM_PREENCHIMENTO" ||
              report.status === "REJEITADO" ||
              report.status === "ATRASADO") && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Continuidade
                  </h2>
                }
                className="rounded-3xl border border-neutral/20 bg-white p-6"
              >
                <Link
                  to={getEditPath(report)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition"
                >
                  <Pencil size={16} />
                  Preencher / editar relatório
                </Link>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}