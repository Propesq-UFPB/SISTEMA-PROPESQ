import type { ODS } from "../types/projectFormWizard"
import { cx } from "../utils/projectFormHelpers"

export function OdsPicker({
  value,
  options,
  onChange,
}: Readonly<{
  value: ODS[]
  options: ODS[]
  onChange: (v: ODS[]) => void
}>) {
  const selectedIds = new Set(value.map((item) => item.id))

  function toggle(ods: ODS) {
    if (selectedIds.has(ods.id)) {
      onChange(value.filter((item) => item.id !== ods.id))
      return
    }

    onChange([...value, ods])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((ods) => {
        const selected = selectedIds.has(ods.id)

        return (
          <button
            key={ods.id}
            type="button"
            onClick={() => toggle(ods)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
              selected
                ? "border-primary bg-primary text-white"
                : "border-neutral/20 bg-white text-primary hover:bg-neutral/5",
            )}
          >
            <span
              className={cx(
                "grid h-5 w-5 place-items-center rounded-full border text-[11px]",
                selected
                  ? "border-white/30 bg-white/15"
                  : "border-neutral/20 bg-white",
              )}
            >
              {ods.id}
            </span>

            <span className="text-left">{ods.label}</span>
          </button>
        )
      })}
    </div>
  )
}
