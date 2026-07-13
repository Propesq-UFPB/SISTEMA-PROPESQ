import { Helmet } from "react-helmet"
import React from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react"

type IPIStatus = "validado" | "pendente" | "em_revisao" | "inconsistente"

type CoordinatorIPI = {
  id: number
  nome: string
  unidade: string
  grandeArea: string
  area: string
  periodo: string
  ipiBruto: number
  fppi: number
  bolsistaPQDT: boolean
  fppiAjustado: boolean
  producoesConsideradas: number
  pendencias: number
  inconsistencias: number
  recurso: "sem_recurso" | "solicitado" | "em_analise" | "deferido" | "indeferido"
  status: IPIStatus
}

const coordinatorsIPI: CoordinatorIPI[] = [
  {
    id: 1,
    nome: "Dra. Helena Martins",
    unidade: "Centro de Informática",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    periodo: "2021–2024",
    ipiBruto: 182,
    fppi: 10,
    bolsistaPQDT: true,
    fppiAjustado: true,
    producoesConsideradas: 24,
    pendencias: 0,
    inconsistencias: 0,
    recurso: "sem_recurso",
    status: "validado",
  },
  {
    id: 2,
    nome: "Dr. Rafael Oliveira",
    unidade: "Centro de Tecnologia",
    grandeArea: "Engenharias",
    area: "Engenharia Elétrica",
    periodo: "2021–2024",
    ipiBruto: 126,
    fppi: 8.4,
    bolsistaPQDT: false,
    fppiAjustado: false,
    producoesConsideradas: 18,
    pendencias: 2,
    inconsistencias: 1,
    recurso: "solicitado",
    status: "pendente",
  },
  {
    id: 3,
    nome: "Dra. Camila Andrade",
    unidade: "Centro de Ciências Humanas, Letras e Artes",
    grandeArea: "Ciências Humanas",
    area: "Educação",
    periodo: "2021–2024",
    ipiBruto: 148,
    fppi: 9.87,
    bolsistaPQDT: false,
    fppiAjustado: false,
    producoesConsideradas: 31,
    pendencias: 0,
    inconsistencias: 1,
    recurso: "em_analise",
    status: "em_revisao",
  },
  {
    id: 4,
    nome: "Dr. Marcos Pereira",
    unidade: "Centro de Ciências da Saúde",
    grandeArea: "Ciências da Saúde",
    area: "Medicina",
    periodo: "2021–2024",
    ipiBruto: 76,
    fppi: 5.07,
    bolsistaPQDT: false,
    fppiAjustado: false,
    producoesConsideradas: 12,
    pendencias: 3,
    inconsistencias: 2,
    recurso: "indeferido",
    status: "inconsistente",
  },
]

function calculateFPPI(ipi: number) {
  if (ipi >= 150) return 10
  return Number((ipi / 15).toFixed(2))
}

function statusLabel(status: IPIStatus) {
  const map = {
    validado: "Validado",
    pendente: "Pendente",
    em_revisao: "Em revisão",
    inconsistente: "Inconsistente",
  }

  return map[status]
}

function statusClass(status: IPIStatus) {
  const map = {
    validado: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pendente: "border-amber-200 bg-amber-50 text-amber-700",
    em_revisao: "border-blue-200 bg-blue-50 text-blue-700",
    inconsistente: "border-red-200 bg-red-50 text-red-700",
  }

  return map[status]
}

function recursoLabel(recurso: CoordinatorIPI["recurso"]) {
  const map = {
    sem_recurso: "Sem recurso",
    solicitado: "Recurso solicitado",
    em_analise: "Em análise",
    deferido: "Deferido",
    indeferido: "Indeferido",
  }

  return map[recurso]
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export default function AdminIPIReport() {
  const totalCoordenadores = coordinatorsIPI.length
  const totalValidados = coordinatorsIPI.filter((item) => item.status === "validado").length
  const totalPendencias = coordinatorsIPI.reduce((acc, item) => acc + item.pendencias, 0)
  const totalInconsistencias = coordinatorsIPI.reduce((acc, item) => acc + item.inconsistencias, 0)
  const totalAjustados = coordinatorsIPI.filter((item) => item.fppiAjustado).length

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatório de IPI • PROPESQ</title>
      </Helmet>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/adm/avaliacao/avaliadores"
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
          Voltar para Avaliadores
        </Link>

        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-primary">
                  Relatório de IPI dos Coordenadores
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Gere, confira e exporte o relatório de Índice de Produção
                  Intelectual dos coordenadores/proponentes. O FPPI calculado
                  nesta página será usado posteriormente na composição do ranking
                  final classificatório.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  <RefreshCcw size={16} />
                  Recalcular IPI
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95">
                  <Download size={16} />
                  Exportar relatório
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">
                  Regra de cálculo do FPPI
                </h2>
                <p className="mt-1 text-sm text-neutral">
                  O FPPI é calculado a partir do IPI bruto validado no período
                  definido pelo edital.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/60 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Se IPI ≥ 150
                  </p>
                  <p className="mt-1 text-lg font-bold text-primary">
                    FPPI = 10
                  </p>
                </div>

                <div className="rounded-2xl border border-white/60 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Se IPI &lt; 150
                  </p>
                  <p className="mt-1 text-lg font-bold text-primary">
                    FPPI = IPI / 15
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              label="Coordenadores"
              value={totalCoordenadores}
              helper="Com IPI calculado"
            />
            <SummaryCard
              label="Validados"
              value={totalValidados}
              helper="Sem pendências"
            />
            <SummaryCard
              label="FPPI ajustado"
              value={totalAjustados}
              helper="IPI igual ou superior a 150"
            />
            <SummaryCard
              label="Pendências"
              value={totalPendencias}
              helper="Itens aguardando correção"
              warning
            />
            <SummaryCard
              label="Inconsistências"
              value={totalInconsistencias}
              helper="Itens com divergência"
              danger
            />
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">
                  Consulta do relatório
                </h2>
                <p className="mt-1 text-sm text-neutral">
                  Filtre por edital, período, unidade, área, status ou situação
                  de revisão.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                  />
                  <input
                    type="text"
                    placeholder="Buscar coordenador..."
                    className="h-11 w-full rounded-xl border border-neutral/20 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral/50 focus:border-primary/40 sm:w-72"
                  />
                </div>

                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  <Filter size={16} />
                  Filtros
                </button>

                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  <SlidersHorizontal size={16} />
                  Parâmetros
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-neutral/10 bg-white shadow-sm">
            <div className="border-b border-neutral/10 px-5 py-4">
              <h2 className="text-base font-semibold text-primary">
                Coordenadores/proponentes
              </h2>
              <p className="mt-1 text-sm text-neutral">
                Conferência do IPI bruto, FPPI calculado, ajustes, pendências e
                situação de recurso.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral/10">
                <thead className="bg-neutral-light/60">
                  <tr>
                    <TableHead>Coordenador</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead align="right">IPI bruto</TableHead>
                    <TableHead align="right">FPPI</TableHead>
                    <TableHead>PQ/DT</TableHead>
                    <TableHead>Ajuste</TableHead>
                    <TableHead>Produções</TableHead>
                    <TableHead>Pendências</TableHead>
                    <TableHead>Recurso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead align="right">Ações</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral/10 bg-white">
                  {coordinatorsIPI.map((item) => {
                    const calculated = calculateFPPI(item.ipiBruto)

                    return (
                      <tr key={item.id} className="transition hover:bg-neutral-light/40">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-primary">
                              {item.nome}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral">
                              {item.unidade}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-neutral-dark">
                              {item.area}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral">
                              {item.grandeArea}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>{item.periodo}</TableCell>

                        <TableCell align="right">
                          <strong className="text-primary">
                            {formatNumber(item.ipiBruto)}
                          </strong>
                        </TableCell>

                        <TableCell align="right">
                          <div className="flex flex-col items-end">
                            <strong className="text-primary">
                              {formatNumber(item.fppi)}
                            </strong>
                            {item.fppi !== calculated ? (
                              <span className="text-xs text-amber-600">
                                revisar cálculo
                              </span>
                            ) : null}
                          </div>
                        </TableCell>

                        <TableCell>
                          {item.bolsistaPQDT ? (
                            <Badge className="border-purple-200 bg-purple-50 text-purple-700">
                              PQ/DT
                            </Badge>
                          ) : (
                            <span className="text-sm text-neutral">Não</span>
                          )}
                        </TableCell>

                        <TableCell>
                          {item.fppiAjustado ? (
                            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                              FPPI = 10
                            </Badge>
                          ) : (
                            <span className="text-sm text-neutral">
                              Sem ajuste
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-neutral-dark">
                            {item.producoesConsideradas}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.pendencias > 0 || item.inconsistencias > 0 ? (
                              <AlertTriangle size={15} className="text-amber-600" />
                            ) : (
                              <CheckCircle2 size={15} className="text-emerald-600" />
                            )}

                            <span className="text-sm text-neutral">
                              {item.pendencias} pend. / {item.inconsistencias} inc.
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>{recursoLabel(item.recurso)}</TableCell>

                        <TableCell>
                          <Badge className={statusClass(item.status)}>
                            {statusLabel(item.status)}
                          </Badge>
                        </TableCell>

                        <TableCell align="right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral/20 text-neutral transition hover:border-primary/30 hover:text-primary"
                              title="Visualizar produções consideradas"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral/20 text-neutral transition hover:border-primary/30 hover:text-primary"
                              title="Exportar relatório individual"
                            >
                              <FileText size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-2 text-primary">
                  <FileSpreadsheet size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Exportação do relatório
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral">
                    O gestor pode exportar o relatório completo para conferência,
                    publicação interna, análise da comissão ou composição do
                    ranking final.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  Exportar PDF
                </button>
                <button className="rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  Exportar CSV
                </button>
                <button className="rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary">
                  Exportar XLSX
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-2xl border border-amber-200 bg-white p-2 text-amber-700">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-amber-800">
                    Pendências e revisão de IPI
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-amber-800/80">
                    Coordenadores com pendências, inconsistências ou recurso
                    aberto devem ser revisados antes da geração do ranking final.
                  </p>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95">
                <Eye size={16} />
                Ver itens que exigem revisão
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  helper,
  warning,
  danger,
}: {
  label: string
  value: number
  helper: string
  warning?: boolean
  danger?: boolean
}) {
  const color = danger
    ? "text-red-700"
    : warning
      ? "text-amber-700"
      : "text-primary"

  return (
    <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-neutral">{helper}</p>
    </div>
  )
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

function TableCell({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-4 text-sm text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  )
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  )
}