import { FileSignature } from "lucide-react"
import { labelClassName, textareaClassName } from "./formPrimitives"

export function OpinionSection({
  generalOpinion,
  recommendations,
  onGeneralOpinionChange,
  onRecommendationsChange,
}: Readonly<{
  generalOpinion: string
  recommendations: string
  onGeneralOpinionChange: (value: string) => void
  onRecommendationsChange: (value: string) => void
}>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <FileSignature size={20} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            Parecer técnico geral
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral">
            Registre a síntese final da avaliação do projeto e dos planos de
            trabalho vinculados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClassName}>
            Parecer geral <span className="text-red-500">*</span>
          </label>

          <textarea
            value={generalOpinion}
            onChange={(event) => onGeneralOpinionChange(event.target.value)}
            placeholder="Descreva a análise geral do projeto, destacando pontos fortes, fragilidades e justificativa da avaliação."
            className={textareaClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>
            Recomendações ou ajustes sugeridos
          </label>

          <textarea
            value={recommendations}
            onChange={(event) => onRecommendationsChange(event.target.value)}
            placeholder="Informe recomendações metodológicas, correções sugeridas ou observações adicionais."
            className={textareaClassName}
          />
        </div>
      </div>
    </section>
  )
}
