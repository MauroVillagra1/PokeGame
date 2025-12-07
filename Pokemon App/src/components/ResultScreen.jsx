import './ResultScreen.scss'

function ResultScreen({ score, onPlayAgain }) {
  const getMessage = () => {
    if (score < 5) {
      return {
        emoji: '😢',
        text: 'Tienes que practicar más',
        class: 'sad'
      }
    } else if (score >= 5 && score <= 8) {
      return {
        emoji: '😊',
        text: '¡Eres increíble!',
        class: 'good'
      }
    } else {
      return {
        emoji: '🔥',
        text: '¡Eres un experto entrenador Pokémon!',
        class: 'expert'
      }
    }
  }

  const result = getMessage()

  return (
    <div className={`result-screen ${result.class}`}>
      <div className="result-container">
        <div className="result-emoji">{result.emoji}</div>
        <h1 className="result-title">Juego Terminado</h1>
        <div className="result-score">
          <span className="score-number">{score}</span>
          <span className="score-total">/10</span>
        </div>
        <p className="result-message">{result.text}</p>
        <button className="play-again-button" onClick={onPlayAgain}>
          Jugar de nuevo
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
