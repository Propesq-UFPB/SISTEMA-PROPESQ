import { apiRequest, buildQuery } from "@/services/apiClient"
import type {
  AvailableWorkPlan,
  WorkPlanInterest,
  WorkPlanCreationProject,
  ScholarshipLookup,
  CreateWorkPlanPayload,
  UpdateWorkPlanPayload,
  WorkPlan,
  WorkPlanListParams,
  WorkPlanPaginatedResponse,
} from "../types/workPlan"

import type { PaginatedResponse } from "@/features/projects/types/project"

const ENDPOINT = "/work-plans"

export const workPlanService = {
  scholarshipLookup() {
    return apiRequest<ScholarshipLookup[]>("/scholarships/lookup")
  },
  creationProjects(params: WorkPlanListParams = {}) {
    return apiRequest<PaginatedResponse<WorkPlanCreationProject>>(
      `${ENDPOINT}/creation-projects${buildQuery({ limit: params.limit ?? 100, offset: params.offset ?? 0 })}`,
    )
  },

  availableForInterest(params: WorkPlanListParams & { pesquisa_id?: number } = {}) {
    return apiRequest<PaginatedResponse<AvailableWorkPlan>>(
      `${ENDPOINT}/available-for-interest${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0, pesquisa_id: params.pesquisa_id })}`,
    )
  },

  registerInterest(id: number) {
    return apiRequest<WorkPlanInterest>(`${ENDPOINT}/${id}/interesses`, {
      method: "POST",
      body: JSON.stringify({}),
    })
  },

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
