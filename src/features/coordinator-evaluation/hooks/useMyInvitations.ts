import { useCallback, useEffect, useMemo, useState } from "react"
import { apiErrorMessage } from "@/features/consultants/utils/consultantHelpers"
import { invitationService } from "../api/invitationService"
import type { EvaluationInvitation } from "../types/invitation"
import {
  EMPTY_FILTERS,
  editalOptions,
  filterInvitations,
  invitationSummary,
  yearOptions,
  type InvitationFilters,
} from "../utils/invitationHelpers"

export function useMyInvitations() {
  const [invitations, setInvitations] = useState<EvaluationInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answering, setAnswering] = useState<number | null>(null)
  const [declining, setDeclining] = useState<EvaluationInvitation | null>(null)
  const [declineError, setDeclineError] = useState<string | null>(null)
  const [filters, setFilters] = useState<InvitationFilters>(EMPTY_FILTERS)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setInvitations(await invitationService.mine())
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar seus convites de avaliação."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => filterInvitations(invitations, filters), [invitations, filters])
  const summary = useMemo(() => invitationSummary(invitations), [invitations])
  const editais = useMemo(() => editalOptions(invitations), [invitations])
  const years = useMemo(() => yearOptions(invitations), [invitations])

  async function accept(invitation: EvaluationInvitation) {
    setAnswering(invitation.id)
    setError(null)
    try {
      await invitationService.accept(invitation.id)
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível aceitar o convite."))
    } finally {
      setAnswering(null)
    }
  }

  function openDecline(invitation: EvaluationInvitation) {
    setDeclineError(null)
    setDeclining(invitation)
  }

  function closeDecline() {
    if (answering !== null) return
    setDeclining(null)
  }

  async function confirmDecline(reason: string) {
    if (!declining) return
    setAnswering(declining.id)
    setDeclineError(null)
    try {
      await invitationService.decline(declining.id, reason)
      setDeclining(null)
      await load()
    } catch (err) {
      setDeclineError(apiErrorMessage(err, "Não foi possível recusar o convite."))
    } finally {
      setAnswering(null)
    }
  }

  return {
    invitations,
    filtered,
    summary,
    editais,
    years,
    loading,
    error,
    answering,
    filters,
    setFilters,
    accept,
    declining,
    declineError,
    openDecline,
    closeDecline,
    confirmDecline,
  }
}
