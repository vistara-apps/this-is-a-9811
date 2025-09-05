import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, MessageSquare, Mic, Scale } from 'lucide-react'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'rights', label: 'Rights', icon: BookOpen, path: '/rights' },
    { id: 'scripts', label: 'Scripts', icon: MessageSquare, path: '/scripts' },
    { id: 'record', label: 'Record', icon: Mic, path: '/record' },
    { id: 'legal', label: 'Legal', icon: Scale, path: '/legal' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-6 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors duration-150 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation