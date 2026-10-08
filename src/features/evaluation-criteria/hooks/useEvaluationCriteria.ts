import { useCallback, useEffect, useState } from "react"
import { ApiError } from "@/services/apiClient"
import {
  evaluationCriteriaService,
  type EvaluationCriterion,
  type EvaluationCriterionPage,
} from "@/features/evaluation-criteria/api/evaluationCriteriaService"
import {
  ativoFilterToQuery,
  CRITERIA_PAGE_SIZE,
  toCreatePayload,
  toUpdatePayload,
  validateCriterionForm,
  type AtivoFilter,
  type CriterionFormValues,
} from "@/features/evaluation-criteria/utils/criterionForm"

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    const msg = err.message
    if (Array.isArray(msg)) return msg.join(", ")
    return msg || fallback
  }
  return fallback
}

export function useEvaluationCriteria() {
  const [filter, setFilter] = useState<AtivoFilter>("ativos")
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState<EvaluationCriterionPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<EvaluationCriterion | null>(null)
  const [pendingDeactivate, setPendingDeactivate] = useState<EvaluationCriterion | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await evaluationCriteriaService.list(
        CRITERIA_PAGE_SIZE,
        offset,
        ativoFilterToQuery(filter),
      )
      setPage(data)
    } catch (err) {
      setLoadError(errorMessage(err, "Não foi possível carregar os critérios."))
      setPage(null)
    } finally {
      setLoading(false)
    }
  }, [filter, offset])

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setLoadError(null)
      try {
        const data = await evaluationCriteriaService.list(
          CRITERIA_PAGE_SIZE,
          offset,
          ativoFilterToQuery(filter),
        )
        if (!cancelled) setPage(data)
      } catch (err) {
        if (!cancelled) {
          setLoadError(errorMessage(err, "Não foi possível carregar os critérios."))
          setPage(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [filter, offset])

  function changeFilter(next: AtivoFilter) {
    setFilter(next)
    setOffset(0)
  }

  function openCreate() {
    setEditing(null)
    setActionError(null)
    setFormOpen(true)
  }

  function openEdit(row: EvaluationCriterion) {
    setEditing(row)
    setActionError(null)
    setFormOpen(true)
  }

  function closeForm() {
    if (saving) return
    setFormOpen(false)
    setEditing(null)
    setActionError(null)
  }

  async function submitForm(values: CriterionFormValues) {
    const fieldErrors = validateCriterionForm(values)
    if (Object.keys(fieldErrors).length > 0) return fieldErrors

    setSaving(true)
    setActionError(null)
    try {
      if (editing) {
        await evaluationCriteriaService.update(editing.id, toUpdatePayload(values))
      } else {
        await evaluationCriteriaService.create(toCreatePayload(values))
      }
      setFormOpen(false)
      setEditing(null)
      await load()
      return {}
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível salvar o critério."))
      return {}
    } finally {
      setSaving(false)
    }
  }

  function askDeactivate(row: EvaluationCriterion) {
    setActionError(null)
    setPendingDeactivate(row)
  }

  function cancelDeactivate() {
    if (saving) return
    setPendingDeactivate(null)
    setActionError(null)
  }

  async function confirmDeactivate() {
    if (!pendingDeactivate) return
    setSaving(true)
    setActionError(null)
    try {
      await evaluationCriteriaService.remove(pendingDeactivate.id)
      const wasLastOnPage = (page?.results.length ?? 0) <= 1 && offset > 0
      setPendingDeactivate(null)
      if (wasLastOnPage) {
        setOffset(offset - CRITERIA_PAGE_SIZE)
      } else {
        await load()
      }
    } catch (err) {
      setActionError(errorMessage(err, "Não foi possível desativar o critério."))
    } finally {
      setSaving(false)
    }
  }

  const total = page?.total ?? 0
  const limit = page?.limit ?? CRITERIA_PAGE_SIZE

  return {
    filter,
    changeFilter,
    offset,
    total,
    limit,
    results: page?.results ?? [],
    loading,
    loadError,
    actionError,
    saving,
    formOpen,
    editing,
    pendingDeactivate,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    askDeactivate,
    cancelDeactivate,
    confirmDeactivate,
    goPrev: () => setOffset(Math.max(0, offset - limit)),
    goNext: () => setOffset(offset + limit),
    canPrev: offset > 0,
    canNext: offset + limit < total,
  }
}
