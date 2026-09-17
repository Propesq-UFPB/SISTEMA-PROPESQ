import {
  CheckCircle2,
  ClipboardList,
  Send,
  Timer,
  XCircle,
} from "lucide-react"
import type {
  EvaluationStatus,
  EvaluationWorkPlanDecision,
} from "../types/coordinatorEvaluation"

export function StatusIcon({
  status,
}: Readonly<{
  status: EvaluationStatus | EvaluationWorkPlanDecision
}>) {
  switch (status) {
    case "Realizada":
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Justificativa enviada":
      return <Send size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Pendente":
      return <Timer size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    default:
      return <ClipboardList size={14} />
  }
}
