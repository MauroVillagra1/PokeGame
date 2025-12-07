import { useState, useEffect } from 'react'
import './GameScreen.scss'
import { fetchPokemonByGeneration, getOffensiveRelations, getDefensiveRelations, POKEMON_TYPES } from '../utils/pokeapi'

const QUESTIONS = [
  // Preguntas OFENSIVAS (Pokémon atacando)
  { 
    id: 'offensive-super', 
    type: 'offensive',
    text: 'súper efectivo (x2 o x4)', 
    key: 'superEffective',
    question: (pokemon, type) => `Imagina que ${pokemon} ataca con un ataque de tipo ${type}. El ataque le pegaría súper efectivo a los tipos:`
  },
  { 
    id: 'offensive-weak', 
    type: 'offensive',
    text: 'poco efectivo (x0.5 o x0.25)', 
    key: 'notVeryEffective',
    question: (pokemon, type) => `Imagina que ${pokemon} ataca con un ataque de tipo ${type}. El ataque le pegaría poco efectivo a los tipos:`
  },
  { 
    id: 'offensive-neutral', 
    type: 'offensive',
    text: 'neutro (x1)', 
    key: 'neutral',
    question: (pokemon, type) => `Imagina que ${pokemon} ataca con un ataque de tipo ${type}. El ataque le pegaría neutro a los tipos:`
  },
  { 
    id: 'offensive-immune', 
    type: 'offensive',
    text: 'sin efecto (x0)', 
    key: 'noEffect',
    question: (pokemon, type) => `Imagina que ${pokemon} ataca con un ataque de tipo ${type}. El ataque no afectaría a los tipos:`
  },
  // Preguntas DEFENSIVAS (Pokémon recibiendo daño)
  { 
    id: 'defensive-4x', 
    type: 'defensive',
    text: 'x4 de daño', 
    key: 'takes4x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y le realizan x4 de daño. El ataque puede ser del tipo:`
  },
  { 
    id: 'defensive-2x', 
    type: 'defensive',
    text: 'x2 de daño', 
    key: 'takes2x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y le realizan x2 de daño. El ataque puede ser del tipo:`
  },
  { 
    id: 'defensive-1x', 
    type: 'defensive',
    text: 'x1 de daño', 
    key: 'takes1x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y le realizan x1 de daño. El ataque puede ser del tipo:`
  },
  { 
    id: 'defensive-05x', 
    type: 'defensive',
    text: 'x0.5 de daño', 
    key: 'takes05x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y le realizan x0.5 de daño. El ataque puede ser del tipo:`
  },
  { 
    id: 'defensive-025x', 
    type: 'defensive',
    text: 'x0.25 de daño', 
    key: 'takes025x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y le realizan x0.25 de daño. El ataque puede ser del tipo:`
  },
  { 
    id: 'defensive-0x', 
    type: 'defensive',
    text: 'x0 de daño (inmune)', 
    key: 'takes0x',
    question: (pokemon) => `Imagina que ${pokemon} recibe un ataque y no le hace daño (x0). El ataque puede ser del tipo:`
  },
]

function GameScreen({ generations, difficulty, onGameEnd }) {
  const [pokemonList, setPokemonList] = useState([])
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintMessage, setHintMessage] = useState('')

  useEffect(() => {
    loadPokemon()
  }, [])

  useEffect(() => {
    if (pokemonList.length > 0 && !currentPokemon) {
      loadNewRound()
    }
  }, [pokemonList])

  const loadPokemon = async () => {
    setLoading(true)
    const allPokemon = await fetchPokemonByGeneration(generations)
    setPokemonList(allPokemon)
    setLoading(false)
  }

  const loadNewRound = () => {
    if (round > 10) {
      onGameEnd(score)
      return
    }

    // Limpiar estado primero
    setFeedback(null)
    setSelectedAnswers([])
    setHasChecked(false)
    setHintUsed(false)
    setHintMessage('')
    setCurrentPokemon(null)
    setCurrentQuestion(null)
    setOptions([])
    setCorrectAnswers([])

    // Pequeño delay para asegurar que el estado se limpie
    setTimeout(() => {
      const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)]
      const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
      
      let correctTypes = []
      let selectedType = null

      if (randomQuestion.type === 'offensive') {
        // Para preguntas ofensivas, seleccionar un tipo del Pokémon
        selectedType = randomPokemon.types[Math.floor(Math.random() * randomPokemon.types.length)]
        const relations = getOffensiveRelations(selectedType)
        correctTypes = relations[randomQuestion.key] || []
      } else {
        // Para preguntas defensivas, usar todos los tipos del Pokémon
        const relations = getDefensiveRelations(randomPokemon.types)
        correctTypes = relations[randomQuestion.key] || []
      }
      
      // Crear opciones: SIEMPRE incluir TODAS las correctas + opciones incorrectas
      let availableTypes = POKEMON_TYPES.filter(t => !correctTypes.includes(t))
      const shuffled = availableTypes.sort(() => Math.random() - 0.5)
      
      // Calcular cuántas opciones incorrectas agregar
      const maxOptions = 18 // Máximo de opciones a mostrar
      let numWrong = Math.min(shuffled.length, maxOptions - correctTypes.length)
      
      if (difficulty === 'novato' && correctTypes.length > 0) {
        // En novato, menos opciones incorrectas
        numWrong = Math.min(numWrong, Math.max(5, 10 - correctTypes.length))
      }
      
      let wrongOptions = shuffled.slice(0, numWrong)

      // TODAS las correctas + opciones incorrectas
      const allOptions = [...correctTypes, ...wrongOptions].sort(() => Math.random() - 0.5)
      
      // Actualizar todo el estado junto
      setCurrentPokemon({...randomPokemon, selectedType})
      setCurrentQuestion(randomQuestion)
      setCorrectAnswers(correctTypes)
      setOptions(allOptions)
      
      console.log('Nueva ronda:', {
        pokemon: randomPokemon.name,
        tipos: randomPokemon.types,
        tipoSeleccionado: selectedType,
        pregunta: randomQuestion.id,
        correctas: correctTypes,
        opciones: allOptions
      })
    }, 100)
  }

  const toggleAnswer = (answer) => {
    if (hasChecked) return // No permitir cambios después de probar
    
    if (selectedAnswers.includes(answer)) {
      setSelectedAnswers(selectedAnswers.filter(a => a !== answer))
    } else {
      setSelectedAnswers([...selectedAnswers, answer])
    }
  }

  const handleCheckAnswer = () => {
    setHasChecked(true)

    // Verificar si las respuestas son correctas
    const selectedSet = new Set(selectedAnswers.sort())
    const correctSet = new Set(correctAnswers.sort())
    
    console.log('Validación:', {
      seleccionadas: Array.from(selectedSet),
      correctas: Array.from(correctSet)
    })
    
    const isCorrect = 
      selectedSet.size === correctSet.size &&
      [...selectedSet].every(answer => correctSet.has(answer)) &&
      [...correctSet].every(answer => selectedSet.has(answer))

    if (isCorrect) {
      setScore(score + 1)
      setFeedback('correct')
      // Si es correcto, avanzar automáticamente después de 1.5 segundos
      setTimeout(() => {
        setRound(round + 1)
        loadNewRound()
      }, 1500)
    } else {
      setFeedback('incorrect')
      // Si es incorrecto, NO avanzar automáticamente
      // El usuario debe presionar "Siguiente"
    }
  }

  const handleNext = () => {
    setRound(round + 1)
    loadNewRound()
  }

  const handleHint = () => {
    if (hintUsed || hasChecked) return

    setHintUsed(true)

    // Si no hay respuestas correctas
    if (correctAnswers.length === 0) {
      setHintMessage('💡 Pista: No hay ninguna opción correcta')
      return
    }

    // Si solo hay una respuesta correcta
    if (correctAnswers.length === 1) {
      setSelectedAnswers([correctAnswers[0]])
      setHintMessage('💡 Pista: Esta es la única opción correcta')
      return
    }

    // Si hay múltiples respuestas, seleccionar el 50%
    const halfCount = Math.ceil(correctAnswers.length / 2)
    const shuffledCorrect = [...correctAnswers].sort(() => Math.random() - 0.5)
    const hintAnswers = shuffledCorrect.slice(0, halfCount)
    
    setSelectedAnswers(hintAnswers)
    setHintMessage(`💡 Pista: He seleccionado ${halfCount} de ${correctAnswers.length} respuestas correctas`)
  }

  if (loading) {
    return <div className="game-screen loading">Cargando Pokémon...</div>
  }

  if (!currentPokemon) {
    return <div className="game-screen loading">Preparando ronda...</div>
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="score">Puntos: {score}/10</div>
        <div className="round">Ronda: {round}/10</div>
      </div>

      <div className="pokemon-card">
        <img 
          src={currentPokemon.sprite} 
          alt={currentPokemon.name}
          className="pokemon-sprite"
        />
        <h2 className="pokemon-name">{currentPokemon.name}</h2>
        {difficulty !== 'avanzado' && (
          <div className="pokemon-types">
            {currentPokemon.types.map(type => (
              <span key={type} className={`type-badge type-${type}`}>
                {type}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="question-section">
        <div className="question-container">
          {currentQuestion.type === 'offensive' ? (
            <>
              <p className="question-intro">
                Imagina que <strong>{currentPokemon.name}</strong> ataca con un ataque de tipo{' '}
                <span className={`type-badge type-${currentPokemon.selectedType}`}>
                  {currentPokemon.selectedType}
                </span>
              </p>
              <h3 className="question">
                {currentQuestion.id === 'offensive-super' && 'El ataque le pegaría súper efectivo a los tipos:'}
                {currentQuestion.id === 'offensive-weak' && 'El ataque le pegaría poco efectivo a los tipos:'}
                {currentQuestion.id === 'offensive-neutral' && 'El ataque le pegaría neutro a los tipos:'}
                {currentQuestion.id === 'offensive-immune' && 'El ataque no afectaría a los tipos:'}
              </h3>
            </>
          ) : (
            <>
              <h3 className="question">
                {currentQuestion.question(currentPokemon.name)}
              </h3>
            </>
          )}
        </div>
        <p className="instruction">Selecciona todas las opciones correctas (o ninguna si no aplica)</p>
        
        <div className="options-grid">
          {options.map(option => {
            const isSelected = selectedAnswers.includes(option)
            const isCorrect = correctAnswers.includes(option)
            
            let className = 'option-label'
            if (hasChecked) {
              if (isSelected && isCorrect) {
                className += ' correct'
              } else if (isSelected && !isCorrect) {
                className += ' incorrect'
              } else if (!isSelected && isCorrect) {
                className += ' show-correct'
              }
            } else if (isSelected) {
              className += ' selected'
            }
            
            return (
              <label key={option} className={className}>
                <input
                  type="checkbox"
                  value={option}
                  checked={isSelected}
                  onChange={() => toggleAnswer(option)}
                  disabled={hasChecked}
                />
                <span className={`type-badge type-${option}`}>
                  {option}
                </span>
              </label>
            )
          })}
        </div>

        <div className="button-container">
          {difficulty === 'novato' && !hasChecked && !hintUsed && (
            <button 
              className="hint-button" 
              onClick={handleHint}
            >
              💡 Pista
            </button>
          )}
          
          {!hasChecked ? (
            <button 
              className="check-button" 
              onClick={handleCheckAnswer}
            >
              Probar
            </button>
          ) : feedback === 'incorrect' && (
            <button 
              className="check-button next-button" 
              onClick={handleNext}
            >
              Siguiente
            </button>
          )}
        </div>

        {hintMessage && (
          <div className="hint-message">
            {hintMessage}
          </div>
        )}
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' 
            ? '✅ ¡Correcto!' 
            : correctAnswers.length === 0
              ? '❌ Incorrecto. La respuesta correcta era: ninguno'
              : `❌ Incorrecto. Las correctas eran: ${correctAnswers.join(', ')}`
          }
        </div>
      )}
    </div>
  )
}

export default GameScreen
