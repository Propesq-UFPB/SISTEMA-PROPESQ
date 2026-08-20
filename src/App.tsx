import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Landing
import LandingHome from "./landing"
import LandingLayout from "./landing/LandingLayout"
import NewsAll from "./landing/NewsAll"
import Who from "./landing/Who"

// Landing / Publications
import Publications from "./landing/Publications"
import Papers from "./landing/Papers"
import AwardedWorks from "./landing/AwardedWorks"

// Publisher Sistema
import LoginPublisher from "./publisher/LoginPublisher"
import NewsList from "./publisher/NewsList"
import NewsCreate from "./publisher/NewsCreate"
import NewsEdit from "./publisher/NewsEdit"
import NewsPreview from "./publisher/NewsPreview"
import CategoriesTags from "./publisher/CategoriesTags"
import UsersAndRoles from "./publisher/UsersAndRoles"

// Sistema
import AppHeader from "./components/AppHeader"
import Login from "./pages/Login"

// admin pages
import Dashboard from "./pages/adm/Dashboard"
import Evaluators from "./pages/adm/avaliacao/Evaluators"
import AdminEvaluationDistribution from "./pages/adm/avaliacao/AdminEvaluationDistribution"
import AdminIPIReport from "./pages/adm/avaliacao/AdminIPIReport"

import StudentReplacements from "./pages/adm/monitoring/StudentReplacements"
import ReportValidation from "./pages/adm/monitoring/ReportValidation"
import AdmCertificates from "./pages/adm/monitoring/AdmCertificates"

import CallsManagement from "./pages/adm/calls/CallsManagement"
import CreateCall from "./pages/adm/calls/CreateCall"
import CallSchedule from "./pages/adm/calls/CallSchedule"
import CallWorkflow from "./pages/adm/calls/CallWorkflow"
import AdmCallsManage from "./pages/adm/calls/Manage"

import AdmCallQuotas from "./pages/adm/resultados/Quotas"
import AdminAppeals from "./pages/adm/resultados/Appeals"
import AdminFinalRanking from "./pages/adm/resultados/AdminFinalRanking"

import GlobalSettings from "./pages/adm/settings/GlobalSettings"
import ScholarshipEntities from "./pages/adm/settings/ScholarshipEntities"
import AcademicUnits from "./pages/adm/settings/AcademicUnits"
import RolesDictionary from "./pages/adm/settings/RolesDictionary"
import UserTypes from "./pages/adm/settings/UserTypes"

import AdmProjectCommunication from "./pages/adm/projects/AdmProjectCommunication"
import AdmResearchModuleParameters from "./pages/adm/settings/Parameters"

import ProjectDetail from "./pages/adm/projects/ProjectDetail"
import ProjectCreateWizard from "./pages/adm/projects/ProjectCreateWizard"
import ProjectChangeStatus from "./pages/adm/projects/ProjectChangeStatus"
import ProjectViewEdit from "./pages/adm/projects/ProjectViewEdit"
import AdmProjects from "./pages/adm/projects/AdmProjects"


// discente pages
import DisDashboard from "./pages/discente/DisDashboard"

import ProfileView from "./pages/discente/perfil/ProfileView"
import ProfileEdit from "./pages/discente/perfil/ProfileEdit"
import Documents from "./pages/discente/perfil/DocumentsUpload"
import BankData from "./pages/discente/perfil/BankDataForm"

import DisProjects from "./pages/discente/projetos/MyProjects"
import DisProjectView from "./pages/discente/projetos/ProjectView"
import DisProjectConsult from "./pages/discente/projetos/ConsultProject"
import BondStatus from "./pages/discente/perfil/BondStatus"

import ReportsList from "./pages/discente/relatorios/ReportsList"
import PartialReportForm from "./pages/discente/relatorios/PartialReportForm"
import FinalReportForm from "./pages/discente/relatorios/FinalReportForm"
import ReportView from "./pages/discente/relatorios/ReportView"
// import ReportStatus from "./pages/discente/relatorios/ReportStatus"

import EnicSubmissionForm from "./pages/discente/enic/EnicSubmissionForm"
// import EnicSubmissionStatus from "./pages/discente/enic/EnicSubmissionStatus"
import EnicSubmissionView from "./pages/discente/enic/EnicSubmissionView"
import EnicSubmissionsList from "./pages/discente/enic/EnicSubmissionsList"
import TemplateModel from "./pages/discente/enic/TemplateModel"

// import NotificationsCenter from "./pages/discente/notificacoes/NotificationsCenter"
// import MessageThread from "./pages/discente/notificacoes/MessageThread"
// import MessagesInbox from "./pages/discente/notificacoes/MessagesInbox"

import CertificatesList from "./pages/discente/certificados/CertificatesList"
// import DisCertificateView from "./pages/discente/certificados/CertificateView"
import ParticipationHistory from "./pages/discente/certificados/ParticipationHistory"

import AvailablePlans from "./pages/discente/planos/AvailablePlans"
import PlanView from "./pages/discente/planos/PlanView"
// import InterestForm from "./pages/discente/planos/InterestForm"

import DisSettings from "./pages/discente/DisSettings"


// coordenador pages
import CoordinatorProjects from "./pages/coordenador/projetos/CoordinatorProjects"
import CoordinatorProjectForm from "./pages/coordenador/projetos/CoordinatorProjectForm"
import CoordinatorProjectView from "./pages/coordenador/projetos/CoordinatorProjectView"
import CoordinatorProjectEdit from "./pages/coordenador/projetos/CoordinatorProjectEdit"

import CoordinatorEditais from "./pages/coordenador/editais/CoordinatorEditais"

import CoordinatorEvaluations from "./pages/coordenador/avaliacoes/CoordinatorEvaluations"
import CoordinatorEvaluationDetail from "./pages/coordenador/avaliacoes/CoordinatorEvaluationDetail"

import CoordinatorProjectWorkPlanForm from "./pages/coordenador/planos/CoordinatorProjectWorkPlanForm"
import CoordinatorIndications from "./pages/coordenador/planos/CoordinatorIndications"
import CoordinatorWorkPlanDetails from "./pages/coordenador/planos/CoordinatorWorkPlanDetails"
import CoordinatorIndicationDetails from "./pages/coordenador/planos/CoordinatorIndicationDetails"

import CoordinatorReports from "./pages/coordenador/relatorios/CoordinatorReports"
import CoordinatorReportReview from "./pages/coordenador/relatorios/CoordinatorReportReview"

import CoordinatorProductionIPI from "./pages/coordenador/producao/CoordinatorProductionIPI"
import CoordinatorProductionResult from "./pages/coordenador/producao/CoordinatorProductionResult"

// gestor pages
import GestorUserTypes from "./pages/gestor/settings/GestorUserTypes"
import GestorScholarships from "./pages/gestor/settings/GestorScholarships"
// import GestorProjects from "./pages/gestor/projetos/GestorProjects"
// import GestorProjectViewEdit from "./pages/gestor/projetos/GestorProjectViewEdit"


import NotFound from "./pages/NotFound"


/* ================= SISTEMA PRINCIPAL ================= */

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
    <AppHeader />
    <main className="p-4 md:p-6">{children}</main>
  </div>
)

// Componente auxiliar
const RoleRedirect: React.FC = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "ADMINISTRADOR") return <Navigate to="/dashboard" replace />
  if (user.role === "GESTOR")         return <Navigate to="/dashboard" replace />
  if (user.role === "DISCENTE")      return <Navigate to="/discente/projetos" replace />
  if (user.role === "COORDENADOR")   return <Navigate to="/coordenador/projetos" replace />
  return <Navigate to="/login" replace />
}

/** Rotas de gestão de editais: só ADMINISTRADOR/GESTOR. */
const CallsAdminProtected: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "ADMINISTRADOR" || user.role === "GESTOR") {
    return <>{children}</>
  }
  if (user.role === "COORDENADOR") {
    return <Navigate to="/coordenador/editais" replace />
  }
  return <RoleRedirect />
}

/* ================= PUBLISHER  ================= */

const PUBLISHER_STORAGE_KEY = "publisher_session"

const PublisherProtected: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const raw = localStorage.getItem(PUBLISHER_STORAGE_KEY)
  const session = raw ? JSON.parse(raw) : null
  const ok = session?.role === "PUBLICADOR"
  if (!ok) return <Navigate to="/publisher/login" replace />
  return <>{children}</>
}


import PublisherHeader from "./publisher/PublisherHeader"
import GestorAcademicUnits from "./pages/gestor/settings/GestorAcademicUnits"
import GestorRoles from "./pages/gestor/settings/GestorRoles"
import GestorParameters from "./pages/gestor/settings/GestorParameters"
const PublisherShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-100">
    <PublisherHeader />
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6">
      {children}
    </main>
  </div>
)


/* ================= APP ================= */

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* LANDING PÚBLICA */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
          <Route path="/noticias" element={<NewsAll />} />
          <Route path="/publicações" element={<Publications />} />
          <Route path="/publications/anais" element={<Papers />} />
          <Route path="/publications/iniciados" element={<AwardedWorks />} />
          <Route path="/quem-somos" element={<Who />} />
        </Route>


        {/* 🔐 LOGIN (Sistema principal) */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 LOGIN (Publisher) */}
        <Route path="/publisher/login" element={<LoginPublisher />} />

        {/* PAINEL DE PUBLICADORES */}
        <Route path="/publisher" element={<PublisherProtected><PublisherShell><NewsList /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news" element={<PublisherProtected><PublisherShell><NewsList /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/new" element={<PublisherProtected><PublisherShell><NewsCreate /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/:id/edit" element={<PublisherProtected><PublisherShell><NewsEdit /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/news/:id/preview" element={<PublisherProtected><PublisherShell><NewsPreview /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/tags" element={<PublisherProtected><PublisherShell><CategoriesTags /></PublisherShell></PublisherProtected>} />
        <Route path="/publisher/users" element={<PublisherProtected><PublisherShell><UsersAndRoles /></PublisherShell></PublisherProtected>} />

        {/* SISTEMA */}
        <Route path="/dashboard" element={<Protected><Shell><Dashboard /></Shell></Protected>} />
        <Route path="/adm/avaliacao/avaliadores" element={<Protected><Shell><Evaluators /></Shell></Protected>} />
        <Route path="/adm/avaliacao/distribuicao" element={<Protected><Shell><AdminEvaluationDistribution /></Shell></Protected>} />
        <Route path="/adm/avaliacao/ipi" element={<Protected><Shell><AdminIPIReport /></Shell></Protected>} />

        <Route path="/adm/resultados/ranking" element={<Protected><Shell><AdminFinalRanking /></Shell></Protected>} />
        <Route path="/adm/resultados/quotas" element={<Protected><Shell><AdmCallQuotas /></Shell></Protected>} />
        <Route path="/adm/resultados/recursos" element={<Protected><Shell><AdminAppeals /></Shell></Protected>} />

        <Route path="/adm/monitoring/replacements" element={<Protected><Shell><StudentReplacements /></Shell></Protected>} />
        <Route path="/adm/monitoring/report-validation" element={<Protected><Shell><ReportValidation /></Shell></Protected>} />
        <Route path="/adm/monitoring/AdmCertificates" element={<Protected><Shell><AdmCertificates /></Shell></Protected>} />

        <Route path="/adm/calls" element={<Protected><CallsAdminProtected><Shell><CallsManagement /></Shell></CallsAdminProtected></Protected>} />
        <Route path="/adm/calls/CreateCall" element={<Protected><CallsAdminProtected><Shell><CreateCall /></Shell></CallsAdminProtected></Protected>} />
        <Route path="/adm/calls/Manage" element={<Protected><CallsAdminProtected><Shell><AdmCallsManage /></Shell></CallsAdminProtected></Protected>} />
        <Route path="/adm/calls/CallSchedule" element={<Protected><CallsAdminProtected><Shell><CallSchedule /></Shell></CallsAdminProtected></Protected>} />
        <Route path="/adm/calls/CallWorkflow" element={<Protected><CallsAdminProtected><Shell><CallWorkflow /></Shell></CallsAdminProtected></Protected>} />

        <Route path="/adm/settings" element={<Protected><Shell><GlobalSettings /></Shell></Protected>} />
        <Route path="/adm/settings/scholarships" element={<Protected><Shell><ScholarshipEntities /></Shell></Protected>} />
        <Route path="/adm/settings/academic-units" element={<Protected><Shell><AcademicUnits /></Shell></Protected>} />
        <Route path="/adm/settings/roles" element={<Protected><Shell><RolesDictionary /></Shell></Protected>} />
        <Route path="/adm/settings/user-types" element={<Protected><Shell><UserTypes /></Shell></Protected>} />
        <Route path="/adm/settings/parameters" element={<Protected><Shell><AdmResearchModuleParameters /></Shell></Protected>} />

        <Route path="/adm/projetos/comunicacao" element={<Protected><Shell><AdmProjectCommunication /></Shell></Protected>} />
        <Route path="/adm/projetos/detalhes-projetos" element={<Protected><Shell><ProjectDetail /></Shell></Protected>} />
        <Route path="/adm/projetos/novo" element={<Protected><Shell><ProjectCreateWizard /></Shell></Protected>} />
        <Route path="/adm/projetos/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/adm/projetos/:id/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/adm/projetos/:id/visualizar" element={<Protected><Shell><ProjectViewEdit /></Shell></Protected>} />
        <Route path="/adm/admprojetos" element={<Protected><Shell><AdmProjects /></Shell></Protected>} />

        {/* Discente */}
        <Route path="/discente/dashboard" element={<Protected><Shell><DisDashboard /></Shell></Protected>} />

        <Route path="/discente/perfil" element={<Protected><Shell><ProfileView /></Shell></Protected>} />
        <Route path="/discente/perfil/editar" element={<Protected><Shell><ProfileEdit /></Shell></Protected>} />
        <Route path="/discente/perfil/documentos" element={<Protected><Shell><Documents /></Shell></Protected>} />
        <Route path="/discente/perfil/dados-bancarios" element={<Protected><Shell><BankData /></Shell></Protected>} />

        <Route path="/discente/projetos" element={<Protected><Shell><DisProjects /></Shell></Protected>} />
        <Route path="/discente/projetos/consultar" element={<Protected><Shell><DisProjectConsult /></Shell></Protected>} />
        <Route path="/discente/projetos/:id" element={<Protected><Shell><DisProjectView /></Shell></Protected>} />
        <Route path="/discente/vinculo" element={<Protected><Shell><BondStatus /></Shell></Protected>} />

        <Route path="/discente/relatorios" element={<Protected><Shell><ReportsList /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/parcial" element={<Protected><Shell><PartialReportForm /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/final" element={<Protected><Shell><FinalReportForm /></Shell></Protected>} />
        <Route path="/discente/relatorios/:id/visualizar" element={<Protected><Shell><ReportView /></Shell></Protected>} />
        {/*<Route path="/discente/relatorios/:id/status" element={<Protected><Shell><ReportStatus /></Shell></Protected>} />*/}
        
        <Route path="/discente/enic/inscricao" element={<Protected><Shell><EnicSubmissionForm /></Shell></Protected>} />
        {/*<Route path="/discente/enic/status" element={<Protected><Shell><EnicSubmissionStatus /></Shell></Protected>} />*/}
        <Route path="/discente/enic/visualizar/:id" element={<Protected><Shell><EnicSubmissionView /></Shell></Protected>} />
        <Route path="/discente/enic/submissions" element={<Protected><Shell><EnicSubmissionsList /></Shell></Protected>} />
        <Route path="/discente/enic/modelo" element={<Protected><Shell><TemplateModel /></Shell></Protected>} />

        {/* <Route path="/discente/notificacoes" element={<Protected><Shell><NotificationsCenter /></Shell></Protected>} />*/}
        {/* <Route path="/discente/notificacoes/inbox" element={<Protected><Shell><MessagesInbox /></Shell></Protected>} />*/}
        {/* <Route path="/discente/notificacoes/thread/:id" element={<Protected><Shell><MessageThread /></Shell></Protected>} />*/}

        <Route path="/discente/certificados" element={<Protected><Shell><CertificatesList /></Shell></Protected>} />  
        {/* <Route path="/discente/certificados/:id" element={<Protected><Shell><DisCertificateView /></Shell></Protected>} />*/}
        <Route path="/discente/historico-participacao" element={<Protected><Shell><ParticipationHistory /></Shell></Protected>} />

        <Route path="/discente/planos-disponiveis" element={<Protected><Shell><AvailablePlans /></Shell></Protected>} />
        <Route path="/discente/planos-disponiveis/:id" element={<Protected><Shell><PlanView /></Shell></Protected>} />
        {/* <Route path="/discente/planos-disponiveis/:id/interesse" element={<Protected><Shell><InterestForm /></Shell></Protected>} /> */}

        <Route path="/discente/configuracoes" element={<Protected><Shell><DisSettings /></Shell></Protected>} />

        {/* Coordenador */}
        <Route path="/coordenador/projetos" element={<Protected><Shell><CoordinatorProjects /></Shell></Protected>} />
        <Route path="/coordenador/projetos/novo" element={<Protected><Shell><CoordinatorProjectForm /></Shell></Protected>} />
        <Route path="/coordenador/projetos/:id" element={<Protected><Shell><CoordinatorProjectView /></Shell></Protected>} />
        <Route path="/coordenador/projetos/:id/editar" element={<Protected><Shell><CoordinatorProjectEdit /></Shell></Protected>} />

        <Route path="/coordenador/editais" element={<Protected><Shell><CoordinatorEditais /></Shell></Protected>} />
    
        <Route path="/coordenador/avaliacoes" element={<Protected><Shell><CoordinatorEvaluations /></Shell></Protected>} />
        <Route path="/coordenador/avaliacoes/:id" element={<Protected><Shell><CoordinatorEvaluationDetail /></Shell></Protected>} />

        <Route path="/coordenador/planos/indicacoes" element={<Protected><Shell><CoordinatorIndications /></Shell></Protected>} />
        <Route path="/coordenador/planos/novo" element={<Protected><Shell><CoordinatorProjectWorkPlanForm /></Shell></Protected>}/>
        <Route path="/coordenador/planos/:id" element={<Protected><Shell><CoordinatorWorkPlanDetails /></Shell></Protected>} />
        <Route path="/coordenador/planos/indicacoes/:id" element={<Protected><Shell><CoordinatorIndicationDetails /></Shell></Protected>} />

        <Route path="/coordenador/relatorios" element={<Protected><Shell><CoordinatorReports /></Shell></Protected>} />
        <Route path="/coordenador/relatorios/:id/revisao" element={<Protected><Shell><CoordinatorReportReview /></Shell></Protected>} />

        <Route path="/coordenador/producao/ipi" element={<Protected><Shell><CoordinatorProductionIPI /></Shell></Protected>} />
        <Route path="/coordenador/producao/resultado" element={<Protected><Shell><CoordinatorProductionResult /></Shell></Protected>} />

        {/* Gestor */}
        <Route path="/gestor/settings/user-types" element={<Protected><Shell><GestorUserTypes /></Shell></Protected>} />
        <Route path="/gestor/settings/scholarships" element={<Protected><Shell><GestorScholarships /></Shell></Protected>} />
        <Route path="/gestor/settings/academic-units" element={<Protected><Shell><GestorAcademicUnits /></Shell></Protected>} />
        <Route path="/gestor/settings/roles" element={<Protected><Shell><GestorRoles /></Shell></Protected>} />
        <Route path="/gestor/settings/parameters" element={<Protected><Shell><GestorParameters /></Shell></Protected>} />
        {/* <Route path="/gestor/projetos" element={<Protected><Shell><GestorProjects /></Shell></Protected>} /> */}


        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
