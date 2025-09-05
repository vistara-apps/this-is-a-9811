import { useApp } from '../context/AppContext'
import { Scale, Phone, ExternalLink, Crown } from 'lucide-react'
import InfoCard from '../components/InfoCard'

const Legal = () => {
  const { language, subscriptionStatus } = useApp()

  const legalResources = [
    {
      id: 'aclu',
      title: language === 'en' ? 'ACLU - Know Your Rights' : 'ACLU - Conozca Sus Derechos',
      description: language === 'en' 
        ? 'American Civil Liberties Union resources and guidance'
        : 'Recursos y orientación de la Unión Americana de Libertades Civiles',
      url: 'https://www.aclu.org/know-your-rights',
      free: true
    },
    {
      id: 'legal-aid',
      title: language === 'en' ? 'Legal Aid Society' : 'Sociedad de Asistencia Legal',
      description: language === 'en' 
        ? 'Free legal assistance for those who qualify'
        : 'Asistencia legal gratuita para quienes califiquen',
      url: 'https://www.legalaid.org',
      free: true
    },
    {
      id: 'lawyer-referral',
      title: language === 'en' ? 'State Bar Lawyer Referral' : 'Referencia de Abogados del Colegio Estatal',
      description: language === 'en' 
        ? 'Find qualified attorneys in your area'
        : 'Encuentre abogados calificados en su área',
      premium: true
    },
    {
      id: 'emergency-legal',
      title: language === 'en' ? '24/7 Legal Hotline' : 'Línea Legal 24/7',
      description: language === 'en' 
        ? 'Immediate legal consultation for urgent situations'
        : 'Consulta legal inmediata para situaciones urgentes',
      premium: true
    }
  ]

  const handleResourceClick = (resource) => {
    if (resource.premium && subscriptionStatus === 'free') {
      alert(language === 'en' 
        ? 'This feature requires a premium subscription. Please upgrade to access legal referral services.'
        : 'Esta función requiere una suscripción premium. Actualice para acceder a los servicios de referencia legal.'
      )
      return
    }

    if (resource.url) {
      window.open(resource.url, '_blank')
    } else {
      // Mock premium feature
      alert(language === 'en' 
        ? 'Connecting you to legal services... (This is a demo)'
        : 'Conectándolo con servicios legales... (Esta es una demostración)'
      )
    }
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Scale className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-text-primary">
            {language === 'en' ? 'Legal Network' : 'Red Legal'}
          </h1>
        </div>
        <p className="text-text-secondary">
          {language === 'en' 
            ? 'Connect with legal resources and professional assistance'
            : 'Conéctese con recursos legales y asistencia profesional'
          }
        </p>
      </div>

      {/* Subscription Status */}
      {subscriptionStatus === 'free' && (
        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">
                  {language === 'en' ? 'Upgrade for Full Access' : 'Actualice para Acceso Completo'}
                </h3>
                <p className="text-sm text-purple-700">
                  {language === 'en' 
                    ? 'Premium members get priority access to legal referrals and consultation services'
                    : 'Los miembros premium obtienen acceso prioritario a referencias legales y servicios de consulta'
                  }
                </p>
              </div>
            </div>
            <button className="btn-primary text-sm px-4 py-2">
              {language === 'en' ? 'Upgrade' : 'Actualizar'}
            </button>
          </div>
        </div>
      )}

      {/* Legal Resources */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {language === 'en' ? 'Legal Resources' : 'Recursos Legales'}
        </h2>

        {legalResources.map((resource) => (
          <InfoCard
            key={resource.id}
            title={resource.title}
            content={resource.description}
            onClick={() => handleResourceClick(resource)}
            action={
              <div className="flex items-center space-x-2">
                {resource.premium && (
                  <Crown className="h-4 w-4 text-purple-500" />
                )}
                {resource.free && (
                  <ExternalLink className="h-4 w-4 text-text-secondary" />
                )}
              </div>
            }
          />
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {language === 'en' ? 'Emergency Contacts' : 'Contactos de Emergencia'}
        </h2>

        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">
                {language === 'en' ? 'Emergency Services' : 'Servicios de Emergencia'}
              </h3>
              <p className="text-sm text-red-700">911</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-text-secondary" />
            <div>
              <h3 className="font-semibold text-text-primary">
                {language === 'en' ? 'ACLU Legal Hotline' : 'Línea Legal ACLU'}
              </h3>
              <p className="text-sm text-text-secondary">1-888-ACLU-SC1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Know Your Rights Quick Reference */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">
          {language === 'en' ? 'Quick Rights Reference' : 'Referencia Rápida de Derechos'}
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <span>
              {language === 'en' 
                ? 'You have the right to remain silent'
                : 'Tiene derecho a permanecer en silencio'
              }
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <span>
              {language === 'en' 
                ? 'You have the right to an attorney'
                : 'Tiene derecho a un abogado'
              }
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <span>
              {language === 'en' 
                ? 'You can refuse consent to searches'
                : 'Puede negarse al consentimiento para registros'
              }
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <span>
              {language === 'en' 
                ? 'You can ask if you are free to leave'
                : 'Puede preguntar si es libre de irse'
              }
            </span>
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="card bg-gray-50 border border-gray-200">
        <div className="text-xs text-gray-600">
          <strong>
            {language === 'en' ? 'Disclaimer:' : 'Descargo de responsabilidad:'}
          </strong>{' '}
          {language === 'en' 
            ? 'This app provides general information and resources. It does not provide legal advice or establish an attorney-client relationship. For specific legal guidance, consult with a qualified attorney.'
            : 'Esta aplicación proporciona información general y recursos. No proporciona asesoramiento legal ni establece una relación abogado-cliente. Para orientación legal específica, consulte con un abogado calificado.'
          }
        </div>
      </div>
    </div>
  )
}

export default Legal