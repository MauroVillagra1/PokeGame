import { useState } from 'react'
import './App.scss'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'game', 'result'
  const [selectedGenerations, setSelectedGenerations] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  const [difficulty, setDifficulty] = useState('novato')
  const [score, setScore] = useState(0)

  const startGame = (gens, diff) => {
    setSelectedGenerations(gens)
    setDifficulty(diff)
    setScore(0)
    setScreen('game')
  }

  const endGame = (finalScore) => {
    setScore(finalScore)
    setScreen('result')
  }

  const goHome = () => {
    setScreen('home')
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen onStartGame={startGame} />
      )}
      {screen === 'game' && (
        <GameScreen 
          generations={selectedGenerations}
          difficulty={difficulty}
          onGameEnd={endGame}
        />
      )}
      {screen === 'result' && (
        <ResultScreen score={score} onPlayAgain={goHome} />
      )}
      <a 
        href="https://maurovillagra-portafolio.netlify.app" 
        className="creator-link" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Contacta con el creador
      </a>
    </div>
  )
}

export default App
