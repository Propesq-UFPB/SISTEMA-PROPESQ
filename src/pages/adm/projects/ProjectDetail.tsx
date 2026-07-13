import React, { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Info,
  Pencil,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react"

import { projetos } from "@/mock/data"

/* ================= TIPOS ================= */

type Projeto = {
  id: string | number
  titulo: string
  centro?: string
  unidade?: string
  tipo?: "interno" | "externo"
  status?: string
  prazo?: string
  dataInicio?: string
  dataFim?: string

  pesquisador?: string
  linhaPesquisa?: string
  areaConhecimento?: string
  grandeArea?: string

  objetivos?: string
  palavrasChave?: string[] | string
  agencia?: string
  edital?: string
  categoria?: string
  subcategoria?: string

  protocoloEtica?: string
  comiteEtica?: "Sim" | "Não"
  anexos?: Array<{
    id: string
    nome: string
    tipo: "PDF" | "DOC" | "OUTRO"
    data: string
  }>

  ods?: Array<{ id: number; label: string }>
}

type TabKey =
  | "OVERVIEW"
  | "CADASTRO"
  | "MEMBROS"
  | "DOCUMENTOS"
  | "AVALIACAO"
  | "HISTORICO"

type Member = {
  id: string
  nome: string
  papel: "Coordenador" | "Discente" | "Colaborador"
}

type DocItem = {
  id: string
  nome: string
  tipo: string
  data: string
  status?: string
}

type Decision = {
  id: string
  tipo: "Automática" | "Manual"
  resultado: string
  data: string
  por?: string
  obs?: string
}

type Audit = {
  id: string
  acao: string
  por: string
  quando: string
  detalhes?: string
}

/* ================= UTIL ================= */

const PAGE_SECTION = "admProjects"
const PAGE_NAME = "ProjectDetail"

const statusClass = (status?: string) => {
  const s = (status || "").toLowerCase()
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("pend") || s.includes("anál") || s.includes("analise")) {
    return "bg-amber-100 text-amber-800"
  }
  if (s.includes("reprov") || s.includes("indefer")) {
    return "bg-red-100 text-red-800"
  }
  return "bg-neutral-light text-neutral"
}

const safe = (v?: unknown) =>
  v === undefined || v === null || v === "" ? "—" : String(v)

const truncate = (txt?: string, n = 140) => {
  const t = (txt || "").trim()
  if (!t) return "—"
  return t.length > n ? `${t.slice(0, n)}…` : t
}

function formatPeriod(p: Projeto) {
  const ini = (p.dataInicio || "").slice(0, 10)
  const fim = (p.dataFim || p.prazo || "").slice(0, 10)
  if (!ini && !fim) return "—"
  return `${ini || "—"} → ${fim || "—"}`
}

function asArrayKeywords(v?: string[] | string) {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  return v
    .split(/[;,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

/* ================= UI ================= */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
      {children}
    </span>
  )
}

function Section({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-light px-6 py-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold text-primary">{title}</h2>
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
        {k}
      </span>
      <div className="text-sm text-neutral">{v}</div>
    </div>
  )
}

function Tabs({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (t: TabKey) => void
}) {
  const items: Array<{ k: TabKey; label: string; icon: React.ReactNode }> = [
    { k: "OVERVIEW", label: "Visão Geral", icon: <Info size={16} /> },
    { k: "CADASTRO", label: "Cadastro", icon: <BookOpen size={16} /> },
    { k: "MEMBROS", label: "Membros", icon: <Users size={16} /> },
    { k: "DOCUMENTOS", label: "Documentos", icon: <FolderOpen size={16} /> },
    { k: "AVALIACAO", label: "Avaliação", icon: <GraduationCap size={16} /> },
    { k: "HISTORICO", label: "Histórico", icon: <History size={16} /> },
  ]

  const tabClass = (isOn: boolean) =>
    [
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
      isOn
        ? "bg-primary text-white shadow-sm"
        : "border border-neutral-light bg-white text-primary hover:bg-neutral-light/50",
    ].join(" ")

  return (
    <div className="rounded-2xl border border-neutral-light bg-white p-2 shadow-card">
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it.k}
            type="button"
            onClick={() => onChange(it.k)}
            className={tabClass(active === it.k)}
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ================= MOCKS LOCAIS ADM ================= */

function buildMockMembers(p: Projeto): Member[] {
  const base: Member[] = []
  base.push({ id: "m1", nome: p.pesquisador || "—", papel: "Coordenador" })
  base.push({ id: "m2", nome: "Discente 01", papel: "Discente" })
  base.push({ id: "m3", nome: "Discente 02", papel: "Discente" })
  base.push({ id: "m4", nome: "Colaborador Externo", papel: "Colaborador" })
  return base
}

function buildMockDocs(p: Projeto): DocItem[] {
  return [
    {
      id: "d1",
      nome: "Protocolo de Ética",
      tipo: "PDF",
      data: "2025-01-12",
      status: p.protocoloEtica ? "Informado" : "Pendente",
    },
    {
      id: "d2",
      nome: "Relatório Anual (2024)",
      tipo: "PDF",
      data: "2025-02-20",
      status: "Recebido",
    },
    {
      id: "d3",
      nome: "Declaração (Participação)",
      tipo: "PDF",
      data: "2025-02-28",
      status: "Emitida",
    },
  ]
}

function buildMockDecisions(): Decision[] {
  return [
    {
      id: "a1",
      tipo: "Automática",
      resultado: "Distribuído para avaliação automática",
      data: "2025-01-03",
      por: "Sistema",
      obs: "Classificação automática registrada.",
    },
    {
      id: "a2",
      tipo: "Manual",
      resultado: "Aprovado",
      data: "2025-01-22",
      por: "Comissão",
      obs: "Parecer favorável.",
    },
  ]
}

function buildMockAudit(p: Projeto): Audit[] {
  return [
    {
      id: "h1",
      acao: "Cadastro submetido",
      por: p.pesquisador || "Usuário",
      quando: "2025-01-01 10:22",
      detalhes: "Projeto criado e submetido.",
    },
    {
      id: "h2",
      acao: "Status alterado",
      por: "Administrador",
      quando: "2025-01-05 14:10",
      detalhes: `Status definido como: ${p.status || "—"}`,
    },
    {
      id: "h3",
      acao: "Documento anexado",
      por: "Administrador",
      quando: "2025-01-12 09:03",
      detalhes: "Protocolo de Ética anexado.",
    },
  ]
}

/* ================= PÁGINA ================= */

export default function ProjectDetail() {
  const { id } = useParams()
  const nav = useNavigate()

  const project = useMemo(() => {
    const list = projetos as Projeto[]
    return list.find((p) => String(p.id) === String(id))
  }, [id])

  const [tab, setTab] = useState<TabKey>("OVERVIEW")

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>Projeto não encontrado • Administração • PROPESQ</title>
        </Helmet>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <button
            onClick={() => nav("/adm/projetos")}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </button>

          <div className="mt-8 rounded-2xl border border-neutral-light bg-white p-10 text-center shadow-card">
            <p className="text-base text-neutral">Projeto não encontrado.</p>
            <p className="mt-1 text-sm text-neutral/70">
              Verifique a rota ou o identificador informado.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const members = useMemo(() => buildMockMembers(project), [project])
  const docs = useMemo(() => buildMockDocs(project), [project])
  const decisions = useMemo(() => buildMockDecisions(), [])
  const audit = useMemo(() => buildMockAudit(project), [project])

  const odsList = project.ods || [
    { id: 4, label: "Educação de Qualidade" },
    { id: 9, label: "Indústria, Inovação e Infraestrutura" },
  ]

  return (
    <div
      className="min-h-screen bg-neutral-light"
      data-section={PAGE_SECTION}
      data-page={PAGE_NAME}
    >
      <Helmet>
        <title>{safe(project.titulo)} • Detalhes do Projeto • ADM • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* topo */}
        <div className="flex flex-col gap-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral/60">
            Administração / Projetos / Detalhes
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => nav("/adm/projetos")}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>

                <Pill>#{String(project.id)}</Pill>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(project.status)}`}
                >
                  {project.status || "—"}
                </span>

                <span className="text-xs text-neutral/60">
                  {project.tipo ? `Tipo: ${project.tipo}` : "Tipo: —"}
                </span>
              </div>

              <h1 className="mt-3 truncate text-xl font-bold text-primary">
                {safe(project.titulo)}
              </h1>

              <p className="mt-1 text-sm text-neutral">
                Coordenação:{" "}
                <span className="font-semibold text-primary">
                  {safe(project.pesquisador)}
                </span>
                <span className="mx-2 text-neutral/40">•</span>
                Período:{" "}
                <span className="font-semibold">{formatPeriod(project)}</span>
              </p>
            </div>

            {/* ação principal única */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Link
                to={`/adm/projetos/${project.id}/visualizar-editar`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                <Pencil size={16} />
                Visualizar / editar
              </Link>
            </div>
          </div>

          <Tabs active={tab} onChange={setTab} />
        </div>

        {/* ================== ABA: VISÃO GERAL ================== */}
        {tab === "OVERVIEW" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Section
              title="Dados principais"
              icon={<Info size={18} className="text-primary" />}
              right={
                <span className="text-xs text-neutral/70">
                  Centro:{" "}
                  <span className="font-semibold text-neutral">
                    {safe(project.centro)}
                  </span>
                </span>
              }
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <KV
                  k="Código"
                  v={<span className="font-semibold">{safe(project.id)}</span>}
                />
                <KV k="Tipo" v={<span className="capitalize">{safe(project.tipo)}</span>} />
                <KV
                  k="Situação"
                  v={
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(project.status)}`}
                    >
                      {safe(project.status)}
                    </span>
                  }
                />
                <KV k="Unidade" v={safe(project.unidade)} />
                <KV k="Linha de pesquisa" v={safe(project.linhaPesquisa)} />
                <KV
                  k="Área / Grande área"
                  v={`${safe(project.areaConhecimento)}${
                    project.grandeArea ? ` • ${project.grandeArea}` : ""
                  }`}
                />
                <KV k="Período" v={formatPeriod(project)} />
                <KV k="Edital" v={safe(project.edital)} />
              </div>
            </Section>

            <Section
              title="ODS vinculados"
              icon={<BadgeCheck size={18} className="text-primary" />}
            >
              {odsList.length === 0 ? (
                <p className="text-sm text-neutral">—</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {odsList.map((o) => (
                    <span
                      key={o.id}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-neutral-light bg-white text-[11px]">
                        {o.id}
                      </span>
                      {o.label}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs text-neutral/70">
                Nesta versão administrativa, os ODS ainda estão mockados. Depois
                podem ser vinculados diretamente ao cadastro do projeto.
              </p>
            </Section>

            <Section
              title="Resumo"
              icon={<BookOpen size={18} className="text-primary" />}
            >
              <p className="text-sm leading-relaxed text-neutral">
                {truncate(project.objetivos, 380)}
              </p>
            </Section>
          </div>
        )}

        {/* ================== ABA: CADASTRO ================== */}
        {tab === "CADASTRO" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Section
              title="Cadastro do projeto"
              icon={<BookOpen size={18} className="text-primary" />}
              right={
                <Link
                  to={`/adm/projetos/${project.id}/visualizar-editar`}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <Pencil size={16} />
                  Visualizar / editar
                </Link>
              }
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <KV k="Título" v={safe(project.titulo)} />
                <KV k="Coordenador" v={safe(project.pesquisador)} />
                <KV k="Centro" v={safe(project.centro)} />
                <KV k="Unidade" v={safe(project.unidade)} />
                <KV k="Área" v={safe(project.areaConhecimento)} />
                <KV k="Linha de pesquisa" v={safe(project.linhaPesquisa)} />
                <KV k="Agência" v={safe(project.agencia)} />
                <KV k="Edital" v={safe(project.edital)} />
                <KV k="Categoria" v={safe(project.categoria)} />
                <KV k="Período" v={formatPeriod(project)} />
              </div>

              <div className="mt-6">
                <KV
                  k="Objetivos"
                  v={
                    <p className="text-sm leading-relaxed">
                      {truncate(project.objetivos, 900)}
                    </p>
                  }
                />
              </div>

              <div className="mt-6">
                <KV
                  k="Palavras-chave"
                  v={
                    <div className="flex flex-wrap gap-2">
                      {asArrayKeywords(project.palavrasChave).length === 0 ? (
                        <span className="text-sm">—</span>
                      ) : (
                        asArrayKeywords(project.palavrasChave).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral"
                          >
                            {kw}
                          </span>
                        ))
                      )}
                    </div>
                  }
                />
              </div>
            </Section>

            <Section
              title="Regras e conformidade"
              icon={<ShieldCheck size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <KV k="Comitê de Ética" v={safe(project.comiteEtica)} />
                <KV k="Protocolo" v={safe(project.protocoloEtica)} />
              </div>

              <p className="mt-5 text-xs text-neutral/70">
                Aqui entram validações administrativas, consistência cadastral,
                campos obrigatórios e travas de edição por status do projeto.
              </p>
            </Section>
          </div>
        )}

        {/* ================== ABA: MEMBROS ================== */}
        {tab === "MEMBROS" && (
          <div className="grid grid-cols-1 gap-6">
            <Section
              title="Membros do projeto"
              icon={<Users size={18} className="text-primary" />}
              right={
                <Link
                  to={`/adm/projetos/${project.id}/membros`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <Users size={16} />
                  Gerenciar membros
                </Link>
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-neutral-light p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-primary">
                          {m.nome}
                        </p>
                        <p className="text-xs text-neutral/70">{m.papel}</p>
                      </div>
                      <span className="rounded-full bg-neutral-light px-2.5 py-1 text-[11px] font-bold text-neutral">
                        {m.papel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-neutral/70">
                Nesta visualização administrativa, a aba exibe os membros atuais.
                Alterações devem ser feitas no módulo dedicado de gerenciamento.
              </p>
            </Section>
          </div>
        )}

        {/* ================== ABA: DOCUMENTOS ================== */}
        {tab === "DOCUMENTOS" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Section
              title="Documentos do projeto"
              icon={<FolderOpen size={18} className="text-primary" />}
              right={
                <Link
                  to={`/adm/projetos/${project.id}/documentos`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <Upload size={16} />
                  Gerenciar uploads
                </Link>
              }
            >
              <div className="space-y-3">
                {docs.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-light p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-primary">
                        {d.nome}
                      </p>
                      <p className="text-xs text-neutral/70">
                        {d.tipo} • {d.data}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        d.status === "Pendente"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {d.status || "—"}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-neutral/70">
                Esta aba exibe o estado atual dos documentos. O fluxo de upload,
                remoção e validação fica em rota dedicada.
              </p>
            </Section>

            <Section
              title="Conformidade e certificação"
              icon={<ShieldCheck size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <KV k="Comitê de Ética" v={safe(project.comiteEtica)} />
                <KV k="Protocolo" v={safe(project.protocoloEtica)} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/adm/monitoring/report-validation"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <FileText size={16} />
                  Relatórios
                </Link>

                <Link
                  to="/adm/monitoring/monitoring-certification"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <FileText size={16} />
                  Emitir declaração
                </Link>
              </div>
            </Section>
          </div>
        )}

        {/* ================== ABA: AVALIAÇÃO ================== */}
        {tab === "AVALIACAO" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Section
              title="Avaliações administrativas"
              icon={<GraduationCap size={18} className="text-primary" />}
              right={
                <Link
                  to={`/adm/projetos/${project.id}/avaliacoes`}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <GraduationCap size={16} />
                  Abrir módulo
                </Link>
              }
            >
              <div className="space-y-3">
                {decisions.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-2xl border border-neutral-light p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {d.resultado}
                        </p>
                        <p className="text-xs text-neutral/70">
                          {d.tipo} • {d.data} {d.por ? `• por ${d.por}` : ""}
                        </p>
                      </div>

                      <span className="rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                        {d.tipo}
                      </span>
                    </div>

                    {d.obs && (
                      <p className="mt-2 text-sm text-neutral">
                        {truncate(d.obs, 220)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Parecer e decisões"
              icon={<BadgeCheck size={18} className="text-primary" />}
            >
              <KV
                k="Parecer (resumo)"
                v={
                  <p className="text-sm leading-relaxed text-neutral">
                    {truncate(
                      "Parecer favorável com recomendações de ajustes pontuais na metodologia e no cronograma.",
                      320
                    )}
                  </p>
                }
              />

              <div className="mt-5">
                <Link
                  to={`/adm/projetos/${project.id}/parecer`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <FileText size={16} />
                  Ver parecer completo
                </Link>
              </div>

              <p className="mt-4 text-xs text-neutral/70">
                O parecer completo e o histórico detalhado de decisões ficam em
                rotas próprias para não sobrecarregar a tela.
              </p>
            </Section>
          </div>
        )}

        {/* ================== ABA: HISTÓRICO ================== */}
        {tab === "HISTORICO" && (
          <div className="grid grid-cols-1 gap-6">
            <Section
              title="Histórico administrativo"
              icon={<History size={18} className="text-primary" />}
            >
              <div className="space-y-3">
                {audit.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-2xl border border-neutral-light p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {h.acao}
                        </p>
                        <p className="text-xs text-neutral/70">
                          {h.por} • {h.quando}
                        </p>
                      </div>

                      <span className="rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                        Audit
                      </span>
                    </div>

                    {h.detalhes && (
                      <p className="mt-2 text-sm text-neutral">
                        {truncate(h.detalhes, 220)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}