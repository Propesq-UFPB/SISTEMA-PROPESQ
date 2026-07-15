import React, { useCallback, useEffect, useMemo, useState } from "react"
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
import { ApiError } from "@/services/apiClient"
import {
  academicUnitService,
  type AcademicUnit,
} from "@/features/settings/api/academicUnitService"
import {
  departmentService,
  type Department as ApiDepartment,
} from "@/features/settings/api/departmentService"
import {
  editalService,
  type EditalListItem,
} from "@/features/settings/api/editalService"

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

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function mapUnitToCenter(unit: AcademicUnit, departments: Department[] = []): UniversityCenter {
  return {
    id: String(unit.id),
    code: unit.sigla,
    name: unit.nome,
    departments,
  }
}

function mapDept(row: ApiDepartment): Department {
  return {
    id: String(row.id),
    code: row.sigla,
    name: row.nome,
  }
}

function mapEditalToNotice(edital: EditalListItem): Notice {
  return {
    id: String(edital.id),
    title: edital.descricao,
    enabledCenterIds: (edital.unidade_ids ?? []).map(String),
  }
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    const msg = err.message
    if (Array.isArray(msg)) return msg.join(", ")
    return msg || fallback
  }
  return fallback
}

export default function AcademicUnits() {
  const [centers, setCenters] = useState<UniversityCenter[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [selectedNoticeId, setSelectedNoticeId] = useState("")

  const selectedNotice = useMemo(
    () => notices.find((n) => n.id === selectedNoticeId) ?? null,
    [notices, selectedNoticeId],
  )

  const [centerModalOpen, setCenterModalOpen] = useState(false)
  const [centerEditingId, setCenterEditingId] = useState<string | null>(null)
  const [centerCode, setCenterCode] = useState("")
  const [centerName, setCenterName] = useState("")

  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [deptCenterId, setDeptCenterId] = useState("")
  const [deptEditingId, setDeptEditingId] = useState<string | null>(null)
  const [deptCode, setDeptCode] = useState("")
  const [deptName, setDeptName] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const [unitsPage, editaisPage] = await Promise.all([
        academicUnitService.list(200, 0),
        editalService.list(200, 0),
      ])

      const units = unitsPage.results
      const deptLists = await Promise.all(
        units.map((unit) => departmentService.list(unit.id).catch(() => [] as ApiDepartment[])),
      )

      const nextCenters = units.map((unit, index) =>
        mapUnitToCenter(unit, deptLists[index].map(mapDept)),
      )
      const nextNotices = editaisPage.results.map(mapEditalToNotice)

      setCenters(nextCenters)
      setNotices(nextNotices)
      setSelectedNoticeId((prev) => {
        if (prev && nextNotices.some((n) => n.id === prev)) return prev
        return nextNotices[0]?.id ?? ""
      })
      setExpanded((prev) => {
        if (Object.keys(prev).length > 0) return prev
        const first = nextCenters[0]?.id
        return first ? { [first]: true } : {}
      })
    } catch (err) {
      setLoadError(errorMessage(err, "Não foi possível carregar unidades acadêmicas."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const q = normalize(query)

  const filteredCenters = useMemo(() => {
    if (!q) return centers

    return centers
      .map((c) => {
        const centerMatch = normalize(c.code).includes(q) || normalize(c.name).includes(q)
        const deps = c.departments.filter(
          (d) => normalize(d.name).includes(q) || normalize(d.code).includes(q),
        )

        if (centerMatch) return c
        if (deps.length > 0) return { ...c, departments: deps }
        return null
      })
      .filter(Boolean) as UniversityCenter[]
  }, [centers, q])

  const enabledSet = useMemo(
    () => new Set(selectedNotice?.enabledCenterIds ?? []),
    [selectedNotice],
  )
  const enabledCountInNotice = selectedNotice?.enabledCenterIds.length ?? 0

  const totalDepartments = useMemo(() => {
    return centers.reduce((acc, center) => acc + center.departments.length, 0)
  }, [centers])

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
    return c.departments.some(
      (d) => normalize(d.name) === normalize(name) && d.id !== deptEditingId,
    )
  }, [deptModalOpen, deptCenterId, deptName, deptEditingId, centers])

  function toggleExpand(centerId: string) {
    setExpanded((prev) => ({ ...prev, [centerId]: !prev[centerId] }))
  }

  async function persistNoticeUnits(noticeId: string, enabledCenterIds: string[]) {
    setSaving(true)
    setActionError(null)

    try {
      await editalService.setAcademicUnits(
        Number(noticeId),
        enabledCenterIds.map(Number),
      )
      setNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, enabledCenterIds } : n)),
      )
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível atualizar a habilitação do edital."))
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  async function toggleCenterInNotice(centerId: string) {
    if (!selectedNotice || saving) return

    const has = selectedNotice.enabledCenterIds.includes(centerId)
    const next = has
      ? selectedNotice.enabledCenterIds.filter((id) => id !== centerId)
      : [...selectedNotice.enabledCenterIds, centerId]

    await persistNoticeUnits(selectedNotice.id, next)
  }

  async function enableAllInNotice() {
    if (!selectedNotice || saving) return
    await persistNoticeUnits(
      selectedNotice.id,
      centers.map((c) => c.id),
    )
  }

  async function disableAllInNotice() {
    if (!selectedNotice || saving) return
    await persistNoticeUnits(selectedNotice.id, [])
  }

  function openCreateCenter() {
    setActionError(null)
    setCenterEditingId(null)
    setCenterCode("")
    setCenterName("")
    setCenterModalOpen(true)
  }

  function openEditCenter(c: UniversityCenter) {
    setActionError(null)
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

  async function saveCenter() {
    const code = centerCode.trim().toUpperCase()
    const name = centerName.trim()

    if (!code || !name || saving) return
    if (centerCodeError || centerNameError) return

    setSaving(true)
    setActionError(null)

    try {
      if (centerEditingId) {
        const updated = await academicUnitService.update(Number(centerEditingId), {
          sigla: code,
          nome: name,
        })
        setCenters((prev) =>
          prev.map((c) =>
            c.id === centerEditingId
              ? { ...c, code: updated.sigla, name: updated.nome }
              : c,
          ),
        )
      } else {
        const created = await academicUnitService.create({ sigla: code, nome: name })
        const mapped = mapUnitToCenter(created, [])
        setCenters((prev) => [...prev, mapped])
        setExpanded((prev) => ({ ...prev, [mapped.id]: true }))
      }
      closeCenterModal()
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível salvar o centro."))
    } finally {
      setSaving(false)
    }
  }

  async function deleteCenter(centerId: string) {
    if (saving) return
    if (!window.confirm("Excluir este centro universitário?")) return

    setSaving(true)
    setActionError(null)

    try {
      await academicUnitService.remove(Number(centerId))
      setCenters((prev) => prev.filter((c) => c.id !== centerId))
      setNotices((prev) =>
        prev.map((n) => ({
          ...n,
          enabledCenterIds: n.enabledCenterIds.filter((id) => id !== centerId),
        })),
      )
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível excluir o centro."))
    } finally {
      setSaving(false)
    }
  }

  function openCreateDept(centerId: string) {
    setActionError(null)
    setDeptCenterId(centerId)
    setDeptEditingId(null)
    setDeptCode("")
    setDeptName("")
    setDeptModalOpen(true)
  }

  function openEditDept(centerId: string, d: Department) {
    setActionError(null)
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

  async function saveDept() {
    const code = deptCode.trim().toUpperCase()
    const name = deptName.trim()

    if (!deptCenterId || !code || !name || saving) return
    if (deptCodeError || deptNameError) return

    setSaving(true)
    setActionError(null)

    try {
      const unitId = Number(deptCenterId)

      if (deptEditingId) {
        const updated = await departmentService.update(unitId, Number(deptEditingId), {
          sigla: code,
          nome: name,
        })
        const mapped = mapDept(updated)
        setCenters((prev) =>
          prev.map((c) =>
            c.id !== deptCenterId
              ? c
              : {
                  ...c,
                  departments: c.departments.map((d) =>
                    d.id === deptEditingId ? mapped : d,
                  ),
                },
          ),
        )
      } else {
        const created = await departmentService.create(unitId, { sigla: code, nome: name })
        const mapped = mapDept(created)
        setCenters((prev) =>
          prev.map((c) =>
            c.id !== deptCenterId
              ? c
              : { ...c, departments: [...c.departments, mapped] },
          ),
        )
        setExpanded((prev) => ({ ...prev, [deptCenterId]: true }))
      }

      closeDeptModal()
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível salvar o departamento."))
    } finally {
      setSaving(false)
    }
  }

  async function deleteDept(centerId: string, deptId: string) {
    if (saving) return
    if (!window.confirm("Excluir este departamento?")) return

    setSaving(true)
    setActionError(null)

    try {
      await departmentService.remove(Number(centerId), Number(deptId))
      setCenters((prev) =>
        prev.map((c) =>
          c.id === centerId
            ? { ...c, departments: c.departments.filter((d) => d.id !== deptId) }
            : c,
        ),
      )
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível excluir o departamento."))
    } finally {
      setSaving(false)
    }
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
                Cadastre a estrutura institucional da UFPB e defina, por edital, quais centros
                universitários podem participar.
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
              disabled={loading || saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              Novo centro
            </button>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}{" "}
          <button type="button" className="underline font-semibold" onClick={() => void loadData()}>
            Tentar novamente
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

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
            disabled
            title="Importação em massa fora do escopo atual"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary/40 cursor-not-allowed"
          >
            <Upload size={16} />
            Importar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Centros</p>
            <p className="text-lg font-bold text-primary">{loading ? "…" : centers.length}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Departamentos</p>
            <p className="text-lg font-bold text-primary">{loading ? "…" : totalDepartments}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Habilitados no edital</p>
            <p className="text-lg font-bold text-primary">{loading ? "…" : enabledCountInNotice}</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            A habilitação é feita por centro universitário. Os departamentos herdam o status do
            centro no edital selecionado.
          </p>
        </div>
      </section>

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
              disabled={loading || notices.length === 0}
              className="rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            >
              {notices.length === 0 ? (
                <option value="">Nenhum edital disponível</option>
              ) : (
                notices.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              onClick={() => void enableAllInNotice()}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:opacity-95 disabled:opacity-50"
              disabled={!selectedNotice || centers.length === 0 || saving}
            >
              Habilitar todos
            </button>

            <button
              type="button"
              onClick={() => void disableAllInNotice()}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 disabled:opacity-50"
              disabled={!selectedNotice || centers.length === 0 || saving}
            >
              Desabilitar todos
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-sm text-neutral">
            Neste edital:{" "}
            <span className="font-semibold text-primary">{enabledCountInNotice}</span> centro(s)
            habilitado(s).
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
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-neutral">
                    Carregando…
                  </td>
                </tr>
              ) : centers.length === 0 ? (
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
                        <p className="text-xs text-neutral">
                          {c.departments.length} departamento(s)
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => void toggleCenterInNotice(c.id)}
                          disabled={!selectedNotice || saving}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border
                            ${
                              !selectedNotice || saving
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
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-neutral">
                    Carregando…
                  </td>
                </tr>
              ) : filteredCenters.length === 0 ? (
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
                                <span
                                  className={
                                    enabled ? "text-primary font-semibold" : "text-neutral"
                                  }
                                >
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
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold disabled:opacity-50"
                            >
                              <Plus size={16} />
                              Novo dep.
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditCenter(c)}
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold disabled:opacity-50"
                            >
                              <Pencil size={16} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => void deleteCenter(c.id)}
                              disabled={saving}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold disabled:opacity-50"
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
                              <div className="text-sm text-neutral">
                                Nenhum departamento cadastrado.
                              </div>
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
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold disabled:opacity-50"
                                      >
                                        <Pencil size={16} />
                                        Editar
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => void deleteDept(c.id, d.id)}
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold disabled:opacity-50"
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
                onClick={() => void saveCenter()}
                disabled={
                  saving ||
                  !centerCode.trim() ||
                  !centerName.trim() ||
                  centerCodeError ||
                  centerNameError
                }
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    saving ||
                    !centerCode.trim() ||
                    !centerName.trim() ||
                    centerCodeError ||
                    centerNameError
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-primary hover:opacity-95"
                  }`}
              >
                <Check size={16} />
                {saving ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                {deptCodeError && (
                  <p className="text-xs text-red-600">Código já existe neste centro.</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs text-neutral">Nome do departamento</label>
                <input
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Ex.: Departamento de Ciência da Computação"
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                {deptNameError && (
                  <p className="text-xs text-red-600">Departamento já existe neste centro.</p>
                )}
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
                onClick={() => void saveDept()}
                disabled={
                  saving ||
                  !deptCode.trim() ||
                  !deptName.trim() ||
                  deptCodeError ||
                  deptNameError
                }
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    saving ||
                    !deptCode.trim() ||
                    !deptName.trim() ||
                    deptCodeError ||
                    deptNameError
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-primary hover:opacity-95"
                  }`}
              >
                <Check size={16} />
                {saving ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
