import { useEffect, useState } from "react"
import { consultantService } from "../api/consultantService"
import type { KnowledgeArea, MyEvaluatorAreas } from "../types/consultant"
import { apiErrorMessage } from "../utils/consultantHelpers"

export function useMyEvaluatorAreas(enabled = true) {
  const [areas, setAreas] = useState<MyEvaluatorAreas | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setLoading(true)
    setLoadError(null)
    consultantService
      .myAreas()
      .then((result) => {
        if (!cancelled) setAreas(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(apiErrorMessage(err, "Não foi possível carregar suas áreas de conhecimento."))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  async function save(areaPrincipal: KnowledgeArea, areasAdicionais: KnowledgeArea[]) {
    setSaving(true)
    setSaveError(null)
    try {
      const result = await consultantService.updateMyAreas({
        area_principal_id: areaPrincipal.id,
        areas_adicionais_ids: areasAdicionais
          .map((area) => area.id)
          .filter((id) => id !== areaPrincipal.id),
      })
      setAreas(result)
      return true
    } catch (err) {
      setSaveError(apiErrorMessage(err, "Não foi possível salvar suas áreas de conhecimento."))
      return false
    } finally {
      setSaving(false)
    }
  }

  return { areas, loading, loadError, saving, saveError, save }
}
