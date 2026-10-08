import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { LoaderCircle, X } from "lucide-react"
import type { EvaluationCriterion } from "@/features/evaluation-criteria/api/evaluationCriteriaService"
import {
  criterionToForm,
  emptyCriterionForm,
  validateCriterionForm,
  type CriterionFormErrors,
  type CriterionFormValues,
} from "@/features/evaluation-criteria/utils/criterionForm"

const inputClass =
  "w-full rounded-xl border border-neutral/20 bg-white px-3 py-2.5 text-sm text-neutral-dark outline-none transition focus:border-primary"

export function CriterionFormModal({
  editing,
  saving,
  formError,
  onClose,
  onSubmit,
}: Readonly<{
  editing: EvaluationCriterion | null
  saving: boolean
  formError: string | null
  onClose: () => void
  onSubmit: (values: CriterionFormValues) => Promise<CriterionFormErrors>
}>) {
  const [values, setValues] = useState<CriterionFormValues>(() =>
    editing ? criterionToForm(editing) : emptyCriterionForm(),
  )
  const [errors, setErrors] = useState<CriterionFormErrors>({})

  useEffect(() => {
    setValues(editing ? criterionToForm(editing) : emptyCriterionForm())
    setErrors({})
  }, [editing])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateCriterionForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const apiFieldErrors = await onSubmit(values)
    if (Object.keys(apiFieldErrors).length > 0) setErrors(apiFieldErrors)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="criterion-form-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral/10 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral/10 p-4">
          <div>
            <h2 id="criterion-form-title" className="text-sm font-bold text-primary">
              {editing ? "Editar critério" : "Novo critério"}
            </h2>
            <p className="mt-1 text-xs text-neutral">
              Nome único. Peso e nota máxima a partir de 0,01.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1 text-neutral hover:bg-neutral-light disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4 p-4">
          <Field label="Nome" error={errors.nome}>
            <input
              className={inputClass}
              value={values.nome}
              maxLength={255}
              onChange={(event) => setValues((prev) => ({ ...prev, nome: event.target.value }))}
              disabled={saving}
            />
          </Field>

          <Field label="Descrição">
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={values.descricao}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, descricao: event.target.value }))
              }
              disabled={saving}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Peso" error={errors.peso}>
              <input
                className={inputClass}
                inputMode="decimal"
                value={values.peso}
                onChange={(event) => setValues((prev) => ({ ...prev, peso: event.target.value }))}
                disabled={saving}
              />
            </Field>
            <Field label="Nota máxima" error={errors.nota_maxima}>
              <input
                className={inputClass}
                inputMode="decimal"
                value={values.nota_maxima}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, nota_maxima: event.target.value }))
                }
                disabled={saving}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-dark">
            <input
              type="checkbox"
              checked={values.ativo}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, ativo: event.target.checked }))
              }
              disabled={saving}
            />
            Ativo
          </label>

          {formError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-neutral/20 px-3 py-2 text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DeactivateCriterionDialog({
  nome,
  saving,
  error,
  onCancel,
  onConfirm,
}: Readonly<{
  nome: string
  saving: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-criterion-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral/10 bg-white shadow-xl"
      >
        <div className="border-b border-neutral/10 p-4">
          <h2 id="deactivate-criterion-title" className="text-sm font-bold text-primary">
            Desativar {nome}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral">
            Novas avaliações passam a exigir exatamente o conjunto de critérios
            ativos. Notas já enviadas permanecem.
          </p>
          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 p-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-neutral/20 px-3 py-2 text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving && <LoaderCircle size={16} className="animate-spin" />}
            {saving ? "Desativando..." : "Desativar"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: Readonly<{
  label: string
  error?: string
  children: ReactNode
}>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-neutral-dark">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </label>
  )
}
