import { useMemo, useState } from "react"
import type {
  QuotaListFilters,
  QuotaReserveOptions,
} from "../types/quotas"
import {
  calcQuotaSummary,
  distributeQuotas,
  exportToCsv,
  filterQuotaItems,
  initialQuotaSummary,
  rankingMock,
  uniqueCenters,
} from "../utils/quotaHelpers"

export function useGestorCallQuotas() {
  const [filters, setFilters] = useState<QuotaListFilters>({
    search: "",
    selectedCenter: "TODOS",
    selectedSource: "TODAS",
    selectedStatus: "TODOS",
    selectedTab: "TODOS",
  })

  const [reserveOptions, setReserveOptions] = useState<QuotaReserveOptions>({
    applyNewDoctorReserve: true,
    applyLeaveReserve: true,
    applyPriorityAreaReserve: true,
  })

  const distribution = useMemo(() => {
    return distributeQuotas(
      rankingMock,
      initialQuotaSummary.cnpqTotal,
      initialQuotaSummary.ufpbTotal,
      reserveOptions,
    )
  }, [reserveOptions])

  const centers = useMemo(() => uniqueCenters(distribution), [distribution])

  const filteredItems = useMemo(
    () => filterQuotaItems(distribution, filters),
    [distribution, filters],
  )

  const summary = useMemo(
    () => calcQuotaSummary(distribution, initialQuotaSummary),
    [distribution],
  )

  function handleRegenerateDistribution() {
    setReserveOptions((current) => ({ ...current }))
  }

  function handleExportCsv() {
    exportToCsv(distribution)
  }

  return {
    filters,
    setFilters,
    reserveOptions,
    setReserveOptions,
    distribution,
    centers,
    filteredItems,
    summary,
    totals: initialQuotaSummary,
    handleRegenerateDistribution,
    handleExportCsv,
  }
}
