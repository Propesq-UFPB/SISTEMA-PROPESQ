import React from "react";
import { MAX_CHARS_ANEXO_II, cx } from "@/features/work-plans/utils/workPlanFormHelpers";

export const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10";

export const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10";

export function Field({
  label,
  hint,
  children,
  required,
}: Readonly<{
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  icon,
  children,
}: Readonly<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white shadow-sm">
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
  );
}

export function Info({
  label,
  value,
  preWrap,
}: Readonly<{
  label: string;
  value: string;
  preWrap?: boolean;
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
  );
}

export function CharacterCounter({ value }: Readonly<{ value: string }>) {
  const remaining = MAX_CHARS_ANEXO_II - value.length;
  const nearLimit = remaining <= 500;

  return (
    <p
      className={cx(
        "text-right text-[11px]",
        nearLimit ? "font-semibold text-amber-700" : "text-neutral",
      )}
    >
      {value.length}/{MAX_CHARS_ANEXO_II} caracteres
    </p>
  );
}

export function AnexoTextarea({
  value,
  onChange,
  placeholder,
}: Readonly<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}>) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_CHARS_ANEXO_II}
        className={textareaClassName}
        placeholder={placeholder}
      />

      <CharacterCounter value={value} />
    </div>
  );
}
