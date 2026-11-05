// Espelha area_conhecimento: níveis mais específicos vazios indicam um registro de nível superior.
export type KnowledgeArea = {
  id: number
  grandeArea: string
  area: string
  subArea: string
  especialidade: string
}

export type KnowledgeAreaPath = Omit<KnowledgeArea, "id">

export type ConsultantUser = {
  id: number
  nome: string
  email: string
}

// Usuário que pode ser cadastrado como avaliador; `area` vem do cadastro docente, se houver.
export type EligibleUser = ConsultantUser & {
  funcao: string
  area: KnowledgeArea | null
}

export type EvaluatorType = "INTERNO" | "EXTERNO"

export type Titulacao = "GRADUACAO" | "ESPECIALIZACAO" | "MESTRADO" | "DOUTORADO"

// Dados de quem avalia sem ser usuário do sistema (acessa por link)
export type ExternalData = {
  instituicao: string
  titulacao: Titulacao | null
  cpf: string | null
  pais: string | null
  telefone: string | null
  lattesUrl: string | null
  orcid: string | null
  observacao: string | null
}

export type Consultant = {
  id: number
  user: ConsultantUser
  tipo: EvaluatorType
  externo: ExternalData | null
  isPropesq: boolean
  isVoluntario: boolean
  isCnpq: boolean
  areaPrincipal: KnowledgeArea
  areasAdicionais: KnowledgeArea[]
  ativo: boolean
}

// Áreas de avaliação do usuário logado; `consultantId` é nulo enquanto ele não for avaliador.
export type MyEvaluatorAreas = {
  consultantId: number | null
  areaPrincipal: KnowledgeArea | null
  areasAdicionais: KnowledgeArea[]
  updatedAt: string | null
  updatedThisYear: boolean
  suggestedArea: KnowledgeArea | null
}

export type EditalConsultant = Consultant & {
  carga: number
  vinculadoEm: string
}

export type ConsultantFormValues = Omit<
  Consultant,
  "id" | "user" | "areaPrincipal" | "tipo" | "externo"
> & {
  user: ConsultantUser | null
  areaPrincipal: KnowledgeArea | null
}

export type ConsultantStatusFilter = "ALL" | "ACTIVE" | "INACTIVE"

export type ConsultantTypeFilter = "ALL" | EvaluatorType

// Situação do link de acesso mais recente de um avaliador externo
export type ExternalLinkStatus = {
  ativo: boolean
  criadoEm: string | null
  expiraEm: string | null
  ultimoAcessoEm: string | null
}

export type ExternalConsultant = Consultant & { externo: ExternalData; link: ExternalLinkStatus }

// O token só é devolvido na criação e ao gerar um novo link
export type ExternalLink = { url: string; expiraEm: string | null }

export type ExternalFormValues = {
  nome: string
  email: string
  instituicao: string
  titulacao: Titulacao | ""
  cpf: string
  pais: string
  telefone: string
  lattesUrl: string
  orcid: string
  observacao: string
  isVoluntario: boolean
  isCnpq: boolean
  areaPrincipal: KnowledgeArea | null
  areasAdicionais: KnowledgeArea[]
  ativo: boolean
  // Só na criação; vazio = sem validade
  linkExpiraEm: string
}
