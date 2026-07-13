import React, { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"

import logo from "@/utils/img/logo_propesq.png"
import marca70 from "@/utils/img/marca-70anos.png"

type SystemItem = {
  title: string
  link: string
}

type DrawerSection = {
  title: string
  items: { label: string; onClick?: () => void; href?: string; external?: boolean }[]
}

const SYSTEMS: SystemItem[] = [
  { title: "SIGPRPG", link: "http://150.165.209.3/sigprpg/login/" },
  { title: "Validação de Documentos", link: "http://150.165.209.3/sigprpg/login/" },
  {
    title: "Bases de Pesquisa",
    link: "https://www.biblioteca.ufpb.br/biblioteca/contents/menu/copy_of_servicos/copy_of_portais-de-pesquisa-e-bases-de-dados",
  },
]

export default function HeaderLanding() {
  const location = useLocation()
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)

  // acordeão do drawer (igual CI: só o primeiro aberto por padrão)
  const [openKey, setOpenKey] = useState<string>("Institucional")

  const path = location.pathname.toLowerCase()
  const isExternalLandingPage =
    path === "/awardedworks" ||
    path === "/awarded-works" ||
    path === "/papers" ||
    path.startsWith("/publications")

  const scrollToSection = (id: string) => {
    if (!isExternalLandingPage && (path === "/" || path === "")) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    navigate({ pathname: "/", hash: `#${id}` }, { replace: false })
  }

  const closeDrawer = () => setDrawerOpen(false)

  // fecha drawer com ESC e trava scroll do body
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  const drawerSections: DrawerSection[] = useMemo(() => {
    return [
      {
        title: "Institucional",
        items: [
          { label: "Apresentação", onClick: () => scrollToSection("about") },
          { label: "Equipe/Contato", href: "/quem-somos" },
        ],
      },
      {
        title: "Publicações",
        items: [
          { label: "Anais de Iniciação Científica", href: "/publications/anais" },
          { label: "Série Iniciados", href: "/publications/iniciados" },
        ],
      },
      {
        title: "Sistemas",
        items: SYSTEMS.map((s) => ({
          label: s.title,
          href: s.link,
          external: true,
        })),
      },
    ]
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const topbarLinks = useMemo(
    () => [
      { label: "SIGPRPG", href: SYSTEMS[0].link },
      { label: "Validar Documento", href: SYSTEMS[1].link },
      { label: "Bases de Pesquisas", href: SYSTEMS[2].link },
    ],
    []
  )

  const btnBase =
    "group relative inline-flex items-center justify-center h-10 px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] rounded-xl"

  const underline =
    "pointer-events-none absolute left-3 right-3 bottom-2 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* TOPBAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-end gap-6 text-xs text-slate-600">
          {topbarLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-4"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logos (como CI) */}
        <button
          onClick={() => scrollToSection("about")}
          className="flex items-center gap-4"
          aria-label="Ir para Institucional"
        >
          <img src={marca70} alt="UFPB 70 anos" className="h-12 w-auto select-none" />
          <img src={logo} alt="PROPESQ" className="h-12 w-auto select-none" />
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/publisher/login"
            className={`
              ${btnBase}
              border border-blue-900 text-blue-900 bg-white
              hover:bg-slate-50 hover:-translate-y-[1px]
            `}
            aria-label="Publicar notícias"
          >
            Publicar notícias
            <span className={`${underline} bg-blue-900`} />
          </Link>

          <Link
            to="/login"
            className={`
              ${btnBase}
              bg-blue-900 text-white border border-blue-900
              hover:-translate-y-[1px]
            `}
            aria-label="Entrar"
          >
            Entrar
            <span className={`${underline} bg-white`} />
          </Link>
        </div>

        {/* Mobile: botões + menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Publicar notícias (mobile) */}
          <Link
            to="/publisher/login"
            className={`
              ${btnBase}
              px-4
              border border-blue-900 text-blue-900 bg-white
            `}
            aria-label="Painel de publicações (notícias)"
            title="Publicar notícias"
          >
            Publicar
            <span className={`${underline} bg-blue-900`} />
          </Link>

          {/* Entrar (mobile) */}
          <Link
            to="/login"
            className={`
              ${btnBase}
              px-4
              bg-blue-900 text-white border border-blue-900
            `}
            aria-label="Entrar no sistema"
            title="Entrar"
          >
            Entrar
            <span className={`${underline} bg-white`} />
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="h-10 w-10 inline-flex items-center justify-center border border-slate-300 rounded-xl"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-slate-900" />
          </button>
        </div>
      </nav>

      {/* DRAWER*/}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* overlay */}
          <button
            className="absolute inset-0 bg-black/30"
            onClick={closeDrawer}
            aria-label="Fechar menu"
          />

          {/* painel */}
          <aside
            className="
              absolute right-0 top-0 h-full w-[92vw] max-w-[520px]
              bg-white border-l border-slate-200
              overflow-y-auto
            "
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            {/* topo do drawer */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={marca70} alt="UFPB 70 anos" className="h-10 w-auto" />
                <img src={logo} alt="PROPESQ" className="h-10 w-auto" />
              </div>

              <button
                onClick={closeDrawer}
                className="h-10 w-10 inline-flex items-center justify-center border border-slate-200 rounded-xl"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            {/* conteúdo */}
            <div className="p-6">
              {drawerSections.map((sec) => {
                const isOpen = openKey === sec.title
                return (
                  <div key={sec.title} className="border-b border-slate-200 pb-4 mb-4">
                    <button
                      onClick={() => setOpenKey((k) => (k === sec.title ? "" : sec.title))}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <span className="text-lg font-semibold text-slate-900">{sec.title}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-600 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="mt-2">
                        {sec.items.map((it) => (
                          <li key={it.label} className="border-t border-slate-200">
                            {it.href ? (
                              it.external ? (
                                <a
                                  href={it.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block py-3 text-slate-900"
                                  onClick={closeDrawer}
                                >
                                  {it.label}
                                </a>
                              ) : (
                                <Link to={it.href} className="block py-3 text-slate-900" onClick={closeDrawer}>
                                  {it.label}
                                </Link>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  it.onClick?.()
                                  closeDrawer()
                                }}
                                className="w-full text-left py-3 text-slate-900"
                              >
                                {it.label}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}

              {/* ações no drawer*/}
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  to="/publisher/login"
                  onClick={closeDrawer}
                  className="
                    group relative inline-flex items-center justify-center w-full
                    h-11
                    bg-white text-blue-900
                    text-sm font-semibold
                    border border-blue-900
                    rounded-lg
                    hover:bg-slate-50
                    transition-all duration-200
                    active:scale-[0.98]
                  "
                >
                  Publicar notícias
                  <span className="pointer-events-none absolute left-3 right-3 bottom-2 h-[2px] bg-blue-900 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="
                    group relative inline-flex items-center justify-center w-full
                    h-11
                    bg-blue-900 text-white
                    text-sm font-semibold
                    border border-blue-900
                    rounded-lg hover:bg-blue-800
                    transition-all duration-200
                    active:scale-[0.98]
                  "
                >
                  Entrar no sistema
                  <span className="pointer-events-none absolute left-3 right-3 bottom-2 h-[2px] bg-white origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
