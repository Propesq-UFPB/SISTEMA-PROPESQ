import type { ReactNode } from "react"

export function Badge({
  children,
  className = "",
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

export function SummaryCard({
  icon,
  label,
  value,
  description,
}: Readonly<{
  icon: ReactNode
  label: string
  value: string | number
  description?: string
}>) {
  return (
    <div className="rounded-2xl border border-neutral-light bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral/70">{label}</p>
          <strong className="mt-2 block text-2xl font-semibold text-primary">
            {value}
          </strong>
          {description ? (
            <p className="mt-1 text-xs text-neutral/70">{description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}
