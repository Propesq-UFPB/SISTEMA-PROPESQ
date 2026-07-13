import { useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  Home,
  IdCard,
  Info,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserCheck,
  Users,
} from "lucide-react"

type IndicationStatus =
  | "Pendente de indicação"
  | "Discente indicado"
  | "Aguardando validação"
  | "Indicação aprovada"
  | "Indicação recusada"

type Modality = "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"

type CommitmentTermStatus =
  | "Não enviado"
  | "Aguardando aceite"
  | "Aceito na Plataforma Carlos Chagas"
  | "Pendente de correção"

type StudentDocument = {
  cpf: string
  rg: string
  rgIssueDate: string
  voterTitle: string
  voterZone: string
  voterSection: string
  militaryCertificate: string
  militaryCategory: string
  issuingAgency: string
}

type StudentAddress = {
  cep: string
  streetType: string
  street: string
  number: string
  complement: string
  neighborhood: string
  uf: string
  city: string
  country: string
}

type StudentContact = {
  phoneDdd: string
  phone: string
  mobileDdd: string
  mobile: string
  email: string
}

type StudentAcademic = {
  course: string
  campus: string
  period: string
  semester: string
  cra: string
  completedCredits: number
  failures: number
  academicStatus: string
  enrollmentStatus: string
}

type StudentSpecificNeed = {
  hasNeed: boolean
  type: string
}

type BankData = {
  bankName: string
  agency: string
  account: string
}

type Candidate = {
  id: number
  name: string
  registration: string
  birthDate: string
  sex: string
  race: string
  maritalStatus: string
  nationality: string
  naturalness: string
  bloodType: string
  fatherName: string
  motherName: string
  lattesUrl: string
  interestRegisteredAt: string
  sigaaStatus: "Interesse registrado" | "Documentação pendente" | "Apto para indicação"
  documents: StudentDocument
  address: StudentAddress
  contact: StudentContact
  academic: StudentAcademic
  specificNeed: StudentSpecificNeed
}

type IndicationPlan = {
  id: number
  projectId: number
  projectTitle: string
  planTitle: string
  edital: string
  ano: string
  area: string
  modality: Modality
  vacancies: number
  workload: number
  status: IndicationStatus
  approvedAt: string
  validityStart: string
  validityEnd: string
  indicationDeadline: string
  substitutionDeadline: string
  commitmentTermStatus: CommitmentTermStatus
  indicatedStudent: Candidate | null
  indicationType: "Bolsista" | "Voluntário" | null
  bankData: BankData | null
  candidates: Candidate[]
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Ana Beatriz Santos",
    registration: "20230014567",
    birthDate: "25/04/2004",
    sex: "F",
    race: "Parda",
    maritalStatus: "Solteira",
    nationality: "Brasileira",
    naturalness: "João Pessoa/PB",
    bloodType: "A+",
    fatherName: "Carlos Alberto Santos",
    motherName: "Maria José Santos",
    lattesUrl: "https://lattes.cnpq.br/0000000000000001",
    interestRegisteredAt: "12/05/2026",
    sigaaStatus: "Apto para indicação",
    documents: {
      cpf: "000.000.000-00",
      rg: "0000000",
      rgIssueDate: "10/05/2019",
      voterTitle: "000000000000",
      voterZone: "001",
      voterSection: "002",
      militaryCertificate: "-",
      militaryCategory: "-",
      issuingAgency: "SSP/PB",
    },
    address: {
      cep: "58000-000",
      streetType: "Rua",
      street: "Rua Exemplo",
      number: "32",
      complement: "",
      neighborhood: "Centro",
      uf: "Paraíba",
      city: "João Pessoa",
      country: "Brasil",
    },
    contact: {
      phoneDdd: "83",
      phone: "0000-0000",
      mobileDdd: "83",
      mobile: "90000-0000",
      email: "ana.beatriz@academico.ufpb.br",
    },
    academic: {
      course: "Ciência da Computação",
      campus: "João Pessoa",
      period: "5º período",
      semester: "2026.1",
      cra: "8.7",
      completedCredits: 112,
      failures: 0,
      academicStatus: "Regular",
      enrollmentStatus: "Ativo",
    },
    specificNeed: {
      hasNeed: false,
      type: "",
    },
  },
  {
    id: 2,
    name: "João Victor Almeida",
    registration: "20220017890",
    birthDate: "18/09/2003",
    sex: "M",
    race: "Branca",
    maritalStatus: "Solteiro",
    nationality: "Brasileira",
    naturalness: "Santa Rita/PB",
    bloodType: "O+",
    fatherName: "José Almeida",
    motherName: "Francisca Almeida",
    lattesUrl: "https://lattes.cnpq.br/0000000000000002",
    interestRegisteredAt: "13/05/2026",
    sigaaStatus: "Apto para indicação",
    documents: {
      cpf: "111.111.111-11",
      rg: "1111111",
      rgIssueDate: "12/08/2018",
      voterTitle: "111111111111",
      voterZone: "003",
      voterSection: "004",
      militaryCertificate: "111111",
      militaryCategory: "Dispensado",
      issuingAgency: "SSP/PB",
    },
    address: {
      cep: "58300-000",
      streetType: "Avenida",
      street: "Avenida Central",
      number: "100",
      complement: "Apto 202",
      neighborhood: "Municípios",
      uf: "Paraíba",
      city: "Santa Rita",
      country: "Brasil",
    },
    contact: {
      phoneDdd: "83",
      phone: "3333-3333",
      mobileDdd: "83",
      mobile: "98888-8888",
      email: "joao.victor@academico.ufpb.br",
    },
    academic: {
      course: "Ciência de Dados e Inteligência Artificial",
      campus: "João Pessoa",
      period: "6º período",
      semester: "2026.1",
      cra: "8.4",
      completedCredits: 138,
      failures: 1,
      academicStatus: "Regular",
      enrollmentStatus: "Ativo",
    },
    specificNeed: {
      hasNeed: false,
      type: "",
    },
  },
]

const plans: IndicationPlan[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Interação Humano-Computador",
    modality: "Bolsista",
    vacancies: 1,
    workload: 20,
    status: "Pendente de indicação",
    approvedAt: "10/05/2026",
    validityStart: "01/09/2026",
    validityEnd: "31/08/2027",
    indicationDeadline: "01/10/2026",
    substitutionDeadline: "10/06/2027",
    commitmentTermStatus: "Não enviado",
    indicatedStudent: null,
    indicationType: null,
    bankData: null,
    candidates: [candidates[0], candidates[1]],
  },
]

function getSigaaStatusClass(status: Candidate["sigaaStatus"]) {
  switch (status) {
    case "Apto para indicação":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Documentação pendente":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Interesse registrado":
    default:
      return "border-blue-200 bg-blue-50 text-blue-700"
  }
}

function getStatusClass(status: IndicationStatus) {
  switch (status) {
    case "Indicação aprovada":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aguardando validação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Discente indicado":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Indicação recusada":
      return "border-red-200 bg-red-50 text-red-700"
    case "Pendente de indicação":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

export default function CoordinatorIndicationDetails() {
  const { planId } = useParams()
  const [searchParams] = useSearchParams()

  const plan = useMemo(() => {
    return plans.find((item) => String(item.id) === String(planId)) ?? null
  }, [planId])

  const initialCandidateId = Number(searchParams.get("candidateId"))

  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    Number.isFinite(initialCandidateId) && initialCandidateId > 0
      ? initialCandidateId
      : plan?.candidates[0]?.id ?? null
  )

  const [indicationType, setIndicationType] = useState<"Bolsista" | "Voluntário">(
    plan?.modality === "Voluntário" ? "Voluntário" : "Bolsista"
  )

  const [bankName, setBankName] = useState(plan?.bankData?.bankName ?? "")
  const [bankAgency, setBankAgency] = useState(plan?.bankData?.agency ?? "")
  const [bankAccount, setBankAccount] = useState(plan?.bankData?.account ?? "")
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null)

  const selectedCandidate = useMemo(() => {
    return plan?.candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null
  }, [plan, selectedCandidateId])

  function handleSubmit() {
    const needsBankData = indicationType === "Bolsista"

    if (!selectedCandidate || (needsBankData && (!bankName || !bankAgency || !bankAccount))) {
      setFeedback("error")
      return
    }

    setFeedback("success")
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#F3F4F6]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <section className="rounded-2xl border border-neutral/30 bg-white p-8 text-center">
            <AlertCircle className="mx-auto text-amber-600" size={36} />

            <h1 className="mt-4 text-xl font-bold text-primary">
              Plano não encontrado
            </h1>

            <p className="mt-2 text-sm text-neutral">
              Não foi possível localizar o plano selecionado para indicação.
            </p>

            <Link
              to="/coordenador/indicacoes"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <ArrowLeft size={16} />
              Voltar para indicações
            </Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              to="/coordenador/indicacoes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              <ArrowLeft size={16} />
              Voltar para indicações
            </Link>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <UserCheck size={14} />
              Indicação de discente
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Detalhes do Plano e do Discente
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Consulte os dados acadêmicos e cadastrais do discente interessado antes de confirmar a indicação.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
              plan.status
            )}`}
          >
            <ClipboardList size={14} />
            {plan.status}
          </div>
        </section>

        {feedback === "success" && (
          <AlertBox
            type="success"
            title="Indicação registrada"
            description="A indicação foi registrada no protótipo e ficará aguardando validação."
          />
        )}

        {feedback === "error" && (
          <AlertBox
            type="warning"
            title="Campos obrigatórios pendentes"
            description="Selecione um discente e preencha os dados bancários quando a indicação for de bolsista."
          />
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<ClipboardList size={20} />}
                title="Plano de trabalho"
                subtitle="Dados do plano aprovado"
              />

              <div className="space-y-4">
                <InfoRow label="Plano" value={plan.planTitle} />
                <InfoRow label="Projeto" value={plan.projectTitle} />
                <InfoRow label="Edital" value={`${plan.edital} • ${plan.ano}`} />
                <InfoRow label="Área" value={plan.area} />
                <InfoRow label="Modalidade" value={plan.modality} />
                <InfoRow label="Carga semanal" value={`${plan.workload}h`} />
                <InfoRow label="Vigência" value={`${plan.validityStart} a ${plan.validityEnd}`} />
                <InfoRow label="Prazo de indicação" value={plan.indicationDeadline} />
                <InfoRow label="Prazo de substituição" value={plan.substitutionDeadline} />
              </div>
            </section>

            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <SectionTitle
                icon={<Users size={20} />}
                title="Discentes interessados"
                subtitle="Selecione o discente que será indicado"
              />

              <div className="space-y-3">
                {plan.candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedCandidateId === candidate.id
                        ? "border-primary bg-primary/5"
                        : "border-neutral/20 bg-white hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {candidate.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-neutral">
                          {candidate.registration}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-neutral">
                          {candidate.academic.course}
                        </p>
                      </div>

                      {selectedCandidateId === candidate.id && (
                        <CheckCircle2 size={18} className="shrink-0 text-primary" />
                      )}
                    </div>

                    <span
                      className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getSigaaStatusClass(
                        candidate.sigaaStatus
                      )}`}
                    >
                      {candidate.sigaaStatus}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            {selectedCandidate ? (
              <>
                <StudentHeader candidate={selectedCandidate} />

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<User size={20} />}
                    title="Dados pessoais"
                    subtitle="Informações cadastrais do discente"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow label="Matrícula" value={selectedCandidate.registration} />
                    <InfoRow label="Nome" value={selectedCandidate.name} />
                    <InfoRow label="Curso" value={selectedCandidate.academic.course} />
                    <InfoRow label="Sexo" value={selectedCandidate.sex} />
                    <InfoRow label="Data de nascimento" value={selectedCandidate.birthDate} />
                    <InfoRow label="Estado civil" value={selectedCandidate.maritalStatus} />
                    <InfoRow label="Raça" value={selectedCandidate.race} />
                    <InfoRow label="Naturalidade" value={selectedCandidate.naturalness} />
                    <InfoRow label="Nacionalidade" value={selectedCandidate.nationality} />
                    <InfoRow label="Tipo sanguíneo" value={selectedCandidate.bloodType} />
                    <InfoRow label="Filiação 1" value={selectedCandidate.motherName} />
                    <InfoRow label="Filiação 2" value={selectedCandidate.fatherName} />
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<ShieldCheck size={20} />}
                    title="Necessidades educacionais específicas"
                    subtitle="Registro informado no cadastro acadêmico"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow
                      label="Possui necessidade específica?"
                      value={selectedCandidate.specificNeed.hasNeed ? "Sim" : "Não"}
                    />
                    <InfoRow
                      label="Tipo de necessidade"
                      value={selectedCandidate.specificNeed.type || "Não informado"}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<IdCard size={20} />}
                    title="Documentos"
                    subtitle="Documentação do discente"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow label="CPF" value={selectedCandidate.documents.cpf} />
                    <InfoRow label="RG" value={selectedCandidate.documents.rg} />
                    <InfoRow label="Data de expedição do RG" value={selectedCandidate.documents.rgIssueDate} />
                    <InfoRow label="Órgão expedidor" value={selectedCandidate.documents.issuingAgency} />
                    <InfoRow label="Título de eleitor" value={selectedCandidate.documents.voterTitle} />
                    <InfoRow label="Zona" value={selectedCandidate.documents.voterZone} />
                    <InfoRow label="Seção" value={selectedCandidate.documents.voterSection} />
                    <InfoRow label="Certificado militar" value={selectedCandidate.documents.militaryCertificate} />
                    <InfoRow label="Categoria" value={selectedCandidate.documents.militaryCategory} />
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<Home size={20} />}
                    title="Endereço"
                    subtitle="Endereço cadastrado pelo discente"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow label="CEP" value={selectedCandidate.address.cep} />
                    <InfoRow label="Logradouro" value={`${selectedCandidate.address.streetType} ${selectedCandidate.address.street}`} />
                    <InfoRow label="Número" value={selectedCandidate.address.number} />
                    <InfoRow label="Complemento" value={selectedCandidate.address.complement || "Não informado"} />
                    <InfoRow label="Bairro" value={selectedCandidate.address.neighborhood} />
                    <InfoRow label="UF" value={selectedCandidate.address.uf} />
                    <InfoRow label="Município" value={selectedCandidate.address.city} />
                    <InfoRow label="País" value={selectedCandidate.address.country} />
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<Phone size={20} />}
                    title="Contatos"
                    subtitle="Dados para comunicação"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow
                      label="Telefone"
                      value={`(${selectedCandidate.contact.phoneDdd}) ${selectedCandidate.contact.phone}`}
                    />
                    <InfoRow
                      label="Celular"
                      value={`(${selectedCandidate.contact.mobileDdd}) ${selectedCandidate.contact.mobile}`}
                    />
                    <InfoRow label="E-mail" value={selectedCandidate.contact.email} />
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<GraduationCap size={20} />}
                    title="Dados acadêmicos"
                    subtitle="Situação acadêmica do discente"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow label="Curso" value={selectedCandidate.academic.course} />
                    <InfoRow label="Campus" value={selectedCandidate.academic.campus} />
                    <InfoRow label="Período" value={selectedCandidate.academic.period} />
                    <InfoRow label="Semestre de referência" value={selectedCandidate.academic.semester} />
                    <InfoRow label="CRA" value={selectedCandidate.academic.cra} />
                    <InfoRow label="Créditos integralizados" value={`${selectedCandidate.academic.completedCredits}`} />
                    <InfoRow label="Reprovações" value={`${selectedCandidate.academic.failures}`} />
                    <InfoRow label="Situação acadêmica" value={selectedCandidate.academic.academicStatus} />
                    <InfoRow label="Situação da matrícula" value={selectedCandidate.academic.enrollmentStatus} />
                  </div>

                  <a
                    href={selectedCandidate.lattesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
                  >
                    Ver Currículo Lattes
                    <ExternalLink size={16} />
                  </a>
                </section>

                <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                  <SectionTitle
                    icon={<Banknote size={20} />}
                    title="Registrar indicação"
                    subtitle="Confirme o tipo de vínculo e os dados bancários quando houver bolsa"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClassName}>
                        Tipo de indicação
                      </label>

                      <select
                        value={indicationType}
                        onChange={(event) =>
                          setIndicationType(event.target.value as "Bolsista" | "Voluntário")
                        }
                        className={inputClassName}
                      >
                        {(plan.modality === "Bolsista" || plan.modality === "Bolsista ou Voluntário") && (
                          <option value="Bolsista">
                            Bolsista
                          </option>
                        )}

                        {(plan.modality === "Voluntário" || plan.modality === "Bolsista ou Voluntário") && (
                          <option value="Voluntário">
                            Voluntário
                          </option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Discente selecionado
                      </label>

                      <input
                        type="text"
                        value={`${selectedCandidate.name} — ${selectedCandidate.registration}`}
                        readOnly
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  {indicationType === "Bolsista" && (
                    <div className="mt-5 rounded-2xl border border-neutral/20 bg-neutral/5 p-5">
                      <div className="mb-4 flex items-start gap-3">
                        <Info size={18} className="mt-0.5 shrink-0 text-primary" />

                        <div>
                          <p className="text-sm font-semibold text-primary">
                            Dados bancários obrigatórios para bolsista
                          </p>

                          <p className="mt-1 text-sm leading-6 text-neutral">
                            Esses dados serão usados para compor a indicação do discente bolsista.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className={labelClassName}>
                            Banco <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            value={bankName}
                            onChange={(event) => setBankName(event.target.value)}
                            placeholder="Ex.: Banco do Brasil"
                            className={inputClassName}
                          />
                        </div>

                        <div>
                          <label className={labelClassName}>
                            Agência <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            value={bankAgency}
                            onChange={(event) => setBankAgency(event.target.value)}
                            placeholder="Ex.: 1234-5"
                            className={inputClassName}
                          />
                        </div>

                        <div>
                          <label className={labelClassName}>
                            Conta <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            value={bankAccount}
                            onChange={(event) => setBankAccount(event.target.value)}
                            placeholder="Ex.: 98765-4"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Link
                      to="/coordenador/indicacoes"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                    >
                      Cancelar
                    </Link>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                    >
                      <Save size={16} />
                      Confirmar indicação
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <section className="rounded-2xl border border-neutral/30 bg-white p-8 text-center">
                <Users className="mx-auto text-neutral" size={36} />

                <h2 className="mt-4 text-lg font-semibold text-primary">
                  Nenhum discente selecionado
                </h2>

                <p className="mt-2 text-sm text-neutral">
                  Selecione um dos discentes interessados para visualizar os detalhes.
                </p>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function StudentHeader({ candidate }: { candidate: Candidate }) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User size={26} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-primary">
                {candidate.name}
              </h2>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getSigaaStatusClass(
                  candidate.sigaaStatus
                )}`}
              >
                {candidate.sigaaStatus}
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-neutral">
              Matrícula {candidate.registration} • {candidate.academic.course}
            </p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} />
                CRA {candidate.academic.cra}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                Interesse em {candidate.interestRegisteredAt}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} />
                {candidate.contact.email}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {candidate.address.city}/{candidate.address.uf}
              </span>
            </div>
          </div>
        </div>

        <a
          href={candidate.lattesUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
        >
          Lattes
          <ExternalLink size={16} />
        </a>
      </div>
    </section>
  )
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-primary">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-neutral">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium leading-6 text-primary">
        {value || "Não informado"}
      </p>
    </div>
  )
}

function AlertBox({
  type,
  title,
  description,
}: {
  type: "success" | "warning"
  title: string
  description: string
}) {
  const styles = {
    success: {
      wrapper: "border-emerald-200 bg-emerald-50",
      icon: "text-emerald-700",
      title: "text-emerald-800",
      description: "text-emerald-700",
      iconNode: <CheckCircle2 size={18} />,
    },
    warning: {
      wrapper: "border-amber-200 bg-amber-50",
      icon: "text-amber-700",
      title: "text-amber-800",
      description: "text-amber-700",
      iconNode: <AlertCircle size={18} />,
    },
  }[type]

  return (
    <section className={`rounded-2xl border px-5 py-4 ${styles.wrapper}`}>
      <div className="flex gap-3">
        <div className={`mt-0.5 ${styles.icon}`}>
          {styles.iconNode}
        </div>

        <div>
          <p className={`text-sm font-semibold ${styles.title}`}>
            {title}
          </p>

          <p className={`mt-1 text-sm leading-6 ${styles.description}`}>
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}