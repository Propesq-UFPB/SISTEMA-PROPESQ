// src/publisher/NewsCreate.tsx
import React, { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
} from "lucide-react"

type NewsStatus = "RASCUNHO" | "EM_REVISÃO" | "PUBLICADA"

type FormState = {
  title: string
  slug: string
  description: string
  tag: string
  coverUrl: string
  content: string
  publishAt: string // yyyy-mm-dd (input date)
  status: NewsStatus
}

const TAGS = ["Processo Seletivo", "Comunicado", "Evento", "Edital", "Resultado", "Outros"]

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function todayISODate() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function NewsCreate() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    description: "",
    tag: "Comunicado",
    coverUrl: "",
    content: "",
    publishAt: todayISODate(),
    status: "RASCUNHO",
  })

  const [touchedSlug, setTouchedSlug] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")

  const slugAuto = useMemo(() => slugify(form.title), [form.title])

  // auto-preenche slug enquanto usuário não “mexeu manualmente”
  React.useEffect(() => {
    if (!touchedSlug) {
      setForm((p) => ({ ...p, slug: slugAuto }))
    }
  }, [slugAuto, touchedSlug])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
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

  const fakeSave = async (nextStatus: NewsStatus) => {
    setError("")
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setSaving(true)
    setTimeout(() => {
      // Mock: Por enquanto, só “simula” que salvou e volta pra lista
      setSaving(false)
      navigate("/publisher/news")
    }, 700)
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
        {/* Top bar */}
        <div className="flex flex-col gap-4">
          {/* Botão voltar */}
          <Link
            to="/publisher/news"
            className="
              inline-flex items-center gap-2
              text-sm font-semibold
              text-slate-700 hover:text-slate-900
              w-fit
            "
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>

          {/* Linha título + ações */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Título */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Nova notícia
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Crie um rascunho e publique quando estiver pronto.
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fakeSave("RASCUNHO")}
                disabled={saving}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-slate-300 bg-white
                  text-sm font-semibold text-slate-800
                  hover:bg-slate-50
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <Save size={18} />
                Salvar rascunho
              </button>

              <button
                onClick={() => fakeSave("EM_REVISÃO")}
                disabled={saving}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-blue-900 bg-blue-900
                  text-sm font-semibold text-white
                  hover:bg-blue-800
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <Send size={18} />
                Enviar revisão
              </button>

              <button
                onClick={() => fakeSave("PUBLICADA")}
                disabled={saving}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-emerald-700 bg-emerald-700
                  text-sm font-semibold text-white
                  hover:bg-emerald-600
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <Globe size={18} />
                Publicar
              </button>
            </div>
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
                <FileText
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
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
              <p className="mt-2 text-xs text-slate-500">
                Dica: use um título curto e descritivo.
              </p>
            </div>

            {/* Slug */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-slate-800">
                Slug <span className="text-red-600">*</span>
              </label>
              <div className="mt-2 relative">
                <LinkIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
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
                Gerado automaticamente pelo título (você pode ajustar).
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
              <p className="mt-2 text-xs text-slate-500">
                Aparece no card da landing (AllNews).
              </p>
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
                placeholder="Escreva aqui o corpo da notícia (protótipo: texto simples)…"
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

                <Link
                  to="/publisher/media"
                  className="
                    inline-flex items-center gap-2
                    text-sm font-semibold
                    text-blue-900 hover:underline underline-offset-4
                  "
                  title="Abrir biblioteca de mídia"
                >
                  <ImageIcon size={16} />
                  Biblioteca
                </Link>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-600">
                  URL da imagem
                </label>

                <div className="mt-2 relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
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

                <p className="mt-2 text-xs text-slate-500">
                  No protótipo, usamos apenas URL. Depois adicionamos upload.
                </p>
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
                  <TagIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
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
                <p className="mt-2 text-xs text-slate-500">
                  Você pode gerenciar em <span className="font-semibold">/publisher/tags</span>.
                </p>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold text-slate-800">
                  Data de publicação
                </label>
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
                <p className="mt-2 text-xs text-slate-500">
                  Protótipo: usado só como metadado.
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-bold text-slate-900">Prévia</p>
              <p className="text-sm text-slate-600 mt-2">
                Após salvar, você poderá visualizar exatamente como ficará no portal.
              </p>

              <div className="mt-4">
                <button
                  onClick={() => {
                    // protótipo: exige salvar antes
                    setError("Salve a notícia primeiro para abrir a prévia.")
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="
                    w-full inline-flex items-center justify-center gap-2
                    h-11 rounded-xl
                    border border-slate-300 bg-white
                    text-sm font-semibold text-slate-900
                    hover:bg-slate-50 transition-colors
                  "
                >
                  <FileText size={18} />
                  Abrir prévia (após salvar)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé ajuda */}
        <div className="mt-8 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Protótipo:</span> este formulário ainda não salva em banco.
          Ao integrar o backend, os botões irão criar/atualizar a notícia e manter o status.
        </div>
      </div>
    </div>
  )
}
