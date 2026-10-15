import { useMemo, useState } from "react"
import { FolderKanban, Search, Users } from "lucide-react"
import { normalizeText } from "@/features/consultants/utils/consultantHelpers"
import type { Assignment, DistributableProject } from "../types/evaluationDistribution"
import {
  groupByConsultant,
  isActive,
  matchesAssignmentFilter,
  projectAreaLabel,
  type AssignmentFilter,
} from "../utils/evaluationDistributionHelpers"
import { AssignmentStatusBadge } from "./AssignmentStatusBadge"
import { SectionTitle } from "./formPrimitives"

type View = "PROJETO" | "CONSULTOR"

const FILTERS: { value: AssignmentFilter; label: string }[] = [
  { value: "ALL", label: "Todos os status" },
  { value: "PENDENTE", label: "Pendentes" },
  { value: "ACEITO", label: "Aceitos" },
  { value: "AVALIADO", label: "Avaliados" },
  { value: "RECUSADO", label: "Recusados" },
]

function tabClassName(active: boolean) {
  return `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    active ? "bg-primary text-white" : "text-neutral hover:bg-primary/5 hover:text-primary"
  }`
}

export function EditalAssignmentsSection({
  projects,
  assignments,
  perProject,
  onOpenConsultant,
}: Readonly<{
  projects: DistributableProject[]
  assignments: Assignment[]
  perProject: number
  onOpenConsultant: (consultant: { id: number; name: string }) => void
}>) {
  const [view, setView] = useState<View>("PROJETO")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<AssignmentFilter>("ALL")

  const visible = useMemo(
    () => assignments.filter((a) => matchesAssignmentFilter(a, filter)),
    [assignments, filter],
  )
  const q = normalizeText(query)

  const projectRows = useMemo(() => {
    const byProject = new Map<number, Assignment[]>()
    for (const a of visible) byProject.set(a.projectId, [...(byProject.get(a.projectId) ?? []), a])
    const activeByProject = new Map<number, number>()
    for (const a of assignments.filter(isActive)) {
      activeByProject.set(a.projectId, (activeByProject.get(a.projectId) ?? 0) + 1)
    }

    return projects
      .map((project) => ({
        project,
        items: byProject.get(project.id) ?? [],
        active: activeByProject.get(project.id) ?? 0,
      }))
      .filter(({ project, items }) => {
        if (filter !== "ALL" && items.length === 0) return false
        const names = items.map((a) => a.evaluatorName).join(" ")
        return (
          !q ||
          normalizeText(
            `${project.code} ${project.title} ${projectAreaLabel(project)} ${names}`,
          ).includes(q)
        )
      })
  }, [projects, visible, assignments, filter, q])

  const consultantRows = useMemo(() => {
    const projectById = new Map(projects.map((p) => [p.id, p]))
    return groupByConsultant(visible)
      .map((group) => ({
        ...group,
        projects: group.assignments.map((a) => ({ assignment: a, project: projectById.get(a.projectId) })),
      }))
      .filter((group) => !q || normalizeText(group.name).includes(q))
  }, [projects, visible, q])

  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm space-y-4">
      <div>
        <SectionTitle
          icon={<FolderKanban size={18} />}
          title="Atribuições do edital"
          subtitle="Convites gravados, por projeto ou por consultor."
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-neutral/15 p-1">
            <button type="button" onClick={() => setView("PROJETO")} className={tabClassName(view === "PROJETO")}>
              <FolderKanban size={15} />
              Por projeto
            </button>
            <button type="button" onClick={() => setView("CONSULTOR")} className={tabClassName(view === "CONSULTOR")}>
              <Users size={15} />
              Por consultor
            </button>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as AssignmentFilter)}
            className="h-10 rounded-xl border border-neutral/20 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
          >
            {FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="relative min-w-[12rem] flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={view === "PROJETO" ? "Buscar projeto, área ou consultor..." : "Buscar consultor..."}
              className="h-10 w-full rounded-xl border border-neutral/20 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-auto rounded-2xl border border-neutral/10">
        {view === "PROJETO" ? (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-neutral-light/90 text-neutral">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Projeto</th>
                <th className="px-4 py-2 text-left font-semibold">Consultores</th>
                <th className="w-[110px] px-4 py-2 text-right font-semibold">Ativos</th>
              </tr>
            </thead>
            <tbody>
              {projectRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-neutral">
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              ) : (
                projectRows.map(({ project, items, active }) => (
                  <tr key={project.id} className="border-t border-neutral/10 align-top">
                    <td className="px-4 py-2">
                      <p className="text-xs font-semibold text-primary">{project.code}</p>
                      <p className="font-medium text-neutral-dark">{project.title}</p>
                      <p className="text-xs text-neutral">{projectAreaLabel(project)}</p>
                    </td>
                    <td className="px-4 py-2">
                      {items.length === 0 ? (
                        <span className="text-xs text-neutral">Sem convites</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {items.map((a) => (
                            <span
                              key={a.id}
                              title={a.reason ?? undefined}
                              className="inline-flex items-center gap-1.5 rounded-full border border-neutral/15 bg-white py-0.5 pl-2.5 pr-0.5 text-xs text-neutral-dark"
                            >
                              {a.evaluatorName}
                              <AssignmentStatusBadge status={a.status} hasGrades={a.hasGrades} compact />
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-semibold ${
                        active >= perProject ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {active}/{perProject}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-neutral-light/90 text-neutral">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Consultor</th>
                <th className="px-4 py-2 text-left font-semibold">Projetos</th>
                <th className="w-[150px] px-4 py-2 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {consultantRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-neutral">
                    Nenhum consultor encontrado.
                  </td>
                </tr>
              ) : (
                consultantRows.map((group) => (
                  <tr key={group.key} className="border-t border-neutral/10 align-top">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-primary">{group.name}</p>
                      <p className="text-xs text-neutral">{group.assignments.length} convite(s)</p>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        {group.projects.map(({ assignment, project }) => (
                          <span
                            key={assignment.id}
                            title={project?.title}
                            className="inline-flex items-center gap-1.5 rounded-full border border-neutral/15 bg-white py-0.5 pl-2.5 pr-0.5 text-xs text-neutral-dark"
                          >
                            {project?.code ?? `Projeto ${assignment.projectId}`}
                            <AssignmentStatusBadge
                              status={assignment.status}
                              hasGrades={assignment.hasGrades}
                              compact
                            />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {group.consultantId !== null && (
                        <button
                          type="button"
                          onClick={() => onOpenConsultant({ id: group.consultantId!, name: group.name })}
                          className="rounded-xl border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                        >
                          Ver detalhes
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
