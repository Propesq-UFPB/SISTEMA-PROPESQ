import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Info,
  ShieldCheck,
  Settings,
} from "lucide-react"

type Audience =
  | "DOCENTE"
  | "TECNICO_ADMINISTRATIVO"
  | "POS_DOUTORANDO"
  | "DISCENTE_UFPB_MEDIO"
  | "DISCENTE_UFPB_SUPERIOR"
  | "DISCENTE_EXTERNO_SEM_SIGAA"

type UserType = {
  id: string
  name: string
  description?: string
  audiences: Audience[]
  active: boolean
}

const AUDIENCE_LABEL: Record<Audience, string> = {
  DOCENTE: "Docentes",
  TECNICO_ADMINISTRATIVO: "Técnicos Administrativos",
  POS_DOUTORANDO: "Pós-doutorandos",
  DISCENTE_UFPB_MEDIO: "Discentes UFPB (Ensino Médio)",
  DISCENTE_UFPB_SUPERIOR: "Discentes UFPB (Ensino Superior)",
  DISCENTE_EXTERNO_SEM_SIGAA: "Discentes de outras instituições (sem SIGAA)",
}

function uid(prefix = "ut") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export default function UserTypes() {
  const [userTypes, setUserTypes] = useState<UserType[]>([
    {
      id: "ut_coord",
      name: "Coordenador de Projeto",
      description: "Pode criar/gerenciar projetos e submeter propostas em editais.",
      audiences: ["DOCENTE", "TECNICO_ADMINISTRATIVO", "POS_DOUTORANDO"],
      active: true,
    },
    {
      id: "ut_discente",
      name: "Discente",
      description: "Participação em projetos como bolsista/voluntário.",
      audiences: ["DISCENTE_UFPB_MEDIO", "DISCENTE_UFPB_SUPERIOR", "DISCENTE_EXTERNO_SEM_SIGAA"],
      active: true,
    },
    {
      id: "ut_gestor",
      name: "Gestor",
      description: "Gestão de editais, relatórios e acompanhamento institucional.",
      audiences: ["TECNICO_ADMINISTRATIVO", "DOCENTE"],
      active: true,
    },
  ])

  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "INACTIVE" | "ALL">("ACTIVE")

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [active, setActive] = useState(true)

  const q = normalize(query)

  const filtered = useMemo(() => {
    return userTypes
      .filter((t) => {
        if (statusFilter === "ACTIVE" && !t.active) return false
        if (statusFilter === "INACTIVE" && t.active) return false

        if (!q) return true

        const audText = t.audiences.map((a) => AUDIENCE_LABEL[a]).join(" ")

        return (
          normalize(t.name).includes(q) ||
          normalize(t.description ?? "").includes(q) ||
          normalize(audText).includes(q)
        )
      })
      .sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1

        return a.name.localeCompare(b.name, "pt-BR")
      })
  }, [userTypes, q, statusFilter])

  const stats = useMemo(() => {
    const total = userTypes.length
    const activeCount = userTypes.filter((t) => t.active).length

    return {
      total,
      activeCount,
      inactiveCount: total - activeCount,
    }
  }, [userTypes])

  const nameError =
    name.trim().length > 0 &&
    userTypes.some((t) => normalize(t.name) === normalize(name) && t.id !== editingId)

  const audienceGroups: { title: string; items: Audience[] }[] = [
    {
      title: "Coordenador / Gestor",
      items: ["DOCENTE", "TECNICO_ADMINISTRATIVO", "POS_DOUTORANDO"],
    },
    {
      title: "Discentes",
      items: ["DISCENTE_UFPB_MEDIO", "DISCENTE_UFPB_SUPERIOR", "DISCENTE_EXTERNO_SEM_SIGAA"],
    },
  ]

  function openCreate() {
    setEditingId(null)
    setName("")
    setDescription("")
    setAudiences([])
    setActive(true)
    setModalOpen(true)
  }

  function openEdit(t: UserType) {
    setEditingId(t.id)
    setName(t.name)
    setDescription(t.description ?? "")
    setAudiences(t.audiences)
    setActive(t.active)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setName("")
    setDescription("")
    setAudiences([])
    setActive(true)
  }

  function toggleAudience(a: Audience) {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  function save() {
    const n = name.trim()

    if (!n || nameError) return
    if (audiences.length === 0) return

    const payload: UserType = {
      id: editingId ?? uid("ut"),
      name: n,
      description: description.trim() ? description.trim() : undefined,
      audiences,
      active,
    }

    if (editingId) {
      setUserTypes((prev) => prev.map((t) => (t.id === editingId ? payload : t)))
    } else {
      setUserTypes((prev) => [payload, ...prev])
    }

    closeModal()
  }

  function toggleActiveRow(id: string) {
    setUserTypes((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)))
  }

  function remove(id: string) {
    setUserTypes((prev) => prev.filter((t) => t.id !== id))
  }

  function pill(active: boolean) {
    return active ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-50 text-neutral border-neutral-light"
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Tipos de Usuários • PROPESQ</title>
      </Helmet>

      <Link
        to="/adm/settings/scholarships"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para bolsas
      </Link>

      {/* ===== Header no mesmo estilo do CallSchedule ===== */}
      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <Users size={14} />
              Configurações
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Tipos de Usuários</h1>

              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Configure perfis de acesso e defina quais públicos podem se enquadrar em cada tipo
                dentro dos fluxos da PROPESQ.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
              <Settings size={16} />
              {stats.total} tipos
            </span>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors"
            >
              <Plus size={16} />
              Novo tipo
            </button>
          </div>
        </div>
      </div>

      {/* ===== Resumo ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <h2 className="text-sm font-semibold text-primary">Perfis cadastrados</h2>
            </div>

            <p className="text-sm text-neutral">Ex.: Coordenador de Projeto, Discente, Gestor.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Total</p>
            <p className="text-lg font-bold text-primary">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Ativos</p>
            <p className="text-lg font-bold text-primary">{stats.activeCount}</p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Inativos</p>
            <p className="text-lg font-bold text-primary">{stats.inactiveCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />

          <p className="text-xs text-neutral">
            Sugestão: desative perfis em uso ao invés de excluir, para preservar histórico.
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
                placeholder="Ex.: discente, gestor..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap justify-end">
            <div>
              <label className="text-xs text-neutral">Status</label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="mt-1 rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ACTIVE">Ativos</option>
                <option value="INACTIVE">Inativos</option>
                <option value="ALL">Todos</option>
              </select>
            </div>

            <div className="text-xs text-neutral md:text-right pb-2">
              {filtered.length} de {userTypes.length}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Tabela ===== */}
      <section className="rounded-xl border border-neutral-light bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-light flex items-center gap-2">
          <ShieldCheck size={18} />

          <h3 className="text-sm font-semibold text-primary">Lista de tipos</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Tipo</th>
              <th className="text-left font-semibold px-5 py-3">Públicos permitidos</th>
              <th className="text-left font-semibold px-5 py-3 w-[200px]">Status</th>
              <th className="text-right font-semibold px-5 py-3 w-[260px]">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-neutral">
                  Nenhum tipo encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="border-t border-neutral-light">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-neutral mt-1">{t.description ?? "—"}</p>
                  </td>

                  <td className="px-5 py-3 text-neutral">
                    <div className="flex flex-wrap gap-2">
                      {t.audiences.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral"
                        >
                          {AUDIENCE_LABEL[a]}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${pill(
                          t.active
                        )}`}
                      >
                        {t.active ? <Check size={14} /> : <X size={14} />}
                        {t.active ? "Ativo" : "Inativo"}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleActiveRow(t.id)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {t.active ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 font-semibold"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(t.id)}
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

      {/* ===== Modal ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-neutral-light shadow-lg">
            <div className="flex items-start justify-between gap-3 p-4 border-b border-neutral-light">
              <div>
                <h3 className="text-sm font-bold text-primary">{editingId ? "Editar tipo" : "Novo tipo"}</h3>

                <p className="text-xs text-neutral mt-1">Selecione os públicos permitidos. Mínimo: 1.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral">Nome</label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex.: Coordenador de Projeto"
                    className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />

                  {nameError && <p className="text-xs text-red-600">Já existe um tipo com esse nome.</p>}
                </div>

                <div className="space-y-1">
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
                      Ativo
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
                      Inativo
                    </button>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-neutral">Descrição opcional</label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Ex.: Pode submeter projetos e gerenciar equipe."
                    className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-neutral">Públicos permitidos</label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {audienceGroups.map((g) => (
                      <div key={g.title} className="rounded-xl border border-neutral-light p-3">
                        <p className="text-xs font-semibold text-primary mb-2">{g.title}</p>

                        <div className="space-y-2">
                          {g.items.map((a) => {
                            const checked = audiences.includes(a)

                            return (
                              <label
                                key={a}
                                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer
                                  ${
                                    checked
                                      ? "border-primary/30 bg-primary/10"
                                      : "border-neutral-light hover:bg-neutral-50"
                                  }`}
                              >
                                <span className="text-neutral">{AUDIENCE_LABEL[a]}</span>

                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleAudience(a)}
                                  className="accent-primary"
                                />
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {audiences.length === 0 && <p className="text-xs text-red-600">Selecione pelo menos um público.</p>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-light flex items-center justify-end gap-2">
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
                disabled={!name.trim() || nameError || audiences.length === 0}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !name.trim() || nameError || audiences.length === 0
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