import { apiRequest } from "@/services/apiClient"

export type ResearchModuleParameters = {
  lateSubmissionToleranceDays: number
  maxRenewalsPerProject: number
  maxProjectDurationMonths: number
  maxQuotaRequestsPerProject: number
  maxWorkPlansPerAdvisor: number
  scholarshipChangeCutoffDay: number
  emailScholarshipChanges: string
  emailInventionNotifications: string
  allowPartialReportsIC: boolean
  allowIndependentENICSummaries: boolean
  enicSummariesPerReviewer: number
  updatedAt?: string
}

export type ResearchModuleParametersPayload = Omit<
  ResearchModuleParameters,
  "updatedAt"
>

const ENDPOINT = "/research-module-parameters"

export const researchParametersService = {
  get() {
    return apiRequest<ResearchModuleParameters>(ENDPOINT)
  },
  update(payload: ResearchModuleParametersPayload) {
    return apiRequest<ResearchModuleParameters>(ENDPOINT, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  },
}
