export const stateRights = {
  CA: {
    state: 'California',
    content: {
      en: {
        title: 'Your Rights in California',
        sections: [
          {
            title: 'Traffic Stops',
            points: [
              'You have the right to remain silent',
              'You must provide license, registration, and insurance',
              'You can refuse to consent to a vehicle search',
              'You can ask if you are free to leave'
            ]
          },
          {
            title: 'Public Encounters',
            points: [
              'You have the right to film police in public',
              'You do not have to answer questions',
              'You can ask for badge numbers and names',
              'You should keep your hands visible'
            ]
          },
          {
            title: 'Arrests',
            points: [
              'You have the right to an attorney',
              'You can refuse to sign anything except a citation',
              'You have the right to make a phone call',
              'Do not resist, even if you believe the arrest is unfair'
            ]
          }
        ]
      },
      es: {
        title: 'Sus Derechos en California',
        sections: [
          {
            title: 'Paradas de Tráfico',
            points: [
              'Tiene derecho a permanecer en silencio',
              'Debe proporcionar licencia, registro y seguro',
              'Puede negarse a consentir una búsqueda del vehículo',
              'Puede preguntar si es libre de irse'
            ]
          },
          {
            title: 'Encuentros Públicos',
            points: [
              'Tiene derecho a filmar a la policía en público',
              'No tiene que responder preguntas',
              'Puede pedir números de placa y nombres',
              'Debe mantener sus manos visibles'
            ]
          },
          {
            title: 'Arrestos',
            points: [
              'Tiene derecho a un abogado',
              'Puede negarse a firmar cualquier cosa excepto una citación',
              'Tiene derecho a hacer una llamada telefónica',
              'No resista, incluso si cree que el arresto es injusto'
            ]
          }
        ]
      }
    },
    lastUpdated: '2024-01-15'
  },
  NY: {
    state: 'New York',
    content: {
      en: {
        title: 'Your Rights in New York',
        sections: [
          {
            title: 'Stop and Frisk',
            points: [
              'Police need reasonable suspicion to stop you',
              'You have the right to ask why you are being stopped',
              'You can refuse consent to search',
              'Stay calm and keep hands visible'
            ]
          },
          {
            title: 'Traffic Stops',
            points: [
              'Provide license and registration when requested',
              'You have the right to remain silent',
              'You can refuse consent to vehicle search',
              'Ask if you are free to leave'
            ]
          }
        ]
      },
      es: {
        title: 'Sus Derechos en Nueva York',
        sections: [
          {
            title: 'Parar y Registrar',
            points: [
              'La policía necesita sospecha razonable para detenerlo',
              'Tiene derecho a preguntar por qué lo detienen',
              'Puede negarse al consentimiento para registrar',
              'Manténgase calmado y mantenga las manos visibles'
            ]
          },
          {
            title: 'Paradas de Tráfico',
            points: [
              'Proporcione licencia y registro cuando se lo soliciten',
              'Tiene derecho a permanecer en silencio',
              'Puede negarse al consentimiento para registrar el vehículo',
              'Pregunte si es libre de irse'
            ]
          }
        ]
      }
    },
    lastUpdated: '2024-01-15'
  }
}

export const getStateRights = (state, language = 'en') => {
  const stateData = stateRights[state]
  if (!stateData) return null
  
  return {
    ...stateData,
    content: stateData.content[language] || stateData.content.en
  }
}