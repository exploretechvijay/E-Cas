import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </AnalysisProvider>
  )
}

export default App
