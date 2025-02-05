import { useParams } from "react-router-dom";
import { useState } from "react";
import companies from "../data/companies";

const InterviewPage = () => {
  const { companyId } = useParams();
  const company = companies.find((c) => c.id === companyId);

  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Track user answers

  // Handle answer selection
  const handleAnswerChange = (questionId, selectedAnswer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: selectedAnswer,
    });
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    const correctAnswers = company.quiz.filter(
      (q, i) => q.answer === userAnswers[q.id] // Compare the selected answers
    );
    setScore(correctAnswers.length);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container px-6 mx-auto">
        {/* Company Overview */}
        <div className="text-center">
          <img src={company.logo} alt={company.name} className="w-24 mx-auto" />
          <h2 className="mt-2 text-3xl font-bold">{company.name}</h2>
          <p className="mt-1 text-gray-600">{company.description}</p>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-orange-500 underline"
          >
            Visit Website
          </a>
        </div>

        {/* Employee Reviews */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">📝 Employee Reviews</h3>
          <div className="mt-4">
            {company.reviews.map((review, index) => (
              <div key={index} className="p-4 mb-2 bg-gray-100 rounded-lg">
                <p className="font-medium text-gray-800">{review.user}</p>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">📌 Interview Questions</h3>
          <div className="mt-4">
            {company.questions.map((q) => (
              <details key={q.id} className="p-4 mb-2 bg-gray-100 rounded-lg">
                <summary className="font-medium cursor-pointer">
                  {q.question}
                </summary>
                <p className="mt-2 text-gray-700">{q.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">🎯 Quiz Time!</h3>
          {!quizStarted ? (
            <button
              onClick={() => setQuizStarted(true)}
              className="px-4 py-2 mt-2 text-white bg-orange-500 rounded-md"
            >
              Start Quiz
            </button>
          ) : (
            <div className="mt-4">
              {company.quiz.map((q, index) => (
                <div key={q.id} className="mb-4">
                  <p className="text-lg font-medium">{q.question}</p>
                  {q.options.map((option, i) => (
                    <label key={i} className="block mt-1">
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={option}
                        onChange={() => handleAnswerChange(q.id, option)} // Handle answer selection
                      />{" "}
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button
                onClick={handleQuizSubmit}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>

        {/* Show Score */}
        {quizStarted && (
          <p className="mt-4 font-bold">
            Your Score: {score} / {company.quiz.length}
          </p>
        )}
      </div>
    </section>
  );
};

export default InterviewPage;
