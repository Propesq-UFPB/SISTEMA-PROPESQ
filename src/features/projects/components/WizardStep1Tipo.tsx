import { AlertCircle, Check, ChevronRight, Layers, Lock } from "lucide-react"
import type { FormState } from "../types/projectFormWizard"
import {
  cx,
  EXTERNAL_PROJECTS_ENABLED,
  formatProjectTypeLabel,
} from "../utils/projectFormHelpers"
import { Card } from "./formPrimitives"

export function WizardStep1Tipo({
  form,
  setForm,
  goNext,
  canGoStep2,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  canGoStep2: boolean
}>) {
  let externalTypeButtonClass = "border-neutral/20 hover:bg-neutral/5"

  if (!EXTERNAL_PROJECTS_ENABLED) {
    externalTypeButtonClass =
      "cursor-not-allowed border-neutral/20 bg-neutral/5 opacity-70"
  } else if (form.gerais.tipo === "externo") {
    externalTypeButtonClass = "border-primary bg-primary/5"
  }

  return (
    <Card
      title="Passo 1 — Tipo de projeto"
      subtitle="Escolha o tipo disponível para iniciar o fluxo."
      icon={<Layers size={18} className="text-primary" />}
    >
      {!EXTERNAL_PROJECTS_ENABLED && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-bold">
              Cadastro de projeto externo temporariamente desativado
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                tipo: "interno",
              },
            }))
          }
          className={cx(
            "rounded-2xl border p-6 text-left transition",
            form.gerais.tipo === "interno"
              ? "border-primary bg-primary/5"
              : "border-neutral/20 hover:bg-neutral/5",
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary">Interno</h3>
            {form.gerais.tipo === "interno" && (
              <Check size={18} className="text-primary" />
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-neutral">
            Projeto vinculado a estruturas internas, como grupo de pesquisa,
            unidade e regras institucionais.
          </p>
        </button>

        <button
          type="button"
          disabled={!EXTERNAL_PROJECTS_ENABLED}
          onClick={() => {
            if (!EXTERNAL_PROJECTS_ENABLED) return

            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                tipo: "externo",
              },
            }))
          }}
          className={cx(
            "rounded-2xl border p-6 text-left transition",
            externalTypeButtonClass,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3
              className={cx(
                "text-base font-bold",
                EXTERNAL_PROJECTS_ENABLED ? "text-primary" : "text-neutral",
              )}
            >
              Externo
            </h3>

            {EXTERNAL_PROJECTS_ENABLED && form.gerais.tipo === "externo" ? (
              <Check size={18} className="text-primary" />
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral">
                <Lock size={12} />
                Desativado
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-neutral">
            Projeto com campos complementares e upload de comprovante de
            aprovação ou financiamento.
          </p>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral">
          {form.gerais.tipo ? (
            <>
              Tipo selecionado:{" "}
              <span className="font-semibold text-primary">
                {formatProjectTypeLabel(form.gerais.tipo)}
              </span>
            </>
          ) : (
            "Selecione um tipo para continuar."
          )}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoStep2}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep2
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
