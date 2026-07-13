// src/publisher/CategoriesTags.tsx
import React, { useMemo, useState } from "react"
import { Plus, Search, Tag, Trash2, Pencil, X, Check, Hash } from "lucide-react"

type TagItem = {
  id: string
  name: string
  slug: string
  type: "TAG" | "CATEGORIA"
  color?: string // futuro
  createdAt: string // ISO
  active: boolean
}

const INITIAL: TagItem[] = [
  {
    id: "c1",
    name: "Processo Seletivo",
    slug: "processo-seletivo",
    type: "CATEGORIA",
    createdAt: "2026-01-10T10:00:00.000Z",
    active: true,
  },
  {
    id: "c2",
    name: "Comunicado",
    slug: "comunicado",
    type: "CATEGORIA",
    createdAt: "2026-01-10T10:05:00.000Z",
    active: true,
  },
  {
    id: "c3",
    name: "Resultado",
    slug: "resultado",
    type: "CATEGORIA",
    createdAt: "2026-01-10T10:10:00.000Z",
    active: true,
  },
  {
    id: "t1",
    name: "Edital",
    slug: "edital",
    type: "TAG",
    createdAt: "2026-01-12T13:00:00.000Z",
    active: true,
  },
  {
    id: "t2",
    name: "Evento",
    slug: "evento",
    type: "TAG",
    createdAt: "2026-01-12T13:10:00.000Z",
    active: true,
  },
  {
    id: "t3",
    name: "Bolsas",
    slug: "bolsas",
    type: "TAG",
    createdAt: "2026-01-12T13:20:00.000Z",
    active: false,
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

function formatDateBR(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

type EditState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; item?: TagItem }

export default function CategoriesTags() {
  const [items, setItems] = useState<TagItem[]>(INITIAL)
  const [q, setQ] = useState("")
  const [type, setType] = useState<"TODOS" | "TAG" | "CATEGORIA">("TODOS")
  const [onlyActive, setOnlyActive] = useState(false)

  const [edit, setEdit] = useState<EditState>({ open: false })
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [kind, setKind] = useState<"TAG" | "CATEGORIA">("CATEGORIA")
  const [active, setActive] = useState(true)
  const [error, setError] = useState("")

  const counts = useMemo(() => {
    const total = items.length
    const tags = items.filter((i) => i.type === "TAG").length
    const cats = items.filter((i) => i.type === "CATEGORIA").length
    const inact = items.filter((i) => !i.active).length
    return { total, tags, cats, inact }
  }, [items])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return items
      .filter((i) => {
        if (type !== "TODOS" && i.type !== type) return false
        if (onlyActive && !i.active) return false
        if (!query) return true
        const hay = `${i.name} ${i.slug} ${i.type}`.toLowerCase()
        return hay.includes(query)
      })
      .sort((a, b) => {
        // categorias primeiro, depois tags
        if (a.type !== b.type) return a.type === "CATEGORIA" ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  }, [items, q, type, onlyActive])

  const openCreate = (preset?: "TAG" | "CATEGORIA") => {
    setError("")
    setEdit({ open: true, mode: "create" })
    setName("")
    setSlug("")
    setKind(preset ?? "CATEGORIA")
    setActive(true)
  }

  const openEdit = (it: TagItem) => {
    setError("")
    setEdit({ open: true, mode: "edit", item: it })
    setName(it.name)
    setSlug(it.slug)
    setKind(it.type)
    setActive(it.active)
  }

  const closeModal = () => {
    setEdit({ open: false })
    setError("")
  }

  const validate = (mode: "create" | "edit", currentId?: string) => {
    if (!name.trim()) return "Nome é obrigatório."
    const s = slugify(slug || name)
    if (!s) return "Slug inválido."
    const clash = items.find((i) => i.slug === s && i.id !== currentId)
    if (clash) return `Já existe um item com esse slug: "${clash.name}".`
    return ""
  }

  const submit = () => {
    if (!edit.open) return
    const currentId = edit.mode === "edit" ? edit.item?.id : undefined

    const msg = validate(edit.mode, currentId)
    if (msg) {
      setError(msg)
      return
    }

    const computedSlug = slugify(slug || name)
    const now = new Date().toISOString()

    if (edit.mode === "create") {
      const newItem: TagItem = {
        id: `tg-${Math.random().toString(16).slice(2)}`,
        name: name.trim(),
        slug: computedSlug,
        type: kind,
        createdAt: now,
        active,
      }
      setItems((prev) => [newItem, ...prev])
      closeModal()
      return
    }

    // edit
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== edit.item?.id) return i
        return {
          ...i,
          name: name.trim(),
          slug: computedSlug,
          type: kind,
          active,
        }
      })
    )
    closeModal()
  }

  const remove = (it: TagItem) => {
    const ok = window.confirm(`Remover "${it.name}"?`)
    if (!ok) return
    setItems((prev) => prev.filter((x) => x.id !== it.id))
  }

  const pill = (it: TagItem) => {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
    if (it.type === "CATEGORIA") return `${base} bg-blue-50 text-blue-900 border-blue-200`
    return `${base} bg-slate-50 text-slate-800 border-slate-200`
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categorias & Tags</h1>
            <p className="text-sm text-slate-600 mt-1">
              Padronize os rótulos usados nas notícias do portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCreate("CATEGORIA")}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-lg
                border border-slate-300 bg-white
                text-sm font-semibold text-slate-900
                hover:bg-slate-50 transition-colors
              "
              title="Nova categoria"
            >
              <Plus size={18} />
              Nova categoria
            </button>

            <button
              onClick={() => openCreate("TAG")}
              className="
                inline-flex items-center gap-2
                h-11 px-4 rounded-lg
                border border-blue-900 bg-blue-900
                text-sm font-semibold text-white
                hover:bg-blue-800 transition-colors
              "
              title="Nova tag"
            >
              <Plus size={18} />
              Nova tag
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Total</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Search size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.total}</p>
            <p className="text-xs text-slate-500 mt-1">Itens cadastrados</p>
          </div>

          {/* Categorias */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-900/80">Categorias</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
                <Hash size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-950 mt-2">{counts.cats}</p>
            <p className="text-xs text-blue-900/60 mt-1">Rótulos principais</p>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Tags</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Tag size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.tags}</p>
            <p className="text-xs text-slate-500 mt-1">Marcadores auxiliares</p>
          </div>

          {/* Inativas */}
          <div className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-rose-900/80">Inativas</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-900 border border-rose-200">
                <X size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-rose-950 mt-2">{counts.inact}</p>
            <p className="text-xs text-rose-900/60 mt-1">Ocultas nos filtros</p>
          </div>
        </div>


        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nome ou slug…"
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
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="
                  h-11 px-3
                  rounded-xl border border-slate-300
                  text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              >
                <option value="TODOS">Todos</option>
                <option value="CATEGORIA">Categorias</option>
                <option value="TAG">Tags</option>
              </select>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Apenas ativos
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[34%]">
                    Nome
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[18%]">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[26%]">
                    Slug
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[12%]">
                    Status
                  </th>
                  <th className="text-right text-xs font-bold text-slate-600 px-5 py-3 w-[10%]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800">Nada por aqui</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Ajuste filtros ou crie uma nova categoria/tag.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <button
                            onClick={() => openCreate("CATEGORIA")}
                            className="
                              inline-flex items-center gap-2
                              h-10 px-4 rounded-xl
                              border border-slate-300 bg-white
                              text-sm font-semibold text-slate-900
                              hover:bg-slate-50 transition-colors
                            "
                          >
                            <Plus size={18} />
                            Nova categoria
                          </button>
                          <button
                            onClick={() => openCreate("TAG")}
                            className="
                              inline-flex items-center gap-2
                              h-10 px-4 rounded-xl
                              border border-blue-900 bg-blue-900
                              text-sm font-semibold text-white
                              hover:bg-blue-800 transition-colors
                            "
                          >
                            <Plus size={18} />
                            Nova tag
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((it) => (
                    <tr key={it.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white">
                            {it.type === "CATEGORIA" ? (
                              <Hash size={16} className="text-blue-900" />
                            ) : (
                              <Tag size={16} className="text-slate-700" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{it.name}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Criado em {formatDateBR(it.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={pill(it)}>
                          {it.type === "CATEGORIA" ? "CATEGORIA" : "TAG"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <code className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                          {it.slug}
                        </code>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            it.active
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {it.active ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(it)}
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
                          </button>

                          <button
                            onClick={() => remove(it)}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-rose-50
                              transition-colors
                            "
                            title="Remover"
                            aria-label="Remover"
                          >
                            <Trash2 size={16} className="text-rose-700" />
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
            <span className="font-semibold text-slate-700">{items.length}</span> itens
          </div>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {edit.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={closeModal}
            aria-label="Fechar modal"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {edit.mode === "create" ? "Novo item" : "Editar item"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {edit.mode === "create"
                    ? "Crie uma categoria ou tag para padronizar o portal."
                    : "Atualize nome, slug e status."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
                aria-label="Fechar"
              >
                <X size={18} className="text-slate-900" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">Tipo</label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as any)}
                  className="
                    mt-2 w-full h-11 px-3
                    rounded-xl border border-slate-300 bg-white
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                >
                  <option value="CATEGORIA">Categoria</option>
                  <option value="TAG">Tag</option>
                </select>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">Nome</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!slug.trim()) setSlug(slugify(e.target.value))
                  }}
                  placeholder="Ex: Processo Seletivo"
                  className="
                    mt-2 w-full h-11 px-3
                    rounded-xl border border-slate-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="ex: processo-seletivo"
                  className="
                    mt-2 w-full h-11 px-3
                    rounded-xl border border-slate-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                  "
                />
                <p className="mt-2 text-xs text-slate-500">
                  Usado em URLs e filtros. Deixe curto e sem acentos.
                </p>
              </div>

              {/* Ativo */}
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Ativo
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={closeModal}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-slate-300 bg-white
                  text-sm font-semibold text-slate-900
                  hover:bg-slate-50 transition-colors
                "
              >
                <X size={18} />
                Cancelar
              </button>

              <button
                onClick={submit}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-blue-900 bg-blue-900
                  text-sm font-semibold text-white
                  hover:bg-blue-800 transition-colors
                "
              >
                <Check size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
