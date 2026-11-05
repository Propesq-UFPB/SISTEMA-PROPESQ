import { Helmet } from "react-helmet"
import { CallAssignmentsSection } from "@/features/evaluators/components/CallAssignmentsSection"
import { CallSelectorSection } from "@/features/evaluators/components/CallSelectorSection"
import { EvaluatorsBankSection } from "@/features/evaluators/components/EvaluatorsBankSection"
import { EvaluatorsPageHeader } from "@/features/evaluators/components/EvaluatorsPageHeader"
import { NotifyPendingSection } from "@/features/evaluators/components/NotifyPendingSection"
import { NotifyPreviewSection } from "@/features/evaluators/components/NotifyPreviewSection"
import { useGestorEvaluators } from "@/features/evaluators/hooks/useGestorEvaluators"

export default function GestorEvaluationDistribution() {
  const {
    selectedCallId,
    setSelectedCallId,
    selectedCall,
    callsSorted,
    selectedCallAssignments,
    evaluators,
    evaluatorsCount,
    activeCount,
    externalCount,
    pendingCount,
    projects,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredEvaluators,
    notifyRole,
    toggleNotifyRole,
    mailSubject,
    setMailSubject,
    mailBody,
    setMailBody,
    notifyPreview,
    sendPendingNotifications,
    countAssignmentsFor,
    countPendingFor,
  } = useGestorEvaluators()

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Helmet>
          <title>Avaliadores • PROPESQ</title>
        </Helmet>

        <EvaluatorsPageHeader
          evaluatorsCount={evaluatorsCount}
          activeCount={activeCount}
          externalCount={externalCount}
          pendingCount={pendingCount}
          selector={
            <CallSelectorSection
              callsSorted={callsSorted}
              selectedCallId={selectedCallId}
              onSelectedCallIdChange={setSelectedCallId}
              selectedCall={selectedCall}
              selectedCallAssignmentsCount={selectedCallAssignments.length}
            />
          }
        />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <EvaluatorsBankSection
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              filteredEvaluators={filteredEvaluators}
              countAssignmentsFor={countAssignmentsFor}
              countPendingFor={countPendingFor}
            />

            <CallAssignmentsSection
              assignments={selectedCallAssignments}
              projects={projects}
              evaluators={evaluators}
            />
          </div>

          {/* Painel lateral: acompanha a rolagem das tabelas */}
          <aside className="space-y-6 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
            <NotifyPendingSection
              notifyPreviewCount={notifyPreview.length}
              onNotify={sendPendingNotifications}
              notifyRole={notifyRole}
              onToggleRole={toggleNotifyRole}
              mailSubject={mailSubject}
              onMailSubjectChange={setMailSubject}
              mailBody={mailBody}
              onMailBodyChange={setMailBody}
            />
            <NotifyPreviewSection notifyPreview={notifyPreview} />
          </aside>
        </div>
      </div>
    </div>
  )
}
