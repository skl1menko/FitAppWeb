import './App.scss'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router'
import AuthPage from './features/auth/AuthPage.jsx'
import LandingPage from './features/landing/LandingPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import GoogleCallback from './features/auth/components/GoogleCallback.jsx'
import DashboardPage from './features/dashboard/DashboardPage.jsx'
import MainLayout from './layout/MainLayout.jsx'
function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<LandingPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/signup" element={<AuthPage />} />
        <Route path='/auth/callback' element={<GoogleCallback />} />


        <Route element = {
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
         }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<div>Workouts Page</div>} />
          <Route path="/exercises" element={<div>Exercises Page</div>} />
          <Route path="/progress" element={<div>Progress Page</div>} />
          <Route path="/schedule" element={<div>Schedule Page</div>} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
