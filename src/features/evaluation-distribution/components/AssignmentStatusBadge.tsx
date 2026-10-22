import { CheckCircle2, ClipboardCheck, Clock3, XCircle } from "lucide-react"
import type { AssignmentStatus } from "../types/evaluationDistribution"

// Situação do convite do ponto de vista do gestor; aceito com notas = avaliação enviada
export function AssignmentStatusBadge({
  status,
  hasGrades,
  compact = false,
}: Readonly<{ status: AssignmentStatus; hasGrades: boolean; compact?: boolean }>) {
  const variant =
    status === "RECUSADO"
      ? { label: "Recusado", icon: <XCircle size={12} />, className: "border-red-200 bg-red-50 text-red-700" }
      : hasGrades
        ? { label: "Avaliado", icon: <ClipboardCheck size={12} />, className: "border-emerald-200 bg-emerald-50 text-emerald-700" }
        : status === "ACEITO"
          ? { label: "Aceito", icon: <CheckCircle2 size={12} />, className: "border-blue-200 bg-blue-50 text-blue-700" }
          : { label: "Pendente", icon: <Clock3 size={12} />, className: "border-amber-200 bg-amber-50 text-amber-700" }

  return (
    <span
      title={variant.label}
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${variant.className} ${
        compact ? "px-1.5 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {variant.icon}
      {variant.label}
    </span>
  )
}
