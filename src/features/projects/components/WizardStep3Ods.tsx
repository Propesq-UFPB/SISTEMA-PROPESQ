import { getStepValidationErrors } from "../utils/projectFormHelpers"
import { CalendarDays, ChevronRight } from "lucide-react"
import type { FormState, ODS } from "../types/projectFormWizard"
import { cx } from "../utils/projectFormHelpers"
import { Card, Field } from "./formPrimitives"
import { CronogramaPicker } from "./CronogramaPicker"
import { OdsPicker } from "./OdsPicker"

export function WizardStep3Ods({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep4,
  odsOptions,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep4: boolean
  odsOptions: ODS[]
}>) {
  const validationErrors = getStepValidationErrors(form, 3)
  return (
    <Card
      title="Passo 3 — ODS e cronograma"
      subtitle="Cadastre o cronograma do projeto e, se desejar, vincule ODS."
      icon={<CalendarDays size={18} className="text-primary" />}
    >
      <div className="space-y-6">
        <Field label="Objetivos do Desenvolvimento Sustentável" hint="Opcional.">
          <OdsPicker
            value={form.gerais.objetivosDS}
            options={odsOptions}
            onChange={(objetivosDS) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  objetivosDS,
                },
              }))
            }
          />
        </Field>

        <Field
          label="Cronograma" error={validationErrors["Cronograma"]}
          required
          hint="Informe a atividade e selecione a duração dentro do período do projeto."
        >
          <CronogramaPicker
            value={form.gerais.cronograma}
            periodoIni={form.gerais.periodoIni}
            periodoFim={form.gerais.periodoFim}
            onChange={(cronograma) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  cronograma,
                },
              }))
            }
          />
        </Field>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep4}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep4
              ? "bg-primary text-white hover:bg-primary/90"
              : "cursor-not-allowed bg-neutral/10 text-neutral",
          )}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  )
}
