import './App.scss'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router'
import AuthPage from './features/auth/AuthPage.jsx'
import LandingPage from './features/landing/LandingPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import GoogleCallback from './features/auth/components/GoogleCallback.jsx'
import DashboardPage from './features/dashboard/DashboardPage.jsx'
import WorkoutPage from './features/workout/WorkoutPage.jsx'
import WorkoutSessionPage from './features/workout-session/WorkoutSessionPage.jsx'
import MainLayout from './layout/MainLayout.jsx'
import WorkoutDetails from "./features/workout/components/WorkoutDetails.jsx"
import ExercisesPage from './features/exercises/ExercisesPage.jsx'
import SchedulePage from './features/schedule/SchedulePage.jsx'
import authService from './services/authService.js'
import TrainerPage from './features/trainer-client/trainers/TrainerPage.jsx'
import ClientsPage from './features/trainer-client/clients/ClientsPage.jsx'
import ClientTrackingPage from './features/trainer-client/clients/ClientTrackingPage.jsx'
import ClientWorkoutDetailsPage from './features/trainer-client/clients/ClientWorkoutDetailsPage.jsx'
import ProfilePage from './features/profile/ProfilePage.jsx'

const RoleConnectionsRedirect = () => {
  const role = authService.getUser()?.role;

  if (role === 'trainer') {
    return <Navigate to="/clients" replace />;
  }

  if (role === 'athlete') {
    return <Navigate to="/trainers" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

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
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/workout/session" element={<WorkoutSessionPage />} />
          <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/trainers" element={<TrainerPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:clientId/tracking" element={<ClientTrackingPage />} />
          <Route path="/clients/:clientId/workouts/:workoutId" element={<ClientWorkoutDetailsPage />} />
          <Route path="/coaching" element={<RoleConnectionsRedirect />} />
          <Route path="/progress" element={<div>Progress Page</div>} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
