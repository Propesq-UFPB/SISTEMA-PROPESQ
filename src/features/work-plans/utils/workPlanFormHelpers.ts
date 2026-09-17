import { projectService } from "@/features/projects/api/projectService";
import type { ResearchProject } from "@/features/projects/types/project";
import { workPlanService } from "@/features/work-plans/api/workPlanService";
import type {
  CreateWorkPlanPayload,
  WorkPlan as ApiWorkPlan,
} from "@/features/work-plans/types/workPlan";
import type {
  CronogramaItem,
  ProjectFilters,
  ProjectStatus,
  SelectableProject,
  WorkPlanDraft,
  WorkPlanModalidade,
} from "@/features/work-plans/types/coordinatorWorkPlanForm";
import { ApiError } from "@/services/apiClient";

export const MAX_CHARS_ANEXO_II = 9000;

export const PROJECT_ALLOWED_STATUSES = new Set<ProjectStatus>([
  "APROVADO",
  "VALIDADO",
]);

export const modalidadesPlano: WorkPlanModalidade[] = [
  "PIBIC",
  "PIBIC-AF",
  "PIBITI",
  "PIVIC",
  "PIVITI",
];

export const modalidadesFiltro = ["Todas", ...modalidadesPlano] as const;

export const emptyWorkPlanDraft: WorkPlanDraft = {
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

export function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function formatCronogramaDuration(mesInicio: number, mesFim: number) {
  if (mesInicio === mesFim) return `Mês ${mesInicio}`;
  return `Mês ${mesInicio} ao mês ${mesFim}`;
}

export function createEmptyDraft(): WorkPlanDraft {
  return {
    ...emptyWorkPlanDraft,
    id: createId("plano"),
  };
}

export function mapProject(project: ResearchProject): SelectableProject {
  return {
    id: String(project.id),
    codigo: project.codigo || `PROJETO-${project.id}`,
    titulo: project.titulo,
    edital: "Edital não informado",
    coordenador: "Usuário autenticado",
    unidade: project.unidade || "Unidade não informada",
    centro: project.unidade || "Centro não informado",
    periodo:
      project.vigencia ||
      [project.data_inicio, project.data_fim].filter(Boolean).join(" → "),
    status: (project.situacao || "APROVADO") as ProjectStatus,
    modalidadeBolsa: "PIBIC",
    totalPlanos: 0,
  };
}

export function mapApiPlan(plan: ApiWorkPlan): WorkPlanDraft {
  const body = plan.corpo_plano_trabalho;
  return {
    id: String(plan.id),
    modalidade: (plan.modalidade || "") as WorkPlanModalidade | "",
    titulo: body?.titulo || `Plano de trabalho ${plan.id}`,
    title: body?.titulo || "",
    solicitarAcaoAfirmativa: plan.direcionamento_plano === "ACAO_AFIRMATIVA",
    periodoIni: "",
    periodoFim: "",
    introducaoJustificativa: body?.introducao || "",
    objetivos: body?.objetivos || "",
    metodologia: body?.metodologia || "",
    cronogramaAtividades: (plan.atividades || []).map((activity, index) => ({
      id: String(activity.id ?? `atividade-${index}`),
      atividade: activity.descricao,
      mesInicio: 1,
      mesFim: Math.max(1, activity.meses?.length || 1),
    })),
    referencias: body?.referencias || "",
  };
}

export function monthDates(
  periodStart: string,
  startMonth: number,
  endMonth: number,
) {
  const start = new Date(`${periodStart}T00:00:00`);
  if (Number.isNaN(start.getTime())) return [];

  return Array.from({ length: endMonth - startMonth + 1 }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth() + startMonth - 1 + index,
      1,
    );
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return { data: `${year}-${month}-01` };
  });
}

export function groupWorkPlansByProject(
  plans: ApiWorkPlan[],
): Record<string, WorkPlanDraft[]> {
  return plans.reduce<Record<string, WorkPlanDraft[]>>((accumulator, plan) => {
    const projectId = String(
      plan.pesquisa_id ?? plan.projeto_pesquisa?.id ?? "",
    );
    if (!projectId) return accumulator;

    accumulator[projectId] = [
      ...(accumulator[projectId] || []),
      mapApiPlan(plan),
    ];
    return accumulator;
  }, {});
}

export function matchesProjectFilters(
  project: SelectableProject,
  filters: ProjectFilters,
): boolean {
  if (!PROJECT_ALLOWED_STATUSES.has(project.status)) return false;

  const codigo = filters.codigo.trim().toLowerCase();
  const nome = filters.nome.trim().toLowerCase();

  if (codigo && !project.codigo.toLowerCase().includes(codigo)) return false;
  if (nome && !project.titulo.toLowerCase().includes(nome)) return false;
  if (
    filters.modalidade !== "Todas" &&
    project.modalidadeBolsa !== filters.modalidade
  ) {
    return false;
  }

  return true;
}

export function computeDuracaoPeriodoMeses(
  periodoIni: string,
  periodoFim: string,
): number {
  if (!periodoIni || !periodoFim) return 0;

  const inicio = new Date(`${periodoIni}T00:00:00`);
  const fim = new Date(`${periodoFim}T00:00:00`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return 0;
  if (fim < inicio) return 0;

  const meses =
    (fim.getFullYear() - inicio.getFullYear()) * 12 +
    (fim.getMonth() - inicio.getMonth()) +
    1;

  return Math.max(1, meses);
}

export function isCronogramaDentroDoPeriodo(
  items: CronogramaItem[],
  duracaoPeriodoMeses: number,
): boolean {
  if (duracaoPeriodoMeses === 0) return false;

  return items.every(
    (item) =>
      item.mesInicio >= 1 &&
      item.mesFim >= item.mesInicio &&
      item.mesFim <= duracaoPeriodoMeses,
  );
}

export function isDraftReadyToSave(
  draft: WorkPlanDraft,
  hasProject: boolean,
  cronogramaOk: boolean,
): boolean {
  return Boolean(
    hasProject &&
      draft.modalidade &&
      draft.titulo.trim() &&
      draft.title.trim() &&
      draft.periodoIni &&
      draft.periodoFim &&
      draft.introducaoJustificativa.trim() &&
      draft.objetivos.trim() &&
      draft.metodologia.trim() &&
      draft.cronogramaAtividades.length > 0 &&
      cronogramaOk &&
      draft.referencias.trim(),
  );
}

export function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

export function buildCreateWorkPlanPayload(
  selectedProject: SelectableProject,
  draft: WorkPlanDraft,
): CreateWorkPlanPayload {
  return {
    pesquisa_id: Number(selectedProject.id),
    modalidade: draft.modalidade,
    status: "RASCUNHO",
    tipo_bolsa: draft.modalidade.startsWith("PIV") ? "VOLUNTARIO" : "BOLSISTA",
    cronograma_id: Number(selectedProject.id),
    direcionamento_plano: draft.solicitarAcaoAfirmativa
      ? "ACAO_AFIRMATIVA"
      : "AMPLA_CONCORRENCIA",
    corpo_plano_trabalho: {
      titulo: draft.titulo.trim(),
      introducao: draft.introducaoJustificativa.trim(),
      objetivos: draft.objetivos.trim(),
      metodologia: draft.metodologia.trim(),
      referencias: draft.referencias.trim(),
    },
    atividades: draft.cronogramaAtividades.map((item) => ({
      descricao: item.atividade,
      meses: monthDates(draft.periodoIni, item.mesInicio, item.mesFim),
    })),
  };
}

export async function fetchProjectsAndPlans(): Promise<{
  projects: SelectableProject[];
  plansByProject: Record<string, WorkPlanDraft[]>;
}> {
  const [projectResponse, workPlanResponse] = await Promise.all([
    projectService.list({ limit: 100, offset: 0 }),
    workPlanService.list({ limit: 200, offset: 0 }),
  ]);

  return {
    projects: projectResponse.results.map(mapProject),
    plansByProject: groupWorkPlansByProject(workPlanResponse.results),
  };
}
