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
} from "lucide-react";
import { Link } from "react-router-dom";
import type { StatusEdital } from "@/features/editais/types/edital";
import type { EditalFormModel } from "./useEditalForm";
import { YesNoField } from "./EditalFormFields";

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

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">
                Categoria <span className="text-red-500">*</span>
              </span>
              <select
                value={form.categoria}
                onChange={(e) => form.setCategoria(e.target.value)}
                disabled={form.categoriaLoading || Boolean(form.categoriaError)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                <option value="">
                  {form.categoriaLoading ? "Carregando..." : "-- SELECIONE --"}
                </option>
                {!form.categoriaLoading &&
                  !form.categoriaError &&
                  form.categoriaOptions.length === 0 && (
                    <option value="" disabled>
                      Cadastre uma form.categoria
                    </option>
                  )}
                {form.categoriaOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <LookupError error={form.categoriaError} onRetry={form.loadCategoriaOptions} />
            </label>
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
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <h2 className="text-sm font-semibold text-primary">
                Parâmetros da Distribuição de Cotas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Tipo da bolsa <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.tipoBolsa}
                  onChange={(e) => form.setTipoBolsa(e.target.value)}
                  disabled={form.bolsaLoading || Boolean(form.bolsaError)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                >
                  <option value="">
                    {form.bolsaLoading ? "Carregando..." : "-- SELECIONE --"}
                  </option>
                  {!form.bolsaLoading &&
                    !form.bolsaError &&
                    form.bolsaOptions.length === 0 && (
                      <option value="" disabled>
                        Cadastre um tipo de bolsa nas configurações
                      </option>
                    )}
                  {form.bolsaOptions.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.descricao}
                    </option>
                  ))}
                </select>
                <LookupError error={form.bolsaError} onRetry={form.loadBolsaOptions} />
                {!form.bolsaLoading && !form.bolsaError && form.bolsaOptions.length === 0 && (
                  <p className="mt-1 text-xs text-neutral">
                    Nenhum tipo cadastrado.{" "}
                    <Link
                      to="/adm/settings/scholarships"
                      className="text-primary font-semibold underline"
                    >
                      Ir para Entidades & Tipos de Bolsa
                    </Link>
                  </p>
                )}
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Quantidade <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.quantidadeCotas}
                  onChange={(e) => form.setQuantidadeCotas(e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  FPPI Mínimo <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.fppiMinimo}
                  onChange={(e) => form.setFppiMinimo(e.target.value)}
                  inputMode="decimal"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">
                  Média Mínima dos Projetos{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.mediaMinimaProjetos}
                  onChange={(e) => form.setMediaMinimaProjetos(e.target.value)}
                  inputMode="decimal"
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
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
