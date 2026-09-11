import React from "react"
import { Route, Routes, Navigate, useLocation } from "react-router-dom"
import { remapAdmPath } from "./utils/remapAdmPath"
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

// gestor pages
import Dashboard from "./pages/gestor/Dashboard"
import Evaluators from "./pages/gestor/avaliacao/Evaluators"
import GestorEvaluationDistribution from "./pages/gestor/avaliacao/GestorEvaluationDistribution"
import GestorIPIReport from "./pages/gestor/avaliacao/GestorIPIReport"

import StudentReplacements from "./pages/gestor/monitoring/StudentReplacements"
import ReportValidation from "./pages/gestor/monitoring/ReportValidation"
import GestorCertificates from "./pages/gestor/monitoring/GestorCertificates"

import CallsManagement from "./pages/gestor/calls/CallsManagement"
import CreateCall from "./pages/gestor/calls/CreateCall"
import CallSchedule from "./pages/gestor/calls/CallSchedule"
import CallWorkflow from "./pages/gestor/calls/CallWorkflow"
import GestorCallsManage from "./pages/gestor/calls/Manage"

import GestorCallQuotas from "./pages/gestor/resultados/Quotas"
import GestorAppeals from "./pages/gestor/resultados/Appeals"
import GestorFinalRanking from "./pages/gestor/resultados/GestorFinalRanking"

import GlobalSettings from "./pages/gestor/settings/GlobalSettings"
import ScholarshipEntities from "./pages/gestor/settings/ScholarshipEntities"
import AcademicUnits from "./pages/gestor/settings/AcademicUnits"
import RolesDictionary from "./pages/gestor/settings/RolesDictionary"
import UserTypes from "./pages/gestor/settings/UserTypes"

import GestorProjectCommunication from "./pages/gestor/projetos/GestorProjectCommunication"
import GestorResearchModuleParameters from "./pages/gestor/settings/Parameters"

import ProjectDetail from "./pages/gestor/projetos/ProjectDetail"
import ProjectCreateWizard from "./pages/gestor/projetos/ProjectCreateWizard"
import ProjectChangeStatus from "./pages/gestor/projetos/ProjectChangeStatus"
import ProjectViewEdit from "./pages/gestor/projetos/ProjectViewEdit"
import GestorProjects from "./pages/gestor/projetos/GestorProjects"


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
  if (user.role === "GESTOR")         return <Navigate to="/dashboard" replace />
  if (user.role === "DISCENTE")      return <Navigate to="/discente/projetos" replace />
  if (user.role === "COORDENADOR")   return <Navigate to="/coordenador/projetos" replace />
  return <Navigate to="/login" replace />
}

function AdmToGestorRedirect() {
  const location = useLocation()
  return (
    <Navigate
      to={`${remapAdmPath(location.pathname)}${location.search}${location.hash}`}
      replace
    />
  )
}

/** Rotas de gestão de editais: só GESTOR. */
const GestorProtected: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "GESTOR") {
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
        <Route path="/gestor/avaliacao/avaliadores" element={<Protected><Shell><Evaluators /></Shell></Protected>} />
        <Route path="/gestor/avaliacao/distribuicao" element={<Protected><Shell><GestorEvaluationDistribution /></Shell></Protected>} />
        <Route path="/gestor/avaliacao/ipi" element={<Protected><Shell><GestorIPIReport /></Shell></Protected>} />

        <Route path="/gestor/resultados/ranking" element={<Protected><Shell><GestorFinalRanking /></Shell></Protected>} />
        <Route path="/gestor/resultados/quotas" element={<Protected><Shell><GestorCallQuotas /></Shell></Protected>} />
        <Route path="/gestor/resultados/recursos" element={<Protected><Shell><GestorAppeals /></Shell></Protected>} />

        <Route path="/gestor/monitoring/replacements" element={<Protected><Shell><StudentReplacements /></Shell></Protected>} />
        <Route path="/gestor/monitoring/report-validation" element={<Protected><Shell><ReportValidation /></Shell></Protected>} />
        <Route path="/gestor/monitoring/certificates" element={<Protected><Shell><GestorCertificates /></Shell></Protected>} />

        <Route path="/gestor/calls" element={<Protected><GestorProtected><Shell><CallsManagement /></Shell></GestorProtected></Protected>} />
        <Route path="/gestor/calls/CreateCall" element={<Protected><GestorProtected><Shell><CreateCall /></Shell></GestorProtected></Protected>} />
        <Route path="/gestor/calls/Manage" element={<Protected><GestorProtected><Shell><GestorCallsManage /></Shell></GestorProtected></Protected>} />
        <Route path="/gestor/calls/CallSchedule" element={<Protected><GestorProtected><Shell><CallSchedule /></Shell></GestorProtected></Protected>} />
        <Route path="/gestor/calls/CallWorkflow" element={<Protected><GestorProtected><Shell><CallWorkflow /></Shell></GestorProtected></Protected>} />

        <Route path="/gestor/settings" element={<Protected><Shell><GlobalSettings /></Shell></Protected>} />
        <Route path="/gestor/settings/scholarships" element={<Protected><Shell><ScholarshipEntities /></Shell></Protected>} />
        <Route path="/gestor/settings/academic-units" element={<Protected><Shell><AcademicUnits /></Shell></Protected>} />
        <Route path="/gestor/settings/roles" element={<Protected><Shell><RolesDictionary /></Shell></Protected>} />
        <Route path="/gestor/settings/user-types" element={<Protected><Shell><UserTypes /></Shell></Protected>} />
        <Route path="/gestor/settings/parameters" element={<Protected><Shell><GestorResearchModuleParameters /></Shell></Protected>} />

        <Route path="/gestor/projetos/comunicacao" element={<Protected><Shell><GestorProjectCommunication /></Shell></Protected>} />
        <Route path="/gestor/projetos/detalhes-projetos" element={<Protected><Shell><ProjectDetail /></Shell></Protected>} />
        <Route path="/gestor/projetos/novo" element={<Protected><Shell><ProjectCreateWizard /></Shell></Protected>} />
        <Route path="/gestor/projetos/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/gestor/projetos/:id/status" element={<Protected><Shell><ProjectChangeStatus /></Shell></Protected>} />
        <Route path="/gestor/projetos/:id/visualizar" element={<Protected><Shell><ProjectViewEdit /></Shell></Protected>} />
        <Route path="/gestor/projetos" element={<Protected><Shell><GestorProjects /></Shell></Protected>} />

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

        <Route path="/adm/*" element={<AdmToGestorRedirect />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
