import { useMemo, useState } from "react"
import type {
  EvaluatorRole,
  EvaluatorStatusFilter,
  EvaluatorTypeFilter,
  NotifyRoleMap,
} from "../types/evaluators"
import {
  assignmentsForCall,
  assignmentsMock,
  buildNotifyPreview,
  callsMock,
  countActive,
  countByEvaluator,
  countByType,
  DEFAULT_MAIL_BODY,
  DEFAULT_MAIL_SUBJECT,
  evaluatorsMock,
  filterAndSortEvaluators,
  pendingAssignments,
  projectsMock,
  sortCallsByBaseYear,
} from "../utils/evaluatorHelpers"

export function useGestorEvaluators() {
  const [calls] = useState(callsMock)
  const [selectedCallId, setSelectedCallId] = useState(callsMock[0]?.id ?? "")
  const [evaluators] = useState(evaluatorsMock)
  const [projects] = useState(projectsMock)
  const [assignments] = useState(assignmentsMock)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<EvaluatorTypeFilter>("ALL")
  const [statusFilter, setStatusFilter] = useState<EvaluatorStatusFilter>("ALL")
  const [notifyRole, setNotifyRole] = useState<NotifyRoleMap>({
    INTERNO: true,
    EXTERNO: true,
    VOLUNTARIO: true,
    PROPESQ: true,
  })
  const [mailSubject, setMailSubject] = useState(DEFAULT_MAIL_SUBJECT)
  const [mailBody, setMailBody] = useState(DEFAULT_MAIL_BODY)

  const callsSorted = useMemo(() => sortCallsByBaseYear(calls), [calls])

  const selectedCall = calls.find((call) => call.id === selectedCallId) ?? null

  const selectedCallAssignments = useMemo(
    () => assignmentsForCall(assignments, selectedCallId),
    [assignments, selectedCallId],
  )

  const pendingForCall = useMemo(
    () => pendingAssignments(selectedCallAssignments),
    [selectedCallAssignments],
  )

  const notifyPreview = useMemo(
    () =>
      buildNotifyPreview({
        pending: pendingForCall,
        evaluators,
        projects,
        notifyRole,
      }),
    [pendingForCall, evaluators, projects, notifyRole],
  )

  const pendingCount = pendingForCall.length
  const evaluatorsCount = evaluators.length
  const activeCount = countActive(evaluators)
  const externalCount = countByType(evaluators, "EXTERNO")

  const filteredEvaluators = useMemo(
    () =>
      filterAndSortEvaluators(evaluators, {
        search,
        typeFilter,
        statusFilter,
      }),
    [evaluators, search, typeFilter, statusFilter],
  )

  function countAssignmentsFor(evaluatorId: string) {
    return countByEvaluator(selectedCallAssignments, evaluatorId)
  }

  function countPendingFor(evaluatorId: string) {
    return countByEvaluator(pendingForCall, evaluatorId)
  }

  function toggleNotifyRole(role: EvaluatorRole) {
    setNotifyRole((previous) => ({
      ...previous,
      [role]: !previous[role],
    }))
  }

  function sendPendingNotifications() {
    if (notifyPreview.length === 0) {
      alert("Nenhum avaliador com pendências para os filtros selecionados.")
      return
    }

    alert(`Notificações enviadas para ${notifyPreview.length} avaliador(es).`)
  }

  return {
    selectedCallId,
    setSelectedCallId,
    selectedCall,
    callsSorted,
    selectedCallAssignments,
    evaluators,
    evaluatorsCount,
    activeCount,
    externalCount,
    pendingCount,
    projects,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredEvaluators,
    notifyRole,
    toggleNotifyRole,
    mailSubject,
    setMailSubject,
    mailBody,
    setMailBody,
    notifyPreview,
    sendPendingNotifications,
    countAssignmentsFor,
    countPendingFor,
  }
}
