import { apiRequest, buildQuery } from "@/services/apiClient"
import type {
  Consultant,
  ConsultantUser,
  EditalConsultant,
  EligibleUser,
  KnowledgeArea,
  MyEvaluatorAreas,
} from "../types/consultant"

type AreaConhecimentoResponse = {
  id: number
  grande_area: string
  area: string
  sub_area: string
  especialidade: string
}

type AvaliadorResponse = {
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

type EditalAvaliadorResponse = AvaliadorResponse & {
  carga: number
  vinculado_em: string
}

type UsuarioElegivelResponse = ConsultantUser & {
  funcao: string
  area_conhecimento: AreaConhecimentoResponse | null
}

type MinhasAreasResponse = {
  avaliador_cadastro_id: number | null
  area_principal: AreaConhecimentoResponse | null
  areas_adicionais: AreaConhecimentoResponse[]
  areas_atualizadas_em: string | null
  atualizado_no_ano: boolean
  area_sugerida: AreaConhecimentoResponse | null
}

type AvaliadorPage = {
  total: number
  limit: number
  offset: number
  results: AvaliadorResponse[]
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

const ENDPOINT = "/avaliadores"
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

export function toConsultant(row: AvaliadorResponse): Consultant {
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

export function toMyEvaluatorAreas(row: MinhasAreasResponse): MyEvaluatorAreas {
  return {
    consultantId: row.avaliador_cadastro_id,
    areaPrincipal: row.area_principal && toKnowledgeArea(row.area_principal),
    areasAdicionais: row.areas_adicionais.map(toKnowledgeArea),
    updatedAt: row.areas_atualizadas_em,
    updatedThisYear: row.atualizado_no_ano,
    suggestedArea: row.area_sugerida && toKnowledgeArea(row.area_sugerida),
  }
}

function toEditalConsultant(row: EditalAvaliadorResponse): EditalConsultant {
  return { ...toConsultant(row), carga: row.carga, vinculadoEm: row.vinculado_em }
}

const editalEndpoint = (editalId: number) => `/editais/${editalId}/avaliadores`

export const consultantService = {
  // A lista de avaliadores é pequena; carrega todas as páginas para filtrar no cliente.
  async listAll(params: { ativo?: boolean } = {}) {
    const consultants: Consultant[] = []
    let offset = 0
    let total = Infinity

    while (offset < total) {
      const page = await apiRequest<AvaliadorPage>(
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
      await apiRequest<AvaliadorResponse>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    )
  },
  async update(id: number, payload: ConsultantPayload) {
    return toConsultant(
      await apiRequest<AvaliadorResponse>(`${ENDPOINT}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    )
  },
  async myAreas() {
    return toMyEvaluatorAreas(await apiRequest<MinhasAreasResponse>(`${ENDPOINT}/me`))
  },
  async updateMyAreas(payload: { area_principal_id: number; areas_adicionais_ids: number[] }) {
    return toMyEvaluatorAreas(
      await apiRequest<MinhasAreasResponse>(`${ENDPOINT}/me`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    )
  },
  remove(id: number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" })
  },
  async listByEdital(editalId: number) {
    const rows = await apiRequest<EditalAvaliadorResponse[]>(editalEndpoint(editalId))
    return rows.map(toEditalConsultant)
  },
  async setEditalConsultants(editalId: number, avaliadorIds: number[]) {
    const rows = await apiRequest<EditalAvaliadorResponse[]>(editalEndpoint(editalId), {
      method: "PUT",
      body: JSON.stringify({ avaliador_cadastro_ids: avaliadorIds }),
    })
    return rows.map(toEditalConsultant)
  },
  addToEdital(editalId: number, avaliadorId: number) {
    return apiRequest<EditalAvaliadorResponse>(editalEndpoint(editalId), {
      method: "POST",
      body: JSON.stringify({ avaliador_cadastro_id: avaliadorId }),
    })
  },
  removeFromEdital(editalId: number, avaliadorId: number) {
    return apiRequest<void>(`${editalEndpoint(editalId)}/${avaliadorId}`, {
      method: "DELETE",
    })
  },
}
