import { ApiError } from "@/services/apiClient"
import type {
  FormState,
  InternalData,
  ProjectMember,
  ProjectType,
  Step,
} from "../types/projectFormWizard"

export const TITLE_MAX = 400
export const LONG_TEXT_MAX = 15000

// Por enquanto, o cadastro de projeto externo fica preservado no código,
// mas indisponível para seleção no fluxo da tela.
export const EXTERNAL_PROJECTS_ENABLED = false

export const categoriasProjeto = [
  "Pesquisa (Externo)",
  "Extensão (Externo)",
  "Inovação (Externo)",
  "Ensino (Externo)",
]

export const subcatNivelI = [
  "Subcategoria Nível I — A",
  "Subcategoria Nível I — B",
  "Subcategoria Nível I — C",
]

export const subcatNivelII = [
  "Subcategoria Nível II — 1",
  "Subcategoria Nível II — 2",
  "Subcategoria Nível II — 3",
]

export const definicoesPI = [
  "Institucional",
  "Compartilhada",
  "Privada",
  "A definir",
]

export const initialMember: ProjectMember = {
  id: "",
  categoria: "",
  userId: "",
  nome: "",
  papel: "",
  email: "",
  cargaHoraria: "",
  cpf: "",
  sexo: "",
  formacao: "",
  tipoExterno: "",
}

export const initialState: FormState = {
  gerais: {
    tipo: null,

    titulo: "",
    title: "",

    palavrasChave: "",
    keywords: "",

    descricaoResumida: "",
    abstract: "",

    introducaoJustificativa: "",
    objetivos: "",
    metodologia: "",
    resultadosEsperados: "",
    referencias: "",

    objetivosDS: [],
    cronograma: [],
    membros: [],

    pdfComplementar: null,
    comprovanteExterno: null,

    editalPesquisa: "",
    unidade: "",
    centro: "",
    periodoIni: "",
    periodoFim: "",
    email: "",
    areaConhecimento: "",
    grandeArea: "",
    area: "",
    subarea: "",
    especialidade: "",
    linhaPesquisa: "",
  },

  interno: {
    vinculadoGrupo: "Não",
    grupoPesquisa: "",
    possuiProtocoloEtica: "Não",
    comiteEticaNome: "",
    protocoloEtica: "",
  },

  externo: {
    categoriaProjeto: "",
    subcategoriaNivelI: "",
    subcategoriaNivelII: "",
    definicaoPropriedadeIntelectual: "",
    tratamentoProducao: "",
  },
}

export function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError || error instanceof Error) return error.message
  return fallback
}

export function splitKeywords(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ]
}

export function getScheduleMonth(
  startDate: string,
  monthNumber: number,
): string {
  const date = new Date(`${startDate}T00:00:00.000Z`)
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + monthNumber - 1)
  return date.toISOString().slice(0, 10)
}

export function validateProjectAttachment(file: File | null): string | null {
  if (!file) return null
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "O arquivo selecionado deve estar no formato PDF."
  }
  if (file.size > 10 * 1024 * 1024) {
    return "O arquivo selecionado deve possuir no máximo 10 MB."
  }
  return null
}

export function isInternalSpecificDataValid(
  linhaPesquisa: string,
  data: InternalData,
): boolean {
  if (!linhaPesquisa.trim()) return false
  if (data.vinculadoGrupo === "Sim" && !data.grupoPesquisa.trim()) return false
  if (data.possuiProtocoloEtica === "Sim") {
    return Boolean(data.comiteEticaNome.trim() && data.protocoloEtica.trim())
  }
  return true
}

export function getProjectDurationInMonths(
  periodoIni: string,
  periodoFim: string,
) {
  if (!periodoIni || !periodoFim) return 12

  const start = new Date(`${periodoIni}T00:00:00`)
  const end = new Date(`${periodoFim}T00:00:00`)

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 12
  }

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1

  return Math.max(1, months)
}

export function formatCronogramaDuration(mesInicio: number, mesFim: number) {
  if (mesInicio === mesFim) return `Mês ${mesInicio}`

  return `Mês ${mesInicio} ao mês ${mesFim}`
}

export type StepValidationFlags = {
  canGoStep2: boolean
  canGoStep3: boolean
  canGoStep4: boolean
  canGoStep5: boolean
  canGoStep6: boolean
  submitted: boolean
}

export function formatProjectTypeLabel(tipo: ProjectType | null): string {
  if (!tipo) return "—"
  if (tipo === "interno") return "Interno"
  return "Externo"
}

export function isSimpleEmail(value: string): boolean {
  const at = value.indexOf("@")
  if (at <= 0) return false
  const domain = value.slice(at + 1)
  const dot = domain.indexOf(".")
  return (
    dot > 0 &&
    dot < domain.length - 1 &&
    !value.includes(" ") &&
    !domain.includes("@")
  )
}

export type FieldErrors = Record<string, string>

/** Pendências da etapa, indexadas pelo rótulo exibido no formulário. */
export function getStepValidationErrors(form: FormState, step: Step): FieldErrors {
  const errors: FieldErrors = {}
  const required = (label: string, value: string) => {
    if (!value.trim()) errors[label] = "Campo obrigatório."
  }
  const g = form.gerais
  if (step === 1 || step === 5) {
    if (g.tipo !== "interno" && !(EXTERNAL_PROJECTS_ENABLED && g.tipo === "externo")) {
      errors["Tipo do projeto"] = "Selecione um tipo de projeto disponível."
    }
  }
  if (step === 2) {
    const fields: Array<[string, string]> = [
      ["Edital de pesquisa", g.editalPesquisa],
      ["Título", g.titulo], ["Title", g.title],
      ["Palavras-chave", g.palavrasChave], ["Keywords", g.keywords],
      ["Resumo", g.descricaoResumida], ["Abstract", g.abstract],
      ["Introdução / justificativa", g.introducaoJustificativa],
      ["Objetivos", g.objetivos], ["Metodologia", g.metodologia],
      ["Resultados esperados", g.resultadosEsperados], ["Referências", g.referencias],
      ["Unidade", g.unidade], ["Grande área", g.grandeArea], ["Área", g.area],
    ]
    fields.forEach(([label, value]) => required(label, value))
    if (!g.areaConhecimento.trim()) errors["Área"] = "Selecione uma área de conhecimento."
    if (!isSimpleEmail(g.email.trim())) {
      errors["E-mail de contato"] = g.email.trim() ? "Informe um e-mail válido" : "Campo obrigatório."
    }
    if (!g.periodoIni || !g.periodoFim) {
      errors["Período do projeto"] = "Informe as datas de início e fim do projeto."
    } else if (g.periodoFim < g.periodoIni) {
      errors["Período do projeto"] = "A data final deve ser igual ou posterior à data inicial."
    }
  }
  if (step === 3) {
    if (!g.cronograma.length) errors["Cronograma"] = "Adicione pelo menos uma atividade ao cronograma."
  }
  if (step === 4) {
    if (!g.membros.length) errors["Membros"] = "Preencha os dados de um membro e clique em Adicionar membro."
    if (g.tipo === "externo" && !g.comprovanteExterno) errors["Comprovante de aprovação/financiamento"] = "Anexe o comprovante obrigatório para projetos externos."
  }
  if (step === 5 && g.tipo === "interno") {
    required("Linha de pesquisa", g.linhaPesquisa)
    if (form.interno.vinculadoGrupo === "Sim") required("Grupo de pesquisa", form.interno.grupoPesquisa)
    if (form.interno.possuiProtocoloEtica === "Sim") {
      required("Comitê de Ética", form.interno.comiteEticaNome)
      required("Nº do protocolo", form.interno.protocoloEtica)
    }
  }
  if (step === 5 && EXTERNAL_PROJECTS_ENABLED && g.tipo === "externo") {
    required("Categoria do projeto", form.externo.categoriaProjeto)
    required("Subcategoria Nível I", form.externo.subcategoriaNivelI)
    required("Subcategoria Nível II", form.externo.subcategoriaNivelII)
    required("Definição da propriedade intelectual", form.externo.definicaoPropriedadeIntelectual)
  }
  return errors
}

export function checkCanGoStep2(form: FormState): boolean {
  return Object.keys(getStepValidationErrors(form, 1)).length === 0
}

export function checkCanGoStep3(form: FormState, canGoStep2: boolean): boolean {
  return canGoStep2 && Object.keys(getStepValidationErrors(form, 2)).length === 0
}

export function checkCanGoStep4(form: FormState, canGoStep3: boolean): boolean {
  return canGoStep3 && Object.keys(getStepValidationErrors(form, 3)).length === 0
}

export function checkCanGoStep5(form: FormState, canGoStep4: boolean): boolean {
  return canGoStep4 && Object.keys(getStepValidationErrors(form, 4)).length === 0
}

export function checkCanGoStep6(form: FormState, canGoStep5: boolean): boolean {
  return canGoStep5 && Object.keys(getStepValidationErrors(form, 5)).length === 0
}

export function checkStepDone(
  currentStep: Step,
  flags: StepValidationFlags,
): boolean {
  const doneByStep: Record<Step, boolean> = {
    1: flags.canGoStep2,
    2: flags.canGoStep3,
    3: flags.canGoStep4,
    4: flags.canGoStep5,
    5: flags.canGoStep6,
    6: flags.submitted,
  }

  return doneByStep[currentStep]
}

export function canAdvanceFromStep(
  step: Step,
  flags: Omit<StepValidationFlags, "submitted">,
): boolean {
  const advanceByStep: Record<Step, boolean> = {
    1: flags.canGoStep2,
    2: flags.canGoStep3,
    3: flags.canGoStep4,
    4: flags.canGoStep5,
    5: flags.canGoStep6,
    6: true,
  }

  return advanceByStep[step]
}
