import { getStepValidationErrors } from "../utils/projectFormHelpers"
import { ChevronRight, FileText } from "lucide-react"
import type { EditalLookup } from "@/features/editais"
import type {
  KnowledgeAreaLookup,
  LookupOption,
} from "../types/project"
import type { FormState } from "../types/projectFormWizard"
import { getEditalExecutionPeriod } from "../utils/projectPeriod"
import {
  formatProjectTypeLabel,
  LONG_TEXT_MAX,
  TITLE_MAX,
  cx,
} from "../utils/projectFormHelpers"
import {
  Card,
  CharacterCounter,
  disabledInputClassName,
  Field,
  inputClassName,
  selectClassName,
  textareaClassName,
} from "./formPrimitives"

export function WizardStep2Anexo({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep3,
  editais,
  unidadesAcademicas,
  grandesAreasLookup,
  areasLookup,
  subareasLookup,
  especialidadesLookup,
  submitError,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep3: boolean
  editais: EditalLookup[]
  unidadesAcademicas: LookupOption<number>[]
  grandesAreasLookup: KnowledgeAreaLookup[]
  areasLookup: KnowledgeAreaLookup[]
  subareasLookup: KnowledgeAreaLookup[]
  especialidadesLookup: KnowledgeAreaLookup[]
  submitError: string
}>) {
  const validationErrors = getStepValidationErrors(form, 2)
  return (
    <Card
      title="Passo 2 — Campos do Anexo II"
      subtitle="Preencha os campos principais do projeto em português e inglês."
      icon={<FileText size={18} className="text-primary" />}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Tipo do projeto" error={validationErrors["Tipo do projeto"]} required>
          <input
            value={
              form.gerais.tipo ? formatProjectTypeLabel(form.gerais.tipo) : ""
            }
            readOnly
            className={disabledInputClassName}
            placeholder="Selecione no passo 1"
          />
        </Field>

        <Field label="Edital de pesquisa" error={validationErrors["Edital de pesquisa"]} required>
          <select
            value={form.gerais.editalPesquisa}
            onChange={(event) => {
              const editalId = event.target.value
              const selectedEdital = editais.find(
                (item) => item.id === Number(editalId),
              )
              const period = selectedEdital
                ? getEditalExecutionPeriod(selectedEdital)
                : { periodoIni: "", periodoFim: "" }

              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  editalPesquisa: editalId,
                  ...period,
                },
              }))
            }}
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {editais.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Título" error={validationErrors["Título"]} required hint="">
          <input
            value={form.gerais.titulo}
            maxLength={TITLE_MAX}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  titulo: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="Título do projeto em português"
          />

          <CharacterCounter value={form.gerais.titulo} max={TITLE_MAX} />
        </Field>

        <Field label="Title" error={validationErrors["Title"]} required hint="">
          <input
            value={form.gerais.title}
            maxLength={TITLE_MAX}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  title: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="Project title in English"
          />

          <CharacterCounter value={form.gerais.title} max={TITLE_MAX} />
        </Field>

        <Field
          label="Palavras-chave" error={validationErrors["Palavras-chave"]}
          required
          hint="Separe por vírgula ou ponto e vírgula."
        >
          <input
            value={form.gerais.palavrasChave}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  palavrasChave: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: acessibilidade, IA, educação"
          />
        </Field>

        <Field
          label="Keywords" error={validationErrors["Keywords"]}
          required
          hint="Separe por vírgula ou ponto e vírgula."
        >
          <input
            value={form.gerais.keywords}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  keywords: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: accessibility, AI, education"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Resumo" error={validationErrors["Resumo"]} required>
            <textarea
              value={form.gerais.descricaoResumida}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    descricaoResumida: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Apresente o resumo do projeto."
            />

            <CharacterCounter
              value={form.gerais.descricaoResumida}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Abstract" error={validationErrors["Abstract"]} required>
            <textarea
              value={form.gerais.abstract}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    abstract: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Provide the project abstract in English."
            />

            <CharacterCounter
              value={form.gerais.abstract}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Introdução / justificativa" error={validationErrors["Introdução / justificativa"]} required>
            <textarea
              value={form.gerais.introducaoJustificativa}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    introducaoJustificativa: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Apresente o contexto, problema, relevância e justificativa do projeto."
            />

            <CharacterCounter
              value={form.gerais.introducaoJustificativa}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Objetivos" error={validationErrors["Objetivos"]} required>
            <textarea
              value={form.gerais.objetivos}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    objetivos: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Informe os objetivos gerais e específicos do projeto."
            />

            <CharacterCounter
              value={form.gerais.objetivos}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Metodologia" error={validationErrors["Metodologia"]} required>
            <textarea
              value={form.gerais.metodologia}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    metodologia: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Descreva procedimentos, métodos, etapas, instrumentos e formas de análise."
            />

            <CharacterCounter
              value={form.gerais.metodologia}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Resultados esperados" error={validationErrors["Resultados esperados"]} required>
            <textarea
              value={form.gerais.resultadosEsperados}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    resultadosEsperados: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Descreva os resultados e impactos esperados com a execução do projeto."
            />

            <CharacterCounter
              value={form.gerais.resultadosEsperados}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Referências" error={validationErrors["Referências"]} required>
            <textarea
              value={form.gerais.referencias}
              maxLength={LONG_TEXT_MAX}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    referencias: event.target.value,
                  },
                }))
              }
              className={textareaClassName}
              placeholder="Informe as referências bibliográficas do projeto."
            />

            <CharacterCounter
              value={form.gerais.referencias}
              max={LONG_TEXT_MAX}
            />
          </Field>
        </div>

        <Field label="E-mail de contato" error={validationErrors["E-mail de contato"]} required>
          <input
            type="email"
            value={form.gerais.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  email: event.target.value,
                },
              }))
            }
            className={inputClassName}
            placeholder="ex.: coordenador@ufpb.br"
          />
        </Field>

        <Field
          label="Período do projeto" error={validationErrors["Período do projeto"]}
          required
          hint="Defina início e fim do projeto."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={form.gerais.periodoIni}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    periodoIni: event.target.value,
                  },
                }))
              }
              className={inputClassName}
            />

            <input
              type="date"
              value={form.gerais.periodoFim}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    periodoFim: event.target.value,
                  },
                }))
              }
              className={inputClassName}
            />
          </div>
        </Field>

        <Field label="Unidade" error={validationErrors["Unidade"]} required>
          <select
            value={form.gerais.unidade}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  unidade: event.target.value,
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {unidadesAcademicas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Grande área" error={validationErrors["Grande área"]} required>
          <select
            value={form.gerais.grandeArea}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  grandeArea: event.target.value,
                  area: "",
                  subarea: "",
                  especialidade: "",
                  areaConhecimento: "",
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {grandesAreasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Área" error={validationErrors["Área"]} required>
          <select
            value={form.gerais.area}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  area: event.target.value,
                  subarea: "",
                  especialidade: "",
                  areaConhecimento: String(
                    areasLookup.find((item) => item.name === event.target.value)
                      ?.id ?? "",
                  ),
                },
              }))
            }
            disabled={!form.gerais.grandeArea}
            className={selectClassName}
          >
            <option value="">
              {form.gerais.grandeArea
                ? "Selecione"
                : "Selecione primeiro a grande área"}
            </option>
            {areasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subárea" error={validationErrors["Subárea"]}>
          <select
            value={form.gerais.subarea}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  subarea: event.target.value,
                  especialidade: "",
                  areaConhecimento: String(
                    subareasLookup.find(
                      (item) => item.name === event.target.value,
                    )?.id ?? current.gerais.areaConhecimento,
                  ),
                },
              }))
            }
            disabled={!form.gerais.area}
            className={selectClassName}
          >
            <option value="">
              {form.gerais.area ? "Selecione" : "Selecione primeiro a área"}
            </option>
            {subareasLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Especialidade" error={validationErrors["Especialidade"]}>
          <select
            value={form.gerais.especialidade}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gerais: {
                  ...current.gerais,
                  especialidade: event.target.value,
                  areaConhecimento: String(
                    especialidadesLookup.find(
                      (item) => item.name === event.target.value,
                    )?.id ?? current.gerais.areaConhecimento,
                  ),
                },
              }))
            }
            className={selectClassName}
          >
            <option value="">Selecione</option>
            {especialidadesLookup.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {submitError && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          {submitError}
        </div>
      )}

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
          disabled={!canGoStep3}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep3
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
