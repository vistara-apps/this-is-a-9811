import { Mic, Square } from 'lucide-react'

const RecordButton = ({ variant = 'inactive', onClick, className = '' }) => {
  const isActive = variant === 'active'
  
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-16 h-16 rounded-full 
        transition-all duration-200 ${className}
        ${isActive 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow' 
          : 'bg-primary hover:bg-primary/90'
        }
      `}
    >
      {isActive ? (
        <Square className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
      
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping" />
      )}
    </button>
  )
}

export default RecordButton