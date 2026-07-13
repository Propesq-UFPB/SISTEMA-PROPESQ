import React, { useState } from "react"
import { Helmet } from "react-helmet"
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
} from "lucide-react"

type ProjectStatus =
  | "ATIVO"
  | "EM_ACOMPANHAMENTO"
  | "ENCERRADO"
  | "PENDENTE_HOMOLOGACAO"

type BondStatus =
  | "VINCULADO"
  | "AGUARDANDO_INICIO"
  | "PENDENTE_DOCUMENTACAO"
  | "FINALIZADO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

const AREA_OPTIONS = [
  "Ciência de Dados",
  "Engenharia de Software",
  "Inteligência Artificial",
  "Sistemas de Informação",
]

const ORIENTADOR_OPTIONS = [
  "Prof. André Silva",
  "Profa. Helena Costa",
  "Prof. Marcos Oliveira",
  "Prof. Ricardo Lima",
]

const UNIDADE_OPTIONS = [
  "CCEN",
  "Centro de Informática",
  "Centro de Tecnologia",
  "Centro de Ciências Humanas, Letras e Artes",
]

const EDITAL_OPTIONS = [
  "PIBIC 2026",
  "PIBITI 2026",
  "PROBEX 2025",
]

export default function ConsultProject() {
  const [advancedOpen, setAdvancedOpen] = useState(true)

  const [q, setQ] = useState("")

  const [titulo, setTitulo] = useState("")
  const [area, setArea] = useState("")
  const [orientador, setOrientador] = useState("")
  const [unidade, setUnidade] = useState("")
  const [edital, setEdital] = useState("")
  const [statusProjeto, setStatusProjeto] = useState<ProjectStatus>("ATIVO")
  const [statusVinculo, setStatusVinculo] = useState<BondStatus>("VINCULADO")
  const [participacao, setParticipacao] = useState<ParticipationType>("BOLSISTA")
  const [pendencia, setPendencia] = useState<"com_pendencia" | "sem_pendencia">(
    "com_pendencia"
  )

  const [useTitulo, setUseTitulo] = useState(false)
  const [useArea, setUseArea] = useState(false)
  const [useOrientador, setUseOrientador] = useState(false)
  const [useUnidade, setUseUnidade] = useState(false)
  const [useEdital, setUseEdital] = useState(false)
  const [useStatusProjeto, setUseStatusProjeto] = useState(false)
  const [useStatusVinculo, setUseStatusVinculo] = useState(false)
  const [useParticipacao, setUseParticipacao] = useState(false)
  const [usePendencia, setUsePendencia] = useState(false)

  const [periodoIni, setPeriodoIni] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")

  const clearAll = () => {
    setQ("")
    setTitulo("")
    setArea("")
    setOrientador("")
    setUnidade("")
    setEdital("")
    setStatusProjeto("ATIVO")
    setStatusVinculo("VINCULADO")
    setParticipacao("BOLSISTA")
    setPendencia("com_pendencia")

    setUseTitulo(false)
    setUseArea(false)
    setUseOrientador(false)
    setUseUnidade(false)
    setUseEdital(false)
    setUseStatusProjeto(false)
    setUseStatusVinculo(false)
    setUseParticipacao(false)
    setUsePendencia(false)

    setPeriodoIni("")
    setPeriodoFim("")
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Consultar Projetos • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-5 space-y-5">

      <header className="rounded-2xl border border-neutral/20 bg-white px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">
            Consultar Projetos
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
            Utilize os filtros abaixo para buscar projetos cadastrados no sistema.
          </p>
      </header>

        <section className="w-full rounded-2xl border border-neutral/20 bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-neutral/20 p-4 md:flex-row md:items-center md:gap-4 md:p-5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
              />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título, orientador, área, unidade ou edital…"
                className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] leading-5 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 px-3 py-2 text-[13px] font-semibold text-primary transition hover:bg-neutral-light/50"
              >
                <SlidersHorizontal size={15} />
                Busca avançada
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 px-3 py-2 text-[13px] font-semibold text-neutral transition hover:bg-neutral-light/50"
              >
                <X size={15} />
                Limpar
              </button>
            </div>
          </div>

          {advancedOpen && (
            <div className="space-y-4 p-4 md:p-5">
              <div className="text-xs text-neutral/70">
                Marque a caixa à esquerda para{" "}
                <span className="font-semibold">ativar</span> cada filtro.
              </div>

              <div className="grid gap-3">
                <Row
                  checked={useTitulo}
                  onCheck={setUseTitulo}
                  label="Título:"
                  field={
                    <input
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título do projeto…"
                    />
                  }
                />

                <Row
                  checked={useArea}
                  onCheck={setUseArea}
                  label="Área:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {AREA_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useOrientador}
                  onCheck={setUseOrientador}
                  label="Orientador(a):"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={orientador}
                      onChange={(e) => setOrientador(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {ORIENTADOR_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useUnidade}
                  onCheck={setUseUnidade}
                  label="Centro/Unidade:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {UNIDADE_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useEdital}
                  onCheck={setUseEdital}
                  label="Edital:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={edital}
                      onChange={(e) => setEdital(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {EDITAL_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useStatusProjeto}
                  onCheck={setUseStatusProjeto}
                  label="Situação do Projeto:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={statusProjeto}
                      onChange={(e) =>
                        setStatusProjeto(e.target.value as ProjectStatus)
                      }
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="EM_ACOMPANHAMENTO">
                        Em acompanhamento
                      </option>
                      <option value="PENDENTE_HOMOLOGACAO">
                        Pendente de homologação
                      </option>
                      <option value="ENCERRADO">Encerrado</option>
                    </select>
                  }
                />

                <Row
                  checked={useStatusVinculo}
                  onCheck={setUseStatusVinculo}
                  label="Status do vínculo:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={statusVinculo}
                      onChange={(e) =>
                        setStatusVinculo(e.target.value as BondStatus)
                      }
                    >
                      <option value="VINCULADO">Vinculado</option>
                      <option value="AGUARDANDO_INICIO">
                        Aguardando início
                      </option>
                      <option value="PENDENTE_DOCUMENTACAO">
                        Pendente de documentação
                      </option>
                      <option value="FINALIZADO">Finalizado</option>
                    </select>
                  }
                />

                <Row
                  checked={useParticipacao}
                  onCheck={setUseParticipacao}
                  label="Participação:"
                  field={
                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-neutral/20 bg-white px-3 py-2">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="participacao"
                          checked={participacao === "BOLSISTA"}
                          onChange={() => setParticipacao("BOLSISTA")}
                        />
                        Bolsista
                      </label>

                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="participacao"
                          checked={participacao === "VOLUNTARIO"}
                          onChange={() => setParticipacao("VOLUNTARIO")}
                        />
                        Voluntário
                      </label>
                    </div>
                  }
                />

                <Row
                  checked={usePendencia}
                  onCheck={setUsePendencia}
                  label="Pendência:"
                  field={
                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-neutral/20 bg-white px-3 py-2">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="pendencia"
                          checked={pendencia === "com_pendencia"}
                          onChange={() => setPendencia("com_pendencia")}
                        />
                        Com pendência
                      </label>

                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="pendencia"
                          checked={pendencia === "sem_pendencia"}
                          onChange={() => setPendencia("sem_pendencia")}
                        />
                        Sem pendência
                      </label>
                    </div>
                  }
                />

                <div className="border-t border-neutral/20 pt-2" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período inicial
                    </label>

                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />

                      <input
                        type="date"
                        value={periodoIni}
                        onChange={(e) => setPeriodoIni(e.target.value)}
                        className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período final
                    </label>

                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />

                      <input
                        type="date"
                        value={periodoFim}
                        onChange={(e) => setPeriodoFim(e.target.value)}
                        className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-neutral/20 pt-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Consultar projetos
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Row(props: {
  checked: boolean
  onCheck: (value: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[18px_220px_minmax(0,1fr)]">
      <div className="pt-2">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onCheck(e.target.checked)}
        />
      </div>

      <div className="pt-2 text-[13px] leading-4 text-primary">
        {props.label}
      </div>

      <div className="min-w-0">{props.field}</div>
    </div>
  )
}