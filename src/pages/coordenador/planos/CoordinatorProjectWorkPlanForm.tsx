// src/pages/coordenador/planos/CoordinatorProjectWorkPlanForm.tsx

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Filter,
  Hash,
  ListChecks,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react";

/* ================= TIPOS ================= */

type ProjectStatus =
  | "APROVADO"
  | "VALIDADO"
  | "SUBMETIDO"
  | "EM ANÁLISE"
  | "REPROVADO";

type WorkPlanModalidade = "PIBIC" | "PIBIC-AF" | "PIBITI" | "PIVIC" | "PIVITI";

type Project = {
  id: string;
  codigo: string;
  titulo: string;
  edital: string;
  coordenador: string;
  unidade: string;
  centro: string;
  periodo: string;
  status: ProjectStatus;
  modalidadeBolsa: WorkPlanModalidade;
  totalPlanos: number;
};

type CronogramaItem = {
  id: string;
  atividade: string;
  mesInicio: number;
  mesFim: number;
};

type WorkPlan = {
  id: string;
  modalidade: WorkPlanModalidade | "";
  titulo: string;
  title: string;
  solicitarAcaoAfirmativa: boolean;
  periodoIni: string;
  periodoFim: string;
  introducaoJustificativa: string;
  objetivos: string;
  metodologia: string;
  cronogramaAtividades: CronogramaItem[];
  referencias: string;
};

/* ================= CONSTANTES ================= */

const MAX_PLANOS_POR_ANO = 6;
const MAX_CHARS_ANEXO_II = 9000;
const PROJECT_ALLOWED_STATUSES: ProjectStatus[] = ["APROVADO", "VALIDADO"];

const modalidadesPlano: WorkPlanModalidade[] = [
  "PIBIC",
  "PIBIC-AF",
  "PIBITI",
  "PIVIC",
  "PIVITI",
];

const modalidadesFiltro = ["Todas", ...modalidadesPlano] as const;

/* ================= MOCKS ================= */

const projectsMock: Project[] = [
  {
    id: "1",
    codigo: "PROPESQ-2026-001",
    titulo: "Sistema inteligente para acompanhamento de projetos de pesquisa",
    edital: "PIBIC 2026",
    coordenador: "Profa. Mariana Silva",
    unidade: "Departamento A",
    centro: "CCEN",
    periodo: "2026-08-01 → 2027-07-31",
    status: "APROVADO",
    modalidadeBolsa: "PIBIC",
    totalPlanos: 1,
  },
  {
    id: "2",
    codigo: "PROPESQ-2026-014",
    titulo: "Aplicação de visão computacional em ambientes educacionais",
    edital: "PIBITI 2026",
    coordenador: "Prof. João Pereira",
    unidade: "Laboratório X",
    centro: "CT",
    periodo: "2026-08-01 → 2027-07-31",
    status: "VALIDADO",
    modalidadeBolsa: "PIBITI",
    totalPlanos: 2,
  },
  {
    id: "3",
    codigo: "PROPESQ-2026-027",
    titulo:
      "Estudo interdisciplinar sobre acessibilidade e tecnologia assistiva",
    edital: "PIVIC 2026",
    coordenador: "Profa. Ana Costa",
    unidade: "Programa Y",
    centro: "CCHLA",
    periodo: "2026-08-01 → 2027-07-31",
    status: "SUBMETIDO",
    modalidadeBolsa: "PIVIC",
    totalPlanos: 1,
  },
];

const initialPlansByProject: Record<string, WorkPlan[]> = {
  "1": [
    {
      id: "plano-existente-1",
      modalidade: "PIBIC",
      titulo: "Análise de requisitos e validação do sistema de acompanhamento",
      title: "Requirements Analysis and Validation of the Monitoring System",
      solicitarAcaoAfirmativa: true,
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      introducaoJustificativa:
        "Plano previamente cadastrado no fluxo inicial de submissão do projeto.",
      objetivos:
        "Acompanhar e executar atividades de pesquisa vinculadas ao projeto principal.",
      metodologia:
        "Execução orientada por reuniões periódicas, levantamento bibliográfico e desenvolvimento incremental.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-1",
          atividade: "Revisão bibliográfica e alinhamento metodológico.",
          mesInicio: 1,
          mesFim: 1,
        },
        {
          id: "cronograma-existente-2",
          atividade: "Definição dos instrumentos e organização dos dados.",
          mesInicio: 2,
          mesFim: 2,
        },
      ],
      referencias: "Referências cadastradas no plano inicial.",
    },
  ],
  "2": [
    {
      id: "plano-existente-2",
      modalidade: "PIBITI",
      titulo:
        "Prototipação de módulos computacionais para ambientes educacionais",
      title: "Prototyping Computational Modules for Educational Environments",
      solicitarAcaoAfirmativa: true,
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      introducaoJustificativa: "Plano cadastrado no fluxo inicial.",
      objetivos: "Desenvolver e validar componentes tecnológicos do projeto.",
      metodologia: "Prototipação, testes e análise dos resultados.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-3",
          atividade: "Levantamento de requisitos e revisão técnica.",
          mesInicio: 1,
          mesFim: 1,
        },
      ],
      referencias: "Referências técnicas do projeto.",
    },
    {
      id: "plano-existente-3",
      modalidade: "PIBITI",
      titulo: "Avaliação experimental de modelos de visão computacional",
      title: "Experimental Evaluation of Computer Vision Models",
      solicitarAcaoAfirmativa: false,
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      introducaoJustificativa: "Plano complementar já cadastrado.",
      objetivos: "Apoiar experimentos computacionais.",
      metodologia: "Implementação incremental e avaliação empírica.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-4",
          atividade: "Preparação do ambiente e bases de teste.",
          mesInicio: 1,
          mesFim: 1,
        },
      ],
      referencias: "Referências complementares.",
    },
  ],
};

const emptyWorkPlan: WorkPlan = {
  id: "",
  modalidade: "",
  titulo: "",
  title: "",
  solicitarAcaoAfirmativa: false,
  periodoIni: "",
  periodoFim: "",
  introducaoJustificativa: "",
  objetivos: "",
  metodologia: "",
  cronogramaAtividades: [],
  referencias: "",
};

/* ================= UTIL/UI ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10";

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatCronogramaDuration(mesInicio: number, mesFim: number) {
  if (mesInicio === mesFim) return `Mês ${mesInicio}`;

  return `Mês ${mesInicio} ao mês ${mesFim}`;
}

function createEmptyDraft() {
  return {
    ...emptyWorkPlan,
    id: createId("plano"),
  };
}

function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  );
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral/20 px-6 py-4">
        {icon}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
  preWrap,
}: {
  label: string;
  value: string;
  preWrap?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-neutral">{label}</p>

      <p
        className={cx("text-sm text-neutral", preWrap && "whitespace-pre-wrap")}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function CharacterCounter({ value }: { value: string }) {
  const remaining = MAX_CHARS_ANEXO_II - value.length;
  const nearLimit = remaining <= 500;

  return (
    <p
      className={cx(
        "text-right text-[11px]",
        nearLimit ? "font-semibold text-amber-700" : "text-neutral",
      )}
    >
      {value.length}/{MAX_CHARS_ANEXO_II} caracteres
    </p>
  );
}

function AnexoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_CHARS_ANEXO_II}
        className={textareaClassName}
        placeholder={placeholder}
      />

      <CharacterCounter value={value} />
    </div>
  );
}

/* ================= PÁGINA ================= */

export default function CoordinatorProjectWorkPlanForm() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [plansByProject, setPlansByProject] = useState<
    Record<string, WorkPlan[]>
  >(initialPlansByProject);

  const [draft, setDraft] = useState<WorkPlan>(createEmptyDraft());
  const [cronogramaAtividade, setCronogramaAtividade] = useState("");
  const [cronogramaMesInicio, setCronogramaMesInicio] = useState(1);
  const [cronogramaMesFim, setCronogramaMesFim] = useState(1);

  const [filters, setFilters] = useState({
    codigo: "",
    nome: "",
    modalidade: "Todas",
  });

  const selectedProject = useMemo(() => {
    return (
      projectsMock.find((project) => project.id === selectedProjectId) || null
    );
  }, [selectedProjectId]);

  const existingPlans = selectedProject
    ? plansByProject[selectedProject.id] || []
    : [];

  const selectedProjectYear = useMemo(() => {
    if (!selectedProject) return "";

    const editalYear = selectedProject.edital.match(/\d{4}/)?.[0];
    const codigoYear = selectedProject.codigo.match(/\d{4}/)?.[0];
    const periodoYear = selectedProject.periodo.match(/\d{4}/)?.[0];

    return editalYear || codigoYear || periodoYear || "";
  }, [selectedProject]);

  const totalPlanosCoordenadorNoAno = useMemo(() => {
    if (!selectedProject || !selectedProjectYear) return 0;

    return projectsMock
      .filter((project) => {
        const projectYear =
          project.edital.match(/\d{4}/)?.[0] ||
          project.codigo.match(/\d{4}/)?.[0] ||
          project.periodo.match(/\d{4}/)?.[0] ||
          "";

        return (
          project.coordenador === selectedProject.coordenador &&
          projectYear === selectedProjectYear
        );
      })
      .reduce((total, project) => {
        return (
          total + (plansByProject[project.id]?.length || project.totalPlanos)
        );
      }, 0);
  }, [plansByProject, selectedProject, selectedProjectYear]);

  const limitePlanosAtingido =
    totalPlanosCoordenadorNoAno >= MAX_PLANOS_POR_ANO;

  const duracaoPeriodoMeses = useMemo(() => {
    if (!draft.periodoIni || !draft.periodoFim) return 0;

    const inicio = new Date(`${draft.periodoIni}T00:00:00`);
    const fim = new Date(`${draft.periodoFim}T00:00:00`);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return 0;
    if (fim < inicio) return 0;

    const meses =
      (fim.getFullYear() - inicio.getFullYear()) * 12 +
      (fim.getMonth() - inicio.getMonth()) +
      1;

    return Math.max(1, meses);
  }, [draft.periodoFim, draft.periodoIni]);

  const mesesCronogramaDisponiveis = useMemo(() => {
    return Array.from({ length: duracaoPeriodoMeses }, (_, index) => index + 1);
  }, [duracaoPeriodoMeses]);

  const filteredProjects = useMemo(() => {
    const codigo = filters.codigo.trim().toLowerCase();
    const nome = filters.nome.trim().toLowerCase();
    const modalidade = filters.modalidade;

    return projectsMock.filter((project) => {
      const statusPermitido = PROJECT_ALLOWED_STATUSES.includes(project.status);

      const matchCodigo = codigo
        ? project.codigo.toLowerCase().includes(codigo)
        : true;

      const matchNome = nome
        ? project.titulo.toLowerCase().includes(nome)
        : true;

      const matchModalidade =
        modalidade === "Todas" ? true : project.modalidadeBolsa === modalidade;

      return statusPermitido && matchCodigo && matchNome && matchModalidade;
    });
  }, [filters]);

  const canAddCronogramaItem = Boolean(
    cronogramaAtividade.trim() &&
      duracaoPeriodoMeses > 0 &&
      cronogramaMesInicio >= 1 &&
      cronogramaMesFim >= cronogramaMesInicio &&
      cronogramaMesFim <= duracaoPeriodoMeses,
  );

  const cronogramaDentroDoPeriodo = useMemo(() => {
    if (duracaoPeriodoMeses === 0) return false;

    return draft.cronogramaAtividades.every(
      (item) =>
        item.mesInicio >= 1 &&
        item.mesFim >= item.mesInicio &&
        item.mesFim <= duracaoPeriodoMeses,
    );
  }, [draft.cronogramaAtividades, duracaoPeriodoMeses]);

  const canSavePlan = useMemo(() => {
    return Boolean(
      selectedProject &&
      !limitePlanosAtingido &&
      draft.modalidade &&
      draft.titulo.trim() &&
      draft.title.trim() &&
      draft.periodoIni &&
      draft.periodoFim &&
      draft.introducaoJustificativa.trim() &&
      draft.objetivos.trim() &&
      draft.metodologia.trim() &&
      draft.cronogramaAtividades.length > 0 &&
      cronogramaDentroDoPeriodo &&
      draft.referencias.trim(),
    );
  }, [cronogramaDentroDoPeriodo, draft, limitePlanosAtingido, selectedProject]);

  function resetDraft() {
    setDraft(createEmptyDraft());
    setCronogramaAtividade("");
    setCronogramaMesInicio(1);
    setCronogramaMesFim(1);
    setSaved(false);
  }

  function clearFilters() {
    setFilters({
      codigo: "",
      nome: "",
      modalidade: "Todas",
    });
  }

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    resetDraft();
  }

  function duplicateLastPlan() {
    const lastPlan = existingPlans[existingPlans.length - 1];
    if (!lastPlan) return;

    setDraft({
      ...lastPlan,
      id: createId("plano"),
      titulo: "",
      title: "",
      solicitarAcaoAfirmativa: false,
      cronogramaAtividades: lastPlan.cronogramaAtividades.map((item) => ({
        ...item,
        id: createId("cronograma"),
      })),
    });

    setSaved(false);
  }

  function addCronogramaItem() {
    if (!canAddCronogramaItem) return;

    setDraft((current) => ({
      ...current,
      cronogramaAtividades: [
        ...current.cronogramaAtividades,
        {
          id: createId("cronograma"),
          atividade: cronogramaAtividade.trim(),
          mesInicio: cronogramaMesInicio,
          mesFim: cronogramaMesFim,
        },
      ],
    }));

    setCronogramaAtividade("");
    setCronogramaMesInicio(1);
    setCronogramaMesFim(1);
    setSaved(false);
  }

  function removeCronogramaItem(cronogramaId: string) {
    setDraft((current) => ({
      ...current,
      cronogramaAtividades: current.cronogramaAtividades.filter(
        (item) => item.id !== cronogramaId,
      ),
    }));

    setSaved(false);
  }


  async function savePlan() {
    if (!selectedProject || !canSavePlan) return;

    setSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      setPlansByProject((current) => ({
        ...current,
        [selectedProject.id]: [
          ...(current[selectedProject.id] || []),
          {
            ...draft,
            id: draft.id || createId("plano"),
          },
        ],
      }));

      setSaved(true);
      setDraft(createEmptyDraft());
      setCronogramaAtividade("");
      setCronogramaMesInicio(1);
    setCronogramaMesFim(1);
    } finally {
      setSaving(false);
    }
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

        <section className="flex flex-col gap-4 rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <BookOpen size={14} />
              Planos de trabalho
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Adicionar plano de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Selecione um projeto aprovado ou validado e cadastre o plano com
              os campos exigidos pelo Anexo II. O sistema limita até{" "}
              {MAX_PLANOS_POR_ANO} planos por coordenador a cada ano.
            </p>
          </div>

          <div className="flex w-fit flex-col gap-2 rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-3">
            <span className="text-[11px] font-bold uppercase text-neutral">
              Projeto selecionado
            </span>

            <span className="text-sm font-bold text-primary">
              {selectedProject ? selectedProject.codigo : "Nenhum"}
            </span>
          </div>
        </section>

        <Card
          title="Selecionar projeto"
          subtitle="Apenas projetos com status aprovado ou validado são exibidos para vinculação."
          icon={<Search size={18} className="text-primary" />}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr_240px_auto]">
            <Field label="Código do projeto">
              <input
                value={filters.codigo}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    codigo: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Ex.: PROPESQ-2026-001"
              />
            </Field>

            <Field label="Nome do projeto">
              <input
                value={filters.nome}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Digite parte do título"
              />
            </Field>

            <Field label="Modalidade">
              <select
                value={filters.modalidade}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    modalidade: event.target.value,
                  }))
                }
                className={selectClassName}
              >
                {modalidadesFiltro.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
              >
                <Filter size={16} />
                Limpar
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral/20">
            <div className="grid grid-cols-12 gap-3 border-b border-neutral/20 bg-neutral/5 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral">
              <span className="col-span-3">Código</span>
              <span className="col-span-4">Projeto</span>
              <span className="col-span-2">Modalidade</span>
              <span className="col-span-2">Planos</span>
              <span className="col-span-1 text-right">Ação</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm font-semibold text-primary">
                  Nenhum projeto aprovado ou validado encontrado.
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Ajuste os filtros ou verifique o status dos projetos.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral/20">
                {filteredProjects.map((project) => {
                  const selected = project.id === selectedProjectId;
                  const totalPlanos =
                    plansByProject[project.id]?.length || project.totalPlanos;
                  return (
                    <div
                      key={project.id}
                      className={cx(
                        "grid grid-cols-12 gap-3 px-4 py-4 text-sm transition",
                        selected
                          ? "bg-primary/5"
                          : "bg-white hover:bg-neutral/5",
                      )}
                    >
                      <div className="col-span-3">
                        <p className="font-bold text-primary">
                          {project.codigo}
                        </p>
                        <p className="mt-1 text-xs text-neutral">
                          {project.edital}
                        </p>
                        <span className="mt-2 inline-flex rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                          {project.status}
                        </span>
                      </div>

                      <div className="col-span-4">
                        <p className="font-semibold text-primary">
                          {project.titulo}
                        </p>
                        <p className="mt-1 text-xs text-neutral">
                          {project.centro} • {project.unidade}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-start">
                        <span className="inline-flex rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-xs font-bold text-neutral">
                          {project.modalidadeBolsa}
                        </span>
                      </div>

                      <div className="col-span-2 text-neutral">
                        <p className="font-semibold text-primary">
                          {totalPlanos}
                        </p>
                        <p className="mt-1 text-xs">
                          vinculado(s) neste projeto
                        </p>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => selectProject(project.id)}
                          className={cx(
                            "inline-flex h-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
                            selected
                              ? "bg-primary text-white"
                              : "border border-neutral/20 bg-white text-primary hover:border-primary/30",
                          )}
                        >
                          {selected ? (
                            <>
                              <Check size={14} />
                              Selecionado
                            </>
                          ) : (
                            "Selecionar"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {selectedProject ? (
          <>
            <Card
              title="Projeto vinculado"
              subtitle="O plano de trabalho será vinculado ao projeto abaixo."
              icon={<FileText size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Info label="Título" value={selectedProject.titulo} />
                </div>

                <Info label="Código" value={selectedProject.codigo} />
                <Info label="Status" value={selectedProject.status} />
                <Info label="Edital" value={selectedProject.edital} />
                <Info
                  label="Modalidade"
                  value={selectedProject.modalidadeBolsa}
                />
                <Info label="Coordenador" value={selectedProject.coordenador} />
                <Info
                  label="Uso anual do coordenador"
                  value={`${totalPlanosCoordenadorNoAno}/${MAX_PLANOS_POR_ANO} planos em ${selectedProjectYear || "ano vigente"}`}
                />
                <Info label="Período" value={selectedProject.periodo} />
                <Info label="Centro" value={selectedProject.centro} />
                <Info label="Unidade" value={selectedProject.unidade} />
              </div>
            </Card>

            <Card
              title="Planos já vinculados"
              subtitle={`Planos já vinculados a este projeto. Regra geral: até ${MAX_PLANOS_POR_ANO} planos por coordenador no ano.`}
              icon={<ListChecks size={18} className="text-primary" />}
            >
              {existingPlans.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-4 text-center">
                  <p className="text-sm font-semibold text-primary">
                    Nenhum plano vinculado a este projeto.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingPlans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="rounded-xl border border-neutral/20 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            Plano de trabalho {index + 1}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-primary">
                            {plan.titulo}
                          </p>

                          <p className="mt-1 text-xs text-neutral">
                            {plan.title}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                              <BookOpen size={12} />
                              {plan.modalidade}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                              <CalendarDays size={12} />
                              {plan.periodoIni} → {plan.periodoFim}
                            </span>

                            {plan.solicitarAcaoAfirmativa && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                                <Hash size={12} />
                                Solicita ação afirmativa
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          <Check size={13} />
                          Vinculado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card
              title="Novo plano de trabalho"
              subtitle="Preencha os campos exigidos pelo Anexo II."
              icon={<Plus size={18} className="text-primary" />}
            >
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-primary">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-bold">Regras do cadastro</p>

                  <p className="mt-1 text-xs leading-5 text-neutral">
                    Este coordenador possui {totalPlanosCoordenadorNoAno}/
                    {MAX_PLANOS_POR_ANO} planos no ano{" "}
                    {selectedProjectYear || "vigente"}. O limite é anual por
                    coordenador, independentemente do projeto selecionado.
                  </p>
                </div>
              </div>

              {limitePlanosAtingido && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-800">
                    Limite de planos atingido.
                  </p>

                  <p className="mt-1 text-xs text-red-800/80">
                    Não é possível adicionar mais planos para este coordenador
                    no ano
                    {selectedProjectYear || "vigente"}, pois o limite de{" "}
                    {MAX_PLANOS_POR_ANO} planos anuais já foi alcançado.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Dados do plano
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Os campos marcados com asterisco são obrigatórios.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={duplicateLastPlan}
                    disabled={
                      existingPlans.length === 0 || limitePlanosAtingido
                    }
                    className={cx(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                      existingPlans.length === 0 || limitePlanosAtingido
                        ? "cursor-not-allowed border-neutral/10 bg-neutral/10 text-neutral"
                        : "border-neutral/20 bg-white text-primary hover:border-primary/30",
                    )}
                  >
                    <Copy size={14} />
                    Duplicar estrutura
                  </button>

                  <button
                    type="button"
                    onClick={resetDraft}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                  >
                    <RefreshCcw size={14} />
                    Limpar
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Modalidade" required>
                  <select
                    value={draft.modalidade}
                    disabled={limitePlanosAtingido}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        modalidade: event.target.value as WorkPlanModalidade,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {modalidadesPlano.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Solicitar Ação Afirmativa"
                  hint="Marque esta opção quando desejar solicitar ação afirmativa para o plano."
                >
                  <label
                    className={cx(
                      "flex min-h-[42px] items-center gap-3 rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary",
                      limitePlanosAtingido && "opacity-60",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={draft.solicitarAcaoAfirmativa}
                      disabled={limitePlanosAtingido}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          solicitarAcaoAfirmativa: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-neutral/30 text-primary focus:ring-primary"
                    />

                    <span className="font-semibold">
                      Solicitar ação afirmativa para este plano
                    </span>
                  </label>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Título" required>
                    <input
                      value={draft.titulo}
                      disabled={limitePlanosAtingido}
                      maxLength={MAX_CHARS_ANEXO_II}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          titulo: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Digite o título do plano"
                    />

                    <CharacterCounter value={draft.titulo} />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Title" required>
                    <input
                      value={draft.title}
                      disabled={limitePlanosAtingido}
                      maxLength={MAX_CHARS_ANEXO_II}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Enter the work plan title in English"
                    />

                    <CharacterCounter value={draft.title} />
                  </Field>
                </div>

                <Field
                  label="Período"
                  required
                  hint="Defina início e fim do plano."
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="date"
                      value={draft.periodoIni}
                      disabled={limitePlanosAtingido}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          periodoIni: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />

                    <input
                      type="date"
                      value={draft.periodoFim}
                      disabled={limitePlanosAtingido}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          periodoFim: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />
                  </div>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Introdução / justificativa" required>
                    <AnexoTextarea
                      value={draft.introducaoJustificativa}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          introducaoJustificativa: value,
                        }))
                      }
                      placeholder="Apresente o contexto do plano e a justificativa da atividade."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Objetivos" required>
                    <AnexoTextarea
                      value={draft.objetivos}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          objetivos: value,
                        }))
                      }
                      placeholder="Informe os objetivos gerais e específicos do plano."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Metodologia" required>
                    <AnexoTextarea
                      value={draft.metodologia}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          metodologia: value,
                        }))
                      }
                      placeholder="Descreva os procedimentos, métodos e etapas de execução."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Cronograma"
                    required
                    hint="Informe a atividade, selecione o mês de início e o mês de fim dentro do período definido para o plano."
                  >
                    <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
                      {duracaoPeriodoMeses === 0 && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                          <p className="text-xs font-semibold text-amber-800">
                            Informe primeiro o período do plano para liberar o
                            cronograma.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_170px_170px_auto]">
                        <input
                          value={cronogramaAtividade}
                          disabled={
                            limitePlanosAtingido || duracaoPeriodoMeses === 0
                          }
                          maxLength={MAX_CHARS_ANEXO_II}
                          onChange={(event) =>
                            setCronogramaAtividade(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addCronogramaItem();
                            }
                          }}
                          className={inputClassName}
                          placeholder="Atividade"
                        />

                        <select
                          value={cronogramaMesInicio}
                          disabled={
                            limitePlanosAtingido || duracaoPeriodoMeses === 0
                          }
                          onChange={(event) => {
                            const nextMesInicio = Number(event.target.value);
                            setCronogramaMesInicio(nextMesInicio);

                            if (cronogramaMesFim < nextMesInicio) {
                              setCronogramaMesFim(nextMesInicio);
                            }
                          }}
                          className={selectClassName}
                        >
                          {mesesCronogramaDisponiveis.map((mes) => (
                            <option key={mes} value={mes}>
                              Início: mês {mes}
                            </option>
                          ))}
                        </select>

                        <select
                          value={cronogramaMesFim}
                          disabled={
                            limitePlanosAtingido || duracaoPeriodoMeses === 0
                          }
                          onChange={(event) =>
                            setCronogramaMesFim(Number(event.target.value))
                          }
                          className={selectClassName}
                        >
                          {mesesCronogramaDisponiveis
                            .filter((mes) => mes >= cronogramaMesInicio)
                            .map((mes) => (
                              <option key={mes} value={mes}>
                                Fim: mês {mes}
                              </option>
                            ))}
                        </select>

                        <button
                          type="button"
                          onClick={addCronogramaItem}
                          disabled={
                            !canAddCronogramaItem || limitePlanosAtingido
                          }
                          className={cx(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                            canAddCronogramaItem && !limitePlanosAtingido
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "cursor-not-allowed bg-neutral/10 text-neutral",
                          )}
                        >
                          <Plus size={16} />
                          Adicionar
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] text-neutral">
                        A duração deve ficar entre o mês 1 e o mês {duracaoPeriodoMeses || 0},
                        conforme o período informado para o plano.
                      </p>

                      {draft.cronogramaAtividades.length > 0 &&
                        !cronogramaDentroDoPeriodo && (
                          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                            <p className="text-xs font-semibold text-red-800">
                              Há atividade fora do período do plano. Ajuste o
                              mês de início ou fim para conseguir salvar.
                            </p>
                          </div>
                        )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft((current) => ({
                              ...current,
                              cronogramaAtividades: [],
                            }));
                            setSaved(false);
                          }}
                          disabled={
                            draft.cronogramaAtividades.length === 0 ||
                            limitePlanosAtingido
                          }
                          className={cx(
                            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                            draft.cronogramaAtividades.length === 0 ||
                              limitePlanosAtingido
                              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                              : "border-neutral/20 bg-white text-primary hover:border-primary/30",
                          )}
                        >
                          <RefreshCcw size={14} />
                          Limpar cronograma
                        </button>
                      </div>

                      <div className="mt-4 space-y-2">
                        {draft.cronogramaAtividades.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-neutral/30 bg-white p-4 text-center">
                            <p className="text-sm font-semibold text-primary">
                              Nenhuma atividade adicionada ao cronograma.
                            </p>

                            <p className="mt-1 text-xs text-neutral">
                              Informe a atividade, selecione a duração e clique
                              em adicionar.
                            </p>
                          </div>
                        ) : (
                          draft.cronogramaAtividades.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
                            >
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-neutral">
                                  {formatCronogramaDuration(
                                    item.mesInicio,
                                    item.mesFim,
                                  )}
                                </p>

                                <p className="mt-1 text-sm leading-6 text-primary">
                                  {item.atividade}
                                </p>
                              </div>

                              <button
                                type="button"
                                disabled={limitePlanosAtingido}
                                onClick={() => removeCronogramaItem(item.id)}
                                className={cx(
                                  "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                                  limitePlanosAtingido
                                    ? "cursor-not-allowed border-neutral/10 bg-neutral/10 text-neutral"
                                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                                )}
                              >
                                <Trash2 size={14} />
                                Remover
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Referências" required>
                    <AnexoTextarea
                      value={draft.referencias}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          referencias: value,
                        }))
                      }
                      placeholder="Informe as referências bibliográficas do plano."
                    />
                  </Field>
                </div>
              </div>

              {saved && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-800">
                    Plano adicionado com sucesso!
                  </p>

                  <p className="mt-1 text-xs text-green-800/80">
                    O novo plano foi vinculado ao projeto selecionado.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={resetDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  Limpar formulário
                </button>

                <button
                  type="button"
                  onClick={savePlan}
                  disabled={saving || !canSavePlan}
                  className={cx(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    saving || !canSavePlan
                      ? "cursor-not-allowed bg-neutral/10 text-neutral"
                      : "bg-primary text-white hover:bg-primary/90",
                  )}
                >
                  <Save size={16} />
                  {saving ? "Salvando..." : "Adicionar plano ao projeto"}
                </button>
              </div>
            </Card>
          </>
        ) : (
          <Card
            title="Nenhum projeto selecionado"
            subtitle="Selecione um projeto aprovado ou validado na lista acima para liberar o formulário."
            icon={<AlertCircle size={18} className="text-primary" />}
          >
            <div className="rounded-2xl border border-dashed border-neutral/30 bg-neutral/5 p-6 text-center">
              <p className="text-sm font-semibold text-primary">
                O formulário de plano de trabalho será exibido após a seleção do
                projeto.
              </p>

              <p className="mt-1 text-xs text-neutral">
                A vinculação do novo plano será feita com base no projeto
                selecionado nesta página.
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-center pt-2">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-neutral/5"
          >
            Voltar para lista de projetos
          </Link>
        </div>
      </div>
    </main>
  );
}
