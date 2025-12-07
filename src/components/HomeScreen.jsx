import { useState } from 'react'
import './HomeScreen.scss'

const GENERATIONS = [
  { id: 1, name: 'Gen 1 (Kanto)' },
  { id: 2, name: 'Gen 2 (Johto)' },
  { id: 3, name: 'Gen 3 (Hoenn)' },
  { id: 4, name: 'Gen 4 (Sinnoh)' },
  { id: 5, name: 'Gen 5 (Unova)' },
  { id: 6, name: 'Gen 6 (Kalos)' },
  { id: 7, name: 'Gen 7 (Alola)' },
  { id: 8, name: 'Gen 8 (Galar)' },
]

function HomeScreen({ onStartGame }) {
  const [selectedGens, setSelectedGens] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  const [showOptions, setShowOptions] = useState(false)
  const [difficulty, setDifficulty] = useState(null)

  const toggleGeneration = (genId) => {
    if (selectedGens.includes(genId)) {
      setSelectedGens(selectedGens.filter(id => id !== genId))
    } else {
      setSelectedGens([...selectedGens, genId].sort())
    }
  }

  const handlePlayClick = () => {
    setShowOptions(true)
  }

  const handleDifficultySelect = (diff) => {
    if (selectedGens.length === 0) {
      alert('¡Debes seleccionar al menos una generación!')
      return
    }
    onStartGame(selectedGens, diff)
  }

  return (
    <div className="home-screen">
      <h1 className="title">🎮 Pokémon Type Quiz</h1>
      
      {!showOptions ? (
        <button className="play-button" onClick={handlePlayClick}>
          Jugar
        </button>
      ) : (
        <div className="options-container">
          <div className="generations-section">
            <h2>🔎 Selecciona Generaciones</h2>
            <div className="generations-grid">
              {GENERATIONS.map(gen => (
                <label key={gen.id} className="gen-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGens.includes(gen.id)}
                    onChange={() => toggleGeneration(gen.id)}
                  />
                  <span>{gen.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="difficulty-section">
            <h2>Elige tu nivel</h2>
            <div className="difficulty-buttons">
              <button 
                className="difficulty-btn novato"
                onClick={() => handleDifficultySelect('novato')}
              >
                🟢 Novato
                <small>Botón de pista + menos opciones</small>
              </button>
              <button 
                className="difficulty-btn intermedio"
                onClick={() => handleDifficultySelect('intermedio')}
              >
                🟡 Intermedio
                <small>Pokémon de cualquier tipo</small>
              </button>
              <button 
                className="difficulty-btn avanzado"
                onClick={() => handleDifficultySelect('avanzado')}
              >
                🔴 Avanzado
                <small>Oculta los tipos del Pokémon</small>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
