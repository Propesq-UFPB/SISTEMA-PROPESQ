import { apiRequest, buildQuery } from "@/services/apiClient"
import type {
  CreateWorkPlanPayload,
  UpdateWorkPlanPayload,
  WorkPlan,
  WorkPlanListParams,
  WorkPlanPaginatedResponse,
} from "../types/workPlan"

const ENDPOINT = "/work-plans"

export const workPlanService = {
  list(params: WorkPlanListParams = {}) {
    return apiRequest<WorkPlanPaginatedResponse>(
      `${ENDPOINT}${buildQuery({
        limit: params.limit ?? 100,
        offset: params.offset ?? 0,
      })}`,
    )
  },

  getById(id: string | number) {
    return apiRequest<WorkPlan>(`${ENDPOINT}/${id}`)
  },

  create(payload: CreateWorkPlanPayload) {
    return apiRequest<WorkPlan>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  update(id: string | number, payload: UpdateWorkPlanPayload) {
    return apiRequest<WorkPlan>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  remove(id: string | number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
}
