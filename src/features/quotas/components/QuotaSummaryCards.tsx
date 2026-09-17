import {
  Award,
  BadgeCheck,
  HeartHandshake,
  Medal,
  Users,
} from "lucide-react"
import type { QuotaSummary, QuotaUsageSummary } from "../types/quotas"
import { SummaryCard } from "./formPrimitives"

export function QuotaSummaryCards({
  summary,
  totals,
}: Readonly<{
  summary: QuotaUsageSummary
  totals: QuotaSummary
}>) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        icon={<Award size={22} />}
        label="Cotas CNPq"
        value={`${summary.cnpqUsed}/${totals.cnpqTotal}`}
        description={`${summary.cnpqRemaining} cotas restantes`}
      />

      <SummaryCard
        icon={<Medal size={22} />}
        label="Cotas UFPB"
        value={`${summary.ufpbUsed}/${totals.ufpbTotal}`}
        description={`${summary.ufpbRemaining} cotas restantes`}
      />

      <SummaryCard
        icon={<Users size={22} />}
        label="Projetos elegíveis"
        value={summary.eligible}
        description="Com plano aprovado e discente indicado"
      />

      <SummaryCard
        icon={<BadgeCheck size={22} />}
        label="Contemplados"
        value={summary.totalScholarships}
        description="CNPq + UFPB"
      />

      <SummaryCard
        icon={<HeartHandshake size={22} />}
        label="Voluntários"
        value={summary.volunteers}
        description={`${summary.pending} pendência(s) para revisar`}
      />
    </section>
  )
}
