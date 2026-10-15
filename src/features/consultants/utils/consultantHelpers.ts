import type {
  Consultant,
  ConsultantFormValues,
  InternalUser,
  InternalUserRole,
  KnowledgeArea,
  KnowledgeAreaPath,
} from "../types/consultant"

// Dados mockados até a API de consultores ficar pronta.
export const internalUsersMock: InternalUser[] = [
  { id: 1, nome: "Ana Beatriz Souza", email: "ana.souza@ufpb.br", papel: "DOCENTE" },
  { id: 2, nome: "Carlos Eduardo Lima", email: "carlos.lima@ufpb.br", papel: "COORDENADOR" },
  { id: 3, nome: "Fernanda Rocha", email: "fernanda.rocha@ufpb.br", papel: "GESTOR" },
  { id: 4, nome: "João Pedro Almeida", email: "joao.almeida@ufpb.br", papel: "DOCENTE" },
  { id: 5, nome: "Mariana Costa", email: "mariana.costa@ufpb.br", papel: "DOCENTE" },
  { id: 6, nome: "Rafael Nascimento", email: "rafael.nascimento@ufpb.br", papel: "COORDENADOR" },
  { id: 7, nome: "Juliana Ferreira", email: "juliana.ferreira@ufpb.br", papel: "DOCENTE" },
  { id: 8, nome: "Paulo Henrique Dias", email: "paulo.dias@ufpb.br", papel: "GESTOR" },
]

type KnowledgeAreaTree = Record<string, Record<string, Record<string, string[]>>>

const knowledgeAreaTreeMock: KnowledgeAreaTree = {
  "Ciências Exatas e da Terra": {
    "Ciência da Computação": {
      "Teoria da Computação": [
        "Computabilidade e Modelos de Computação",
        "Linguagens Formais e Autômatos",
      ],
      "Metodologia e Técnicas da Computação": [
        "Engenharia de Software",
        "Banco de Dados",
        "Sistemas de Informação",
      ],
      "Sistemas de Computação": ["Hardware", "Arquitetura de Sistemas de Computação"],
    },
    Matemática: {
      Álgebra: ["Conjuntos", "Teoria dos Números"],
      Análise: ["Análise Complexa", "Análise Funcional"],
    },
  },
  "Ciências da Saúde": {
    Medicina: {
      "Clínica Médica": ["Cardiologia", "Endocrinologia"],
      Cirurgia: ["Cirurgia Plástica e Restauradora"],
    },
    Enfermagem: {
      "Enfermagem Médico-Cirúrgica": [],
      "Enfermagem de Saúde Pública": [],
    },
  },
  "Ciências Humanas": {
    Educação: {
      "Ensino-Aprendizagem": ["Tecnologia Educacional", "Avaliação da Aprendizagem"],
    },
  },
  "Ciências Sociais Aplicadas": {
    Administração: {
      "Administração de Empresas": ["Mercadologia", "Administração Financeira"],
    },
  },
}

function flattenKnowledgeAreas(tree: KnowledgeAreaTree): KnowledgeArea[] {
  const rows: KnowledgeArea[] = []
  const push = (grandeArea: string, area: string, subArea = "", especialidade = "") =>
    rows.push({ id: rows.length + 1, grandeArea, area, subArea, especialidade })

  for (const [grandeArea, areas] of Object.entries(tree)) {
    for (const [area, subAreas] of Object.entries(areas)) {
      push(grandeArea, area)
      for (const [subArea, especialidades] of Object.entries(subAreas)) {
        push(grandeArea, area, subArea)
        especialidades.forEach((especialidade) =>
          push(grandeArea, area, subArea, especialidade),
        )
      }
    }
  }

  return rows
}

export const knowledgeAreasMock = flattenKnowledgeAreas(knowledgeAreaTreeMock)

function areaIdOf(...path: string[]) {
  const [grandeArea, area, subArea = "", especialidade = ""] = path
  return (
    knowledgeAreasMock.find(
      (row) =>
        row.grandeArea === grandeArea &&
        row.area === area &&
        row.subArea === subArea &&
        row.especialidade === especialidade,
    )?.id ?? 0
  )
}

export const consultantsMock: Consultant[] = [
  {
    id: 1,
    userId: 1,
    tipo: "INTERNO",
    isPropesq: false,
    isVoluntario: true,
    isCnpq: false,
    areaPrincipalId: areaIdOf(
      "Ciências Exatas e da Terra",
      "Ciência da Computação",
      "Metodologia e Técnicas da Computação",
      "Engenharia de Software",
    ),
    areasAdicionaisIds: [
      areaIdOf("Ciências Exatas e da Terra", "Ciência da Computação", "Metodologia e Técnicas da Computação", "Banco de Dados"),
      areaIdOf("Ciências Exatas e da Terra", "Matemática"),
    ],
    ativo: true,
  },
  {
    id: 2,
    userId: 3,
    tipo: "INTERNO",
    isPropesq: true,
    isVoluntario: false,
    isCnpq: false,
    areaPrincipalId: areaIdOf("Ciências Sociais Aplicadas", "Administração", "Administração de Empresas"),
    areasAdicionaisIds: [],
    ativo: true,
  },
  {
    id: 3,
    userId: 5,
    tipo: "INTERNO",
    isPropesq: false,
    isVoluntario: false,
    isCnpq: false,
    areaPrincipalId: areaIdOf("Ciências da Saúde", "Medicina", "Clínica Médica", "Cardiologia"),
    areasAdicionaisIds: [areaIdOf("Ciências da Saúde", "Enfermagem")],
    ativo: false,
  },
]

export const USER_ROLE_LABEL: Record<InternalUserRole, string> = {
  DOCENTE: "Docente",
  COORDENADOR: "Coordenador",
  GESTOR: "Gestor",
}

export const EMPTY_CONSULTANT_FORM: ConsultantFormValues = {
  userId: null,
  tipo: "INTERNO",
  isPropesq: false,
  isVoluntario: false,
  isCnpq: false,
  areaPrincipalId: null,
  areasAdicionaisIds: [],
  ativo: true,
}

export const EMPTY_AREA_PATH: KnowledgeAreaPath = {
  grandeArea: "",
  area: "",
  subArea: "",
  especialidade: "",
}

export function areaPathParts(area: KnowledgeAreaPath | undefined) {
  if (!area) return []
  return [area.grandeArea, area.area, area.subArea, area.especialidade].filter(Boolean)
}

export function areaLabel(area: KnowledgeAreaPath | undefined) {
  const parts = areaPathParts(area)
  return parts.length > 0 ? parts.join(" › ") : "—"
}

// O registro mais específico selecionado; exige ao menos grande área e área.
export function resolveAreaId(areas: KnowledgeArea[], path: KnowledgeAreaPath) {
  if (!path.grandeArea || !path.area) return null

  return (
    areas.find(
      (row) =>
        row.grandeArea === path.grandeArea &&
        row.area === path.area &&
        row.subArea === path.subArea &&
        row.especialidade === path.especialidade,
    )?.id ?? null
  )
}

export function consultantTags(consultant: Consultant) {
  const tags: string[] = []

  if (consultant.tipo === "INTERNO") {
    if (consultant.isPropesq) tags.push("PROPESQ")
    if (consultant.isVoluntario) tags.push("Voluntário")
  } else if (consultant.isCnpq) {
    tags.push("CNPq")
  }

  return tags
}

export function validateConsultantForm(values: ConsultantFormValues) {
  const errors: Partial<Record<"userId" | "areaPrincipalId", string>> = {}

  if (values.userId === null) errors.userId = "Selecione o usuário."
  if (values.areaPrincipalId === null) {
    errors.areaPrincipalId =
      "A área principal é obrigatória: selecione ao menos a grande área e a área."
  }

  return errors
}
