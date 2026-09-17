import { FileText } from "lucide-react"
import type { EvaluationDetail } from "../types/coordinatorEvaluation"
import { TextBlock } from "./formPrimitives"

export function ProjectFullSection({
  evaluation,
}: Readonly<{ evaluation: EvaluationDetail }>) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText size={20} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            Projeto completo para leitura
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral">
            Revise as informações submetidas antes de registrar a pontuação e o
            parecer.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <TextBlock title="Título" text={evaluation.projectTitle} />
        <TextBlock title="Title" text={evaluation.projectTitleEn} />
        <TextBlock title="Área" text={evaluation.area} />
        <TextBlock title="ODS vinculado" text={evaluation.ods} />
        <TextBlock title="Palavras-chave" text={evaluation.keywords} />
        <TextBlock title="Keywords" text={evaluation.keywordsEn} />
        <TextBlock title="Descrição resumida" text={evaluation.summary} />
        <TextBlock title="Abstract" text={evaluation.abstract} />
        <TextBlock
          title="Introdução e justificativa"
          text={evaluation.introduction}
        />
        <TextBlock title="Objetivos" text={evaluation.objectives} />
        <TextBlock title="Metodologia" text={evaluation.methodology} />
        <TextBlock
          title="Resultados esperados"
          text={evaluation.expectedResults}
        />
        <TextBlock title="Cronograma" text={evaluation.schedule} />
        <TextBlock title="Referências" text={evaluation.references} />
        <TextBlock
          title="Observações da submissão"
          text={evaluation.observations}
        />
        <TextBlock
          title="PDF complementar"
          text={evaluation.complementaryPdf}
        />
      </div>
    </section>
  )
}
