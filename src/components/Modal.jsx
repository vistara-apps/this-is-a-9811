import { X } from 'lucide-react'

const Modal = ({ 
  variant = 'default', 
  isOpen, 
  onClose, 
  title, 
  children,
  className = '' 
}) => {
  if (!isOpen) return null

  const variants = {
    fullscreen: 'fixed inset-0 z-50',
    bottomSheet: 'fixed inset-x-0 bottom-0 z-50 max-h-[80vh]',
    default: 'fixed inset-0 z-50 flex items-center justify-center p-4'
  }

  const contentVariants = {
    fullscreen: 'h-full w-full bg-surface',
    bottomSheet: 'bg-surface rounded-t-xl shadow-2xl',
    default: 'bg-surface rounded-lg shadow-2xl max-w-md w-full mx-auto'
  }

  return (
    <div className={variants[variant]}>
      {variant !== 'fullscreen' && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <div className={`relative ${contentVariants[variant]} ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal