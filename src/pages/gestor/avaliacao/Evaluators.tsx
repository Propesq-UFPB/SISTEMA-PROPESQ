import { Helmet } from "react-helmet"
import { CallAssignmentsSection } from "@/features/evaluators/components/CallAssignmentsSection"
import { CallSelectorSection } from "@/features/evaluators/components/CallSelectorSection"
import { EvaluatorsBankSection } from "@/features/evaluators/components/EvaluatorsBankSection"
import { EvaluatorsPageHeader } from "@/features/evaluators/components/EvaluatorsPageHeader"
import { NotifyPendingSection } from "@/features/evaluators/components/NotifyPendingSection"
import { NotifyPreviewSection } from "@/features/evaluators/components/NotifyPreviewSection"
import { useGestorEvaluators } from "@/features/evaluators/hooks/useGestorEvaluators"

export default function Evaluators() {
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
      <Helmet>
        <title>Avaliadores • PROPESQ</title>
      </Helmet>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <EvaluatorsPageHeader
            evaluatorsCount={evaluatorsCount}
            activeCount={activeCount}
            externalCount={externalCount}
            pendingCount={pendingCount}
          />
          <CallSelectorSection
            callsSorted={callsSorted}
            selectedCallId={selectedCallId}
            onSelectedCallIdChange={setSelectedCallId}
            selectedCall={selectedCall}
            selectedCallAssignmentsCount={selectedCallAssignments.length}
          />
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
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
          </div>
          <CallAssignmentsSection
            assignments={selectedCallAssignments}
            projects={projects}
            evaluators={evaluators}
          />
        </div>
      </div>
    </div>
  )
}
