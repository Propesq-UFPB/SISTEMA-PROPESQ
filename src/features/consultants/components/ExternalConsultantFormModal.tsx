import { useState, type ReactNode } from "react"
import { Check, Info, X } from "lucide-react"
import type {
  ExternalFormValues,
  KnowledgeArea,
  KnowledgeAreaPath,
  Titulacao,
} from "../types/consultant"
import { toAreaPath } from "../utils/consultantHelpers"
import { TITULACAO_LABEL, validateExternalForm } from "../utils/externalHelpers"
import { AdditionalAreasField } from "./AdditionalAreasField"
import { OptionToggle } from "./ConsultantFormModal"
import { KnowledgeAreaPicker } from "./KnowledgeAreaPicker"

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"

function Field({
  label,
  error,
  hint,
  className = "",
  children,
}: Readonly<{
  label: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}>) {
  return (
    <div className={className}>
      <label className="text-xs text-neutral">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-neutral">{hint}</p>
      )}
    </div>
  )
}

export function ExternalConsultantFormModal({
  editing,
  initialValues,
  saving,
  error,
  onClose,
  onSave,
}: Readonly<{
  editing: boolean
  initialValues: ExternalFormValues
  saving: boolean
  error: string | null
  onClose: () => void
  onSave: (values: ExternalFormValues) => void
}>) {
  const [values, setValues] = useState<ExternalFormValues>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [principalPath, setPrincipalPath] = useState<KnowledgeAreaPath>(() =>
    toAreaPath(initialValues.areaPrincipal),
  )

  const errors = validateExternalForm(values)
  const hasErrors = Object.keys(errors).length > 0
  const shown = submitted ? errors : {}

  function update(patch: Partial<ExternalFormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function text(key: keyof ExternalFormValues) {
    return {
      value: values[key] as string,
      onChange: (event: { target: { value: string } }) =>
        update({ [key]: event.target.value } as Partial<ExternalFormValues>),
      className: inputClass,
    }
  }

  function changePrincipal(path: KnowledgeAreaPath, area: KnowledgeArea | null) {
    setPrincipalPath(path)
    update({
      areaPrincipal: area,
      areasAdicionais: values.areasAdicionais.filter((item) => item.id !== area?.id),
    })
  }

  function submit() {
    setSubmitted(true)
    if (hasErrors) return
    onSave(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-light bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-primary">
              {editing ? "Editar avaliador externo" : "Novo avaliador externo"}
            </h3>
            <p className="mt-1 text-xs text-neutral">
              Para quem avalia sem ser usuário do sistema. O acesso é feito por um link, sem login
              e senha.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-light p-2 hover:bg-neutral-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Nome *" error={shown.nome} className="md:col-span-2">
              <input {...text("nome")} placeholder="Nome completo" />
            </Field>
            <Field label="E-mail *" error={shown.email}>
              <input {...text("email")} type="email" placeholder="nome@instituicao.br" />
            </Field>
            <Field label="Telefone">
              <input {...text("telefone")} placeholder="+55 83 99999-0000" />
            </Field>
            <Field label="Instituição (filiação) *" error={shown.instituicao} className="md:col-span-2">
              <input {...text("instituicao")} placeholder="Universidade Federal de ..." />
            </Field>
            <Field label="Titulação">
              <select
                value={values.titulacao}
                onChange={(event) => update({ titulacao: event.target.value as Titulacao | "" })}
                className={`${inputClass} bg-white`}
              >
                <option value="">Não informada</option>
                {(Object.keys(TITULACAO_LABEL) as Titulacao[]).map((titulacao) => (
                  <option key={titulacao} value={titulacao}>
                    {TITULACAO_LABEL[titulacao]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="País">
              <input {...text("pais")} />
            </Field>
            <Field label="CPF" error={shown.cpf} hint="Em branco para estrangeiros.">
              <input {...text("cpf")} inputMode="numeric" placeholder="000.000.000-00" />
            </Field>
            <Field label="ORCID" error={shown.orcid}>
              <input {...text("orcid")} placeholder="0000-0000-0000-0000" />
            </Field>
            <Field label="Currículo Lattes" error={shown.lattesUrl} className="md:col-span-2">
              <input {...text("lattesUrl")} placeholder="http://lattes.cnpq.br/..." />
            </Field>
            <Field label="Observação" className="md:col-span-2">
              <textarea {...text("observacao")} rows={2} />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral">Perfil</label>
            <div className="grid gap-2 md:grid-cols-2">
              <OptionToggle
                checked={values.isVoluntario}
                label="Voluntário"
                description="Atua como avaliador voluntário."
                onChange={(isVoluntario) => update({ isVoluntario })}
              />
              <OptionToggle
                checked={values.isCnpq}
                label="CNPq"
                description="Bolsista de produtividade do CNPq."
                onChange={(isCnpq) => update({ isCnpq })}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-light p-4">
            <p className="text-xs font-semibold text-primary">Área de conhecimento principal *</p>
            <KnowledgeAreaPicker value={principalPath} onChange={changePrincipal} required />
            {shown.areaPrincipal && <p className="text-xs text-red-600">{shown.areaPrincipal}</p>}
          </div>

          <AdditionalAreasField
            label="Áreas de conhecimento adicionais"
            areas={values.areasAdicionais}
            excludedId={values.areaPrincipal?.id}
            onChange={(areasAdicionais) => update({ areasAdicionais })}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-neutral">Status</label>
              <div className="flex gap-2">
                {[true, false].map((ativo) => (
                  <button
                    key={String(ativo)}
                    type="button"
                    onClick={() => update({ ativo })}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                      values.ativo === ativo
                        ? ativo
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-primary/30 bg-primary/10 text-primary"
                        : "border-neutral-light text-neutral hover:bg-neutral-50"
                    }`}
                  >
                    {ativo ? "Ativo" : "Inativo"}
                  </button>
                ))}
              </div>
            </div>

            {!editing && (
              <Field
                label="Validade do link de acesso"
                error={shown.linkExpiraEm}
                hint="Em branco: vale até ser revogado."
              >
                <input {...text("linkExpiraEm")} type="date" />
              </Field>
            )}
          </div>

          {!editing && (
            <p className="flex gap-2 rounded-lg border border-neutral-light bg-neutral-50 px-3 py-2 text-xs text-neutral">
              <Info size={14} className="mt-0.5 shrink-0" />
              Ao salvar, o link de acesso é exibido uma única vez para você copiar e enviar ao
              avaliador.
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-light px-3 py-2 text-sm font-semibold text-neutral hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving || (submitted && hasErrors)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:bg-primary/40"
          >
            <Check size={16} />
            {saving ? "Salvando..." : editing ? "Salvar" : "Salvar e gerar link"}
          </button>
        </div>
      </div>
    </div>
  )
}
