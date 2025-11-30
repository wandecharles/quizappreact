import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import QuestionCard from './components/QuestionCard'
import { questions } from './data/questions'


const App = () => {
  //select the current question and display it on the questionCard UI,, the current question count is zero
  const [currentQuestion, setCurrentQuestion] = useState(0)
  //select and set the current option selected from the questionCard UI,, it starts at as null
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  //sel the current score for every interaction with the options
  const [score, setScore] = useState(0)
  //confirm if the quiz has ended
  const [isFinished, setIsfinished] = useState(false)
  //indicate a feedback if the selected option is correct or wrong (green or red) 

  const [loadedQuestions, setLoadedQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFeedback, setShowfeedback] = useState(false)


//   useEffect(() => {
//   const fetchQuestions = async () => {
//     try {
//       const response = await fetch("https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple");

//       if (!response.ok) throw new Error("Failed to fetch questions");

//       const data = await response.json();

//       // Make sure the API returns array of questions
//       setLoadedQuestions(data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to fetch online questions. Using local backup.");
//       setLoadedQuestions(questions); // fallback to local
//       setLoading(false);
//     }
//   };

//   fetchQuestions();
// }, []);


useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://the-trivia-api.com/v2/questions?limit=20");

      if (!response.ok) throw new Error("Failed to fetch questions");

      const raw = await response.json();

      // 🎯 Convert API format → your quiz format
      const formatted = raw.map(q => ({
        question: q.question.text,
        options: [...q.incorrectAnswers, q.correctAnswer]
                  .sort(() => Math.random() - 0.5),
        answer: q.correctAnswer
      }));

      setLoadedQuestions(formatted);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Unable to fetch online questions. Using local backup.");
      setLoadedQuestions(questions); // fallback to local
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);



  //handleAnswer function allows you to select an option and set it as the selectedAnswers , if the selected answer is equal the answer of the current question then it will increase the score by 1, and allow the option to set the showfeedback as true (which means the backgroud of the options will indicate gray, red or green)
  const handleAnswer = (option) => {

  if (showFeedback) return;

  setSelectedAnswer(option);
  setShowfeedback(true);

  if (option === loadedQuestions[currentQuestion].answer) {
    setScore(score + 1);
  }

  }

  const goTonext = () => {
    if(currentQuestion + 1 < loadedQuestions.length)
      {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowfeedback(false)
    }
    else {
      setIsfinished(true)
    }

  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowfeedback(false)
    setIsfinished(false)
  }

  const calculateProgress = () => {
    if (!loadedQuestions) return 0; // FIX 1: Prevent crash
    if (isFinished) return 100;

    const baseProgress = (currentQuestion / loadedQuestions.length) * 100;
    const questionProgress = selectedAnswer ? (1 / loadedQuestions.length) * 100 : 0;
    return baseProgress + questionProgress;
  };


  // ⛔ FIX 2: Only calculate percentage AFTER questions are loaded
  const percentage = loadedQuestions ? (score / loadedQuestions.length) * 100 : 0;
  const showConfetti = isFinished && percentage >= 50;


  return(
    <div className="min-h-screen bg-gray-900 flex items-center justify-center flex-col">

  {loading && (
    <p className="text-gray-300 text-xl">Loading questions...</p>
  )}

  {!loading && error && (
    <p className="text-red-400 mb-4">{error}</p>
  )}

  {/* FIX 3: Render only AFTER questions are loaded */}
  {!loading && loadedQuestions && (
    <>
      {showConfetti && <Confetti />}

      <div className="text-center mb-6">
        <h1 className="text-purple-900">React Quiz App</h1>
        <p className="text-gray-500">test your knowledge</p>
      </div>

    <div className="w-full max-w-xl mb-6 ">
      <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 duration-500 ease-out transition-all" 
             style={{ width: `${calculateProgress()}%` }}></div>
      </div>
    </div>
    
    {!isFinished ? (
      <> {/*the showFeedback variable in the question card component allows the user to know when a question has been added. if the show feed back is true, the option divs will possess new styling proerties such as a gray background. this will indicate that the buttons are disabled */}
     <QuestionCard 
       current={currentQuestion} 
       total={loadedQuestions.length} 
       selected={selectedAnswer} 
       showFeedback={showFeedback} 
       onAnswer={handleAnswer} 
       data={loadedQuestions[currentQuestion]} 
     />

      <div className="min-h-[70px]">
        {showFeedback && (
          <button 
            onClick={goTonext} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg cursor-pointer mt-4"
          >
            {currentQuestion + 1 < loadedQuestions.length ? "Next" : "See Results"}
          </button>
        )}
      </div>
      </>
    ) : (
      <div className="text-center">
      <h2 className="text-white text-lg">Quiz Completed!</h2>
      <p className="text-lg text-white ">
        You scored: <span>{score}!{" "}</span> 
        And that's: {Math.round((score/loadedQuestions.length) * 100)}%
        </p>
        <button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg cursor-pointer mt-4" 
          onClick={restartQuiz}
        >
          Restart Quiz
        </button>
    </div>
    )}

    </>
     )}
    
    </div>

  );
};

export default App
