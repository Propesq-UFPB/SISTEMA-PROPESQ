import {
  AlertTriangle,
  BarChart3,
  Filter,
  GraduationCap,
  Search,
} from "lucide-react"
import type {
  QuotaDistributionItem,
  QuotaListFilters,
  TabKey,
} from "../types/quotas"
import {
  formatNumber,
  getStatusClass,
  getStatusLabel,
} from "../utils/quotaHelpers"
import { Badge } from "./formPrimitives"

const TABS: { key: TabKey; label: string }[] = [
  { key: "TODOS", label: "Todos" },
  { key: "CONTEMPLADOS", label: "Contemplados" },
  { key: "VOLUNTARIOS", label: "Voluntários" },
  { key: "PENDENCIAS", label: "Pendências" },
]

export function QuotaDistributionList({
  filters,
  centers,
  items,
  onFiltersChange,
}: Readonly<{
  filters: QuotaListFilters
  centers: string[]
  items: QuotaDistributionItem[]
  onFiltersChange: (next: QuotaListFilters) => void
}>) {
  return (
    <section className="rounded-3xl border border-neutral-light bg-white shadow-card">
      <div className="border-b border-neutral-light p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-primary">
              Lista de distribuição
            </h2>
            <p className="mt-1 text-sm text-neutral/70">
              Ranking final, fonte da cota, reservas e situação do plano.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral/50"
              />
              <input
                value={filters.search}
                onChange={(event) =>
                  onFiltersChange({ ...filters, search: event.target.value })
                }
                placeholder="Buscar por projeto, coordenador ou discente"
                className="h-11 w-full rounded-xl border border-neutral-light bg-white pr-3 pl-9 text-sm outline-none transition placeholder:text-neutral/50 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-80"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-light bg-white px-4 text-sm font-semibold text-primary"
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select
            value={filters.selectedCenter}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                selectedCenter: event.target.value,
              })
            }
            className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="TODOS">Todos os centros</option>
            {centers.map((center) => (
              <option key={center} value={center}>
                {center}
              </option>
            ))}
          </select>

          <select
            value={filters.selectedSource}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                selectedSource: event.target.value,
              })
            }
            className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="TODAS">Todas as fontes</option>
            <option value="CNPq">CNPq</option>
            <option value="UFPB">UFPB</option>
            <option value="VOLUNTARIO">Voluntário</option>
            <option value="NAO_CONTEMPLADO">Não contemplado</option>
          </select>

          <select
            value={filters.selectedStatus}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                selectedStatus: event.target.value,
              })
            }
            className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm text-primary outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="TODOS">Todos os status</option>
            <option value="CONTEMPLADO_CNPQ">Contemplado CNPq</option>
            <option value="CONTEMPLADO_UFPB">Contemplado UFPB</option>
            <option value="VOLUNTARIO">Voluntário</option>
            <option value="PENDENTE_REVISAO">Pendente</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                onFiltersChange({ ...filters, selectedTab: tab.key })
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filters.selectedTab === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "border border-neutral-light bg-white text-neutral hover:bg-neutral-light/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-light bg-neutral-light/50">
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Class.
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Coordenador
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Projeto / Plano
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                IFC
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Fonte
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Reservas
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-semibold tracking-wide text-neutral/70 uppercase">
                Elegibilidade
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-neutral-light transition hover:bg-neutral-light/30"
              >
                <td className="px-5 py-4 align-top">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-light bg-white text-sm font-semibold text-primary">
                    {item.rankingPosition}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="font-semibold text-primary">
                    {item.coordinator}
                  </div>
                  <div className="mt-1 text-sm text-neutral/70">
                    {item.center} • {item.area}
                  </div>
                  <div className="mt-1 text-xs text-neutral/50">
                    Planos aprovados: {item.approvedPlans}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="max-w-xl font-medium text-primary">
                    {item.projectTitle}
                  </div>
                  <div className="mt-1 text-sm text-neutral/70">
                    {item.workPlanTitle}
                  </div>
                  <div className="mt-1 text-xs text-neutral/50">
                    Discente: {item.studentName ?? "Não indicado"}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="font-semibold text-primary">
                    {formatNumber(item.ifc)}
                  </div>
                  <div className="mt-1 text-xs text-neutral/70">
                    NP {formatNumber(item.np)} • FPPI {formatNumber(item.fppi)}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  {item.quotaSource === "CNPq" ? (
                    <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                      CNPq
                    </Badge>
                  ) : null}

                  {item.quotaSource === "UFPB" ? (
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      UFPB
                    </Badge>
                  ) : null}

                  {item.quotaSource === "VOLUNTARIO" ? (
                    <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                      Voluntário
                    </Badge>
                  ) : null}

                  {item.quotaSource === "NAO_CONTEMPLADO" ? (
                    <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                      -
                    </Badge>
                  ) : null}
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="flex max-w-xs flex-wrap gap-1.5">
                    {item.isNewDoctor ? (
                      <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700">
                        <GraduationCap size={12} className="mr-1" />
                        Recém-doutor
                      </Badge>
                    ) : null}

                    {item.hasMaternityLeave ? (
                      <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                        Licença-maternidade
                      </Badge>
                    ) : null}

                    {item.hasAdoptionLeave ? (
                      <Badge className="border-pink-200 bg-pink-50 text-pink-700">
                        Licença-adotante
                      </Badge>
                    ) : null}

                    {item.isPriorityArea ? (
                      <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                        {item.priorityAreaName ?? "Área prioritária"}
                      </Badge>
                    ) : null}

                    {!item.isNewDoctor &&
                    !item.hasMaternityLeave &&
                    !item.hasAdoptionLeave &&
                    !item.isPriorityArea ? (
                      <span className="text-sm text-neutral/50">-</span>
                    ) : null}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  <Badge className={getStatusClass(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </td>

                <td className="px-5 py-4 align-top">
                  <div className="flex max-w-sm items-start gap-2 text-sm text-neutral/70">
                    {item.status === "PENDENTE_REVISAO" ? (
                      <AlertTriangle
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />
                    ) : (
                      <BarChart3
                        size={16}
                        className="mt-0.5 shrink-0 text-neutral/40"
                      />
                    )}
                    <span>{item.eligibilityReason}</span>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-light bg-neutral-light/50 text-neutral/50">
                      <Search size={20} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-primary">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="mt-1 text-sm text-neutral/70">
                      Ajuste os filtros ou limpe a busca para visualizar a
                      distribuição.
                    </p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}
