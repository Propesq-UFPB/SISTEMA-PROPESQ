import { useEffect, useState } from "react"
import { Check, Info, Plus, X } from "lucide-react"
import { consultantService } from "../api/consultantService"
import type {
  ConsultantFormValues,
  EligibleUser,
  KnowledgeArea,
  KnowledgeAreaPath,
} from "../types/consultant"
import {
  areaLabel,
  EMPTY_AREA_PATH,
  funcaoLabel,
  toAreaPath,
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

// Busca no servidor os usuários que ainda podem ser cadastrados como consultor.
function useEligibleUsers(enabled: boolean) {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<EligibleUser[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const timer = setTimeout(() => {
      consultantService
        .eligibleUsers(search)
        .then((rows) => {
          if (!cancelled) {
            setUsers(rows)
            setError(false)
          }
        })
        .catch(() => {
          if (!cancelled) setError(true)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [enabled, search])

  return { users, error, setSearch }
}

export function ConsultantFormModal({
  editing,
  initialValues,
  saving,
  error,
  onClose,
  onSave,
}: Readonly<{
  editing: boolean
  initialValues: ConsultantFormValues
  saving: boolean
  error: string | null
  onClose: () => void
  onSave: (values: ConsultantFormValues) => void
}>) {
  const [values, setValues] = useState<ConsultantFormValues>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [principalPath, setPrincipalPath] = useState<KnowledgeAreaPath>(() =>
    toAreaPath(initialValues.areaPrincipal),
  )
  const [principalFromDocente, setPrincipalFromDocente] = useState(false)
  const [additionalPath, setAdditionalPath] = useState<KnowledgeAreaPath>(EMPTY_AREA_PATH)
  const [additional, setAdditional] = useState<KnowledgeArea | null>(null)
  const eligible = useEligibleUsers(!editing)

  const errors = validateConsultantForm(values)
  const hasErrors = Object.keys(errors).length > 0

  const additionalDuplicate =
    additional !== null &&
    (additional.id === values.areaPrincipal?.id ||
      values.areasAdicionais.some((area) => area.id === additional.id))

  // Mantém o usuário selecionado nas opções mesmo quando a busca não o retorna.
  const userOptions = [
    ...(values.user && !eligible.users.some((user) => user.id === values.user?.id)
      ? [{ value: String(values.user.id), label: values.user.nome, description: values.user.email }]
      : []),
    ...eligible.users.map((user) => ({
      value: String(user.id),
      label: user.nome,
      description: `${funcaoLabel(user.funcao)} • ${user.email}`,
    })),
  ]

  function update(patch: Partial<ConsultantFormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function changeUser(selected: string) {
    const user = eligible.users.find((item) => String(item.id) === selected) ?? null
    update({ user: user && { id: user.id, nome: user.nome, email: user.email } })

    // Sugere a área do cadastro docente se a área principal ainda não foi escolhida
    if (user?.area && (values.areaPrincipal === null || principalFromDocente)) {
      setPrincipalPath(toAreaPath(user.area))
      setPrincipalFromDocente(true)
      update({
        areaPrincipal: user.area,
        areasAdicionais: values.areasAdicionais.filter((area) => area.id !== user.area?.id),
      })
    }
  }

  function changePrincipal(path: KnowledgeAreaPath, area: KnowledgeArea | null) {
    setPrincipalPath(path)
    setPrincipalFromDocente(false)
    update({
      areaPrincipal: area,
      areasAdicionais: values.areasAdicionais.filter((item) => item.id !== area?.id),
    })
  }

  function changeAdditional(path: KnowledgeAreaPath, area: KnowledgeArea | null) {
    setAdditionalPath(path)
    setAdditional(area)
  }

  function addAdditional() {
    if (additional === null || additionalDuplicate) return
    update({ areasAdicionais: [...values.areasAdicionais, additional] })
    changeAdditional(EMPTY_AREA_PATH, null)
  }

  function removeAdditional(id: number) {
    update({ areasAdicionais: values.areasAdicionais.filter((area) => area.id !== id) })
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
            {editing ? (
              <div className="rounded-lg border border-neutral-light bg-neutral-50 px-3 py-2 text-sm">
                <p className="font-semibold text-primary">{values.user?.nome}</p>
                <p className="text-xs text-neutral">{values.user?.email}</p>
              </div>
            ) : (
              <SearchableSelect
                value={values.user === null ? "" : String(values.user.id)}
                onChange={changeUser}
                onQueryChange={eligible.setSearch}
                placeholder="Pesquise um usuário interno por nome ou e-mail..."
                emptyMessage={
                  eligible.error
                    ? "Não foi possível carregar os usuários."
                    : "Nenhum usuário disponível encontrado."
                }
                options={userOptions}
              />
            )}
            {submitted && errors.user && <p className="text-xs text-red-600">{errors.user}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral">Perfil</label>
            <div className="grid gap-2 md:grid-cols-3">
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
              <OptionToggle
                checked={values.isCnpq}
                label="CNPq"
                description="Bolsista de produtividade do CNPq."
                onChange={(isCnpq) => update({ isCnpq })}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-neutral-light p-4">
            <p className="text-xs font-semibold text-primary">
              Área de conhecimento principal *
            </p>
            {principalFromDocente && (
              <p className="flex items-center gap-1 text-xs text-neutral">
                <Info size={14} className="shrink-0" />
                Preenchida a partir do cadastro docente do usuário. Altere se necessário.
              </p>
            )}
            <KnowledgeAreaPicker value={principalPath} onChange={changePrincipal} required />
            {submitted && errors.areaPrincipal && (
              <p className="text-xs text-red-600">{errors.areaPrincipal}</p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-neutral-light p-4">
            <p className="text-xs font-semibold text-primary">
              Áreas de conhecimento adicionais
            </p>
            <KnowledgeAreaPicker value={additionalPath} onChange={changeAdditional} />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-red-600">
                {additionalDuplicate && "Essa área já foi selecionada."}
              </p>
              <button
                type="button"
                onClick={addAdditional}
                disabled={additional === null || additionalDuplicate}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50"
              >
                <Plus size={16} />
                Adicionar área
              </button>
            </div>

            {values.areasAdicionais.length === 0 ? (
              <p className="text-xs text-neutral/70">Nenhuma área adicional.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.areasAdicionais.map((area) => (
                  <span
                    key={area.id}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-light bg-neutral-50 py-1 pl-3 pr-1 text-xs text-neutral-dark"
                  >
                    {areaLabel(area)}
                    <button
                      type="button"
                      onClick={() => removeAdditional(area.id)}
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
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}
