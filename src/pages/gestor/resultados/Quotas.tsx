import { ArrowLeft } from "lucide-react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import { QuotaDistributionList } from "@/features/quotas/components/QuotaDistributionList"
import { QuotaReservesSection } from "@/features/quotas/components/QuotaReservesSection"
import { QuotaRulesSection } from "@/features/quotas/components/QuotaRulesSection"
import { QuotaSummaryCards } from "@/features/quotas/components/QuotaSummaryCards"
import { QuotasPageHeader } from "@/features/quotas/components/QuotasPageHeader"
import { useGestorCallQuotas } from "@/features/quotas/hooks/useGestorCallQuotas"

export default function GestorCallQuotas() {
  const {
    filters,
    setFilters,
    reserveOptions,
    setReserveOptions,
    centers,
    filteredItems,
    summary,
    totals,
    handleRegenerateDistribution,
    handleExportCsv,
  } = useGestorCallQuotas()

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Distribuição de Cotas • PROPESQ</title>
      </Helmet>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <Link
            to="/gestor/resultados/ranking"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Voltar para ranking
          </Link>
        </div>

        <QuotasPageHeader
          onRegenerate={handleRegenerateDistribution}
          onExport={handleExportCsv}
        />

        <QuotaSummaryCards summary={summary} totals={totals} />

        <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <QuotaRulesSection />
          <QuotaReservesSection
            options={reserveOptions}
            onChange={setReserveOptions}
          />
        </section>

        <QuotaDistributionList
          filters={filters}
          centers={centers}
          items={filteredItems}
          onFiltersChange={setFilters}
        />
      </main>
    </div>
  )
}
