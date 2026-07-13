import React, { useMemo, useState } from "react"
import {
  BadgeCheck,
  QrCode,
  FileText,
  Users,
  ChevronDown,
  Search,
  Download,
  Eye,
  Info,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Copy,
  History,
  ArrowLeft,
} from "lucide-react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

type Call = { id: string; title: string; baseYear: number }
type Project = { id: string; callId: string; title: string; center?: string }

type Role = "ORIENTADOR" | "ALUNO" | "AVALIADOR"
type Lang = "PT_BR" | "EN"

type Participant = {
  id: string
  name: string
  cpf?: string
  registration?: string // matrícula
  role: Role
  email?: string
  period?: { start: string; end?: string } // vivências passadas/atuais
}

type Certificate = {
  id: string
  callId: string
  projectId: string
  participantId: string
  role: Role
  lang: Lang
  status: "ISSUED" | "REVOKED"
  issuedAt: string
  qrToken: string
  lastDownloadAt?: string
}

function roleLabel(r: Role) {
  if (r === "ORIENTADOR") return "Orientador"
  if (r === "AVALIADOR") return "Avaliador"
  return "Aluno"
}

function langLabel(l: Lang) {
  return l === "PT_BR" ? "PT-BR" : "EN"
}

function chip(text: string, tone: "neutral" | "green" | "red" | "amber" = "neutral") {
  const cls =
    tone === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : tone === "red"
      ? "bg-red-50 text-red-700 border-red-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-neutral-50 text-neutral border-neutral-light"
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${cls}`}>
      {text}
    </span>
  )
}

function Section({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-neutral-light bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-neutral-light/60">{icon}</span>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  )
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function token() {
  return Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2)
}

function normalizeText(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "")
}

export default function AdmCertificates() {
  const [mode, setMode] = useState<"pdf" | "qr">("pdf")

  // ===== Mock: editais e projetos (projeto pertence a um edital) =====
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])

  const [projects] = useState<Project[]>([
    { id: "p1", callId: "call_2026_01", title: "Detecção de presença com TinyML", center: "CT" },
    { id: "p2", callId: "call_2026_01", title: "Otimização de energia em datacenters", center: "CI" },
    { id: "p9", callId: "call_2025_03", title: "Robótica educacional em escolas públicas", center: "CCHLA" },
  ])

  // ===== Participantes por projeto (vivências passadas e atuais) =====
  const [participantsByProject] = useState<Record<string, Participant[]>>({
    p1: [
      {
        id: "u1",
        name: "Profa. Ana Souza",
        cpf: "123.456.789-01",
        registration: "DOC-2026001",
        role: "ORIENTADOR",
        email: "ana@ufpb.br",
        period: { start: "2026-01-01" },
      },
      {
        id: "u2",
        name: "Discente Maria",
        cpf: "987.654.321-00",
        registration: "202611110",
        role: "ALUNO",
        email: "maria@ufpb.br",
        period: { start: "2026-01-01" },
      },
      {
        id: "u3",
        name: "Dr. Paulo (Externo)",
        cpf: "111.222.333-44",
        registration: "EXT-PAULO-01",
        role: "AVALIADOR",
        email: "paulo@gmail.com",
        period: { start: "2026-02-01", end: "2026-03-01" },
      },
    ],
    p2: [
      {
        id: "u4",
        name: "Prof. Diego Ramos",
        cpf: "222.333.444-55",
        registration: "DOC-2026002",
        role: "ORIENTADOR",
        email: "diego@ufpb.br",
        period: { start: "2026-01-01" },
      },
      {
        id: "u5",
        name: "Discente Marcos",
        cpf: "333.444.555-66",
        registration: "202622220",
        role: "ALUNO",
        email: "marcos@ufpb.br",
        period: { start: "2026-01-15" },
      },
      {
        id: "u6",
        name: "Profa. Carla (Avaliadora)",
        cpf: "444.555.666-77",
        registration: "AV-2026-03",
        role: "AVALIADOR",
        email: "carla@ufpb.br",
        period: { start: "2026-02-10", end: "2026-03-20" },
      },
    ],
    p9: [
      {
        id: "u7",
        name: "Profa. Aline Mendes",
        cpf: "555.666.777-88",
        registration: "DOC-2025009",
        role: "ORIENTADOR",
        email: "aline@ufpb.br",
        period: { start: "2025-05-01", end: "2025-12-20" },
      },
      {
        id: "u8",
        name: "Discente Pedro (Externo)",
        cpf: "666.777.888-99",
        registration: "EXT-AL-901",
        role: "ALUNO",
        email: "pedro@escola.br",
        period: { start: "2025-05-01", end: "2025-10-01" },
      },
      {
        id: "u9",
        name: "Discente Aline (Externa)",
        cpf: "777.888.999-00",
        registration: "EXT-AL-902",
        role: "ALUNO",
        email: "aline@escola.br",
        period: { start: "2025-10-05", end: "2025-12-20" },
      },
    ],
  })

  // ===== Certificados emitidos (registro + QR Token) =====
  const [certs, setCerts] = useState<Certificate[]>([
    {
      id: "c1",
      callId: "call_2026_01",
      projectId: "p1",
      participantId: "u2",
      role: "ALUNO",
      lang: "PT_BR",
      status: "ISSUED",
      issuedAt: "2026-03-25T10:00:00Z",
      qrToken: "cert-" + token(),
      lastDownloadAt: "2026-03-25T10:10:00Z",
    },
  ])


  // ===== Filtro PRINCIPAL (pessoa) =====
  const [personQuery, setPersonQuery] = useState("")
  const [personField, setPersonField] = useState<"ANY" | "NAME" | "CPF" | "REG">("ANY")

  // ===== Filtros secundários (opcionais) =====
  const [selectedCallId, setSelectedCallId] = useState<string>("") // opcional
  const [selectedProjectId, setSelectedProjectId] = useState<string>("") // opcional
  const [role, setRole] = useState<Role>("ALUNO")
  const [lang, setLang] = useState<Lang>("PT_BR")
  const [includePast, setIncludePast] = useState(true)
  const [includeCurrent, setIncludeCurrent] = useState(true)

  // Seleção agora é por "projeto:participante" (P evita colisão se a mesma pessoa estiver em projetos diferentes)
  const [selectedParticipantKeys, setSelectedParticipantKeys] = useState<Record<string, boolean>>({})

  // ===== QR verification =====
  const [qrInput, setQrInput] = useState("")
  const [qrResult, setQrResult] = useState<Certificate | null>(null)

  // Flatten para permitir buscar pessoa SEM precisar escolher edital/projeto antes
  type ParticipantHit = {
    key: string // `${projectId}:${participantId}`
    projectId: string
    callId: string
    projectTitle: string
    projectCenter?: string
    participant: Participant
  }

  const allParticipantHits = useMemo<ParticipantHit[]>(() => {
    const hits: ParticipantHit[] = []
    for (const proj of projects) {
      const list = participantsByProject[proj.id] ?? []
      for (const p of list) {
        hits.push({
          key: `${proj.id}:${p.id}`,
          projectId: proj.id,
          callId: proj.callId,
          projectTitle: proj.title,
          projectCenter: proj.center,
          participant: p,
        })
      }
    }
    return hits
  }, [projects, participantsByProject])

  const projectsForSelectedCall = useMemo(() => {
    if (!selectedCallId) return projects
    return projects.filter((p) => p.callId === selectedCallId)
  }, [projects, selectedCallId])

  // Se o projeto selecionado não pertencer ao edital selecionado, limpa o projeto (consistência)
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null
    return projects.find((p) => p.id === selectedProjectId) ?? null
  }, [projects, selectedProjectId])

  const filteredHits = useMemo(() => {
    const now = new Date()

    const isPast = (p: Participant) => {
      if (!p.period?.end) return false
      return new Date(p.period.end) < now
    }
    const isCurrent = (p: Participant) => {
      if (!p.period?.start) return true
      const start = new Date(p.period.start)
      const end = p.period.end ? new Date(p.period.end) : null
      return start <= now && (!end || end >= now)
    }

    const qText = normalizeText(personQuery)
    const qDigits = onlyDigits(personQuery)

    const matchPerson = (p: Participant) => {
      if (!personQuery.trim()) return true

      const nameN = normalizeText(p.name || "")
      const cpfD = onlyDigits(p.cpf || "")
      const regN = normalizeText(p.registration || "")
      const regD = onlyDigits(p.registration || "")

      if (personField === "NAME") return nameN.includes(qText)
      if (personField === "CPF") return qDigits ? cpfD.includes(qDigits) : false
      if (personField === "REG") return qText ? regN.includes(qText) || (qDigits ? regD.includes(qDigits) : false) : false

      // ANY
      const anyText =
        nameN.includes(qText) ||
        (qDigits ? cpfD.includes(qDigits) : false) ||
        (qText ? regN.includes(qText) : false) ||
        (qDigits ? regD.includes(qDigits) : false)

      // Se o usuário digitou só letras (ex.: "maria"), qDigits fica vazio — ainda queremos buscar por nome/reg.
      // Se digitou números (cpf/matrícula), qText ainda existe, mas o critério de dígitos é o mais útil.
      return anyText
    }

    return allParticipantHits
      .filter((h) => h.participant.role === role)
      .filter((h) => {
        // secundário: edital/projeto (opcional)
        if (selectedCallId && h.callId !== selectedCallId) return false
        if (selectedProjectId && h.projectId !== selectedProjectId) return false
        return true
      })
      .filter((h) => {
        // secundário: período (passado/atual)
        const past = isPast(h.participant)
        const current = isCurrent(h.participant)
        const allowed = (includePast && past) || (includeCurrent && current) || (!past && !current)
        return allowed
      })
      .filter((h) => matchPerson(h.participant))
      .sort((a, b) => a.participant.name.localeCompare(b.participant.name))
  }, [
    allParticipantHits,
    role,
    selectedCallId,
    selectedProjectId,
    includePast,
    includeCurrent,
    personQuery,
    personField,
  ])

  const selectedKeys = useMemo(
    () => Object.keys(selectedParticipantKeys).filter((k) => selectedParticipantKeys[k]),
    [selectedParticipantKeys]
  )

  const canGenerate = selectedKeys.length > 0

  function toggleParticipant(key: string) {
    setSelectedParticipantKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function clearSelection() {
    setSelectedParticipantKeys({})
  }

  function generatePDFs() {
    if (!canGenerate) return

    const nowIso = new Date().toISOString()

    const newCerts: Certificate[] = selectedKeys
      .map((k) => filteredHits.find((h) => h.key === k) ?? allParticipantHits.find((h) => h.key === k) ?? null)
      .filter(Boolean)
      .map((hit) => {
        const h = hit as ParticipantHit
        return {
          id: uid("cert"),
          callId: h.callId,
          projectId: h.projectId,
          participantId: h.participant.id,
          role,
          lang,
          status: "ISSUED",
          issuedAt: nowIso,
          qrToken: "cert-" + token(),
        }
      })

    setCerts((prev) => [...newCerts, ...prev])
    clearSelection()
    alert("PDFs gerados (placeholder).")
  }

  function previewTemplate() {
    alert("Pré-visualização do modelo (placeholder).")
  }

  function downloadCert(certId: string) {
    setCerts((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, lastDownloadAt: new Date().toISOString() } : c))
    )
    alert(`Download do certificado ${certId} (placeholder).`)
  }

  function revokeCert(certId: string) {
    setCerts((prev) => prev.map((c) => (c.id === certId ? { ...c, status: "REVOKED" } : c)))
  }

  function validateQR() {
    const t = qrInput.trim()
    if (!t) return
    const found = certs.find((c) => c.qrToken === t) ?? null
    setQrResult(found)
  }

  function copyToken(t: string) {
    navigator.clipboard?.writeText(t).catch(() => {})
    alert("Token copiado (placeholder).")
  }

  const certsForProject = useMemo(() => {
    if (!selectedProjectId) return []
    return certs
      .filter((c) => c.projectId === selectedProjectId)
      .slice()
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
  }, [certs, selectedProjectId])

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Certificados • PROPESQ</title>
      </Helmet>

      <Link
        to="/adm/monitoring/replacements"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm  text-primary hover:bg-neutral-50 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para substituições
      </Link>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <BadgeCheck size={14} />
              Certificados
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Certificados</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Gere PDFs com QR Code de autenticidade para participantes por{" "}
                <span className="font-semibold text-primary">projeto</span> (filtro opcional) e valide tokens.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setMode("qr")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                ${mode === "qr" ? "bg-primary text-white border-primary" : "bg-white text-primary border-neutral-light hover:bg-neutral-50"}
              `}
            >
              <RefreshCcw size={16} />
              Verificar QR
            </button>

            <button
              onClick={() => setMode("pdf")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors
                ${mode === "pdf" ? "bg-primary text-white" : "bg-white text-primary border border-neutral-light hover:bg-neutral-50"}
              `}
            >
              <FileText size={16} />
              Gerar PDFs
            </button>
          </div>
        </div>
      </div>

      {mode === "pdf" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Config + seleção */}
          <div className="lg:col-span-7 space-y-4">
            <Section title="Configuração" icon={<BadgeCheck size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Filtro principal (pessoa)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="relative md:col-span-1">
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none"
                      />
                      <select
                        value={personField}
                        onChange={(e) => setPersonField(e.target.value as any)}
                        className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="NAME">Nome</option>
                        <option value="CPF">CPF</option>
                        <option value="REG">Matrícula</option>
                      </select>
                    </div>

                    <div className="relative md:col-span-2">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                      <input
                        value={personQuery}
                        onChange={(e) => setPersonQuery(e.target.value)}
                        className="w-full border border-neutral-light rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Digite nome, CPF ou matrícula…"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral mt-1">
                    Esse é o filtro principal. Os filtros de edital/projeto abaixo são opcionais (para refinar).
                  </p>
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-neutral mb-1">Idioma</span>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PT_BR">PT-BR</option>
                    <option value="EN">EN</option>
                  </select>
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Edital (opcional)</span>
                  <div className="relative">
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none"
                    />
                    <select
                      value={selectedCallId}
                      onChange={(e) => {
                        const v = e.target.value
                        setSelectedCallId(v)
                        // Se o projeto selecionado não pertence ao edital, limpa
                        if (v && selectedProjectId) {
                          const proj = projects.find((p) => p.id === selectedProjectId)
                          if (proj && proj.callId !== v) setSelectedProjectId("")
                        }
                        clearSelection()
                      }}
                      className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todos</option>
                      {calls
                        .slice()
                        .sort((a, b) => b.baseYear - a.baseYear)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} • {c.baseYear}
                          </option>
                        ))}
                    </select>
                  </div>
                </label>

                <label className="text-sm">
                  <span className="block text-xs text-neutral mb-1">Projeto (opcional)</span>
                  <div className="relative">
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none"
                    />
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value)
                        clearSelection()
                      }}
                      className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todos</option>
                      {projectsForSelectedCall.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} {p.center ? `• ${p.center}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Tipo de certificado (papel)</span>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as Role)
                      clearSelection()
                    }}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ALUNO">Aluno</option>
                    <option value="ORIENTADOR">Orientador</option>
                    <option value="AVALIADOR">Avaliador</option>
                  </select>
                </label>

                <div className="md:col-span-1 flex gap-3 items-end">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeCurrent} onChange={() => setIncludeCurrent((v) => !v)} />
                    <span className="text-neutral">Atuais</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includePast} onChange={() => setIncludePast((v) => !v)} />
                    <span className="text-neutral">Passados</span>
                  </label>
                </div>

                <div className="md:col-span-3 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start gap-2">
                  <Info size={16} className="mt-0.5 text-neutral" />
                  <p className="text-xs text-neutral">
                    O gerador deve emitir um PDF por participante e inserir um QR Code com token de autenticidade.
                    A validação deve permitir checar o projeto e o edital relacionados.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-col md:flex-row">
                <button
                  onClick={generatePDFs}
                  disabled={!canGenerate}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-white inline-flex items-center gap-2 justify-center
                    ${!canGenerate ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
                  `}
                >
                  <FileText size={16} />
                  Gerar PDFs ({selectedKeys.length || 0})
                </button>
                <button
                  onClick={previewTemplate}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light inline-flex items-center gap-2 justify-center"
                >
                  <Eye size={16} />
                  Pré-visualizar modelo
                </button>
                <button
                  onClick={() => alert("Gerar para todos (placeholder).")}
                  disabled={filteredHits.length === 0}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light inline-flex items-center gap-2 justify-center
                    ${filteredHits.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-light"}
                  `}
                >
                  <Users size={16} />
                  Gerar para todos (filtro atual)
                </button>
              </div>
            </Section>

            <Section
              title="Participantes (resultado do filtro principal + refinamentos)"
              icon={<Users size={18} />}
              right={
                <button
                  onClick={clearSelection}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                >
                  <RefreshCcw size={16} />
                  Limpar seleção
                </button>
              }
            >
              {filteredHits.length === 0 ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhum participante encontrado para este filtro.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHits.map((h) => {
                    const p = h.participant
                    return (
                      <label
                        key={h.key}
                        className="flex items-start justify-between gap-3 rounded-xl border border-neutral-light p-4 hover:bg-neutral-50"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={!!selectedParticipantKeys[h.key]}
                            onChange={() => toggleParticipant(h.key)}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{p.name}</p>

                            <p className="text-xs text-neutral mt-1">
                              {roleLabel(p.role)}
                              {p.email ? (
                                <>
                                  {" "}
                                  • <span className="font-semibold text-primary">{p.email}</span>
                                </>
                              ) : null}
                            </p>

                            <p className="text-xs text-neutral mt-1">
                              {p.cpf ? (
                                <>
                                  CPF: <span className="font-semibold text-primary">{p.cpf}</span>
                                </>
                              ) : (
                                "CPF: —"
                              )}
                              {" • "}
                              {p.registration ? (
                                <>
                                  Matrícula: <span className="font-semibold text-primary">{p.registration}</span>
                                </>
                              ) : (
                                "Matrícula: —"
                              )}
                            </p>

                            <p className="text-xs text-neutral mt-1">
                              Projeto:{" "}
                              <span className="font-semibold text-primary">
                                {h.projectTitle} {h.projectCenter ? `• ${h.projectCenter}` : ""}
                              </span>
                              {" • "}
                              Edital:{" "}
                              <span className="font-semibold text-primary">
                                {calls.find((c) => c.id === h.callId)?.title ?? "—"}
                              </span>
                            </p>

                            {p.period?.start ? (
                              <p className="text-xs text-neutral mt-1">
                                Período: {p.period.start}
                                {p.period.end ? ` → ${p.period.end}` : " → atual"}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {p.period?.end ? chip("Vivência passada", "neutral") : chip("Vivência atual", "green")}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}

              {selectedProject && (
                <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4">
                  <p className="text-xs text-neutral">Projeto selecionado (refinamento)</p>
                  <p className="text-sm font-semibold text-primary">{selectedProject.title}</p>
                  <p className="text-xs text-neutral mt-1">
                    Edital:{" "}
                    <span className="font-semibold text-primary">
                      {calls.find((c) => c.id === selectedProject.callId)?.title ?? "—"}
                    </span>
                  </p>
                </div>
              )}
            </Section>
          </div>

          {/* Emitidos / histórico */}
          <div className="lg:col-span-5 space-y-4">
            <Section title="Certificados emitidos (por projeto selecionado)" icon={<History size={18} />}>
              {!selectedProjectId ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Selecione um projeto (opcional) para ver certificados emitidos daquele projeto.
                </div>
              ) : certsForProject.length === 0 ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Nenhum certificado emitido ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {certsForProject.map((c) => {
                    const p = (participantsByProject[c.projectId] ?? []).find((x) => x.id === c.participantId)
                    return (
                      <div key={c.id} className="rounded-xl border border-neutral-light p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">{p?.name ?? c.participantId}</p>
                            <p className="text-xs text-neutral mt-1">
                              {roleLabel(c.role)} • {langLabel(c.lang)} • Emitido em {new Date(c.issuedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral mt-1">
                              Token QR: <span className="font-semibold text-primary break-all">{c.qrToken}</span>
                            </p>
                            {c.lastDownloadAt ? (
                              <p className="text-xs text-neutral mt-1">
                                Último download: {new Date(c.lastDownloadAt).toLocaleString()}
                              </p>
                            ) : null}
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-2">
                            {c.status === "ISSUED" ? chip("Emitido", "green") : chip("Revogado", "red")}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadCert(c.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                          >
                            <Download size={16} />
                            Baixar
                          </button>
                          <button
                            onClick={() => copyToken(c.qrToken)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                          >
                            <Copy size={16} />
                            Copiar token
                          </button>
                          {c.status === "ISSUED" ? (
                            <button
                              onClick={() => revokeCert(c.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-700 bg-red-50 hover:opacity-95"
                            >
                              <XCircle size={16} />
                              Revogar
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setCerts((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: "ISSUED" } : x)))
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 text-green-700 bg-green-50 hover:opacity-95"
                            >
                              <CheckCircle2 size={16} />
                              Reativar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Section>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <Section title="Verificação por QR Code" icon={<QrCode size={18} />}>
              <p className="text-sm text-neutral mb-4">
                Valide um certificado usando o token do QR Code e exiba os dados do projeto, edital e participante.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm md:col-span-2">
                  <span className="block text-xs text-neutral mb-1">Token / hash do QR</span>
                  <input
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Cole o token…"
                  />
                </label>

                <button
                  onClick={validateQR}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90 inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Validar
                </button>

                <button
                  onClick={() => {
                    setQrInput("")
                    setQrResult(null)
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light inline-flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={16} />
                  Limpar
                </button>
              </div>

              {/* ImplementaçãO: token deve ser assinado/validado (ex.: JWT / HMAC) e consultar registro de emissão no backend. */}
            </Section>
          </div>

          <div className="lg:col-span-5">
            <Section title="Resultado" icon={<Users size={18} />}>
              {!qrResult ? (
                <div className="rounded-xl border border-neutral-light bg-neutral-50 p-6 text-sm text-neutral text-center">
                  Informe um token para validar.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-neutral-light bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary">Certificado</p>
                        <p className="text-xs text-neutral mt-1 break-all">
                          Token: <span className="font-semibold text-primary">{qrResult.qrToken}</span>
                        </p>
                        <p className="text-xs text-neutral mt-1">
                          Status: {qrResult.status === "ISSUED" ? chip("Válido", "green") : chip("Revogado", "red")}
                        </p>
                        <p className="text-xs text-neutral mt-1">
                          Emitido em {new Date(qrResult.issuedAt).toLocaleString()} • {roleLabel(qrResult.role)} •{" "}
                          {langLabel(qrResult.lang)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const proj = projects.find((p) => p.id === qrResult.projectId) ?? null
                    const call = calls.find((c) => c.id === qrResult.callId) ?? null
                    const part =
                      (participantsByProject[qrResult.projectId] ?? []).find((p) => p.id === qrResult.participantId) ??
                      null

                    return (
                      <>
                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Participante</p>
                          <p className="text-sm text-neutral mt-1">{part?.name ?? "—"}</p>
                          <p className="text-xs text-neutral mt-1">
                            Papel: <span className="font-semibold text-primary">{roleLabel(qrResult.role)}</span>
                          </p>
                          {part?.email ? <p className="text-xs text-neutral mt-1">Email: {part.email}</p> : null}
                          {part?.cpf ? <p className="text-xs text-neutral mt-1">CPF: {part.cpf}</p> : null}
                          {part?.registration ? <p className="text-xs text-neutral mt-1">Matrícula: {part.registration}</p> : null}
                        </div>

                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Projeto</p>
                          <p className="text-sm text-neutral mt-1">{proj?.title ?? "—"}</p>
                          {proj?.center ? <p className="text-xs text-neutral mt-1">Centro: {proj.center}</p> : null}
                        </div>

                        <div className="rounded-xl border border-neutral-light bg-white p-4">
                          <p className="text-sm font-semibold text-primary">Edital</p>
                          <p className="text-sm text-neutral mt-1">{call?.title ?? "—"}</p>
                          <p className="text-xs text-neutral mt-1">Ano-base: {call?.baseYear ?? "—"}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}
