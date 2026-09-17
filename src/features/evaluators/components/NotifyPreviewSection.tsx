import { Bell, Mail } from "lucide-react"
import type { NotifyPreviewItem } from "../types/evaluators"
import { getInitials, roleLabel } from "../utils/evaluatorHelpers"
import { Chip, Section, StatusBadge } from "./formPrimitives"

export function NotifyPreviewSection({
  notifyPreview,
}: Readonly<{
  notifyPreview: NotifyPreviewItem[]
}>) {
  return (
    <Section
      title="Prévia de notificação"
      description="Avaliadores que receberão lembrete conforme os grupos selecionados."
      icon={<Mail size={18} />}
    >
      <div className="space-y-3">
        {notifyPreview.map(({ evaluator, projects }) => (
          <div
            key={evaluator.id}
            className="rounded-2xl border border-neutral-light bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {getInitials(evaluator.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {evaluator.name}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral">
                      {evaluator.email}
                    </p>
                  </div>

                  <StatusBadge active={evaluator.active} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {evaluator.roles.map((role) => (
                    <Chip key={role}>{roleLabel(role)}</Chip>
                  ))}
                </div>

                <div className="mt-3 rounded-xl bg-neutral-50 px-3 py-2">
                  <p className="text-xs text-neutral">
                    Pendências:{" "}
                    <span className="font-mono font-semibold text-primary">
                      {projects.map((project) => project.id).join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifyPreview.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-light bg-neutral-50 px-4 py-8 text-center">
            <Bell size={24} className="mx-auto text-neutral" />
            <p className="mt-2 text-sm font-medium text-neutral">
              Nenhum avaliador com pendências para os filtros
              selecionados.
            </p>
          </div>
        ) : null}
      </div>
    </Section>
  )
}
