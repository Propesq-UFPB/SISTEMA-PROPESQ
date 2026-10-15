import { useCallback, useEffect, useMemo, useState } from "react"
import { consultantService } from "../api/consultantService"
import type {
  Consultant,
  ConsultantFormValues,
  ConsultantStatusFilter,
} from "../types/consultant"
import {
  apiErrorMessage,
  areaPathParts,
  normalizeText,
  toConsultantPayload,
} from "../utils/consultantHelpers"

export function useConsultants() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ConsultantStatusFilter>("ACTIVE")

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const list = await consultantService.listAll()
      setConsultants(list)
      return list
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Não foi possível carregar os consultores."))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = normalizeText(query)

    return consultants
      .filter((consultant) => {
        if (statusFilter === "ACTIVE") return consultant.ativo
        if (statusFilter === "INACTIVE") return !consultant.ativo
        return true
      })
      .filter((consultant) => {
        if (!q) return true

        const areaNames = [consultant.areaPrincipal, ...consultant.areasAdicionais]
          .map((area) => areaPathParts(area).join(" "))
          .join(" ")

        return normalizeText(
          `${consultant.user.nome} ${consultant.user.email} ${areaNames}`,
        ).includes(q)
      })
      .sort((a, b) => {
        if (a.ativo !== b.ativo) return a.ativo ? -1 : 1
        return a.user.nome.localeCompare(b.user.nome, "pt-BR")
      })
  }, [consultants, query, statusFilter])

  const stats = useMemo(
    () => ({
      total: consultants.length,
      ativos: consultants.filter((consultant) => consultant.ativo).length,
      propesq: consultants.filter((consultant) => consultant.isPropesq).length,
      voluntarios: consultants.filter((consultant) => consultant.isVoluntario).length,
    }),
    [consultants],
  )

  function replace(updated: Consultant) {
    setConsultants((current) =>
      current.map((consultant) => (consultant.id === updated.id ? updated : consultant)),
    )
  }

  // Retorna true se salvou, para o modal poder fechar
  async function saveConsultant(values: ConsultantFormValues, editingId: number | null) {
    setSaving(true)
    setActionError(null)
    try {
      const payload = toConsultantPayload(values, editingId !== null)
      if (editingId !== null) {
        replace(await consultantService.update(editingId, payload))
      } else {
        const created = await consultantService.create(payload)
        setConsultants((current) => [created, ...current])
      }
      return true
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível salvar o consultor."))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(consultant: Consultant) {
    setActionError(null)
    setNotice(null)
    try {
      replace(await consultantService.update(consultant.id, { ativo: !consultant.ativo }))
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível alterar o status do consultor."))
    }
  }

  async function removeConsultant(consultant: Consultant) {
    setActionError(null)
    setNotice(null)
    try {
      await consultantService.remove(consultant.id)
      const list = await load()
      // O backend apenas desativa consultores que já têm avaliações atribuídas
      if (list?.some((item) => item.id === consultant.id)) {
        setNotice(
          `${consultant.user.nome} já possui avaliações atribuídas e foi desativado em vez de excluído.`,
        )
      }
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível remover o consultor."))
    }
  }

  return {
    consultants,
    filtered,
    stats,
    loading,
    loadError,
    actionError,
    setActionError,
    notice,
    saving,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    saveConsultant,
    toggleActive,
    removeConsultant,
  }
}
