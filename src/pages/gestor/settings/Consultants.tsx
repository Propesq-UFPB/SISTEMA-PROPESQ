import { useState } from "react"
import { Helmet } from "react-helmet"
import { AlertCircle, Check, Info, Pencil, Plus, Search, Trash2, UserCheck, X } from "lucide-react"
import { ConsultantFormModal } from "@/features/consultants/components/ConsultantFormModal"
import { useConsultants } from "@/features/consultants/hooks/useConsultants"
import type {
  Consultant,
  ConsultantFormValues,
  ConsultantStatusFilter,
} from "@/features/consultants/types/consultant"
import {
  areaLabel,
  consultantTags,
  EMPTY_CONSULTANT_FORM,
  toFormValues,
} from "@/features/consultants/utils/consultantHelpers"

type ModalState = { editingId: number | null; initialValues: ConsultantFormValues }

export default function Consultants() {
  const {
    consultants,
    filtered,
    stats,
    loading,
    loadError,
    actionError,
    setActionError,
    notice,
    saving,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    saveConsultant,
    toggleActive,
    removeConsultant,
  } = useConsultants()

  const [modal, setModal] = useState<ModalState | null>(null)

  function openCreate() {
    setActionError(null)
    setModal({ editingId: null, initialValues: EMPTY_CONSULTANT_FORM })
  }

  function openEdit(consultant: Consultant) {
    setActionError(null)
    setModal({ editingId: consultant.id, initialValues: toFormValues(consultant) })
  }

  function closeModal() {
    if (saving) return
    setActionError(null)
    setModal(null)
  }

  function handleRemove(consultant: Consultant) {
    const message =
      `Remover ${consultant.user.nome} da lista de consultores?\n\n` +
      "Se ele já tiver avaliações atribuídas, será apenas desativado."
    if (!window.confirm(message)) return
    void removeConsultant(consultant)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Consultores • PROPESQ</title>
      </Helmet>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-primary px-3 py-1 text-xs font-semibold border border-blue-100">
              <UserCheck size={14} />
              Configurações
            </span>

            <div>
              <h1 className="text-2xl font-bold text-primary">Consultores</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Cadastre os consultores que avaliarão os projetos distribuídos, com suas áreas de
                conhecimento principal e adicionais.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-colors"
          >
            <Plus size={16} />
            Novo consultor
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total },
            { label: "Ativos", value: stats.ativos },
            { label: "PROPESQ", value: stats.propesq },
            { label: "Voluntários", value: stats.voluntarios },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
              <p className="text-xs text-neutral">{item.label}</p>
              <p className="text-lg font-bold text-primary">{item.value}</p>
            </div>
          ))}
        </div>

        {notice && (
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
            <Info size={16} className="mt-0.5 shrink-0 text-neutral" />
            <p className="text-xs text-neutral">{notice}</p>
          </div>
        )}

        {!modal && (actionError || loadError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-xs text-red-700">{actionError ?? loadError}</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-neutral-light bg-white p-5">
        <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
          <div className="w-full md:max-w-md">
            <label className="text-xs text-neutral">Buscar</label>
            <div className="relative mt-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nome, e-mail ou área de conhecimento..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap justify-end">
            <div>
              <label className="text-xs text-neutral">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ConsultantStatusFilter)}
                className="mt-1 block rounded-lg border border-neutral-light px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ACTIVE">Ativos</option>
                <option value="INACTIVE">Inativos</option>
                <option value="ALL">Todos</option>
              </select>
            </div>

            <div className="text-xs text-neutral pb-2">
              {filtered.length} de {consultants.length}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-light bg-white overflow-x-auto">
        <div className="px-5 py-4 border-b border-neutral-light flex items-center gap-2">
          <UserCheck size={18} />
          <h3 className="text-sm font-semibold text-primary">Lista de consultores</h3>
        </div>

        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-neutral-50 text-neutral">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Consultor</th>
              <th className="text-left font-semibold px-5 py-3">Perfil</th>
              <th className="text-left font-semibold px-5 py-3">Áreas de conhecimento</th>
              <th className="text-left font-semibold px-5 py-3 w-[180px]">Status</th>
              <th className="text-right font-semibold px-5 py-3 w-[240px]">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-neutral">
                  Carregando consultores...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-neutral">
                  Nenhum consultor encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((consultant) => {
                const tags = consultantTags(consultant)

                return (
                  <tr key={consultant.id} className="border-t border-neutral-light align-top">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-primary">{consultant.user.nome}</p>
                      <p className="text-xs text-neutral">{consultant.user.email}</p>
                    </td>

                    <td className="px-5 py-3">
                      {tags.length === 0 ? (
                        <p className="text-neutral">—</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <p className="text-neutral-dark">
                        <span className="text-xs font-semibold text-neutral">Principal: </span>
                        {areaLabel(consultant.areaPrincipal)}
                      </p>
                      {consultant.areasAdicionais.length > 0 && (
                        <div className="mt-1 text-xs text-neutral">
                          <span className="font-semibold">Adicionais:</span>
                          <ul className="mt-0.5 space-y-0.5">
                            {consultant.areasAdicionais.map((area) => (
                              <li key={area.id}>{areaLabel(area)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                            consultant.ativo
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-neutral-light bg-neutral-50 text-neutral"
                          }`}
                        >
                          {consultant.ativo ? <Check size={14} /> : <X size={14} />}
                          {consultant.ativo ? "Ativo" : "Inativo"}
                        </span>
                        <button
                          type="button"
                          onClick={() => void toggleActive(consultant)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {consultant.ativo ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(consultant)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 font-semibold"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(consultant)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </section>

      {modal && (
        <ConsultantFormModal
          editing={modal.editingId !== null}
          initialValues={modal.initialValues}
          saving={saving}
          error={actionError}
          onClose={closeModal}
          onSave={async (values) => {
            if (await saveConsultant(values, modal.editingId)) setModal(null)
          }}
        />
      )}
    </div>
  )
}
