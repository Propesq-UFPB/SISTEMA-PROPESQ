import type { ReactNode } from "react"
import { Check, UserX } from "lucide-react"

const TABLE_ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

type TableAlign = keyof typeof TABLE_ALIGN

export function Chip({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-light bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral">
      {children}
    </span>
  )
}

export function Section({
  title,
  description,
  icon,
  children,
  right,
}: Readonly<{
  title: string
  description?: string
  icon: ReactNode
  children: ReactNode
  right?: ReactNode
}>) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 border-b border-neutral-light pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-primary/10 p-2 text-primary">
            {icon}
          </span>

          <div>
            <h2 className="text-base font-bold text-primary">{title}</h2>

            {description ? (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </section>
  )
}

export function MetricCard({
  label,
  value,
  helper,
  icon,
  tone = "primary",
}: Readonly<{
  label: string
  value: string | number
  helper: string
  icon: ReactNode
  tone?: "primary" | "success" | "warning" | "danger"
}>) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  }

  return (
    <div className="rounded-2xl border border-neutral-light bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          <p className="mt-1 text-xs leading-5 text-neutral">{helper}</p>
        </div>

        <span className={`rounded-xl p-2 ${toneClass[tone]}`}>
          {icon}
        </span>
      </div>
    </div>
  )
}

export function FieldLabel({
  label,
  children,
}: Readonly<{
  label: string
  children: ReactNode
}>) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-xs font-medium text-neutral">
        {label}
      </span>
      {children}
    </label>
  )
}

export function TableHead({
  children,
  align = "left",
}: Readonly<{
  children: ReactNode
  align?: TableAlign
}>) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral ${TABLE_ALIGN[align]}`}
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
  align?: TableAlign
}>) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-xs text-neutral ${TABLE_ALIGN[align]}`}
    >
      {children}
    </td>
  )
}

export function StatusBadge({ active }: Readonly<{ active: boolean }>) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <Check size={12} />
        Ativo
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
      <UserX size={12} />
      Inativo
    </span>
  )
}

export function ToggleBox({
  checked,
  onChange,
  label,
}: Readonly<{
  checked: boolean
  onChange: () => void
  label: string
}>) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-light bg-white px-3 py-2 text-sm transition hover:border-primary/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
      <span className="text-neutral-dark">{label}</span>
    </label>
  )
}
