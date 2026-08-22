import { Check, Clock, Info } from "lucide-react";
import type { StatusInicialEdital } from "@/features/editais/types/edital";
import { EditalFormFieldset } from "./EditalFormSections";
import { useEditalForm, type EditalFormProps } from "./useEditalForm";

export type { EditalFormProps };

function okLabel(ok: boolean) {
  return ok ? "OK" : "Pendente";
}

type RegistrationStatusProps = Readonly<{
  status: StatusInicialEdital;
  hasFile: boolean;
  hasDescricao: boolean;
  hasYear: boolean;
  periodsOk: boolean;
}>;

function RegistrationStatusSection({
  status,
  hasFile,
  hasDescricao,
  hasYear,
  periodsOk,
}: RegistrationStatusProps) {
  const isPublished = status === "PUBLICADO";

  return (
    <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <h2 className="text-sm font-semibold text-primary">
            Status do registro
          </h2>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${
            isPublished
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-neutral-50 text-neutral border-neutral-light"
          }`}
        >
          {isPublished ? <Check size={14} /> : <Info size={14} />}
          {isPublished ? "Publicado" : "Rascunho"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-xs text-neutral">PDF</p>
          <p className="text-sm font-semibold text-primary">
            {okLabel(hasFile)}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-xs text-neutral">Descrição</p>
          <p className="text-sm font-semibold text-primary">
            {okLabel(hasDescricao)}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-xs text-neutral">Ano do Edital</p>
          <p className="text-sm font-semibold text-primary">
            {okLabel(hasYear)}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
          <p className="text-xs text-neutral">Períodos</p>
          <p className="text-sm font-semibold text-primary">
            {okLabel(periodsOk)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function EditalForm(props: Readonly<EditalFormProps>) {
  const form = useEditalForm(props);
  const { mode, onCancel } = props;

  return (
    <div className="space-y-6">
      {mode === "create" && (
        <RegistrationStatusSection
          status={form.status === "PUBLICADO" ? "PUBLICADO" : "RASCUNHO"}
          hasFile={form.hasPdf}
          hasDescricao={Boolean(form.descricao.trim())}
          hasYear={Boolean(form.editalYear.trim())}
          periodsOk={form.periodsOk}
        />
      )}

      <EditalFormFieldset form={form} />

      {mode === "edit" && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={form.isSubmitting}
          className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
