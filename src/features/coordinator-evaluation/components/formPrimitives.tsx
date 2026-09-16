export const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

export const textareaClassName =
  "min-h-[150px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

export const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

export function TextBlock({
  title,
  text,
}: Readonly<{ title: string; text: string }>) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>

      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral">
        {text}
      </p>
    </div>
  )
}

export function SummaryItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-6 text-primary">
        {value}
      </p>
    </div>
  )
}
