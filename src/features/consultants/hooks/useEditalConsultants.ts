import { useCallback, useEffect, useMemo, useState } from "react"
import { consultantService } from "../api/consultantService"
import type { Consultant, EditalConsultant } from "../types/consultant"
import { apiErrorMessage } from "../utils/consultantHelpers"

export function useEditalConsultants(editalId: number | null) {
  const [linked, setLinked] = useState<EditalConsultant[]>([])
  const [active, setActive] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (editalId === null) return
    setLoading(true)
    setError(null)
    try {
      const [linkedRows, activeRows] = await Promise.all([
        consultantService.listByEdital(editalId),
        consultantService.listAll({ ativo: true }),
      ])
      setLinked(linkedRows)
      setActive(activeRows)
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar os consultores do edital."))
    } finally {
      setLoading(false)
    }
  }, [editalId])

  useEffect(() => {
    setLinked([])
    void load()
  }, [load])

  // Consultores ativos que ainda não estão vinculados ao edital
  const available = useMemo(() => {
    const linkedIds = new Set(linked.map((consultant) => consultant.id))
    return active.filter((consultant) => !linkedIds.has(consultant.id))
  }, [active, linked])

  async function run(action: () => Promise<unknown>, fallback: string) {
    if (editalId === null) return
    setSaving(true)
    setError(null)
    try {
      await action()
      setLinked(await consultantService.listByEdital(editalId))
    } catch (err) {
      setError(apiErrorMessage(err, fallback))
    } finally {
      setSaving(false)
    }
  }

  function add(consultantId: number) {
    return run(
      () => consultantService.addToEdital(editalId!, consultantId),
      "Não foi possível vincular o consultor.",
    )
  }

  function addAll() {
    return run(
      () =>
        consultantService.setEditalConsultants(editalId!, [
          ...linked.map((consultant) => consultant.id),
          ...available.map((consultant) => consultant.id),
        ]),
      "Não foi possível vincular os consultores.",
    )
  }

  function remove(consultantId: number) {
    return run(
      () => consultantService.removeFromEdital(editalId!, consultantId),
      "Não foi possível desvincular o consultor.",
    )
  }

  return { linked, available, loading, saving, error, add, addAll, remove, reload: load }
}
