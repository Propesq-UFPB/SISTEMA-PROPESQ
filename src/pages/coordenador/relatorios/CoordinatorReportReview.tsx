import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Mail,
  Send,
  User,
  XCircle,
} from "lucide-react";

type ReportStatus = "aprovado" | "pendente" | "ajustes" | "reprovado";

type ReportType = "Parcial" | "Final";

type ReportDecision = "aprovado" | "ajustes" | "reprovado" | "";

interface ReportSection {
  title: string;
  content: string;
}

interface CoordinatorReport {
  id: number;
  title: string;
  type: ReportType;
  status: ReportStatus;
  submittedAt: string;
  reviewedAt?: string;
  isDismissalCase: boolean;
  homologationFormUrl?: string;
  project: {
    title: string;
    edital: string;
    area: string;
    coordinator: string;
  };
  student: {
    name: string;
    registration: string;
    course: string;
    email: string;
  };
  workPlan: {
    title: string;
    modality: string;
    period: string;
  };
  sections: ReportSection[];
  review?: {
    reviewer: string;
    decision: ReportDecision;
    comment: string;
  };
}

const mockReport: CoordinatorReport = {
  id: 1,
  title: "Relatório Parcial de Atividades",
  type: "Parcial",
  status: "pendente",
  submittedAt: "10/05/2026",
  isDismissalCase: false,
  homologationFormUrl: "https://www.ufpb.br/propesq",
  project: {
    title: "Tradução Automática entre Português e Libras com Apoio de IA",
    edital: "PIBIC 2025/2026",
    area: "Ciência da Computação",
    coordinator: "Prof. Dr. João Almeida",
  },
  student: {
    name: "Maria Eduarda Santos",
    registration: "20230012345",
    course: "Ciência de Dados e Inteligência Artificial",
    email: "maria.santos@academico.ufpb.br",
  },
  workPlan: {
    title: "Modelagem e avaliação de representações visuais para sinais em Libras",
    modality: "Iniciação Científica",
    period: "2025 - 2026",
  },
  sections: [
    {
      title: "Resumo das atividades desenvolvidas",
      content:
        "Durante o período avaliado, foram realizadas atividades relacionadas ao levantamento bibliográfico, organização dos dados, estudo das técnicas de pré-processamento e construção inicial dos experimentos. Também foram conduzidas reuniões periódicas para acompanhamento das etapas previstas no plano de trabalho.",
    },
    {
      title: "Objetivos alcançados",
      content:
        "Foram alcançados os objetivos referentes à revisão da literatura, definição do pipeline experimental, organização preliminar da base de dados e implementação inicial dos módulos de processamento.",
    },
    {
      title: "Metodologia utilizada",
      content:
        "A metodologia envolveu análise bibliográfica, preparação dos dados, definição de critérios de avaliação e implementação computacional dos experimentos. As etapas foram conduzidas de forma incremental, com validação dos resultados parciais.",
    },
    {
      title: "Resultados parciais",
      content:
        "Os resultados parciais indicam avanço satisfatório em relação ao cronograma previsto, especialmente na estruturação da base experimental e na identificação de técnicas promissoras para continuidade da pesquisa.",
    },
    {
      title: "Dificuldades encontradas",
      content:
        "As principais dificuldades envolveram ajustes na padronização dos dados e definição dos critérios de avaliação mais adequados para comparação dos experimentos.",
    },
    {
      title: "Próximas etapas",
      content:
        "As próximas etapas incluem a finalização dos experimentos, análise quantitativa dos resultados, refinamento metodológico e preparação do relatório final.",
    },
  ],
};

const statusConfig: Record<
  ReportStatus,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  aprovado: {
    label: "Parecer emitido: aprovado",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={14} />,
  },
  pendente: {
    label: "Pendente de parecer",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <AlertCircle size={14} />,
  },
  ajustes: {
    label: "Parecer emitido: ajustes solicitados",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <AlertCircle size={14} />,
  },
  reprovado: {
    label: "Parecer emitido: reprovado",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },
};

const decisionOptions: Array<{
  value: Exclude<ReportDecision, "">;
  title: string;
  description: string;
}> = [
  {
    value: "aprovado",
    title: "Aprovar relatório",
    description:
      "A aprovação do orientador torna o relatório válido para fins de acompanhamento.",
  },
  {
    value: "ajustes",
    title: "Solicitar ajustes",
    description:
      "O relatório retorna para correção e ainda não deve ser considerado válido.",
  },
  {
    value: "reprovado",
    title: "Reprovar relatório",
    description:
      "O relatório não atende aos requisitos mínimos e não será validado.",
  },
];

export default function CoordinatorReportView() {
  const { id } = useParams();
  const [decision, setDecision] = useState<ReportDecision>("");
  const [opinion, setOpinion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const report = mockReport;

  const status = statusConfig[report.status];

  const isOpinionValid = opinion.trim().length >= 20;
  const canSubmit = decision !== "" && isOpinionValid;

  const selectedDecision = useMemo(() => {
    return decisionOptions.find((option) => option.value === decision);
  }, [decision]);

  function handleSubmitOpinion() {
    if (!canSubmit) return;

    setSubmitted(true);

    console.log({
      reportId: id ?? report.id,
      decision,
      opinion,
      validReport: decision === "aprovado",
    });
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* VOLTAR */}
          <div className="flex items-center justify-between">
            <Link
              to="/coordenador/relatorios"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para relatórios
            </Link>
          </div>

          {/* HEADER */}
          <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FileCheck2 size={14} />
                  Emitir parecer
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-primary md:text-3xl">
                    {report.title}
                  </h1>

                  <p className="max-w-3xl text-sm leading-6 text-neutral">
                    Consulte o relatório submetido pelo discente e registre o
                    parecer do orientador. A aprovação do orientador é
                    obrigatória para que o relatório seja considerado válido.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                    <ClipboardList size={14} />
                    Relatório {report.type}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                    <CalendarDays size={14} />
                    Enviado em {report.submittedAt}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ALERTA DE VALIDAÇÃO */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={20} />

              <div>
                <h2 className="text-sm font-semibold">
                  Aprovação obrigatória do orientador
                </h2>

                <p className="mt-1 text-sm leading-6">
                  O relatório só será considerado válido quando o orientador
                  registrar parecer textual e selecionar a decisão de aprovação.
                  Solicitação de ajustes ou reprovação não validam o relatório.
                </p>
              </div>
            </div>
          </section>

          {/* ALERTA DESLIGAMENTO */}
          {report.isDismissalCase && (
            <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-800">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 shrink-0" size={20} />

                  <div>
                    <h2 className="text-sm font-semibold">
                      Relatório vinculado a desligamento
                    </h2>

                    <p className="mt-1 max-w-3xl text-sm leading-6">
                      Em caso de desligamento, após a homologação do relatório,
                      envie o relatório homologado por meio do formulário externo.
                    </p>
                  </div>
                </div>

                <a
                  href={report.homologationFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-sm font-semibold text-orange-800 transition hover:border-orange-400 hover:bg-orange-100"
                >
                  Enviar relatório homologado
                  <ExternalLink size={15} />
                </a>
              </div>
            </section>
          )}

          {/* INFORMAÇÕES PRINCIPAIS */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* PROJETO */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">Projeto</h2>
                  <p className="text-xs text-neutral">
                    Informações vinculadas ao relatório
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Título" value={report.project.title} />
                <InfoItem label="Edital" value={report.project.edital} />
                <InfoItem label="Área" value={report.project.area} />
                <InfoItem
                  label="Coordenador"
                  value={report.project.coordinator}
                />
              </div>
            </div>

            {/* DISCENTE */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">Discente</h2>
                  <p className="text-xs text-neutral">
                    Dados do responsável pelo envio
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Nome" value={report.student.name} />
                <InfoItem
                  label="Matrícula"
                  value={report.student.registration}
                />
                <InfoItem label="Curso" value={report.student.course} />

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    E-mail
                  </span>

                  <a
                    href={`mailto:${report.student.email}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Mail size={14} />
                    {report.student.email}
                  </a>
                </div>
              </div>
            </div>

            {/* PLANO DE TRABALHO */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">
                    Plano de trabalho
                  </h2>
                  <p className="text-xs text-neutral">
                    Dados acadêmicos do plano
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Título" value={report.workPlan.title} />
                <InfoItem label="Modalidade" value={report.workPlan.modality} />
                <InfoItem label="Período" value={report.workPlan.period} />
                <InfoItem label="Tipo de relatório" value={report.type} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
            {/* CONTEÚDO DO RELATÓRIO */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-primary">
                    Relatório submetido pelo discente
                  </h2>

                  <p className="text-sm text-neutral">
                    Seções preenchidas pelo discente no relatório.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {report.sections.map((section, index) => (
                  <article
                    key={section.title}
                    className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-5"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>

                      <h3 className="text-sm font-bold text-primary">
                        {section.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-7 text-neutral">
                      {section.content}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* PARECER DO ORIENTADOR */}
            <aside className="space-y-6">
              <section className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ClipboardCheck size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Parecer do orientador
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Escolha uma decisão e registre o parecer textual.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {decisionOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`block cursor-pointer rounded-2xl border p-4 transition ${
                        decision === option.value
                          ? "border-primary bg-primary/5"
                          : "border-neutral/20 bg-white hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="decision"
                          value={option.value}
                          checked={decision === option.value}
                          onChange={() => setDecision(option.value)}
                          className="mt-1"
                        />

                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {option.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-neutral">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="mb-1.5 block text-sm font-semibold text-primary">
                    Parecer textual
                  </label>

                  <textarea
                    value={opinion}
                    onChange={(event) => setOpinion(event.target.value)}
                    rows={8}
                    placeholder="Digite o parecer do orientador..."
                    className="w-full resize-none rounded-2xl border border-neutral/30 bg-white px-4 py-3 text-sm leading-6 text-neutral outline-none transition placeholder:text-neutral/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                  />

                  <p className="mt-2 text-xs text-neutral">
                    O parecer textual deve ter pelo menos 20 caracteres.
                  </p>
                </div>

                {!canSubmit && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Para registrar o parecer, selecione uma decisão e preencha
                    o campo textual.
                  </div>
                )}

                {submitted && (
                  <div
                    className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                      decision === "aprovado"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-orange-200 bg-orange-50 text-orange-800"
                    }`}
                  >
                    <p className="font-semibold">
                      Parecer registrado: {selectedDecision?.title}
                    </p>

                    <p className="mt-1">
                      {decision === "aprovado"
                        ? "O relatório foi aprovado pelo orientador e pode ser considerado válido."
                        : "O relatório ainda não foi validado, pois não recebeu aprovação do orientador."}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmitOpinion}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  <Send size={16} />
                  Registrar parecer
                </button>
              </section>

              <section className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-primary">
                  Validação do relatório
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral">
                  A validade do relatório depende da aprovação do orientador.
                </p>

                <div className="mt-5 space-y-3">
                  <ValidationItem
                    checked
                    label="Relatório submetido pelo discente"
                  />

                  <ValidationItem
                    checked={isOpinionValid}
                    label="Parecer textual preenchido"
                  />

                  <ValidationItem
                    checked={decision === "aprovado"}
                    label="Aprovação do orientador"
                  />
                </div>
              </section>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wide text-neutral/70">
        {label}
      </span>

      <p className="mt-1 text-sm font-medium leading-6 text-neutral">
        {value}
      </p>
    </div>
  );
}

function ValidationItem({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {checked ? (
        <CheckCircle2 size={16} className="text-emerald-600" />
      ) : (
        <AlertCircle size={16} className="text-amber-600" />
      )}

      <span className={checked ? "font-medium text-primary" : "text-neutral"}>
        {label}
      </span>
    </div>
  );
}