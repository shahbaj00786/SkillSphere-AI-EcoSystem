import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Profile from './pages/profile/Profile.jsx'
import FreelancerProfile from './pages/profile/FreelancerProfile.jsx'
import GigMarketplace from './pages/GigMarketplace.jsx'
import GigDetail from './pages/GigDetail.jsx'
import ChatPage from './pages/ChatPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PrivateRoute from './components/common/PrivateRoute.jsx'
import ProposalsPage from './pages/ProposalsPage.jsx'
import AIMatchPage from './pages/AIMatchPage.jsx'
import FreelancerSetupPage from './pages/FreelancerSetupPage.jsx'
import CreateGigPage from './pages/CreateGigPage.jsx'

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />

      {/* protected routes */}
      <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path='/freelancer/:id' element={<PrivateRoute><FreelancerProfile /></PrivateRoute>} />
      <Route path='/gigs' element={<PrivateRoute><GigMarketplace /></PrivateRoute>} />
      <Route path='/gigs/create' element={<PrivateRoute><CreateGigPage /></PrivateRoute>} />
      <Route path='/gig/:gigId' element={<PrivateRoute><GigDetail /></PrivateRoute>} />
      <Route path='/chat' element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path='/payments' element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path='/admin' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path='/proposals' element={<PrivateRoute><ProposalsPage /></PrivateRoute>} />
      <Route path='/ai-match' element={<PrivateRoute><AIMatchPage /></PrivateRoute>} />
      <Route path='/freelancer-setup' element={<PrivateRoute><FreelancerSetupPage/></PrivateRoute>} />

      {/* default */}
      <Route path='/' element={<Login />} />
    </Routes>
  )
}
export default App