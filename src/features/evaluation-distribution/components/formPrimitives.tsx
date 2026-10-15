import type { ReactNode } from "react"

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
