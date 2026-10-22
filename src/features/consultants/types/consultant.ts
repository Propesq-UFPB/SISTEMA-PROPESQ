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

// Usuário que pode ser cadastrado como consultor; `area` vem do cadastro docente, se houver.
export type EligibleUser = ConsultantUser & {
  funcao: string
  area: KnowledgeArea | null
}

export type Consultant = {
  id: number
  user: ConsultantUser
  isPropesq: boolean
  isVoluntario: boolean
  isCnpq: boolean
  areaPrincipal: KnowledgeArea
  areasAdicionais: KnowledgeArea[]
  ativo: boolean
}

export type EditalConsultant = Consultant & {
  carga: number
  vinculadoEm: string
}

export type ConsultantFormValues = Omit<Consultant, "id" | "user" | "areaPrincipal"> & {
  user: ConsultantUser | null
  areaPrincipal: KnowledgeArea | null
}

export type ConsultantStatusFilter = "ALL" | "ACTIVE" | "INACTIVE"
