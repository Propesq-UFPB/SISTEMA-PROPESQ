import { Eye, Search, Users } from "lucide-react"
import type {
  Evaluator,
  EvaluatorStatusFilter,
  EvaluatorTypeFilter,
} from "../types/evaluators"
import { getInitials, roleLabel } from "../utils/evaluatorHelpers"
import {
  Chip,
  Section,
  StatusBadge,
  TableCell,
  TableHead,
} from "./formPrimitives"

export function EvaluatorsBankSection({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  filteredEvaluators,
  countAssignmentsFor,
  countPendingFor,
}: Readonly<{
  search: string
  onSearchChange: (value: string) => void
  typeFilter: EvaluatorTypeFilter
  onTypeFilterChange: (value: EvaluatorTypeFilter) => void
  statusFilter: EvaluatorStatusFilter
  onStatusFilterChange: (value: EvaluatorStatusFilter) => void
  filteredEvaluators: Evaluator[]
  countAssignmentsFor: (evaluatorId: string) => number
  countPendingFor: (evaluatorId: string) => number
}>) {
  return (
    <Section
      title="Banco de avaliadores"
      description="Lista de avaliadores cadastrados, com área de atuação, tipo, vínculo, status e carga no edital selecionado."
      icon={<Users size={18} />}
      right={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
            />

            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar avaliador, e-mail ou área"
              className="h-11 w-full rounded-xl border border-neutral-light bg-white px-3 pl-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              onTypeFilterChange(event.target.value as EvaluatorTypeFilter)
            }
            className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          >
            <option value="ALL">Todos os tipos</option>
            <option value="INTERNO">Internos</option>
            <option value="EXTERNO">Externos</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as EvaluatorStatusFilter)
            }
            className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          >
            <option value="ALL">Todos os status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-neutral-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-light">
            <thead className="bg-neutral-50">
              <tr>
                <TableHead>Avaliador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Perfis</TableHead>
                <TableHead>Áreas</TableHead>
                <TableHead align="center">Carga</TableHead>
                <TableHead align="center">Pendentes</TableHead>
                <TableHead align="center">Status</TableHead>
                <TableHead align="right">Ações</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-light bg-white">
              {filteredEvaluators.map((evaluator) => {
                const load = countAssignmentsFor(evaluator.id)
                const pending = countPendingFor(evaluator.id)

                return (
                  <tr
                    key={evaluator.id}
                    className="transition hover:bg-neutral-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(evaluator.name)}
                        </div>

                        <div>
                          <p className="font-semibold text-primary">
                            {evaluator.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-neutral">
                            {evaluator.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Chip>{evaluator.type}</Chip>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {evaluator.roles.map((role) => (
                          <Chip key={role}>{roleLabel(role)}</Chip>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex max-w-sm flex-wrap gap-1.5">
                        {evaluator.areas.map((area) => (
                          <Chip key={area.id}>{area.label}</Chip>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell align="center">
                      <strong className="text-primary">{load}</strong>
                    </TableCell>

                    <TableCell align="center">
                      {pending > 0 ? (
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                          {pending}
                        </span>
                      ) : (
                        <span className="text-neutral">0</span>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <StatusBadge active={evaluator.active} />
                    </TableCell>

                    <TableCell align="right">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-light text-neutral transition hover:border-primary/30 hover:text-primary"
                        title="Visualizar avaliador"
                      >
                        <Eye size={15} />
                      </button>
                    </TableCell>
                  </tr>
                )
              })}

              {filteredEvaluators.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-sm text-neutral"
                  >
                    Nenhum avaliador encontrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
