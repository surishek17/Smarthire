import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import quizData from '../questions.json'; // import the quiz data
import '../Quiz.css'; // create CSS file for styling

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Check if quiz state is saved in localStorage
    const savedState = JSON.parse(localStorage.getItem('quizState'));
    if (savedState) {
      setCurrentQuestion(savedState.currentQuestion);
      setScore(savedState.score);
      setTimeLeft(savedState.timeLeft);
    }
    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert('Time is up!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem('quizState', JSON.stringify({
      currentQuestion,
      score,
      timeLeft
    }));
  }, [currentQuestion, score, timeLeft]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      alert(`Quiz finished! Your score: ${score + (isCorrect ? 1 : 0)}/${quizData.length}`);
      localStorage.removeItem('quizState');
    }
  };

  const requestFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } 
    setIsFullScreen(true);
  };

  useEffect(() => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  if (!isFullScreen) {
    return (
      <div className="fullscreen-message">
        <h2>Please enable full screen to start the quiz</h2>
        <button onClick={requestFullScreen}>Go Full Screen</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</h2>
      <motion.div
        className="question-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>{quizData[currentQuestion].question}</h3>
        <div className="options">
          {quizData[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option === quizData[currentQuestion].answer)}
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;