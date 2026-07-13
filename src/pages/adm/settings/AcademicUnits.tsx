import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  Upload,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Trash2,
  Pencil,
  BookOpen,
  Settings,
  Info,
} from "lucide-react"

type Department = {
  id: string
  code: string
  name: string
}

type UniversityCenter = {
  id: string
  code: string
  name: string
  departments: Department[]
}

type Notice = {
  id: string
  title: string
  enabledCenterIds: string[]
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export default function AcademicUnits() {
  // ===== Mock (trocar por API depois) =====
  const [centers, setCenters] = useState<UniversityCenter[]>([
    {
      id: "cchla",
      code: "CCHLA",
      name: "Centro de Ciências Humanas, Letras e Artes",
      departments: [
        { id: "dep_hist", code: "HIST", name: "Departamento de História" },
        { id: "dep_letras", code: "LETR", name: "Departamento de Letras" },
      ],
    },
    {
      id: "ci",
      code: "CI",
      name: "Centro de Informática",
      departments: [
        { id: "dep_cc", code: "DCC", name: "Departamento de Ciência da Computação" },
        { id: "dep_si", code: "DSI", name: "Departamento de Sistemas de Informação" },
      ],
    },
    {
      id: "ct",
      code: "CT",
      name: "Centro de Tecnologia",
      departments: [
        { id: "dep_civil", code: "DEC", name: "Departamento de Engenharia Civil" },
        { id: "dep_eletrica", code: "DEE", name: "Departamento de Engenharia Elétrica" },
      ],
    },
  ])

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "ed_2026_01",
      title: "Edital PROPESQ 01/2026",
      enabledCenterIds: ["cchla", "ci"],
    },
    {
      id: "ed_2026_02",
      title: "Edital Inovação 02/2026",
      enabledCenterIds: ["ci", "ct"],
    },
  ])

  // ===== UI State =====
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ cchla: true })

  const [selectedNoticeId, setSelectedNoticeId] = useState(notices[0]?.id ?? "")

  const selectedNotice = useMemo(
    () => notices.find((n) => n.id === selectedNoticeId) ?? null,
    [notices, selectedNoticeId]
  )

  const [importModalOpen, setImportModalOpen] = useState(false)

  // Centro modal
  const [centerModalOpen, setCenterModalOpen] = useState(false)
  const [centerEditingId, setCenterEditingId] = useState<string | null>(null)
  const [centerCode, setCenterCode] = useState("")
  const [centerName, setCenterName] = useState("")

  // Departamento modal
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [deptCenterId, setDeptCenterId] = useState<string>("")
  const [deptEditingId, setDeptEditingId] = useState<string | null>(null)
  const [deptCode, setDeptCode] = useState("")
  const [deptName, setDeptName] = useState("")

  const q = normalize(query)

  const filteredCenters = useMemo(() => {
    if (!q) return centers

    return centers
      .map((c) => {
        const centerMatch = normalize(c.code).includes(q) || normalize(c.name).includes(q)

        const deps = c.departments.filter(
          (d) => normalize(d.name).includes(q) || normalize(d.code).includes(q)
        )

        if (centerMatch) return c
        if (deps.length > 0) return { ...c, departments: deps }

        return null
      })
      .filter(Boolean) as UniversityCenter[]
  }, [centers, q])

  const enabledSet = useMemo(() => new Set(selectedNotice?.enabledCenterIds ?? []), [selectedNotice])
  const enabledCountInNotice = selectedNotice?.enabledCenterIds.length ?? 0

  const totalDepartments = useMemo(() => {
    return centers.reduce((acc, center) => acc + center.departments.length, 0)
  }, [centers])

  // ===== Validations =====
  const centerCodeNorm = normalize(centerCode)
  const centerNameNorm = normalize(centerName)

  const centerCodeError =
    centerCode.trim().length > 0 &&
    centers.some((c) => normalize(c.code) === centerCodeNorm && c.id !== centerEditingId)

  const centerNameError =
    centerName.trim().length > 0 &&
    centers.some((c) => normalize(c.name) === centerNameNorm && c.id !== centerEditingId)

  const deptCodeError = useMemo(() => {
    if (!deptModalOpen || !deptCenterId) return false

    const code = deptCode.trim().toUpperCase()

    if (!code) return false

    const c = centers.find((x) => x.id === deptCenterId)

    if (!c) return false

    return c.departments.some((d) => d.code.toUpperCase() === code && d.id !== deptEditingId)
  }, [deptModalOpen, deptCenterId, deptCode, deptEditingId, centers])

  const deptNameError = useMemo(() => {
    if (!deptModalOpen || !deptCenterId) return false

    const name = deptName.trim()

    if (!name) return false

    const c = centers.find((x) => x.id === deptCenterId)

    if (!c) return false

    return c.departments.some((d) => normalize(d.name) === normalize(name) && d.id !== deptEditingId)
  }, [deptModalOpen, deptCenterId, deptName, deptEditingId, centers])

  // ===== UI helpers =====
  function toggleExpand(centerId: string) {
    setExpanded((prev) => ({ ...prev, [centerId]: !prev[centerId] }))
  }

  // ===== Edital: habilitar/desabilitar centros universitários =====
  function toggleCenterInNotice(centerId: string) {
    if (!selectedNotice) return

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id !== selectedNotice.id) return n

        const has = n.enabledCenterIds.includes(centerId)

        const next = has
          ? n.enabledCenterIds.filter((id) => id !== centerId)
          : [...n.enabledCenterIds, centerId]

        return { ...n, enabledCenterIds: next }
      })
    )

    // TODO: API update edital -> centros habilitados
  }

  function enableAllInNotice() {
    if (!selectedNotice) return

    const all = centers.map((c) => c.id)

    setNotices((prev) => prev.map((n) => (n.id === selectedNotice.id ? { ...n, enabledCenterIds: all } : n)))
  }

  function disableAllInNotice() {
    if (!selectedNotice) return

    setNotices((prev) => prev.map((n) => (n.id === selectedNotice.id ? { ...n, enabledCenterIds: [] } : n)))
  }

  // ===== CRUD Centros =====
  function openCreateCenter() {
    setCenterEditingId(null)
    setCenterCode("")
    setCenterName("")
    setCenterModalOpen(true)
  }

  function openEditCenter(c: UniversityCenter) {
    setCenterEditingId(c.id)
    setCenterCode(c.code)
    setCenterName(c.name)
    setCenterModalOpen(true)
  }

  function closeCenterModal() {
    setCenterModalOpen(false)
    setCenterEditingId(null)
    setCenterCode("")
    setCenterName("")
  }

  function saveCenter() {
    const code = centerCode.trim().toUpperCase()
    const name = centerName.trim()

    if (!code || !name) return
    if (centerCodeError || centerNameError) return

    if (centerEditingId) {
      setCenters((prev) => prev.map((c) => (c.id === centerEditingId ? { ...c, code, name } : c)))
    } else {
      const id = uid("center")

      setCenters((prev) => [...prev, { id, code, name, departments: [] }])
      setExpanded((prev) => ({ ...prev, [id]: true }))
    }

    // TODO: API save center
    closeCenterModal()
  }

  function deleteCenter(centerId: string) {
    setCenters((prev) => prev.filter((c) => c.id !== centerId))

    setNotices((prev) =>
      prev.map((n) => ({
        ...n,
        enabledCenterIds: n.enabledCenterIds.filter((id) => id !== centerId),
      }))
    )

    // TODO: API delete center
  }

  // ===== CRUD Departamentos =====
  function openCreateDept(centerId: string) {
    setDeptCenterId(centerId)
    setDeptEditingId(null)
    setDeptCode("")
    setDeptName("")
    setDeptModalOpen(true)
  }

  function openEditDept(centerId: string, d: Department) {
    setDeptCenterId(centerId)
    setDeptEditingId(d.id)
    setDeptCode(d.code)
    setDeptName(d.name)
    setDeptModalOpen(true)
  }

  function closeDeptModal() {
    setDeptModalOpen(false)
    setDeptCenterId("")
    setDeptEditingId(null)
    setDeptCode("")
    setDeptName("")
  }

  function saveDept() {
    const code = deptCode.trim().toUpperCase()
    const name = deptName.trim()

    if (!deptCenterId) return
    if (!code || !name) return
    if (deptCodeError || deptNameError) return

    setCenters((prev) =>
      prev.map((c) => {
        if (c.id !== deptCenterId) return c

        if (deptEditingId) {
          return {
            ...c,
            departments: c.departments.map((d) => (d.id === deptEditingId ? { ...d, code, name } : d)),
          }
        }

        return {
          ...c,
          departments: [...c.departments, { id: uid("dep"), code, name }],
        }
      })
    )

    // TODO: API save dept
    closeDeptModal()
  }

  function deleteDept(centerId: string, deptId: string) {
    setCenters((prev) =>
      prev.map((c) =>
        c.id === centerId ? { ...c, departments: c.departments.filter((d) => d.id !== deptId) } : c
      )
    )

    // TODO: API delete dept
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Unidades Acadêmicas • PROPESQ</title>
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
              <Building2 size={14} />
              Configurações
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Centros Universitários por Edital</h1>

              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Cadastre ou importe a estrutura institucional da UFPB e defina, por edital,
                quais centros universitários podem participar.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-light bg-neutral-50 px-4 py-2 text-sm font-semibold text-primary">
              <Settings size={16} />
              {centers.length} centros
            </span>

            <button
              type="button"
              onClick={openCreateCenter}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors"
            >
              <Plus size={16} />
              Novo centro
            </button>
          </div>
        </div>
      </div>

      {/* ===== Resumo ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <h2 className="text-sm font-semibold text-primary">Estrutura UFPB</h2>
            </div>

            <p className="text-sm text-neutral">
              Estrutura institucional organizada em centros universitários e departamentos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-95"
          >
            <Upload size={16} />
            Importar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Centros</p>
            <p className="text-lg font-bold text-primary">{centers.length}</p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Departamentos</p>
            <p className="text-lg font-bold text-primary">{totalDepartments}</p>
          </div>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Habilitados no edital</p>
            <p className="text-lg font-bold text-primary">{enabledCountInNotice}</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />

          <p className="text-xs text-neutral">
            A habilitação é feita por centro universitário. Os departamentos herdam o status do centro no edital selecionado.
          </p>
        </div>
      </section>

      {/* ===== Habilitação por Edital ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <h2 className="text-sm font-semibold text-primary">Habilitar Centros no Edital</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <select
              value={selectedNoticeId}
              onChange={(e) => setSelectedNoticeId(e.target.value)}
              className="rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              {notices.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={enableAllInNotice}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:opacity-95"
              disabled={!selectedNotice || centers.length === 0}
            >
              Habilitar todos
            </button>

            <button
              type="button"
              onClick={disableAllInNotice}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
              disabled={!selectedNotice || centers.length === 0}
            >
              Desabilitar todos
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-sm text-neutral">
            Neste edital:{" "}
            <span className="font-semibold text-primary">{enabledCountInNotice}</span>{" "}
            centro(s) habilitado(s).
          </p>

          <p className="text-xs text-neutral mt-1">
            Departamentos não são habilitados individualmente aqui; eles herdam o status do centro.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-light">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Centro</th>
                <th className="text-left font-semibold px-4 py-3 w-[220px]">No edital</th>
              </tr>
            </thead>

            <tbody>
              {centers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-neutral">
                    Nenhum centro cadastrado.
                  </td>
                </tr>
              ) : (
                centers.map((c) => {
                  const enabled = enabledSet.has(c.id)

                  return (
                    <tr key={c.id} className="border-t border-neutral-light">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary">
                          {c.code} — {c.name}
                        </p>

                        <p className="text-xs text-neutral">{c.departments.length} departamento(s)</p>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleCenterInNotice(c.id)}
                          disabled={!selectedNotice}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border
                            ${
                              !selectedNotice
                                ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                                : enabled
                                  ? "border-primary/30 bg-primary/10 text-primary hover:opacity-95"
                                  : "border-neutral-light text-neutral hover:bg-neutral-50"
                            }`}
                        >
                          {enabled ? <Check size={16} /> : <X size={16} />}
                          {enabled ? "Habilitado" : "Desabilitado"}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== Cadastro/Consulta da árvore ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <h2 className="text-sm font-semibold text-primary">Árvore UFPB</h2>
          </div>

          <div className="w-full max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por CCHLA, CI, CT, DCC ou nome..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <p className="mt-1 text-[11px] text-neutral">
              Busca por sigla/nome do centro e por código/nome do departamento.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-light">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Centro / Departamentos</th>
                <th className="text-right font-semibold px-4 py-3 w-[360px]">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredCenters.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-neutral">
                    Nenhum resultado.
                  </td>
                </tr>
              ) : (
                filteredCenters.map((c) => {
                  const isExpanded = expanded[c.id] ?? false
                  const enabled = enabledSet.has(c.id)

                  return (
                    <React.Fragment key={c.id}>
                      <tr className="border-t border-neutral-light">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleExpand(c.id)}
                              className="p-1 rounded-md hover:bg-neutral-50 border border-transparent hover:border-neutral-light"
                              title={isExpanded ? "Recolher" : "Expandir"}
                            >
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <div className="min-w-0">
                              <p className="font-semibold text-primary truncate">
                                {c.code} — {c.name}
                              </p>

                              <p className="text-xs text-neutral">
                                {c.departments.length} departamento(s) • No edital selecionado:{" "}
                                <span className={enabled ? "text-primary font-semibold" : "text-neutral"}>
                                  {enabled ? "Sim" : "Não"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => openCreateDept(c.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
                            >
                              <Plus size={16} />
                              Novo dep.
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditCenter(c)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
                            >
                              <Pencil size={16} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteCenter(c.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold"
                            >
                              <Trash2 size={16} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-t border-neutral-light bg-white">
                          <td colSpan={2} className="px-4 py-3">
                            {c.departments.length === 0 ? (
                              <div className="text-sm text-neutral">Nenhum departamento cadastrado.</div>
                            ) : (
                              <div className="space-y-2">
                                {c.departments.map((d) => (
                                  <div
                                    key={d.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-light p-3"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-primary truncate">
                                        {d.code} — {d.name}
                                      </p>

                                      <p className="text-xs text-neutral">Departamento</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => openEditDept(c.id, d)}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
                                      >
                                        <Pencil size={16} />
                                        Editar
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => deleteDept(c.id, d.id)}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold"
                                      >
                                        <Trash2 size={16} />
                                        Excluir
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= MODAIS ================= */}

      {/* Import */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setImportModalOpen(false)} />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">Importar estrutura UFPB</h3>

                <p className="text-xs text-neutral mt-1">
                  CSV/JSON com campos:{" "}
                  <span className="font-semibold">centerCode</span>,{" "}
                  <span className="font-semibold">centerName</span>,{" "}
                  <span className="font-semibold">departmentCode</span>,{" "}
                  <span className="font-semibold">departmentName</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-primary">Exemplo CSV</p>

                <pre className="mt-2 text-[11px] text-neutral overflow-auto">{`centerCode,centerName,departmentCode,departmentName
CCHLA,Centro de Ciências Humanas, Letras e Artes,HIST,Departamento de História
CI,Centro de Informática,DCC,Departamento de Ciência da Computação
CT,Centro de Tecnologia,DEE,Departamento de Engenharia Elétrica`}</pre>
              </div>

              <div className="rounded-xl border border-dashed border-neutral-light p-4">
                <p className="text-sm font-semibold text-primary">Upload</p>

                <p className="text-xs text-neutral mt-1">
                  Placeholder: conecte aqui seu componente de upload e parse.
                </p>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-95"
                  onClick={() => setImportModalOpen(false)}
                >
                  <Upload size={16} />
                  Selecionar arquivo
                </button>
              </div>

              <p className="text-[11px] text-neutral">
                TODO: mesclar por código do centro e por código do departamento para evitar duplicatas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Center modal */}
      {centerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeCenterModal} />

          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">
                  {centerEditingId ? "Editar centro universitário" : "Novo centro universitário"}
                </h3>

                <p className="text-xs text-neutral mt-1">Ex.: CCHLA, CI, CT...</p>
              </div>

              <button
                type="button"
                onClick={closeCenterModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs text-neutral">Sigla</label>

                <input
                  value={centerCode}
                  onChange={(e) => setCenterCode(e.target.value.toUpperCase())}
                  placeholder="CI"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />

                {centerCodeError && <p className="text-xs text-red-600">Sigla já cadastrada.</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs text-neutral">Nome do centro</label>

                <input
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  placeholder="Centro de Informática"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />

                {centerNameError && <p className="text-xs text-red-600">Nome já cadastrado.</p>}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCenterModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveCenter}
                disabled={!centerCode.trim() || !centerName.trim() || centerCodeError || centerNameError}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !centerCode.trim() || !centerName.trim() || centerCodeError || centerNameError
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

      {/* Dept modal */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeDeptModal} />

          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">
                  {deptEditingId ? "Editar departamento" : "Novo departamento"}
                </h3>

                <p className="text-xs text-neutral mt-1">
                  Centro:{" "}
                  <span className="font-semibold">
                    {centers.find((c) => c.id === deptCenterId)?.code} —{" "}
                    {centers.find((c) => c.id === deptCenterId)?.name}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeptModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs text-neutral">Código</label>

                <input
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                  placeholder="DCC"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />

                {deptCodeError && <p className="text-xs text-red-600">Código já existe neste centro.</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs text-neutral">Nome do departamento</label>

                <input
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Ex.: Departamento de Ciência da Computação"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />

                {deptNameError && <p className="text-xs text-red-600">Departamento já existe neste centro.</p>}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeptModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveDept}
                disabled={!deptCode.trim() || !deptName.trim() || deptCodeError || deptNameError}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !deptCode.trim() || !deptName.trim() || deptCodeError || deptNameError
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