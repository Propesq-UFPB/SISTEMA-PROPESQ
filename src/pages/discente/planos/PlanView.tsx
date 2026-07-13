import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FolderKanban,
  UserRound,
  BadgeCheck,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock3,
  BookOpen,
  Target,
  Building2,
  GraduationCap,
  Award,
  FlaskConical,
  Globe,
  Layers,
  Microscope,
  CalendarRange,
} from "lucide-react"

type PlanStatus = "EM_ANDAMENTO" | "EM_SELECAO" | "ENCERRADO" | "DISPONIVEL"
type PlanArea =
  | "CIENCIA_DADOS"
  | "INTELIGENCIA_ARTIFICIAL"
  | "SISTEMAS_INFORMACAO"
  | "ENGENHARIA_SOFTWARE"
  | "EXTENSAO"

type Atividade = {
  nome: string
  meses: number[]
}

type PlanDetails = {
  id: string
  titulo: string
  tituloEn: string
  projetoId: string
  projetoTitulo: string
  orientador: string
  edital: string
  cota: string
  area: PlanArea
  status: PlanStatus
  periodo: string
  vigencia: string
  centro: string
  departamento: string
  discente: string
  tipoBolsa: string
  direcionamento: string
  grandeArea: string
  areaConhecimento: string
  subarea: string
  especialidade: string
  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  referencias: string
  atividadesCronograma: Atividade[]
  palavrasChave: string[]
}

const MESES_LABELS = [
  { label: "Set", ano: "2025" },
  { label: "Out", ano: "2025" },
  { label: "Nov", ano: "2025" },
  { label: "Dez", ano: "2025" },
  { label: "Jan", ano: "2026" },
  { label: "Fev", ano: "2026" },
  { label: "Mar", ano: "2026" },
  { label: "Abr", ano: "2026" },
  { label: "Mai", ano: "2026" },
  { label: "Jun", ano: "2026" },
  { label: "Jul", ano: "2026" },
  { label: "Ago", ano: "2026" },
]

const ANOS_LABELS = [
  { ano: "2025", cols: 4 },
  { ano: "2026", cols: 8 },
]

const PLANS: PlanDetails[] = [
  {
    id: "plan_001",
    titulo: "Desenvolvimento da Interface Web e Dashboards Interativos",
    tituloEn: "Web Interface and Interactive Dashboards Development",
    projetoId: "proj_001",
    projetoTitulo:
      "PVL20220-2025 - Plataforma Inteligente para Visualização de Dados Aplicada à Gestão do PIBIC na UFPB",
    orientador: "Tiago Maritan Ugulino de Araujo",
    edital:
      "2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq - SELEÇÃO DE PROJETOS DE INICIAÇÃO CIENTÍFICA",
    cota: "2025-2026 PIBIC-CNPQ-UFPB (01/09/2025 a 31/08/2026)",
    area: "SISTEMAS_INFORMACAO",
    status: "EM_ANDAMENTO",
    periodo: "2025.2",
    vigencia: "01/09/2025 a 31/08/2026",
    centro: "CENTRO DE INFORMÁTICA (CI)",
    departamento: "CI - DEPARTAMENTO DE INFORMÁTICA",
    discente: "20220071188 - MARIANA DA SILVA MARTINS",
    tipoBolsa: "PIBIC-UFPB (IC)",
    direcionamento: "Iniciação Científica",
    grandeArea: "Ciências Exatas e da Terra",
    areaConhecimento: "Ciência da Computação",
    subarea: "Metodologia e Técnicas da Computação",
    especialidade: "Sistemas de Informação",
    introducaoJustificativa:
      "Uma interface intuitiva e responsiva é fundamental para garantir o uso efetivo da plataforma por usuários da PROPESQ, pesquisadores e gestores institucionais. Diante da complexidade dos dados do PIBIC, a interface deve ser capaz de apresentar visualmente indicadores operacionais e estratégicos de forma interativa, permitindo exploração dinâmica por filtros, gráficos e mapas. Este plano de trabalho concentra-se no desenvolvimento da camada front-end da plataforma, com foco na experiência do usuário, acessibilidade e integração com o backend para consultas em tempo real.",
    objetivos:
      "Objetivo Geral: Construir a interface web da plataforma com painéis interativos que apresentem dados operacionais e temáticos do PIBIC.\n\nObjetivos Específicos:\n- Desenvolver a interface utilizando tecnologias web modernas (React, Next.js).\n- Criar dashboards com filtros por unidade, área, tipo de bolsa, orientador, entre outros.\n- Integrar a interface com APIs de backend para consulta em tempo real.\n- Garantir acessibilidade e usabilidade para diferentes perfis de usuários.",
    metodologia:
      "O bolsista será responsável pela construção da interface web utilizando tecnologias modernas tais como React.js. Serão criados protótipos navegáveis no Figma e testados por usuários da PROPESQ em ciclos iterativos. Serão utilizadas bibliotecas para construção de gráficos dinâmicos tais como Chart.js e Recharts. A interface será integrada com o backend por meio de APIs RESTful seguras. O design seguirá boas práticas de UX/UI e critérios de acessibilidade segundo as diretrizes WCAG 2.1. A interface será responsiva para diferentes dispositivos e submetida a testes de usabilidade, responsividade e desempenho antes da publicação definitiva.",
    referencias:
      "Çöpgeven, N. S., & Firat, M. (2022). Effects of Dashboard Usage on E-learning Interactions and Academic Achievement of Distance Education Students. Journal of Educators Online.\n\nPei, B., Cheng, Y., Ambrose, A., Dziadula, E., & Xing, W. (2024). LearningViz: a dashboard for visualizing, analyzing and closing learning performance gaps—a smart learning approach. Smart Learning Environments, 11, Article 56.\n\nSusnjak, T., Ramaswami, G. S., & Mathrani, A. (2022). Learning analytics dashboard: a tool for providing actionable insights to learners. International Journal of Educational Technology in Higher Education, 19, Article 12.",
    atividadesCronograma: [
      { nome: "PROTOTIPAGEM E VALIDAÇÃO DE REQUISITOS COM A PROPESQ", meses: [0, 1, 2] },
      { nome: "DESENVOLVIMENTO INICIAL DA INTERFACE", meses: [1, 2, 3, 4] },
      { nome: "DESENVOLVIMENTO DOS PAINÉIS COM DADOS DE USUÁRIOS", meses: [3, 4, 5, 6, 7, 8] },
      { nome: "TESTES DE USABILIDADE E RESPONSIVIDADE", meses: [7, 8, 9, 10] },
      { nome: "OTIMIZAÇÕES, DOCUMENTAÇÃO E PUBLICAÇÃO", meses: [8, 9, 10, 11] },
    ],
    palavrasChave: ["dashboards", "interface web", "PIBIC", "React", "visualização de dados"],
  },
]

function getStatusLabel(status: PlanStatus) {
  switch (status) {
    case "EM_ANDAMENTO":
      return "Em andamento"
    case "EM_SELECAO":
      return "Em seleção"
    case "ENCERRADO":
      return "Encerrado"
    case "DISPONIVEL":
      return "Disponível"
    default:
      return status
  }
}

function getStatusClasses(status: PlanStatus) {
  switch (status) {
    case "EM_ANDAMENTO":
      return "border-success/30 bg-success/10 text-success"
    case "EM_SELECAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "DISPONIVEL":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getAreaLabel(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "Ciência de Dados"
    case "INTELIGENCIA_ARTIFICIAL":
      return "Inteligência Artificial"
    case "SISTEMAS_INFORMACAO":
      return "Sistemas de Informação"
    case "ENGENHARIA_SOFTWARE":
      return "Engenharia de Software"
    case "EXTENSAO":
      return "Extensão"
    default:
      return area
  }
}

function getAreaClasses(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "border-primary/30 bg-primary/10 text-primary"
    case "INTELIGENCIA_ARTIFICIAL":
      return "border-success/30 bg-success/10 text-success"
    case "SISTEMAS_INFORMACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENGENHARIA_SOFTWARE":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
          {icon}
        </div>
      ) : null}

      <div className="min-w-0">
        <h2 className="m-0 text-base font-semibold leading-none text-primary">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-1 text-sm leading-5 text-neutral">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold leading-6 text-primary">{value}</div>
    </div>
  )
}

export default function PlanView() {
  const { id } = useParams()
  const plan = PLANS.find((item) => item.id === id) ?? PLANS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{plan.titulo} • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-5">
        <header className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/discente/planos-disponiveis"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              Voltar para planos
            </Link>
          </div>

          <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getAreaClasses(
                      plan.area
                    )}`}
                  >
                    <BookOpen size={14} />
                    {getAreaLabel(plan.area)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      plan.status
                    )}`}
                  >
                    {plan.status === "EM_ANDAMENTO" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock3 size={14} />
                    )}
                    {getStatusLabel(plan.status)}
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold leading-tight text-primary md:text-3xl">
                    {plan.titulo}
                  </h1>

                  {plan.tituloEn ? (
                    <p className="text-sm italic text-neutral">{plan.tituloEn}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Orientador(a)" value={plan.orientador} />
                  <InfoItem label="Discente" value={plan.discente} />
                  <InfoItem label="Vigência" value={plan.vigencia} />
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col xl:min-w-[220px]">
                <Link
                  to={`/discente/projetos/${plan.projetoId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Eye size={16} />
                  Ver projeto
                </Link>

              </div>
            </div>
          </Card>
        </header>

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Card title="" className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-start gap-3">
              <Award size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
                  Tipo de Bolsa
                </div>
                <div className="mt-1 text-sm font-semibold text-primary">{plan.tipoBolsa}</div>
              </div>
            </div>
          </Card>

          <Card title="" className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-start gap-3">
              <Target size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
                  Direcionamento
                </div>
                <div className="mt-1 text-sm font-semibold text-primary">{plan.direcionamento}</div>
              </div>
            </div>
          </Card>

          <Card title="" className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
                  Período
                </div>
                <div className="mt-1 text-sm font-semibold text-primary">{plan.periodo}</div>
              </div>
            </div>
          </Card>

          <Card title="" className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-start gap-3">
              <CalendarRange size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
                  Cota
                </div>
                <div className="mt-1 text-sm font-semibold leading-5 text-primary">{plan.cota}</div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle
                icon={<FolderKanban size={18} />}
                title="Vinculação institucional"
                subtitle="Dados de contexto do plano dentro do projeto e da unidade."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoItem label="Projeto de Pesquisa" value={plan.projetoTitulo} />
                <InfoItem label="Centro" value={plan.centro} />
                <InfoItem label="Departamento" value={plan.departamento} />
                <InfoItem label="Edital" value={plan.edital} />
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle
                icon={<Globe size={18} />}
                title="Área de conhecimento"
                subtitle="Classificação acadêmica do plano de trabalho."
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-neutral">
                    <Globe size={15} />
                    <span className="text-xs font-medium uppercase tracking-wide">Grande Área</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">{plan.grandeArea}</div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-neutral">
                    <BookOpen size={15} />
                    <span className="text-xs font-medium uppercase tracking-wide">Área</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">{plan.areaConhecimento}</div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-neutral">
                    <Microscope size={15} />
                    <span className="text-xs font-medium uppercase tracking-wide">Subárea</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">{plan.subarea}</div>
                </div>

                <div className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-neutral">
                    <FlaskConical size={15} />
                    <span className="text-xs font-medium uppercase tracking-wide">Especialidade</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">{plan.especialidade}</div>
                </div>
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle
                icon={<BadgeCheck size={18} />}
                title="Introdução e justificativa"
              />

              <p className="text-sm leading-7 text-primary">{plan.introducaoJustificativa}</p>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle icon={<Target size={18} />} title="Objetivos" />

              <div className="space-y-2">
                {plan.objetivos.split("\n").map((line, i) => {
                  if (!line.trim()) return null

                  const isBullet = line.trim().startsWith("-")
                  const isTitle = line.includes(":") && !isBullet

                  if (isBullet) {
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-success/10 bg-success/5 px-4 py-3">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                        <span className="text-sm leading-6 text-primary">
                          {line.trim().replace(/^-\s*/, "")}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <p
                      key={i}
                      className={`text-sm leading-7 ${
                        isTitle ? "mt-3 font-semibold text-primary" : "text-primary"
                      }`}
                    >
                      {line}
                    </p>
                  )
                })}
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle icon={<Layers size={18} />} title="Metodologia" />

              <p className="text-sm leading-7 text-primary">{plan.metodologia}</p>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle
                icon={<CalendarRange size={18} />}
                title="Cronograma de atividades"
                subtitle="Distribuição prevista das atividades ao longo da vigência."
              />

              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full border-separate border-spacing-y-2 text-xs">
                  <thead>
                    <tr>
                      <th className="w-64 px-3 py-2 text-left font-medium text-neutral">
                        Atividade
                      </th>
                      {ANOS_LABELS.map(({ ano, cols }) => (
                        <th
                          key={ano}
                          colSpan={cols}
                          className="px-2 py-2 text-center font-semibold text-neutral"
                        >
                          {ano}
                        </th>
                      ))}
                    </tr>

                    <tr>
                      <th />
                      {MESES_LABELS.map(({ label }, idx) => (
                        <th
                          key={idx}
                          className="px-1 py-2 text-center font-medium text-neutral"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {plan.atividadesCronograma.map((atividade, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="rounded-l-2xl border border-neutral/15 bg-neutral-light/40 px-4 py-3 font-medium leading-5 text-primary">
                          {atividade.nome}
                        </td>

                        {MESES_LABELS.map((_, colIdx) => {
                          const ativo = atividade.meses.includes(colIdx)

                          return (
                            <td
                              key={colIdx}
                              className="border-y border-neutral/15 bg-neutral-light/20 px-1 py-3 text-center last:rounded-r-2xl"
                            >
                              <div
                                className={`mx-auto h-5 w-full max-w-[28px] rounded-md ${
                                  ativo ? "bg-primary/70" : "bg-transparent"
                                }`}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-7 md:p-8">
              <SectionTitle icon={<BookOpen size={18} />} title="Referências" />

              <div className="space-y-4">
                {plan.referencias.split("\n\n").map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-neutral/15 bg-neutral-light/40 px-4 py-4 text-sm leading-6 text-neutral"
                  >
                    {ref}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<CheckCircle2 size={18} />}
                title="Resumo do plano"
              />

              <div className="space-y-5">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-neutral">
                    Status
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      plan.status
                    )}`}
                  >
                    {getStatusLabel(plan.status)}
                  </span>
                </div>

                <InfoItem label="Área temática" value={getAreaLabel(plan.area)} />
                <InfoItem label="Tipo de bolsa" value={plan.tipoBolsa} />
                <InfoItem label="Período acadêmico" value={plan.periodo} />
                <InfoItem label="Vigência" value={plan.vigencia} />
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Participantes"
              />

              <div className="space-y-5">
                <InfoItem label="Discente" value={plan.discente} />
                <InfoItem label="Orientador(a)" value={plan.orientador} />
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<BookOpen size={18} />}
                title="Palavras-chave"
              />

              <div className="flex flex-wrap gap-2">
                {plan.palavrasChave.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="" className="rounded-3xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<FolderKanban size={18} />}
                title="Ações rápidas"
              />

              <div className="flex flex-col gap-3">
                <Link
                  to={`/discente/projetos/${plan.projetoId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <FolderKanban size={16} />
                  Ver projeto
                </Link>

                <Link
                  to="/discente/planos-disponiveis"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
                >
                  <ArrowLeft size={16} />
                  Voltar à lista
                </Link>
              </div>
            </Card>

          </aside>
        </section>
      </div>
    </div>
  )
}