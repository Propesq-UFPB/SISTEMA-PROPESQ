import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardList,
  Eye,
  Filter,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from "lucide-react"
import { Helmet } from "react-helmet"

type Call = {
  id: string
  title: string
  baseYear: number
  statusLabel: string
}

type Area = {
  id: string
  label: string
  source: "CNPq" | "CNAE"
}

type EvaluatorRole = "INTERNO" | "EXTERNO" | "VOLUNTARIO" | "PROPESQ"

type Evaluator = {
  id: string
  name: string
  email: string
  type: "INTERNO" | "EXTERNO"
  roles: EvaluatorRole[]
  areas: Area[]
  active: boolean
}

type Project = {
  id: string
  title: string
  proponent: string
  members: string[]
  areaHint: string
}

type Assignment = {
  id: string
  callId: string
  projectId: string
  evaluatorId: string
  blind: boolean
  status: "PENDING" | "SUBMITTED"
  dueAt?: string
  lastReminderAt?: string
}

function roleLabel(role: EvaluatorRole) {
  const map: Record<EvaluatorRole, string> = {
    INTERNO: "Interno",
    EXTERNO: "Externo",
    VOLUNTARIO: "Voluntário",
    PROPESQ: "PROPESQ",
  }

  return map[role]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function formatDate(date?: string) {
  if (!date) return "Sem prazo"

  const [year, month, day] = date.split("-")

  if (!year || !month || !day) return "Sem prazo"

  return `${day}/${month}/${year}`
}

function chip(text: string) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-light bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral">
      {text}
    </span>
  )
}

function Section({
  title,
  description,
  icon,
  children,
  right,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 border-b border-neutral-light pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-primary/10 p-2 text-primary">
            {icon}
          </span>

          <div>
            <h2 className="text-base font-bold text-primary">{title}</h2>

            {description ? (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </section>
  )
}

function MetricCard({
  label,
  value,
  helper,
  icon,
  tone = "primary",
}: {
  label: string
  value: string | number
  helper: string
  icon: React.ReactNode
  tone?: "primary" | "success" | "warning" | "danger"
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  }

  return (
    <div className="rounded-2xl border border-neutral-light bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          <p className="mt-1 text-xs leading-5 text-neutral">{helper}</p>
        </div>

        <span className={`rounded-xl p-2 ${toneClass[tone]}`}>
          {icon}
        </span>
      </div>
    </div>
  )
}

function FieldLabel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-xs font-medium text-neutral">
        {label}
      </span>
      {children}
    </label>
  )
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
}) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral ${alignClass[align]}`}
    >
      {children}
    </th>
  )
}

function TableCell({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
}) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-xs text-neutral ${alignClass[align]}`}
    >
      {children}
    </td>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <Check size={12} />
        Ativo
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
      <UserX size={12} />
      Inativo
    </span>
  )
}

function ToggleBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-light bg-white px-3 py-2 text-sm transition hover:border-primary/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
      <span className="text-neutral-dark">{label}</span>
    </label>
  )
}

export default function Evaluators() {
  const [calls] = useState<Call[]>([
    {
      id: "c1",
      title: "PIBIC - Pesquisa",
      baseYear: 2025,
      statusLabel: "Em configuração",
    },
    {
      id: "c2",
      title: "PROBEX - Extensão",
      baseYear: 2024,
      statusLabel: "Encerrado",
    },
  ])

  const [selectedCallId, setSelectedCallId] = useState<string>(
    calls[0]?.id ?? ""
  )

  const [availableAreas] = useState<Area[]>([
    { id: "cnpq_ai", label: "CNPq: Inteligência Artificial", source: "CNPq" },
    { id: "cnpq_cv", label: "CNPq: Visão Computacional", source: "CNPq" },
    { id: "cnpq_ds", label: "CNPq: Ciência de Dados", source: "CNPq" },
    { id: "cnae_it", label: "CNAE: Tecnologia da Informação", source: "CNAE" },
    { id: "cnae_ed", label: "CNAE: Educação", source: "CNAE" },
  ])

  const [evaluators] = useState<Evaluator[]>([
    {
      id: "e1",
      name: "Profa. Ana Souza",
      email: "ana.souza@ufpb.br",
      type: "INTERNO",
      roles: ["INTERNO", "PROPESQ"],
      areas: [availableAreas[0], availableAreas[2]],
      active: true,
    },
    {
      id: "e2",
      name: "Prof. Bruno Lima",
      email: "bruno.lima@externo.org",
      type: "EXTERNO",
      roles: ["EXTERNO"],
      areas: [availableAreas[1]],
      active: true,
    },
    {
      id: "e3",
      name: "Profa. Carla Mendes",
      email: "carla.mendes@ufpb.br",
      type: "INTERNO",
      roles: ["INTERNO", "VOLUNTARIO"],
      areas: [availableAreas[4]],
      active: false,
    },
    {
      id: "e4",
      name: "Prof. Diego Ramos",
      email: "diego.ramos@ufpb.br",
      type: "INTERNO",
      roles: ["INTERNO"],
      areas: [availableAreas[2]],
      active: true,
    },
  ])

  const [projects] = useState<Project[]>([
    {
      id: "P001",
      title: "Detecção de presença com TinyML",
      proponent: "Profa. Ana Souza",
      members: ["Discente João", "Discente Maria"],
      areaHint: "CNPq: Inteligência Artificial",
    },
    {
      id: "P002",
      title: "Otimização de energia em datacenters",
      proponent: "Prof. Diego Ramos",
      members: ["Profa. Carla Mendes", "Discente Luiza"],
      areaHint: "CNPq: Ciência de Dados",
    },
    {
      id: "P003",
      title: "Ambientes virtuais para ensino médio",
      proponent: "Profa. Elisa Nunes",
      members: ["Discente Pedro"],
      areaHint: "CNAE: Educação",
    },
  ])

  const [assignments] = useState<Assignment[]>([
    {
      id: "a1",
      callId: "c1",
      projectId: "P002",
      evaluatorId: "e2",
      blind: true,
      status: "PENDING",
      dueAt: "2025-09-20",
    },
    {
      id: "a2",
      callId: "c1",
      projectId: "P003",
      evaluatorId: "e1",
      blind: true,
      status: "SUBMITTED",
      dueAt: "2025-09-18",
    },
    {
      id: "a3",
      callId: "c1",
      projectId: "P001",
      evaluatorId: "e4",
      blind: true,
      status: "PENDING",
      dueAt: "2025-09-20",
    },
  ])

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INTERNO" | "EXTERNO">(
    "ALL"
  )
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL")

  const [notifyRole, setNotifyRole] = useState<Record<EvaluatorRole, boolean>>({
    INTERNO: true,
    EXTERNO: true,
    VOLUNTARIO: true,
    PROPESQ: true,
  })

  const [mailSubject, setMailSubject] = useState(
    "Pendências de avaliação — {edital}"
  )

  const [mailBody, setMailBody] = useState(
    `Prezado(a) {consultor},

Solicitamos sua atenção para as pendências de avaliação no edital {edital}.

Projetos pendentes:
{projetos}

Acesse o sistema para concluir a avaliação dentro do prazo.

Atenciosamente,
PROPESQ`
  )

  const selectedCall = calls.find((call) => call.id === selectedCallId) ?? null

  const selectedCallAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) => assignment.callId === selectedCallId
    )
  }, [assignments, selectedCallId])

  const pendingAssignments = useMemo(() => {
    return selectedCallAssignments.filter(
      (assignment) => assignment.status === "PENDING"
    )
  }, [selectedCallAssignments])

  const submittedAssignments = useMemo(() => {
    return selectedCallAssignments.filter(
      (assignment) => assignment.status === "SUBMITTED"
    )
  }, [selectedCallAssignments])

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id) ?? null
  }

  const countAssignmentsByEvaluator = (evaluatorId: string) => {
    return selectedCallAssignments.filter(
      (assignment) => assignment.evaluatorId === evaluatorId
    ).length
  }

  const countPendingByEvaluator = (evaluatorId: string) => {
    return pendingAssignments.filter(
      (assignment) => assignment.evaluatorId === evaluatorId
    ).length
  }

  const filteredEvaluators = useMemo(() => {
    const q = search.trim().toLowerCase()

    return evaluators
      .filter((evaluator) => {
        if (typeFilter !== "ALL" && evaluator.type !== typeFilter) return false
        if (statusFilter === "ACTIVE" && !evaluator.active) return false
        if (statusFilter === "INACTIVE" && evaluator.active) return false

        if (!q) return true

        return (
          evaluator.name.toLowerCase().includes(q) ||
          evaluator.email.toLowerCase().includes(q) ||
          evaluator.areas.some((area) =>
            area.label.toLowerCase().includes(q)
          ) ||
          evaluator.roles.some((role) =>
            roleLabel(role).toLowerCase().includes(q)
          )
        )
      })
      .sort(
        (a, b) =>
          Number(b.active) - Number(a.active) ||
          a.name.localeCompare(b.name)
      )
  }, [evaluators, search, typeFilter, statusFilter])

  const notifyPreview = useMemo(() => {
    const enabledRoles = (Object.keys(notifyRole) as EvaluatorRole[]).filter(
      (role) => notifyRole[role]
    )

    const map = new Map<string, { evaluator: Evaluator; projects: Project[] }>()

    pendingAssignments.forEach((assignment) => {
      const evaluator = evaluators.find(
        (item) => item.id === assignment.evaluatorId
      )
      const project = getProject(assignment.projectId)

      if (!evaluator || !project) return
      if (!evaluator.active) return
      if (!evaluator.roles.some((role) => enabledRoles.includes(role))) return

      if (!map.has(evaluator.id)) {
        map.set(evaluator.id, {
          evaluator,
          projects: [],
        })
      }

      map.get(evaluator.id)!.projects.push(project)
    })

    return Array.from(map.values()).sort((a, b) =>
      a.evaluator.name.localeCompare(b.evaluator.name)
    )
  }, [pendingAssignments, notifyRole, evaluators])

  function sendPendingNotifications() {
    if (notifyPreview.length === 0) {
      alert("Nenhum avaliador com pendências para os filtros selecionados.")
      return
    }

    alert(`Notificações enviadas para ${notifyPreview.length} avaliador(es).`)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Avaliadores • PROPESQ</title>
      </Helmet>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="rounded-3xl border border-neutral-light bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="mt-2 text-2xl font-bold text-primary">
                  Avaliadores
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Consulte, acompanhe e organize o banco de avaliadores internos,
                  externos, voluntários e consultores vinculados à PROPESQ.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Avaliadores cadastrados"
                value={evaluators.length}
                helper="Total no banco de avaliadores"
                icon={<Users size={18} />}
              />

              <MetricCard
                label="Ativos"
                value={evaluators.filter((evaluator) => evaluator.active).length}
                helper="Disponíveis para avaliação"
                icon={<UserCheck size={18} />}
                tone="success"
              />

              <MetricCard
                label="Externos"
                value={
                  evaluators.filter((evaluator) => evaluator.type === "EXTERNO")
                    .length
                }
                helper="Consultores de fora da instituição"
                icon={<ShieldCheck size={18} />}
              />

              <MetricCard
                label="Pendências"
                value={pendingAssignments.length}
                helper="Avaliações ainda não submetidas"
                icon={<AlertCircle size={18} />}
                tone={pendingAssignments.length > 0 ? "warning" : "success"}
              />
            </div>
          </header>

          <section className="rounded-2xl border border-neutral-light bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <FieldLabel label="Edital em acompanhamento">
                <div className="relative">
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                  />

                  <select
                    value={selectedCallId}
                    onChange={(event) => setSelectedCallId(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-neutral-light bg-white px-3 pr-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    {calls
                      .slice()
                      .sort((a, b) => b.baseYear - a.baseYear)
                      .map((call) => (
                        <option key={call.id} value={call.id}>
                          {call.title} • {call.baseYear} • {call.statusLabel}
                        </option>
                      ))}
                  </select>
                </div>
              </FieldLabel>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="mt-0.5 text-blue-700" />

                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      {selectedCall?.title ?? "Edital não selecionado"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-800/80">
                      {selectedCall?.baseYear ?? "—"} •{" "}
                      {selectedCall?.statusLabel ?? "—"} •{" "}
                      {selectedCallAssignments.length} avaliação(ões)
                      vinculada(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Section
            title="Banco de avaliadores"
            description="Lista de avaliadores cadastrados, com área de atuação, tipo, vínculo, status e carga no edital selecionado."
            icon={<Users size={18} />}
            right={
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <div className="relative sm:w-72">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar avaliador, e-mail ou área"
                    className="h-11 w-full rounded-xl border border-neutral-light bg-white px-3 pl-9 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value as "ALL" | "INTERNO" | "EXTERNO"
                    )
                  }
                  className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  <option value="ALL">Todos os tipos</option>
                  <option value="INTERNO">Internos</option>
                  <option value="EXTERNO">Externos</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "ALL" | "ACTIVE" | "INACTIVE"
                    )
                  }
                  className="h-11 rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  <option value="ALL">Todos os status</option>
                  <option value="ACTIVE">Ativos</option>
                  <option value="INACTIVE">Inativos</option>
                </select>
              </div>
            }
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-light">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-light">
                  <thead className="bg-neutral-50">
                    <tr>
                      <TableHead>Avaliador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Perfis</TableHead>
                      <TableHead>Áreas</TableHead>
                      <TableHead align="center">Carga</TableHead>
                      <TableHead align="center">Pendentes</TableHead>
                      <TableHead align="center">Status</TableHead>
                      <TableHead align="right">Ações</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-light bg-white">
                    {filteredEvaluators.map((evaluator) => {
                      const load = countAssignmentsByEvaluator(evaluator.id)
                      const pending = countPendingByEvaluator(evaluator.id)

                      return (
                        <tr
                          key={evaluator.id}
                          className="transition hover:bg-neutral-50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {getInitials(evaluator.name)}
                              </div>

                              <div>
                                <p className="font-semibold text-primary">
                                  {evaluator.name}
                                </p>
                                <p className="mt-0.5 text-[11px] text-neutral">
                                  {evaluator.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>{chip(evaluator.type)}</TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {evaluator.roles.map((role) => (
                                <React.Fragment key={role}>
                                  {chip(roleLabel(role))}
                                </React.Fragment>
                              ))}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex max-w-sm flex-wrap gap-1.5">
                              {evaluator.areas.map((area) => (
                                <React.Fragment key={area.id}>
                                  {chip(area.label)}
                                </React.Fragment>
                              ))}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <strong className="text-primary">{load}</strong>
                          </TableCell>

                          <TableCell align="center">
                            {pending > 0 ? (
                              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                {pending}
                              </span>
                            ) : (
                              <span className="text-neutral">0</span>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            <StatusBadge active={evaluator.active} />
                          </TableCell>

                          <TableCell align="right">
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-light text-neutral transition hover:border-primary/30 hover:text-primary"
                              title="Visualizar avaliador"
                            >
                              <Eye size={15} />
                            </button>
                          </TableCell>
                        </tr>
                      )
                    })}

                    {filteredEvaluators.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-sm text-neutral"
                        >
                          Nenhum avaliador encontrado.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Section
              title="Notificar pendências"
              description="Envie lembretes para avaliadores ativos que ainda possuem avaliações pendentes no edital selecionado."
              icon={<Bell size={18} />}
              right={
                <button
                  type="button"
                  onClick={sendPendingNotifications}
                  disabled={notifyPreview.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                    notifyPreview.length === 0
                      ? "cursor-not-allowed bg-primary/40"
                      : "bg-primary hover:brightness-95"
                  }`}
                >
                  <Mail size={16} />
                  Notificar
                </button>
              }
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-light bg-neutral-50 p-4">
                  <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Filter size={16} />
                    Grupos de envio
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <ToggleBox
                      checked={notifyRole.INTERNO}
                      onChange={() =>
                        setNotifyRole((previous) => ({
                          ...previous,
                          INTERNO: !previous.INTERNO,
                        }))
                      }
                      label="Internos"
                    />

                    <ToggleBox
                      checked={notifyRole.EXTERNO}
                      onChange={() =>
                        setNotifyRole((previous) => ({
                          ...previous,
                          EXTERNO: !previous.EXTERNO,
                        }))
                      }
                      label="Externos"
                    />

                    <ToggleBox
                      checked={notifyRole.VOLUNTARIO}
                      onChange={() =>
                        setNotifyRole((previous) => ({
                          ...previous,
                          VOLUNTARIO: !previous.VOLUNTARIO,
                        }))
                      }
                      label="Voluntários"
                    />

                    <ToggleBox
                      checked={notifyRole.PROPESQ}
                      onChange={() =>
                        setNotifyRole((previous) => ({
                          ...previous,
                          PROPESQ: !previous.PROPESQ,
                        }))
                      }
                      label="PROPESQ"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-light bg-white p-4">
                  <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Mail size={16} />
                    Modelo de mensagem
                  </p>

                  <div className="space-y-3">
                    <FieldLabel label="Assunto">
                      <input
                        value={mailSubject}
                        onChange={(event) =>
                          setMailSubject(event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </FieldLabel>

                    <FieldLabel label="Corpo">
                      <textarea
                        value={mailBody}
                        onChange={(event) => setMailBody(event.target.value)}
                        rows={8}
                        className="w-full rounded-xl border border-neutral-light bg-white px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </FieldLabel>

                    <div className="flex flex-wrap gap-2 text-xs text-neutral">
                      {chip("{consultor}")}
                      {chip("{edital}")}
                      {chip("{projetos}")}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="Prévia de notificação"
              description="Avaliadores que receberão lembrete conforme os grupos selecionados."
              icon={<Mail size={18} />}
            >
              <div className="space-y-3">
                {notifyPreview.map(({ evaluator, projects }) => (
                  <div
                    key={evaluator.id}
                    className="rounded-2xl border border-neutral-light bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(evaluator.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-primary">
                              {evaluator.name}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral">
                              {evaluator.email}
                            </p>
                          </div>

                          <StatusBadge active={evaluator.active} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {evaluator.roles.map((role) => (
                            <React.Fragment key={role}>
                              {chip(roleLabel(role))}
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="mt-3 rounded-xl bg-neutral-50 px-3 py-2">
                          <p className="text-xs text-neutral">
                            Pendências:{" "}
                            <span className="font-mono font-semibold text-primary">
                              {projects.map((project) => project.id).join(", ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {notifyPreview.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-light bg-neutral-50 px-4 py-8 text-center">
                    <Bell size={24} className="mx-auto text-neutral" />
                    <p className="mt-2 text-sm font-medium text-neutral">
                      Nenhum avaliador com pendências para os filtros
                      selecionados.
                    </p>
                  </div>
                ) : null}
              </div>
            </Section>
          </div>

          <Section
            title="Avaliações vinculadas ao edital"
            description="Resumo das avaliações já relacionadas ao edital selecionado. A distribuição detalhada deve ficar na página própria de Distribuição."
            icon={<ClipboardList size={18} />}
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-light">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-light">
                  <thead className="bg-neutral-50">
                    <tr>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Avaliador</TableHead>
                      <TableHead align="center">Avaliação cega</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead align="center">Status</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-light bg-white">
                    {selectedCallAssignments.map((assignment) => {
                      const project = getProject(assignment.projectId)
                      const evaluator = evaluators.find(
                        (item) => item.id === assignment.evaluatorId
                      )

                      return (
                        <tr
                          key={assignment.id}
                          className="transition hover:bg-neutral-50"
                        >
                          <TableCell>
                            <div>
                              <p className="font-semibold text-primary">
                                {project?.id ?? assignment.projectId}
                              </p>
                              <p className="mt-0.5 max-w-md truncate text-[11px] text-neutral">
                                {project?.title ?? "Projeto não encontrado"}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-semibold text-primary">
                                {evaluator?.name ??
                                  "Avaliador não encontrado"}
                              </p>
                              <p className="mt-0.5 text-[11px] text-neutral">
                                {evaluator?.email ?? "—"}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            {assignment.blind ? (
                              <span className="font-semibold text-emerald-700">
                                Sim
                              </span>
                            ) : (
                              <span className="font-semibold text-neutral">
                                Não
                              </span>
                            )}
                          </TableCell>

                          <TableCell>{formatDate(assignment.dueAt)}</TableCell>

                          <TableCell align="center">
                            {assignment.status === "SUBMITTED" ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                <Check size={12} />
                                Submetida
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                <AlertCircle size={12} />
                                Pendente
                              </span>
                            )}
                          </TableCell>
                        </tr>
                      )
                    })}

                    {selectedCallAssignments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-sm text-neutral"
                        >
                          Nenhuma avaliação vinculada ao edital selecionado.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}