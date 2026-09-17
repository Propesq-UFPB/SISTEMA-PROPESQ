import { Save, Send } from "lucide-react"

export function EvaluationActionsBar({
  onSaveDraft,
}: Readonly<{
  onSaveDraft: () => void
}>) {
  return (
    <section className="sticky bottom-0 z-10 -mx-6 border-t border-neutral/20 bg-[#F3F4F6]/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-neutral/30 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Parecer da avaliação
          </p>

          <p className="mt-1 text-xs text-neutral">
            Salve como rascunho ou conclua a avaliação para registrar o
            resultado final.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <Save size={16} />
            Salvar rascunho
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <Send size={16} />
            Concluir avaliação
          </button>
        </div>
      </div>
    </section>
  )
}
