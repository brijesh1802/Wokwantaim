import { useParams } from "react-router-dom";
import { useState } from "react";
import companies from "../data/companies";
import { RotateCcw } from "lucide-react";

const InterviewPage = () => {
  const { companyId } = useParams();
  const company = companies.find((c) => c.id === companyId);

  const [activeTab, setActiveTab] = useState("reviews"); // Default tab

  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedAnswer });
  };

  const handleQuizSubmit = () => {
    const correctAnswers = company.quiz.filter(
      (q) => q.answer === userAnswers[q.id]
    );
    setScore(correctAnswers.length);
    setSubmitted(true);
  };

  const handleQuizReset = () => {
    setScore(0);
    setUserAnswers({});
    setSubmitted(false);
    setQuizStarted(false);
  };

  return (
    <section className="py-10 mt-16 bg-gradient-to-tr from-indigo-100 to-orange-50">
      <div className="container px-6 mx-auto">
        {/* Header */}
        <div className="text-center">
          <img src={company.logo} alt={company.name} className="w-24 mx-auto" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
            {company.name}
          </h2>
          <p className="mt-1 text-lg text-gray-600">{company.description}</p>
          {/* <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-orange-500 underline hover:text-orange-600"
          >
            Visit Website
          </a> */}
        </div>

        {/* Tabs for Sections */}
        <div className="mt-8 flex justify-center border-b-2 border-gray-200">
          {[
            { id: "reviews", label: "📝 Reviews" },
            { id: "questions", label: "📌 Interview Questions" },
            { id: "quiz", label: "🎯 Quiz" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === tab.id
                  ? "border-b-4 border-indigo-500 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              } transition`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {activeTab === "reviews" && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700">
                📝 Employee Reviews
              </h3>
              <div className="mt-4 space-y-4">
                {company.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white shadow-lg rounded-lg border-2 border-gray-100 hover:border-indigo-500"
                  >
                    <p className="font-medium text-gray-800">{review.user}</p>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700">
                📌 Interview Questions
              </h3>
              <div className="mt-4 space-y-4">
                {company.questions.map((q) => (
                  <details
                    key={q.id}
                    className="p-4 bg-white shadow-lg rounded-lg border-2 border-gray-100"
                  >
                    <summary className="font-medium cursor-pointer text-gray-800 hover:text-indigo-500">
                      {q.question}
                    </summary>
                    <p className="mt-2 text-gray-700">{q.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700">
                🎯 Quiz Time!
              </h3>
              {!quizStarted ? (
                <button
                  onClick={() => setQuizStarted(true)}
                  className="px-6 py-3 mt-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300"
                >
                  Start Quiz
                </button>
              ) : (
                <div className="mt-4 space-y-6">
                  {company.quiz.map((q, index) => {
                    const isAnswerCorrect = userAnswers[q.id] === q.answer;
                    return (
                      <div
                        key={q.id}
                        className={`mb-4 p-4 rounded-lg bg-white ${
                          submitted
                            ? isAnswerCorrect
                              ? "bg-green-100"
                              : "bg-red-100"
                            : ""
                        }`}
                      >
                        <p className="text-lg font-medium">{q.question}</p>
                        {q.options.map((option, i) => {
                          const isSelected = userAnswers[q.id] === option;
                          const isCorrect = q.answer === option;
                          return (
                            <label
                              key={i}
                              className={`block mt-1 ${
                                submitted && isSelected && !isCorrect
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${index}`}
                                value={option}
                                onChange={() =>
                                  handleAnswerChange(q.id, option)
                                }
                                disabled={submitted}
                              />{" "}
                              {option}
                              {submitted && isSelected && isCorrect && (
                                <span className="ml-2 text-green-500">✔️</span>
                              )}
                              {submitted &&
                                !isCorrect &&
                                q.answer === option && (
                                  <span className="ml-2 text-green-500">
                                    ✔️
                                  </span>
                                )}
                            </label>
                          );
                        })}
                      </div>
                    );
                  })}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleQuizSubmit}
                      className={`px-4 py-2 text-white rounded-md ${
                        Object.keys(userAnswers).length !== company.quiz.length
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-500"
                      }`}
                      disabled={
                        Object.keys(userAnswers).length !== company.quiz.length
                      }
                    >
                      Submit Quiz
                    </button>
                    <RotateCcw
                      onClick={handleQuizReset}
                      className="w-6 h-6 mt-2 text-gray-500 cursor-pointer hover:text-gray-700"
                    />
                  </div>
                </div>
              )}
              {submitted && (
                <p className="mt-4 font-bold">
                  Your Score: {score} / {company.quiz.length}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InterviewPage;
