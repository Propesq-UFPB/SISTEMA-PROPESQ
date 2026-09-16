import { ChevronRight, Plus, RefreshCcw, Trash2, Users } from "lucide-react"
import type {
  MemberCategory,
  MemberLookupBundle,
  ResearchUserLookup,
} from "../types/project"
import type { FormState, ProjectMember } from "../types/projectFormWizard"
import { cx, initialMember } from "../utils/projectFormHelpers"
import { Card, Field, inputClassName, selectClassName } from "./formPrimitives"
import { FileInputBox } from "./FileInputBox"

export function WizardStep4Membros({
  form,
  setForm,
  goNext,
  goBack,
  canGoStep5,
  memberDraft,
  setMemberDraft,
  memberLookups,
  userOptions,
  addMember,
  removeMember,
  canAddMember,
  resetMemberDraft,
}: Readonly<{
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  goNext: () => void
  goBack: () => void
  canGoStep5: boolean
  memberDraft: ProjectMember
  setMemberDraft: React.Dispatch<React.SetStateAction<ProjectMember>>
  memberLookups: MemberLookupBundle | null
  userOptions: ResearchUserLookup[]
  addMember: () => void
  removeMember: (id: string) => void
  canAddMember: boolean
  resetMemberDraft: () => void
}>) {
  return (
    <Card
      title="Passo 4 — Membros e uploads"
      subtitle="Cadastre os membros do projeto e anexe os documentos complementares."
      icon={<Users size={18} className="text-primary" />}
    >
      <div className="rounded-2xl border border-neutral/20 p-5">
        <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary">
              Novo membro do projeto
            </h3>

            <p className="mt-1 text-xs text-neutral">
              Informe os dados principais do membro e clique em adicionar.
            </p>
          </div>

          <button
            type="button"
            onClick={resetMemberDraft}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
          >
            <RefreshCcw size={14} />
            Limpar
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Vínculo" required>
            <select
              value={memberDraft.categoria}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...initialMember,
                  id: current.id,
                  categoria: event.target.value as MemberCategory,
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {(memberLookups?.categorias ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Papel no projeto" required>
            <select
              value={memberDraft.papel}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...current,
                  papel: event.target.value,
                }))
              }
              className={selectClassName}
            >
              <option value="">Selecione</option>
              {(memberLookups?.funcoes ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          {memberDraft.categoria !== "EXTERNO" ? (
            <Field label="Usuário cadastrado" required>
              <select
                value={memberDraft.userId}
                disabled={!memberDraft.categoria}
                onChange={(event) => {
                  const user = userOptions.find(
                    (item) => item.id === Number(event.target.value),
                  )
                  setMemberDraft((current) => ({
                    ...current,
                    userId: event.target.value,
                    nome: user?.name ?? "",
                    email: user?.email ?? "",
                  }))
                }}
                className={selectClassName}
              >
                <option value="">Selecione</option>
                {userOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.email}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <>
              <Field label="Nome" required>
                <input
                  value={memberDraft.nome}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="Nome completo"
                />
              </Field>
              <Field label="E-mail" required>
                <input
                  type="email"
                  value={memberDraft.email}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="email@exemplo.com"
                />
              </Field>
              <Field
                label="CPF"
                hint="Deixe em branco para pessoa estrangeira."
              >
                <input
                  value={memberDraft.cpf}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      cpf: event.target.value,
                    }))
                  }
                  className={inputClassName}
                  placeholder="000.000.000-00"
                />
              </Field>
              <Field label="Sexo" required>
                <select
                  value={memberDraft.sexo}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      sexo: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.sexos ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Formação" required>
                <select
                  value={memberDraft.formacao}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      formacao: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.formacoes_externas ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo de membro externo" required>
                <select
                  value={memberDraft.tipoExterno}
                  onChange={(event) =>
                    setMemberDraft((current) => ({
                      ...current,
                      tipoExterno: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option value="">Selecione</option>
                  {(memberLookups?.tipos_externos ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          <Field label="Carga horária dedicada" required>
            <input
              type="number"
              min={1}
              value={memberDraft.cargaHoraria}
              onChange={(event) =>
                setMemberDraft((current) => ({
                  ...current,
                  cargaHoraria: event.target.value,
                }))
              }
              className={inputClassName}
              placeholder="Horas"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addMember}
            disabled={!canAddMember}
            className={cx(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
              canAddMember
                ? "bg-primary text-white hover:bg-primary/90"
                : "cursor-not-allowed bg-neutral/10 text-neutral",
            )}
          >
            <Plus size={16} />
            Adicionar membro
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral/20 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary">
              Membros cadastrados
            </h3>

            <p className="mt-1 text-xs text-neutral">
              Total cadastrado:{" "}
              <span className="font-semibold text-primary">
                {form.gerais.membros.length}
              </span>
            </p>
          </div>

          <span
            className={cx(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
              form.gerais.membros.length > 0
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {form.gerais.membros.length > 0
              ? "Regra atendida"
              : "Obrigatório adicionar 1 membro"}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {form.gerais.membros.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-light bg-neutral/5 p-5 text-center">
              <p className="text-sm font-semibold text-primary">
                Nenhum membro cadastrado.
              </p>

              <p className="mt-1 text-xs text-neutral">
                Preencha o formulário acima e clique em adicionar.
              </p>
            </div>
          ) : (
            form.gerais.membros.map((membro) => (
              <div
                key={membro.id}
                className="rounded-xl border border-neutral/20 bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {membro.nome}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {memberLookups?.funcoes.find(
                          (item) => item.id === membro.papel,
                        )?.name ?? membro.papel}
                      </span>

                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {memberLookups?.categorias.find(
                          (item) => item.id === membro.categoria,
                        )?.name ?? membro.categoria}
                      </span>

                      <span className="rounded-full bg-neutral/10 px-2 py-1">
                        {membro.email}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-neutral">
                      Carga horária: {membro.cargaHoraria}h
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMember(membro.id)}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FileInputBox
          label="Upload do PDF complementar"
          hint="Documento complementar do projeto, opcional."
          file={form.gerais.pdfComplementar}
          onChange={(pdfComplementar) =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                pdfComplementar,
              },
            }))
          }
        />

        <FileInputBox
          label="Comprovante de aprovação/financiamento"
          required={form.gerais.tipo === "externo"}
          disabled={form.gerais.tipo !== "externo"}
          hint="Obrigatório apenas para projeto externo."
          file={form.gerais.comprovanteExterno}
          onChange={(comprovanteExterno) =>
            setForm((current) => ({
              ...current,
              gerais: {
                ...current.gerais,
                comprovanteExterno,
              },
            }))
          }
        />
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
          onClick={goNext}
          disabled={!canGoStep5}
          className={cx(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            canGoStep5
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
