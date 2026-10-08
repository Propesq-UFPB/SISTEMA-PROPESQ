import { ArrowLeft } from "lucide-react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import { CriteriaFilters } from "@/features/evaluation-criteria/components/CriteriaFilters"
import { CriteriaPageHeader } from "@/features/evaluation-criteria/components/CriteriaPageHeader"
import { CriteriaTable } from "@/features/evaluation-criteria/components/CriteriaTable"
import {
  CriterionFormModal,
  DeactivateCriterionDialog,
} from "@/features/evaluation-criteria/components/CriterionFormModal"
import { useEvaluationCriteria } from "@/features/evaluation-criteria/hooks/useEvaluationCriteria"

export default function EvaluationCriteria() {
  const {
    filter,
    changeFilter,
    offset,
    total,
    results,
    loading,
    loadError,
    actionError,
    saving,
    formOpen,
    editing,
    pendingDeactivate,
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    askDeactivate,
    cancelDeactivate,
    confirmDeactivate,
    goPrev,
    goNext,
    canPrev,
    canNext,
  } = useEvaluationCriteria()

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Critérios de Avaliação • PROPESQ</title>
      </Helmet>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Link
            to="/gestor/avaliacao/avaliadores"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para Avaliadores
          </Link>

          <CriteriaPageHeader />

          {loadError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </p>
          )}

          <section className="space-y-4 rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
            <CriteriaFilters filter={filter} onFilterChange={changeFilter} onCreate={openCreate} />
            <CriteriaTable
              rows={results}
              loading={loading}
              offset={offset}
              total={total}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={goPrev}
              onNext={goNext}
              onEdit={openEdit}
              onDeactivate={askDeactivate}
            />
          </section>
        </div>
      </div>

      {formOpen && (
        <CriterionFormModal
          editing={editing}
          saving={saving}
          formError={actionError}
          onClose={closeForm}
          onSubmit={submitForm}
        />
      )}

      {pendingDeactivate && (
        <DeactivateCriterionDialog
          nome={pendingDeactivate.nome}
          saving={saving}
          error={actionError}
          onCancel={cancelDeactivate}
          onConfirm={() => void confirmDeactivate()}
        />
      )}
    </div>
  )
}
