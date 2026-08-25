import {
  ApiError,
  apiRequest,
  buildQuery,
  type ApiErrorPayload,
} from "@/services/apiClient"
import type {
  CreateResearchProjectPayload,
  KnowledgeAreaLookup,
  LookupOption,
  MemberCategory,
  MemberLookupBundle,
  PaginatedResponse,
  ResearchGroupLookup,
  ResearchProject,
  ResearchProjectListParams,
  ResearchUserLookup,
  UpdateResearchProjectPayload,
} from "../types/project"

const ENDPOINT = "/research-projects"
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

async function uploadPdf(id: string | number, file: File): Promise<void> {
  const body = new FormData()
  body.append("arquivo", file)
  const headers = new Headers()
  const token = localStorage.getItem("access_token")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${id}/anexo`, {
    method: "POST",
    headers,
    body,
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? ""
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text()
    const payload =
      typeof data === "object" ? (data as ApiErrorPayload) : undefined
    throw new ApiError(
      response.status,
      payload?.message ??
        payload?.error ??
        String(data || "Erro ao enviar arquivo do projeto"),
      payload,
    )
  }
}

export const projectService = {
  list(params: ResearchProjectListParams = {}) {
    return apiRequest<PaginatedResponse<ResearchProject>>(
      `${ENDPOINT}${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0 })}`,
    )
  },
  myEvaluations(params: ResearchProjectListParams = {}) {
    return apiRequest<PaginatedResponse<ResearchProject>>(
      `${ENDPOINT}/my-evaluations${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0 })}`,
    )
  },
  getById(id: string | number) {
    return apiRequest<ResearchProject>(`${ENDPOINT}/${id}`)
  },
  create(payload: CreateResearchProjectPayload) {
    return apiRequest<ResearchProject>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  uploadAttachment(id: string | number, file: File) {
    return uploadPdf(id, file)
  },
  editalLookup() {
    return apiRequest<LookupOption<number>[]>("/editais/lookup")
  },
  academicUnitLookup() {
    return apiRequest<LookupOption<number>[]>("/academic-units/lookup")
  },
  knowledgeAreaLookup(
    params: { grande_area?: string; area?: string; sub_area?: string } = {},
  ) {
    return apiRequest<KnowledgeAreaLookup[]>(
      `/knowledge-areas/lookup${buildQuery(params)}`,
    )
  },
  sustainableDevelopmentGoalsLookup() {
    return apiRequest<LookupOption<number>[]>(
      `${ENDPOINT}/sustainable-development-goals/lookup`,
    )
  },
  researchGroupLookup() {
    return apiRequest<ResearchGroupLookup[]>(
      `${ENDPOINT}/research-groups/lookup`,
    )
  },
  memberLookups() {
    return apiRequest<MemberLookupBundle>(`${ENDPOINT}/members/lookups`)
  },
  userLookup(
    params: {
      categoria?: Exclude<MemberCategory, "EXTERNO">
      funcao?: Exclude<MemberCategory, "EXTERNO">
      search?: string
    } = {},
  ) {
    return apiRequest<ResearchUserLookup[]>(
      `${ENDPOINT}/members/users/lookup${buildQuery(params)}`,
    )
  },
  update(id: string | number, payload: UpdateResearchProjectPayload) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(id: string | number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
  publish(id: string | number) {
    return apiRequest<void>(`${ENDPOINT}/${id}/publish`, { method: "PATCH" })
  },
}
