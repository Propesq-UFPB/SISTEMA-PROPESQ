import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Filter,
  Info,
  Search,
  Trophy,
} from "lucide-react"
import { Helmet } from "react-helmet"

type ProjectStatus = "APROVADO" | "REPROVADO" | "EM_REVISÃO"
type ResultStatus = "PRELIMINAR" | "FINAL"

type RankingItem = {
  id: number
  edital: string
  coordenador: string
  centro: string
  unidade: string
  area: string
  projeto: string
  np: number
  ipi: number
  bolsistaPQDT: boolean
  statusProjeto: ProjectStatus
  planosAprovados: number
  resultado: ResultStatus
  criterioDesempate: {
    maiorNP: boolean
    maiorIPI: boolean
    maiorPlanosAprovados: boolean
    observacao: string
  }
}

const rankingMock: RankingItem[] = [
  {
    id: 1,
    edital: "PIBIC 2026/2027",
    coordenador: "Dra. Helena Martins",
    centro: "CI",
    unidade: "Departamento de Computação Científica",
    area: "Ciências Exatas e da Terra",
    projeto: "Modelos inteligentes para análise de dados acadêmicos",
    np: 9.4,
    ipi: 172,
    bolsistaPQDT: true,
    statusProjeto: "APROVADO",
    planosAprovados: 3,
    resultado: "FINAL",
    criterioDesempate: {
      maiorNP: true,
      maiorIPI: true,
      maiorPlanosAprovados: true,
      observacao: "Sem necessidade de desempate.",
    },
  },
  {
    id: 2,
    edital: "PIBIC 2026/2027",
    coordenador: "Dr. Marcos Oliveira",
    centro: "CT",
    unidade: "Departamento de Engenharia Elétrica",
    area: "Engenharias",
    projeto: "Eficiência energética em ambientes universitários",
    np: 9.1,
    ipi: 138,
    bolsistaPQDT: false,
    statusProjeto: "APROVADO",
    planosAprovados: 2,
    resultado: "FINAL",
    criterioDesempate: {
      maiorNP: true,
      maiorIPI: false,
      maiorPlanosAprovados: true,
      observacao: "Classificado pela maior nota do projeto.",
    },
  },
  {
    id: 3,
    edital: "PIBIC 2026/2027",
    coordenador: "Dra. Ana Beatriz Lima",
    centro: "CCHLA",
    unidade: "Departamento de Letras",
    area: "Linguística, Letras e Artes",
    projeto: "Análise discursiva de práticas educacionais inclusivas",
    np: 8.8,
    ipi: 151,
    bolsistaPQDT: false,
    statusProjeto: "APROVADO",
    planosAprovados: 1,
    resultado: "PRELIMINAR",
    criterioDesempate: {
      maiorNP: false,
      maiorIPI: true,
      maiorPlanosAprovados: false,
      observacao: "Posição definida pelo FPPI máximo.",
    },
  },
  {
    id: 4,
    edital: "PIBIC 2026/2027",
    coordenador: "Dr. Ricardo Souza",
    centro: "CCS",
    unidade: "Departamento de Saúde Coletiva",
    area: "Ciências da Saúde",
    projeto: "Indicadores de saúde pública em municípios paraibanos",
    np: 8.3,
    ipi: 121,
    bolsistaPQDT: false,
    statusProjeto: "APROVADO",
    planosAprovados: 2,
    resultado: "PRELIMINAR",
    criterioDesempate: {
      maiorNP: false,
      maiorIPI: false,
      maiorPlanosAprovados: true,
      observacao: "Desempate por maior quantidade de planos aprovados.",
    },
  },
  {
    id: 5,
    edital: "PIBIC 2026/2027",
    coordenador: "Dra. Camila Fernandes",
    centro: "CE",
    unidade: "Departamento de Educação",
    area: "Ciências Humanas",
    projeto: "Metodologias ativas na formação docente",
    np: 6.9,
    ipi: 162,
    bolsistaPQDT: false,
    statusProjeto: "REPROVADO",
    planosAprovados: 0,
    resultado: "PRELIMINAR",
    criterioDesempate: {
      maiorNP: false,
      maiorIPI: true,
      maiorPlanosAprovados: false,
      observacao: "Projeto não compõe a classificação final por nota inferior a 7,0.",
    },
  },
]

function calculateFPPI(ipi: number, bolsistaPQDT: boolean) {
  if (bolsistaPQDT) return 10
  if (ipi >= 150) return 10
  return Number((ipi / 15).toFixed(2))
}

function calculateIFC(fppi: number, np: number) {
  return Number((((fppi * 7) + (np * 3)) / 10).toFixed(2))
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function statusProjetoLabel(status: ProjectStatus) {
  const styles = {
    APROVADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REPROVADO: "border-red-200 bg-red-50 text-red-700",
    EM_REVISÃO: "border-amber-200 bg-amber-50 text-amber-700",
  }

  const labels = {
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    EM_REVISÃO: "Em revisão",
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function resultadoLabel(resultado: ResultStatus) {
  const styles = {
    PRELIMINAR: "border-blue-200 bg-blue-50 text-blue-700",
    FINAL: "border-primary/20 bg-primary/5 text-primary",
  }

  const labels = {
    PRELIMINAR: "Preliminar",
    FINAL: "Final",
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[resultado]}`}>
      {labels[resultado]}
    </span>
  )
}

function Card({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral">{title}</p>
          <strong className="mt-2 block text-2xl font-bold text-primary">{value}</strong>
          <p className="mt-1 text-xs text-neutral">{description}</p>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AdminFinalRanking() {
  const [search, setSearch] = useState("")
  const [area, setArea] = useState("TODAS")
  const [centro, setCentro] = useState("TODOS")
  const [resultado, setResultado] = useState("TODOS")

  const enrichedRanking = useMemo(() => {
    return rankingMock
      .map((item) => {
        const fppi = calculateFPPI(item.ipi, item.bolsistaPQDT)
        const ifc = calculateIFC(fppi, item.np)

        return {
          ...item,
          fppi,
          ifc,
        }
      })
      .sort((a, b) => {
        if (b.ifc !== a.ifc) return b.ifc - a.ifc
        if (b.np !== a.np) return b.np - a.np
        if (b.ipi !== a.ipi) return b.ipi - a.ipi
        return b.planosAprovados - a.planosAprovados
      })
      .map((item, index) => ({
        ...item,
        classificacaoGeral: index + 1,
      }))
  }, [])

  const areas = useMemo(() => {
    return ["TODAS", ...Array.from(new Set(rankingMock.map((item) => item.area)))]
  }, [])

  const centros = useMemo(() => {
    return ["TODOS", ...Array.from(new Set(rankingMock.map((item) => item.centro)))]
  }, [])

  const filteredRanking = useMemo(() => {
    return enrichedRanking.filter((item) => {
      const searchTerm = search.toLowerCase()

      const matchesSearch =
        item.coordenador.toLowerCase().includes(searchTerm) ||
        item.projeto.toLowerCase().includes(searchTerm) ||
        item.unidade.toLowerCase().includes(searchTerm)

      const matchesArea = area === "TODAS" || item.area === area
      const matchesCentro = centro === "TODOS" || item.centro === centro
      const matchesResultado = resultado === "TODOS" || item.resultado === resultado

      return matchesSearch && matchesArea && matchesCentro && matchesResultado
    })
  }, [search, area, centro, resultado, enrichedRanking])

  const rankingByArea = useMemo(() => {
    const grouped = filteredRanking.reduce<Record<string, typeof filteredRanking>>((acc, item) => {
      if (!acc[item.area]) acc[item.area] = []
      acc[item.area].push(item)
      return acc
    }, {})

    return Object.entries(grouped).map(([areaName, items]) => ({
      area: areaName,
      total: items.length,
      melhorIFC: items[0]?.ifc ?? 0,
      primeiroColocado: items[0]?.coordenador ?? "-",
    }))
  }, [filteredRanking])

  const approvedProjects = filteredRanking.filter((item) => item.statusProjeto === "APROVADO")
  const finalResults = filteredRanking.filter((item) => item.resultado === "FINAL")
  const preliminaryResults = filteredRanking.filter((item) => item.resultado === "PRELIMINAR")

  function exportCSV() {
    const headers = [
      "Classificação Geral",
      "Coordenador",
      "Centro",
      "Unidade",
      "Área",
      "Projeto",
      "NP",
      "IPI",
      "FPPI",
      "IFC",
      "Status do Projeto",
      "Planos Aprovados",
      "Resultado",
      "Critério de Desempate",
    ]

    const rows = filteredRanking.map((item) => [
      item.classificacaoGeral,
      item.coordenador,
      item.centro,
      item.unidade,
      item.area,
      item.projeto,
      item.np,
      item.ipi,
      item.fppi,
      item.ifc,
      item.statusProjeto,
      item.planosAprovados,
      item.resultado,
      item.criterioDesempate.observacao,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "ranking-final-classificatorio.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Helmet>
          <title>Ranking Final Classificatório • PROPESQ</title>
        </Helmet>
        <div className="space-y-6">
          <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">

                <h1 className="text-2xl font-bold tracking-tight text-primary">
                  Ranking Final Classificatório
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Gere e acompanhe a classificação dos coordenadores a partir da Nota do Projeto,
                  do IPI e do FPPI calculado conforme as regras do edital.
                </p>

                <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 text-primary" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Fórmula do Índice Final Classificatório
                      </p>
                      <p className="mt-1 text-sm text-neutral">
                        IFC = [(FPPI × 7) + (NP × 3)] / 10
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                <Download size={16} />
                Exportar ranking
              </button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="Projetos classificados"
              value={String(approvedProjects.length)}
              description="Projetos aprovados considerados no ranking."
              icon={<CheckCircle2 size={22} />}
            />

            <Card
              title="Resultado final"
              value={String(finalResults.length)}
              description="Registros já consolidados como resultado final."
              icon={<Award size={22} />}
            />

            <Card
              title="Resultado preliminar"
              value={String(preliminaryResults.length)}
              description="Registros ainda sujeitos a recurso ou revisão."
              icon={<FileSpreadsheet size={22} />}
            />

            <Card
              title="Áreas contempladas"
              value={String(rankingByArea.length)}
              description="Classificação agrupada por área de conhecimento."
              icon={<BarChart3 size={22} />}
            />
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <h2 className="text-base font-semibold text-primary">Filtros do ranking</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-neutral">
                  Buscar
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-neutral/15 bg-white px-3 py-2.5">
                  <Search size={16} className="text-neutral" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Coordenador, projeto ou unidade"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral/60"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-neutral">
                  Área
                </span>
                <select
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="w-full rounded-2xl border border-neutral/15 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  {areas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-neutral">
                  Centro
                </span>
                <select
                  value={centro}
                  onChange={(event) => setCentro(event.target.value)}
                  className="w-full rounded-2xl border border-neutral/15 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  {centros.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-neutral">
                  Resultado
                </span>
                <select
                  value={resultado}
                  onChange={(event) => setResultado(event.target.value)}
                  className="w-full rounded-2xl border border-neutral/15 bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="PRELIMINAR">Preliminar</option>
                  <option value="FINAL">Final</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-neutral/10 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">
                  Classificação geral
                </h2>
                <p className="mt-1 text-sm text-neutral">
                  Ordenação por IFC, com desempate por NP, IPI e quantidade de planos aprovados.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-neutral/15 px-3 py-1.5 text-xs font-semibold text-neutral">
                <ArrowDownUp size={14} />
                {filteredRanking.length} registro(s)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1280px] w-full text-left text-sm">
                <thead className="bg-neutral-light/70 text-xs uppercase tracking-wide text-neutral">
                  <tr>
                    <th className="px-5 py-3">Class.</th>
                    <th className="px-5 py-3">Coordenador</th>
                    <th className="px-5 py-3">Centro/Unidade</th>
                    <th className="px-5 py-3">Projeto</th>
                    <th className="px-5 py-3">NP</th>
                    <th className="px-5 py-3">IPI</th>
                    <th className="px-5 py-3">FPPI</th>
                    <th className="px-5 py-3">IFC</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Planos</th>
                    <th className="px-5 py-3">Resultado</th>
                    <th className="px-5 py-3">Desempate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral/10">
                  {filteredRanking.map((item) => (
                    <tr key={item.id} className="align-top transition hover:bg-neutral-light/50">
                      <td className="px-5 py-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {item.classificacaoGeral}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-primary">{item.coordenador}</p>
                        <p className="mt-1 text-xs text-neutral">
                          {item.bolsistaPQDT ? "Bolsista PQ/DT" : "Não bolsista PQ/DT"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-neutral-900">{item.centro}</p>
                        <p className="mt-1 max-w-[220px] text-xs text-neutral">
                          {item.unidade}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[280px] font-medium text-neutral-900">
                          {item.projeto}
                        </p>
                        <p className="mt-1 text-xs text-neutral">{item.area}</p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-neutral-900">
                        {formatNumber(item.np)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-neutral-900">
                        {formatNumber(item.ipi)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-primary">
                          {formatNumber(item.fppi)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-xl bg-primary/10 px-3 py-1.5 font-bold text-primary">
                          {formatNumber(item.ifc)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {statusProjetoLabel(item.statusProjeto)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-neutral-900">
                          {item.planosAprovados}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {resultadoLabel(item.resultado)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[260px] text-xs leading-5 text-neutral">
                          {item.criterioDesempate.observacao}
                        </p>
                      </td>
                    </tr>
                  ))}

                  {filteredRanking.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-5 py-10 text-center text-sm text-neutral">
                        Nenhum registro encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-primary">
                Classificação por área
              </h2>
              <p className="mt-1 text-sm text-neutral">
                Resumo auxiliar para cenários em que o edital exija distribuição ou análise por área.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rankingByArea.map((item) => (
                <div
                  key={item.area}
                  className="rounded-3xl border border-neutral/10 bg-neutral-light/40 p-5"
                >
                  <p className="text-sm font-semibold text-primary">{item.area}</p>

                  <div className="mt-4 space-y-2 text-sm text-neutral">
                    <div className="flex items-center justify-between gap-3">
                      <span>Total de classificados</span>
                      <strong className="text-neutral-900">{item.total}</strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span>Melhor IFC</span>
                      <strong className="text-neutral-900">
                        {formatNumber(item.melhorIFC)}
                      </strong>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral">
                        Primeiro colocado
                      </span>
                      <p className="mt-1 font-medium text-neutral-900">
                        {item.primeiroColocado}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}