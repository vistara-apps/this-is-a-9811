import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  const location = useLocation()
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <div className="min-h-screen bg-bg">
      {!isOnboarding && <Header />}
      <main className="container max-w-7xl mx-auto px-6 pb-20">
        {children}
      </main>
      {!isOnboarding && <Navigation />}
    </div>
  )
}

export default Layout