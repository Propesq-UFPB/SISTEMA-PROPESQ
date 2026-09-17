import { Link } from "react-router-dom"
import {
  CalendarDays,
  FileText,
  GraduationCap,
  Hash,
  Save,
  Tags,
  Upload,
  Users,
} from "lucide-react"
import type { MemberLookupBundle } from "../types/project"
import type { FormState, Step } from "../types/projectFormWizard"
import {
  cx,
  formatCronogramaDuration,
  formatProjectTypeLabel,
  initialState,
} from "../utils/projectFormHelpers"
import { Card, Info } from "./formPrimitives"

export function WizardStep6Revisao({
  form,
  goBack,
  submit,
  saving,
  submitted,
  canGoStep6,
  backTo,
  setForm,
  setSubmitted,
  setCreatedProjectId,
  setStep,
  resetMemberDraft,
  editalName,
  unidadeName,
  grupoName,
  memberLookups,
}: Readonly<{
  form: FormState
  goBack: () => void
  submit: () => void
  saving: boolean
  submitted: boolean
  canGoStep6: boolean
  backTo: string
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  setCreatedProjectId: React.Dispatch<React.SetStateAction<number | null>>
  setStep: React.Dispatch<React.SetStateAction<Step>>
  resetMemberDraft: () => void
  editalName: string
  unidadeName: string
  grupoName: string
  memberLookups: MemberLookupBundle | null
}>) {
  const specificDataSuffix = form.gerais.tipo
    ? `(${formatProjectTypeLabel(form.gerais.tipo)})`
    : ""

  let submitButtonLabel = "Confirmar e submeter"
  if (saving) {
    submitButtonLabel = "Submetendo..."
  } else if (submitted) {
    submitButtonLabel = "Submetido"
  }

  return (
    <Card
      title="Passo 6 — Revisão e submissão"
      subtitle="Revise todos os dados antes de submeter."
      icon={<Save size={18} className="text-primary" />}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <FileText size={16} />
            Dados do projeto
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info
              label="Tipo"
              value={formatProjectTypeLabel(form.gerais.tipo)}
            />

            <Info label="Edital" value={editalName} />
            <Info label="Unidade" value={unidadeName} />

            <div className="sm:col-span-2">
              <Info label="Título" value={form.gerais.titulo} />
            </div>

            <div className="sm:col-span-2">
              <Info label="Title" value={form.gerais.title} />
            </div>

            <Info label="E-mail" value={form.gerais.email} />

            <Info
              label="Período"
              value={`${form.gerais.periodoIni || "—"} → ${
                form.gerais.periodoFim || "—"
              }`}
            />

            <Info
              label="Área de conhecimento"
              value={
                form.gerais.especialidade ||
                form.gerais.subarea ||
                form.gerais.area
              }
            />

            <Info label="Linha de pesquisa" value={form.gerais.linhaPesquisa} />

            <Info label="Grande área" value={form.gerais.grandeArea} />

            <Info
              label="Área / Subárea"
              value={`${form.gerais.area || "—"}${
                form.gerais.subarea ? ` • ${form.gerais.subarea}` : ""
              }`}
            />

            <Info label="Especialidade" value={form.gerais.especialidade} />
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
              <Tags size={14} />
              Palavras-chave
            </p>

            <p className="mt-1 text-sm text-neutral">
              {form.gerais.palavrasChave || "—"}
            </p>
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral">
              <Tags size={14} />
              Keywords
            </p>

            <p className="mt-1 text-sm text-neutral">
              {form.gerais.keywords || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Hash size={16} />
            Dados específicos {specificDataSuffix}
          </h3>

          {form.gerais.tipo === "interno" ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info
                label="Vinculado a grupo?"
                value={form.interno.vinculadoGrupo}
              />

              <Info label="Grupo de pesquisa" value={grupoName} />

              <Info
                label="Possui protocolo em comitê?"
                value={form.interno.possuiProtocoloEtica}
              />

              <Info
                label="Comitê de ética"
                value={form.interno.comiteEticaNome}
              />

              <div className="sm:col-span-2">
                <Info
                  label="Nº do protocolo"
                  value={form.interno.protocoloEtica}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Categoria" value={form.externo.categoriaProjeto} />

              <Info
                label="Subcategoria Nível I"
                value={form.externo.subcategoriaNivelI}
              />

              <Info
                label="Subcategoria Nível II"
                value={form.externo.subcategoriaNivelII}
              />

              <Info
                label="Definição de PI"
                value={form.externo.definicaoPropriedadeIntelectual}
              />

              <div className="sm:col-span-2">
                <Info
                  label="Tratamento da produção intelectual"
                  value={form.externo.tratamentoProducao}
                  preWrap
                />
              </div>
            </div>
          )}

          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-bold text-green-800">
                Submetido com sucesso!
              </p>

              <p className="mt-1 text-xs text-green-800/80">
                Agora você pode voltar para projetos ou cadastrar outro.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={backTo}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-100"
                >
                  Voltar para projetos
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setForm(initialState)
                    resetMemberDraft()
                    setSubmitted(false)
                    setCreatedProjectId(null)
                    setStep(1)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Cadastrar outro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <FileText size={16} />
          Campos textuais do Anexo II
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <Info
            label="Descrição resumida"
            value={form.gerais.descricaoResumida}
            preWrap
          />

          <Info label="Abstract" value={form.gerais.abstract} preWrap />

          <Info
            label="Introdução / justificativa"
            value={form.gerais.introducaoJustificativa}
            preWrap
          />

          <Info label="Objetivos" value={form.gerais.objetivos} preWrap />

          <Info label="Metodologia" value={form.gerais.metodologia} preWrap />

          <Info
            label="Resultados esperados"
            value={form.gerais.resultadosEsperados}
            preWrap
          />

          <Info label="Referências" value={form.gerais.referencias} preWrap />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <GraduationCap size={16} />
            ODS vinculados
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {form.gerais.objetivosDS.length === 0 ? (
              <span className="text-sm text-neutral">—</span>
            ) : (
              form.gerais.objetivosDS.map((ods) => (
                <span
                  key={ods.id}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral/10 px-3 py-1 text-xs font-semibold text-neutral"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-neutral/20 bg-white text-[11px]">
                    {ods.id}
                  </span>

                  {ods.label}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Upload size={16} />
            Arquivos
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <Info
              label="PDF complementar"
              value={form.gerais.pdfComplementar?.name || "—"}
            />

            <Info
              label="Comprovante externo"
              value={form.gerais.comprovanteExterno?.name || "—"}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <CalendarDays size={16} />
          Cronograma
        </h3>

        <div className="mt-4 space-y-2">
          {form.gerais.cronograma.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral/20 bg-neutral/5 p-3 text-sm text-neutral"
            >
              <span className="font-semibold text-primary">
                {formatCronogramaDuration(item.mesInicio, item.mesFim)}
              </span>{" "}
              — {item.atividade}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <Users size={16} />
          Membros do projeto ({form.gerais.membros.length})
        </h3>

        <div className="mt-4 space-y-3">
          {form.gerais.membros.map((membro) => (
            <div
              key={membro.id}
              className="rounded-xl border border-neutral/20 bg-neutral/5 p-4"
            >
              <p className="text-sm font-bold text-primary">{membro.nome}</p>

              <div className="mt-2 grid grid-cols-1 gap-3 text-sm text-neutral sm:grid-cols-2">
                <Info
                  label="Papel"
                  value={
                    memberLookups?.funcoes.find(
                      (item) => item.id === membro.papel,
                    )?.name ?? membro.papel
                  }
                />
                <Info
                  label="Vínculo"
                  value={
                    memberLookups?.categorias.find(
                      (item) => item.id === membro.categoria,
                    )?.name ?? membro.categoria
                  }
                />
                <Info label="E-mail" value={membro.email} />
                <Info label="Carga horária" value={`${membro.cargaHoraria}h`} />
              </div>
            </div>
          ))}
        </div>
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
          onClick={submit}
          disabled={saving || submitted || !canGoStep6}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            saving || submitted || !canGoStep6
              ? "cursor-not-allowed bg-neutral/10 text-neutral"
              : "bg-primary text-white hover:bg-primary/90",
          )}
        >
          {submitButtonLabel}
        </button>
      </div>
    </Card>
  )
}
