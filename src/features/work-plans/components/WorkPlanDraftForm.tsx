import React from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Hash,
  ListChecks,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react";
import type {
  SelectableProject,
  WorkPlanDraft,
  WorkPlanModalidade,
} from "@/features/work-plans/types/coordinatorWorkPlanForm";
import {
  MAX_CHARS_ANEXO_II,
  cx,
  formatCronogramaDuration,
  modalidadesPlano,
} from "@/features/work-plans/utils/workPlanFormHelpers";
import {
  AnexoTextarea,
  Card,
  CharacterCounter,
  Field,
  Info,
  inputClassName,
  selectClassName,
} from "@/features/work-plans/components/formPrimitives";

export function WorkPlanDraftForm({
  selectedProject,
  existingPlans,
  draft,
  setDraft,
  cronogramaAtividade,
  setCronogramaAtividade,
  cronogramaMesInicio,
  setCronogramaMesInicio,
  cronogramaMesFim,
  setCronogramaMesFim,
  duracaoPeriodoMeses,
  mesesCronogramaDisponiveis,
  canAddCronogramaItem,
  cronogramaDentroDoPeriodo,
  canSavePlan,
  saving,
  saved,
  resetDraft,
  duplicateLastPlan,
  addCronogramaItem,
  removeCronogramaItem,
  clearCronograma,
  savePlan,
}: Readonly<{
  selectedProject: SelectableProject;
  existingPlans: WorkPlanDraft[];
  draft: WorkPlanDraft;
  setDraft: React.Dispatch<React.SetStateAction<WorkPlanDraft>>;
  cronogramaAtividade: string;
  setCronogramaAtividade: (value: string) => void;
  cronogramaMesInicio: number;
  setCronogramaMesInicio: (value: number) => void;
  cronogramaMesFim: number;
  setCronogramaMesFim: (value: number) => void;
  duracaoPeriodoMeses: number;
  mesesCronogramaDisponiveis: number[];
  canAddCronogramaItem: boolean;
  cronogramaDentroDoPeriodo: boolean;
  canSavePlan: boolean;
  saving: boolean;
  saved: boolean;
  resetDraft: () => void;
  duplicateLastPlan: () => void;
  addCronogramaItem: () => void;
  removeCronogramaItem: (cronogramaId: string) => void;
  clearCronograma: () => void;
  savePlan: () => void;
}>) {
  return (
    <>
      <Card
        title="Projeto vinculado"
        subtitle="O plano de trabalho será vinculado ao projeto abaixo."
        icon={<FileText size={18} className="text-primary" />}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Info label="Título" value={selectedProject.titulo} />
          </div>

          <Info label="Código" value={selectedProject.codigo} />
          <Info label="Status" value={selectedProject.status} />
          <Info label="Edital" value={selectedProject.edital} />
          <Info label="Modalidade" value={selectedProject.modalidadeBolsa} />
          <Info label="Coordenador" value={selectedProject.coordenador} />
          <Info label="Período" value={selectedProject.periodo} />
          <Info label="Centro" value={selectedProject.centro} />
          <Info label="Unidade" value={selectedProject.unidade} />
        </div>
      </Card>

      <Card
        title="Planos já vinculados"
        subtitle="Planos já vinculados a este projeto."
        icon={<ListChecks size={18} className="text-primary" />}
      >
        {existingPlans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Nenhum plano vinculado a este projeto.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {existingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="rounded-xl border border-neutral/20 bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">
                      Plano de trabalho {index + 1}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-primary">
                      {plan.titulo}
                    </p>

                    <p className="mt-1 text-xs text-neutral">{plan.title}</p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                        <BookOpen size={12} />
                        {plan.modalidade}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                        <CalendarDays size={12} />
                        {plan.periodoIni} → {plan.periodoFim}
                      </span>

                      {plan.solicitarAcaoAfirmativa && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                          <Hash size={12} />
                          Solicita ação afirmativa
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <Check size={13} />
                    Vinculado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Novo plano de trabalho"
        subtitle="Preencha os campos exigidos pelo Anexo II."
        icon={<Plus size={18} className="text-primary" />}
      >
        <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary">Dados do plano</h3>

            <p className="mt-1 text-xs text-neutral">
              Os campos marcados com asterisco são obrigatórios.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={duplicateLastPlan}
              disabled={existingPlans.length === 0}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                existingPlans.length === 0
                  ? "cursor-not-allowed border-neutral/10 bg-neutral/10 text-neutral"
                  : "border-neutral/20 bg-white text-primary hover:border-primary/30",
              )}
            >
              <Copy size={14} />
              Duplicar estrutura
            </button>

            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
            >
              <RefreshCcw size={14} />
              Limpar
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Modalidade" required>
            <select
              value={draft.modalidade}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  modalidade: event.target.value as WorkPlanModalidade,
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {modalidadesPlano.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Solicitar Ação Afirmativa"
            hint="Marque esta opção quando desejar solicitar ação afirmativa para o plano."
          >
            <label className="flex min-h-[42px] items-center gap-3 rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary">
              <input
                type="checkbox"
                checked={draft.solicitarAcaoAfirmativa}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    solicitarAcaoAfirmativa: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-neutral/30 text-primary focus:ring-primary"
              />

              <span className="font-semibold">
                Solicitar ação afirmativa para este plano
              </span>
            </label>
          </Field>

          <div className="md:col-span-2">
            <Field label="Título" required>
              <input
                value={draft.titulo}
                maxLength={MAX_CHARS_ANEXO_II}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    titulo: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Digite o título do plano"
              />

              <CharacterCounter value={draft.titulo} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Title" required>
              <input
                value={draft.title}
                maxLength={MAX_CHARS_ANEXO_II}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Enter the work plan title in English"
              />

              <CharacterCounter value={draft.title} />
            </Field>
          </div>

          <Field label="Período" required hint="Defina início e fim do plano.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="date"
                value={draft.periodoIni}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    periodoIni: event.target.value,
                  }))
                }
                className={inputClassName}
              />

              <input
                type="date"
                value={draft.periodoFim}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    periodoFim: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </div>
          </Field>

          <div className="md:col-span-2">
            <Field label="Introdução / justificativa" required>
              <AnexoTextarea
                value={draft.introducaoJustificativa}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    introducaoJustificativa: value,
                  }))
                }
                placeholder="Apresente o contexto do plano e a justificativa da atividade."
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Objetivos" required>
              <AnexoTextarea
                value={draft.objetivos}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    objetivos: value,
                  }))
                }
                placeholder="Informe os objetivos gerais e específicos do plano."
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Metodologia" required>
              <AnexoTextarea
                value={draft.metodologia}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    metodologia: value,
                  }))
                }
                placeholder="Descreva os procedimentos, métodos e etapas de execução."
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="Cronograma"
              required
              hint="Informe a atividade, selecione o mês de início e o mês de fim dentro do período definido para o plano."
            >
              <div className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
                {duracaoPeriodoMeses === 0 && (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-semibold text-amber-800">
                      Informe primeiro o período do plano para liberar o
                      cronograma.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_170px_170px_auto]">
                  <input
                    value={cronogramaAtividade}
                    disabled={duracaoPeriodoMeses === 0}
                    maxLength={MAX_CHARS_ANEXO_II}
                    onChange={(event) =>
                      setCronogramaAtividade(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCronogramaItem();
                      }
                    }}
                    className={inputClassName}
                    placeholder="Atividade"
                  />

                  <select
                    value={cronogramaMesInicio}
                    disabled={duracaoPeriodoMeses === 0}
                    onChange={(event) => {
                      const nextMesInicio = Number(event.target.value);
                      setCronogramaMesInicio(nextMesInicio);

                      if (cronogramaMesFim < nextMesInicio) {
                        setCronogramaMesFim(nextMesInicio);
                      }
                    }}
                    className={selectClassName}
                  >
                    {mesesCronogramaDisponiveis.map((mes) => (
                      <option key={mes} value={mes}>
                        Início: mês {mes}
                      </option>
                    ))}
                  </select>

                  <select
                    value={cronogramaMesFim}
                    disabled={duracaoPeriodoMeses === 0}
                    onChange={(event) =>
                      setCronogramaMesFim(Number(event.target.value))
                    }
                    className={selectClassName}
                  >
                    {mesesCronogramaDisponiveis
                      .filter((mes) => mes >= cronogramaMesInicio)
                      .map((mes) => (
                        <option key={mes} value={mes}>
                          Fim: mês {mes}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={addCronogramaItem}
                    disabled={!canAddCronogramaItem}
                    className={cx(
                      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                      canAddCronogramaItem
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "cursor-not-allowed bg-neutral/10 text-neutral",
                    )}
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>

                <p className="mt-2 text-[11px] text-neutral">
                  A duração deve ficar entre o mês 1 e o mês{" "}
                  {duracaoPeriodoMeses || 0}, conforme o período informado para
                  o plano.
                </p>

                {draft.cronogramaAtividades.length > 0 &&
                  !cronogramaDentroDoPeriodo && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                      <p className="text-xs font-semibold text-red-800">
                        Há atividade fora do período do plano. Ajuste o mês de
                        início ou fim para conseguir salvar.
                      </p>
                    </div>
                  )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={clearCronograma}
                    disabled={draft.cronogramaAtividades.length === 0}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition",
                      draft.cronogramaAtividades.length === 0
                        ? "cursor-not-allowed border-neutral/20 bg-neutral/5 text-neutral"
                        : "border-neutral/20 bg-white text-primary hover:border-primary/30",
                    )}
                  >
                    <RefreshCcw size={14} />
                    Limpar cronograma
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {draft.cronogramaAtividades.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral/30 bg-white p-4 text-center">
                      <p className="text-sm font-semibold text-primary">
                        Nenhuma atividade adicionada ao cronograma.
                      </p>

                      <p className="mt-1 text-xs text-neutral">
                        Informe a atividade, selecione a duração e clique em
                        adicionar.
                      </p>
                    </div>
                  ) : (
                    draft.cronogramaAtividades.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-neutral">
                            {formatCronogramaDuration(
                              item.mesInicio,
                              item.mesFim,
                            )}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-primary">
                            {item.atividade}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCronogramaItem(item.id)}
                          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Referências" required>
              <AnexoTextarea
                value={draft.referencias}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    referencias: value,
                  }))
                }
                placeholder="Informe as referências bibliográficas do plano."
              />
            </Field>
          </div>
        </div>

        {saved && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-bold text-green-800">
              Plano adicionado com sucesso!
            </p>

            <p className="mt-1 text-xs text-green-800/80">
              O novo plano foi vinculado ao projeto selecionado.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={resetDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            Limpar formulário
          </button>

          <button
            type="button"
            onClick={savePlan}
            disabled={saving || !canSavePlan}
            className={cx(
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
              saving || !canSavePlan
                ? "cursor-not-allowed bg-neutral/10 text-neutral"
                : "bg-primary text-white hover:bg-primary/90",
            )}
          >
            <Save size={16} />
            {saving ? "Salvando..." : "Adicionar plano ao projeto"}
          </button>
        </div>
      </Card>
    </>
  );
}
