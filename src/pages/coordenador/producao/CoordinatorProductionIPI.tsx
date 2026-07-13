import {
  AlertCircle,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Info,
  RefreshCw,
  Upload,
} from "lucide-react"
import { Helmet } from "react-helmet"

const qualisAreas = [
  "Ciência da Computação",
  "Engenharias IV",
  "Educação",
  "Linguística e Literatura",
  "Saúde Coletiva",
  "Interdisciplinar",
]

const producoesResumo = [
  {
    categoria: "Artigos em periódicos",
    origem: "Currículo Lattes",
    quantidade: 8,
    pontos: 64,
  },
  {
    categoria: "Trabalhos em eventos",
    origem: "Currículo Lattes",
    quantidade: 5,
    pontos: 12,
  },
  {
    categoria: "Livros e capítulos",
    origem: "Currículo Lattes",
    quantidade: 2,
    pontos: 7,
  },
  {
    categoria: "Propriedade intelectual",
    origem: "Currículo Lattes",
    quantidade: 1,
    pontos: 3,
  },
  {
    categoria: "Orientações",
    origem: "SIGAA",
    quantidade: 6,
    pontos: 12,
  },
  {
    categoria: "Bancas",
    origem: "SIGAA",
    quantidade: 4,
    pontos: 8,
  },
]

const ipi = producoesResumo.reduce((total, item) => total + item.pontos, 0)
const fppi = ipi >= 150 ? 10 : ipi / 15

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function StatusBadge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode
  variant?: "success" | "warning" | "neutral"
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-primary">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default function CoordinatorProductionIPI() {
  return (
    <>
      <Helmet>
        <title>Produção Intelectual | Coordenador</title>
      </Helmet>

      <main className="min-h-screen bg-neutral-light">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Produção Intelectual
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-primary">
                    IPI do pesquisador
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                    Acompanhe a importação do Currículo Lattes, selecione a área
                    Qualis/CAPES, visualize a pontuação do Índice de Produtividade
                    Intelectual e consulte o FPPI utilizado na classificação.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="success">Lattes importado</StatusBadge>
                  <StatusBadge variant="warning">Qualis pendente de validação</StatusBadge>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral">IPI calculado</p>
                  <Award size={18} className="text-primary" />
                </div>
                <p className="mt-3 text-3xl font-bold text-primary">{ipi}</p>
                <p className="mt-1 text-xs text-neutral">
                  Soma da produção intelectual no período 2021–2025.
                </p>
              </div>

              <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral">FPPI resultante</p>
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <p className="mt-3 text-3xl font-bold text-primary">
                  {formatNumber(fppi)}
                </p>
                <p className="mt-1 text-xs text-neutral">
                  Regra aplicada: IPI menor que 150, então FPPI = IPI / 15.
                </p>
              </div>

              <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral">Período avaliado</p>
                  <CalendarDays size={18} className="text-primary" />
                </div>
                <p className="mt-3 text-3xl font-bold text-primary">2021–2025</p>
                <p className="mt-1 text-xs text-neutral">
                  Produções registradas no Lattes e dados acadêmicos do SIGAA.
                </p>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
                <SectionTitle
                  icon={<Upload size={18} />}
                  title="Importação do Currículo Lattes"
                  subtitle="Envie o arquivo XML ou autorize a importação automática pelo SIGAA."
                />

                <div className="space-y-4">
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-5">
                    <label
                      htmlFor="lattesXml"
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <FileText size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-primary">
                          Importar arquivo XML do Currículo Lattes
                        </p>
                        <p className="mt-1 text-xs text-neutral">
                          Use o mesmo arquivo XML para os anos de referência exigidos.
                        </p>
                      </div>

                      <span className="rounded-xl border border-primary/20 bg-white px-4 py-2 text-xs font-medium text-primary transition hover:border-primary/40">
                        Selecionar arquivo
                      </span>
                    </label>

                    <input id="lattesXml" type="file" accept=".xml" className="hidden" />
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl border border-neutral/15 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Importação automática
                      </p>
                      <p className="mt-1 text-xs text-neutral">
                        Autorize a sincronização periódica das produções do Lattes.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      <RefreshCw size={16} />
                      Autorizar importação
                    </button>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-700" />
                      <p className="text-sm leading-6 text-amber-800">
                        Após importar, o pesquisador deve validar se todas as produções
                        foram carregadas corretamente e regularizar ausências dentro do
                        prazo definido no edital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
                <SectionTitle
                  icon={<BookOpen size={18} />}
                  title="Área Qualis/CAPES"
                  subtitle="Selecione apenas uma área para pontuação dos artigos."
                />

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-primary">
                      Área de avaliação
                    </span>
                    <select
                      defaultValue=""
                      className="mt-2 w-full rounded-2xl border border-neutral/20 bg-white px-4 py-3 text-sm text-neutral outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="" disabled>
                        Selecione uma área Qualis/CAPES
                      </option>
                      {qualisAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-primary">
                      Situação da área
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge variant="warning">Aguardando validação</StatusBadge>
                      <StatusBadge>Qualis 2021–2024</StatusBadge>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Salvar área Qualis
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={<Award size={18} />}
                title="Resumo da pontuação"
                subtitle="Prévia da composição do IPI com base nas produções importadas e nos dados do SIGAA."
              />

              <div className="overflow-hidden rounded-2xl border border-neutral/15">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-neutral">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Origem</th>
                      <th className="px-4 py-3 font-semibold">Quantidade</th>
                      <th className="px-4 py-3 font-semibold">Pontuação</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral/10">
                    {producoesResumo.map((item) => (
                      <tr key={item.categoria} className="bg-white">
                        <td className="px-4 py-4 font-medium text-primary">
                          {item.categoria}
                        </td>
                        <td className="px-4 py-4 text-neutral">{item.origem}</td>
                        <td className="px-4 py-4 text-neutral">{item.quantidade}</td>
                        <td className="px-4 py-4 font-semibold text-primary">
                          {item.pontos}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-neutral">
                    Esta tela apresenta uma prévia para conferência. A pontuação oficial
                    deve ser validada conforme os dados importados no SIGAA e as regras
                    do edital.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={<FileText size={18} />}
                title="Produção artístico-cultural"
                subtitle="O envio da documentação deve ser realizado via SIGCHAMADOS."
              />

              <div className="flex flex-col gap-4 rounded-2xl border border-neutral/15 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Encaminhar produção artístico-cultural
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral">
                    Utilize o SIGCHAMADOS para anexar a pontuação cadastrada no
                    Currículo Lattes com o respectivo Qualis-Artístico/CAPES.
                  </p>
                </div>

                <a
                  href="http://www.propesq.ufpb.br/sigchamados"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:border-primary/40"
                >
                  Abrir SIGCHAMADOS
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}