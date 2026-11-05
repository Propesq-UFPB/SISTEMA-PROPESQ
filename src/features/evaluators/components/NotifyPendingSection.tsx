import { Bell, Filter, Mail } from "lucide-react"
import type { EvaluatorRole, NotifyRoleMap } from "../types/evaluators"
import {
  Chip,
  FieldLabel,
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
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
  return (
    <Section
      title="Notificar pendências"
      description="Envie lembretes para avaliadores ativos que ainda possuem avaliações pendentes no edital selecionado."
      icon={<Bell size={18} />}
    >
      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-neutral-dark">
          <Filter size={14} />
          Grupos de envio
        </p>

        <div className="grid grid-cols-2 gap-2">
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

      <div className="space-y-3 border-t border-neutral/10 pt-4">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-dark">
          <Mail size={14} />
          Modelo de mensagem
        </p>

        <FieldLabel label="Assunto">
          <input
            value={mailSubject}
            onChange={(event) => onMailSubjectChange(event.target.value)}
            className={INPUT_CLASS}
          />
        </FieldLabel>

        <FieldLabel label="Corpo">
          <textarea
            value={mailBody}
            onChange={(event) => onMailBodyChange(event.target.value)}
            rows={8}
            className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldLabel>

        <div className="flex flex-wrap gap-2">
          <Chip>{"{consultor}"}</Chip>
          <Chip>{"{edital}"}</Chip>
          <Chip>{"{projetos}"}</Chip>
        </div>
      </div>

      <button
        type="button"
        onClick={onNotify}
        disabled={notifyPreviewCount === 0}
        className={`${PRIMARY_BUTTON_CLASS} w-full`}
      >
        <Mail size={16} />
        Notificar
      </button>
    </Section>
  )
}
