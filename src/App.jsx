import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import { useAuth } from './context/auth'
import FeedbackWidget from './Components/FeedbackWidget'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import WhySection from './Components/WhySection'
import UnitsSection from './Components/UnitsSection'
import HowSection from './Components/HowSection'
import DemoSection from './Components/DemoSection'
import WaitlistSection from './Components/WaitlistSection'
import Footer from './Components/Footer'
import LessonPage from './Components/LessonPage'
import AuthModal from './Components/AuthModal'
import CourseOutline from './pages/CourseOutline'
import CourseOutline2 from './pages/CourseOutline2'
import CourseOutline3 from './pages/CourseOutline3'
import CoursesPage from './pages/Courses'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/AdminPage'

function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState('home')
  const [authOpen, setAuthOpen] = useState(false)

  if (page === 'lesson') {
    return <LessonPage onBack={() => setPage('home')} />
  }

  const goLesson = () => setPage('lesson')

  // AuthModal performs the actual sign-in; we just route to the dashboard on success.
  function handleLogin() {
    navigate('/dashboard')
  }

  return (
    <>
      <Navbar onLesson={goLesson} onAuth={() => setAuthOpen(true)} user={user} />
      <main>
        <Hero onLesson={goLesson} onAuth={() => setAuthOpen(true)} />
        <hr className="section-divider" />
        <WhySection />
        <hr className="section-divider" />
        <UnitsSection />
        <hr className="section-divider" />
        <HowSection />
        <hr className="section-divider" />
        <DemoSection />
        <hr className="section-divider" />
        <WaitlistSection />
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
    </>
  )
}

// Gate admin-only routes. In legacy mode (no backend configured) admin stays
// open so the author can keep using the local authoring tool during dev.
function RequireAdmin({ children }) {
  const { user, loading, isConfigured } = useAuth()
  if (!isConfigured) return children
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course" element={<CourseOutline />} />
            <Route path="/course-2" element={<CourseOutline2 />} />
            <Route path="/course-3" element={<CourseOutline3 />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
          </Routes>
          <FeedbackWidget />
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  )
}
