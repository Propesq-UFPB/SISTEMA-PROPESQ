import React from "react"
import { Check } from "lucide-react"
import { cx } from "../utils/projectFormHelpers"

export const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

export const disabledInputClassName =
  "w-full rounded-xl border border-neutral/30 bg-neutral/5 px-3 py-2.5 text-sm text-neutral outline-none"

export const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

export const textareaClassName =
  "min-h-[140px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

export function Card({
  title,
  subtitle,
  icon,
  children,
}: Readonly<{
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <section className="rounded-2xl border border-neutral-light bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral/20 px-6 py-4">
        {icon}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  )
}

export function Field({
  label,
  hint,
  children,
  required,
  error,
}: Readonly<{
  label: string
  hint?: string
  required?: boolean
  error?: string
  children: React.ReactNode
}>) {
  const errorId = React.useId()
  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={error ? errorId : undefined}
      className={cx("flex flex-col gap-2", error && "[&_input]:border-amber-500 [&_select]:border-amber-500 [&_textarea]:border-amber-500")}
    >
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {error && <p id={errorId} className="text-xs font-medium text-amber-800">{error}</p>}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  )
}

export function CharacterCounter({
  value,
  max,
}: Readonly<{
  value: string
  max: number
}>) {
  const remaining = max - value.length
  const closeToLimit = remaining <= Math.ceil(max * 0.1)

  return (
    <p
      className={cx(
        "text-right text-[11px]",
        closeToLimit ? "text-amber-700" : "text-neutral",
      )}
    >
      {value.length.toLocaleString("pt-BR")} / {max.toLocaleString("pt-BR")}{" "}
      caracteres
    </p>
  )
}

export function StepPill({
  active,
  done,
  children,
}: Readonly<{
  active: boolean
  done: boolean
  children: React.ReactNode
}>) {
  let stateClass = "border-neutral/20 bg-white text-primary"
  if (active) {
    stateClass = "border-primary bg-primary text-white"
  } else if (done) {
    stateClass = "border-green-200 bg-green-50 text-green-700"
  }

  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold",
        stateClass,
      )}
    >
      {done && <Check size={14} />}
      {children}
    </div>
  )
}

export function Info({
  label,
  value,
  preWrap,
}: Readonly<{
  label: string
  value: string
  preWrap?: boolean
}>) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-neutral">{label}</p>

      <p
        className={cx("text-sm text-neutral", preWrap && "whitespace-pre-wrap")}
      >
        {value || "—"}
      </p>
    </div>
  )
}
