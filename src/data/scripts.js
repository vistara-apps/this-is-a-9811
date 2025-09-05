export const scripts = {
  en: [
    {
      id: 'traffic-stop',
      title: 'Traffic Stop Script',
      scenario: 'When pulled over by police',
      script: `"Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to go?"`,
      tips: [
        'Keep hands on steering wheel',
        'Turn on interior light if dark',
        'Provide documents when requested',
        'Stay calm and polite'
      ]
    },
    {
      id: 'public-encounter',
      title: 'Public Encounter Script',
      scenario: 'When approached by police in public',
      script: `"I am exercising my right to remain silent. I do not consent to any searches. Am I being detained or am I free to go?"`,
      tips: [
        'Keep hands visible',
        'Do not run or resist',
        'Ask for badge number',
        'Remember details for later'
      ]
    },
    {
      id: 'home-search',
      title: 'Home Search Script',
      scenario: 'When police want to search your home',
      script: `"I do not consent to a search. Please show me a warrant signed by a judge."`,
      tips: [
        'Step outside and close door',
        'Do not invite police inside',
        'Ask to see warrant',
        'Call a lawyer immediately'
      ]
    }
  ],
  es: [
    {
      id: 'traffic-stop',
      title: 'Guión para Parada de Tráfico',
      scenario: 'Cuando la policía lo detiene',
      script: `"Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro. ¿Soy libre de irme?"`,
      tips: [
        'Mantenga las manos en el volante',
        'Encienda la luz interior si está oscuro',
        'Proporcione documentos cuando se lo soliciten',
        'Manténgase calmado y cortés'
      ]
    },
    {
      id: 'public-encounter',
      title: 'Guión para Encuentro Público',
      scenario: 'Cuando la policía se acerca en público',
      script: `"Estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro. ¿Estoy detenido o soy libre de irme?"`,
      tips: [
        'Mantenga las manos visibles',
        'No corra ni se resista',
        'Pida el número de placa',
        'Recuerde detalles para después'
      ]
    },
    {
      id: 'home-search',
      title: 'Guión para Registro de Casa',
      scenario: 'Cuando la policía quiere registrar su casa',
      script: `"No consiento un registro. Por favor muéstreme una orden firmada por un juez."`,
      tips: [
        'Salga y cierre la puerta',
        'No invite a la policía adentro',
        'Pida ver la orden',
        'Llame a un abogado inmediatamente'
      ]
    }
  ]
}

export const getScripts = (language = 'en') => {
  return scripts[language] || scripts.en
}