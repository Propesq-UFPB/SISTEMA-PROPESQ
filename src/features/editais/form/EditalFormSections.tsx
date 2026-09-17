import type { RefObject } from "react";
import {
  Upload,
  FileText,
  CalendarRange,
  Save,
  X,
  Check,
  Eye,
  GraduationCap,
  Layers,
  Users,
  SlidersHorizontal,
  ListChecks,
  Building2,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { StatusEdital } from "@/features/editais/types/edital";
import type { EditalFormModel } from "./useEditalForm";
import { EditalValidationField, YesNoField } from "./EditalFormFields";

import { parseDecimal, parseInteger } from "./editalFormLogic";

function pdfSelectionTitle(
  file: File | null,
  existingAnexo: EditalFormModel["existingAnexo"],
): string {
  if (file) return "PDF selecionado";
  if (existingAnexo) return "PDF já enviado";
  return "Clique para selecionar o PDF";
}

function pdfSelectionDescription(
  file: File | null,
  existingAnexo: EditalFormModel["existingAnexo"],
  fileName: string,
  fileSizeMb: number,
): string {
  if (file) return `${fileName} • ${fileSizeMb}MB`;
  if (existingAnexo) return existingAnexo.nome;
  return "Somente PDF • limite sugerido: 25MB";
}

type EditalFormFieldsetProps = Readonly<{
  form: EditalFormModel;
}>;


function LookupError({
  error,
  onRetry,
}: Readonly<{
  error: string | null;
  onRetry: () => void;
}>) {
  if (!error) return null;
  return (
    <p className="mt-1 text-xs text-red-600 flex items-center gap-2 flex-wrap">
      <span>{error}</span>
      <button
        type="button"
        onClick={() => {
          onRetry();
        }}
        className="underline font-semibold"
      >
        Tentar novamente
      </button>
    </p>
  );
}

function EditalPdfSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Upload PDF ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={18} />
            <h2 className="text-sm font-semibold text-primary">
              PDF do Edital
            </h2>
          </div>

          <div className="rounded-lg border border-dashed border-neutral-light p-6">
            <label className="block text-sm text-neutral cursor-pointer">
              <span className="sr-only">
                {form.file
                  ? `PDF selecionado: ${form.fileName}`
                  : "Selecionar PDF do edital"}
              </span>
              <input
                ref={form.inputRef as RefObject<HTMLInputElement>}
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={form.readOnly}
                onChange={(e) => form.onPickFile(e.target.files?.[0] ?? null)}
              />

              <div className="flex items-start justify-between gap-3 flex-col md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-light/60">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-primary">
                      {pdfSelectionTitle(form.file, form.existingAnexo)}
                    </p>

                    <p className="text-xs text-neutral mt-1">
                      {pdfSelectionDescription(
                        form.file,
                        form.existingAnexo,
                        form.fileName,
                        form.fileSizeMb,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(form.file || form.existingAnexo || form.savedEditalId !== null) && (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50"
                        onClick={() => void form.previewPdf()}
                      >
                        <Eye size={16} />
                        Visualizar
                      </button>

                      {form.file && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                          onClick={form.removeFile}
                        >
                          <X size={16} />
                          Remover
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          <EditalValidationField error={!form.readOnly && !form.hasPdf && "Faça upload do PDF do edital para publicar."} />
          {form.fileError && <p className="text-sm text-red-600">{form.fileError}</p>}
        </div>


    </>
  );
}

function EditalDataSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Dados do Edital ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Dados do Edital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EditalValidationField error={!form.readOnly && (!form.editalYear.trim() && "Informe o ano do edital.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Ano do Edital <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.editalYear}
                  onChange={(e) => form.setEditalYear(e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: 2026"
                />
              </label>
            </EditalValidationField>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Código</span>
              <div className="flex gap-2">
                <input
                  value={form.code}
                  onChange={(e) => form.setCode(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: EDITAL_PIBIC_2026"
                />
                <button
                  type="button"
                  onClick={form.autoCodeFromDescricao}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light text-neutral hover:bg-neutral-50 whitespace-nowrap"
                >
                  Gerar
                </button>
              </div>
              <p className="text-[11px] text-neutral mt-1">
                Campo não obrigatório. Pode ficar em branco.
              </p>
            </label>

            <EditalValidationField className="md:col-span-2" error={!form.readOnly && (!form.descricao.trim() && "Informe a descrição do edital.")}>
              <label className="text-sm md:col-span-2">
                <span className="block text-xs text-neutral mb-1">
                  Descrição <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.descricao}
                  onChange={(e) => form.setDescricao(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: PIBIC 2026"
                />
              </label>
            </EditalValidationField>
          </div>
        </div>


    </>
  );
}

function EditalPeriodsSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Períodos ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange size={18} />
            <h2 className="text-sm font-semibold text-primary">Períodos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-neutral mb-1">
                Período de Submissões <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={form.submissionStart}
                  onChange={(e) => form.setSubmissionStart(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-neutral">a</span>
                <input
                  type="date"
                  value={form.submissionEnd}
                  onChange={(e) => form.setSubmissionEnd(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <EditalValidationField error={!form.readOnly && (!form.submissionStart || !form.submissionEnd) && "Informe o período de submissões."} />
              {form.submissionDateError && (
                <p className="text-xs text-red-600 mt-1">
                  {form.submissionDateError}
                </p>
              )}
            </div>

            <div>
              <span className="block text-xs text-neutral mb-1">
                Período de Execução do Projeto{" "}
                <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={form.executionStart}
                  onChange={(e) => form.setExecutionStart(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-neutral">a</span>
                <input
                  type="date"
                  value={form.executionEnd}
                  onChange={(e) => form.setExecutionEnd(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <EditalValidationField error={!form.readOnly && (!form.executionStart || !form.executionEnd) && "Informe o período de execução do projeto."} />
              {form.executionDateError && (
                <p className="text-xs text-red-600 mt-1">
                  {form.executionDateError}
                </p>
              )}
            </div>
          </div>
        </div>


    </>
  );
}

function EditalClassificationSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Classificação e Cotas ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Classificação e Cotas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EditalValidationField error={!form.readOnly && (!form.titulacaoMinima && "Informe a titulação mínima para solicitação de cotas.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Titulação mínima para a solicitação de cotas{" "}
                  <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.titulacaoMinima}
                  onChange={(e) => form.setTitulacaoMinima(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- SELECIONE --</option>
                  <option value="GRADUACAO">Graduação</option>
                  <option value="ESPECIALIZACAO">Especialização</option>
                  <option value="MESTRADO">Mestrado</option>
                  <option value="DOUTORADO">Doutorado</option>
                </select>
              </label>
            </EditalValidationField>

            <EditalValidationField error={!form.readOnly && (!form.periodoCota && "Selecione o período de cota.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Período de Cota <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.periodoCota}
                  onChange={(e) => form.setPeriodoCota(e.target.value)}
                  disabled={form.cotaBolsaLoading || Boolean(form.cotaBolsaError)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                >
                  <option value="">
                    {form.cotaBolsaLoading ? "Carregando..." : "-- SELECIONE --"}
                  </option>
                  {!form.cotaBolsaLoading &&
                    !form.cotaBolsaError &&
                    form.cotaBolsaOptions.length === 0 && (
                      <option value="" disabled>
                        Cadastre uma cota bolsa no backend
                      </option>
                    )}
                  {form.cotaBolsaOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <LookupError error={form.cotaBolsaError} onRetry={form.loadCotaBolsaOptions} />
              </label>
            </EditalValidationField>

            <EditalValidationField error={!form.readOnly && (!form.tipoEdital && "Selecione o tipo de edital.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Tipo Edital <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.tipoEdital}
                  onChange={(e) => form.setTipoEdital(e.target.value)}
                  disabled={form.tipoEditalLoading || Boolean(form.tipoEditalError)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                >
                  {form.tipoEditalLoading && (
                    <option value={form.tipoEdital}>Carregando...</option>
                  )}
                  {!form.tipoEditalLoading && form.tipoEditalOptions.length === 0 && (
                    <option value="PESQUISA">Pesquisa</option>
                  )}
                  {form.tipoEditalOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <LookupError error={form.tipoEditalError} onRetry={form.loadTipoEditalOptions} />
              </label>
            </EditalValidationField>


          </div>
        </div>


    </>
  );
}

function EditalLimitsSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Limites por orientador ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Limites por Orientador
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EditalValidationField error={!form.readOnly && (!form.limiteProjetosOrientador.trim() ? "Informe o limite de solicitações de projetos por orientador." : parseInteger(form.limiteProjetosOrientador) < 0 && "O limite de projetos não pode ser negativo.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Limite de solicitações de projetos por orientador{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.limiteProjetosOrientador}
                  onChange={(e) => form.setLimiteProjetosOrientador(e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </EditalValidationField>

            <EditalValidationField error={!form.readOnly && (!form.limitePlanosOrientador.trim() ? "Informe o limite de planos de trabalho por orientador." : parseInteger(form.limitePlanosOrientador) < 0 && "O limite de planos não pode ser negativo.")}>
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Limite de Planos de trabalho por orientador{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.limitePlanosOrientador}
                  onChange={(e) => form.setLimitePlanosOrientador(e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </EditalValidationField>
          </div>
        </div>


    </>
  );
}

function EditalRulesSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Regras do Edital ===== */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <ListChecks size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Regras do Edital
            </h2>
          </div>

          <div className="rounded-xl border border-neutral-light px-4">
            <fieldset disabled={form.readOnly} className="contents">
            <YesNoField
              label="Edital para Voluntários?"
              value={form.editalVoluntarios}
              onChange={form.setEditalVoluntarios}
            />
            <YesNoField
              label="Avaliação Vigente?"
              value={form.avaliacaoVigente}
              onChange={form.setAvaliacaoVigente}
            />
            <YesNoField
              label="Apenas Coordenador Orienta Plano"
              value={form.apenasCoordenadorOrientaPlano}
              onChange={form.setApenasCoordenadorOrientaPlano}
            />
            <YesNoField
              label="Apenas Colaborador Voluntário Cadastra Projeto"
              value={form.apenasColaboradorVoluntarioCadastraProjeto}
              onChange={form.setApenasColaboradorVoluntarioCadastraProjeto}
            />
            <YesNoField
              label="Professor Substituto Cadastra Projeto"
              value={form.professorSubstitutoCadastraProjeto}
              onChange={form.setProfessorSubstitutoCadastraProjeto}
            />
            <YesNoField
              label="Técnico-Administrativo Pode Coordenar Projeto?"
              value={form.tecnicoAdministrativoPodeCoordenar}
              onChange={form.setTecnicoAdministrativoPodeCoordenar}
            />
            <YesNoField
              label="Divulgar resultado?"
              value={form.divulgarResultado}
              onChange={form.setDivulgarResultado}
            />
            <YesNoField
              label="Distribuição de Cotas de Bolsas?"
              value={form.distribuicaoCotasBolsas}
              onChange={form.setDistribuicaoCotasBolsas}
            />
            </fieldset>
          </div>
        </div>


    </>
  );
}

function EditalDistributionSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Parâmetros da Distribuição de Cotas (condicional) ===== */}
        {form.distribuicaoCotasBolsas === "SIM" && (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <h2 className="text-sm font-semibold text-primary">
                  Parâmetros da Distribuição de Cotas
                </h2>
              </div>

              <button
                type="button"
                onClick={form.addQuotaDistribution}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                <Plus size={16} />
                Adicionar distribuição
              </button>
            </div>

            <div className="space-y-3">
              {form.quotaDistributions.map((distribution, index) => {
                const expanded =
                  form.expandedQuotaDistributionId === distribution.id;
                const scholarshipName =
                  form.bolsaOptions.find(
                    option => String(option.id) === distribution.tipoBolsa,
                  )?.descricao ??
                  (distribution.tipoBolsa
                    ? `Bolsa #${distribution.tipoBolsa}`
                    : "Tipo de bolsa não selecionado");
                const contentId = `quota-distribution-${distribution.id}`;

                return (
                  <div
                    key={distribution.id}
                    className="overflow-hidden rounded-xl border border-neutral-light bg-neutral-50/40"
                  >
                    <div className="flex items-center gap-2 p-4">
                      <button
                        type="button"
                        onClick={() =>
                          form.toggleQuotaDistribution(distribution.id)
                        }
                        aria-expanded={expanded}
                        aria-controls={contentId}
                        className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-primary">
                            Distribuição {index + 1}
                          </span>
                          <span className="mt-1 block truncate text-xs text-neutral">
                            {scholarshipName} • {distribution.quantidade || "0"}{" "}
                            cota(s) • FPPI {distribution.fppiMin || "0,00"} • Média{" "}
                            {distribution.mediaMinProj || "0,0"}
                          </span>
                        </span>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className={`shrink-0 text-neutral transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          form.removeQuotaDistribution(distribution.id)
                        }
                        disabled={form.quotaDistributions.length === 1}
                        aria-label={`Remover distribuição ${index + 1}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>

                    {expanded && (
                      <div
                        id={contentId}
                        className="grid grid-cols-1 gap-3 border-t border-neutral-light bg-white p-4 md:grid-cols-2"
                      >
                        <EditalValidationField error={!form.readOnly && (!distribution.tipoBolsa && "Selecione o tipo da bolsa.")}>
                          <label className="text-sm">
                            <span className="mb-1 block text-xs text-neutral">
                              Tipo da bolsa <span className="text-red-500">*</span>
                            </span>
                            <select
                              value={distribution.tipoBolsa}
                              onChange={(e) =>
                                form.updateQuotaDistribution(
                                  distribution.id,
                                  "tipoBolsa",
                                  e.target.value,
                                )
                              }
                              disabled={
                                form.bolsaLoading || Boolean(form.bolsaError)
                              }
                              className="w-full rounded-lg border border-neutral-light bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                            >
                              <option value="">
                                {form.bolsaLoading
                                  ? "Carregando..."
                                  : "-- SELECIONE --"}
                              </option>
                              {!form.bolsaLoading &&
                                !form.bolsaError &&
                                form.bolsaOptions.length === 0 && (
                                  <option value="" disabled>
                                    Cadastre um tipo de bolsa nas configurações
                                  </option>
                                )}
                              {form.bolsaOptions.map(option => (
                                <option key={option.id} value={String(option.id)}>
                                  {option.descricao}
                                </option>
                              ))}
                            </select>
                            <LookupError
                              error={form.bolsaError}
                              onRetry={form.loadBolsaOptions}
                            />
                            {!form.bolsaLoading &&
                              !form.bolsaError &&
                              form.bolsaOptions.length === 0 && (
                                <p className="mt-1 text-xs text-neutral">
                                  Nenhum tipo cadastrado.{" "}
                                  <Link
                                    to="/gestor/settings/scholarships"
                                    className="text-primary font-semibold underline"
                                  >
                                    Ir para Entidades & Tipos de Bolsa
                                  </Link>
                                </p>
                              )}
                          </label>
                        </EditalValidationField>

                    <EditalValidationField error={!form.readOnly && (!distribution.quantidade.trim() ? "Informe a quantidade de cotas." : parseInteger(distribution.quantidade) <= 0 && "A quantidade de cotas deve ser maior que zero.")}>
                      <label className="text-sm">
                        <span className="mb-1 block text-xs text-neutral">
                          Quantidade <span className="text-red-500">*</span>
                        </span>
                        <input
                          value={distribution.quantidade}
                          onChange={(e) =>
                            form.updateQuotaDistribution(
                              distribution.id,
                              "quantidade",
                              e.target.value,
                            )
                          }
                          inputMode="numeric"
                          className="w-full rounded-lg border border-neutral-light px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </label>
                    </EditalValidationField>

                    <EditalValidationField error={!form.readOnly && (!distribution.fppiMin.trim() ? "Informe o FPPI mínimo." : parseDecimal(distribution.fppiMin) <= 0 && "O FPPI mínimo deve ser maior que zero.")}>
                      <label className="text-sm">
                        <span className="mb-1 block text-xs text-neutral">
                          FPPI Mínimo <span className="text-red-500">*</span>
                        </span>
                        <input
                          value={distribution.fppiMin}
                          onChange={(e) =>
                            form.updateQuotaDistribution(
                              distribution.id,
                              "fppiMin",
                              e.target.value,
                            )
                          }
                          inputMode="decimal"
                          className="w-full rounded-lg border border-neutral-light px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </label>
                    </EditalValidationField>

                    <EditalValidationField error={!form.readOnly && (!distribution.mediaMinProj.trim() ? "Informe a média mínima dos projetos." : parseDecimal(distribution.mediaMinProj) <= 0 && "A média mínima dos projetos deve ser maior que zero.")}>
                      <label className="text-sm">
                        <span className="mb-1 block text-xs text-neutral">
                          Média Mínima dos Projetos{" "}
                          <span className="text-red-500">*</span>
                        </span>
                        <input
                          value={distribution.mediaMinProj}
                          onChange={(e) =>
                            form.updateQuotaDistribution(
                              distribution.id,
                              "mediaMinProj",
                              e.target.value,
                            )
                          }
                          inputMode="decimal"
                          className="w-full rounded-lg border border-neutral-light px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </label>
                    </EditalValidationField>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


    </>
  );
}

function EditalUnitsSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Unidades acadêmicas ===== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <h2 className="text-sm font-semibold text-primary">
              Unidades acadêmicas
            </h2>
          </div>
          <p className="text-xs text-neutral">
            Opcional. Se nenhuma for marcada, o edital fica sem unidades
            vinculadas.
          </p>

          {form.unidadeLoading && (
            <p className="text-sm text-neutral">Carregando unidades...</p>
          )}

          {form.unidadeError && (
            <p className="text-xs text-red-600 flex items-center gap-2 flex-wrap">
              <span>{form.unidadeError}</span>
              <button
                type="button"
                onClick={() => void form.loadUnidadeOptions()}
                className="underline font-semibold"
              >
                Tentar novamente
              </button>
            </p>
          )}

          {!form.unidadeLoading && !form.unidadeError && (
            <div className="rounded-xl border border-neutral-light divide-y divide-neutral-light max-h-56 overflow-y-auto">
              {form.unidadeOptions.length === 0 ? (
                <p className="p-3 text-sm text-neutral">
                  Nenhuma unidade cadastrada.
                </p>
              ) : (
                form.unidadeOptions.map(unit => (
                  <label
                    key={unit.id}
                    className="flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.unidadeIds.includes(unit.id)}
                      onChange={() => form.toggleUnidade(unit.id)}
                      className="accent-primary"
                    />
                    <span className="text-primary">{unit.name}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>


    </>
  );
}

function EditalFormActionsSection({ form }: Readonly<{ form: EditalFormModel }>) {
  return (
    <>
        {/* ===== Actions ===== */}
        {form.mode === "edit" && (
          <label className="text-sm block max-w-sm">
            <span className="block text-xs text-neutral mb-1">Status</span>
            <select
              value={form.status}
              onChange={event =>
                form.setStatus(event.target.value as StatusEdital)
              }
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              {form.statusOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center justify-end gap-3 flex-col md:flex-row">
          {form.mode === "create" ? (
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={form.saveDraft}
                disabled={!form.canSaveDraft}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
                ${!form.canSaveDraft ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
              >
                <Save size={16} />
                {form.isSubmitting ? "Salvando..." : "Salvar rascunho"}
              </button>

              <button
                type="button"
                onClick={form.publish}
                disabled={!form.canPublish || form.isSubmitting}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border w-full md:w-auto
                ${
                  !form.canPublish || form.isSubmitting
                    ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                    : "border-green-200 bg-green-50 text-green-700 hover:opacity-95"
                }`}
              >
                <Check size={16} />
                {form.isSubmitting ? "Publicando..." : "Publicar"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void form.submitEdital(form.status)}
              disabled={!form.canSaveEdit}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
                ${!form.canSaveEdit ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
            >
              <Save size={16} />
              {form.isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          )}
        </div>

        {form.submitError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {form.submitError}
          </div>
        )}
    </>
  );
}

export function EditalFormFieldset({ form }: EditalFormFieldsetProps) {
  return (
    <fieldset
      className={`rounded-xl border border-neutral-light bg-white p-5 space-y-6 ${
        form.fieldsLocked ? "opacity-70" : ""
      }`}
    >
      <EditalPdfSection form={form} />
      <EditalDataSection form={form} />
      <EditalPeriodsSection form={form} />
      <EditalClassificationSection form={form} />
      <EditalLimitsSection form={form} />
      <EditalRulesSection form={form} />
      <EditalDistributionSection form={form} />
      <EditalUnitsSection form={form} />
      <EditalFormActionsSection form={form} />
    </fieldset>
  );
}
