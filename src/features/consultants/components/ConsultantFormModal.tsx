import { useState } from "react"
import { Check, Plus, X } from "lucide-react"
import type {
  ConsultantFormValues,
  ConsultantType,
  InternalUser,
  KnowledgeArea,
  KnowledgeAreaPath,
} from "../types/consultant"
import {
  areaLabel,
  EMPTY_AREA_PATH,
  resolveAreaId,
  USER_ROLE_LABEL,
  validateConsultantForm,
} from "../utils/consultantHelpers"
import { KnowledgeAreaPicker } from "./KnowledgeAreaPicker"
import { SearchableSelect } from "./SearchableSelect"

function OptionToggle({
  checked,
  label,
  description,
  onChange,
}: Readonly<{
  checked: boolean
  label: string
  description: string
  onChange: (checked: boolean) => void
}>) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition ${
        checked
          ? "border-primary/30 bg-primary/5"
          : "border-neutral-light hover:bg-neutral-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-primary">{label}</span>
        <span className="block text-xs text-neutral">{description}</span>
      </span>
    </label>
  )
}

export function ConsultantFormModal({
  editing,
  initialValues,
  users,
  areas,
  onClose,
  onSave,
}: Readonly<{
  editing: boolean
  initialValues: ConsultantFormValues
  users: InternalUser[]
  areas: KnowledgeArea[]
  onClose: () => void
  onSave: (values: ConsultantFormValues) => void
}>) {
  const [values, setValues] = useState<ConsultantFormValues>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [principalPath, setPrincipalPath] = useState<KnowledgeAreaPath>(() => {
    const row = areas.find((area) => area.id === initialValues.areaPrincipalId)
    return row ? { ...row } : EMPTY_AREA_PATH
  })
  const [additionalPath, setAdditionalPath] = useState<KnowledgeAreaPath>(EMPTY_AREA_PATH)

  const errors = validateConsultantForm(values)
  const hasErrors = Object.keys(errors).length > 0

  const areasById = new Map(areas.map((area) => [area.id, area]))
  const additionalId = resolveAreaId(areas, additionalPath)
  const additionalDuplicate =
    additionalId !== null &&
    (additionalId === values.areaPrincipalId ||
      values.areasAdicionaisIds.includes(additionalId))

  function update(patch: Partial<ConsultantFormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function changeType(tipo: ConsultantType) {
    update({ tipo, isPropesq: false, isVoluntario: false, isCnpq: false })
  }

  function changePrincipal(path: KnowledgeAreaPath) {
    const id = resolveAreaId(areas, path)
    setPrincipalPath(path)
    update({
      areaPrincipalId: id,
      areasAdicionaisIds: values.areasAdicionaisIds.filter((areaId) => areaId !== id),
    })
  }

  function addAdditional() {
    if (additionalId === null || additionalDuplicate) return
    update({ areasAdicionaisIds: [...values.areasAdicionaisIds, additionalId] })
    setAdditionalPath(EMPTY_AREA_PATH)
  }

  function removeAdditional(id: number) {
    update({ areasAdicionaisIds: values.areasAdicionaisIds.filter((areaId) => areaId !== id) })
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
              {editing ? "Editar consultor" : "Novo consultor"}
            </h3>
            <p className="mt-1 text-xs text-neutral">
              Consultores serão os avaliadores dos projetos distribuídos.
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
          <div className="space-y-2">
            <label className="text-xs text-neutral">Nome *</label>
            <SearchableSelect
              value={values.userId === null ? "" : String(values.userId)}
              onChange={(selected) => update({ userId: selected ? Number(selected) : null })}
              placeholder="Pesquise um usuário interno por nome ou e-mail..."
              emptyMessage="Nenhum usuário encontrado."
              options={users.map((user) => ({
                value: String(user.id),
                label: user.nome,
                description: `${USER_ROLE_LABEL[user.papel]} • ${user.email}`,
              }))}
            />
            {submitted && errors.userId && (
              <p className="text-xs text-red-600">{errors.userId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral">Vínculo</label>
            <div className="flex gap-2">
              {(["INTERNO", "EXTERNO"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => changeType(tipo)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    values.tipo === tipo
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-neutral-light text-neutral hover:bg-neutral-50"
                  }`}
                >
                  {tipo === "INTERNO" ? "Interno" : "Externo"}
                </button>
              ))}
            </div>

            {values.tipo === "INTERNO" ? (
              <div className="grid gap-2 md:grid-cols-2">
                <OptionToggle
                  checked={values.isPropesq}
                  label="PROPESQ"
                  description="Servidor da PROPESQ."
                  onChange={(isPropesq) => update({ isPropesq })}
                />
                <OptionToggle
                  checked={values.isVoluntario}
                  label="Voluntário"
                  description="Atua como consultor voluntário."
                  onChange={(isVoluntario) => update({ isVoluntario })}
                />
              </div>
            ) : (
              <OptionToggle
                checked={values.isCnpq}
                label="CNPq"
                description="Consultor externo vinculado ao CNPq."
                onChange={(isCnpq) => update({ isCnpq })}
              />
            )}
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-light p-4">
            <p className="text-xs font-semibold text-primary">
              Área de conhecimento principal *
            </p>
            <KnowledgeAreaPicker
              areas={areas}
              value={principalPath}
              onChange={changePrincipal}
              required
            />
            {submitted && errors.areaPrincipalId && (
              <p className="text-xs text-red-600">{errors.areaPrincipalId}</p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-neutral-light p-4">
            <p className="text-xs font-semibold text-primary">
              Áreas de conhecimento adicionais
            </p>
            <KnowledgeAreaPicker
              areas={areas}
              value={additionalPath}
              onChange={setAdditionalPath}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-red-600">
                {additionalDuplicate && "Essa área já foi selecionada."}
              </p>
              <button
                type="button"
                onClick={addAdditional}
                disabled={additionalId === null || additionalDuplicate}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50"
              >
                <Plus size={16} />
                Adicionar área
              </button>
            </div>

            {values.areasAdicionaisIds.length === 0 ? (
              <p className="text-xs text-neutral/70">Nenhuma área adicional.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.areasAdicionaisIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-light bg-neutral-50 py-1 pl-3 pr-1 text-xs text-neutral-dark"
                  >
                    {areaLabel(areasById.get(id))}
                    <button
                      type="button"
                      onClick={() => removeAdditional(id)}
                      className="rounded-full p-0.5 hover:bg-neutral-light"
                      aria-label="Remover área"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral">Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update({ ativo: true })}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  values.ativo
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-neutral-light text-neutral hover:bg-neutral-50"
                }`}
              >
                Ativo
              </button>
              <button
                type="button"
                onClick={() => update({ ativo: false })}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  !values.ativo
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-neutral-light text-neutral hover:bg-neutral-50"
                }`}
              >
                Inativo
              </button>
            </div>
          </div>
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
            disabled={submitted && hasErrors}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:bg-primary/40"
          >
            <Check size={16} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
