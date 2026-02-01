import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import GameCanvas from './GameCanvas';
import './index.css';

const App = () => {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const fetchProblem = async (currentLevel) => {
    try {
      const response = await fetch(`/api/problem/${currentLevel}`);
      const data = await response.json();
      setProblem(data);
      setFeedback({ text: "", type: "" });
    } catch (error) {
      console.error("Error cargando problema:", error);
    }
  };

  useEffect(() => {
    fetchProblem(level);
  }, [level]);

  const handleAnswer = async (selected) => {
    if (selected === problem.correct) {
      setFeedback({ text: "¡Excelente! +10 puntos 🌟", type: "success" });
      setScore(prev => prev + 10);
      
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_123', level: level, score: 10 })
      });

      setTimeout(() => {
        if (level < 4) setLevel(prev => prev + 1);
        else setFeedback({ text: "¡Has completado todos los niveles! 🎉", type: "success" });
      }, 2000);
    } else {
      setFeedback({ text: "Casi... Inténtalo de nuevo. 💡", type: "error" });
    }
  };

  if (!problem) return <div className="loading">Cargando desafío...</div>;

  return (
    <div className="game-container">
      <header>
        <h1>TrigoMaster</h1>
        <div className="score-badge">Nivel {level} • {score} Puntos</div>
      </header>

      <main>
        <div className="canvas-wrapper">
          <GameCanvas problemData={problem.data} />
        </div>

        <section className="quiz-section">
          <h3>{problem.question}</h3>
          
          <div className="options-grid">
            {problem.options.map((opt, index) => (
              <button 
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          
          {feedback.text && (
            <div className={`feedback-msg feedback-${feedback.type}`}>
              {feedback.text}
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
        "Aprende razones trigonométricas con Google Cloud."
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);