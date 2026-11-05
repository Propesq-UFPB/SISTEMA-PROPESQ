import { Eye, Search, Users } from "lucide-react"
import type {
  Evaluator,
  EvaluatorStatusFilter,
  EvaluatorTypeFilter,
} from "../types/evaluators"
import { getInitials, roleLabel } from "../utils/evaluatorHelpers"
import {
  Avatar,
  Chip,
  Section,
  StatusBadge,
  StatusPill,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeadRow,
  TableRow,
  TableWrapper,
} from "./formPrimitives"

const FILTER_SELECT_CLASS =
  "h-10 rounded-xl border border-neutral/20 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"

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
    >
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={typeFilter}
          onChange={(event) =>
            onTypeFilterChange(event.target.value as EvaluatorTypeFilter)
          }
          className={FILTER_SELECT_CLASS}
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
          className={FILTER_SELECT_CLASS}
        >
          <option value="ALL">Todos os status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="INACTIVE">Inativos</option>
        </select>

        <div className="relative min-w-[12rem] flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar avaliador, e-mail ou área"
            className="h-10 w-full rounded-xl border border-neutral/20 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      <TableWrapper>
        <TableHeadRow>
          <TableHead>Avaliador</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Perfis</TableHead>
          <TableHead>Áreas</TableHead>
          <TableHead align="center">Carga</TableHead>
          <TableHead align="center">Pendentes</TableHead>
          <TableHead align="center">Status</TableHead>
          <TableHead align="right">Ações</TableHead>
        </TableHeadRow>

        <tbody>
          {filteredEvaluators.length === 0 ? (
            <TableEmptyRow colSpan={8}>Nenhum avaliador encontrado.</TableEmptyRow>
          ) : (
            filteredEvaluators.map((evaluator) => {
              const load = countAssignmentsFor(evaluator.id)
              const pending = countPendingFor(evaluator.id)

              return (
                <TableRow key={evaluator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar initials={getInitials(evaluator.name)} />
                      <div>
                        <p className="font-semibold text-primary">
                          {evaluator.name}
                        </p>
                        <p className="text-xs text-neutral">{evaluator.email}</p>
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
                    <span className="font-semibold text-primary">{load}</span>
                  </TableCell>

                  <TableCell align="center">
                    {pending > 0 ? (
                      <StatusPill tone="warning">{pending}</StatusPill>
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-primary/20 text-primary transition hover:bg-primary/5"
                      title="Visualizar avaliador"
                    >
                      <Eye size={15} />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </tbody>
      </TableWrapper>
    </Section>
  )
}
