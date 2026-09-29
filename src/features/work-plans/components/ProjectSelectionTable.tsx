import type { SelectableProject } from "@/features/work-plans/types/coordinatorWorkPlanForm";
import { Card, selectClassName } from "./formPrimitives";

export function ProjectSelectionTable({ loading, projects, selectedProjectId, onSelect }: {
  loading: boolean;
  projects: SelectableProject[];
  selectedProjectId: string;
  onSelect: (projectId: string) => void;
}) {
  const selected = projects.find(project => project.id === selectedProjectId);
  return (
    <Card title="Selecionar projeto" subtitle="Escolha um de seus projetos de pesquisa vinculado a um edital publicado.">
      <label htmlFor="work-plan-project" className="mb-2 block text-sm font-semibold text-primary">Projeto de pesquisa</label>
      <select id="work-plan-project" value={selectedProjectId} onChange={event => onSelect(event.target.value)} disabled={loading || projects.length === 0} className={selectClassName}>
        <option value="">{loading ? "Carregando projetos..." : "Selecione um projeto"}</option>
        {projects.map(project => <option key={project.id} value={project.id}>{project.codigo} — {project.titulo} — {project.edital}</option>)}
      </select>
      {!loading && projects.length === 0 && <p className="mt-3 text-sm text-neutral">Nenhum projeto vinculado a você em editais publicados.</p>}
      {selected && <p className="mt-3 text-sm text-neutral">{selected.edital} • Limite de planos por orientador: {selected.limitePlanos}</p>}
    </Card>
  );
}
