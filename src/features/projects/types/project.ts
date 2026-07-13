export type UserRole = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"

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

export type CreateResearchProjectPayload = {
  tipo: string
  titulo: string
  title: string
  categoria_id: number
  vigencia: string
  data_inicio?: string
  data_fim?: string
  email: string
  palavras_chave_ids: number[]
  pesquisa_objetivo_ids?: number[]
  corpo_projeto_id: number
  atividade_projeto_pesquisa_ids?: number[]
  unidade_id: number
}

export type UpdateResearchProjectPayload = Partial<CreateResearchProjectPayload>
