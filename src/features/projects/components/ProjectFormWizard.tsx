import { Link } from "react-router-dom"
import { ArrowLeft, FileText } from "lucide-react"
import { Helmet } from "react-helmet"
import { useProjectFormWizard } from "../hooks/useProjectFormWizard"
import type { Step } from "../types/projectFormWizard"
import { StepPill } from "./formPrimitives"
import { WizardStep1Tipo } from "./WizardStep1Tipo"
import { WizardStep2Anexo } from "./WizardStep2Anexo"
import { WizardStep3Ods } from "./WizardStep3Ods"
import { WizardStep4Membros } from "./WizardStep4Membros"
import { WizardStep5Especifico } from "./WizardStep5Especifico"
import { WizardStep6Revisao } from "./WizardStep6Revisao"

export type ProjectFormWizardProps = {
  backTo: string
  pageTitle?: string
  heading?: string
}

const STEP_PILLS: Array<{ step: Step; label: string }> = [
  { step: 1, label: "1. Tipo" },
  { step: 2, label: "2. Anexo II" },
  { step: 3, label: "3. ODS e cronograma" },
  { step: 4, label: "4. Membros e uploads" },
  { step: 5, label: "5. Específico" },
  { step: 6, label: "6. Revisão" },
]

function lookupName(
  items: Array<{ id: number; name: string }>,
  rawId: string,
): string {
  return items.find((item) => item.id === Number(rawId))?.name ?? ""
}

export default function ProjectFormWizard({
  backTo,
  pageTitle = "Cadastrar Projetos • PROPESQ",
  heading = "Cadastrar projeto",
}: Readonly<ProjectFormWizardProps>) {
  const wizard = useProjectFormWizard()

  const editalName = lookupName(
    wizard.editaisLookup,
    wizard.form.gerais.editalPesquisa,
  )
  const unidadeName = lookupName(
    wizard.academicUnits,
    wizard.form.gerais.unidade,
  )
  const grupoName = lookupName(
    wizard.researchGroups,
    wizard.form.interno.grupoPesquisa,
  )

  let stepContent = null
  switch (wizard.step) {
    case 1:
      stepContent = (
        <WizardStep1Tipo
          form={wizard.form}
          setForm={wizard.setForm}
          goNext={wizard.goNext}
          canGoStep2={wizard.canGoStep2}
        />
      )
      break
    case 2:
      stepContent = (
        <WizardStep2Anexo
          form={wizard.form}
          setForm={wizard.setForm}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          canGoStep3={wizard.canGoStep3}
          editais={wizard.editaisLookup}
          unidadesAcademicas={wizard.academicUnits}
          grandesAreasLookup={wizard.grandesAreasLookup}
          areasLookup={wizard.areasLookup}
          subareasLookup={wizard.subareasLookup}
          especialidadesLookup={wizard.especialidadesLookup}
          submitError={wizard.submitError}
        />
      )
      break
    case 3:
      stepContent = (
        <WizardStep3Ods
          form={wizard.form}
          setForm={wizard.setForm}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          canGoStep4={wizard.canGoStep4}
          odsOptions={wizard.odsOptions}
        />
      )
      break
    case 4:
      stepContent = (
        <WizardStep4Membros
          form={wizard.form}
          setForm={wizard.setForm}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          canGoStep5={wizard.canGoStep5}
          memberDraft={wizard.memberDraft}
          setMemberDraft={wizard.setMemberDraft}
          memberLookups={wizard.memberLookups}
          userOptions={wizard.userOptions}
          addMember={wizard.addMember}
          removeMember={wizard.removeMember}
          canAddMember={wizard.canAddMember}
          resetMemberDraft={wizard.resetMemberDraft}
        />
      )
      break
    case 5:
      stepContent = (
        <WizardStep5Especifico
          form={wizard.form}
          setForm={wizard.setForm}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          canGoStep6={wizard.canGoStep6}
          researchGroups={wizard.researchGroups}
        />
      )
      break
    case 6:
      stepContent = (
        <WizardStep6Revisao
          form={wizard.form}
          goBack={wizard.goBack}
          submit={wizard.submit}
          saving={wizard.saving}
          submitted={wizard.submitted}
          canGoStep6={wizard.canGoStep6}
          backTo={backTo}
          setForm={wizard.setForm}
          setSubmitted={wizard.setSubmitted}
          setCreatedProjectId={wizard.setCreatedProjectId}
          setStep={wizard.setStep}
          resetMemberDraft={wizard.resetMemberDraft}
          editalName={editalName}
          unidadeName={unidadeName}
          grupoName={grupoName}
          memberLookups={wizard.memberLookups}
        />
      )
      break
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <div className="flex items-center justify-between">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-light bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileText size={14} />
              Cadastro de projeto
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              {heading}
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Preencha os campos do Anexo II, vincule ODS, cronograma, membros e
              documentos complementares. Ao submeter, o projeto entra com status
              inicial{" "}
              <span className="font-semibold text-primary">SUBMETIDO</span>.
            </p>
          </div>

          <div className="hidden max-w-xl flex-wrap items-center justify-end gap-2 md:flex">
            {STEP_PILLS.map(({ step, label }) => (
              <StepPill
                key={step}
                active={wizard.step === step}
                done={wizard.stepDone(step)}
              >
                {label}
              </StepPill>
            ))}
          </div>
        </div>

        {wizard.submitError && wizard.step !== 2 && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
            role="alert"
          >
            {wizard.submitError}
          </div>
        )}

        {stepContent}

        <div className="flex justify-center pt-2">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-neutral/5"
          >
            Finalizar e voltar para projetos
          </Link>
        </div>
      </div>
    </main>
  )
}
