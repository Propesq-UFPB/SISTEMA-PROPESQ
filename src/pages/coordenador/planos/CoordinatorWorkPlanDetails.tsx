import { useLocation } from "react-router-dom"
import WorkPlanDetailsPage from "@/features/work-plans/components/WorkPlanDetailsPage"

export default function CoordinatorWorkPlanDetails() {
  const { state } = useLocation()
  const origin: unknown = state?.backTo
  const backTo = typeof origin === "string" && origin.startsWith("/") && !origin.startsWith("//")
    ? origin
    : "/coordenador/planos/novo"

  return <WorkPlanDetailsPage backTo={backTo} canDelete />
}
