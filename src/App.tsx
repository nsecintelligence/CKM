import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Departments from './pages/Departments';
import Gallery from './pages/Gallery';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Clinic from './pages/Clinic';
import ApiDocs from './pages/ApiDocs';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminDepartments from './pages/admin/Departments';
import AdminAbout from './pages/admin/About';
import AdminGallery from './pages/admin/Gallery';
import AdminNews from './pages/admin/News';
import AdminFAQ from './pages/admin/FAQ';
import AdminContact from './pages/admin/Contact';
import AdminHomepage from './pages/admin/Homepage';
import AdminTopBar from './pages/admin/TopBar';
import AdminHeroSlides from './pages/admin/HeroSlides';
import AdminForms from './pages/admin/Forms';
import AdminPrices from './pages/admin/Prices';
import AdminAppointments from './pages/admin/Appointments';
import AdminSecurityLogs from './pages/admin/SecurityLogs';
import AdminSocPanel from './pages/admin/SocPanel';
import AdminSpecialistDoctors from './pages/admin/SpecialistDoctors';
import AdminLogin from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import DeveloperProtectedRoute from './components/admin/DeveloperProtectedRoute';
import DeveloperLayout from './components/admin/DeveloperLayout';
import DeveloperLogin from './pages/developer/Login';
import DeveloperOverview from './pages/developer/Overview';
import DeveloperApiBilling from './pages/developer/ApiBilling';
import DeveloperDatabase from './pages/developer/DatabaseSupabase';
import DeveloperHosting from './pages/developer/Hosting';
import DeveloperAICredits from './pages/developer/AICredits';
import DeveloperInvoices from './pages/developer/Invoices';
import DeveloperBudgetsAlerts from './pages/developer/BudgetsAlerts';
import DeveloperAuditLogs from './pages/developer/AuditLogs';
import DeveloperSettings from './pages/developer/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="departments" element={<Departments />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="clinic" element={<Clinic />} />
        </Route>
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="hero-slides" element={<AdminHeroSlides />} />
          <Route path="top-bar" element={<AdminTopBar />} />
          <Route path="forms" element={<AdminForms />} />
          <Route path="prices" element={<AdminPrices />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="security" element={<AdminSecurityLogs />} />
          <Route path="soc" element={<AdminSocPanel />} />
          <Route path="specialist-doctors" element={<AdminSpecialistDoctors />} />
        </Route>
        <Route path="/developer-admin/login" element={<DeveloperLogin />} />
        <Route path="/developer-admin" element={<DeveloperProtectedRoute><DeveloperLayout /></DeveloperProtectedRoute>}>
          <Route index element={<DeveloperOverview />} />
          <Route path="api-billing" element={<DeveloperApiBilling />} />
          <Route path="database" element={<DeveloperDatabase />} />
          <Route path="hosting" element={<DeveloperHosting />} />
          <Route path="ai-credits" element={<DeveloperAICredits />} />
          <Route path="invoices" element={<DeveloperInvoices />} />
          <Route path="budgets" element={<DeveloperBudgetsAlerts />} />
          <Route path="audit-logs" element={<DeveloperAuditLogs />} />
          <Route path="settings" element={<DeveloperSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
