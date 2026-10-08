export const CRITERIA_PAGE_SIZE = 10
export const CRITERION_NAME_MAX = 255
const MIN_NUMBER = 0.01

export type AtivoFilter = "ativos" | "inativos" | "todos"

export type CriterionFormValues = {
  nome: string
  descricao: string
  peso: string
  nota_maxima: string
  ativo: boolean
}

export type CriterionFormErrors = Partial<
  Record<"nome" | "peso" | "nota_maxima", string>
>

export type CriterionWritePayload = {
  nome: string
  descricao?: string
  peso: number
  nota_maxima: number
  ativo: boolean
}

export function emptyCriterionForm(): CriterionFormValues {
  return {
    nome: "",
    descricao: "",
    peso: "",
    nota_maxima: "",
    ativo: true,
  }
}

export function criterionToForm(row: {
  nome: string
  descricao: string | null
  peso: number
  nota_maxima: number
  ativo: boolean
}): CriterionFormValues {
  return {
    nome: row.nome,
    descricao: row.descricao ?? "",
    peso: String(row.peso),
    nota_maxima: String(row.nota_maxima),
    ativo: row.ativo,
  }
}

export function ativoFilterToQuery(filter: AtivoFilter): boolean | undefined {
  if (filter === "ativos") return true
  if (filter === "inativos") return false
  return undefined
}

export function validateCriterionForm(values: CriterionFormValues): CriterionFormErrors {
  const errors: CriterionFormErrors = {}
  const nome = values.nome.trim()

  if (!nome) {
    errors.nome = "O nome é obrigatório."
  } else if (nome.length > CRITERION_NAME_MAX) {
    errors.nome = "O nome deve ter no máximo 255 caracteres."
  }

  const pesoError = decimalError(values.peso, "O peso")
  if (pesoError) errors.peso = pesoError

  const notaError = decimalError(values.nota_maxima, "A nota máxima")
  if (notaError) errors.nota_maxima = notaError

  return errors
}

export function toCreatePayload(values: CriterionFormValues): CriterionWritePayload {
  const descricao = values.descricao.trim()
  return {
    nome: values.nome.trim(),
    ...(descricao ? { descricao } : {}),
    peso: parseDecimal(values.peso),
    nota_maxima: parseDecimal(values.nota_maxima),
    ativo: values.ativo,
  }
}

export function toUpdatePayload(values: CriterionFormValues): CriterionWritePayload {
  return {
    nome: values.nome.trim(),
    descricao: values.descricao.trim(),
    peso: parseDecimal(values.peso),
    nota_maxima: parseDecimal(values.nota_maxima),
    ativo: values.ativo,
  }
}

function decimalError(raw: string, label: string): string | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return `${label} deve ser um número.`

  const value = parseDecimal(trimmed)
  if (Number.isNaN(value)) return `${label} deve ser um número.`
  if (value < MIN_NUMBER) return `${label} deve ser no mínimo 0.01.`
  return undefined
}

function parseDecimal(raw: string): number {
  return Number(raw.trim().replace(",", "."))
}
