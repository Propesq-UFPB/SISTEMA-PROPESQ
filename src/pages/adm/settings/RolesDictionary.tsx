import React, { useMemo, useState } from "react"
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

type RoleEntry = {
  id: string
  name: string
  category: "ACADEMICO" | "BOLSA" | "EXTERNO" | "GESTAO" | "OUTRO"
  description?: string
  active: boolean
}

function uid(prefix = "role") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

const CATEGORY_LABEL: Record<RoleEntry["category"], string> = {
  ACADEMICO: "Acadêmico",
  BOLSA: "Bolsa",
  EXTERNO: "Externo",
  GESTAO: "Gestão",
  OUTRO: "Outro",
}

export default function RolesDictionary() {
  // ===== Mock inicial (trocar por API depois) =====
  const [roles, setRoles] = useState<RoleEntry[]>([
    {
      id: "r_orientador",
      name: "Orientador",
      category: "ACADEMICO",
      description: "Docente responsável pela orientação do projeto.",
      active: true,
    },
    {
      id: "r_coorientador",
      name: "Coorientador",
      category: "ACADEMICO",
      description: "Apoia a orientação do projeto.",
      active: true,
    },
    {
      id: "r_bolsista",
      name: "Bolsista",
      category: "BOLSA",
      description: "Discente com bolsa vinculada ao projeto.",
      active: true,
    },
    {
      id: "r_voluntario",
      name: "Voluntário",
      category: "BOLSA",
      description: "Discente sem bolsa, com participação voluntária.",
      active: true,
    },
    {
      id: "r_externo",
      name: "Colaborador Externo",
      category: "EXTERNO",
      description: "Participante sem vínculo institucional direto.",
      active: true,
    },
  ])

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

  // ===== Modal helpers =====
  function openCreate() {
    setEditingId(null)
    setName("")
    setCategory("ACADEMICO")
    setDescription("")
    setActive(true)
    setModalOpen(true)
  }

  function openEdit(r: RoleEntry) {
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

  function save() {
    const n = name.trim()

    if (!n || nameError) return

    const payload: RoleEntry = {
      id: editingId ?? uid("role"),
      name: n,
      category,
      description: description.trim() ? description.trim() : undefined,
      active,
    }

    if (editingId) {
      setRoles((prev) => prev.map((r) => (r.id === editingId ? payload : r)))
    } else {
      setRoles((prev) => [payload, ...prev])
    }

    // TODO: chamar API (POST/PUT)
    closeModal()
  }

  function toggleActive(id: string) {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))

    // TODO: API patch active
  }

  function remove(id: string) {
    // Em produção, bloquear exclusão se a função estiver em uso em projetos, inscrições ou certificados.
    setRoles((prev) => prev.filter((r) => r.id !== id))

    // TODO: API delete
  }

  function badgeClass(active: boolean) {
    return active
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-neutral-50 text-neutral border-neutral-light"
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Dicionário de Funções • PROPESQ</title>
      </Helmet>

      <Link
        to="/adm/settings/scholarships"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para bolsas
      </Link>

      {/* ===== Header no mesmo estilo das outras páginas ===== */}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors"
            >
              <Plus size={16} />
              Nova função
            </button>
          </div>
        </div>
      </div>

      {/* ===== Resumo ===== */}
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

      {/* ===== Filtros ===== */}
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
                onChange={(e) => setCategoryFilter(e.target.value as any)}
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
                onChange={(e) => setActiveFilter(e.target.value as any)}
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

      {/* ===== Tabela ===== */}
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
                          r.active
                        )}`}
                      >
                        {r.active ? <Check size={14} /> : <X size={14} />}
                        {r.active ? "Ativa" : "Inativa"}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleActive(r.id)}
                        className="text-xs font-semibold text-primary hover:underline"
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
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 font-semibold"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
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

      {/* ===== Modal Create/Edit ===== */}
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
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={save}
                disabled={!name.trim() || nameError}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !name.trim() || nameError
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-primary hover:opacity-95"
                  }`}
              >
                <Check size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}