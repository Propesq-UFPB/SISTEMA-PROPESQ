import { Bell, Mail } from "lucide-react"
import { EmptyState } from "@/features/evaluation-distribution/components/formPrimitives"
import type { NotifyPreviewItem } from "../types/evaluators"
import { getInitials, roleLabel } from "../utils/evaluatorHelpers"
import { Avatar, Chip, Section, StatusBadge } from "./formPrimitives"

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
      {notifyPreview.length === 0 ? (
        <EmptyState
          icon={<Bell size={24} className="mx-auto" />}
          title="Sem destinatários"
          desc="Nenhum avaliador com pendências para os filtros selecionados."
        />
      ) : (
        <div className="space-y-3">
          {notifyPreview.map(({ evaluator, projects }) => (
            <div
              key={evaluator.id}
              className="rounded-2xl border border-neutral/10 bg-neutral-light/40 p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar initials={getInitials(evaluator.name)} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        {evaluator.name}
                      </p>
                      <p className="truncate text-xs text-neutral">
                        {evaluator.email}
                      </p>
                    </div>
                    <StatusBadge active={evaluator.active} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {evaluator.roles.map((role) => (
                      <Chip key={role}>{roleLabel(role)}</Chip>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-neutral">
                    Pendências:{" "}
                    <span className="font-mono font-semibold text-primary">
                      {projects.map((project) => project.id).join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
