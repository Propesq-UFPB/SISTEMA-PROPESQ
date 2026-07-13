import React, { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { NavLink, useLocation } from "react-router-dom"
import {
  Home,
  FolderKanban,
  LineChart,
  ShieldCheck,
  GraduationCap,
  FileText,
  Notebook,
  Bell,
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  ClipboardList,
  Building2,
  BookUser,
  BadgeCheck,
  FileSignature,
  Pencil,
  Megaphone,
  Workflow,
  Eye,
  Plus,
  Award,
  User,
  FileBadge,
  Mail,
  Wallet,
  History,
  Folder,
  Search,
  ClipboardCheck,
  GitBranch,
  Gavel,
} from "lucide-react"

import LogoImg from "@/utils/img/logo_propesq.png"
import { useAuth } from "@/context/AuthContext"

/* ================= TIPOS ================= */

type Role = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"
type NavItem = { to: string; label: string; icon?: React.ReactNode; end?: boolean }

/* ================= MATCHERS ================= */

function isActive(pathname: string, to: string, end?: boolean) {
  if (to === "/") return pathname === "/"

  if (end) return pathname === to

  if (to === "/adm/admprojetos") {
    return (
      pathname === "/adm/admprojetos" ||
      pathname.startsWith("/adm/admprojetos/") ||
      pathname.startsWith("/adm/projetos")
    )
  }

  if (to === "/adm/avaliacao/avaliadores") {
    return pathname === "/adm/avaliacao" || pathname.startsWith("/adm/avaliacao/")
  }

  if (to === "/adm/resultados/ranking") {
    return pathname === "/adm/resultados" || pathname.startsWith("/adm/resultados/")
  }

  if (to === "/adm/monitoring/replacements") {
    return pathname === "/adm/monitoring" || pathname.startsWith("/adm/monitoring/")
  }

  if (to === "/adm/calls/CreateCall") {
    return pathname === "/adm/calls" || pathname.startsWith("/adm/calls/")
  }

  if (to === "/adm/settings/scholarships") {
    return pathname === "/adm/settings" || pathname.startsWith("/adm/settings/")
  }

  if (to === "/discente/projetos") {
    return (
      pathname === "/discente/projetos" ||
      pathname.startsWith("/discente/projetos/") ||
      pathname === "/discente/vinculo"
    )
  }

  if (to === "/discente/editais")
    return pathname === "/discente/editais" || pathname.startsWith("/discente/editais/")

  if (to === "/discente/planos-disponiveis")
    return pathname === "/discente/planos-disponiveis" || pathname.startsWith("/discente/planos-disponiveis/")

  if (to === "/discente/relatorios")
    return pathname === "/discente/relatorios" || pathname.startsWith("/discente/relatorios/")

  if (to === "/discente/enic/submissions")
    return pathname.startsWith("/discente/enic/")

  if (to === "/discente/notificacoes")
    return pathname === "/discente/notificacoes" || pathname.startsWith("/discente/notificacoes/")

  if (to === "/discente/certificados")
    return (
      pathname === "/discente/certificados" ||
      pathname.startsWith("/discente/certificados/") ||
      pathname === "/discente/historico-participacao"
    )

  if (to === "/discente/perfil")
    return pathname === "/discente/perfil" || pathname.startsWith("/discente/perfil/")

  if (to === "/discente/configuracoes")
    return pathname === "/discente/configuracoes" || pathname.startsWith("/discente/configuracoes/")

  if (to === "/dashboard")
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/")

  /* Coordenador */

  if (to === "/coordenador/planos/indicacoes") {
    return (
      pathname === "/coordenador/planos/indicacoes" ||
      pathname.startsWith("/coordenador/planos/indicacoes/") ||
      pathname === "/coordenador/planos/novo" ||
      pathname.startsWith("/coordenador/planos/novo/")
    )
  }

  if (to === "/coordenador/projetos") {
    return (
      pathname === "/coordenador/projetos" ||
      (
        pathname.startsWith("/coordenador/projetos/") &&
        !pathname.startsWith("/coordenador/planos/indicacoes/")
      )
    )
  }

  if (to === "/coordenador/avaliacoes") {
    return (
      pathname === "/coordenador/avaliacoes" ||
      pathname.startsWith("/coordenador/avaliacoes/")
    )
  }

  if (to === "/coordenador/indicacoes") {
    return (
      pathname === "/coordenador/indicacoes" ||
      pathname.startsWith("/coordenador/indicacoes/")
    )
  }

  if (to === "/coordenador/relatorios") {
    return (
      pathname === "/coordenador/relatorios" ||
      pathname.startsWith("/coordenador/relatorios/")
    )
  }

  if (to === "/coordenador/producao/ipi") {
    return (
      pathname === "/coordenador/producao" ||
      pathname === "/coordenador/producao/ipi" ||
      pathname.startsWith("/coordenador/producao/")
    )
  }

  return pathname === to || pathname.startsWith(to + "/")
}

function pickActivePrimary(pathname: string, primary: NavItem[], fallback: string) {
  const sorted = [...primary].sort((a, b) => b.to.length - a.to.length)
  const found = sorted.find((p) => isActive(pathname, p.to, p.end))
  return found?.to ?? fallback
}

/* ================= TEMA ================= */

type ThemeTokens = {
  page: string
  pageSoft: string
  sidebarBg: string
  sidebarFg: string
  appBg: string
}

function themeFromPath(pathname: string): ThemeTokens {
  const base: ThemeTokens = {
    page: "#2563EB",
    pageSoft: "#DBEAFE",
    sidebarBg: "#0B1220",
    sidebarFg: "#E5E7EB",
    appBg: "#F3F4F6",
  }

  if (pathname.startsWith("/dashboard"))
    return { ...base, page: "#2563EB", pageSoft: "#DBEAFE" }

  if (pathname.startsWith("/adm/admprojetos") || pathname.startsWith("/adm/projetos"))
    return { ...base, page: "#059669", pageSoft: "#D1FAE5" }

  if (pathname.startsWith("/adm/avaliacao") || pathname.startsWith("/avaliacoes"))
    return { ...base, page: "#7C3AED", pageSoft: "#EDE9FE" }

  if (pathname.startsWith("/adm/resultados"))
    return { ...base, page: "#0891B2", pageSoft: "#CFFAFE" }

  if (pathname.startsWith("/adm/monitoring"))
    return { ...base, page: "#D97706", pageSoft: "#FFEDD5" }

  if (pathname.startsWith("/adm/calls"))
    return { ...base, page: "#DB2777", pageSoft: "#FCE7F3" }

  if (pathname.startsWith("/adm/settings"))
    return { ...base, page: "#334155", pageSoft: "#E2E8F0" }

  if (pathname.startsWith("/discente/projetos") || pathname === "/discente/vinculo")
    return { ...base, page: "#059669", pageSoft: "#D1FAE5" }

  if (pathname.startsWith("/discente/editais"))
    return { ...base, page: "#DB2777", pageSoft: "#FCE7F3" }

  if (pathname.startsWith("/discente/planos-disponiveis"))
    return { ...base, page: "#0EA5E9", pageSoft: "#E0F2FE" }

  if (pathname.startsWith("/discente/relatorios"))
    return { ...base, page: "#7C3AED", pageSoft: "#EDE9FE" }

  if (pathname.startsWith("/discente/enic"))
    return { ...base, page: "#D97706", pageSoft: "#FFEDD5" }

  if (pathname.startsWith("/discente/notificacoes"))
    return { ...base, page: "#DC2626", pageSoft: "#FEE2E2" }

  if (pathname.startsWith("/discente/certificados") || pathname === "/discente/historico-participacao")
    return { ...base, page: "#DB2777", pageSoft: "#FCE7F3" }

  if (pathname.startsWith("/discente/perfil"))
    return { ...base, page: "#2563EB", pageSoft: "#DBEAFE" }

  if (pathname.startsWith("/discente/configuracoes"))
    return { ...base, page: "#334155", pageSoft: "#E2E8F0" }

  /* Coordenador */
  if (
    pathname.startsWith("/coordenador/planos/indicacoes")
  )
    return { ...base, page: "#0EA5E9", pageSoft: "#E0F2FE" }

  if (
    pathname.startsWith("/coordenador/planos/novo")
  )
    return { ...base, page: "#0EA5E9", pageSoft: "#E0F2FE" }

  if (pathname.startsWith("/coordenador/projetos"))
    return { ...base, page: "#059669", pageSoft: "#D1FAE5" }

  if (pathname.startsWith("/coordenador/avaliacoes"))
    return { ...base, page: "#7C3AED", pageSoft: "#EDE9FE" }

  if (pathname.startsWith("/coordenador/indicacoes"))
    return { ...base, page: "#DB2777", pageSoft: "#FCE7F3" }

  if (pathname.startsWith("/coordenador/relatorios"))
    return { ...base, page: "#D97706", pageSoft: "#FFEDD5" }

  if (pathname.startsWith("/coordenador/producao"))
    return { ...base, page: "#2563EB", pageSoft: "#DBEAFE" }

  return base
}

/* ================= MOBILE DRAWER ================= */

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  primaryMenu: NavItem[]
  secondary: NavItem[]
  pathname: string
  logout: () => void
}

function MobileDrawer({
  open,
  onClose,
  primaryMenu,
  secondary,
  pathname,
  logout,
}: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          transition: "opacity 300ms ease",
          opacity: visible ? 1 : 0,
        }}
      />

      <aside
        style={{
          position: "relative",
          width: "min(320px, 85vw)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--sidebar-bg)",
          color: "var(--sidebar-fg)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
          transform: visible ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            padding: "0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <img src={LogoImg} alt="PROPESQ" style={{ height: 28, opacity: 0.95 }} />

          <button
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--sidebar-fg)",
              padding: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {primaryMenu.map((item) => {
            const active = isActive(pathname, item.to, item.end)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: active ? "#fff" : "rgba(229,231,235,0.85)",
                  background: active
                    ? "color-mix(in srgb, var(--page) 35%, transparent)"
                    : "transparent",
                  transition: "background 150ms, color 150ms",
                }}
              >
                <span
                  style={{
                    color: active ? "#fff" : "rgba(255,255,255,0.65)",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            )
          })}

          {secondary.length > 0 && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.45)",
                  margin: "0 0 8px 14px",
                }}
              >
                Seções
              </p>

              {secondary.map((item) => {
                const active = isActive(pathname, item.to, item.end)

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      color: active ? "#fff" : "rgba(229,231,235,0.8)",
                      background: active
                        ? "color-mix(in srgb, var(--page) 35%, transparent)"
                        : "transparent",
                      transition: "background 150ms, color 150ms",
                    }}
                  >
                    <span
                      style={{
                        color: active ? "#fff" : "rgba(255,255,255,0.6)",
                        display: "flex",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          )}
        </nav>

        <div
          style={{
            padding: "16px 16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => {
              onClose()
              logout()
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "color-mix(in srgb, var(--page) 22%, transparent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 150ms",
            }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>
    </div>,
    document.body
  )
}

/* ================= APP HEADER ================= */

export default function AppHeader() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const role = (user?.role as Role) || "DISCENTE"

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const t = themeFromPath(location.pathname)
    const root = document.documentElement

    root.style.setProperty("--page", t.page)
    root.style.setProperty("--page-soft", t.pageSoft)
    root.style.setProperty("--sidebar-bg", t.sidebarBg)
    root.style.setProperty("--sidebar-fg", t.sidebarFg)
    root.style.setProperty("--app-bg", t.appBg)

    document.body.style.backgroundColor = "var(--app-bg)"
  }, [location.pathname])

  /* ---- menus ---- */

  const adminPrimary: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/adm/admprojetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    { to: "/adm/avaliacao/avaliadores", label: "Avaliação", icon: <FileSignature size={16} /> },
    { to: "/adm/resultados/ranking", label: "Resultados", icon: <Award size={16} /> },
   // { to: "/adm/monitoring/replacements", label: "Acompanhamento", icon: <BadgeCheck size={16} /> },
    { to: "/adm/calls/CreateCall", label: "Editais", icon: <LineChart size={16} /> },
    { to: "/adm/settings/scholarships", label: "Configurações", icon: <Settings size={16} /> },
  ]

  const adminSecondaryByPrimary: Record<string, NavItem[]> = {
    "/dashboard": [
      { to: "/dashboard", label: "Overview", icon: <Home size={16} />, end: true },
      // { to: "/adm/admprojetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    ],
    "/adm/admprojetos": [
      { to: "/adm/admprojetos", label: "Buscar Projetos", icon: <Eye size={16} />, end: true },
      { to: "/adm/projetos/novo", label: "Cadastrar", icon: <Plus size={16} />, end: true },
      { to: "/adm/projetos/status", label: "Alterar Situação", icon: <Workflow size={16} />, end: true },
      { to: "/adm/projetos/comunicacao", label: "Comunicação", icon: <Megaphone size={16} />, end: true },
    ],
    "/adm/avaliacao/avaliadores": [
      // { to: "/adm/avaliacao", label: "Overview", icon: <FileSignature size={16} />, end: true },
      { to: "/adm/avaliacao/avaliadores", label: "Avaliadores", icon: <Users size={16} />, end: true },
      { to: "/adm/avaliacao/distribuicao", label: "Distribuição de Avaliações", icon: <GitBranch size={16} />, end: true },
      //{ to: "/adm/avaliacao/consolidacao", label: "Consolidação de Avaliações", icon: <ClipboardCheck size={16} />, end: true },
      { to: "/adm/avaliacao/ipi", label: "Relatório IPI", icon: <FileText size={16} />, end: true },
    ],
    "/adm/resultados/ranking": [
      { to: "/adm/resultados/ranking", label: "Ranking Final", icon: <Award size={16} />, end: true },
      { to: "/adm/resultados/quotas", label: "Cotas", icon: <ShieldCheck size={16} />, end: true },
      { to: "/adm/resultados/recursos", label: "Recursos", icon: <Gavel size={16} />, end: true },
    ],
    "/adm/monitoring/replacements": [
      // { to: "/adm/monitoring", label: "Overview", icon: <BadgeCheck size={16} />, end: true },
      { to: "/adm/monitoring/replacements", label: "Substituições", icon: <Users size={16} />, end: true },
      { to: "/adm/monitoring/report-validation", label: "Validação Relatórios", icon: <FileText size={16} />, end: true },
      { to: "/adm/monitoring/AdmCertificates", label: "Certificados", icon: <Award size={16} />, end: true },
    ],
    "/adm/calls/CreateCall": [
      //{ to: "/adm/calls", label: "Overview", icon: <FolderKanban size={16} />, end: true },
      { to: "/adm/calls/CreateCall", label: "Novo Edital", icon: <Notebook size={16} />, end: true },
      { to: "/adm/calls/Manage", label: "Alterar/Remover", icon: <Pencil size={16} />, end: true },
      // { to: "/adm/calls/CallSchedule", label: "Cronograma", icon: <ClipboardList size={16} />, end: true },
      //{ to: "/adm/calls/CallWorkflow", label: "Workflow", icon: <LineChart size={16} />, end: true },
    ],
    "/adm/settings/scholarships": [
      //{ to: "/adm/settings", label: "Overview", icon: <Settings size={16} />, end: true },
      { to: "/adm/settings/scholarships", label: "Bolsas", icon: <ShieldCheck size={16} />, end: true },
      { to: "/adm/settings/academic-units", label: "Unidades", icon: <Building2 size={16} />, end: true },
      { to: "/adm/settings/roles", label: "Funções", icon: <BookUser size={16} />, end: true },
      { to: "/adm/settings/user-types", label: "Usuários", icon: <Users size={16} />, end: true },
      { to: "/adm/settings/parameters", label: "Parâmetros", icon: <Settings size={16} />, end: true },
    ],
  }

  const studentPrimary: NavItem[] = [
    { to: "/discente/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    // { to: "/discente/editais", label: "Editais", icon: <Megaphone size={16} /> },
    { to: "/discente/planos-disponiveis", label: "Planos", icon: <Notebook size={16} /> },
    { to: "/discente/relatorios", label: "Relatórios", icon: <FileText size={16} /> },
    //{ to: "/discente/enic/submissions", label: "ENIC", icon: <Award size={16} /> },
    { to: "/discente/certificados", label: "Certificados", icon: <FileBadge size={16} /> },
    { to: "/discente/perfil", label: "Perfil", icon: <User size={16} /> },
  ]

  const studentSecondaryByPrimary: Record<string, NavItem[]> = {
    "/discente/projetos": [
      { to: "/discente/projetos", label: "Meus Projetos", icon: <FolderKanban size={16} />, end: true },
      { to: "/discente/projetos/consultar", label: "Consultar Projetos", icon: <Search size={16} />, end: true },
    ],
    //"/discente/editais": [
      //{ to: "/discente/editais", label: "Lista de Editais", icon: <Megaphone size={16} />, end: true },
      // { to: "/discente/editais/1", label: "Visualizar Edital", icon: <Eye size={16} />, end: true },
      //{ to: "/discente/editais/1/inscricao", label: "Inscrição", icon: <Pencil size={16} />, end: true },
      // { to: "/discente/editais/1/status", label: "Status da Inscrição", icon: <Workflow size={16} />, end: true },
      //{ to: "/discente/editais/1/resultado", label: "Resultado", icon: <Award size={16} />, end: true },
    //],
    "/discente/planos-disponiveis": [
      { to: "/discente/planos-disponiveis", label: "Planos Disponíveis", icon: <Notebook size={16} />, end: true },
      //{ to: "/discente/planos-disponiveis/1", label: "Visualizar Plano", icon: <Eye size={16} />, end: true },
    ],
    "/discente/relatorios": [
      { to: "/discente/relatorios", label: "Lista de Relatórios", icon: <FileText size={16} />, end: true },
      //{ to: "/discente/relatorios/1/parcial", label: "Relatório Parcial", icon: <Pencil size={16} />, end: true },
      //{ to: "/discente/relatorios/1/final", label: "Relatório Final", icon: <FileSignature size={16} />, end: true },
      //{ to: "/discente/relatorios/1/visualizar", label: "Consultar", icon: <Eye size={16} />, end: true },
    ],
    "/discente/enic/submissions": [
      //{ to: "/discente/enic/submissions", label: "Submissões", icon: <ClipboardList size={16} />, end: true },
      //{ to: "/discente/enic/inscricao", label: "Nova Submissão", icon: <Plus size={16} />, end: true },
      //{ to: "/discente/enic/visualizar/1", label: "Consultar", icon: <Eye size={16} />, end: true },
      //{ to: "/discente/enic/modelo", label: "Modelo de Submissão", icon: <FileText size={16} />, end: true },
    ],
    "/discente/certificados": [
      { to: "/discente/certificados", label: "Lista de Certificados", icon: <FileBadge size={16} />, end: true },
      { to: "/discente/historico-participacao", label: "Declaração de Participação", icon: <History size={16} />, end: true },
    ],
    "/discente/perfil": [
      { to: "/discente/perfil", label: "Meu Perfil", icon: <User size={16} />, end: true },
      //{ to: "/discente/perfil/editar", label: "Editar Perfil", icon: <Pencil size={16} />, end: true },
      //{ to: "/discente/perfil/dados-bancarios", label: "Dados Bancários", icon: <Wallet size={16} />, end: true },
      // { to: "/discente/perfil/documentos", label: "Documentos", icon: <Folder size={16} />, end: true },
    ],
  }

  const coordinatorPrimary: NavItem[] = [
    { to: "/coordenador/projetos", label: "Projetos", icon: <FolderKanban size={16} /> },
    { to: "/coordenador/planos/indicacoes", label: "Planos", icon: <Notebook size={16} /> },
    { to: "/coordenador/avaliacoes", label: "Avaliações", icon: <FileSignature size={16} /> },
    { to: "/coordenador/relatorios", label: "Relatórios", icon: <FileText size={16} /> },
    { to: "/coordenador/producao/ipi", label: "Produção", icon: <Award size={16} /> },
  ]

  const coordinatorSecondaryByPrimary: Record<string, NavItem[]> = {
    "/coordenador/projetos": [
      { to: "/coordenador/projetos", label: "Lista de Projetos", icon: <FolderKanban size={16} />, end: true },
      { to: "/coordenador/projetos/novo", label: "Novo Projeto", icon: <Plus size={16} />, end: true },
      //{to: "/coordenador/projetos/1", label: "Visualizar Projeto", icon: <Eye size={16} />, end: true,},
    ],

    "/coordenador/planos/indicacoes": [
      { to: "/coordenador/planos/indicacoes", label: "Indicações para Plano de Trabalho", icon: <Users size={16} />, end: true },
      { to: "/coordenador/planos/novo", label: "Adicionar Plano de Trabalho", icon: <Notebook size={16} />, end: true },
    ],

    "/coordenador/avaliacoes": [
      { to: "/coordenador/avaliacoes", label: "Lista de Avaliações", icon: <ClipboardList size={16} />, end: true },
      //{to: "/coordenador/avaliacoes/1", label: "Detalhe da Avaliação", icon: <Eye size={16} />, end: true,},
    ],

    "/coordenador/relatorios": [
      { to: "/coordenador/relatorios", label: "Lista de Relatórios", icon: <FileText size={16} />, end: true },
      //{to: "/coordenador/relatorios/1/revisao",label: "Revisar Relatório",icon: <FileSignature size={16} />,end: true,},
    ],

    "/coordenador/producao/ipi": [
      { to: "/coordenador/producao/ipi", label: "IPI", icon: <Award size={16} />, end: true },
      { to: "/coordenador/producao/resultado", label: "Resultado & Classificação", icon: <LineChart size={16} />, end: true },
    ],
  }

  const adminActivePrimary = useMemo(
    () => pickActivePrimary(location.pathname, adminPrimary, "/dashboard"),
    [location.pathname]
  )

  const studentActivePrimary = useMemo(
    () => pickActivePrimary(location.pathname, studentPrimary, "/discente/projetos"),
    [location.pathname]
  )

  const coordinatorActivePrimary = useMemo(
    () => pickActivePrimary(location.pathname, coordinatorPrimary, "/coordenador/projetos"),
    [location.pathname]
  )

  const adminSecondary = adminSecondaryByPrimary[adminActivePrimary] ?? []
  const studentSecondary = studentSecondaryByPrimary[studentActivePrimary] ?? []
  const coordinatorSecondary = coordinatorSecondaryByPrimary[coordinatorActivePrimary] ?? []

  const primaryMenu =
    role === "ADMINISTRADOR"
      ? adminPrimary
      : role === "DISCENTE"
        ? studentPrimary
        : role === "COORDENADOR"
          ? coordinatorPrimary
          : coordinatorPrimary

  const activeSecondary =
    role === "ADMINISTRADOR"
      ? adminSecondary
      : role === "DISCENTE"
        ? studentSecondary
        : role === "COORDENADOR"
          ? coordinatorSecondary
          : []

  const homeLink =
    role === "ADMINISTRADOR"
      ? "/dashboard"
      : role === "DISCENTE"
        ? "/discente/projetos"
        : role === "COORDENADOR"
          ? "/coordenador/projetos"
          : "/coordenador/projetos"

  /* ---- classes ---- */

  const desktopLinkClass = (active: boolean) => `
    relative inline-flex items-center gap-2 text-sm font-medium pb-2 transition-colors
    ${active ? "text-[color:var(--page)]" : "text-neutral hover:text-[color:var(--page)]"}
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[3px] after:w-full after:rounded-full after:bg-[color:var(--page)]
    after:transform after:origin-center after:transition-transform after:duration-300
    ${active ? "after:scale-x-100" : "after:scale-x-0"}
  `

  const subSegmentClass = (active: boolean) => `
    relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-full transition-all
    ${
      active
        ? "bg-[color:var(--page)] text-white shadow-sm"
        : "text-neutral hover:text-[color:var(--page)] hover:bg-[color:var(--page-soft)]"
    }
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--page)]/40
  `

  /* ---- render ---- */

  return (
    <>
      <header
        className={`sticky top-0 z-40 px-3 border-b border-neutral-light transition-shadow bg-white/75 backdrop-blur ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,.06), 0 8px 24px rgba(15,23,42,.06)"
            : undefined,
        }}
      >
        <div className="h-[3px] w-full" style={{ background: "var(--page)" }} />

        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto,1fr,auto] items-center gap-6 px-6">
          <NavLink to={homeLink} className="flex items-center gap-3">
            <img src={LogoImg} alt="PROPESQ" className="h-8 w-auto select-none" />
          </NavLink>

          <nav className="hidden items-center justify-center gap-6 md:flex">
            {primaryMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive: rrActive }) =>
                  desktopLinkClass(isActive(location.pathname, item.to, item.end) || rrActive)
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors border text-[color:var(--page)] border-[color:var(--page)] hover:bg-[color:var(--page)] hover:text-white"
            >
              <LogOut size={16} />
              Sair
            </button>

            <button
              className="flex items-center justify-center rounded-lg p-2 hover:bg-[color:var(--page-soft)] md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {activeSecondary.length > 0 && (
          <div className="mx-auto mt-2 max-w-7xl px-6 pb-2">
            <div className="hidden justify-center md:flex">
              <div className="inline-flex items-center gap-1 rounded-full border border-neutral-light bg-white p-1 shadow-lg">
                {activeSecondary.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive: rrActive }) =>
                      subSegmentClass(isActive(location.pathname, item.to, item.end) || rrActive)
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        primaryMenu={primaryMenu}
        secondary={activeSecondary}
        pathname={location.pathname}
        logout={logout}
      />
    </>
  )
}

function MessageSquareIcon() {
  return <Mail size={16} />
}