import './App.scss'
import { BrowserRouter, Routes, Route} from 'react-router'
import AuthPage from './features/auth/AuthPage.jsx'
import LandingPage from './features/landing/LandingPage.jsx'

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
