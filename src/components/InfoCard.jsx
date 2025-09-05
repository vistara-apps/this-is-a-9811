import { ChevronRight } from 'lucide-react'

const InfoCard = ({ variant = 'default', title, content, onClick, action }) => {
  const variants = {
    stateGuide: 'border-l-4 border-l-primary',
    script: 'border-l-4 border-l-accent',
    default: ''
  }

  return (
    <div 
      className={`card cursor-pointer hover:shadow-lg transition-shadow duration-200 ${variants[variant]}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          <p className="text-text-secondary leading-relaxed">{content}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {action}
          <ChevronRight className="h-5 w-5 text-text-secondary" />
        </div>
      </div>
    </div>
  )
}

export default InfoCard