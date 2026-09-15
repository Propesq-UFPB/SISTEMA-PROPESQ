import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useCoordinatorWorkPlanForm } from "@/features/work-plans/hooks/useCoordinatorWorkPlanForm";
import { NoProjectSelectedCard } from "@/features/work-plans/components/NoProjectSelectedCard";
import { ProjectSelectionTable } from "@/features/work-plans/components/ProjectSelectionTable";
import { WorkPlanDraftForm } from "@/features/work-plans/components/WorkPlanDraftForm";

export default function CoordinatorProjectWorkPlanForm() {
  const {
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
  } = useCoordinatorWorkPlanForm();

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      {loadError && (
        <div className="mx-auto max-w-7xl px-6 pt-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {loadError}
          </div>
        </div>
      )}
      {saveError && (
        <div className="mx-auto max-w-7xl px-6 pt-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {saveError}
          </div>
        </div>
      )}
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
              os campos exigidos pelo Anexo II.
            </p>
          </div>

          <div className="flex w-fit flex-col gap-2 rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-3">
            <span className="text-[11px] font-bold uppercase text-neutral">
              Projeto selecionado
            </span>

            <span className="text-sm font-bold text-primary">
              {selectedProject?.codigo ?? "Nenhum"}
            </span>
          </div>
        </section>

        <ProjectSelectionTable
          loading={loading}
          projects={filteredProjects}
          selectedProjectId={selectedProjectId}
          plansByProject={plansByProject}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          onSelect={selectProject}
        />

        {selectedProject ? (
          <WorkPlanDraftForm
            selectedProject={selectedProject}
            existingPlans={existingPlans}
            draft={draft}
            setDraft={setDraft}
            cronogramaAtividade={cronogramaAtividade}
            setCronogramaAtividade={setCronogramaAtividade}
            cronogramaMesInicio={cronogramaMesInicio}
            setCronogramaMesInicio={setCronogramaMesInicio}
            cronogramaMesFim={cronogramaMesFim}
            setCronogramaMesFim={setCronogramaMesFim}
            duracaoPeriodoMeses={duracaoPeriodoMeses}
            mesesCronogramaDisponiveis={mesesCronogramaDisponiveis}
            canAddCronogramaItem={canAddCronogramaItem}
            cronogramaDentroDoPeriodo={cronogramaDentroDoPeriodo}
            canSavePlan={canSavePlan}
            saving={saving}
            saved={saved}
            resetDraft={resetDraft}
            duplicateLastPlan={duplicateLastPlan}
            addCronogramaItem={addCronogramaItem}
            removeCronogramaItem={removeCronogramaItem}
            clearCronograma={clearCronograma}
            savePlan={savePlan}
          />
        ) : (
          <NoProjectSelectedCard />
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
