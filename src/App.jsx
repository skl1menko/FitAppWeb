import './App.scss'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router'
import AuthPage from './features/auth/AuthPage.jsx'
import LandingPage from './features/landing/LandingPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<LandingPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><div>Dashboard</div></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
