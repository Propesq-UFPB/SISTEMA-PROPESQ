import { useEffect, useState } from "react"
import type { EditalLookup } from "@/features/editais"
import { projectService } from "../api/projectService"
import type {
  KnowledgeAreaLookup,
  LookupOption,
  MemberLookupBundle,
  ResearchGroupLookup,
  ResearchUserLookup,
} from "../types/project"
import type {
  FormState,
  ODS,
  ProjectMember,
  Step,
} from "../types/projectFormWizard"
import {
  canAdvanceFromStep,
  checkCanGoStep2,
  checkCanGoStep3,
  checkCanGoStep4,
  checkCanGoStep5,
  checkCanGoStep6,
  checkStepDone,
  createId,
  getErrorMessage,
  getScheduleMonth,
  initialMember,
  initialState,
  isSimpleEmail,
  splitKeywords,
  validateProjectAttachment,
} from "../utils/projectFormHelpers"

export function useProjectFormWizard() {
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [form, setForm] = useState<FormState>(initialState)
  const [memberDraft, setMemberDraft] = useState<ProjectMember>({
    ...initialMember,
    id: createId("membro"),
  })
  const [editaisLookup, setEditaisLookup] = useState<EditalLookup[]>([])
  const [academicUnits, setAcademicUnits] = useState<LookupOption<number>[]>([])
  const [grandesAreasLookup, setGrandesAreasLookup] = useState<
    KnowledgeAreaLookup[]
  >([])
  const [areasLookup, setAreasLookup] = useState<KnowledgeAreaLookup[]>([])
  const [subareasLookup, setSubareasLookup] = useState<KnowledgeAreaLookup[]>(
    [],
  )
  const [especialidadesLookup, setEspecialidadesLookup] = useState<
    KnowledgeAreaLookup[]
  >([])
  const [odsOptions, setOdsOptions] = useState<ODS[]>([])
  const [researchGroups, setResearchGroups] = useState<ResearchGroupLookup[]>(
    [],
  )
  const [memberLookups, setMemberLookups] = useState<MemberLookupBundle | null>(
    null,
  )
  const [userOptions, setUserOptions] = useState<ResearchUserLookup[]>([])

  useEffect(() => {
    let cancelled = false

    void Promise.all([
      projectService.editalLookup(),
      projectService.academicUnitLookup(),
      projectService.knowledgeAreaLookup(),
      projectService.sustainableDevelopmentGoalsLookup(),
      projectService.researchGroupLookup(),
      projectService.memberLookups(),
    ])
      .then(
        ([
          editais,
          units,
          knowledgeAreas,
          sustainableGoals,
          groups,
          members,
        ]) => {
          if (cancelled) return
          setEditaisLookup(editais)
          setAcademicUnits(units)
          setGrandesAreasLookup(knowledgeAreas)
          setOdsOptions(
            sustainableGoals.map((item) => ({ id: item.id, label: item.name })),
          )
          setResearchGroups(groups)
          setMemberLookups(members)
        },
      )
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(
              error,
              "Não foi possível carregar os dados do formulário.",
            ),
          )
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!form.gerais.grandeArea) {
      setAreasLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({ grande_area: form.gerais.grandeArea })
      .then((items) => {
        if (!cancelled) setAreasLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(error, "Erro ao carregar áreas de conhecimento."),
          )
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea])

  useEffect(() => {
    if (!form.gerais.area) {
      setSubareasLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({
        grande_area: form.gerais.grandeArea,
        area: form.gerais.area,
      })
      .then((items) => {
        if (!cancelled) setSubareasLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(getErrorMessage(error, "Erro ao carregar subáreas."))
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea, form.gerais.area])

  useEffect(() => {
    if (!form.gerais.subarea) {
      setEspecialidadesLookup([])
      return
    }
    let cancelled = false
    void projectService
      .knowledgeAreaLookup({
        grande_area: form.gerais.grandeArea,
        area: form.gerais.area,
        sub_area: form.gerais.subarea,
      })
      .then((items) => {
        if (!cancelled) setEspecialidadesLookup(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(
            getErrorMessage(error, "Erro ao carregar especialidades."),
          )
      })
    return () => {
      cancelled = true
    }
  }, [form.gerais.grandeArea, form.gerais.area, form.gerais.subarea])

  useEffect(() => {
    if (!memberDraft.categoria || memberDraft.categoria === "EXTERNO") {
      setUserOptions([])
      return
    }
    let cancelled = false
    void projectService
      .userLookup({ funcao: memberDraft.categoria })
      .then((items) => {
        if (!cancelled) setUserOptions(items)
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setSubmitError(getErrorMessage(error, "Erro ao carregar usuários."))
      })
    return () => {
      cancelled = true
    }
  }, [memberDraft.categoria])

  const canGoStep2 = checkCanGoStep2(form)
  const canGoStep3 = checkCanGoStep3(form, canGoStep2)
  const canGoStep4 = checkCanGoStep4(form, canGoStep3)
  const canGoStep5 = checkCanGoStep5(form, canGoStep4)
  const canGoStep6 = checkCanGoStep6(form, canGoStep5)
  const stepFlags = {
    canGoStep2,
    canGoStep3,
    canGoStep4,
    canGoStep5,
    canGoStep6,
    submitted,
  }

  const baseMemberValid = Boolean(
    memberDraft.categoria &&
      memberDraft.papel &&
      Number(memberDraft.cargaHoraria) > 0,
  )
  let canAddMember = false
  if (baseMemberValid && memberDraft.categoria === "EXTERNO") {
    canAddMember = Boolean(
      memberDraft.nome.trim() &&
        isSimpleEmail(memberDraft.email.trim()) &&
        memberDraft.sexo &&
        memberDraft.formacao &&
        memberDraft.tipoExterno,
    )
  } else if (baseMemberValid) {
    canAddMember = Boolean(
      memberDraft.userId &&
        !form.gerais.membros.some(
          (member) => member.userId === memberDraft.userId,
        ),
    )
  }

  function stepDone(currentStep: Step) {
    return checkStepDone(currentStep, stepFlags)
  }

  function goNext() {
    if (!canAdvanceFromStep(step, stepFlags)) return

    setStep((current) => (current < 6 ? ((current + 1) as Step) : current))
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current))
  }

  function resetMemberDraft() {
    setMemberDraft({
      ...initialMember,
      id: createId("membro"),
    })
  }

  function addMember() {
    if (!canAddMember) return

    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: [
          ...current.gerais.membros,
          {
            ...memberDraft,
            id: memberDraft.id || createId("membro"),
          },
        ],
      },
    }))

    resetMemberDraft()
  }

  function removeMember(id: string) {
    setForm((current) => ({
      ...current,
      gerais: {
        ...current.gerais,
        membros: current.gerais.membros.filter((membro) => membro.id !== id),
      },
    }))
  }

  async function submit() {
    if (!canGoStep6) return

    setSaving(true)
    setSubmitError("")

    try {
      const attachment =
        form.gerais.pdfComplementar ?? form.gerais.comprovanteExterno
      const attachmentError = validateProjectAttachment(attachment)
      if (attachmentError) throw new Error(attachmentError)

      const internalMembers = form.gerais.membros
        .filter((member) => member.categoria !== "EXTERNO")
        .map((member) => ({
          user_id: Number(member.userId),
          funcao: member.papel,
          ch_dedicadas: Number(member.cargaHoraria),
        }))
      const externalMembers = form.gerais.membros
        .filter((member) => member.categoria === "EXTERNO")
        .map((member) => ({
          funcao: member.papel,
          ch_dedicada: Number(member.cargaHoraria),
          ...(member.cpf.trim() && { cpf: member.cpf.trim() }),
          nome: member.nome.trim(),
          email: member.email.trim(),
          sexo: member.sexo,
          formacao: member.formacao,
          tipo: member.tipoExterno,
        }))

      const created = createdProjectId
        ? { id: createdProjectId }
        : await projectService.create({
            tipo: form.gerais.tipo === "interno" ? "INTERNO" : "EXTERNO",
            titulo: form.gerais.titulo.trim(),
            title: form.gerais.title.trim(),
            edital_id: Number(form.gerais.editalPesquisa),
            vigencia: form.gerais.periodoFim,
            data_inicio: form.gerais.periodoIni,
            data_fim: form.gerais.periodoFim,
            email: form.gerais.email.trim(),
            palavras_chave: splitKeywords(form.gerais.palavrasChave),
            key_words: splitKeywords(form.gerais.keywords),
            pesquisa_objetivo_ids: form.gerais.objetivosDS.map(
              (item) => item.id,
            ),
            corpo_projeto: {
              resumo: form.gerais.descricaoResumida.trim(),
              abstract: form.gerais.abstract.trim(),
              introducao: form.gerais.introducaoJustificativa.trim(),
              objetivos: form.gerais.objetivos.trim(),
              metodologia: form.gerais.metodologia.trim(),
              resultados_esperados: form.gerais.resultadosEsperados.trim(),
              referencias: form.gerais.referencias.trim(),
            },
            atividades: form.gerais.cronograma.map((item) => ({
              descricao: item.atividade.trim(),
              meses: Array.from(
                { length: item.mesFim - item.mesInicio + 1 },
                (_, index) => ({
                  data: getScheduleMonth(
                    form.gerais.periodoIni,
                    item.mesInicio + index,
                  ),
                }),
              ),
            })),
            unidade_id: Number(form.gerais.unidade),
            area_conhecimento_id: Number(form.gerais.areaConhecimento),
            linha_pesquisa: form.gerais.linhaPesquisa.trim(),
            vinculado_grupo_pesquisa: form.interno.vinculadoGrupo === "Sim",
            ...(form.interno.vinculadoGrupo === "Sim" && {
              grupo_pesquisa_id: Number(form.interno.grupoPesquisa),
            }),
            possui_comite_etica: form.interno.possuiProtocoloEtica === "Sim",
            ...(form.interno.possuiProtocoloEtica === "Sim" && {
              comite_etica: form.interno.comiteEticaNome.trim(),
              numero_protocolo: form.interno.protocoloEtica.trim(),
            }),
            membros: internalMembers,
            membros_externos: externalMembers,
          })

      setCreatedProjectId(created.id)
      if (attachment)
        await projectService.uploadAttachment(created.id, attachment)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Não foi possível cadastrar o projeto."),
      )
    } finally {
      setSaving(false)
    }
  }

  return {
    step,
    setStep,
    saving,
    submitted,
    setSubmitted,
    createdProjectId,
    setCreatedProjectId,
    submitError,
    form,
    setForm,
    memberDraft,
    setMemberDraft,
    editaisLookup,
    academicUnits,
    grandesAreasLookup,
    areasLookup,
    subareasLookup,
    especialidadesLookup,
    odsOptions,
    researchGroups,
    memberLookups,
    userOptions,
    canGoStep2,
    canGoStep3,
    canGoStep4,
    canGoStep5,
    canGoStep6,
    canAddMember,
    stepDone,
    goNext,
    goBack,
    resetMemberDraft,
    addMember,
    removeMember,
    submit,
  }
}
