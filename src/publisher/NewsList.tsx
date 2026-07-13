// src/publisher/NewsList.tsx
import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Copy,
  Archive,
  Globe,
  Clock,
} from "lucide-react"

type NewsStatus = "RASCUNHO" | "EM_REVISÃO" | "PUBLICADA" | "ARQUIVADA"

type NewsItem = {
  id: string
  title: string
  description?: string
  tag: string
  status: NewsStatus
  createdAt: string // ISO
  publishAt?: string // ISO
  author?: string
  cover?: string
  slug: string
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "PET Ciência da Computação abre seleção para novos estudantes bolsistas e voluntários",
    description:
      "Inscrições ocorrem de 3 a 12 de fevereiro de 2026; processo seletivo oferece 7 vagas no total.",
    tag: "Processo Seletivo",
    status: "PUBLICADA",
    createdAt: "2026-01-27T10:30:00.000Z",
    publishAt: "2026-01-27T12:00:00.000Z",
    author: "Equipe PROPESQ",
    slug: "pet-ciencia-da-computacao-abre-selecao-para-novos-estudantes",
  },
  {
    id: "n2",
    title: "LAVID abre seleções para pesquisadores e estudantes bolsistas no projeto VLibras",
    description:
      "Oportunidades para atuação em pesquisa e desenvolvimento com foco em acessibilidade e Libras.",
    tag: "Processo Seletivo",
    status: "EM_REVISÃO",
    createdAt: "2026-01-15T14:00:00.000Z",
    author: "Comunicação",
    slug: "lavid-abre-selecoes-para-pesquisadores-e-estudantes-vlibras",
  },
  {
    id: "n3",
    title: "PROPESQ divulga orientações para submissão de relatórios de IC 2025",
    description:
      "Confira o passo a passo e prazos para envio dos relatórios parciais e finais.",
    tag: "Comunicado",
    status: "RASCUNHO",
    createdAt: "2026-02-05T09:10:00.000Z",
    author: "Secretaria",
    slug: "propesq-divulga-orientacoes-para-submissao-de-relatorios-ic-2025",
  },
  {
    id: "n4",
    title: "Resultado preliminar: bolsas de iniciação científica 2026",
    description:
      "Lista preliminar disponível para consulta; período de recursos aberto conforme edital.",
    tag: "Resultado",
    status: "ARQUIVADA",
    createdAt: "2025-12-18T11:25:00.000Z",
    publishAt: "2025-12-19T12:00:00.000Z",
    author: "Coordenação",
    slug: "resultado-preliminar-bolsas-iniciacao-cientifica-2026",
  },
]

function formatDateBR(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

function statusPill(status: NewsStatus) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
  switch (status) {
    case "PUBLICADA":
      return `${base} bg-emerald-50 text-emerald-800 border-emerald-200`
    case "EM_REVISÃO":
      return `${base} bg-amber-50 text-amber-900 border-amber-200`
    case "RASCUNHO":
      return `${base} bg-slate-50 text-slate-700 border-slate-200`
    case "ARQUIVADA":
      return `${base} bg-rose-50 text-rose-800 border-rose-200`
    default:
      return `${base} bg-slate-50 text-slate-700 border-slate-200`
  }
}

export default function NewsList() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<NewsStatus | "TODOS">("TODOS")
  const [tag, setTag] = useState<string>("TODAS")
  const [items, setItems] = useState<NewsItem[]>(MOCK_NEWS)

  const tags = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.tag))).sort()
    return ["TODAS", ...unique]
  }, [items])

  const counts = useMemo(() => {
    const total = items.length
    const draft = items.filter((i) => i.status === "RASCUNHO").length
    const review = items.filter((i) => i.status === "EM_REVISÃO").length
    const pub = items.filter((i) => i.status === "PUBLICADA").length
    const arch = items.filter((i) => i.status === "ARQUIVADA").length
    return { total, draft, review, pub, arch }
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((i) => {
        if (status !== "TODOS" && i.status !== status) return false
        if (tag !== "TODAS" && i.tag !== tag) return false
        if (!q) return true
        const hay = `${i.title} ${i.description ?? ""} ${i.tag} ${i.author ?? ""}`.toLowerCase()
        return hay.includes(q)
      })
      .sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [items, query, status, tag])

  const duplicate = (id: string) => {
    const original = items.find((i) => i.id === id)
    if (!original) return
    const now = new Date().toISOString()
    const copyItem: NewsItem = {
      ...original,
      id: `copy-${Math.random().toString(16).slice(2)}`,
      title: `${original.title} (cópia)`,
      status: "RASCUNHO",
      createdAt: now,
      publishAt: undefined,
      slug: `${original.slug}-copia`,
    }
    setItems((prev) => [copyItem, ...prev])
  }

  const toggleArchive = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const next: NewsStatus = i.status === "ARQUIVADA" ? "RASCUNHO" : "ARQUIVADA"
        return { ...i, status: next }
      })
    )
  }

  return (
    <div className="w-full">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notícias</h1>
            <p className="text-sm text-slate-600 mt-1">
              Gerencie rascunhos, revisões e publicações do portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/publisher/news/new"
              className="
                inline-flex items-center gap-2
                h-11 px-4
                rounded-md
                bg-blue-900 text-white
                text-sm font-semibold
                border border-blue-900
                hover:bg-blue-800
                transition-colors
              "
            >
              <Plus size={18} />
              Nova notícia
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Total</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Filter size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.total}</p>
            <p className="text-xs text-slate-500 mt-1">Todos os registros</p>
          </div>

          {/* Rascunhos */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Rascunhos</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Clock size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.draft}</p>
            <p className="text-xs text-slate-500 mt-1">Ainda não enviados</p>
          </div>

          {/* Em revisão */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-amber-900/80">Em revisão</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                <Search size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-950 mt-2">{counts.review}</p>
            <p className="text-xs text-amber-900/60 mt-1">Aguardando validação</p>
          </div>

          {/* Publicadas */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-900/80">Publicadas</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                <Globe size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-950 mt-2">{counts.pub}</p>
            <p className="text-xs text-emerald-900/60 mt-1">No ar no portal</p>
          </div>

          {/* Arquivadas */}
          <div className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-rose-900/80">Arquivadas</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-900 border border-rose-200">
                <Archive size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-rose-950 mt-2">{counts.arch}</p>
            <p className="text-xs text-rose-900/60 mt-1">Fora de exibição</p>
          </div>
        </div>


        {/* Filters */}
        <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título, tag ou autor…"
                  className="
                    w-full h-11 pl-10 pr-3
                    rounded-xl border border-slate-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 text-slate-600">
                <Filter size={16} />
                <span className="text-xs font-semibold">Filtros</span>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="
                  h-11 px-3
                  rounded-xl border border-slate-300
                  text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              >
                <option value="TODOS">Todos</option>
                <option value="RASCUNHO">Rascunho</option>
                <option value="EM_REVISÃO">Em revisão</option>
                <option value="PUBLICADA">Publicada</option>
                <option value="ARQUIVADA">Arquivada</option>
              </select>

              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="
                  h-11 px-3
                  rounded-xl border border-slate-300
                  text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              >
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[44%]">
                    Título
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[14%]">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[14%]">
                    Tag
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[14%]">
                    Datas
                  </th>
                  <th className="text-right text-xs font-bold text-slate-600 px-5 py-3 w-[14%]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800">
                          Nenhuma notícia encontrada
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Ajuste os filtros ou crie uma nova notícia.
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/publisher/news/new"
                            className="
                              inline-flex items-center gap-2
                              h-10 px-4 rounded-lg
                              bg-blue-900 text-white
                              text-sm font-semibold
                              hover:bg-blue-800 transition-colors
                            "
                          >
                            <Plus size={18} />
                            Nova notícia
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((n) => (
                    <tr key={n.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 leading-snug">
                              {n.title}
                            </p>
                            {n.description && (
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {n.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              {n.author && <span>Por {n.author}</span>}
                              <span className="inline-flex items-center gap-1">
                                <Clock size={14} />
                                Criada em {formatDateBR(n.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className={statusPill(n.status)}>
                          {n.status === "EM_REVISÃO" ? "EM REVISÃO" : n.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className="text-sm font-semibold text-slate-900">{n.tag}</span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="text-sm text-slate-700">
                          {n.publishAt ? (
                            <div className="inline-flex items-center gap-2">
                              <Globe size={16} className="text-emerald-700" />
                              <span>Pub.: {formatDateBR(n.publishAt)}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/publisher/news/${n.id}/preview`}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-slate-50
                              transition-colors
                            "
                            title="Prévia"
                            aria-label="Prévia"
                          >
                            <Eye size={16} className="text-slate-800" />
                          </Link>

                          <Link
                            to={`/publisher/news/${n.id}/edit`}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-slate-50
                              transition-colors
                            "
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Pencil size={16} className="text-slate-800" />
                          </Link>

                          <button
                            onClick={() => duplicate(n.id)}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-slate-50
                              transition-colors
                            "
                            title="Duplicar"
                            aria-label="Duplicar"
                          >
                            <Copy size={16} className="text-slate-800" />
                          </button>

                          <button
                            onClick={() => toggleArchive(n.id)}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-slate-50
                              transition-colors
                            "
                            title={n.status === "ARQUIVADA" ? "Restaurar (voltar para rascunho)" : "Arquivar"}
                            aria-label="Arquivar"
                          >
                            <Archive size={16} className="text-slate-800" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-slate-200 bg-white text-xs text-slate-500">
            Exibindo <span className="font-semibold text-slate-700">{filtered.length}</span> de{" "}
            <span className="font-semibold text-slate-700">{items.length}</span> notícias
          </div>
        </div>
      </div>
    </div>
  )
}
