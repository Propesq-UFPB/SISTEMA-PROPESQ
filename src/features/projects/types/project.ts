export type UserRole = "DISCENTE" | "COORDENADOR" | "GESTOR"

export type ResearchProjectBody = {
  resumo?: string
  abstract?: string
  introducao?: string
  objetivos?: string
  metodologia?: string
  referencias?: string
  resultados_esperados?: string
}

export type ResearchProjectActivity = {
  descricao: string
  meses: string[]
}

export type ResearchProject = {
  id: number
  tipo: string
  codigo: string
  titulo: string
  title: string
  categoria: string
  situacao: string
  objetivos: string[]
  email: string
  data_cadastro: string
  palavras_chave: string[]
  key_words: string[]
  corpo?: ResearchProjectBody
  atividades: ResearchProjectActivity[]
  unidade?: string
  data_inicio?: string
  data_fim?: string
  vigencia?: string
}

export type PaginatedResponse<T> = {
  total: number
  limit: number
  offset: number
  results: T[]
}

export type ResearchProjectListParams = { limit?: number; offset?: number }

export type LookupOption<T extends string | number = number> = {
  id: T
  name: string
}

export type KnowledgeAreaLookup = LookupOption<number> & {
  level: "GRANDE_AREA" | "AREA" | "SUB_AREA" | "ESPECIALIDADE"
}

export type ResearchGroupLookup = LookupOption<number> & {
  linhas: string[]
}

export type MemberCategory =
  | "DOCENTE"
  | "DISCENTE"
  | "TECNICO_ADMINISTRATIVO"
  | "EXTERNO"

export type ResearchUserLookup = LookupOption<number> & {
  email: string
  categoria: Exclude<MemberCategory, "EXTERNO">
}

export type MemberLookupBundle = {
  funcoes: LookupOption<string>[]
  categorias: LookupOption<MemberCategory>[]
  tipos_externos: LookupOption<string>[]
  formacoes_externas: LookupOption<string>[]
  sexos: LookupOption<string>[]
}

export type CreateResearchProjectMemberPayload = {
  user_id: number
  funcao: string
  ch_dedicadas: number
}

export type CreateResearchProjectExternalMemberPayload = {
  funcao: string
  ch_dedicada: number
  cpf?: string
  nome: string
  email: string
  sexo: string
  formacao: string
  tipo: string
}

export type CreateResearchProjectPayload = {
  tipo: string
  titulo: string
  title: string
  edital_id: number
  vigencia: string
  data_inicio?: string
  data_fim?: string
  email: string
  palavras_chave: string[]
  key_words: string[]
  pesquisa_objetivo_ids?: number[]
  corpo_projeto: Required<
    Pick<
      ResearchProjectBody,
      | "resumo"
      | "abstract"
      | "introducao"
      | "objetivos"
      | "metodologia"
      | "referencias"
    >
  >
  atividades: Array<{ descricao: string; meses: Array<{ data: string }> }>
  unidade_id: number
  area_conhecimento_id: number
  linha_pesquisa: string
  vinculado_grupo_pesquisa: boolean
  grupo_pesquisa_id?: number
  possui_comite_etica: boolean
  comite_etica?: string
  numero_protocolo?: string
  membros?: CreateResearchProjectMemberPayload[]
  membros_externos?: CreateResearchProjectExternalMemberPayload[]
}

export type UpdateResearchProjectPayload = Partial<CreateResearchProjectPayload>
