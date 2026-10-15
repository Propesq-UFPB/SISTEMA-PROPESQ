import { useEffect, useMemo, useState } from "react"
import { Loader2, X } from "lucide-react"
import { distributionService } from "@/features/evaluation-distribution/api/distributionService"
import { AssignmentStatusBadge } from "@/features/evaluation-distribution/components/AssignmentStatusBadge"
import { formatDate } from "@/features/evaluation-distribution/utils/evaluationDistributionHelpers"
import type { EvaluationInvitation } from "@/features/coordinator-evaluation/types/invitation"
import {
  editalOptions,
  invitationAreaLabel,
  invitationSummary,
} from "@/features/coordinator-evaluation/utils/invitationHelpers"
import { apiErrorMessage } from "../utils/consultantHelpers"

// Painel lateral com os convites de um consultor em todos os editais
export function ConsultantAssignmentsDrawer({
  consultant,
  initialEditalId = null,
  onClose,
}: Readonly<{
  consultant: { id: number; name: string; email?: string }
  initialEditalId?: number | null
  onClose: () => void
}>) {
  const [invitations, setInvitations] = useState<EvaluationInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editalId, setEditalId] = useState<number | null>(initialEditalId)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    distributionService
      .consultantAssignments(consultant.id)
      .then((rows) => {
        if (!cancelled) setInvitations(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, "Não foi possível carregar as atribuições."))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [consultant.id])

  const editais = useMemo(() => editalOptions(invitations), [invitations])
  const visible = invitations.filter((i) => editalId === null || i.edital?.id === editalId)
  const summary = invitationSummary(visible)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-light p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Atribuições do consultor
            </p>
            <h3 className="mt-1 text-lg font-bold text-primary">{consultant.name}</h3>
            {consultant.email && <p className="text-xs text-neutral">{consultant.email}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg border border-neutral-light p-2 hover:bg-neutral-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-neutral">Edital</span>
            <select
              value={editalId ?? ""}
              onChange={(event) => setEditalId(event.target.value ? Number(event.target.value) : null)}
              className="h-10 w-full rounded-xl border border-neutral/20 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="">Todos os editais</option>
              {editais.map((edital) => (
                <option key={edital.id} value={edital.id}>
                  {edital.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Pendentes", value: summary.convites },
              { label: "Aceitos", value: summary.aguardando },
              { label: "Avaliados", value: summary.realizadas },
              { label: "Recusados", value: summary.recusadas },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-light bg-neutral-50 p-3">
                <p className="text-lg font-bold text-primary">{item.value}</p>
                <p className="text-[11px] text-neutral">{item.label}</p>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <p className="flex items-center gap-2 text-sm text-neutral">
              <Loader2 size={16} className="animate-spin" />
              Carregando atribuições...
            </p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-neutral">Nenhuma atribuição encontrada.</p>
          ) : (
            <ul className="space-y-3">
              {visible.map((invitation) => (
                <li key={invitation.id} className="rounded-2xl border border-neutral-light p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">{invitation.project.code}</p>
                      <p className="text-sm font-semibold text-neutral-dark">
                        {invitation.project.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral">
                        {invitationAreaLabel(invitation)}
                        {invitation.edital && ` · ${invitation.edital.label}`}
                      </p>
                    </div>
                    <AssignmentStatusBadge status={invitation.status} hasGrades={invitation.hasGrades} />
                  </div>
                  <p className="mt-2 text-xs text-neutral">
                    Convite em {formatDate(invitation.sentAt)}
                    {invitation.answeredAt && ` · respondido em ${formatDate(invitation.answeredAt)}`}
                  </p>
                  {invitation.status === "RECUSADO" && invitation.reason && (
                    <p className="mt-1 text-xs text-red-700">Motivo: {invitation.reason}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
