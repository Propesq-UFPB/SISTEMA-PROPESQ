export const PROJECT_STATUS = ['Em análise', 'Aprovado', 'Rascunho'] as const

export const projetos = [
  {
    id: 'P-2025-001',
    titulo: 'Visão Computacional para Fenologia do Semiárido',
    centro: 'CCEN',
    area: 'Ciência da Computação',
    categoria: 'Pesquisa',
    funcao: 'Coordenador',
    ch: 20,
    inicio: '2025-03-01',
    fim: '2025-11-15',
    status: 'Em análise',
    bolsistas: 1,
    voluntarios: 1,
    prazo: '2025-11-15',
  },
  {
    id: 'P-2025-002',
    titulo: 'Rede Neural para Diagnóstico de Doenças Tropicais',
    centro: 'CCS',
    area: 'Medicina',
    categoria: 'Extensão',
    funcao: 'Participante',
    ch: 12,
    inicio: '2025-05-10',
    fim: '2025-12-01',
    status: 'Aprovado',
    bolsistas: 2,
    voluntarios: 0,
    prazo: '2025-12-01',
  },
  {
    id: 'P-2025-003',
    titulo: 'Banco de Dados de Aves da Paraíba',
    centro: 'CCT',
    area: 'Biologia',
    categoria: 'Iniciação Científica',
    funcao: 'Voluntário',
    ch: 10,
    inicio: '2025-04-15',
    fim: '2025-10-31',
    status: 'Rascunho',
    bolsistas: 0,
    voluntarios: 2,
    prazo: '2025-10-31',
  },
]

export const relatorios = [
  { id: 'R-001', tipo: 'Parcial', projeto: 'P-2025-002', prazo: '2025-11-05', status: 'Pendente' },
  { id: 'R-002', tipo: 'Final', projeto: 'P-2024-017', prazo: '2025-10-30', status: 'Em revisão' },
]

export const notificacoes = [
  { id: 1, texto: 'Prazo do relatório parcial em 5 dias', tipo: 'alerta' },
  { id: 2, texto: 'Projeto P-2025-001 recebeu novo parecer', tipo: 'info' },
]

export const planos = [
  { id: 'PL-101', projetoId: 'P-2025-002', metas: 'Coletar 1k imagens', cronograma: 'Out-Dez/2025', status: 'Aprovado' },
]

export const certificados = [
  {
    id: 'C-0001',
    nome: 'Certificado de Participação',
    pessoa: 'Discente Exemplo',
    projetoId: 'P-2024-017',
    codigo: 'UFPB-ABC123',
    data: '2025-08-31',
  },
]

export type ProjetoStatus = (typeof PROJECT_STATUS)[number]
