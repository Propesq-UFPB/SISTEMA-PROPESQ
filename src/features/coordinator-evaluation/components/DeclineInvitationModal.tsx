import { useState } from "react"
import { X, XCircle } from "lucide-react"
import type { EvaluationInvitation } from "../types/invitation"

export function DeclineInvitationModal({
  invitation,
  saving,
  error,
  onClose,
  onConfirm,
}: Readonly<{
  invitation: EvaluationInvitation
  saving: boolean
  error: string | null
  onClose: () => void
  onConfirm: (reason: string) => void
}>) {
  const [reason, setReason] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const missing = reason.trim().length === 0

  function submit() {
    setSubmitted(true)
    if (missing) return
    onConfirm(reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-neutral/20 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-primary">Recusar convite de avaliação</h3>
            <p className="mt-1 text-sm text-neutral">
              {invitation.project.code} · {invitation.project.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral/20 p-2 hover:bg-neutral/5"
          >
            <X size={16} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-medium text-primary">Motivo da recusa *</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Ex.: conflito de interesse com a equipe do projeto, indisponibilidade no período..."
            className="w-full rounded-xl border border-neutral/30 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>
        {submitted && missing && (
          <p className="mt-1 text-xs text-red-600">Informe o motivo da recusa.</p>
        )}
        <p className="mt-2 text-xs text-neutral">
          O gestor verá o motivo e o projeto será redistribuído para outro consultor.
        </p>

        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral/20 px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            <XCircle size={16} />
            {saving ? "Enviando..." : "Recusar convite"}
          </button>
        </div>
      </div>
    </div>
  )
}
