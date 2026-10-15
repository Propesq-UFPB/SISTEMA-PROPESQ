import { useMemo, useState } from "react"
import { ListChecks, Search } from "lucide-react"
import type { EditalConsultant } from "@/features/consultants/types/consultant"
import type {
  DistributableProject,
  DistributionDraft,
  DraftAssignment,
} from "../types/evaluationDistribution"
import { normalizeText } from "@/features/consultants/utils/consultantHelpers"
import { assignmentStatusLabel, projectAreaLabel } from "../utils/evaluationDistributionHelpers"
import { SectionTitle } from "./formPrimitives"

function chipClassName(assignment: DraftAssignment) {
  if (assignment.origin === "EXISTENTE") return "border-neutral/15 bg-neutral-light text-neutral-dark"
  if (assignment.origin === "MANUAL") return "border-amber-200 bg-amber-50 text-amber-800"
  return "border-primary/20 bg-primary/5 text-primary"
}

function chipSuffix(assignment: DraftAssignment) {
  if (assignment.origin === "EXISTENTE" && assignment.status) {
    return assignmentStatusLabel(assignment.status)
  }
  if (assignment.origin === "MANUAL") return "manual"
  return "novo"
}

export function DraftAssignmentsSection({
  draft,
  projects,
  consultants,
  perProject,
  selectedProjectId,
  onSelectProject,
}: Readonly<{
  draft: DistributionDraft
  projects: DistributableProject[]
  consultants: EditalConsultant[]
  perProject: number
  selectedProjectId: number | null
  onSelectProject: (projectId: number) => void
}>) {
  const [query, setQuery] = useState("")
  const [onlyIssues, setOnlyIssues] = useState(false)

  const consultantName = useMemo(
    () => new Map(consultants.map((c) => [c.id, c.user.nome])),
    [consultants],
  )

  const byProject = useMemo(() => {
    const map = new Map<number, DraftAssignment[]>()
    for (const a of draft.assignments) map.set(a.projectId, [...(map.get(a.projectId) ?? []), a])
    return map
  }, [draft])

  const rows = projects.filter((project) => {
    const count = byProject.get(project.id)?.length ?? 0
    if (onlyIssues && count >= perProject) return false
    const q = normalizeText(query)
    return (
      !q ||
      normalizeText(`${project.code} ${project.title} ${projectAreaLabel(project)}`).includes(q)
    )
  })

  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle
          icon={<ListChecks size={18} />}
          title="Rascunho por projeto"
          subtitle="Clique em um projeto para trocar, incluir ou remover consultores."
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 whitespace-nowrap text-xs text-neutral">
            <input
              type="checkbox"
              checked={onlyIssues}
              onChange={(event) => setOnlyIssues(event.target.checked)}
              className="accent-primary"
            />
            Só incompletos
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar projeto ou área..."
              className="h-9 w-60 rounded-xl border border-neutral/20 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-neutral">
        <span className="rounded-full border border-neutral/15 bg-neutral-light px-2 py-0.5">
          Convite existente
        </span>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-primary">
          Novo (otimizador)
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-800">
          Incluído manualmente
        </span>
      </div>

      <div className="max-h-[70vh] overflow-auto rounded-2xl border border-neutral/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="sticky top-0 bg-neutral-light/90 text-neutral">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Projeto</th>
              <th className="px-4 py-2 text-left font-semibold">Consultores</th>
              <th className="px-4 py-2 text-right font-semibold w-[90px]">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-neutral">
                  Nenhum projeto encontrado.
                </td>
              </tr>
            ) : (
              rows.map((project) => {
                const items = byProject.get(project.id) ?? []
                const incomplete = items.length < perProject
                return (
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`cursor-pointer border-t border-neutral/10 align-top transition hover:bg-primary/5 ${
                      selectedProjectId === project.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <p className="text-xs font-semibold text-primary">{project.code}</p>
                      <p className="font-medium text-neutral-dark">{project.title}</p>
                      <p className="text-xs text-neutral">{projectAreaLabel(project)}</p>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {items.map((item) => (
                          <span
                            key={item.consultantId}
                            className={`rounded-full border px-2 py-0.5 text-xs ${chipClassName(item)}`}
                          >
                            {consultantName.get(item.consultantId) ?? `Consultor ${item.consultantId}`}
                            <span className="opacity-70"> · {chipSuffix(item)}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-semibold ${
                        incomplete ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {items.length}/{perProject}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
