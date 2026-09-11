import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  BookUser,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  ShieldCheck,
  Info,
  Settings,
} from "lucide-react"
import { ApiError } from "@/services/apiClient"
import {
  projectRoleService,
  type ProjectRole,
  type ProjectRoleCategory,
} from "@/features/settings/api/projectRoleService"

type RoleEntry = {
  id: string
  name: string
  category: ProjectRoleCategory
  description?: string
  active: boolean
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function mapApiToRole(row: ProjectRole): RoleEntry {
  return {
    id: String(row.id),
    name: row.nome,
    category: row.categoria,

    description: row.descricao ?? undefined,
    active: row.ativo,
  }
}

const CATEGORY_LABEL: Record<RoleEntry["category"], string> = {
  ACADEMICO: "Acadêmico",
  BOLSA: "Bolsa",
  EXTERNO: "Externo",
  GESTAO: "Gestão",
  OUTRO: "Outro",
}

function badgeClass(active: boolean) {
  return active
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-neutral-50 text-neutral border-neutral-light"
}

export default function RolesDictionary({basePath = "/gestor"}: {basePath?: string}) {
  const [roles, setRoles] = useState<RoleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // ===== UI state =====
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<RoleEntry["category"] | "ALL">("ALL")
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ACTIVE")

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [category, setCategory] = useState<RoleEntry["category"]>("ACADEMICO")
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const response = await projectRoleService.list(200, 0)
      setRoles(response.results.map(mapApiToRole))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Não foi possível carregar as funções."
      setLoadError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const q = normalize(query)

  const filtered = useMemo(() => {
    return roles
      .filter((r) => {
        if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false
        if (activeFilter === "ACTIVE" && !r.active) return false
        if (activeFilter === "INACTIVE" && r.active) return false

        if (!q) return true

        return (
          normalize(r.name).includes(q) ||
          normalize(CATEGORY_LABEL[r.category]).includes(q) ||
          normalize(r.description ?? "").includes(q)
        )
      })
      .sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1
        if (a.category !== b.category) return a.category.localeCompare(b.category)

        return a.name.localeCompare(b.name, "pt-BR")
      })
  }, [roles, q, categoryFilter, activeFilter])

  const stats = useMemo(() => {
    const total = roles.length
    const activeCount = roles.filter((r) => r.active).length
    const inactiveCount = total - activeCount

    return {
      total,
      activeCount,
      inactiveCount,
    }
  }, [roles])

  function openCreate() {
    setActionError(null)
    setEditingId(null)
    setName("")
    setCategory("ACADEMICO")
    setDescription("")
    setActive(true)
    setModalOpen(true)
  }

  function openEdit(r: RoleEntry) {
    setActionError(null)
    setEditingId(r.id)
    setName(r.name)
    setCategory(r.category)
    setDescription(r.description ?? "")
    setActive(r.active)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setName("")
    setDescription("")
    setCategory("ACADEMICO")
    setActive(true)
  }

  const nameError =
    name.trim().length > 0 &&
    roles.some((r) => normalize(r.name) === normalize(name) && r.id !== editingId)

  async function save() {
    const n = name.trim()

    if (!n || nameError || saving) return

    setSaving(true)
    setActionError(null)

    try {
      const payload = {
        nome: n,
        categoria: category,
        descricao: description.trim() ? description.trim() : undefined,
        ativo: active,
      }

      if (editingId) {
        const updated = await projectRoleService.update(Number(editingId), payload)
        setRoles((prev) => prev.map((r) => (r.id === editingId ? mapApiToRole(updated) : r)))
      } else {
        const created = await projectRoleService.create(payload)
        setRoles((prev) => [mapApiToRole(created), ...prev])
      }

      closeModal()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Não foi possível salvar a função."
      setActionError(message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string) {
    const current = roles.find((r) => r.id === id)
    if (!current || saving) return

    setSaving(true)
    setActionError(null)

    try {
      const updated = await projectRoleService.update(Number(id), {
        ativo: !current.active,
      })
      setRoles((prev) => prev.map((r) => (r.id === id ? mapApiToRole(updated) : r)))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Não foi possível atualizar o status."
      setActionError(message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (saving) return

    setSaving(true)
    setActionError(null)

    try {
      await projectRoleService.remove(Number(id))
      setRoles((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Não foi possível excluir a função."
      setActionError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Dicionário de Funções • PROPESQ</title>
      </Helmet>

      <Link
        to={`${basePath}/settings/scholarships`}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para bolsas
      </Link>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <BookUser size={14} />
              Configurações
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Dicionário de Funções</h1>

              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Defina as funções usadas na composição de equipes, vínculos de bolsa, certificados,
                relatórios e permissões dentro dos projetos.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
              <Settings size={16} />
              {stats.total} funções
            </span>

            <button
              type="button"
              onClick={openCreate}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              Nova função
            </button>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-neutral-light bg-white px-5 py-6 text-sm text-neutral">
          Carregando funções...
        </div>
      )}

      {!loading && (
        <>
          <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookUser size={18} />
                  <h2 className="text-sm font-semibold text-primary">Funções cadastradas</h2>
                </div>

                <p className="text-sm text-neutral">
                  As funções impactam permissões, certificados, relatórios e composição de equipes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                <p className="text-xs text-neutral">Total</p>
                <p className="text-lg font-bold text-primary">{stats.total}</p>
              </div>

              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                <p className="text-xs text-neutral">Ativas</p>
                <p className="text-lg font-bold text-primary">{stats.activeCount}</p>
              </div>

              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                <p className="text-xs text-neutral">Inativas</p>
                <p className="text-lg font-bold text-primary">{stats.inactiveCount}</p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
              <Info size={16} className="mt-0.5 text-neutral" />

              <p className="text-xs text-neutral">
                Dica: em vez de excluir funções usadas em registros antigos, prefira{" "}
                <span className="font-semibold">desativar</span> para preservar histórico.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
              <div className="w-full md:max-w-md">
                <label className="text-xs text-neutral">Buscar</label>

                <div className="relative mt-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex.: orientador, bolsa, externo..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-end gap-3 flex-wrap justify-end">
                <div>
                  <label className="text-xs text-neutral">Categoria</label>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value as RoleEntry["category"] | "ALL")
                    }
                    className="mt-1 rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ALL">Todas</option>
                    <option value="ACADEMICO">Acadêmico</option>
                    <option value="BOLSA">Bolsa</option>
                    <option value="EXTERNO">Externo</option>
                    <option value="GESTAO">Gestão</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral">Status</label>

                  <select
                    value={activeFilter}
                    onChange={(e) =>
                      setActiveFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
                    }
                    className="mt-1 rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ACTIVE">Ativas</option>
                    <option value="INACTIVE">Inativas</option>
                    <option value="ALL">Todas</option>
                  </select>
                </div>

                <div className="text-xs text-neutral md:text-right pb-2">
                  {filtered.length} de {roles.length}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-light bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-light flex items-center gap-2">
              <ShieldCheck size={18} />
              <h3 className="text-sm font-semibold text-primary">Lista de funções</h3>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Função</th>
                  <th className="text-left font-semibold px-5 py-3">Categoria</th>
                  <th className="text-left font-semibold px-5 py-3">Descrição</th>
                  <th className="text-left font-semibold px-5 py-3 w-[200px]">Status</th>
                  <th className="text-right font-semibold px-5 py-3 w-[260px]">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-neutral">
                      Nenhuma função encontrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-t border-neutral-light">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-primary">{r.name}</p>
                      </td>

                      <td className="px-5 py-3 text-neutral">{CATEGORY_LABEL[r.category]}</td>

                      <td className="px-5 py-3 text-neutral">
                        {r.description ? r.description : <span className="text-neutral/60">—</span>}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${badgeClass(
                              r.active,
                            )}`}
                          >
                            {r.active ? <Check size={14} /> : <X size={14} />}
                            {r.active ? "Ativa" : "Inativa"}
                          </span>

                          <button
                            type="button"
                            onClick={() => void toggleActive(r.id)}
                            disabled={saving}
                            className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                          >
                            {r.active ? "Desativar" : "Ativar"}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 font-semibold disabled:opacity-50"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => void remove(r.id)}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">
                  {editingId ? "Editar função" : "Nova função"}
                </h3>

                <p className="text-xs text-neutral mt-1">
                  Defina como essa função aparece ao montar equipes e gerar documentos.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            {actionError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {actionError}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral">Nome da função</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Orientador"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />

                {nameError && <p className="text-xs text-red-600">Já existe uma função com esse nome.</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral">Categoria</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RoleEntry["category"])}
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ACADEMICO">Acadêmico</option>
                  <option value="BOLSA">Bolsa</option>
                  <option value="EXTERNO">Externo</option>
                  <option value="GESTAO">Gestão</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-neutral">Descrição opcional</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ex.: Docente responsável pela orientação do projeto."
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral">Status</label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold
                      ${
                        active
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-neutral-light text-neutral hover:bg-neutral-50"
                      }`}
                  >
                    Ativa
                  </button>

                  <button
                    type="button"
                    onClick={() => setActive(false)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold
                      ${
                        !active
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-neutral-light text-neutral hover:bg-neutral-50"
                      }`}
                  >
                    Inativa
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-xs text-neutral">Pré-visualização</label>

                <div className="rounded-xl border border-neutral-light p-3">
                  <p className="text-sm font-semibold text-primary">{name.trim() || "Nome da função"}</p>
                  <p className="text-xs text-neutral mt-1">{CATEGORY_LABEL[category]}</p>

                  {description.trim() ? (
                    <p className="text-xs text-neutral mt-2">{description.trim()}</p>
                  ) : (
                    <p className="text-xs text-neutral/60 mt-2">Sem descrição</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => void save()}
                disabled={!name.trim() || nameError || saving}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !name.trim() || nameError || saving
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-primary hover:opacity-95"
                  }`}
              >
                <Check size={16} />
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
