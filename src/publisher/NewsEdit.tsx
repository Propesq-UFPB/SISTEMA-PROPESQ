// src/publisher/NewsEdit.tsx
import React, { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag as TagIcon,
  FileText,
  CalendarClock,
  Save,
  Send,
  Globe,
  Archive,
  Undo2,
  Eye,
} from "lucide-react"

type NewsStatus = "RASCUNHO" | "EM_REVISÃO" | "PUBLICADA" | "ARQUIVADA"

type NewsItem = {
  id: string
  title: string
  description?: string
  tag: string
  status: NewsStatus
  createdAt: string // ISO
  updatedAt?: string // ISO
  publishAt?: string // ISO
  author?: string
  coverUrl?: string
  content?: string
  slug: string
}

type FormState = {
  title: string
  slug: string
  description: string
  tag: string
  coverUrl: string
  content: string
  publishAt: string // yyyy-mm-dd
  status: NewsStatus
}

const TAGS = ["Processo Seletivo", "Comunicado", "Evento", "Edital", "Resultado", "Outros"]

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "PET Ciência da Computação abre seleção para novos estudantes bolsistas e voluntários",
    description:
      "Inscrições ocorrem de 3 a 12 de fevereiro de 2026; processo seletivo oferece 7 vagas no total.",
    tag: "Processo Seletivo",
    status: "PUBLICADA",
    createdAt: "2026-01-27T10:30:00.000Z",
    updatedAt: "2026-01-28T12:12:00.000Z",
    publishAt: "2026-01-27T12:00:00.000Z",
    author: "Equipe PROPESQ",
    slug: "pet-ciencia-da-computacao-abre-selecao-para-novos-estudantes",
    coverUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    content:
      "Conteúdo exemplo.\n\nAqui você vai colocar o corpo completo da notícia.\n\n- Item 1\n- Item 2",
  },
  {
    id: "n2",
    title: "LAVID abre seleções para pesquisadores e estudantes bolsistas no projeto VLibras",
    description:
      "Oportunidades para atuação em pesquisa e desenvolvimento com foco em acessibilidade e Libras.",
    tag: "Processo Seletivo",
    status: "EM_REVISÃO",
    createdAt: "2026-01-15T14:00:00.000Z",
    updatedAt: "2026-01-16T09:45:00.000Z",
    author: "Comunicação",
    slug: "lavid-abre-selecoes-para-pesquisadores-e-estudantes-vlibras",
    content:
      "Texto em revisão.\n\nAdicione informações do edital, requisitos e prazos.",
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
    content:
      "Rascunho inicial.\n\nInclua datas, links e contato.",
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
    content:
      "Conteúdo arquivado.\n\nMotivo: substituído por publicação final.",
  },
]

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function toISODateOnly(iso?: string) {
  if (!iso) return ""
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function formatDateTimeBR(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  return `${dd}/${mm}/${yy} ${hh}:${mi}`
}

export default function NewsEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [touchedSlug, setTouchedSlug] = useState(false)
  const [dirty, setDirty] = useState(false)

  const [original, setOriginal] = useState<NewsItem | null>(null)
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    description: "",
    tag: "Comunicado",
    coverUrl: "",
    content: "",
    publishAt: "",
    status: "RASCUNHO",
  })

  useEffect(() => {
    // mock load
    const found = MOCK_NEWS.find((n) => n.id === id)
    if (!found) {
      setNotFound(true)
      return
    }

    setOriginal(found)
    setForm({
      title: found.title ?? "",
      slug: found.slug ?? "",
      description: found.description ?? "",
      tag: found.tag ?? "Comunicado",
      coverUrl: found.coverUrl ?? "",
      content: found.content ?? "",
      publishAt: toISODateOnly(found.publishAt) || toISODateOnly(found.createdAt),
      status: found.status,
    })
  }, [id])

  // auto-slug se usuário não mexeu manualmente
  const slugAuto = useMemo(() => slugify(form.title), [form.title])
  useEffect(() => {
    if (!touchedSlug) {
      setForm((p) => ({ ...p, slug: slugAuto }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugAuto])

  // warning ao fechar/atualizar página com alterações
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setDirty(true)
    setForm((p) => ({ ...p, [key]: value }))
  }

  const validate = () => {
    if (!form.title.trim()) return "Título é obrigatório."
    if (!form.slug.trim()) return "Slug é obrigatório."
    if (!form.tag.trim()) return "Tag/Categoria é obrigatória."
    if (!form.description.trim()) return "Resumo/descrição é obrigatório."
    if (!form.content.trim()) return "Conteúdo é obrigatório."
    return ""
  }

  const fakeSave = async (nextStatus?: NewsStatus) => {
    setError("")
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setSaving(true)
    setTimeout(() => {
      // Mock update
      setSaving(false)
      setDirty(false)

      // Atualiza "original" local só pra refletir na UI
      setOriginal((prev) => {
        if (!prev) return prev
        const now = new Date().toISOString()
        return {
          ...prev,
          title: form.title,
          slug: form.slug,
          description: form.description,
          tag: form.tag,
          coverUrl: form.coverUrl,
          content: form.content,
          publishAt: form.publishAt ? new Date(form.publishAt).toISOString() : prev.publishAt,
          status: nextStatus ?? form.status,
          updatedAt: now,
        }
      })

      if (nextStatus) setForm((p) => ({ ...p, status: nextStatus }))
    }, 700)
  }

  const archiveToggle = () => {
    if (!original) return
    const next: NewsStatus = original.status === "ARQUIVADA" ? "RASCUNHO" : "ARQUIVADA"
    fakeSave(next)
  }

  const handleBack = () => {
    if (!dirty) return navigate("/publisher/news")
    const ok = window.confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")
    if (ok) navigate("/publisher/news")
  }

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">
        <h1 className="text-2xl font-bold text-slate-900">Notícia não encontrada</h1>
        <p className="text-sm text-slate-600 mt-2">
          Não localizamos o item solicitado (ID: <span className="font-semibold">{id}</span>).
        </p>
        <div className="mt-6">
          <Link
            to="/publisher/news"
            className="
              inline-flex items-center gap-2
              h-11 px-4 rounded-xl
              bg-blue-900 text-white text-sm font-semibold
              hover:bg-blue-800 transition-colors
            "
          >
            <ArrowLeft size={18} />
            Voltar para lista
          </Link>
        </div>
      </div>
    )
  }

  if (!original) return null

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
      {/* Top bar */}
      <div className="flex flex-col gap-4">
        {/* Botão voltar (acima) */}
        <button
          onClick={handleBack}
          className="
            inline-flex items-center gap-2
            text-sm font-semibold
            text-slate-700 hover:text-slate-900
            w-fit
          "
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        {/* Linha título + ações */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 truncate">
              Editar notícia
            </h1>
            <p className="text-sm text-slate-600 mt-1 truncate">
              {original.title}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap md:justify-end">
            <Link
              to={`/publisher/news/${original.id}/preview`}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-xl
                border border-slate-300 bg-white
                text-sm font-semibold text-slate-900
                hover:bg-slate-50 transition-colors
              "
              title="Abrir prévia"
            >
              <Eye size={18} />
              Prévia
            </Link>

            <button
              onClick={() => fakeSave()}
              disabled={saving}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-xl
                border border-slate-300 bg-white
                text-sm font-semibold text-slate-800
                hover:bg-slate-50
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              title="Salvar alterações"
            >
              <Save size={18} />
              Salvar
            </button>

            <button
              onClick={() => fakeSave("EM_REVISÃO")}
              disabled={saving || form.status === "ARQUIVADA"}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-xl
                border border-blue-900 bg-blue-900
                text-sm font-semibold text-white
                hover:bg-blue-800
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Enviar para revisão"
            >
              <Send size={18} />
              Enviar revisão
            </button>

            <button
              onClick={() => fakeSave("PUBLICADA")}
              disabled={saving || form.status === "ARQUIVADA"}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-xl
                border border-emerald-700 bg-emerald-700
                text-sm font-semibold text-white
                hover:bg-emerald-600
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Publicar agora"
            >
              <Globe size={18} />
              Publicar
            </button>

            <button
              onClick={archiveToggle}
              disabled={saving}
              className={`
                inline-flex items-center gap-2
                h-11 px-4 rounded-xl
                border
                text-sm font-semibold
                transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
                ${
                  original.status === "ARQUIVADA"
                    ? "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                    : "border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100"
                }
              `}
              title={original.status === "ARQUIVADA" ? "Restaurar para rascunho" : "Arquivar"}
            >
              {original.status === "ARQUIVADA" ? <Undo2 size={18} /> : <Archive size={18} />}
              {original.status === "ARQUIVADA" ? "Restaurar" : "Arquivar"}
            </button>
          </div>
        </div>
      </div>

        {/* Status + timestamps */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Status</p>
            <p className="text-base font-bold text-slate-900 mt-1">
              {form.status === "EM_REVISÃO" ? "EM REVISÃO" : form.status}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Criada em</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{formatDateTimeBR(original.createdAt)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Última atualização</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{formatDateTimeBR(original.updatedAt)}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
          {/* Main form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Título <span className="text-red-600">*</span>
              </label>
              <div className="mt-2 relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Digite o título da notícia…"
                  className="
                    w-full h-11 pl-10 pr-3
                    rounded-xl border border-slate-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                />
              </div>
            </div>

            {/* Slug */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-slate-800">
                Slug <span className="text-red-600">*</span>
              </label>
              <div className="mt-2 relative">
                <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setTouchedSlug(true)
                    setField("slug", slugify(e.target.value))
                  }}
                  placeholder="ex: propesq-divulga-orientacoes"
                  className="
                    w-full h-11 pl-10 pr-3
                    rounded-xl border border-slate-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                O slug define a URL pública: <span className="font-semibold">/news/{form.slug || "..."}</span>
              </p>
            </div>

            {/* Resumo */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-slate-800">
                Resumo/descrição <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="Resumo curto para o card de notícia…"
                className="
                  mt-2 w-full px-3 py-2.5
                  rounded-xl border border-slate-300
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              />
            </div>

            {/* Conteúdo */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-slate-800">
                Conteúdo <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                rows={12}
                placeholder="Escreva aqui o corpo da notícia…"
                className="
                  mt-2 w-full px-3 py-2.5
                  rounded-xl border border-slate-300
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              />
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Capa */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Imagem de capa</p>

              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-600">URL da imagem</label>

                <div className="mt-2 relative">
                  <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.coverUrl}
                    onChange={(e) => setField("coverUrl", e.target.value)}
                    placeholder="https://…"
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  {form.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.coverUrl}
                      alt="Prévia da capa"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-sm text-slate-500">
                      Sem imagem selecionada
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tag + publicação */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-bold text-slate-900">Metadados</p>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-800">
                  Tag/Categoria <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 relative">
                  <TagIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.tag}
                    onChange={(e) => setField("tag", e.target.value)}
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300
                      text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  >
                    {TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold text-slate-800">Data de publicação</label>
                <div className="mt-2 relative">
                  <CalendarClock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    value={form.publishAt}
                    onChange={(e) => setField("publishAt", e.target.value)}
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-600">Autor</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{original.author ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé ajuda */}
        <div className="mt-8 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Protótipo:</span> os dados aqui são mockados no componente.
          Ao integrar o backend, vamos buscar por ID e persistir as alterações.
        </div>
      </div>
    </div>
  )
}
