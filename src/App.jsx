import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Rights from './pages/Rights'
import Scripts from './pages/Scripts'
import Record from './pages/Record'
import Legal from './pages/Legal'
import Profile from './pages/Profile'

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/record" element={<Record />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}

export default App
