import React from "react";
import { Check, Filter, Search } from "lucide-react";
import type {
  ProjectFilters,
  SelectableProject,
  WorkPlanDraft,
} from "@/features/work-plans/types/coordinatorWorkPlanForm";
import {
  cx,
  modalidadesFiltro,
} from "@/features/work-plans/utils/workPlanFormHelpers";
import {
  Card,
  Field,
  inputClassName,
  selectClassName,
} from "@/features/work-plans/components/formPrimitives";

function ProjectRows({
  loading,
  projects,
  selectedProjectId,
  plansByProject,
  onSelect,
}: Readonly<{
  loading: boolean;
  projects: SelectableProject[];
  selectedProjectId: string;
  plansByProject: Record<string, WorkPlanDraft[]>;
  onSelect: (projectId: string) => void;
}>) {
  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-neutral">
        Carregando projetos e planos...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-semibold text-primary">
          Nenhum projeto aprovado ou validado encontrado.
        </p>

        <p className="mt-1 text-xs text-neutral">
          Ajuste os filtros ou verifique o status dos projetos.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral/20">
      {projects.map((project) => {
        const selected = project.id === selectedProjectId;
        const totalPlanos =
          plansByProject[project.id]?.length || project.totalPlanos;

        return (
          <div
            key={project.id}
            className={cx(
              "grid grid-cols-12 gap-3 px-4 py-4 text-sm transition",
              selected ? "bg-primary/5" : "bg-white hover:bg-neutral/5",
            )}
          >
            <div className="col-span-3">
              <p className="font-bold text-primary">{project.codigo}</p>
              <p className="mt-1 text-xs text-neutral">{project.edital}</p>
              <span className="mt-2 inline-flex rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                {project.status}
              </span>
            </div>

            <div className="col-span-4">
              <p className="font-semibold text-primary">{project.titulo}</p>
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
              <p className="font-semibold text-primary">{totalPlanos}</p>
              <p className="mt-1 text-xs">vinculado(s) neste projeto</p>
            </div>

            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => onSelect(project.id)}
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
  );
}

export function ProjectSelectionTable({
  loading,
  projects,
  selectedProjectId,
  plansByProject,
  filters,
  onFiltersChange,
  onClearFilters,
  onSelect,
}: Readonly<{
  loading: boolean;
  projects: SelectableProject[];
  selectedProjectId: string;
  plansByProject: Record<string, WorkPlanDraft[]>;
  filters: ProjectFilters;
  onFiltersChange: (
    updater: (current: ProjectFilters) => ProjectFilters,
  ) => void;
  onClearFilters: () => void;
  onSelect: (projectId: string) => void;
}>) {
  return (
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
              onFiltersChange((current) => ({
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
              onFiltersChange((current) => ({
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
              onFiltersChange((current) => ({
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
            onClick={onClearFilters}
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

        <ProjectRows
          loading={loading}
          projects={projects}
          selectedProjectId={selectedProjectId}
          plansByProject={plansByProject}
          onSelect={onSelect}
        />
      </div>
    </Card>
  );
}
