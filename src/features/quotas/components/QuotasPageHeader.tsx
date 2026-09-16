import { Download, RefreshCcw, Trophy } from "lucide-react"

export function QuotasPageHeader({
  onRegenerate,
  onExport,
}: Readonly<{
  onRegenerate: () => void
  onExport: () => void
}>) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Trophy size={14} />
            Cotas
          </div>

          <h1 className="mt-3 text-[28px] leading-tight font-bold tracking-tight text-primary">
            Distribuição de Cotas
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Geração da distribuição de bolsas CNPq e UFPB com base no ranking
            final classificatório, respeitando IFC, limite por pesquisador,
            planos aptos, reservas especiais e disponibilidade de cotas.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCcw size={16} />
            Gerar distribuição
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Download size={16} />
            Exportar lista final
          </button>
        </div>
      </div>
    </section>
  )
}
