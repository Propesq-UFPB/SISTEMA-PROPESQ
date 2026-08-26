import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FileUp,
  GraduationCap,
  Hash,
  Layers,
  Lock,
  Plus,
  RefreshCcw,
  Save,
  Tags,
  Trash2,
  Upload,
  Users,
} from "lucide-react"
import { Helmet } from "react-helmet"
import { ApiError } from "@/services/apiClient"
import { projectService } from "../api/projectService"
import type {
  KnowledgeAreaLookup,
  LookupOption,
  MemberCategory,
  MemberLookupBundle,
  ResearchGroupLookup,
  ResearchUserLookup,
} from "../types/project"

/* ================= TIPOS ================= */

type ProjectType = "interno" | "externo"

type ODS = {
  id: number
  label: string
}

type CronogramaItem = {
  id: string
  atividade: string
  mesInicio: number
  mesFim: number
}

type ProjectMember = {
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

type GeneralData = {
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

type InternalData = {
  vinculadoGrupo: "Sim" | "Não"
  grupoPesquisa: string

  possuiProtocoloEtica: "Sim" | "Não"
  comiteEticaNome: string
  protocoloEtica: string
}

type ExternalData = {
  categoriaProjeto: string
  subcategoriaNivelI: string
  subcategoriaNivelII: string
  definicaoPropriedadeIntelectual: string
  tratamentoProducao: string
}

type FormState = {
  gerais: GeneralData
  interno: InternalData
  externo: ExternalData
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

/* ================= CONSTANTES ================= */

const TITLE_MAX = 400
const LONG_TEXT_MAX = 15000

// Por enquanto, o cadastro de projeto externo fica preservado no código,
// mas indisponível para seleção no fluxo da tela.
const EXTERNAL_PROJECTS_ENABLED = false

const _centros = ["CCHLA", "CCEN", "CT", "CCS", "CE", "CCTA"]

const _unidades = [
  "Departamento A",
  "Departamento B",
  "Laboratório X",
  "Programa Y",
]

const _editais = [
  "Edital 01/2026",
  "Edital 02/2026",
  "PIBIC 2026",
  "PIBITI 2026",
  "PIVIC 2026",
  "PROBEX 2026",
]

type CnpqSubarea = {
  codigo: string
  nome: string
}

type CnpqArea = {
  codigo: string
  nome: string
  subareas: CnpqSubarea[]
}

type CnpqGrandeArea = {
  codigo: string
  nome: string
  areas: CnpqArea[]
}

const cnpqAreasConhecimento: CnpqGrandeArea[] = [
  {
    codigo: "10000003",
    nome: "Ciências Exatas e da Terra",
    areas: [
      {
        codigo: "10100008",
        nome: "Matemática",
        subareas: [
          { codigo: "10101004", nome: "Álgebra" },
          { codigo: "10102000", nome: "Análise" },
          { codigo: "10103007", nome: "Geometria e Topologia" },
          { codigo: "10104003", nome: "Matemática Aplicada" },
        ],
      },
      {
        codigo: "10200002",
        nome: "Probabilidade e Estatística",
        subareas: [
          { codigo: "10201009", nome: "Probabilidade" },
          { codigo: "10202005", nome: "Estatística" },
          { codigo: "10203001", nome: "Probabilidade e Estatística Aplicadas" },
        ],
      },
      {
        codigo: "10300007",
        nome: "Ciência da Computação",
        subareas: [
          { codigo: "10301003", nome: "Teoria da Computação" },
          { codigo: "10302000", nome: "Matemática da Computação" },
          { codigo: "10303006", nome: "Metodologia e Técnicas da Computação" },
          { codigo: "10304002", nome: "Sistemas de Computação" },
        ],
      },
      {
        codigo: "10400001",
        nome: "Astronomia",
        subareas: [
          {
            codigo: "10401008",
            nome: "Astronomia de Posição e Mecânica Celeste",
          },
          { codigo: "10402004", nome: "Astrofísica Estelar" },
          { codigo: "10403000", nome: "Astrofísica do Meio Interestelar" },
          { codigo: "10404007", nome: "Astrofísica Extragalactica" },
          { codigo: "10405003", nome: "Astrofísica do Sistema Solar" },
          { codigo: "10406000", nome: "Instrumentação Astronômica" },
        ],
      },
      {
        codigo: "10500006",
        nome: "Física",
        subareas: [
          { codigo: "10501002", nome: "Física Geral" },
          {
            codigo: "10502009",
            nome: "Áreas Clássicas de Fenomenologia e suas Aplicações",
          },
          {
            codigo: "10503005",
            nome: "Física das Partículas Elementares e Campos",
          },
          { codigo: "10504001", nome: "Física Nuclear" },
          { codigo: "10505008", nome: "Física Atômica e Molecular" },
          {
            codigo: "10506004",
            nome: "Física dos Fluídos, Física de Plasmas e Descargas Elétricas",
          },
          { codigo: "10507000", nome: "Física da Matéria Condensada" },
        ],
      },
      {
        codigo: "10600000",
        nome: "Química",
        subareas: [
          { codigo: "10601007", nome: "Química Orgânica" },
          { codigo: "10602003", nome: "Química Inorgânica" },
          { codigo: "10603000", nome: "Físico-Química" },
          { codigo: "10604006", nome: "Química Analítica" },
        ],
      },
      {
        codigo: "10700005",
        nome: "Geociências",
        subareas: [
          { codigo: "10701001", nome: "Geologia" },
          { codigo: "10702008", nome: "Geofísica" },
          { codigo: "10703004", nome: "Meteorologia" },
          { codigo: "10704000", nome: "Geodésia" },
          { codigo: "10705007", nome: "Geografia Física" },
        ],
      },
      {
        codigo: "10800000",
        nome: "Oceanografia",
        subareas: [
          { codigo: "10801006", nome: "Oceanografia Biológica" },
          { codigo: "10802002", nome: "Oceanografia Física" },
          { codigo: "10803009", nome: "Oceanografia Química" },
          { codigo: "10804005", nome: "Oceanografia Geológica" },
        ],
      },
    ],
  },
  {
    codigo: "20000006",
    nome: "Ciências Biológicas",
    areas: [
      {
        codigo: "20100000",
        nome: "Biologia Geral",
        subareas: [],
      },
      {
        codigo: "20200005",
        nome: "Genética",
        subareas: [
          { codigo: "20201001", nome: "Genética Quantitativa" },
          {
            codigo: "20202008",
            nome: "Genética Molecular e de Microorganismos",
          },
          { codigo: "20203004", nome: "Genética Vegetal" },
          { codigo: "20204000", nome: "Genética Animal" },
          { codigo: "20205007", nome: "Genética Humana e Médica" },
          { codigo: "20206003", nome: "Mutagênese" },
        ],
      },
      {
        codigo: "20300000",
        nome: "Botânica",
        subareas: [
          { codigo: "20301006", nome: "Paleobotânica" },
          { codigo: "20302002", nome: "Morfologia Vegetal" },
          { codigo: "20303009", nome: "Fisiologia Vegetal" },
          { codigo: "20304005", nome: "Taxonomia Vegetal" },
          { codigo: "20305001", nome: "Fitogeografia" },
          { codigo: "20306008", nome: "Botânica Aplicada" },
        ],
      },
      {
        codigo: "20400004",
        nome: "Zoologia",
        subareas: [
          { codigo: "20401000", nome: "Paleozoologia" },
          { codigo: "20402007", nome: "Morfologia dos Grupos Recentes" },
          { codigo: "20403003", nome: "Fisiologia dos Grupos Recentes" },
          { codigo: "20404000", nome: "Comportamento Animal" },
          { codigo: "20405006", nome: "Taxonomia dos Grupos Recentes" },
          { codigo: "20406002", nome: "Zoologia Aplicada" },
        ],
      },
      {
        codigo: "20500009",
        nome: "Ecologia",
        subareas: [
          { codigo: "20501005", nome: "Ecologia Teórica" },
          { codigo: "20502001", nome: "Ecologia de Ecossistemas" },
          { codigo: "20503008", nome: "Ecologia Aplicada" },
        ],
      },
      {
        codigo: "20600003",
        nome: "Morfologia",
        subareas: [
          { codigo: "20601000", nome: "Citologia e Biologia Celular" },
          { codigo: "20602006", nome: "Embriologia" },
          { codigo: "20603002", nome: "Histologia" },
          { codigo: "20604009", nome: "Anatomia" },
        ],
      },
      {
        codigo: "20700008",
        nome: "Fisiologia",
        subareas: [
          { codigo: "20701004", nome: "Fisiologia Geral" },
          { codigo: "20702000", nome: "Fisiologia de Órgãos e Sistemas" },
          { codigo: "20703007", nome: "Fisiologia do Esforço" },
          { codigo: "20704003", nome: "Fisiologia Comparada" },
        ],
      },
      {
        codigo: "20800002",
        nome: "Bioquímica",
        subareas: [
          { codigo: "20801009", nome: "Química de Macromoléculas" },
          { codigo: "20802005", nome: "Bioquímica dos Microorganismos" },
          { codigo: "20803001", nome: "Metabolismo e Bioenergética" },
          { codigo: "20804008", nome: "Biologia Molecular" },
          { codigo: "20805004", nome: "Enzimologia" },
        ],
      },
      {
        codigo: "20900007",
        nome: "Biofísica",
        subareas: [
          { codigo: "20901003", nome: "Biofísica Molecular" },
          { codigo: "20902000", nome: "Biofísica Celular" },
          { codigo: "20903006", nome: "Biofísica de Processos e Sistemas" },
          { codigo: "20904002", nome: "Radiologia e Fotobiologia" },
        ],
      },
      {
        codigo: "21000000",
        nome: "Farmacologia",
        subareas: [
          { codigo: "21001006", nome: "Farmacologia Geral" },
          { codigo: "21002002", nome: "Farmacologia Autonômica" },
          { codigo: "21003009", nome: "Neuropsicofarmacologia" },
          { codigo: "21004005", nome: "Farmacologia Cardiorenal" },
          { codigo: "21005001", nome: "Farmacologia Bioquímica e Molecular" },
          { codigo: "21006008", nome: "Etnofarmacologia" },
          { codigo: "21007004", nome: "Toxicologia" },
          { codigo: "21008000", nome: "Farmacologia Clínica" },
        ],
      },
      {
        codigo: "21100004",
        nome: "Imunologia",
        subareas: [
          { codigo: "21101000", nome: "Imunoquímica" },
          { codigo: "21102007", nome: "Imunologia Celular" },
          { codigo: "21103003", nome: "Imunogenética" },
          { codigo: "21104000", nome: "Imunologia Aplicada" },
        ],
      },
      {
        codigo: "21200009",
        nome: "Microbiologia",
        subareas: [
          {
            codigo: "21201005",
            nome: "Biologia e Fisiologia dos Microorganismos",
          },
          { codigo: "21202001", nome: "Microbiologia Aplicada" },
        ],
      },
      {
        codigo: "21300003",
        nome: "Parasitologia",
        subareas: [
          { codigo: "21301000", nome: "Protozoologia de Parasitos" },
          { codigo: "21302006", nome: "Helmintologia de Parasitos" },
          {
            codigo: "21303002",
            nome: "Entomologia e Malacologia de Parasitos e Vetores",
          },
        ],
      },
      {
        codigo: "21400008",
        nome: "Biotecnologia",
        subareas: [
          {
            codigo: "21401004",
            nome: "Biotecnologia em Saúde Humana e Animal",
          },
          { codigo: "21402000", nome: "Biotecnologia Industrial" },
          { codigo: "21403007", nome: "Biotecnologia Vegetal" },
          {
            codigo: "21404003",
            nome: "Biotecnologia Ambiental e Recursos Naturais",
          },
        ],
      },
    ],
  },
  {
    codigo: "30000009",
    nome: "Engenharias",
    areas: [
      {
        codigo: "30100003",
        nome: "Engenharia Civil",
        subareas: [
          { codigo: "30101000", nome: "Construção Civil" },
          { codigo: "30102006", nome: "Estruturas" },
          { codigo: "30103002", nome: "Geotécnica" },
          { codigo: "30104009", nome: "Engenharia Hidráulica" },
          { codigo: "30105005", nome: "Infra-Estrutura de Transportes" },
        ],
      },
      {
        codigo: "30200008",
        nome: "Engenharia de Minas",
        subareas: [
          { codigo: "30201004", nome: "Pesquisa Mineral" },
          { codigo: "30202000", nome: "Lavra" },
          { codigo: "30203007", nome: "Tratamento de Minérios" },
        ],
      },
      {
        codigo: "30300002",
        nome: "Engenharia de Materiais e Metalúrgica",
        subareas: [
          {
            codigo: "30301009",
            nome: "Instalações e Equipamentos Metalúrgicos",
          },
          { codigo: "30302005", nome: "Metalurgia Extrativa" },
          { codigo: "30303001", nome: "Metalurgia de Transformação" },
          { codigo: "30304008", nome: "Metalurgia Física" },
          { codigo: "30305004", nome: "Materiais Não-Metálicos" },
        ],
      },
      {
        codigo: "30400007",
        nome: "Engenharia Elétrica",
        subareas: [
          { codigo: "30401003", nome: "Materiais Elétricos" },
          {
            codigo: "30402000",
            nome: "Medidas Elétricas, Magnéticas e Eletrônicas; Instrumentação",
          },
          {
            codigo: "30403006",
            nome: "Circuitos Elétricos, Magnéticos e Eletrônicos",
          },
          { codigo: "30404002", nome: "Sistemas Elétricos de Potência" },
          {
            codigo: "30405009",
            nome: "Eletrônica Industrial, Sistemas e Controles Eletrônicos",
          },
          { codigo: "30406005", nome: "Telecomunicações" },
        ],
      },
      {
        codigo: "30500001",
        nome: "Engenharia Mecânica",
        subareas: [
          { codigo: "30501008", nome: "Fenômenos de Transporte" },
          { codigo: "30502004", nome: "Engenharia Térmica" },
          { codigo: "30503000", nome: "Mecânica dos Sólidos" },
          { codigo: "30504007", nome: "Projetos de Máquinas" },
          { codigo: "30505003", nome: "Processos de Fabricação" },
        ],
      },
      {
        codigo: "30600006",
        nome: "Engenharia Química",
        subareas: [
          {
            codigo: "30604001",
            nome: "Engenharia de Reações Químicas e Catálise",
          },
          {
            codigo: "30605008",
            nome: "Engenharia de Separações e Termodinâmica",
          },
          {
            codigo: "30606004",
            nome: "Fenômenos de Transporte, Materiais e Particulados",
          },
          {
            codigo: "30607000",
            nome: "Modelagem, Simulação, Síntese, Otimização e Controle de Processos",
          },
          {
            codigo: "30608007",
            nome: "Processos Ambientais e Tecnologias Limpas",
          },
          { codigo: "30609003", nome: "Processos Biotecnológicos e Alimentos" },
        ],
      },
      {
        codigo: "30700000",
        nome: "Engenharia Sanitária",
        subareas: [
          { codigo: "30701007", nome: "Recursos Hídricos" },
          {
            codigo: "30702003",
            nome: "Tratamento de Águas de Abastecimento e Residuárias",
          },
          { codigo: "30703000", nome: "Saneamento Básico" },
          { codigo: "30704006", nome: "Saneamento Ambiental" },
        ],
      },
      {
        codigo: "30800005",
        nome: "Engenharia de Produção",
        subareas: [
          { codigo: "30801001", nome: "Gerência de Produção" },
          { codigo: "30802008", nome: "Pesquisa Operacional" },
          { codigo: "30803004", nome: "Engenharia do Produto" },
          { codigo: "30804000", nome: "Engenharia Econômica" },
        ],
      },
      {
        codigo: "30900000",
        nome: "Engenharia Nuclear",
        subareas: [
          { codigo: "30901006", nome: "Aplicações de Radioisótopos" },
          { codigo: "30902002", nome: "Fusão Controlada" },
          { codigo: "30903009", nome: "Combustível Nuclear" },
          { codigo: "30904005", nome: "Tecnologia dos Reatores" },
        ],
      },
      {
        codigo: "31000002",
        nome: "Engenharia de Transportes",
        subareas: [
          { codigo: "31001009", nome: "Planejamento de Transportes" },
          { codigo: "31002005", nome: "Veículos e Equipamentos de Controle" },
          { codigo: "31003001", nome: "Operações de Transportes" },
        ],
      },
      {
        codigo: "31100007",
        nome: "Engenharia Naval e Oceânica",
        subareas: [
          {
            codigo: "31101003",
            nome: "Hidrodinâmica de Navios e Sistemas Oceânicos",
          },
          { codigo: "31102000", nome: "Estruturas Navais e Oceânicas" },
          { codigo: "31103006", nome: "Máquinas Marítimas" },
          {
            codigo: "31104002",
            nome: "Projeto de Navios e de Sistemas Oceânicos",
          },
          {
            codigo: "31105009",
            nome: "Tecnologia de Construção Naval e de Sistemas Oceânicos",
          },
        ],
      },
      {
        codigo: "31200001",
        nome: "Engenharia Aeroespacial",
        subareas: [
          { codigo: "31201008", nome: "Aerodinâmica" },
          { codigo: "31202004", nome: "Dinâmica de Voo" },
          { codigo: "31203000", nome: "Estruturas Aeroespaciais" },
          {
            codigo: "31204007",
            nome: "Materiais e Processos para Engenharia Aeronáutica e Aeroespacial",
          },
          { codigo: "31205003", nome: "Propulsão Aeroespacial" },
          { codigo: "31206000", nome: "Sistemas Aeroespaciais" },
        ],
      },
      {
        codigo: "31300006",
        nome: "Engenharia Biomédica",
        subareas: [
          { codigo: "31301002", nome: "Bioengenharia" },
          { codigo: "31302009", nome: "Engenharia Médica" },
        ],
      },
      {
        codigo: "31400000",
        nome: "Engenharia de Energia",
        subareas: [
          { codigo: "31401007", nome: "Planejamento Energético" },
          { codigo: "31402003", nome: "Fontes Renováveis de Energia" },
        ],
      },
    ],
  },
  {
    codigo: "40000001",
    nome: "Ciências da Saúde",
    areas: [
      {
        codigo: "40100006",
        nome: "Medicina",
        subareas: [
          { codigo: "40101002", nome: "Clínica Médica" },
          { codigo: "40102009", nome: "Cirurgia" },
          { codigo: "40103005", nome: "Saúde Materno-Infantil" },
          { codigo: "40104001", nome: "Psiquiatria" },
          {
            codigo: "40105008",
            nome: "Anatomia Patológica e Patologia Clínica",
          },
          { codigo: "40106004", nome: "Radiologia Médica" },
          { codigo: "40107000", nome: "Medicina Legal e Deontologia" },
        ],
      },
      {
        codigo: "40200000",
        nome: "Odontologia",
        subareas: [
          { codigo: "40201007", nome: "Clínica Odontológica" },
          { codigo: "40202003", nome: "Cirurgia Buco-Maxilo-Facial" },
          { codigo: "40203000", nome: "Ortodontia" },
          { codigo: "40204006", nome: "Odontopediatria" },
          { codigo: "40205002", nome: "Periodontia" },
          { codigo: "40206009", nome: "Endodontia" },
          { codigo: "40207005", nome: "Radiologia Odontológica" },
          { codigo: "40208001", nome: "Odontologia Social e Preventiva" },
          { codigo: "40209008", nome: "Materiais Odontológicos" },
        ],
      },
      {
        codigo: "40300005",
        nome: "Farmácia",
        subareas: [
          {
            codigo: "40301001",
            nome: "Farmacotécnica e tecnologia farmacêutica",
          },
          { codigo: "40302008", nome: "Farmacognosia" },
          { codigo: "40303004", nome: "Avaliação e analises toxicológicas" },
          {
            codigo: "40304000",
            nome: "Garantia e controle de qualidade farmacêuticos",
          },
          {
            codigo: "40306003",
            nome: "Fisiopatologia e diagnóstico laboratorial",
          },
          {
            codigo: "40307000",
            nome: "Farmácia clínica, assistência e atenção farmacêuticas",
          },
          { codigo: "40308006", nome: "Química Farmacêutica Medicinal" },
        ],
      },
      {
        codigo: "40400000",
        nome: "Enfermagem",
        subareas: [
          {
            codigo: "40401006",
            nome: "Enfermagem em Saúde do Adulto e do Idoso",
          },
          { codigo: "40402002", nome: "Enfermagem em Saúde da Mulher" },
          {
            codigo: "40403009",
            nome: "Enfermagem em Saúde da Criança e do Adolescente",
          },
          { codigo: "40404005", nome: "Enfermagem em Saúde Mental" },
          {
            codigo: "40405001",
            nome: "Enfermagem em Doenças Emergentes, Reemergentes e Negligenciadas",
          },
          { codigo: "40406008", nome: "Enfermagem em Saúde Coletiva" },
          { codigo: "40407004", nome: "Enfermagem Fundamental" },
          { codigo: "40408000", nome: "Enfermagem na Gestão e Gerenciamento" },
        ],
      },
      {
        codigo: "40500004",
        nome: "Nutrição",
        subareas: [
          { codigo: "40505006", nome: "Alimentos e alimentação coletiva" },
          {
            codigo: "40506002",
            nome: "Ciências humanas e sociais em alimentação e nutrição",
          },
          {
            codigo: "40507009",
            nome: "Epidemiologia e políticas de alimentação e nutrição",
          },
          { codigo: "40508005", nome: "Nutrição básica e experimental" },
          { codigo: "40509001", nome: "Nutrição clínica" },
        ],
      },
      {
        codigo: "40600009",
        nome: "Saúde Coletiva",
        subareas: [
          { codigo: "40601005", nome: "Epidemiologia" },
          {
            codigo: "40604004",
            nome: "Ciências Sociais e Humanidades em Saúde",
          },
          {
            codigo: "40605000",
            nome: "Política, Planejamento, Gestão e Avaliação",
          },
        ],
      },
      {
        codigo: "40700003",
        nome: "Fonoaudiologia",
        subareas: [],
      },
      {
        codigo: "40800008",
        nome: "Fisioterapia e Terapia Ocupacional",
        subareas: [],
      },
      {
        codigo: "40900002",
        nome: "Educação Física",
        subareas: [],
      },
    ],
  },
  {
    codigo: "50000004",
    nome: "Ciências Agrárias",
    areas: [
      {
        codigo: "50100009",
        nome: "Agronomia",
        subareas: [
          { codigo: "50101005", nome: "Ciência do Solo" },
          { codigo: "50102001", nome: "Fitossanidade" },
          { codigo: "50103008", nome: "Fitotecnia" },
          { codigo: "50104004", nome: "Floricultura, Parques e Jardins" },
          { codigo: "50105000", nome: "Agrometeorologia" },
          { codigo: "50106007", nome: "Extensão Rural" },
        ],
      },
      {
        codigo: "50200003",
        nome: "Recursos Florestais e Engenharia Florestal",
        subareas: [
          { codigo: "50201000", nome: "Silvicultura" },
          { codigo: "50202006", nome: "Manejo Florestal" },
          { codigo: "50203002", nome: "Técnicas e Operações Florestais" },
          {
            codigo: "50204009",
            nome: "Tecnologia e Utilização de Produtos Florestais",
          },
          { codigo: "50205005", nome: "Conservação da Natureza" },
          { codigo: "50206001", nome: "Energia de Biomassa Florestal" },
        ],
      },
      {
        codigo: "50300008",
        nome: "Engenharia Agrícola",
        subareas: [
          { codigo: "50301004", nome: "Máquinas e Implementos Agrícolas" },
          { codigo: "50302000", nome: "Engenharia de Água e Solo" },
          {
            codigo: "50303007",
            nome: "Engenharia de Processamento de Produtos Agrícolas",
          },
          { codigo: "50304003", nome: "Construções Rurais e Ambiência" },
          { codigo: "50305000", nome: "Energização Rural" },
        ],
      },
      {
        codigo: "50400002",
        nome: "Zootecnia",
        subareas: [
          {
            codigo: "50401009",
            nome: "Ecologia dos Animais Domésticos e Etologia",
          },
          {
            codigo: "50402005",
            nome: "Genética e Melhoramento dos Animais Domésticos",
          },
          { codigo: "50403001", nome: "Nutrição e Alimentação Animal" },
          { codigo: "50404008", nome: "Pastagem e Forragicultura" },
          { codigo: "50405004", nome: "Produção Animal" },
        ],
      },
      {
        codigo: "50500007",
        nome: "Medicina Veterinária",
        subareas: [
          { codigo: "50501003", nome: "Clínica e Cirurgia Animal" },
          { codigo: "50502000", nome: "Medicina Veterinária Preventiva" },
          { codigo: "50503006", nome: "Patologia Animal" },
          { codigo: "50504002", nome: "Reprodução Animal" },
          { codigo: "50505009", nome: "Inspeção de Produtos de Origem Animal" },
        ],
      },
      {
        codigo: "50600001",
        nome: "Recursos Pesqueiros e Engenharia de Pesca",
        subareas: [
          { codigo: "50601008", nome: "Recursos Pesqueiros Marinhos" },
          {
            codigo: "50602004",
            nome: "Recursos Pesqueiros de Águas Interiores",
          },
          { codigo: "50603000", nome: "Aqüicultura" },
          { codigo: "50604007", nome: "Engenharia de Pesca" },
        ],
      },
      {
        codigo: "50700006",
        nome: "Ciência e Tecnologia de Alimentos",
        subareas: [
          { codigo: "50701002", nome: "Ciência de Alimentos" },
          { codigo: "50702009", nome: "Tecnologia de Alimentos" },
          { codigo: "50703005", nome: "Engenharia de Alimentos" },
        ],
      },
    ],
  },
  {
    codigo: "60000007",
    nome: "Ciências Sociais Aplicadas",
    areas: [
      {
        codigo: "60100001",
        nome: "Direito",
        subareas: [
          { codigo: "60101008", nome: "Teoria do Direito" },
          { codigo: "60102004", nome: "Direito Público" },
          { codigo: "60103000", nome: "Direito Privado" },
          { codigo: "60104007", nome: "Direitos Especiais" },
        ],
      },
      {
        codigo: "60200006",
        nome: "Administração",
        subareas: [
          { codigo: "60201002", nome: "Administração de Empresas" },
          { codigo: "60202009", nome: "Administração Pública" },
          { codigo: "60203005", nome: "Administração de Setores Específicos" },
          { codigo: "60204001", nome: "Ciências Contábeis" },
        ],
      },
      {
        codigo: "60300000",
        nome: "Economia",
        subareas: [
          { codigo: "60301007", nome: "Teoria Econômica" },
          { codigo: "60302003", nome: "Métodos Quantitativos em Economia" },
          { codigo: "60303000", nome: "Economia Monetária e Fiscal" },
          {
            codigo: "60304006",
            nome: "Crescimento, Flutuações e Planejamento Econômico",
          },
          { codigo: "60305002", nome: "Economia Internacional" },
          { codigo: "60306009", nome: "Economia dos Recursos Humanos" },
          { codigo: "60307005", nome: "Economia Industrial" },
          { codigo: "60308001", nome: "Economia do Bem-Estar Social" },
          { codigo: "60309008", nome: "Economia Regional e Urbana" },
          {
            codigo: "60310006",
            nome: "Economias Agrária e dos Recursos Naturais",
          },
        ],
      },
      {
        codigo: "60400005",
        nome: "Arquitetura e Urbanismo",
        subareas: [
          {
            codigo: "60401001",
            nome: "Fundamentos de Arquitetura e Urbanismo",
          },
          { codigo: "60402008", nome: "Projeto de Arquitetura e Urbanismo" },
          { codigo: "60403004", nome: "Tecnologia de Arquitetura e Urbanismo" },
          { codigo: "60404000", nome: "Paisagismo" },
        ],
      },
      {
        codigo: "60500000",
        nome: "Planejamento Urbano e Regional",
        subareas: [
          {
            codigo: "60501006",
            nome: "Fundamentos do Planejamento Urbano e Regional",
          },
          {
            codigo: "60502002",
            nome: "Métodos e Técnicas do Planejamento Urbano e Regional",
          },
          { codigo: "60503009", nome: "Serviços Urbanos e Regionais" },
        ],
      },
      {
        codigo: "60600004",
        nome: "Demografia",
        subareas: [
          { codigo: "60601000", nome: "Distribuição Espacial" },
          { codigo: "60602007", nome: "Tendência Populacional" },
          { codigo: "60603003", nome: "Componentes da Dinâmica Demográfica" },
          { codigo: "60604000", nome: "Nupcialidade e Família" },
          { codigo: "60605006", nome: "Demografia Histórica" },
          { codigo: "60606002", nome: "Política Pública e População" },
          { codigo: "60607009", nome: "Fontes de Dados Demográficos" },
        ],
      },
      {
        codigo: "60700009",
        nome: "Ciência da Informação",
        subareas: [
          { codigo: "60701005", nome: "Teoria da Informação" },
          { codigo: "60702001", nome: "Biblioteconomia" },
          { codigo: "60703008", nome: "Arquivologia" },
        ],
      },
      {
        codigo: "60800003",
        nome: "Museologia",
        subareas: [],
      },
      {
        codigo: "60900008",
        nome: "Comunicação",
        subareas: [
          { codigo: "60901004", nome: "Teoria da Comunicação" },
          { codigo: "60902000", nome: "Jornalismo e Editoração" },
          { codigo: "60903007", nome: "Rádio e Televisão" },
          { codigo: "60904003", nome: "Relações Públicas e Propaganda" },
          { codigo: "60905000", nome: "Comunicação Visual e Cinema" },
        ],
      },
      {
        codigo: "61000000",
        nome: "Serviço Social",
        subareas: [
          { codigo: "61001007", nome: "Fundamentos do Serviço Social" },
          { codigo: "61002003", nome: "Serviço Social Aplicado" },
        ],
      },
      {
        codigo: "61100005",
        nome: "Economia Doméstica",
        subareas: [],
      },
      {
        codigo: "61200000",
        nome: "Desenho Industrial",
        subareas: [
          { codigo: "61201006", nome: "Programação Visual" },
          { codigo: "61202002", nome: "Desenho de Produto" },
        ],
      },
      {
        codigo: "61300004",
        nome: "Turismo",
        subareas: [],
      },
    ],
  },
  {
    codigo: "70000000",
    nome: "Ciências Humanas",
    areas: [
      {
        codigo: "70100004",
        nome: "Filosofia",
        subareas: [
          { codigo: "70101000", nome: "História da Filosofia" },
          { codigo: "70102007", nome: "Metafísica" },
          { codigo: "70103003", nome: "Lógica" },
          { codigo: "70104000", nome: "Ética" },
          { codigo: "70105006", nome: "Epistemologia" },
          { codigo: "70106002", nome: "Filosofia Brasileira" },
          { codigo: "70107009", nome: "Estética e Filosofia da Arte" },
        ],
      },
      {
        codigo: "70200009",
        nome: "Sociologia",
        subareas: [
          { codigo: "70201005", nome: "Fundamentos da Sociologia" },
          { codigo: "70202001", nome: "Sociologia do Conhecimento" },
          { codigo: "70203008", nome: "Sociologia do Desenvolvimento" },
          { codigo: "70204004", nome: "Sociologia Urbana" },
          { codigo: "70205000", nome: "Sociologia Rural" },
          { codigo: "70206007", nome: "Sociologia da Saúde" },
          { codigo: "70207003", nome: "Outras Sociologias Específicas" },
        ],
      },
      {
        codigo: "70300003",
        nome: "Antropologia",
        subareas: [
          { codigo: "70301000", nome: "Teoria Antropológica" },
          { codigo: "70302006", nome: "Etnologia Indígena" },
          { codigo: "70303002", nome: "Antropologia Urbana" },
          { codigo: "70304009", nome: "Antropologia Rural" },
          {
            codigo: "70305005",
            nome: "Antropologia das Populações Afro-Brasileiras",
          },
        ],
      },
      {
        codigo: "70400008",
        nome: "Arqueologia",
        subareas: [
          { codigo: "70401004", nome: "Teoria e Método em Arqueologia" },
          { codigo: "70402000", nome: "Arqueologia Pré-Histórica" },
          { codigo: "70403007", nome: "Arqueologia Histórica" },
        ],
      },
      {
        codigo: "70500002",
        nome: "História",
        subareas: [
          { codigo: "70501009", nome: "Teoria e Filosofia da História" },
          { codigo: "70502005", nome: "História Antiga e Medieval" },
          { codigo: "70503001", nome: "História Moderna e Contemporânea" },
          { codigo: "70504008", nome: "História da América" },
          { codigo: "70505004", nome: "História do Brasil" },
          { codigo: "70506000", nome: "História das Ciências" },
        ],
      },
      {
        codigo: "70600007",
        nome: "Geografia",
        subareas: [
          { codigo: "70601003", nome: "Geografia Humana" },
          { codigo: "70602000", nome: "Geografia Regional" },
        ],
      },
      {
        codigo: "70700001",
        nome: "Psicologia",
        subareas: [
          { codigo: "70701008", nome: "Fundamentos e Medidas da Psicologia" },
          { codigo: "70702004", nome: "Psicologia Experimental" },
          { codigo: "70703000", nome: "Psicologia Fisiológica" },
          { codigo: "70704007", nome: "Psicologia Comparativa" },
          { codigo: "70705003", nome: "Psicologia Social" },
          { codigo: "70706000", nome: "Psicologia Cognitiva" },
          { codigo: "70707006", nome: "Psicologia do Desenvolvimento Humano" },
          {
            codigo: "70708002",
            nome: "Psicologia do Ensino e da Aprendizagem",
          },
          {
            codigo: "70709009",
            nome: "Psicologia do Trabalho e Organizacional",
          },
          { codigo: "70710007", nome: "Tratamento e Prevenção Psicológica" },
        ],
      },
      {
        codigo: "70800006",
        nome: "Educação",
        subareas: [
          { codigo: "70801002", nome: "Fundamentos da Educação" },
          { codigo: "70802009", nome: "Administração Educacional" },
          {
            codigo: "70803005",
            nome: "Política, Planejamento e Avaliação Educacional",
          },
          { codigo: "70804001", nome: "Ensino-Aprendizagem" },
          { codigo: "70805008", nome: "Currículo" },
          { codigo: "70806004", nome: "Orientação e Aconselhamento" },
          { codigo: "70807000", nome: "Tópicos Específicos de Educação" },
          { codigo: "70808007", nome: "Educação e Diversidade" },
        ],
      },
      {
        codigo: "70900000",
        nome: "Ciência Política",
        subareas: [
          { codigo: "70901007", nome: "Teoria Política" },
          { codigo: "70902003", nome: "Estado e Governo" },
          { codigo: "70903000", nome: "Comportamento Político" },
          { codigo: "70904006", nome: "Políticas Públicas" },
          { codigo: "70905002", nome: "Política Internacional" },
        ],
      },
      {
        codigo: "71000003",
        nome: "Teologia",
        subareas: [
          { codigo: "71001000", nome: "História das Teologias e Religiões" },
          { codigo: "71004009", nome: "Teologia Prática" },
          { codigo: "71005005", nome: "Teologia Fundamental Sistemática" },
          { codigo: "71006001", nome: "Ciências da Religião Aplicada" },
          { codigo: "71007008", nome: "Ciências da Linguagem Religiosa" },
          { codigo: "71008004", nome: "Ciências Empíricas da Religião" },
          {
            codigo: "71009000",
            nome: "Epistemologia das Ciências da Religião",
          },
          { codigo: "71010009", nome: "Tradições e Escrituras Sagradas" },
        ],
      },
    ],
  },
  {
    codigo: "80000002",
    nome: "Linguística, Letras e Artes",
    areas: [
      {
        codigo: "80100007",
        nome: "Linguística",
        subareas: [
          { codigo: "80101003", nome: "Teoria e Análise Linguística" },
          { codigo: "80102000", nome: "Filosofia da Linguagem" },
          { codigo: "80103006", nome: "Linguística Histórica" },
          { codigo: "80104002", nome: "Sociolinguística e Dialetologia" },
          { codigo: "80105009", nome: "Psicolinguística" },
          { codigo: "80106005", nome: "Linguística Aplicada" },
        ],
      },
      {
        codigo: "80200001",
        nome: "Letras",
        subareas: [
          { codigo: "80201008", nome: "Língua Portuguesa" },
          { codigo: "80202004", nome: "Línguas Estrangeiras Modernas" },
          { codigo: "80203000", nome: "Línguas Clássicas" },
          { codigo: "80204007", nome: "Línguas Indígenas" },
          { codigo: "80205003", nome: "Teoria Literária" },
          { codigo: "80206000", nome: "Literatura Brasileira" },
          { codigo: "80207006", nome: "Outras Literaturas Vernáculas" },
          { codigo: "80208002", nome: "Literaturas Estrangeiras Modernas" },
          { codigo: "80209009", nome: "Literaturas Clássicas" },
          { codigo: "80210007", nome: "Literatura Comparada" },
        ],
      },
      {
        codigo: "80300006",
        nome: "Artes",
        subareas: [
          { codigo: "80301002", nome: "Fundamentos e Crítica das Artes" },
          { codigo: "80302009", nome: "Artes Plásticas" },
          { codigo: "80303005", nome: "Música" },
          { codigo: "80304001", nome: "Dança" },
          { codigo: "80305008", nome: "Teatro" },
          { codigo: "80306004", nome: "Ópera" },
          { codigo: "80307000", nome: "Fotografia" },
          { codigo: "80308007", nome: "Cinema" },
          { codigo: "80309003", nome: "Artes do Vídeo" },
          { codigo: "80310001", nome: "Educação Artística" },
        ],
      },
    ],
  },
  {
    codigo: "90000005",
    nome: "Outra",
    areas: [
      {
        codigo: "99900009",
        nome: "Multidisciplinar",
        subareas: [],
      },
      {
        codigo: "90200000",
        nome: "Ensino",
        subareas: [
          { codigo: "90201000", nome: "Ensino de Ciências e Matemática" },
        ],
      },
      {
        codigo: "92300006",
        nome: "Secretariado Executivo",
        subareas: [],
      },
      {
        codigo: "92400000",
        nome: "Defesa",
        subareas: [],
      },
      {
        codigo: "92600000",
        nome: "Bioética",
        subareas: [],
      },
      {
        codigo: "92700004",
        nome: "Ciências Ambientais",
        subareas: [],
      },
      {
        codigo: "92800009",
        nome: "Divulgação Científica",
        subareas: [],
      },
      {
        codigo: "93200005",
        nome: "Robótica, Mecatrônica e Automação",
        subareas: [],
      },
      {
        codigo: "93300000",
        nome: "Microeletrônica",
        subareas: [
          { codigo: "93301006", nome: "Processos de Fabricação" },
          { codigo: "93302002", nome: "Dispositivos" },
          { codigo: "93303009", nome: "Teste e Tolerância a Falhas" },
          { codigo: "93304005", nome: "Projeto" },
          { codigo: "93305001", nome: "EDA" },
        ],
      },
      {
        codigo: "93400004",
        nome: "Segurança Contra Incêndio",
        subareas: [],
      },
    ],
  },
]

function formatCnpqOption(item: { codigo: string; nome: string }) {
  return `${item.codigo} — ${item.nome}`
}

const _areaConhecimentoOptions = cnpqAreasConhecimento.map(formatCnpqOption)
const _grandeAreas = cnpqAreasConhecimento.map(formatCnpqOption)

function getAreasByGrandeArea(grandeArea: string) {
  const grandeAreaSelecionada = cnpqAreasConhecimento.find(
    (item) => formatCnpqOption(item) === grandeArea,
  )

  return grandeAreaSelecionada?.areas ?? []
}

function _getSubareasByArea(grandeArea: string, area: string) {
  const areaSelecionada = getAreasByGrandeArea(grandeArea).find(
    (item) => formatCnpqOption(item) === area,
  )

  return areaSelecionada?.subareas ?? []
}

const _especialidades = [
  "Especialidade A",
  "Especialidade B",
  "Especialidade C",
  "Outra",
]

const _linhas = ["Linha 01", "Linha 02", "Linha 03"]

const _grupos = ["GP I", "GP II", "GP III", "Outro"]

const categoriasProjeto = [
  "Pesquisa (Externo)",
  "Extensão (Externo)",
  "Inovação (Externo)",
  "Ensino (Externo)",
]

const subcatNivelI = [
  "Subcategoria Nível I — A",
  "Subcategoria Nível I — B",
  "Subcategoria Nível I — C",
]

const subcatNivelII = [
  "Subcategoria Nível II — 1",
  "Subcategoria Nível II — 2",
  "Subcategoria Nível II — 3",
]

const definicoesPI = ["Institucional", "Compartilhada", "Privada", "A definir"]

const _memberVinculos = [
  "Docente UFPB",
  "Técnico-administrativo UFPB",
  "Discente UFPB",
  "Pesquisador externo",
  "Instituição parceira",
  "Outro",
]

/* ================= ESTADO INICIAL ================= */

const initialMember: ProjectMember = {
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

const initialState: FormState = {
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

/* ================= UTIL/UI ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function getErrorMessage(error: unknown, fallback: string): string {
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

function getProjectDurationInMonths(periodoIni: string, periodoFim: string) {
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

function formatCronogramaDuration(mesInicio: number, mesFim: number) {
  if (mesInicio === mesFim) return `Mês ${mesInicio}`

  return `Mês ${mesInicio} ao mês ${mesFim}`
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const disabledInputClassName =
  "w-full rounded-xl border border-neutral/30 bg-neutral/5 px-3 py-2.5 text-sm text-neutral outline-none"

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

function Card({
  title,
  subtitle,
  icon,
  children,
}: Readonly<{
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral/20 px-6 py-4">
        {icon}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  children,
  required,
}: Readonly<{
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  )
}

function CharacterCounter({
  value,
  max,
}: Readonly<{
  value: string
  max: number
}>) {
  const remaining = max - value.length
  const closeToLimit = remaining <= Math.ceil(max * 0.1)

  return (
    <p
      className={cx(
        "text-right text-[11px]",
        closeToLimit ? "text-amber-700" : "text-neutral",
      )}
    >
      {value.length.toLocaleString("pt-BR")} / {max.toLocaleString("pt-BR")}{" "}
      caracteres
    </p>
  )
}

function StepPill({
  active,
  done,
  children,
}: Readonly<{
  active: boolean
  done: boolean
  children: React.ReactNode
}>) {
  let stateClass = "border-neutral/20 bg-white text-primary"
  if (active) {
    stateClass = "border-primary bg-primary text-white"
  } else if (done) {
    stateClass = "border-green-200 bg-green-50 text-green-700"
  }

  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold",
        stateClass,
      )}
    >
      {done && <Check size={14} />}
      {children}
    </div>
  )
}

function Info({
  label,
  value,
  preWrap,
}: Readonly<{
  label: string
  value: string
  preWrap?: boolean
}>) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-neutral">{label}</p>

      <p
        className={cx("text-sm text-neutral", preWrap && "whitespace-pre-wrap")}
      >
        {value || "—"}
      </p>
    </div>
  )
}

/* ================= COMPONENTES DE SEÇÕES ================= */

function OdsPicker({
  value,
  options,
  onChange,
}: Readonly<{
  value: ODS[]
  options: ODS[]
  onChange: (v: ODS[]) => void
}>) {
  const selectedIds = new Set(value.map((item) => item.id))

  function toggle(ods: ODS) {
    if (selectedIds.has(ods.id)) {
      onChange(value.filter((item) => item.id !== ods.id))
      return
    }

    onChange([...value, ods])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((ods) => {
        const selected = selectedIds.has(ods.id)

        return (
          <button
            key={ods.id}
            type="button"
            onClick={() => toggle(ods)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
              selected
                ? "border-primary bg-primary text-white"
                : "border-neutral/20 bg-white text-primary hover:bg-neutral/5",
            )}
          >
            <span
              className={cx(
                "grid h-5 w-5 place-items-center rounded-full border text-[11px]",
                selected
                  ? "border-white/30 bg-white/15"
                  : "border-neutral/20 bg-white",
              )}
            >
              {ods.id}
            </span>

            <span className="text-left">{ods.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function CronogramaPicker({
  value,
  onChange,
  periodoIni,
  periodoFim,
}: Readonly<{
  value: CronogramaItem[]
  onChange: (value: CronogramaItem[]) => void
  periodoIni: string
  periodoFim: string
}>) {
  const [atividade, setAtividade] = useState("")
  const [mesInicio, setMesInicio] = useState(1)
  const [mesFim, setMesFim] = useState(1)

  const totalMeses = useMemo(
    () => getProjectDurationInMonths(periodoIni, periodoFim),
    [periodoIni, periodoFim],
  )

  const mesesDisponiveis = useMemo(
    () => Array.from({ length: totalMeses }, (_, index) => index + 1),
    [totalMeses],
  )

  const canAdd = Boolean(
    atividade.trim() &&
      mesInicio >= 1 &&
      mesFim >= mesInicio &&
      mesFim <= totalMeses,
  )

  function addLinha() {
    if (!canAdd) return

    onChange([
      ...value,
      {
        id: createId("cronograma"),
        atividade: atividade.trim(),
        mesInicio,
        mesFim,
      },
    ])

    setAtividade("")
    setMesInicio(1)
    setMesFim(1)
  }

  function removeLinha(id: string) {
    onChange(value.filter((item) => item.id !== id))
  }

  return (
    <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_170px_170px_auto]">
        <input
          value={atividade}
          onChange={(event) => setAtividade(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addLinha()
            }
          }}
          className={inputClassName}
          placeholder="Atividade"
        />

        <select
          value={mesInicio}
          onChange={(event) => {
            const nextMesInicio = Number(event.target.value)
            setMesInicio(nextMesInicio)

            if (mesFim < nextMesInicio) {
              setMesFim(nextMesInicio)
            }
          }}
          className={selectClassName}
        >
          {mesesDisponiveis.map((item) => (
            <option key={item} value={item}>
              Início: mês {item}
            </option>
          ))}
        </select>

        <select
          value={mesFim}
          onChange={(event) => setMesFim(Number(event.target.value))}
          className={selectClassName}
        >
          {mesesDisponiveis
            .filter((item) => item >= mesInicio)
            .map((item) => (
              <option key={item} value={item}>
                Fim: mês {item}
              </option>
            ))}
        </select>

        <button
          type="button"
          onClick={addLinha}
          disabled={!canAdd}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canAdd
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      <p className="mt-2 text-[11px] text-neutral">
        A duração deve ficar entre o mês 1 e o mês {totalMeses}, conforme o
        período informado para o projeto.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={value.length === 0}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
            value.length === 0
              ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
              : "border-neutral/20 bg-white text-primary hover:border-primary/30",
          )}
        >
          <RefreshCcw size={14} />
          Limpar cronograma
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-light bg-white p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Nenhuma atividade adicionada ao cronograma.
            </p>

            <p className="mt-1 text-xs text-neutral">
              Informe a atividade, selecione a duração e clique em adicionar.
            </p>
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-neutral">
                  {formatCronogramaDuration(item.mesInicio, item.mesFim)}
                </p>

                <p className="mt-1 text-sm leading-6 text-primary">
                  {item.atividade}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeLinha(item.id)}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FileInputBox({
  label,
  hint,
  file,
  onChange,
  required,
  disabled,
}: Readonly<{
  label: string
  hint?: string
  file: File | null
  onChange: (file: File | null) => void
  required?: boolean
  disabled?: boolean
}>) {
  return (
    <Field label={label} hint={hint} required={required}>
      <label
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition",
          disabled
            ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
            : "border-neutral-light bg-white text-primary hover:border-primary/40 hover:bg-primary/5",
        )}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          disabled={disabled}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <FileUp size={28} />

        <p className="mt-3 text-sm font-semibold">
          {file ? file.name : "Selecionar arquivo PDF"}
        </p>

        <p className="mt-1 text-xs text-neutral">
          {disabled
            ? "Campo indisponível no fluxo atual."
            : "Formato aceito: PDF."}
        </p>
      </label>

      {file && !disabled && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={14} />
          Remover arquivo
        </button>
      )}
    </Field>
  )
}

/* ================= VALIDAÇÃO DO WIZARD ================= */

type StepValidationFlags = {
  canGoStep2: boolean
  canGoStep3: boolean
  canGoStep4: boolean
  canGoStep5: boolean
  canGoStep6: boolean
  submitted: boolean
}

function formatProjectTypeLabel(tipo: ProjectType | null): string {
  if (!tipo) return "—"
  if (tipo === "interno") return "Interno"
  return "Externo"
}

function checkCanGoStep2(form: FormState): boolean {
  return (
    form.gerais.tipo === "interno" ||
    (EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo")
  )
}

function checkCanGoStep3(form: FormState, canGoStep2: boolean): boolean {
  const g = form.gerais

  return Boolean(
    canGoStep2 &&
      g.editalPesquisa.trim() &&
      g.titulo.trim() &&
      g.title.trim() &&
      g.palavrasChave.trim() &&
      g.keywords.trim() &&
      g.descricaoResumida.trim() &&
      g.abstract.trim() &&
      g.introducaoJustificativa.trim() &&
      g.objetivos.trim() &&
      g.metodologia.trim() &&
      g.resultadosEsperados.trim() &&
      g.referencias.trim() &&
      /^\S+@\S+\.\S+$/.test(g.email.trim()) &&
      g.unidade.trim() &&
      g.periodoIni &&
      g.periodoFim &&
      g.periodoFim >= g.periodoIni &&
      g.grandeArea.trim() &&
      g.area.trim() &&
      g.areaConhecimento.trim(),
  )
}

function checkCanGoStep4(form: FormState, canGoStep3: boolean): boolean {
  if (!canGoStep3) return false

  return Boolean(
    form.gerais.objetivosDS.length > 0 && form.gerais.cronograma.length > 0,
  )
}

function checkCanGoStep5(form: FormState, canGoStep4: boolean): boolean {
  if (!canGoStep4) return false

  const hasMembers = form.gerais.membros.length > 0

  if (form.gerais.tipo === "externo") {
    return Boolean(hasMembers && form.gerais.comprovanteExterno)
  }

  return hasMembers
}

function checkCanGoStep6(form: FormState, canGoStep5: boolean): boolean {
  if (!canGoStep5) return false

  if (form.gerais.tipo === "interno") {
    return isInternalSpecificDataValid(form.gerais.linhaPesquisa, form.interno)
  }

  if (EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo") {
    const e = form.externo

    return Boolean(
      e.categoriaProjeto.trim() &&
        e.subcategoriaNivelI.trim() &&
        e.subcategoriaNivelII.trim() &&
        e.definicaoPropriedadeIntelectual.trim(),
    )
  }

  return false
}

function checkStepDone(currentStep: Step, flags: StepValidationFlags): boolean {
  if (currentStep === 1) return flags.canGoStep2
  if (currentStep === 2) return flags.canGoStep3
  if (currentStep === 3) return flags.canGoStep4
  if (currentStep === 4) return flags.canGoStep5
  if (currentStep === 5) return flags.canGoStep6
  if (currentStep === 6) return flags.submitted

  return false
}

function canAdvanceFromStep(
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

/* ================= PASSOS DO WIZARD ================= */

function WizardStep1Tipo({
  form,
  setForm,
  goNext,
  canGoStep2,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  canGoStep2: boolean
}>) {
  let externalTypeButtonClass = "border-neutral/20 hover:bg-neutral/5"

  if (!EXTERNAL_PROJECTS_ENABLED) {
    externalTypeButtonClass =
      "cursor-not-allowed border-neutral/20 bg-neutral/5 opacity-70"
  } else if (form.gerais.tipo === "externo") {
    externalTypeButtonClass = "border-primary bg-primary/5"
  }

  return (
    <Card
      title="Passo 1 — Tipo de projeto"
      subtitle="Escolha o tipo disponível para iniciar o fluxo."
      icon={<Layers size={18} className="text-primary" />}
    >
      {!EXTERNAL_PROJECTS_ENABLED && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-bold">
              Cadastro de projeto externo temporariamente desativado
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                tipo: "interno",
              },
            }))
          }
          className={cx(
            "rounded-2xl border p-6 text-left transition",
            form.gerais.tipo === "interno"
              ? "border-primary bg-primary/5"
              : "border-neutral/20 hover:bg-neutral/5",
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary">Interno</h3>
            {form.gerais.tipo === "interno" && (
              <Check size={18} className="text-primary" />
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-neutral">
            Projeto vinculado a estruturas internas, como grupo de pesquisa,
            unidade e regras institucionais.
          </p>
        </button>

        <button
          type="button"
          disabled={!EXTERNAL_PROJECTS_ENABLED}
          onClick={() => {
            if (!EXTERNAL_PROJECTS_ENABLED) return

            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                tipo: "externo",
              },
            }))
          }}
          className={cx(
            "rounded-2xl border p-6 text-left transition",
            externalTypeButtonClass,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3
              className={cx(
                "text-base font-bold",
                EXTERNAL_PROJECTS_ENABLED ? "text-primary" : "text-neutral",
              )}
            >
              Externo
            </h3>

            {EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo" ? (
              <Check size={18} className="text-primary" />
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral">
                <Lock size={12} />
                Desativado
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-neutral">
            Projeto com campos complementares e upload de comprovante de
            aprovação ou financiamento.
          </p>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral">
          {form.gerais.tipo ? (
            <>
              Tipo selecionado:{" "}
              <span className="font-semibold text-primary">
                {formatProjectTypeLabel(form.gerais.tipo)}
              </span>
            </>
          ) : (
            "Selecione um tipo para continuar."
          )}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep2}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep2
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}

function WizardStep2Anexo({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep3,
  editais,
  unidadesAcademicas,
  grandesAreasLookup,
  areasLookup,
  subareasLookup,
  especialidadesLookup,
  submitError,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep3: boolean
  editais: LookupOption<number>[]
  unidadesAcademicas: LookupOption<number>[]
  grandesAreasLookup: KnowledgeAreaLookup[]
  areasLookup: KnowledgeAreaLookup[]
  subareasLookup: KnowledgeAreaLookup[]
  especialidadesLookup: KnowledgeAreaLookup[]
  submitError: string
}>) {
  return (
    <Card
      title="Passo 2 — Campos do Anexo II"
      subtitle="Preencha os campos principais do projeto em português e inglês."
      icon={<FileText size={18} className="text-primary" />}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Tipo do projeto" required>
          <input
            value={
              form.gerais.tipo ? formatProjectTypeLabel(form.gerais.tipo) : ""
            }
            readOnly
            className={disabledInputClassName}
            placeholder="Selecione no passo 1"
          />
        </Field>

        <Field label="Edital de pesquisa" required>
          <select
            value={form.gerais.editalPesquisa}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  editalPesquisa: event.target.value,
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {editais.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Título" required hint="">
          <input
            value={form.gerais.titulo}
            maxLength={TITLE_MAX}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  titulo: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="Título do projeto em português"
          />

          <CharacterCounter value={form.gerais.titulo} max={TITLE_MAX} />
        </Field>

        <Field label="Title" required hint="">
          <input
            value={form.gerais.title}
            maxLength={TITLE_MAX}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  title: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="Project title in English"
          />

          <CharacterCounter value={form.gerais.title} max={TITLE_MAX} />
        </Field>

        <Field
          label="Palavras-chave"
          required
          hint="Separe por vírgula ou ponto e vírgula."
        >
          <input
            value={form.gerais.palavrasChave}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  palavrasChave: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: acessibilidade, IA, educação"
          />
        </Field>

        <Field
          label="Keywords"
          required
          hint="Separe por vírgula ou ponto e vírgula."
        >
          <input
            value={form.gerais.keywords}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  keywords: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: accessibility, AI, education"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Descrição resumida" required>
            <textarea
              value={form.gerais.descricaoResumida}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    descricaoResumida: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Apresente uma descrição resumida do projeto."
            />

            <CharacterCounter
              value={form.gerais.descricaoResumida}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Abstract" required>
            <textarea
              value={form.gerais.abstract}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    abstract: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Provide the project abstract in English."
            />

            <CharacterCounter
              value={form.gerais.abstract}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Introdução / justificativa" required>
            <textarea
              value={form.gerais.introducaoJustificativa}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    introducaoJustificativa: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Apresente o contexto, problema, relevância e justificativa do projeto."
            />

            <CharacterCounter
              value={form.gerais.introducaoJustificativa}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Objetivos" required>
            <textarea
              value={form.gerais.objetivos}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    objetivos: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Informe os objetivos gerais e específicos do projeto."
            />

            <CharacterCounter
              value={form.gerais.objetivos}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Metodologia" required>
            <textarea
              value={form.gerais.metodologia}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    metodologia: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Descreva procedimentos, métodos, etapas, instrumentos e formas de análise."
            />

            <CharacterCounter
              value={form.gerais.metodologia}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Resultados esperados" required>
            <textarea
              value={form.gerais.resultadosEsperados}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    resultadosEsperados: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Descreva os resultados e impactos esperados com a execução do projeto."
            />

            <CharacterCounter
              value={form.gerais.resultadosEsperados}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Referências" required>
            <textarea
              value={form.gerais.referencias}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    referencias: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Informe as referências bibliográficas do projeto."
            />

            <CharacterCounter
              value={form.gerais.referencias}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <Field label="E-mail de contato" required>
          <input
            type="email"
            value={form.gerais.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  email: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: coordenador@ufpb.br"
          />
        </Field>

        <Field
          label="Período do projeto"
          required
          hint="Defina início e fim do projeto."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={form.gerais.periodoIni}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    periodoIni: event.target.value,
                  },
                }))
              }
              className={inputClassName}
            />

            <input
              type="date"
              value={form.gerais.periodoFim}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    periodoFim: event.target.value,
                  },
                }))
              }
              className={inputClassName}
            />
          </div>
        </Field>

        <Field label="Unidade" required>
          <select
            value={form.gerais.unidade}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  unidade: event.target.value,
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {unidadesAcademicas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Grande área" required>
          <select
            value={form.gerais.grandeArea}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  grandeArea: event.target.value,
                  area: "",
                  subarea: "",
                  especialidade: "",
                  areaConhecimento: "",
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {grandesAreasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Área" required>
          <select
            value={form.gerais.area}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  area: event.target.value,
                  subarea: "",
                  especialidade: "",
                  areaConhecimento: String(
                    areasLookup.find((item) => item.name === event.target.value)
                      ?.id ?? "",
                  ),
                },
              }))
            }
            disabled={!form.gerais.grandeArea}
            className={selectClassName}
          >
            <option value="">
              {form.gerais.grandeArea
                ? "Selecione"
                : "Selecione primeiro a grande área"}
            </option>
            {areasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subárea">
          <select
            value={form.gerais.subarea}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  subarea: event.target.value,
                  especialidade: "",
                  areaConhecimento: String(
                    subareasLookup.find(
                      (item) => item.name === event.target.value,
                    )?.id ?? current.gerais.areaConhecimento,
                  ),
                },
              }))
            }
            disabled={!form.gerais.area}
            className={selectClassName}
          >
            <option value="">
              {form.gerais.area ? "Selecione" : "Selecione primeiro a área"}
            </option>
            {subareasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Especialidade">
          <select
            value={form.gerais.especialidade}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  especialidade: event.target.value,
                  areaConhecimento: String(
                    especialidadesLookup.find(
                      (item) => item.name === event.target.value,
                    )?.id ?? current.gerais.areaConhecimento,
                  ),
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {especialidadesLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {submitError && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          {submitError}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep3}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep3
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}

function WizardStep3Ods({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep4,
  odsOptions,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep4: boolean
  odsOptions: ODS[]
}>) {
  return (
    <Card
      title="Passo 3 — ODS e cronograma"
      subtitle="Vincule pelo menos um ODS e cadastre o cronograma do projeto."
      icon={<CalendarDays size={18} className="text-primary" />}
    >
      <div className="space-y-6">
        <Field label="Objetivos do Desenvolvimento Sustentável" required>
          <OdsPicker
            value={form.gerais.objetivosDS}
            options={odsOptions}
            onChange={(objetivosDS) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  objetivosDS,
                },
              }))
            }
          />
        </Field>

        <Field
          label="Cronograma"
          required
          hint="Informe a atividade e selecione a duração dentro do período do projeto."
        >
          <CronogramaPicker
            value={form.gerais.cronograma}
            periodoIni={form.gerais.periodoIni}
            periodoFim={form.gerais.periodoFim}
            onChange={(cronograma) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  cronograma,
                },
              }))
            }
          />
        </Field>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep4}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep4
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}

function WizardStep4Membros({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep5,
  memberDraft,
  setMemberDraft,
  memberLookups,
  userOptions,
  addMember,
  removeMember,
  canAddMember,
  resetMemberDraft,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep5: boolean
  memberDraft: ProjectMember
  setMemberDraft: React.Dispatch<React.SetStateAction<ProjectMember>>
  memberLookups: MemberLookupBundle | null
  userOptions: ResearchUserLookup[]
  addMember: () => void
  removeMember: (id: string) => void
  canAddMember: boolean
  resetMemberDraft: () => void
}>) {
  return (
    <Card
      title="Passo 4 — Membros e uploads"
      subtitle="Cadastre os membros do projeto e anexe os documentos complementares."
      icon={<Users size={18} className="text-primary" />}
    >
      <div className="rounded-2xl border border-neutral/20 p-5">
        <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary">
              Novo membro do projeto
            </h3>

            <p className="mt-1 text-xs text-neutral">
              Informe os dados principais do membro e clique em adicionar.
            </p>
          </div>

          <button
            type="button"
            onClick={resetMemberDraft}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
          >
            <RefreshCcw size={14} />
            Limpar
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Vínculo" required>
            <select
              value={memberDraft.categoria}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...initialMember,
                  id: current.id,
                  categoria: event.target.value as MemberCategory,
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {(memberLookups?.categorias ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Papel no projeto" required>
            <select
              value={memberDraft.papel}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...current,
                  papel: event.target.value,
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {(memberLookups?.funcoes ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          {memberDraft.categoria !== "EXTERNO" ? (
            <Field label="Usuário cadastrado" required>
              <select
                value={memberDraft.userId}
                disabled={!memberDraft.categoria}
                onChange={(event) => {
                  const user = userOptions.find(
                    (item) => item.id === Number(event.target.value),
                  )
                  setMemberDraft((current) => ({
                    ...current,
                    userId: event.target.value,
                    nome: user?.name ?? "",
                    email: user?.email ?? "",
                  }))
                }}
                className={selectClassName}
              >
                <option value="">Selecione</option>
                {userOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.email}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <>
              <Field label="Nome" required>
                <input
                  value={memberDraft.nome}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="Nome completo"
                />
              </Field>
              <Field label="E-mail" required>
                <input
                  type="email"
                  value={memberDraft.email}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="email@exemplo.com"
                />
              </Field>
              <Field
                label="CPF"
                hint="Deixe em branco para pessoa estrangeira."
              >
                <input
                  value={memberDraft.cpf}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      cpf: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="000.000.000-00"
                />
              </Field>
              <Field label="Sexo" required>
                <select
                  value={memberDraft.sexo}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      sexo: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.sexos ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Formação" required>
                <select
                  value={memberDraft.formacao}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      formacao: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.formacoes_externas ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo de membro externo" required>
                <select
                  value={memberDraft.tipoExterno}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      tipoExterno: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.tipos_externos ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          <Field label="Carga horária dedicada" required>
            <input
              type="number"
              min={1}
              value={memberDraft.cargaHoraria}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...current,
                  cargaHoraria: event.target.value,
                }))
              }
              className={inputClassName}
              placeholder="Horas"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addMember}
            disabled={!canAddMember}
            className={cx(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
              canAddMember
                ? "bg-primary text-white hover:bg-primary/90"
                : "cursor-not-allowed bg-neutral/10 text-neutral",
            )}
          >
            <Plus size={16} />
            Adicionar membro
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary">
              Membros cadastrados
            </h3>

            <p className="mt-1 text-xs text-neutral">
              Total cadastrado:{" "}
              <span className="font-semibold text-primary">
                {form.gerais.membros.length}
              </span>
            </p>
          </div>

          <span
            className={cx(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
              form.gerais.membros.length > 0
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {form.gerais.membros.length > 0
              ? "Regra atendida"
              : "Obrigatório adicionar 1 membro"}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {form.gerais.membros.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-light bg-neutral/5 p-5 text-center">
              <p className="text-sm font-semibold text-primary">
                Nenhum membro cadastrado.
              </p>

              <p className="mt-1 text-xs text-neutral">
                Preencha o formulário acima e clique em adicionar.
              </p>
            </div>
          ) : (
            form.gerais.membros.map((membro) => (
              <div
                key={membro.id}
                className="rounded-xl border border-neutral/20 bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {membro.nome}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {memberLookups?.funcoes.find(
                          (item) => item.id === membro.papel,
                        )?.name ?? membro.papel}
                      </span>

                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {memberLookups?.categorias.find(
                          (item) => item.id === membro.categoria,
                        )?.name ?? membro.categoria}
                      </span>

                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {membro.email}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-neutral">
                      Carga horária: {membro.cargaHoraria}h
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMember(membro.id)}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FileInputBox
          label="Upload do PDF complementar"
          hint="Documento complementar do projeto, opcional."
          file={form.gerais.pdfComplementar}
          onChange={(pdfComplementar) =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                pdfComplementar,
              },
            }))
          }
        />

        <FileInputBox
          label="Comprovante de aprovação/financiamento"
          required={form.gerais.tipo === "externo"}
          disabled={form.gerais.tipo !== "externo"}
          hint="Obrigatório apenas para projeto externo."
          file={form.gerais.comprovanteExterno}
          onChange={(comprovanteExterno) =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                comprovanteExterno,
              },
            }))
          }
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep5}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep5
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}

function WizardStep5Especifico({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep6,
  researchGroups,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep6: boolean
  researchGroups: ResearchGroupLookup[]
}>) {
  return (
    <Card
      title="Passo 5 — Dados específicos"
      subtitle={
        form.gerais.tipo === "interno"
          ? "Campos adicionais para projeto interno."
          : "Campos adicionais para projeto externo."
      }
      icon={<ClipboardCheck size={18} className="text-primary" />}
    >
      {form.gerais.tipo === "interno" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Este projeto está vinculado a algum grupo de pesquisa?"
            required
          >
            <div className="flex gap-4">
              {(["Sim", "Não"] as const).map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center gap-2 text-sm text-primary"
                >
                  <input
                    type="radio"
                    checked={form.interno.vinculadoGrupo === item}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          vinculadoGrupo: item,
                          grupoPesquisa:
                            item === "Não" ? "" : current.interno.grupoPesquisa,
                        },
                      }))
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Grupo de pesquisa"
            required={form.interno.vinculadoGrupo === "Sim"}
          >
            <select
              value={form.interno.grupoPesquisa}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    grupoPesquisa: event.target.value,
                  },
                }))
              }
              disabled={form.interno.vinculadoGrupo !== "Sim"}
              className={cx(
                selectClassName,
                form.interno.vinculadoGrupo !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5",
              )}
            >
              <option value="">Selecione</option>
              {researchGroups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Linha de pesquisa" required>
            <input
              value={form.gerais.linhaPesquisa}
              list="research-group-lines"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    linhaPesquisa: event.target.value,
                  },
                }))
              }
              className={inputClassName}
              placeholder="Informe a linha de pesquisa"
            />
            <datalist id="research-group-lines">
              {researchGroups
                .find((item) => item.id === Number(form.interno.grupoPesquisa))
                ?.linhas.map((linha) => (
                  <option key={linha} value={linha} />
                ))}
            </datalist>
          </Field>

          <Field
            label="Possui protocolo de pesquisa em Comitê de Ética?"
            required
          >
            <div className="flex gap-4">
              {(["Sim", "Não"] as const).map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center gap-2 text-sm text-primary"
                >
                  <input
                    type="radio"
                    checked={form.interno.possuiProtocoloEtica === item}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          possuiProtocoloEtica: item,
                          comiteEticaNome:
                            item === "Não"
                              ? ""
                              : current.interno.comiteEticaNome,
                          protocoloEtica:
                            item === "Não"
                              ? ""
                              : current.interno.protocoloEtica,
                        },
                      }))
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Comitê de Ética"
            required={form.interno.possuiProtocoloEtica === "Sim"}
            hint={
              form.interno.possuiProtocoloEtica === "Sim"
                ? "Obrigatório quando possui protocolo."
                : "Campo opcional enquanto não possui protocolo."
            }
          >
            <input
              value={form.interno.comiteEticaNome}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    comiteEticaNome: event.target.value,
                  },
                }))
              }
              disabled={form.interno.possuiProtocoloEtica !== "Sim"}
              className={cx(
                inputClassName,
                form.interno.possuiProtocoloEtica !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5 text-neutral",
              )}
              placeholder="ex.: CEP/HULW, CEP/UFPB"
            />
          </Field>

          <Field
            label="Nº do protocolo"
            required={form.interno.possuiProtocoloEtica === "Sim"}
            hint={
              form.interno.possuiProtocoloEtica === "Sim"
                ? "Obrigatório quando possui protocolo."
                : "Campo opcional enquanto não possui protocolo."
            }
          >
            <input
              value={form.interno.protocoloEtica}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    protocoloEtica: event.target.value,
                  },
                }))
              }
              disabled={form.interno.possuiProtocoloEtica !== "Sim"}
              className={cx(
                inputClassName,
                form.interno.possuiProtocoloEtica !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5 text-neutral",
              )}
              placeholder="ex.: 1234567"
            />
          </Field>
        </div>
      )}

      {form.gerais.tipo === "externo" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Categoria do projeto" required>
            <select
              value={form.externo.categoriaProjeto}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    categoriaProjeto: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {categoriasProjeto.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoria Nível I" required>
            <select
              value={form.externo.subcategoriaNivelI}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    subcategoriaNivelI: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {subcatNivelI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoria Nível II" required>
            <select
              value={form.externo.subcategoriaNivelII}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    subcategoriaNivelII: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {subcatNivelII.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Definição da propriedade intelectual" required>
            <select
              value={form.externo.definicaoPropriedadeIntelectual}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    definicaoPropriedadeIntelectual: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {definicoesPI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Tratamento da produção intelectual do projeto"
              hint="Campo de texto para regras ou observações."
            >
              <textarea
                value={form.externo.tratamentoProducao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    externo: {
                      ...current.externo,
                      tratamentoProducao: event.target.value,
                    },
                  }))
                }
                className={textareaClassName}
                placeholder="Descreva como a produção intelectual será tratada."
              />
            </Field>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep6}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep6
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}

function WizardStep6Revisao({
  form,
  goBack,
  submit,
  saving,
  submitted,
  canGoStep6,
  backTo,
  setForm,
  setSubmitted,
  setCreatedProjectId,
  setStep,
  resetMemberDraft,
  editalName,
  unidadeName,
  grupoName,
  memberLookups,
}: Readonly<{
  form: FormState
  goBack: () => void
  submit: () => void
  saving: boolean
  submitted: boolean
  canGoStep6: boolean
  backTo: string
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  setCreatedProjectId: React.Dispatch<React.SetStateAction<number | null>>
  setStep: React.Dispatch<React.SetStateAction<Step>>
  resetMemberDraft: () => void
  editalName: string
  unidadeName: string
  grupoName: string
  memberLookups: MemberLookupBundle | null
}>) {
  const specificDataSuffix = form.gerais.tipo
    ? `(${formatProjectTypeLabel(form.gerais.tipo)})`
    : ""

  let submitButtonLabel = "Confirmar e submeter"
  if (saving) {
    submitButtonLabel = "Submetendo..."
  } else if (submitted) {
    submitButtonLabel = "Submetido"
  }

  return (
    <Card
      title="Passo 6 — Revisão e submissão"
      subtitle="Revise todos os dados antes de submeter."
      icon={<Save size={18} className="text-primary" />}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <FileText size={16} />
            Dados do projeto
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info
              label="Tipo"
              value={formatProjectTypeLabel(form.gerais.tipo)}
            />

            <Info label="Edital" value={editalName} />
            <Info label="Unidade" value={unidadeName} />

            <div className="sm:col-span-2">
              <Info label="Título" value={form.gerais.titulo} />
            </div>

            <div className="sm:col-span-2">
              <Info label="Title" value={form.gerais.title} />
            </div>

            <Info label="E-mail" value={form.gerais.email} />

            <Info
              label="Período"
              value={`${form.gerais.periodoIni || "—"} → ${
                form.gerais.periodoFim || "—"
              }`}
            />

            <Info
              label="Área de conhecimento"
              value={
                form.gerais.especialidade ||
                form.gerais.subarea ||
                form.gerais.area
              }
            />

            <Info label="Linha de pesquisa" value={form.gerais.linhaPesquisa} />

            <Info label="Grande área" value={form.gerais.grandeArea} />

            <Info
              label="Área / Subárea"
              value={`${form.gerais.area || "—"}${
                form.gerais.subarea ? ` • ${form.gerais.subarea}` : ""
              }`}
            />

            <Info label="Especialidade" value={form.gerais.especialidade} />
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
              <Tags size={14} />
              Palavras-chave
            </p>

            <p className="mt-1 text-sm text-neutral">
              {form.gerais.palavrasChave || "—"}
            </p>
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
              <Tags size={14} />
              Keywords
            </p>

            <p className="mt-1 text-sm text-neutral">
              {form.gerais.keywords || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Hash size={16} />
            Dados específicos {specificDataSuffix}
          </h3>

          {form.gerais.tipo === "interno" ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info
                label="Vinculado a grupo?"
                value={form.interno.vinculadoGrupo}
              />

              <Info label="Grupo de pesquisa" value={grupoName} />

              <Info
                label="Possui protocolo em comitê?"
                value={form.interno.possuiProtocoloEtica}
              />

              <Info
                label="Comitê de ética"
                value={form.interno.comiteEticaNome}
              />

              <div className="sm:col-span-2">
                <Info
                  label="Nº do protocolo"
                  value={form.interno.protocoloEtica}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Categoria" value={form.externo.categoriaProjeto} />

              <Info
                label="Subcategoria Nível I"
                value={form.externo.subcategoriaNivelI}
              />

              <Info
                label="Subcategoria Nível II"
                value={form.externo.subcategoriaNivelII}
              />

              <Info
                label="Definição de PI"
                value={form.externo.definicaoPropriedadeIntelectual}
              />

              <div className="sm:col-span-2">
                <Info
                  label="Tratamento da produção intelectual"
                  value={form.externo.tratamentoProducao}
                  preWrap
                />
              </div>
            </div>
          )}

          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-bold text-green-800">
                Submetido com sucesso!
              </p>

              <p className="mt-1 text-xs text-green-800/80">
                Agora você pode voltar para projetos ou cadastrar outro.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={backTo}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-100"
                >
                  Voltar para projetos
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setForm(initialState)
                    resetMemberDraft()
                    setSubmitted(false)
                    setCreatedProjectId(null)
                    setStep(1)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Cadastrar outro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <FileText size={16} />
          Campos textuais do Anexo II
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <Info
            label="Descrição resumida"
            value={form.gerais.descricaoResumida}
            preWrap
          />

          <Info label="Abstract" value={form.gerais.abstract} preWrap />

          <Info
            label="Introdução / justificativa"
            value={form.gerais.introducaoJustificativa}
            preWrap
          />

          <Info label="Objetivos" value={form.gerais.objetivos} preWrap />

          <Info label="Metodologia" value={form.gerais.metodologia} preWrap />

          <Info
            label="Resultados esperados"
            value={form.gerais.resultadosEsperados}
            preWrap
          />

          <Info label="Referências" value={form.gerais.referencias} preWrap />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <GraduationCap size={16} />
            ODS vinculados
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {form.gerais.objetivosDS.length === 0 ? (
              <span className="text-sm text-neutral">—</span>
            ) : (
              form.gerais.objetivosDS.map((ods) => (
                <span
                  key={ods.id}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral/10 px-3 py-1 text-xs font-semibold text-neutral"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-neutral/20 bg-white text-[11px]">
                    {ods.id}
                  </span>

                  {ods.label}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Upload size={16} />
            Arquivos
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <Info
              label="PDF complementar"
              value={form.gerais.pdfComplementar?.name || "—"}
            />

            <Info
              label="Comprovante externo"
              value={form.gerais.comprovanteExterno?.name || "—"}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <CalendarDays size={16} />
          Cronograma
        </h3>

        <div className="mt-4 space-y-2">
          {form.gerais.cronograma.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral/20 bg-neutral/5 p-3 text-sm text-neutral"
            >
              <span className="font-semibold text-primary">
                {formatCronogramaDuration(item.mesInicio, item.mesFim)}
              </span>{" "}
              — {item.atividade}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <Users size={16} />
          Membros do projeto ({form.gerais.membros.length})
        </h3>

        <div className="mt-4 space-y-3">
          {form.gerais.membros.map((membro) => (
            <div
              key={membro.id}
              className="rounded-xl border border-neutral/20 bg-neutral/5 p-4"
            >
              <p className="text-sm font-bold text-primary">{membro.nome}</p>

              <div className="mt-2 grid grid-cols-1 gap-3 text-sm text-neutral sm:grid-cols-2">
                <Info
                  label="Papel"
                  value={
                    memberLookups?.funcoes.find(
                      (item) => item.id === membro.papel,
                    )?.name ?? membro.papel
                  }
                />
                <Info
                  label="Vínculo"
                  value={
                    memberLookups?.categorias.find(
                      (item) => item.id === membro.categoria,
                    )?.name ?? membro.categoria
                  }
                />
                <Info label="E-mail" value={membro.email} />
                <Info label="Carga horária" value={`${membro.cargaHoraria}h`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={saving || submitted || !canGoStep6}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            saving || submitted || !canGoStep6
              ? "cursor-not-allowed bg-neutral/10 text-neutral"
              : "bg-primary text-white hover:bg-primary/90",
          )}
        >
          {submitButtonLabel}
        </button>
      </div>
    </Card>
  )
}

/* ================= PÁGINA ================= */

export type ProjectFormWizardProps = {
  backTo: string
  pageTitle?: string
  heading?: string
}

export default function ProjectFormWizard({
  backTo,
  pageTitle = "Cadastrar Projetos • PROPESQ",
  heading = "Cadastrar projeto",
}: Readonly<ProjectFormWizardProps>) {
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [form, setForm] = useState<FormState>(initialState)
  const [memberDraft, setMemberDraft] = useState<ProjectMember>({
    ...initialMember,
    id: createId("membro"),
  })
  const [editaisLookup, setEditaisLookup] = useState<LookupOption<number>[]>([])
  const [academicUnits, setAcademicUnits] = useState<LookupOption<number>[]>([])
  const [grandesAreasLookup, setGrandesAreasLookup] = useState<
    KnowledgeAreaLookup[]
  >([])
  const [areasLookup, setAreasLookup] = useState<KnowledgeAreaLookup[]>([])
  const [subareasLookup, setSubareasLookup] = useState<KnowledgeAreaLookup[]>(
    [],
  )
  const [especialidadesLookup, setEspecialidadesLookup] = useState<
    KnowledgeAreaLookup[]
  >([])
  const [odsOptions, setOdsOptions] = useState<ODS[]>([])
  const [researchGroups, setResearchGroups] = useState<ResearchGroupLookup[]>(
    [],
  )
  const [memberLookups, setMemberLookups] = useState<MemberLookupBundle | null>(
    null,
  )
  const [userOptions, setUserOptions] = useState<ResearchUserLookup[]>([])

  useEffect(() => {
    let cancelled = false

    void Promise.all([
      projectService.editalLookup(),
      projectService.academicUnitLookup(),
      projectService.knowledgeAreaLookup(),
      projectService.sustainableDevelopmentGoalsLookup(),
      projectService.researchGroupLookup(),
      projectService.memberLookups(),
    ])
      .then(
        ([
          editais,
          units,
          knowledgeAreas,
          sustainableGoals,
          groups,
          members,
        ]) => {
          if (cancelled) return
          setEditaisLookup(editais)
          setAcademicUnits(units)
          setGrandesAreasLookup(knowledgeAreas)
          setOdsOptions(
            sustainableGoals.map((item) => ({ id: item.id, label: item.name })),
          )
          setResearchGroups(groups)
          setMemberLookups(members)
        },
      )
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(
              error,
              "Não foi possível carregar os dados do formulário.",
            ),
          )
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!form.gerais.grandeArea) {
      setAreasLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({ grande_area: form.gerais.grandeArea })
      .then((items) => {
        if (!cancelled) setAreasLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(error, "Erro ao carregar áreas de conhecimento."),
          )
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea])

  useEffect(() => {
    if (!form.gerais.area) {
      setSubareasLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({
        grande_area: form.gerais.grandeArea,
        area: form.gerais.area,
      })
      .then((items) => {
        if (!cancelled) setSubareasLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(getErrorMessage(error, "Erro ao carregar subáreas."))
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea, form.gerais.area])

  useEffect(() => {
    if (!form.gerais.subarea) {
      setEspecialidadesLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({
        grande_area: form.gerais.grandeArea,
        area: form.gerais.area,
        sub_area: form.gerais.subarea,
      })
      .then((items) => {
        if (!cancelled) setEspecialidadesLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(error, "Erro ao carregar especialidades."),
          )
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea, form.gerais.area, form.gerais.subarea])

  useEffect(() => {
    if (!memberDraft.categoria || memberDraft.categoria === "EXTERNO") {
      setUserOptions([])
      return
    }
    let cancelled = false
    void projectService
      .userLookup({ funcao: memberDraft.categoria })
      .then((items) => {
        if (!cancelled) setUserOptions(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(getErrorMessage(error, "Erro ao carregar usuários."))
      })
    return () => {
      cancelled = true
    }
  }, [memberDraft.categoria])

  const canGoStep2 = useMemo(() => checkCanGoStep2(form), [form])

  const canGoStep3 = useMemo(
    () => checkCanGoStep3(form, canGoStep2),
    [form, canGoStep2],
  )

  const canGoStep4 = useMemo(
    () => checkCanGoStep4(form, canGoStep3),
    [form, canGoStep3],
  )

  const canGoStep5 = useMemo(
    () => checkCanGoStep5(form, canGoStep4),
    [form, canGoStep4],
  )

  const canGoStep6 = useMemo(
    () => checkCanGoStep6(form, canGoStep5),
    [form, canGoStep5],
  )

  const stepFlags = useMemo(
    () => ({
      canGoStep2,
      canGoStep3,
      canGoStep4,
      canGoStep5,
      canGoStep6,
      submitted,
    }),
    [canGoStep2, canGoStep3, canGoStep4, canGoStep5, canGoStep6, submitted],
  )

  const canAddMember = useMemo(() => {
    const baseValid = Boolean(
      memberDraft.categoria &&
        memberDraft.papel &&
        Number(memberDraft.cargaHoraria) > 0,
    )
    if (!baseValid) return false
    if (memberDraft.categoria === "EXTERNO") {
      return Boolean(
        memberDraft.nome.trim() &&
          /^\S+@\S+\.\S+$/.test(memberDraft.email.trim()) &&
          memberDraft.sexo &&
          memberDraft.formacao &&
          memberDraft.tipoExterno,
      )
    }
    return Boolean(
      memberDraft.userId &&
        !form.gerais.membros.some(
          (member) => member.userId === memberDraft.userId,
        ),
    )
  }, [form.gerais.membros, memberDraft])

  function stepDone(currentStep: Step) {
    return checkStepDone(currentStep, stepFlags)
  }

  function goNext() {
    if (!canAdvanceFromStep(step, stepFlags)) return

    setStep((current) => (current < 6 ? ((current + 1) as Step) : current))
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  function resetMemberDraft() {
    setMemberDraft({
      ...initialMember,
      id: createId("membro"),
    })
  }

  function addMember() {
    if (!canAddMember) return

    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: [
          ...current.gerais.membros,
          {
            ...memberDraft,
            id: memberDraft.id || createId("membro"),
          },
        ],
      },
    }))

    resetMemberDraft()
  }

  function removeMember(id: string) {
    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: current.gerais.membros.filter((membro) => membro.id !== id),
      },
    }))
  }

  async function submit() {
    if (!canGoStep6) return

    setSaving(true)
    setSubmitError("")

    try {
      const attachment =
        form.gerais.pdfComplementar ?? form.gerais.comprovanteExterno
      const attachmentError = validateProjectAttachment(attachment)
      if (attachmentError) throw new Error(attachmentError)

      const internalMembers = form.gerais.membros
        .filter((member) => member.categoria !== "EXTERNO")
        .map((member) => ({
          user_id: Number(member.userId),
          funcao: member.papel,
          ch_dedicadas: Number(member.cargaHoraria),
        }))
      const externalMembers = form.gerais.membros
        .filter((member) => member.categoria === "EXTERNO")
        .map((member) => ({
          funcao: member.papel,
          ch_dedicada: Number(member.cargaHoraria),
          ...(member.cpf.trim() && { cpf: member.cpf.trim() }),
          nome: member.nome.trim(),
          email: member.email.trim(),
          sexo: member.sexo,
          formacao: member.formacao,
          tipo: member.tipoExterno,
        }))

      const created = createdProjectId
        ? { id: createdProjectId }
        : await projectService.create({
            tipo: form.gerais.tipo === "interno" ? "INTERNO" : "EXTERNO",
            titulo: form.gerais.titulo.trim(),
            title: form.gerais.title.trim(),
            edital_id: Number(form.gerais.editalPesquisa),
            vigencia: form.gerais.periodoFim,
            data_inicio: form.gerais.periodoIni,
            data_fim: form.gerais.periodoFim,
            email: form.gerais.email.trim(),
            palavras_chave: splitKeywords(form.gerais.palavrasChave),
            key_words: splitKeywords(form.gerais.keywords),
            pesquisa_objetivo_ids: form.gerais.objetivosDS.map(
              (item) => item.id,
            ),
            corpo_projeto: {
              resumo: form.gerais.descricaoResumida.trim(),
              abstract: form.gerais.abstract.trim(),
              introducao: form.gerais.introducaoJustificativa.trim(),
              objetivos: form.gerais.objetivos.trim(),
              metodologia: form.gerais.metodologia.trim(),
              resultados_esperados: form.gerais.resultadosEsperados.trim(),
              referencias: form.gerais.referencias.trim(),
            },
            atividades: form.gerais.cronograma.map((item) => ({
              descricao: item.atividade.trim(),
              meses: Array.from(
                { length: item.mesFim - item.mesInicio + 1 },
                (_, index) => ({
                  data: getScheduleMonth(
                    form.gerais.periodoIni,
                    item.mesInicio + index,
                  ),
                }),
              ),
            })),
            unidade_id: Number(form.gerais.unidade),
            area_conhecimento_id: Number(form.gerais.areaConhecimento),
            linha_pesquisa: form.gerais.linhaPesquisa.trim(),
            vinculado_grupo_pesquisa: form.interno.vinculadoGrupo === "Sim",
            ...(form.interno.vinculadoGrupo === "Sim" && {
              grupo_pesquisa_id: Number(form.interno.grupoPesquisa),
            }),
            possui_comite_etica: form.interno.possuiProtocoloEtica === "Sim",
            ...(form.interno.possuiProtocoloEtica === "Sim" && {
              comite_etica: form.interno.comiteEticaNome.trim(),
              numero_protocolo: form.interno.protocoloEtica.trim(),
            }),
            membros: internalMembers,
            membros_externos: externalMembers,
          })

      setCreatedProjectId(created.id)
      if (attachment)
        await projectService.uploadAttachment(created.id, attachment)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Não foi possível cadastrar o projeto."),
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <div className="flex items-center justify-between">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-light bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileText size={14} />
              Cadastro de projeto
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              {heading}
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Preencha os campos do Anexo II, vincule ODS, cronograma, membros e
              documentos complementares. Ao submeter, o projeto entra com status
              inicial{" "}
              <span className="font-semibold text-primary">SUBMETIDO</span>.
            </p>
          </div>

          <div className="hidden max-w-xl flex-wrap items-center justify-end gap-2 md:flex">
            <StepPill active={step === 1} done={stepDone(1)}>
              1. Tipo
            </StepPill>

            <StepPill active={step === 2} done={stepDone(2)}>
              2. Anexo II
            </StepPill>

            <StepPill active={step === 3} done={stepDone(3)}>
              3. ODS e cronograma
            </StepPill>

            <StepPill active={step === 4} done={stepDone(4)}>
              4. Membros e uploads
            </StepPill>

            <StepPill active={step === 5} done={stepDone(5)}>
              5. Específico
            </StepPill>

            <StepPill active={step === 6} done={stepDone(6)}>
              6. Revisão
            </StepPill>
          </div>
        </div>

        {submitError && step !== 2 && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
            role="alert"
          >
            {submitError}
          </div>
        )}

        {
          {
            1: (
              <WizardStep1Tipo
                form={form}
                setForm={setForm}
                goNext={goNext}
                canGoStep2={canGoStep2}
              />
            ),
            2: (
              <WizardStep2Anexo
                form={form}
                setForm={setForm}
                goNext={goNext}
                goBack={goBack}
                canGoStep3={canGoStep3}
                editais={editaisLookup}
                unidadesAcademicas={academicUnits}
                grandesAreasLookup={grandesAreasLookup}
                areasLookup={areasLookup}
                subareasLookup={subareasLookup}
                especialidadesLookup={especialidadesLookup}
                submitError={submitError}
              />
            ),
            3: (
              <WizardStep3Ods
                form={form}
                setForm={setForm}
                goNext={goNext}
                goBack={goBack}
                canGoStep4={canGoStep4}
                odsOptions={odsOptions}
              />
            ),
            4: (
              <WizardStep4Membros
                form={form}
                setForm={setForm}
                goNext={goNext}
                goBack={goBack}
                canGoStep5={canGoStep5}
                memberDraft={memberDraft}
                setMemberDraft={setMemberDraft}
                memberLookups={memberLookups}
                userOptions={userOptions}
                addMember={addMember}
                removeMember={removeMember}
                canAddMember={canAddMember}
                resetMemberDraft={resetMemberDraft}
              />
            ),
            5: (
              <WizardStep5Especifico
                form={form}
                setForm={setForm}
                goNext={goNext}
                goBack={goBack}
                canGoStep6={canGoStep6}
                researchGroups={researchGroups}
              />
            ),
            6: (
              <WizardStep6Revisao
                form={form}
                goBack={goBack}
                submit={submit}
                saving={saving}
                submitted={submitted}
                canGoStep6={canGoStep6}
                backTo={backTo}
                setForm={setForm}
                setSubmitted={setSubmitted}
                setCreatedProjectId={setCreatedProjectId}
                setStep={setStep}
                resetMemberDraft={resetMemberDraft}
                editalName={
                  editaisLookup.find(
                    (item) => item.id === Number(form.gerais.editalPesquisa),
                  )?.name ?? ""
                }
                unidadeName={
                  academicUnits.find(
                    (item) => item.id === Number(form.gerais.unidade),
                  )?.name ?? ""
                }
                grupoName={
                  researchGroups.find(
                    (item) => item.id === Number(form.interno.grupoPesquisa),
                  )?.name ?? ""
                }
                memberLookups={memberLookups}
              />
            ),
          }[step]
        }

        <div className="flex justify-center pt-2">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-neutral/5"
          >
            Finalizar e voltar para projetos
          </Link>
        </div>
      </div>
    </main>
  )
}
