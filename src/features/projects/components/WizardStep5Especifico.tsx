import { ChevronRight, ClipboardCheck } from "lucide-react"
import type { ResearchGroupLookup } from "../types/project"
import type { FormState } from "../types/projectFormWizard"
import {
  categoriasProjeto,
  cx,
  definicoesPI,
  subcatNivelI,
  subcatNivelII,
} from "../utils/projectFormHelpers"
import {
  Card,
  Field,
  inputClassName,
  selectClassName,
  textareaClassName,
} from "./formPrimitives"

export function WizardStep5Especifico({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep6,
  researchGroups,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep6: boolean
  researchGroups: ResearchGroupLookup[]
}>) {
  return (
    <Card
      title="Passo 5 — Dados específicos"
      subtitle={
        form.gerais.tipo === "interno"
          ? "Campos adicionais para projeto interno."
          : "Campos adicionais para projeto externo."
      }
      icon={<ClipboardCheck size={18} className="text-primary" />}
    >
      {form.gerais.tipo === "interno" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Este projeto está vinculado a algum grupo de pesquisa?"
            required
          >
            <div className="flex gap-4">
              {(["Sim", "Não"] as const).map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center gap-2 text-sm text-primary"
                >
                  <input
                    type="radio"
                    checked={form.interno.vinculadoGrupo === item}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          vinculadoGrupo: item,
                          grupoPesquisa:
                            item === "Não" ? "" : current.interno.grupoPesquisa,
                        },
                      }))
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Grupo de pesquisa"
            required={form.interno.vinculadoGrupo === "Sim"}
          >
            <select
              value={form.interno.grupoPesquisa}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    grupoPesquisa: event.target.value,
                  },
                }))
              }
              disabled={form.interno.vinculadoGrupo !== "Sim"}
              className={cx(
                selectClassName,
                form.interno.vinculadoGrupo !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5",
              )}
            >
              <option value="">Selecione</option>
              {researchGroups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Linha de pesquisa" required>
            <input
              value={form.gerais.linhaPesquisa}
              list="research-group-lines"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gerais: {
                    ...current.gerais,
                    linhaPesquisa: event.target.value,
                  },
                }))
              }
              className={inputClassName}
              placeholder="Informe a linha de pesquisa"
            />
            <datalist id="research-group-lines">
              {researchGroups
                .find((item) => item.id === Number(form.interno.grupoPesquisa))
                ?.linhas.map((linha) => (
                  <option key={linha} value={linha} />
                ))}
            </datalist>
          </Field>

          <Field
            label="Possui protocolo de pesquisa em Comitê de Ética?"
            required
          >
            <div className="flex gap-4">
              {(["Sim", "Não"] as const).map((item) => (
                <label
                  key={item}
                  className="inline-flex items-center gap-2 text-sm text-primary"
                >
                  <input
                    type="radio"
                    checked={form.interno.possuiProtocoloEtica === item}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        interno: {
                          ...current.interno,
                          possuiProtocoloEtica: item,
                          comiteEticaNome:
                            item === "Não"
                              ? ""
                              : current.interno.comiteEticaNome,
                          protocoloEtica:
                            item === "Não"
                              ? ""
                              : current.interno.protocoloEtica,
                        },
                      }))
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Comitê de Ética"
            required={form.interno.possuiProtocoloEtica === "Sim"}
            hint={
              form.interno.possuiProtocoloEtica === "Sim"
                ? "Obrigatório quando possui protocolo."
                : "Campo opcional enquanto não possui protocolo."
            }
          >
            <input
              value={form.interno.comiteEticaNome}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    comiteEticaNome: event.target.value,
                  },
                }))
              }
              disabled={form.interno.possuiProtocoloEtica !== "Sim"}
              className={cx(
                inputClassName,
                form.interno.possuiProtocoloEtica !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5 text-neutral",
              )}
              placeholder="ex.: CEP/HULW, CEP/UFPB"
            />
          </Field>

          <Field
            label="Nº do protocolo"
            required={form.interno.possuiProtocoloEtica === "Sim"}
            hint={
              form.interno.possuiProtocoloEtica === "Sim"
                ? "Obrigatório quando possui protocolo."
                : "Campo opcional enquanto não possui protocolo."
            }
          >
            <input
              value={form.interno.protocoloEtica}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interno: {
                    ...current.interno,
                    protocoloEtica: event.target.value,
                  },
                }))
              }
              disabled={form.interno.possuiProtocoloEtica !== "Sim"}
              className={cx(
                inputClassName,
                form.interno.possuiProtocoloEtica !== "Sim" &&
                  "cursor-not-allowed bg-neutral/5 text-neutral",
              )}
              placeholder="ex.: 1234567"
            />
          </Field>
        </div>
      )}

      {form.gerais.tipo === "externo" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Categoria do projeto" required>
            <select
              value={form.externo.categoriaProjeto}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    categoriaProjeto: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {categoriasProjeto.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoria Nível I" required>
            <select
              value={form.externo.subcategoriaNivelI}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    subcategoriaNivelI: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {subcatNivelI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoria Nível II" required>
            <select
              value={form.externo.subcategoriaNivelII}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    subcategoriaNivelII: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {subcatNivelII.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Definição da propriedade intelectual" required>
            <select
              value={form.externo.definicaoPropriedadeIntelectual}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  externo: {
                    ...current.externo,
                    definicaoPropriedadeIntelectual: event.target.value,
                  },
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {definicoesPI.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Tratamento da produção intelectual do projeto"
              hint="Campo de texto para regras ou observações."
            >
              <textarea
                value={form.externo.tratamentoProducao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    externo: {
                      ...current.externo,
                      tratamentoProducao: event.target.value,
                    },
                  }))
                }
                className={textareaClassName}
                placeholder="Descreva como a produção intelectual será tratada."
              />
            </Field>
          </div>
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
          disabled={!canGoStep6}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep6
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
