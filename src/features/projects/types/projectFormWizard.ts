import type { MemberCategory } from "./project"

export type ProjectType = "interno" | "externo"

export type ODS = {
  id: number
  label: string
}

export type CronogramaItem = {
  id: string
  atividade: string
  mesInicio: number
  mesFim: number
}

export type ProjectMember = {
  id: string
  categoria: MemberCategory | ""
  userId: string
  nome: string
  papel: string
  email: string
  cargaHoraria: string
  cpf: string
  sexo: string
  formacao: string
  tipoExterno: string
}

export type GeneralData = {
  tipo: ProjectType | null

  titulo: string
  title: string

  palavrasChave: string
  keywords: string

  descricaoResumida: string
  abstract: string

  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  resultadosEsperados: string
  referencias: string

  objetivosDS: ODS[]
  cronograma: CronogramaItem[]
  membros: ProjectMember[]

  pdfComplementar: File | null
  comprovanteExterno: File | null

  editalPesquisa: string
  unidade: string
  centro: string
  periodoIni: string
  periodoFim: string
  email: string
  areaConhecimento: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  linhaPesquisa: string
}

export type InternalData = {
  vinculadoGrupo: "Sim" | "Não"
  grupoPesquisa: string

  possuiProtocoloEtica: "Sim" | "Não"
  comiteEticaNome: string
  protocoloEtica: string
}

export type ExternalData = {
  categoriaProjeto: string
  subcategoriaNivelI: string
  subcategoriaNivelII: string
  definicaoPropriedadeIntelectual: string
  tratamentoProducao: string
}

export type FormState = {
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
}

export type Step = 1 | 2 | 3 | 4 | 5 | 6
