import type { YesNo } from "./editalFormLogic";

type YesNoFieldProps = Readonly<{
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  disabled?: boolean;
}>;

export function YesNoField({ label, value, onChange, disabled }: YesNoFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-neutral-light last:border-b-0">
      <span className="text-sm text-primary">
        {label} <span className="text-red-500">*</span>
      </span>

      <div className="flex items-center gap-4 shrink-0">
        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={value === "SIM"}
            disabled={disabled}
            onChange={() => onChange("SIM")}
            className="accent-primary"
          />
          <span>Sim</span>
        </label>

        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={value === "NAO"}
            disabled={disabled}
            onChange={() => onChange("NAO")}
            className="accent-primary"
          />
          <span>Não</span>
        </label>
      </div>
    </div>
  );
}
