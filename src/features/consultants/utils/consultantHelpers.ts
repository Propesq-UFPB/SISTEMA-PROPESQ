import { ApiError } from "@/services/apiClient"
import type { ConsultantPayload } from "../api/consultantService"
import type {
  Consultant,
  ConsultantFormValues,
  KnowledgeAreaPath,
} from "../types/consultant"

export const FUNCAO_LABEL: Record<string, string> = {
  COORDENADOR: "Coordenador",
  GESTOR: "Gestor",
}

export function funcaoLabel(funcao: string) {
  return FUNCAO_LABEL[funcao.toUpperCase()] ?? funcao
}

export const EMPTY_CONSULTANT_FORM: ConsultantFormValues = {
  user: null,
  isPropesq: false,
  isVoluntario: false,
  isCnpq: false,
  areaPrincipal: null,
  areasAdicionais: [],
  ativo: true,
}

export const EMPTY_AREA_PATH: KnowledgeAreaPath = {
  grandeArea: "",
  area: "",
  subArea: "",
  especialidade: "",
}

export function areaPathParts(area: KnowledgeAreaPath | null | undefined) {
  if (!area) return []
  return [area.grandeArea, area.area, area.subArea, area.especialidade].filter(Boolean)
}

export function areaLabel(area: KnowledgeAreaPath | null | undefined) {
  const parts = areaPathParts(area)
  return parts.length > 0 ? parts.join(" › ") : "—"
}

export function toAreaPath(area: KnowledgeAreaPath | null | undefined): KnowledgeAreaPath {
  if (!area) return EMPTY_AREA_PATH
  const { grandeArea, area: areaName, subArea, especialidade } = area
  return { grandeArea, area: areaName, subArea, especialidade }
}

export function toFormValues(consultant: Consultant): ConsultantFormValues {
  const { user, isPropesq, isVoluntario, isCnpq, areaPrincipal, areasAdicionais, ativo } =
    consultant
  return { user, isPropesq, isVoluntario, isCnpq, areaPrincipal, areasAdicionais, ativo }
}

export function consultantTags(consultant: Pick<Consultant, "isPropesq" | "isVoluntario" | "isCnpq">) {
  const tags: string[] = []
  if (consultant.isPropesq) tags.push("PROPESQ")
  if (consultant.isVoluntario) tags.push("Voluntário")
  if (consultant.isCnpq) tags.push("CNPq")
  return tags
}

export function validateConsultantForm(values: ConsultantFormValues) {
  const errors: Partial<Record<"user" | "areaPrincipal", string>> = {}

  if (values.user === null) errors.user = "Selecione o usuário."
  if (values.areaPrincipal === null) {
    errors.areaPrincipal =
      "A área principal é obrigatória: selecione ao menos a grande área e a área."
  }

  return errors
}

export function toConsultantPayload(
  values: ConsultantFormValues,
  editing: boolean,
): ConsultantPayload {
  const principalId = values.areaPrincipal?.id

  return {
    ...(!editing && { usuario_id: values.user?.id }),
    area_principal_id: principalId,
    areas_adicionais_ids: values.areasAdicionais
      .map((area) => area.id)
      .filter((id) => id !== principalId),
    is_propesq: values.isPropesq,
    is_voluntario: values.isVoluntario,
    is_cnpq: values.isCnpq,
    ativo: values.ativo,
  }
}

export function apiErrorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    const msg: unknown = err.payload?.message ?? err.message
    if (Array.isArray(msg)) return msg.join(" ")
    return typeof msg === "string" && msg ? msg : fallback
  }
  return fallback
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
}
