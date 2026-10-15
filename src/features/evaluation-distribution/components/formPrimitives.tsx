import type { ReactNode } from "react"

export function SummaryCard({
  label,
  value,
  icon,
}: Readonly<{
  label: string
  value: number
  icon: ReactNode
}>) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className="mt-1 text-xl font-bold text-neutral-dark">{value}</p>
    </div>
  )
}

export function SectionTitle({
  icon,
  title,
  subtitle,
}: Readonly<{
  icon: ReactNode
  title: string
  subtitle?: string
}>) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-primary">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export function MetricCard({
  label,
  value,
  icon,
  warning,
}: Readonly<{
  label: string
  value: number
  icon: ReactNode
  warning?: boolean
}>) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warning
          ? "border-amber-100 bg-amber-50 text-amber-800"
          : "border-neutral/10 bg-neutral-light/60 text-neutral-dark"
      }`}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-primary">
        {icon}
      </div>

      <p className="text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

export function TableHead({
  children,
  align = "left",
}: Readonly<{
  children: ReactNode
  align?: "left" | "right"
}>) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

export function TableCell({
  children,
  align = "left",
}: Readonly<{
  children: ReactNode
  align?: "left" | "right"
}>) {
  return (
    <td
      className={`px-4 py-3 text-xs text-neutral ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  )
}

export function SmallBadge({
  children,
  className = "bg-neutral-light text-neutral",
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  desc,
  success,
}: Readonly<{
  icon: ReactNode
  title: string
  desc: string
  success?: boolean
}>) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/60 p-6 text-center">
      <div className={success ? "text-emerald-600" : "text-neutral"}>
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-neutral-dark">{title}</h3>

      <p className="mt-1 text-sm text-neutral">{desc}</p>
    </div>
  )
}
