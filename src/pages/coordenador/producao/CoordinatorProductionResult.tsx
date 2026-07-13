import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Baby,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  Info,
  Medal,
  Trophy,
} from "lucide-react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

const resultData = {
  pesquisador: "Profa. Dra. Ana Beatriz Silva",
  edital: "Edital PROPESQ/CGPAIC Nº 01/2026",
  modalidade: "PIBIC/CNPq/UFPB",
  fppi: 8.42,
  np: 9.1,
  classificacaoGeral: 18,
  classificacaoArea: 4,
  cnpq: 1,
  ufpb: 1,
  voluntarios: 2,
  resultadoPreliminar: {
    status: "Classificado",
    dataDivulgacao: "11/08/2026",
    prazoRecurso: "até 3 dias após a divulgação",
  },
  resultadoFinal: {
    status: "Aguardando divulgação",
    previsao: "25/08/2026",
  },
  reservas: {
    recemDoutor: {
      elegivel: true,
      contemplado: false,
      descricao: "Título de doutor obtido entre 2021 e 2025.",
    },
    licencaMaternidade: {
      elegivel: false,
      contemplado: false,
      descricao: "Sem comprovação cadastrada para reserva especial.",
    },
  },
}

const cotas = [
  {
    tipo: "CNPq",
    quantidade: resultData.cnpq,
    status: "Concedida",
    observacao: "Distribuída primeiro, conforme ordem classificatória.",
  },
  {
    tipo: "UFPB",
    quantidade: resultData.ufpb,
    status: "Concedida",
    observacao: "Cota própria distribuída após cotas CNPq.",
  },
  {
    tipo: "Voluntário",
    quantidade: resultData.voluntarios,
    status: "Disponível",
    observacao: "Planos excedentes podem ser utilizados para indicação voluntária.",
  },
]

function calculateIFC(fppi: number, np: number) {
  return (fppi * 7 + np * 3) / 10
}

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
  variant?: "success" | "warning" | "danger" | "neutral"
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
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

function MetricCard({
  label,
  value,
  description,
  icon,
}: {
  label: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral">{label}</p>
        <div className="text-primary">{icon}</div>
      </div>

      <p className="mt-3 text-3xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs leading-5 text-neutral">{description}</p>
    </div>
  )
}

export default function CoordinatorProductionResult() {
  const ifc = calculateIFC(resultData.fppi, resultData.np)

  return (
    <>
      <Helmet>
        <title>Resultado e Classificação | Coordenador</title>
      </Helmet>

      <main className="min-h-screen bg-neutral-light">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <Link
                to="/coordenador/producao"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                <ArrowLeft size={16} />
                Voltar para Produção Intelectual
              </Link>
            </div>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Resultado & Classificação
                  </p>

                  <h1 className="mt-2 text-2xl font-bold text-primary">
                    Classificação do pesquisador
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                    Consulte o IFC calculado, a posição classificatória, as cotas
                    recebidas e a situação das reservas especiais previstas no edital.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="success">
                    {resultData.resultadoPreliminar.status}
                  </StatusBadge>
                  <StatusBadge variant="warning">
                    Resultado final pendente
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                <div className="grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                      Pesquisador
                    </p>
                    <p className="mt-1 font-semibold text-primary">
                      {resultData.pesquisador}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                      Edital
                    </p>
                    <p className="mt-1 font-semibold text-primary">
                      {resultData.edital}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                      Modalidade
                    </p>
                    <p className="mt-1 font-semibold text-primary">
                      {resultData.modalidade}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard
                label="FPPI"
                value={formatNumber(resultData.fppi)}
                description="Fator de Produtividade em Pesquisa Intelectual."
                icon={<Award size={18} />}
              />

              <MetricCard
                label="NP"
                value={formatNumber(resultData.np)}
                description="Nota do Projeto utilizada na composição do IFC."
                icon={<FileText size={18} />}
              />

              <MetricCard
                label="IFC"
                value={formatNumber(ifc)}
                description="[(FPPI × 7) + (NP × 3)] / 10."
                icon={<Trophy size={18} />}
              />

              <MetricCard
                label="Classificação na área"
                value={`${resultData.classificacaoArea}º`}
                description={`Classificação geral: ${resultData.classificacaoGeral}º lugar.`}
                icon={<Medal size={18} />}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
                <SectionTitle
                  icon={<Trophy size={18} />}
                  title="Cotas recebidas"
                  subtitle="Distribuição das cotas por tipo, conforme ordem classificatória."
                />

                <div className="overflow-hidden rounded-2xl border border-neutral/15">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-neutral">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Tipo</th>
                        <th className="px-4 py-3 font-semibold">Qtd.</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Observação</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral/10">
                      {cotas.map((cota) => (
                        <tr key={cota.tipo} className="bg-white">
                          <td className="px-4 py-4 font-semibold text-primary">
                            {cota.tipo}
                          </td>
                          <td className="px-4 py-4 text-neutral">
                            {cota.quantidade}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge
                              variant={
                                cota.status === "Concedida"
                                  ? "success"
                                  : "neutral"
                              }
                            >
                              {cota.status}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-4 text-neutral">
                            {cota.observacao}
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
                      Cada pesquisador pode receber até duas cotas de bolsa, observada
                      a classificação, o IFC e a disponibilidade de cotas. As cotas CNPq
                      são distribuídas antes das cotas UFPB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
                <SectionTitle
                  icon={<GraduationCap size={18} />}
                  title="Reservas especiais"
                  subtitle="Situação do pesquisador nas reservas previstas no edital."
                />

                <div className="space-y-4">
                  <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                        <GraduationCap size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-primary">
                            Recém-doutor
                          </p>

                          <StatusBadge
                            variant={
                              resultData.reservas.recemDoutor.elegivel
                                ? "success"
                                : "neutral"
                            }
                          >
                            {resultData.reservas.recemDoutor.elegivel
                              ? "Elegível"
                              : "Não elegível"}
                          </StatusBadge>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-neutral">
                          {resultData.reservas.recemDoutor.descricao}
                        </p>

                        <p className="mt-2 text-xs text-neutral">
                          Situação da reserva:{" "}
                          <strong className="text-primary">
                            {resultData.reservas.recemDoutor.contemplado
                              ? "contemplado"
                              : "não utilizada"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                        <Baby size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-primary">
                            Licença-maternidade/adotante
                          </p>

                          <StatusBadge
                            variant={
                              resultData.reservas.licencaMaternidade.elegivel
                                ? "success"
                                : "neutral"
                            }
                          >
                            {resultData.reservas.licencaMaternidade.elegivel
                              ? "Elegível"
                              : "Não elegível"}
                          </StatusBadge>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-neutral">
                          {resultData.reservas.licencaMaternidade.descricao}
                        </p>

                        <p className="mt-2 text-xs text-neutral">
                          Situação da reserva:{" "}
                          <strong className="text-primary">
                            {resultData.reservas.licencaMaternidade.contemplado
                              ? "contemplado"
                              : "não utilizada"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={<CalendarDays size={18} />}
                title="Resultado preliminar e resultado final"
                subtitle="Acompanhe a etapa atual do resultado e os prazos de recurso."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-primary">
                      Resultado preliminar
                    </p>
                    <StatusBadge variant="success">
                      {resultData.resultadoPreliminar.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-neutral">
                    <p>
                      <strong className="text-primary">Divulgação:</strong>{" "}
                      {resultData.resultadoPreliminar.dataDivulgacao}
                    </p>
                    <p>
                      <strong className="text-primary">Prazo de recurso:</strong>{" "}
                      {resultData.resultadoPreliminar.prazoRecurso}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-primary">
                      Resultado final
                    </p>
                    <StatusBadge variant="warning">
                      {resultData.resultadoFinal.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-neutral">
                    <p>
                      <strong className="text-primary">Previsão:</strong>{" "}
                      {resultData.resultadoFinal.previsao}
                    </p>
                    <p>
                      <strong className="text-primary">Consulta:</strong> site da
                      PROPESQ e SIGAA.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={<AlertCircle size={18} />}
                title="Recurso contra o resultado preliminar"
                subtitle="O recurso administrativo deve ser encaminhado via SIPAC dentro do prazo previsto."
              />

              <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Recurso disponível apenas no período definido no cronograma
                  </p>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-amber-800">
                    O edital prevê recurso administrativo contra o Resultado
                    Preliminar via SIPAC. Recursos sobre nota de projeto ou IPI seguem
                    os prazos específicos anteriores, quando aplicável.
                  </p>
                </div>

                <a
                  href="https://sipac.ufpb.br"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Abrir SIPAC
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={<CheckCircle2 size={18} />}
                title="Resumo da situação"
                subtitle="Leitura rápida da condição atual do pesquisador no edital."
              />

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    IFC mínimo
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {ifc >= 7 ? "Atendido" : "Não atendido"}
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Cotas remuneradas
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {resultData.cnpq + resultData.ufpb} cota(s)
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Reserva especial
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {resultData.reservas.recemDoutor.elegivel ||
                    resultData.reservas.licencaMaternidade.elegivel
                      ? "Possui elegibilidade"
                      : "Sem reserva ativa"}
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral/15 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral">
                    Etapa atual
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    Resultado preliminar
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}