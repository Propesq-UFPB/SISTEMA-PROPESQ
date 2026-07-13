import { apiRequest, buildQuery } from "@/services/apiClient"
import type { CreateResearchProjectPayload, PaginatedResponse, ResearchProject, ResearchProjectListParams, UpdateResearchProjectPayload } from "../types/project"

const ENDPOINT = "/research-projects"

export const projectService = {
  list(params: ResearchProjectListParams = {}) {
    return apiRequest<PaginatedResponse<ResearchProject>>(`${ENDPOINT}${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0 })}`)
  },
  myEvaluations(params: ResearchProjectListParams = {}) {
    return apiRequest<PaginatedResponse<ResearchProject>>(`${ENDPOINT}/my-evaluations${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0 })}`)
  },
  getById(id: string | number) { return apiRequest<ResearchProject>(`${ENDPOINT}/${id}`) },
  create(payload: CreateResearchProjectPayload) {
    return apiRequest<ResearchProject>(ENDPOINT, { method: "POST", body: JSON.stringify(payload) })
  },
  update(id: string | number, payload: UpdateResearchProjectPayload) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
  },
  remove(id: string | number) { return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" }) },
  publish(id: string | number) { return apiRequest<void>(`${ENDPOINT}/${id}/publish`, { method: "PATCH" }) },
}
