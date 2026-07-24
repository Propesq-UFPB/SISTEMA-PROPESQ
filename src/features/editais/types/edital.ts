export type PaginatedResponse<T> = {
  total: number;
  limit: number;
  offset: number;
  results: T[];
};

export type TipoEdital =
  "PESQUISA" | "EXTENSAO" | "ENSINO_POS_GRADUACAO" | "OUTRO";

export type TitulacaoMin =
  "GRADUACAO" | "ESPECIALIZACAO" | "MESTRADO" | "DOUTORADO";

export type StatusEdital =
  | "RASCUNHO"
  | "PUBLICADO"
  | "ENCERRADO"
  | "ARQUIVADO";

export type StatusInicialEdital = Extract<
  StatusEdital,
  "RASCUNHO" | "PUBLICADO"
>;

export type PeriodoEditalPayload = {
  inicio: string;
  fim: string;
};

export type PeriodoEdital = PeriodoEditalPayload & {
  id: number;
};

export type EditalCotaDistribuicaoPayload = {
  quantidade: number;
  fppi_min: number;
  fppi_max?: number | null;
  media_min_proj: number;
  exige_doutorado: boolean;
  percentual_cotas_novos_doutorandos?: number | null;
  fppi_min_novos_doutorandos?: number | null;
  fppi_max_novos_doutorandos?: number | null;
};

export type EditalCotaDistribuicao = EditalCotaDistribuicaoPayload & {
  id: number;
  id_edital: number;
};

export type EditalCategoria = {
  id: number;
  denominacao: string;
};

export type EditalCotaBolsa = {
  id: number;
  codigo: string | null;
  descricao: string;
  orgao_financiador?: string;
};

export type Edital = {
  id: number;
  codigo: string | null;
  descricao: string;
  status: StatusEdital;
  titulacao_min: TitulacaoMin;
  tipo: TipoEdital;
  limite_solicitacoes_orientador: number;
  limite_planos_orientador: number;
  avaliacao_vigente: boolean;
  apenas_orient_coordena_plano: boolean;
  tec_admin_coord_proj: boolean;
  divulgar_resultado: boolean;
  categoria: EditalCategoria;
  cota_bolsa?: EditalCotaBolsa | null;
  periodo_submissoes: PeriodoEdital;
  periodo_execucao_rel: PeriodoEdital;
  edital_cota_distribuicao: EditalCotaDistribuicao[];
};

export type EditalListItem = {
  id: number;
  titulo: string;
  periodo_execucao: string;
  status: StatusEdital;
};

export type EditalLookup = {
  id: number;
  codigo: string | null;
  descricao: string;
  name: string;
};

export type EditalTypeLookup = {
  id: TipoEdital;
  name: string;
};

export type EditalStatusLookup = {
  id: StatusEdital;
  name: string;
};

export type CotaBolsaLookup = {
  id: number;
  codigo: string | null;
  descricao: string;
  name: string;
};

export type CreateEditalPayload = {
  codigo?: string;
  descricao: string;
  status: StatusInicialEdital;
  titulacao_min: TitulacaoMin;
  tipo: TipoEdital;
  limite_solicitacoes_orientador: number;
  cota_bolsa_id: number;
  limite_planos_orientador: number;
  avaliacao_vigente: boolean;
  apenas_orient_coordena_plano: boolean;
  tec_admin_coord_proj: boolean;
  divulgar_resultado: boolean;
  categoria_id: number;
  edital_cota_distribuicao?: EditalCotaDistribuicaoPayload[];
  periodo_submissao: PeriodoEditalPayload;
  periodo_execucao: PeriodoEditalPayload;
};

export type UpdateEditalPayload = {
  titulo?: string;
  periodo_execucao?: Partial<PeriodoEditalPayload>;
  status?: StatusEdital;
};

export type EditalAttachmentResponse = {
  id: number;
  edital_id: number;
  nome: string;
  tipo: string;
};

export type EditalListParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
