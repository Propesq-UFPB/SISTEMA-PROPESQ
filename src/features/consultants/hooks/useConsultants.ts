import { useCallback, useEffect, useMemo, useState } from "react"
import { consultantService, externalConsultantService } from "../api/consultantService"
import type {
  Consultant,
  ConsultantFormValues,
  ConsultantStatusFilter,
  ConsultantTypeFilter,
  ExternalFormValues,
  ExternalLink,
} from "../types/consultant"
import { toExternalPayload } from "../utils/externalHelpers"
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
  const [typeFilter, setTypeFilter] = useState<ConsultantTypeFilter>("ALL")

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const list = await consultantService.listAll()
      setConsultants(list)
      return list
    } catch (err) {
      setLoadError(apiErrorMessage(err, "Não foi possível carregar os avaliadores."))
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
      .filter((consultant) => typeFilter === "ALL" || consultant.tipo === typeFilter)
      .filter((consultant) => {
        if (!q) return true

        const areaNames = [consultant.areaPrincipal, ...consultant.areasAdicionais]
          .map((area) => areaPathParts(area).join(" "))
          .join(" ")

        return normalizeText(
          `${consultant.user.nome} ${consultant.user.email} ${consultant.externo?.instituicao ?? ""} ${areaNames}`,
        ).includes(q)
      })
      .sort((a, b) => {
        if (a.ativo !== b.ativo) return a.ativo ? -1 : 1
        return a.user.nome.localeCompare(b.user.nome, "pt-BR")
      })
  }, [consultants, query, statusFilter, typeFilter])

  const stats = useMemo(
    () => ({
      total: consultants.length,
      ativos: consultants.filter((consultant) => consultant.ativo).length,
      propesq: consultants.filter((consultant) => consultant.isPropesq).length,
      voluntarios: consultants.filter((consultant) => consultant.isVoluntario).length,
      externos: consultants.filter((consultant) => consultant.tipo === "EXTERNO").length,
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
      setActionError(apiErrorMessage(err, "Não foi possível salvar o avaliador."))
      return false
    } finally {
      setSaving(false)
    }
  }

  // Na criação devolve o link de acesso (exibido uma única vez); null se não salvou
  async function saveExternal(
    values: ExternalFormValues,
    editingId: number | null,
  ): Promise<{ consultant: Consultant; link: ExternalLink | null } | null> {
    setSaving(true)
    setActionError(null)
    try {
      const payload = toExternalPayload(values, editingId !== null)
      if (editingId !== null) {
        const updated = await externalConsultantService.update(editingId, payload)
        replace(updated)
        return { consultant: updated, link: null }
      }
      const { consultant, link } = await externalConsultantService.create(payload)
      setConsultants((current) => [consultant, ...current])
      return { consultant, link }
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível salvar o avaliador externo."))
      return null
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
      setActionError(apiErrorMessage(err, "Não foi possível alterar o status do avaliador."))
    }
  }

  async function removeConsultant(consultant: Consultant) {
    setActionError(null)
    setNotice(null)
    try {
      await consultantService.remove(consultant.id)
      const list = await load()
      // O backend apenas desativa avaliadores que já têm avaliações atribuídas
      if (list?.some((item) => item.id === consultant.id)) {
        setNotice(
          `${consultant.user.nome} já possui avaliações atribuídas e foi desativado em vez de excluído.`,
        )
      }
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível remover o avaliador."))
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
    typeFilter,
    setTypeFilter,
    saveConsultant,
    saveExternal,
    toggleActive,
    removeConsultant,
  }
}
