export type ProjectStatus =
  | "APROVADO"
  | "VALIDADO"
  | "SUBMETIDO"
  | "EM ANÁLISE"
  | "REPROVADO";

export type WorkPlanModalidade =
  | "PIBIC"
  | "PIBIC-AF"
  | "PIBITI"
  | "PIVIC"
  | "PIVITI";

export type SelectableProject = {
  id: string;
  codigo: string;
  titulo: string;
  edital: string;
  coordenador: string;
  unidade: string;
  centro: string;
  periodo: string;
  status: ProjectStatus;
  modalidadeBolsa: WorkPlanModalidade;
  totalPlanos: number;
};

export type CronogramaItem = {
  id: string;
  atividade: string;
  mesInicio: number;
  mesFim: number;
};

export type WorkPlanDraft = {
  id: string;
  modalidade: WorkPlanModalidade | "";
  titulo: string;
  title: string;
  solicitarAcaoAfirmativa: boolean;
  periodoIni: string;
  periodoFim: string;
  introducaoJustificativa: string;
  objetivos: string;
  metodologia: string;
  cronogramaAtividades: CronogramaItem[];
  referencias: string;
};

export type ProjectFilters = {
  codigo: string;
  nome: string;
  modalidade: string;
};
