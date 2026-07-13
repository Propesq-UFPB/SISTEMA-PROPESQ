import React, { useMemo, useState } from "react"
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Send,
  X,
  ChevronDown,
  SlidersHorizontal,
  MessagesSquare,
  Check,
} from "lucide-react"
import { Helmet } from "react-helmet"

type Project = {
  id: string
  year: number
  title: string
  unit: string
  status: string
  type: "INTERNO" | "EXTERNO"
  code?: string
  researcher?: string
  centerUnit?: string
  objectives?: string
  researchLine?: string
  knowledgeArea?: string
  researchGroup?: string
  fundingAgency?: string
  notice?: string
  situation?: string
  category?: string
  finalReport?: "SUBMETIDO" | "NAO_SUBMETIDO"
}

type Person = {
  id: string
  name: string
  email?: string
  role: "COORDENADOR" | "DISCENTE"
  projectId: string
}

function normalize(s: string) {
  return (s ?? "").trim().toLowerCase()
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    year: 2025,
    title:
      "Sistema Inteligente de Geração de Respostas ao Impulso de Salas baseado em Meta-Aprendizagem: Aplicação de Embeddings Perceptuais para Produção Musical e Design de Som",
    unit: "CI - DI",
    status: "EM EXECUÇÃO",
    type: "EXTERNO",
    knowledgeArea: "Cirurgia",
    researchGroup: "ARIA - Laboratório de Aplicações em Inteligência Artificial",
    notice: "2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq",
    finalReport: "NAO_SUBMETIDO",
    centerUnit: "CCHLA - COORDENAÇÃO DE PSICOLOGIA (11.01.15.32)",
  },
  {
    id: "p2",
    year: 2025,
    title:
      "Contrastive Learning para Detecção Automática de Jogadas e Geração de Comentários em Vídeos de Futebol",
    unit: "CI-DCC",
    status: "EM EXECUÇÃO",
    type: "EXTERNO",
    knowledgeArea: "Cirurgia",
    researchGroup: "ARIA - Laboratório de Aplicações em Inteligência Artificial",
    notice: "2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq",
    finalReport: "NAO_SUBMETIDO",
    centerUnit: "CCHLA - COORDENAÇÃO DE PSICOLOGIA (11.01.15.32)",
  },
]

const MOCK_PEOPLE: Person[] = [
  { id: "c1", name: "Prof. Ana Silva", email: "ana@ufpb.br", role: "COORDENADOR", projectId: "p1" },
  { id: "c2", name: "Prof. João Lima", email: "joao@ufpb.br", role: "COORDENADOR", projectId: "p2" },
  { id: "s1", name: "Maria Souza", email: "maria@discente.ufpb.br", role: "DISCENTE", projectId: "p1" },
  { id: "s2", name: "Carlos Pereira", email: "carlos@discente.ufpb.br", role: "DISCENTE", projectId: "p2" },
]

export default function AdmProjectCommunicateWizard() {
  const [step, setStep] = useState<1 | 2>(1)

  // ====== filtros (itens da imagem) ======
  const [tipo, setTipo] = useState<"INTERNO" | "EXTERNO">("EXTERNO")
  const [codigo, setCodigo] = useState("")
  const [ano, setAno] = useState("")
  const [pesquisador, setPesquisador] = useState("")
  const [centroUnidade, setCentroUnidade] = useState("CCHLA - COORDENAÇÃO DE PSICOLOGIA (11.01.15.32)")
  const [titulo, setTitulo] = useState("")
  const [objetivos, setObjetivos] = useState("")
  const [linhaPesquisa, setLinhaPesquisa] = useState("")
  const [areaConhecimento, setAreaConhecimento] = useState("Cirurgia")
  const [grupoPesquisa, setGrupoPesquisa] = useState("ARIA - Laboratório de Aplicações em Inteligência Artificial")
  const [agenciaFinanciadora, setAgenciaFinanciadora] = useState("-- SELECIONE --")
  const [edital, setEdital] = useState("2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq")
  const [situacaoProjeto, setSituacaoProjeto] = useState("-- SELECIONE --")
  const [categoriaProjeto, setCategoriaProjeto] = useState("-- SELECIONE --")
  const [relatorioFinal, setRelatorioFinal] = useState<"SUBMETIDO" | "NAO_SUBMETIDO">("NAO_SUBMETIDO")

  // checkbox “ativar filtro” como no SIGAA (coluna à esquerda)
  const [useTipo, setUseTipo] = useState(true)
  const [useCodigo, setUseCodigo] = useState(false)
  const [useAno, setUseAno] = useState(false)
  const [usePesquisador, setUsePesquisador] = useState(false)
  const [useCentroUnidade, setUseCentroUnidade] = useState(false)
  const [useTitulo, setUseTitulo] = useState(false)
  const [useObjetivos, setUseObjetivos] = useState(false)
  const [useLinhaPesquisa, setUseLinhaPesquisa] = useState(false)
  const [useAreaConhecimento, setUseAreaConhecimento] = useState(true)
  const [useGrupoPesquisa, setUseGrupoPesquisa] = useState(true)
  const [useAgencia, setUseAgencia] = useState(false)
  const [useEdital, setUseEdital] = useState(true)
  const [useSituacao, setUseSituacao] = useState(false)
  const [useCategoria, setUseCategoria] = useState(false)
  const [useRelatorioFinal, setUseRelatorioFinal] = useState(true)

  // período (igual à foto)
  const [usePeriodo, setUsePeriodo] = useState(false)
  const [periodoInicio, setPeriodoInicio] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")

  // barra de busca / toggle
  const [showAdvanced, setShowAdvanced] = useState(true)

  // ====== resultados da busca ======
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])

  const filteredProjects = useMemo(() => {
    if (!hasSearched) return []
    return MOCK_PROJECTS.filter((p) => {
      if (useTipo && p.type !== tipo) return false
      if (useCodigo && normalize(p.code ?? "").indexOf(normalize(codigo)) === -1) return false
      if (useAno && String(p.year) !== String(ano).trim()) return false
      if (usePesquisador && normalize(p.researcher ?? "").indexOf(normalize(pesquisador)) === -1) return false
      if (useCentroUnidade && normalize(p.centerUnit ?? "").indexOf(normalize(centroUnidade)) === -1) return false
      if (useTitulo && normalize(p.title).indexOf(normalize(titulo)) === -1) return false
      if (useObjetivos && normalize(p.objectives ?? "").indexOf(normalize(objetivos)) === -1) return false
      if (useLinhaPesquisa && normalize(p.researchLine ?? "").indexOf(normalize(linhaPesquisa)) === -1) return false
      if (useAreaConhecimento && normalize(p.knowledgeArea ?? "") !== normalize(areaConhecimento)) return false
      if (useGrupoPesquisa && normalize(p.researchGroup ?? "") !== normalize(grupoPesquisa)) return false
      if (useAgencia && normalize(p.fundingAgency ?? "") !== normalize(agenciaFinanciadora)) return false
      if (useEdital && normalize(p.notice ?? "").indexOf(normalize(edital)) === -1) return false
      if (useSituacao && normalize(p.situation ?? "") !== normalize(situacaoProjeto)) return false
      if (useCategoria && normalize(p.category ?? "") !== normalize(categoriaProjeto)) return false
      if (useRelatorioFinal && (p.finalReport ?? "NAO_SUBMETIDO") !== relatorioFinal) return false

      // protótipo de período: como o mock não tem datas, mantemos só o layout (sem filtrar de fato)
      if (usePeriodo) {
        if (!String(periodoInicio).trim() && !String(periodoFim).trim()) {
          // deixa passar (não filtra)
        }
      }

      return true
    })
  }, [
    hasSearched,
    tipo,
    codigo,
    ano,
    pesquisador,
    centroUnidade,
    titulo,
    objetivos,
    linhaPesquisa,
    areaConhecimento,
    grupoPesquisa,
    agenciaFinanciadora,
    edital,
    situacaoProjeto,
    categoriaProjeto,
    relatorioFinal,
    useTipo,
    useCodigo,
    useAno,
    usePesquisador,
    useCentroUnidade,
    useTitulo,
    useObjetivos,
    useLinhaPesquisa,
    useAreaConhecimento,
    useGrupoPesquisa,
    useAgencia,
    useEdital,
    useSituacao,
    useCategoria,
    useRelatorioFinal,
    usePeriodo,
    periodoInicio,
    periodoFim,
  ])

  function toggleProject(id: string) {
    setSelectedProjectIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleBuscar() {
    setHasSearched(true)
    setSelectedProjectIds([]) // comportamento parecido com “nova busca”
  }

  function handleCancelar() {
    setHasSearched(false)
    setSelectedProjectIds([])
    setStep(1)

    // limpar filtros (como “Limpar” da foto)
    setCodigo("")
    setAno("")
    setPesquisador("")
    setTitulo("")
    setObjetivos("")
    setLinhaPesquisa("")
    setAgenciaFinanciadora("-- SELECIONE --")
    setSituacaoProjeto("-- SELECIONE --")
    setCategoriaProjeto("-- SELECIONE --")
    setPeriodoInicio("")
    setPeriodoFim("")
  }

  // ====== passo 2 (comunicação) ======
  const [audience, setAudience] = useState<"COORDENADORES" | "DISCENTES">("COORDENADORES")
  const [peopleSearch, setPeopleSearch] = useState("")
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const peopleFromSelectedProjects = useMemo(() => {
    const role = audience === "COORDENADORES" ? "COORDENADOR" : "DISCENTE"
    return MOCK_PEOPLE
      .filter((p) => selectedProjectIds.includes(p.projectId))
      .filter((p) => p.role === role)
      .filter((p) => {
        const q = normalize(peopleSearch)
        if (!q) return true
        return normalize(p.name).includes(q) || normalize(p.email ?? "").includes(q)
      })
  }, [audience, peopleSearch, selectedProjectIds])

  function togglePerson(id: string) {
    setSelectedPeopleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function goNext() {
    if (selectedProjectIds.length === 0) return
    setStep(2)
    setSelectedPeopleIds([])
    setPeopleSearch("")
  }

  function goBack() {
    setStep(1)
    setSelectedPeopleIds([])
  }

  function handleSend() {
    if (!subject.trim() || !body.trim() || selectedPeopleIds.length === 0) return
    // trocar por API: POST /communications (projetos, audience, peopleIds, subject, body)
    alert(`Enviado para ${selectedPeopleIds.length} destinatário(s).`)
    setSubject("")
    setBody("")
    setSelectedPeopleIds([])
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">

        <Helmet>
          <title>Comunicação • PROPESQ</title>
        </Helmet>

        {/* Botão voltar */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </button>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <MessagesSquare size={14} />
                Comunicação
              </div>

              <h1 className="mt-3 text-[28px] leading-tight font-bold tracking-tight text-primary">
                Comunicar Projetos de Pesquisa
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Filtre e selecione projetos e depois escolha os destinatários
                para enviar assunto e mensagem.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StepPill active={step === 1} done={step === 2}>
                1. Seleção
              </StepPill>
              <StepPill active={step === 2} done={false}>
                2. Mensagem
              </StepPill>
            </div>
          </div>
        </div>

        {step === 1 && (
          <>
            {/* ======= FILTROS  ======= */}
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              {/* Topbar */}
              <div className="p-4 border-b border-border">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-neutral" size={16} />
                    <input
                      className="w-full h-10 pl-9 pr-3 rounded-full border border-border text-sm outline-none focus:ring-2 focus:ring-primary/25"
                      placeholder="Buscar por título, coordenador ou código..."
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((v) => !v)}
                      className="h-10 px-3 rounded-full border border-border bg-white hover:bg-muted text-sm inline-flex items-center gap-2"
                    >
                      <SlidersHorizontal size={16} />
                      Busca avançada
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelar}
                      className="h-10 px-3 rounded-full border border-border bg-white hover:bg-muted text-sm inline-flex items-center gap-2"
                    >
                      <X size={16} />
                      Limpar
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">

                {showAdvanced && (
                  <div className="space-y-2">
                    <Row
                      checked={useTipo}
                      onCheck={setUseTipo}
                      label="Tipo:"
                      field={
                        <div className="flex items-center gap-6">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="tipo"
                              checked={tipo === "INTERNO"}
                              onChange={() => setTipo("INTERNO")}
                            />
                            Interno
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="tipo"
                              checked={tipo === "EXTERNO"}
                              onChange={() => setTipo("EXTERNO")}
                            />
                            Externo
                          </label>
                        </div>
                      }
                    />

                    <Row
                      checked={useCodigo}
                      onCheck={setUseCodigo}
                      label="Código:"
                      field={
                        <input
                          className="h-8 w-56 rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={codigo}
                          onChange={(e) => setCodigo(e.target.value)}
                          placeholder="ID ou código..."
                        />
                      }
                    />

                    <Row
                      checked={useAno}
                      onCheck={setUseAno}
                      label="Ano:"
                      field={
                        <input
                          className="h-8 w-24 rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={ano}
                          onChange={(e) => setAno(e.target.value)}
                          placeholder="Ex.: 2025"
                        />
                      }
                    />

                    <Row
                      checked={usePesquisador}
                      onCheck={setUsePesquisador}
                      label="Pesquisador:"
                      field={
                        <input
                          className="h-8 w-full max-w-3xl rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={pesquisador}
                          onChange={(e) => setPesquisador(e.target.value)}
                          placeholder="Nome do coordenador/pesquisador..."
                        />
                      }
                    />

                    <Row
                      checked={useCentroUnidade}
                      onCheck={setUseCentroUnidade}
                      label="Centro/Unidade:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-3xl rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={centroUnidade}
                            onChange={(e) => setCentroUnidade(e.target.value)}
                          >
                            <option>CCHLA - COORDENAÇÃO DE PSICOLOGIA (11.01.15.32)</option>
                            <option>CI - CENTRO DE INFORMÁTICA</option>
                            <option>CCS - CENTRO DE CIÊNCIAS DA SAÚDE</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useTitulo}
                      onCheck={setUseTitulo}
                      label="Título:"
                      field={
                        <input
                          className="h-8 w-full max-w-4xl rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                        />
                      }
                    />

                    <Row
                      checked={useObjetivos}
                      onCheck={setUseObjetivos}
                      label="Objetivos:"
                      field={
                        <input
                          className="h-8 w-full max-w-4xl rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={objetivos}
                          onChange={(e) => setObjetivos(e.target.value)}
                        />
                      }
                    />

                    <Row
                      checked={useLinhaPesquisa}
                      onCheck={setUseLinhaPesquisa}
                      label="Linha de Pesquisa:"
                      field={
                        <input
                          className="h-8 w-full max-w-4xl rounded-sm border border-border px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                          value={linhaPesquisa}
                          onChange={(e) => setLinhaPesquisa(e.target.value)}
                        />
                      }
                    />

                    <Row
                      checked={useAreaConhecimento}
                      onCheck={setUseAreaConhecimento}
                      label="Área do Conhecimento:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-md rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={areaConhecimento}
                            onChange={(e) => setAreaConhecimento(e.target.value)}
                          >
                            <option>Cirurgia</option>
                            <option>Ciência da Computação</option>
                            <option>Psicologia</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useGrupoPesquisa}
                      onCheck={setUseGrupoPesquisa}
                      label="Grupo de Pesquisa:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-3xl rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={grupoPesquisa}
                            onChange={(e) => setGrupoPesquisa(e.target.value)}
                          >
                            <option>ARIA - Laboratório de Aplicações em Inteligência Artificial</option>
                            <option>VISLAB - Laboratório de Visão</option>
                            <option>HCI - Interação Humano-Computador</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useAgencia}
                      onCheck={setUseAgencia}
                      label="Agência Financiadora:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-md rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={agenciaFinanciadora}
                            onChange={(e) => setAgenciaFinanciadora(e.target.value)}
                          >
                            <option>-- SELECIONE --</option>
                            <option>CNPq</option>
                            <option>CAPES</option>
                            <option>FAPESQ</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useEdital}
                      onCheck={setUseEdital}
                      label="Edital:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-4xl rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={edital}
                            onChange={(e) => setEdital(e.target.value)}
                          >
                            <option>2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq</option>
                            <option>2024/2025 - EDITAL 02/2024/PROPESQ - PIBIC/UFPB/CNPq</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useSituacao}
                      onCheck={setUseSituacao}
                      label="Situação do Projeto:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-md rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={situacaoProjeto}
                            onChange={(e) => setSituacaoProjeto(e.target.value)}
                          >
                            <option>-- SELECIONE --</option>
                            <option>EM EXECUÇÃO</option>
                            <option>CONCLUÍDO</option>
                            <option>CANCELADO</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useCategoria}
                      onCheck={setUseCategoria}
                      label="Categoria do Projeto:"
                      field={
                        <SelectLike>
                          <select
                            className="h-8 w-full max-w-md rounded-sm border border-border pl-2 pr-9 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
                            value={categoriaProjeto}
                            onChange={(e) => setCategoriaProjeto(e.target.value)}
                          >
                            <option>-- SELECIONE --</option>
                            <option>Pesquisa</option>
                            <option>Inovação</option>
                            <option>Extensão</option>
                          </select>
                        </SelectLike>
                      }
                    />

                    <Row
                      checked={useRelatorioFinal}
                      onCheck={setUseRelatorioFinal}
                      label="Relatório Final:"
                      field={
                        <div className="flex items-center gap-6">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="rf"
                              checked={relatorioFinal === "SUBMETIDO"}
                              onChange={() => setRelatorioFinal("SUBMETIDO")}
                            />
                            Submetido
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="rf"
                              checked={relatorioFinal === "NAO_SUBMETIDO"}
                              onChange={() => setRelatorioFinal("NAO_SUBMETIDO")}
                            />
                            Não Submetido
                          </label>
                        </div>
                      }
                    />

                    {/* Período (como na foto) */}
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[11px] font-semibold text-neutral mb-2 tracking-wide">
                            PERÍODO (INÍCIO)
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={usePeriodo}
                              onChange={(e) => setUsePeriodo(e.target.checked)}
                              title="Ativar filtro de período"
                            />
                            <input
                              className="h-9 w-full rounded-md border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                              placeholder="dd/mm/aaaa"
                              value={periodoInicio}
                              onChange={(e) => setPeriodoInicio(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold text-neutral mb-2 tracking-wide">
                            PERÍODO (FIM)
                          </div>
                          <input
                            className="h-9 w-full rounded-md border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                            placeholder="dd/mm/aaaa"
                            value={periodoFim}
                            onChange={(e) => setPeriodoFim(e.target.value)}
                            disabled={!usePeriodo}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleBuscar}
                    className="h-10 px-4 rounded-md bg-primary text-white text-sm inline-flex items-center gap-2"
                  >
                    <Search size={16} />
                    Buscar
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-neutral">
                  Clique em “...” na tabela para abrir ações do projeto.
                </p>
              </div>
            </div>

            {/* ======= RESULTADOS ======= */}
            {hasSearched && (
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-primary/90 text-white px-4 py-2 font-semibold tracking-wide text-sm text-center">
                  PROJETOS DE PESQUISA LOCALIZADOS ({filteredProjects.length})
                </div>

                <div className="p-3">
                  <div className="overflow-auto">
                    <table className="w-full text-sm border border-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border border-border p-2 w-16 text-left">Todos</th>
                          <th className="border border-border p-2 w-20 text-left">Ano</th>
                          <th className="border border-border p-2 text-left">Título</th>
                          <th className="border border-border p-2 w-28 text-left">Unidade</th>
                          <th className="border border-border p-2 w-32 text-left">Situação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/60">
                            <td className="border border-border p-2">
                              <input
                                type="checkbox"
                                checked={selectedProjectIds.includes(p.id)}
                                onChange={() => toggleProject(p.id)}
                              />
                            </td>
                            <td className="border border-border p-2">{p.year}</td>
                            <td className="border border-border p-2">{p.title}</td>
                            <td className="border border-border p-2">{p.unit}</td>
                            <td className="border border-border p-2">{p.status}</td>
                          </tr>
                        ))}
                        {filteredProjects.length === 0 && (
                          <tr>
                            <td className="border border-border p-3 text-neutral" colSpan={5}>
                              Nenhum projeto encontrado com os filtros selecionados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={goNext}
                      disabled={selectedProjectIds.length === 0}
                      className="px-4 py-2 rounded-md bg-primary text-white text-sm inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      Próximo passo <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <div className="border border-border rounded-md overflow-hidden">
            <div className="bg-primary/90 text-white px-4 py-2 font-semibold tracking-wide text-sm text-center">
              DESTINATÁRIOS + MENSAGEM
            </div>

            <div className="p-4 space-y-4">
              {/* Escolha: coordenadores ou discentes */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setAudience("COORDENADORES")
                    setSelectedPeopleIds([])
                  }}
                  className={`px-4 py-2 rounded-md text-sm ${
                    audience === "COORDENADORES" ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  Comunicar Coordenadores
                </button>
                <button
                  onClick={() => {
                    setAudience("DISCENTES")
                    setSelectedPeopleIds([])
                  }}
                  className={`px-4 py-2 rounded-md text-sm ${
                    audience === "DISCENTES" ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  Comunicar Discentes
                </button>
              </div>

              {/* Busca por pessoa */}
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 text-neutral" size={16} />
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-border text-sm"
                    placeholder="Buscar por nome ou email..."
                    value={peopleSearch}
                    onChange={(e) => setPeopleSearch(e.target.value)}
                  />
                </div>

                <div className="text-sm text-neutral">
                  Projetos selecionados: <span className="font-semibold">{selectedProjectIds.length}</span>
                </div>
              </div>

              {/* Lista de destinatários */}
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm font-medium flex items-center justify-between">
                  <span>Destinatários ({peopleFromSelectedProjects.length})</span>
                  <button
                    type="button"
                    className="text-xs underline inline-flex items-center gap-2"
                    onClick={() => {
                      const all = peopleFromSelectedProjects.map((p) => p.id)
                      const allSelected = all.every((id) => selectedPeopleIds.includes(id))
                      setSelectedPeopleIds(allSelected ? [] : all)
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{selectedPeopleIds.length > 0 ? "Alternar seleção" : "Selecionar todos"}</span>
                      <CheckIcon />
                    </span>
                  </button>
                </div>

                <div className="divide-y">
                  {peopleFromSelectedProjects.map((p) => (
                    <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPeopleIds.includes(p.id)}
                        onChange={() => togglePerson(p.id)}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-neutral">{p.email ?? "—"}</div>
                      </div>
                    </label>
                  ))}

                  {peopleFromSelectedProjects.length === 0 && (
                    <div className="px-3 py-4 text-sm text-neutral">
                      Nenhum destinatário encontrado para os projetos selecionados.
                    </div>
                  )}
                </div>
              </div>

              {/* Assunto + corpo */}
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <label className="text-sm font-medium">Assunto</label>
                  <input
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex.: Pendência no projeto / Atualização do edital / Prazo de relatório"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-medium">Mensagem</label>
                  <textarea
                    className="w-full min-h-[160px] rounded-md border border-border px-3 py-2 text-sm"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escreva o corpo da mensagem..."
                  />
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-between gap-2">
                <button
                  onClick={goBack}
                  className="px-4 py-2 rounded-md border border-border bg-white hover:bg-muted text-sm inline-flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>

                <button
                  onClick={handleSend}
                  disabled={!subject.trim() || !body.trim() || selectedPeopleIds.length === 0}
                  className="px-4 py-2 rounded-md bg-primary text-white text-sm inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} /> Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row(props: {
  checked: boolean
  onCheck: (v: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[18px_160px_1fr] items-center gap-3">
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onCheck(e.target.checked)} />
      <div className="text-sm text-neutral">{props.label}</div>
      <div className={props.checked ? "" : "opacity-60 pointer-events-none"}>{props.field}</div>
    </div>
  )
}

function SelectLike({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block w-full">
      {children}
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral" size={16} />
    </div>
  )
}

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-border bg-white">
      <span className="text-xs">✓</span>
    </span>
  )
}

function StepPill({
  active,
  done,
  children,
}: {
  active: boolean
  done: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
          : done
          ? "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-bold text-primary"
          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
      }
    >
      {done && !active && <Check size={12} />}
      {children}
    </span>
  )
}