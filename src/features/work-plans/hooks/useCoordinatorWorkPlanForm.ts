import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workPlanService } from "@/features/work-plans/api/workPlanService";
import type {
  ProjectFilters,
  SelectableProject,
  WorkPlanDraft,
} from "@/features/work-plans/types/coordinatorWorkPlanForm";
import {
  buildCreateWorkPlanPayload,
  computeDuracaoPeriodoMeses,
  createEmptyDraft,
  createId,
  fetchProjectsAndPlans,
  isCronogramaDentroDoPeriodo,
  isDraftReadyToSave,
  mapApiPlan,
  matchesProjectFilters,
  resolveErrorMessage,
} from "@/features/work-plans/utils/workPlanFormHelpers";

export function useCoordinatorWorkPlanForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [projects, setProjects] = useState<SelectableProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [plansByProject, setPlansByProject] = useState<
    Record<string, WorkPlanDraft[]>
  >({});

  const [draft, setDraft] = useState<WorkPlanDraft>(createEmptyDraft());
  const [cronogramaAtividade, setCronogramaAtividade] = useState("");
  const [cronogramaMesInicio, setCronogramaMesInicio] = useState(1);
  const [cronogramaMesFim, setCronogramaMesFim] = useState(1);

  const [filters, setFilters] = useState<ProjectFilters>({
    codigo: "",
    nome: "",
    modalidade: "Todas",
  });

  useEffect(() => {
    let active = true;

    void (async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await fetchProjectsAndPlans();
        if (!active) return;
        setProjects(data.projects);
        setPlansByProject(data.plansByProject);
      } catch (error) {
        if (!active) return;
        setLoadError(
          resolveErrorMessage(
            error,
            "Não foi possível carregar projetos e planos.",
          ),
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const selectedProject = useMemo(() => {
    return projects.find((project) => project.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  const existingPlans =
    (selectedProject && plansByProject[selectedProject.id]) || [];

  const duracaoPeriodoMeses = useMemo(
    () => computeDuracaoPeriodoMeses(draft.periodoIni, draft.periodoFim),
    [draft.periodoFim, draft.periodoIni],
  );

  const mesesCronogramaDisponiveis = useMemo(() => {
    return Array.from({ length: duracaoPeriodoMeses }, (_, index) => index + 1);
  }, [duracaoPeriodoMeses]);

  const filteredProjects = useMemo(
    () => projects.filter((project) => matchesProjectFilters(project, filters)),
    [filters, projects],
  );

  const canAddCronogramaItem = Boolean(
    cronogramaAtividade.trim() &&
      duracaoPeriodoMeses > 0 &&
      cronogramaMesInicio >= 1 &&
      cronogramaMesFim >= cronogramaMesInicio &&
      cronogramaMesFim <= duracaoPeriodoMeses,
  );

  const cronogramaDentroDoPeriodo = useMemo(
    () =>
      isCronogramaDentroDoPeriodo(
        draft.cronogramaAtividades,
        duracaoPeriodoMeses,
      ),
    [draft.cronogramaAtividades, duracaoPeriodoMeses],
  );

  const canSavePlan = useMemo(
    () =>
      isDraftReadyToSave(
        draft,
        Boolean(selectedProject),
        cronogramaDentroDoPeriodo,
      ),
    [cronogramaDentroDoPeriodo, draft, selectedProject],
  );

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

  function clearCronograma() {
    setDraft((current) => ({
      ...current,
      cronogramaAtividades: [],
    }));
    setSaved(false);
  }

  async function savePlan() {
    if (!selectedProject || !canSavePlan) return;

    setSaving(true);
    setSaveError("");

    const payload = buildCreateWorkPlanPayload(selectedProject, draft);

    try {
      const created = await workPlanService.create(payload);
      setPlansByProject((current) => ({
        ...current,
        [selectedProject.id]: [
          ...(current[selectedProject.id] || []),
          mapApiPlan(created),
        ],
      }));

      setSaved(true);
      resetDraft();
      navigate(`/coordenador/planos/${created.id}`);
    } catch (error) {
      setSaveError(
        resolveErrorMessage(
          error,
          "Não foi possível salvar o plano de trabalho.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    saving,
    saved,
    loading,
    loadError,
    saveError,
    selectedProjectId,
    plansByProject,
    draft,
    setDraft,
    cronogramaAtividade,
    setCronogramaAtividade,
    cronogramaMesInicio,
    setCronogramaMesInicio,
    cronogramaMesFim,
    setCronogramaMesFim,
    filters,
    setFilters,
    selectedProject,
    existingPlans,
    duracaoPeriodoMeses,
    mesesCronogramaDisponiveis,
    filteredProjects,
    canAddCronogramaItem,
    cronogramaDentroDoPeriodo,
    canSavePlan,
    resetDraft,
    clearFilters,
    selectProject,
    duplicateLastPlan,
    addCronogramaItem,
    removeCronogramaItem,
    clearCronograma,
    savePlan,
  };
}
