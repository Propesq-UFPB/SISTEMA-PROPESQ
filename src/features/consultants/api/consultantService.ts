import { apiRequest, buildQuery } from "@/services/apiClient"
import type {
  Consultant,
  ConsultantUser,
  EditalConsultant,
  EligibleUser,
  KnowledgeArea,
} from "../types/consultant"

type AreaConhecimentoResponse = {
  id: number
  grande_area: string
  area: string
  sub_area: string
  especialidade: string
}

type ConsultorResponse = {
  id: number
  usuario: ConsultantUser
  area_principal: AreaConhecimentoResponse
  areas_adicionais: AreaConhecimentoResponse[]
  is_propesq: boolean
  is_voluntario: boolean
  is_cnpq: boolean
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

type EditalConsultorResponse = ConsultorResponse & {
  carga: number
  vinculado_em: string
}

type UsuarioElegivelResponse = ConsultantUser & {
  funcao: string
  area_conhecimento: AreaConhecimentoResponse | null
}

type ConsultorPage = {
  total: number
  limit: number
  offset: number
  results: ConsultorResponse[]
}

export type ConsultantPayload = {
  usuario_id?: number
  area_principal_id?: number
  areas_adicionais_ids?: number[]
  is_propesq?: boolean
  is_voluntario?: boolean
  is_cnpq?: boolean
  ativo?: boolean
}

const ENDPOINT = "/consultores"
const PAGE_SIZE = 100

export function toKnowledgeArea(area: AreaConhecimentoResponse): KnowledgeArea {
  return {
    id: area.id,
    grandeArea: area.grande_area,
    area: area.area,
    subArea: area.sub_area,
    especialidade: area.especialidade,
  }
}

export function toConsultant(row: ConsultorResponse): Consultant {
  return {
    id: row.id,
    user: row.usuario,
    isPropesq: row.is_propesq,
    isVoluntario: row.is_voluntario,
    isCnpq: row.is_cnpq,
    areaPrincipal: toKnowledgeArea(row.area_principal),
    areasAdicionais: row.areas_adicionais.map(toKnowledgeArea),
    ativo: row.ativo,
  }
}

function toEditalConsultant(row: EditalConsultorResponse): EditalConsultant {
  return { ...toConsultant(row), carga: row.carga, vinculadoEm: row.vinculado_em }
}

const editalEndpoint = (editalId: number) => `/editais/${editalId}/consultores`

export const consultantService = {
  // A lista de consultores é pequena; carrega todas as páginas para filtrar no cliente.
  async listAll(params: { ativo?: boolean } = {}) {
    const consultants: Consultant[] = []
    let offset = 0
    let total = Infinity

    while (offset < total) {
      const page = await apiRequest<ConsultorPage>(
        `${ENDPOINT}${buildQuery({ ...params, limit: PAGE_SIZE, offset })}`,
      )
      consultants.push(...page.results.map(toConsultant))
      total = page.total
      offset += PAGE_SIZE
    }

    return consultants
  },
  async eligibleUsers(search?: string) {
    const rows = await apiRequest<UsuarioElegivelResponse[]>(
      `${ENDPOINT}/usuarios-elegiveis${buildQuery({ search })}`,
    )
    return rows.map(
      ({ area_conhecimento, ...user }): EligibleUser => ({
        ...user,
        area: area_conhecimento ? toKnowledgeArea(area_conhecimento) : null,
      }),
    )
  },
  async create(payload: ConsultantPayload) {
    return toConsultant(
      await apiRequest<ConsultorResponse>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    )
  },
  async update(id: number, payload: ConsultantPayload) {
    return toConsultant(
      await apiRequest<ConsultorResponse>(`${ENDPOINT}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    )
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
  async listByEdital(editalId: number) {
    const rows = await apiRequest<EditalConsultorResponse[]>(editalEndpoint(editalId))
    return rows.map(toEditalConsultant)
  },
  async setEditalConsultants(editalId: number, consultorIds: number[]) {
    const rows = await apiRequest<EditalConsultorResponse[]>(editalEndpoint(editalId), {
      method: "PUT",
      body: JSON.stringify({ consultor_ids: consultorIds }),
    })
    return rows.map(toEditalConsultant)
  },
  addToEdital(editalId: number, consultorId: number) {
    return apiRequest<EditalConsultorResponse>(editalEndpoint(editalId), {
      method: "POST",
      body: JSON.stringify({ consultor_id: consultorId }),
    })
  },
  removeFromEdital(editalId: number, consultorId: number) {
    return apiRequest<void>(`${editalEndpoint(editalId)}/${consultorId}`, {
      method: "DELETE",
    })
  },
}
