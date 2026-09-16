import { BarChart3 } from "lucide-react"
import { SectionTitle, TableCell, TableHead } from "./formPrimitives"

export function AreaSummarySection({
  areaSummary,
}: Readonly<{
  areaSummary: {
    area: string
    total: number
    pendentes: number
    distribuidos: number
    incompletos: number
  }[]
}>) {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<BarChart3 size={18} />}
        title="Resumo por área"
        subtitle="Visão agregada para o gestor."
      />

      <div className="overflow-hidden rounded-2xl border border-neutral/10">
        <table className="min-w-full divide-y divide-neutral/10 text-sm">
          <thead className="bg-neutral-light/70">
            <tr>
              <TableHead>Área</TableHead>
              <TableHead align="right">Total</TableHead>
              <TableHead align="right">Pendentes</TableHead>
              <TableHead align="right">Distribuídos</TableHead>
              <TableHead align="right">Incompletos</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral/10 bg-white">
            {areaSummary.map((item) => (
              <tr key={item.area}>
                <TableCell>{item.area}</TableCell>
                <TableCell align="right">{item.total}</TableCell>
                <TableCell align="right">{item.pendentes}</TableCell>
                <TableCell align="right">{item.distribuidos}</TableCell>
                <TableCell align="right">{item.incompletos}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
