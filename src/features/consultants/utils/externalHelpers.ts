import type { ExternalConsultantPayload } from "../api/consultantService"
import type {
  Consultant,
  ExternalData,
  ExternalFormValues,
  ExternalLinkStatus,
  Titulacao,
} from "../types/consultant"

export const TITULACAO_LABEL: Record<Titulacao, string> = {
  GRADUACAO: "Graduação",
  ESPECIALIZACAO: "Especialização",
  MESTRADO: "Mestrado",
  DOUTORADO: "Doutorado",
}

export const EMPTY_EXTERNAL_FORM: ExternalFormValues = {
  nome: "",
  email: "",
  instituicao: "",
  titulacao: "",
  cpf: "",
  pais: "Brasil",
  telefone: "",
  lattesUrl: "",
  orcid: "",
  observacao: "",
  isVoluntario: false,
  isCnpq: false,
  areaPrincipal: null,
  areasAdicionais: [],
  ativo: true,
  linkExpiraEm: "",
}

export function toExternalFormValues(
  consultant: Consultant & { externo: ExternalData },
): ExternalFormValues {
  const { externo } = consultant
  return {
    nome: consultant.user.nome,
    email: consultant.user.email,
    instituicao: externo.instituicao,
    titulacao: externo.titulacao ?? "",
    cpf: externo.cpf ?? "",
    pais: externo.pais ?? "",
    telefone: externo.telefone ?? "",
    lattesUrl: externo.lattesUrl ?? "",
    orcid: externo.orcid ?? "",
    observacao: externo.observacao ?? "",
    isVoluntario: consultant.isVoluntario,
    isCnpq: consultant.isCnpq,
    areaPrincipal: consultant.areaPrincipal,
    areasAdicionais: consultant.areasAdicionais,
    ativo: consultant.ativo,
    linkExpiraEm: "",
  }
}

export const onlyDigits = (value: string) => value.replace(/\D/g, "")

// Data do campo <input type="date"> (AAAA-MM-DD) como fim do dia, no fuso local
export function endOfDayIso(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day, 23, 59, 59).toISOString()
}

export type ExternalFormErrors = Partial<
  Record<
    "nome" | "email" | "instituicao" | "cpf" | "lattesUrl" | "orcid" | "areaPrincipal" | "linkExpiraEm",
    string
  >
>

export function validateExternalForm(values: ExternalFormValues, now = new Date()) {
  const errors: ExternalFormErrors = {}

  if (!values.nome.trim()) errors.nome = "Informe o nome."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido."
  }
  if (!values.instituicao.trim()) errors.instituicao = "Informe a instituição (filiação)."
  if (values.cpf.trim() && onlyDigits(values.cpf).length !== 11) {
    errors.cpf = "O CPF deve ter 11 dígitos. Deixe em branco para estrangeiros."
  }
  if (values.lattesUrl.trim() && !/^https?:\/\/\S+$/i.test(values.lattesUrl.trim())) {
    errors.lattesUrl = "Informe a URL completa (http:// ou https://)."
  }
  if (values.orcid.trim() && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(values.orcid.trim())) {
    errors.orcid = "Use o formato 0000-0000-0000-0000."
  }
  if (values.areaPrincipal === null) {
    errors.areaPrincipal =
      "A área principal é obrigatória: selecione ao menos a grande área e a área."
  }
  if (values.linkExpiraEm && new Date(endOfDayIso(values.linkExpiraEm)) <= now) {
    errors.linkExpiraEm = "A validade do link deve ser uma data futura."
  }

  return errors
}

/**
 * Na criação, campos opcionais vazios são omitidos. Na edição, vão como null para que
 * o backend limpe o valor anterior.
 */
export function toExternalPayload(
  values: ExternalFormValues,
  editing: boolean,
): ExternalConsultantPayload {
  const optional = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) return trimmed
    return editing ? null : undefined
  }
  const principalId = values.areaPrincipal?.id

  return {
    nome: values.nome.trim(),
    email: values.email.trim(),
    instituicao: values.instituicao.trim(),
    titulacao: values.titulacao || (editing ? null : undefined),
    cpf: optional(onlyDigits(values.cpf)),
    pais: optional(values.pais),
    telefone: optional(values.telefone),
    lattes_url: optional(values.lattesUrl),
    orcid: optional(values.orcid),
    observacao: optional(values.observacao),
    area_principal_id: principalId,
    areas_adicionais_ids: values.areasAdicionais
      .map((area) => area.id)
      .filter((id) => id !== principalId),
    is_voluntario: values.isVoluntario,
    is_cnpq: values.isCnpq,
    ativo: values.ativo,
    ...(!editing && values.linkExpiraEm && { link_expira_em: endOfDayIso(values.linkExpiraEm) }),
  }
}

export function formatDateTime(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function linkStatusLabel(link: ExternalLinkStatus) {
  if (link.ativo) return link.expiraEm ? `Válido até ${formatDateTime(link.expiraEm)}` : "Válido"
  if (!link.criadoEm) return "Nenhum link gerado"
  return "Revogado ou expirado"
}
