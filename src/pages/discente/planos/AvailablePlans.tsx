import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
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
} from "lucide-react"

type PlanStatus = "DISPONIVEL" | "EM_SELECAO" | "ENCERRADO"
type PlanArea =
  | "CIENCIA_DADOS"
  | "INTELIGENCIA_ARTIFICIAL"
  | "SISTEMAS_INFORMACAO"
  | "ENGENHARIA_SOFTWARE"
  | "EXTENSAO"

type AvailablePlan = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  orientador: string
  edital: string
  area: PlanArea
  status: PlanStatus
  periodo: string
  vigencia: string
  resumo: string
  palavrasChave: string[]
}

const PLANS: AvailablePlan[] = [
  {
    id: "plan_001",
    titulo: "Desenvolvimento da Interface Web e Dashboards Interativos",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
    area: "CIENCIA_DADOS",
    status: "DISPONIVEL",
    periodo: "2026.1",
    vigencia: "01/05/2026 a 31/12/2026",
    resumo:
      "Plano voltado ao apoio na modelagem de dados, estruturação de indicadores e desenvolvimento de fluxos analíticos para a plataforma acadêmica.",
    palavrasChave: ["dados", "dashboards", "indicadores"],
  },
  {
    id: "plan_002",
    titulo: "Plano de Trabalho em Inteligência Artificial para Sistemas Acadêmicos",
    projetoId: "proj_002",
    projetoTitulo: "Soluções Inteligentes para Apoio à Gestão Universitária",
    orientador: "Profa. Marina Costa",
    edital: "PIBITI 2026",
    area: "INTELIGENCIA_ARTIFICIAL",
    status: "EM_SELECAO",
    periodo: "2026.1",
    vigencia: "01/06/2026 a 31/12/2026",
    resumo:
      "Plano direcionado ao desenvolvimento de modelos e fluxos de IA aplicados à automação de processos, análise de dados institucionais e apoio à tomada de decisão.",
    palavrasChave: ["ia", "automação", "análise preditiva"],
  },
]

function getStatusLabel(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_SELECAO":
      return "Em seleção"
    case "ENCERRADO":
      return "Encerrado"
    default:
      return status
  }
}

function getStatusClasses(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_SELECAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
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

export default function AvailablePlans() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Planos Disponíveis • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-5 px-6 py-5">

        <header className="rounded-2xl border border-neutral/20 bg-white px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">
            Planos de Trabalho Disponíveis
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
            Consulte os planos disponíveis para seleção e visualize as oportunidades
            vinculadas a projetos e editais.
          </p>
        </header>

        <section className="rounded-2xl border border-neutral/20 bg-white p-6 md:p-8">
          {PLANS.length === 0 ? (
            <div className="rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-8 text-center">
              <div className="text-base font-semibold text-primary">
                Nenhum plano encontrado
              </div>
              <p className="mt-1 text-sm text-neutral">
                Não há planos disponíveis no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {PLANS.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-neutral/20 bg-white p-5 transition hover:border-primary/20"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-primary">
                            {item.titulo}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getAreaClasses(
                              item.area
                            )}`}
                          >
                            <BookOpen size={14} />
                            {getAreaLabel(item.area)}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              item.status
                            )}`}
                          >
                            {item.status === "DISPONIVEL" ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}
                            {getStatusLabel(item.status)}
                          </span>
                        </div>

                        <p className="max-w-4xl text-sm leading-6 text-neutral">
                          {item.resumo}
                        </p>
                      </div>

                      <Link
                        to={`/discente/planos-disponiveis/${item.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5 xl:min-w-[180px]"
                      >
                        <Eye size={16} />
                        Visualizar
                      </Link>
                    </div>

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
                          <UserRound size={15} />
                          Orientador(a)
                        </div>
                        <div className="mt-1 font-medium text-primary">
                          {item.orientador}
                        </div>
                      </div>

                      <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                        <div className="flex items-center gap-2 text-neutral">
                          <BadgeCheck size={15} />
                          Edital
                        </div>
                        <div className="mt-1 font-medium text-primary">
                          {item.edital}
                        </div>
                      </div>

                      <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
                        <div className="flex items-center gap-2 text-neutral">
                          <CalendarDays size={15} />
                          Vigência
                        </div>
                        <div className="mt-1 font-medium text-primary">
                          {item.vigencia}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.palavrasChave.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}