import type { ReactNode } from "react"
import { Check, UserX } from "lucide-react"
import {
  SectionTitle,
  SmallBadge,
} from "@/features/evaluation-distribution/components/formPrimitives"

const TABLE_ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

type TableAlign = keyof typeof TABLE_ALIGN

export const INPUT_CLASS =
  "h-10 w-full rounded-xl border border-neutral/20 bg-white px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"

export const PRIMARY_BUTTON_CLASS =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"

export function Chip({ children }: Readonly<{ children: ReactNode }>) {
  return <SmallBadge>{children}</SmallBadge>
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
    <section className="space-y-4 rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <SectionTitle icon={icon} title={title} subtitle={description} />
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </section>
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
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-neutral">
        {label}
      </span>
      {children}
    </label>
  )
}

export function TableWrapper({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-neutral/10">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  )
}

export function TableHeadRow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <thead className="sticky top-0 bg-neutral-light/90 text-neutral">
      <tr>{children}</tr>
    </thead>
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
      className={`whitespace-nowrap px-4 py-2 font-semibold ${TABLE_ALIGN[align]}`}
    >
      {children}
    </th>
  )
}

export function TableRow({ children }: Readonly<{ children: ReactNode }>) {
  return <tr className="border-t border-neutral/10 align-top">{children}</tr>
}

export function TableCell({
  children,
  align = "left",
}: Readonly<{
  children: ReactNode
  align?: TableAlign
}>) {
  return (
    <td className={`px-4 py-2 text-neutral-dark ${TABLE_ALIGN[align]}`}>
      {children}
    </td>
  )
}

export function TableEmptyRow({
  colSpan,
  children,
}: Readonly<{ colSpan: number; children: ReactNode }>) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-4 text-neutral">
        {children}
      </td>
    </tr>
  )
}

export function StatusPill({
  tone,
  icon,
  children,
}: Readonly<{
  tone: "success" | "warning" | "danger"
  icon?: ReactNode
  children: ReactNode
}>) {
  const toneClass = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
  }[tone]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClass}`}
    >
      {icon}
      {children}
    </span>
  )
}

export function StatusBadge({ active }: Readonly<{ active: boolean }>) {
  return active ? (
    <StatusPill tone="success" icon={<Check size={12} />}>
      Ativo
    </StatusPill>
  ) : (
    <StatusPill tone="danger" icon={<UserX size={12} />}>
      Inativo
    </StatusPill>
  )
}

export function Avatar({ initials }: Readonly<{ initials: string }>) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-xs font-bold text-primary">
      {initials}
    </div>
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
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral/15 bg-white px-3 py-2 text-sm transition hover:border-primary/30">
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
