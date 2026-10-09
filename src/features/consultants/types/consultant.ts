export type ConsultantType = "INTERNO" | "EXTERNO"

export type InternalUserRole = "DOCENTE" | "COORDENADOR" | "GESTOR"

export type InternalUser = {
  id: number
  nome: string
  email: string
  papel: InternalUserRole
}

// Espelha area_conhecimento: níveis mais específicos vazios indicam um registro de nível superior.
export type KnowledgeArea = {
  id: number
  grandeArea: string
  area: string
  subArea: string
  especialidade: string
}

export type KnowledgeAreaPath = Omit<KnowledgeArea, "id">

export type Consultant = {
  id: number
  userId: number
  tipo: ConsultantType
  isPropesq: boolean
  isVoluntario: boolean
  isCnpq: boolean
  areaPrincipalId: number
  areasAdicionaisIds: number[]
  ativo: boolean
}

export type ConsultantFormValues = Omit<Consultant, "id" | "userId" | "areaPrincipalId"> & {
  userId: number | null
  areaPrincipalId: number | null
}

export type ConsultantTypeFilter = "ALL" | ConsultantType
export type ConsultantStatusFilter = "ALL" | "ACTIVE" | "INACTIVE"
