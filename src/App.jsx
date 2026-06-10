import { useState } from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import WhySection from './Components/WhySection'
import UnitsSection from './Components/UnitsSection'
import HowSection from './Components/HowSection'
import DemoSection from './Components/DemoSection'
import WaitlistSection from './Components/WaitlistSection'
import Footer from './Components/Footer'
import LessonPage from './Components/LessonPage'

export default function App() {
  const [page, setPage] = useState('home')

  if (page === 'lesson') {
    return <LessonPage onBack={() => setPage('home')} />
  }

  const goLesson = () => setPage('lesson')

  return (
    <>
      <Navbar onLesson={goLesson} />
      <main>
        <Hero onLesson={goLesson} />
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
    </>
  )
}
