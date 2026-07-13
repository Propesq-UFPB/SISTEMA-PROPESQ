import React, { useMemo, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import LogoImg from "@/utils/img/logo_propesq.png"
import {
  Menu,
  X,
  Newspaper,
  Tags,
  Users,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react"

const STORAGE_KEY = "publisher_session"

type NavItem = {
  label: string
  to: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  end?: boolean
  badge?: string
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function PublisherHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const session = useMemo(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    try {
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const nav: NavItem[] = [
    { label: "Notícias", to: "/publisher/news", icon: Newspaper, end: true },
    { label: "Categorias & Tags", to: "/publisher/tags", icon: Tags },
    { label: "Usuários & Papéis", to: "/publisher/users", icon: Users },
  ]

  const title = useMemo(() => {
    const path = location.pathname
    if (path === "/publisher" || path === "/publisher/news") return "Notícias"
    if (path.includes("/publisher/news/new")) return "Criar notícia"
    if (path.includes("/publisher/news/") && path.includes("/edit"))
      return "Editar notícia"
    if (path.includes("/publisher/news/") && path.includes("/preview"))
      return "Pré-visualização"
    if (path.startsWith("/publisher/tags")) return "Categorias & Tags"
    if (path.startsWith("/publisher/users")) return "Usuários & Papéis"
    return "Painel do Publicador"
  }, [location.pathname])

  const crumbs = useMemo(() => {
    const path = location.pathname.replace(/\/+$/, "")
    const parts = path.split("/").filter(Boolean)

    const cleaned = parts
      .filter((p) => p !== "publisher")
      .filter((p) => !/^\d+$/.test(p) && p !== "new")
    const result = ["Publisher", ...cleaned.map((p) => p)]
    return result
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    navigate("/publisher/login", { replace: true })
  }

  const closeMobile = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Brand */}
            <button
              type="button"
              onClick={() => navigate("/publisher/news")}
              className="flex items-center gap-2 min-w-0"
              title="Ir para lista de notícias"
            >
            <NavLink to="/" className="flex items-center gap-3">
            <img src={LogoImg} alt="PROPESQ" className="h-8 w-auto select-none" />
            </NavLink>
            </button>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      "group inline-flex items-center gap-2 h-10 px-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )
                  }
                >
                  <Icon size={16} className="opacity-90" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right: Page title + actions */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700"
              title="Sair do painel do publicador"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-200">
                <div className="text-xs text-slate-500">Navegação</div>
              </div>

              <div className="p-2">
                {nav.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cx(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-900 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        )
                      }
                    >
                      <Icon size={16} className="opacity-90" />
                      <span className="flex-1">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>

              <div className="p-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    closeMobile()
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
