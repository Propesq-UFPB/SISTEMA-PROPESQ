import { FileUp, Trash2 } from "lucide-react"
import { cx } from "../utils/projectFormHelpers"
import { Field } from "./formPrimitives"

export function FileInputBox({
  label,
  hint,
  file,
  onChange,
  required,
  disabled,
}: Readonly<{
  label: string
  hint?: string
  file: File | null
  onChange: (file: File | null) => void
  required?: boolean
  disabled?: boolean
}>) {
  return (
    <Field label={label} hint={hint} required={required}>
      <label
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition",
          disabled
            ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
            : "border-neutral-light bg-white text-primary hover:border-primary/40 hover:bg-primary/5",
        )}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          disabled={disabled}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <FileUp size={28} />

        <p className="mt-3 text-sm font-semibold">
          {file ? file.name : "Selecionar arquivo PDF"}
        </p>

        <p className="mt-1 text-xs text-neutral">
          {disabled
            ? "Campo indisponível no fluxo atual."
            : "Formato aceito: PDF."}
        </p>
      </label>

      {file && !disabled && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={14} />
          Remover arquivo
        </button>
      )}
    </Field>
  )
}
