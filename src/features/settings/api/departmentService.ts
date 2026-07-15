import { apiRequest } from "@/services/apiClient"

export type Department = {
  id: number
  sigla: string
  nome: string
  ativo: boolean
  unidade_id: number
}

function endpoint(unitId: number, deptId?: number) {
  const base = `/academic-units/${unitId}/departments`
  return deptId == null ? base : `${base}/${deptId}`
}

export const departmentService = {
  list(unitId: number) {
    return apiRequest<Department[]>(endpoint(unitId))
  },
  create(unitId: number, payload: { sigla: string; nome: string }) {
    return apiRequest<Department>(endpoint(unitId), {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
  update(
    unitId: number,
    deptId: number,
    payload: { sigla?: string; nome?: string; ativo?: boolean },
  ) {
    return apiRequest<Department>(endpoint(unitId, deptId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },
  remove(unitId: number, deptId: number) {
    return apiRequest<void>(endpoint(unitId, deptId), { method: "DELETE" })
  },
}
