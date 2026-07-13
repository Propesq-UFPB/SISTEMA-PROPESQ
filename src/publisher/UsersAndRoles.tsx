// src/publisher/UsersAndRoles.tsx
import React, { useMemo, useState } from "react"
import {
  Plus,
  Search,
  ShieldCheck,
  User,
  Mail,
  Pencil,
  Trash2,
  X,
  Check,
  UserX,
} from "lucide-react"

type Role = "PUBLICADOR" | "EDITOR" | "ADMINISTRADOR"

type UserItem = {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string // ISO
  lastLoginAt?: string // ISO
}

const INITIAL: UserItem[] = [
  {
    id: "u1",
    name: "Equipe PROPESQ",
    email: "publicador@propesq.br",
    role: "PUBLICADOR",
    active: true,
    createdAt: "2026-01-10T10:00:00.000Z",
    lastLoginAt: "2026-02-15T14:12:00.000Z",
  },
  {
    id: "u2",
    name: "Comunicação",
    email: "editor@propesq.br",
    role: "EDITOR",
    active: true,
    createdAt: "2026-01-10T10:10:00.000Z",
    lastLoginAt: "2026-02-14T18:40:00.000Z",
  },
  {
    id: "u3",
    name: "Admin Portal",
    email: "admin@propesq.br",
    role: "ADMINISTRADOR",
    active: true,
    createdAt: "2026-01-01T09:00:00.000Z",
    lastLoginAt: "2026-02-15T12:05:00.000Z",
  },
  {
    id: "u4",
    name: "Usuário Inativo",
    email: "inativo@propesq.br",
    role: "PUBLICADOR",
    active: false,
    createdAt: "2026-01-20T14:30:00.000Z",
  },
]

function formatDateBR(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

function roleBadge(role: Role) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
  if (role === "ADMINISTRADOR") return `${base} bg-slate-900 text-white border-slate-900`
  if (role === "EDITOR") return `${base} bg-blue-50 text-blue-900 border-blue-200`
  return `${base} bg-slate-50 text-slate-800 border-slate-200`
}

type ModalState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; item?: UserItem }

export default function UsersAndRoles() {
  const [items, setItems] = useState<UserItem[]>(INITIAL)

  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "TODOS">("TODOS")
  const [onlyActive, setOnlyActive] = useState(false)

  const [modal, setModal] = useState<ModalState>({ open: false })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("PUBLICADOR")
  const [active, setActive] = useState(true)
  const [error, setError] = useState("")

  const counts = useMemo(() => {
    const total = items.length
    const activeCount = items.filter((u) => u.active).length
    const pub = items.filter((u) => u.role === "PUBLICADOR").length
    const ed = items.filter((u) => u.role === "EDITOR").length
    const adm = items.filter((u) => u.role === "ADMINISTRADOR").length
    return { total, activeCount, pub, ed, adm }
  }, [items])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return items
      .filter((u) => {
        if (roleFilter !== "TODOS" && u.role !== roleFilter) return false
        if (onlyActive && !u.active) return false
        if (!query) return true
        const hay = `${u.name} ${u.email} ${u.role}`.toLowerCase()
        return hay.includes(query)
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [items, q, roleFilter, onlyActive])

  const openCreate = () => {
    setError("")
    setModal({ open: true, mode: "create" })
    setName("")
    setEmail("")
    setRole("PUBLICADOR")
    setActive(true)
  }

  const openEdit = (u: UserItem) => {
    setError("")
    setModal({ open: true, mode: "edit", item: u })
    setName(u.name)
    setEmail(u.email)
    setRole(u.role)
    setActive(u.active)
  }

  const closeModal = () => {
    setModal({ open: false })
    setError("")
  }

  const validate = (mode: "create" | "edit", currentId?: string) => {
    if (!name.trim()) return "Nome é obrigatório."
    if (!email.trim()) return "E-mail é obrigatório."
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailOk) return "E-mail inválido."

    const clash = items.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== currentId)
    if (clash) return `Já existe um usuário com esse e-mail: "${clash.name}".`
    return ""
  }

  const submit = () => {
    if (!modal.open) return
    const currentId = modal.mode === "edit" ? modal.item?.id : undefined

    const msg = validate(modal.mode, currentId)
    if (msg) {
      setError(msg)
      return
    }

    const now = new Date().toISOString()

    if (modal.mode === "create") {
      const newUser: UserItem = {
        id: `u-${Math.random().toString(16).slice(2)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        active,
        createdAt: now,
        lastLoginAt: undefined,
      }
      setItems((prev) => [newUser, ...prev])
      closeModal()
      return
    }

    // edit
    setItems((prev) =>
      prev.map((u) => {
        if (u.id !== modal.item?.id) return u
        return {
          ...u,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          active,
        }
      })
    )
    closeModal()
  }

  const remove = (u: UserItem) => {
    const ok = window.confirm(`Remover o usuário "${u.name}"?`)
    if (!ok) return
    setItems((prev) => prev.filter((x) => x.id !== u.id))
  }

  const toggleActive = (u: UserItem) => {
    setItems((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
    )
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Usuários & Funções</h1>
            <p className="text-sm text-slate-600 mt-1">
              Controle quem pode publicar, revisar e administrar o painel de notícias.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="
              inline-flex items-center gap-2
              h-11 px-4 rounded-lg
              border border-blue-900 bg-blue-900
              text-sm font-semibold text-white
              hover:bg-blue-800 transition-colors
            "
          >
            <Plus size={18} />
            Novo usuário
          </button>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Total</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Search size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.total}</p>
            <p className="text-xs text-slate-500 mt-1">Usuários cadastrados</p>
          </div>

          {/* Ativos */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-900/80">Ativos</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                <User size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-950 mt-2">{counts.activeCount}</p>
            <p className="text-xs text-emerald-900/60 mt-1">Com acesso liberado</p>
          </div>

          {/* Publicadores */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Publicadores</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <User size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{counts.pub}</p>
            <p className="text-xs text-slate-500 mt-1">Criam e editam</p>
          </div>

          {/* Editores */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-900/80">Editores</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
                <ShieldCheck size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-950 mt-2">{counts.ed}</p>
            <p className="text-xs text-blue-900/60 mt-1">Revisam e publicam</p>
          </div>

          {/* Admins */}
          <div className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-rose-900/80">Admins</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-900 border border-rose-200">
                <UserX size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-rose-950 mt-2">{counts.adm}</p>
            <p className="text-xs text-rose-900/60 mt-1">Gerenciam tudo</p>
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
                  placeholder="Buscar por nome ou e-mail…"
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="
                  h-11 px-3
                  rounded-xl border border-slate-300
                  text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                "
              >
                <option value="TODOS">Todas funções</option>
                <option value="PUBLICADOR">Publicador</option>
                <option value="EDITOR">Editor</option>
                <option value="ADMINISTRADOR">Administrador</option>
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
            <table className="min-w-[980px] w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[34%]">
                    Usuário
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[18%]">
                    Função
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[18%]">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[15%]">
                    Criado em
                  </th>
                  <th className="text-left text-xs font-bold text-slate-600 px-5 py-3 w-[15%]">
                    Último login
                  </th>
                  <th className="text-right text-xs font-bold text-slate-600 px-5 py-3 w-[10%]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800">Nenhum usuário encontrado</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Ajuste filtros ou crie um novo usuário.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={openCreate}
                            className="
                              inline-flex items-center gap-2
                              h-10 px-4 rounded-xl
                              border border-blue-900 bg-blue-900
                              text-sm font-semibold text-white
                              hover:bg-blue-800 transition-colors
                            "
                          >
                            <Plus size={18} />
                            Novo usuário
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white">
                            <User size={16} className="text-slate-700" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                            <p className="text-sm text-slate-600 mt-1 inline-flex items-center gap-2">
                              <Mail size={14} className="text-slate-400" />
                              <span className="truncate">{u.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={roleBadge(u.role)}>
                          {u.role === "ADMINISTRADOR"
                            ? "ADMIN"
                            : u.role === "EDITOR"
                            ? "EDITOR"
                            : "PUBLICADOR"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            u.active
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {u.active ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">{formatDateBR(u.createdAt)}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{formatDateBR(u.lastLoginAt)}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(u)}
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
                            onClick={() => toggleActive(u)}
                            className="
                              inline-flex items-center justify-center
                              h-9 w-9 rounded-xl
                              border border-slate-200
                              hover:bg-slate-50
                              transition-colors
                            "
                            title={u.active ? "Desativar" : "Ativar"}
                            aria-label="Ativar/Desativar"
                          >
                            <UserX size={16} className={u.active ? "text-slate-800" : "text-emerald-700"} />
                          </button>

                          <button
                            onClick={() => remove(u)}
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
            <span className="font-semibold text-slate-700">{items.length}</span> usuários
          </div>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {modal.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button className="absolute inset-0 bg-black/30" onClick={closeModal} aria-label="Fechar modal" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {modal.mode === "create" ? "Novo usuário" : "Editar usuário"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Defina permissões para publicação e revisão de notícias.
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
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">Nome</label>
                <div className="mt-2 relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Comunicação"
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">E-mail</label>
                <div className="mt-2 relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@propesq.br"
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-800">Função</label>
                <div className="mt-2 relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="
                      w-full h-11 pl-10 pr-3
                      rounded-xl border border-slate-300 bg-white
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-900/25 focus:border-blue-900
                    "
                  >
                    <option value="PUBLICADOR">Publicador</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Publicador cria/edita. Editor revisa/publica. Admin gerencia tudo.
                </p>
              </div>

              {/* Active */}
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
