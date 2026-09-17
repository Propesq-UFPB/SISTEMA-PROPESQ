import { Bell, Filter, Mail } from "lucide-react"
import type { EvaluatorRole, NotifyRoleMap } from "../types/evaluators"
import {
  Chip,
  FieldLabel,
  Section,
  ToggleBox,
} from "./formPrimitives"

const ROLE_TOGGLES: ReadonlyArray<{ role: EvaluatorRole; label: string }> = [
  { role: "INTERNO", label: "Internos" },
  { role: "EXTERNO", label: "Externos" },
  { role: "VOLUNTARIO", label: "Voluntários" },
  { role: "PROPESQ", label: "PROPESQ" },
]

export function NotifyPendingSection({
  notifyPreviewCount,
  onNotify,
  notifyRole,
  onToggleRole,
  mailSubject,
  onMailSubjectChange,
  mailBody,
  onMailBodyChange,
}: Readonly<{
  notifyPreviewCount: number
  onNotify: () => void
  notifyRole: NotifyRoleMap
  onToggleRole: (role: EvaluatorRole) => void
  mailSubject: string
  onMailSubjectChange: (value: string) => void
  mailBody: string
  onMailBodyChange: (value: string) => void
}>) {
  const notifyDisabled = notifyPreviewCount === 0

  return (
    <Section
      title="Notificar pendências"
      description="Envie lembretes para avaliadores ativos que ainda possuem avaliações pendentes no edital selecionado."
      icon={<Bell size={18} />}
      right={
        <button
          type="button"
          onClick={onNotify}
          disabled={notifyDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
            notifyDisabled
              ? "cursor-not-allowed bg-primary/40"
              : "bg-primary hover:brightness-95"
          }`}
        >
          <Mail size={16} />
          Notificar
        </button>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-light bg-neutral-50 p-4">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Filter size={16} />
            Grupos de envio
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {ROLE_TOGGLES.map(({ role, label }) => (
              <ToggleBox
                key={role}
                checked={notifyRole[role]}
                onChange={() => onToggleRole(role)}
                label={label}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-light bg-white p-4">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Mail size={16} />
            Modelo de mensagem
          </p>

          <div className="space-y-3">
            <FieldLabel label="Assunto">
              <input
                value={mailSubject}
                onChange={(event) => onMailSubjectChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-neutral-light bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </FieldLabel>

            <FieldLabel label="Corpo">
              <textarea
                value={mailBody}
                onChange={(event) => onMailBodyChange(event.target.value)}
                rows={8}
                className="w-full rounded-xl border border-neutral-light bg-white px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </FieldLabel>

            <div className="flex flex-wrap gap-2 text-xs text-neutral">
              <Chip>{"{consultor}"}</Chip>
              <Chip>{"{edital}"}</Chip>
              <Chip>{"{projetos}"}</Chip>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
