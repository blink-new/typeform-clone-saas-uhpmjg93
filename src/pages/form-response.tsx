import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Form, Question, Answer } from '@/lib/types';
import { mockForms } from '@/lib/mock-data';

export function FormResponsePage() {
  // In a real app, we would get the form ID from the URL
  const formId = 'form-1';
  const [form, setForm] = useState<Form | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Fetch form data
    const foundForm = mockForms.find(f => f.id === formId);
    if (foundForm) {
      setForm(foundForm);
      // Initialize answers array
      const initialAnswers = foundForm.questions.map(q => ({
        questionId: q.id,
        value: q.type === 'multiple_choice' ? [] : '',
      }));
      setAnswers(initialAnswers);
    }
  }, [formId]);

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = form.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / form.questions.length) * 100;

  const updateAnswer = (questionId: string, value: string | string[] | number | boolean) => {
    setAnswers(prev => 
      prev.map(a => a.questionId === questionId ? { ...a, value } : a)
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsCompleted(true);
  };

  const renderQuestionInput = (question: Question) => {
    const answer = answers.find(a => a.questionId === question.id);
    
    switch (question.type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={answer?.value as string || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder={question.placeholder || 'Type your answer here'}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required={question.required}
          />
        );
      
      case 'long_text':
        return (
          <textarea
            value={answer?.value as string || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder={question.placeholder || 'Type your answer here'}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={5}
            required={question.required}
          />
        );
      
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(answer?.value as string[] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = answer?.value as string[] || [];
                    if (e.target.checked) {
                      updateAnswer(question.id, [...currentValues, option]);
                    } else {
                      updateAnswer(question.id, currentValues.filter(v => v !== option));
                    }
                  }}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'single_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answer?.value === option}
                  onChange={() => updateAnswer(question.id, option)}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 mt-0.5"
                  required={question.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex space-x-2 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => updateAnswer(question.id, rating)}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
                  answer?.value === rating 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      
      case 'yes_no':
        return (
          <div className="flex space-x-4 justify-center">
            <button
              type="button"
              onClick={() => updateAnswer(question.id, true)}
              className={`px-6 py-3 rounded-md text-lg font-medium transition-colors ${
                answer?.value === true 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateAnswer(question.id, false)}
              className={`px-6 py-3 rounded-md text-lg font-medium transition-colors ${
                answer?.value === false 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              No
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const isCurrentQuestionAnswered = () => {
    const answer = answers.find(a => a.questionId === currentQuestion.id);
    if (!currentQuestion.required) return true;
    
    if (!answer) return false;
    
    if (Array.isArray(answer.value)) {
      return answer.value.length > 0;
    }
    
    return answer.value !== '' && answer.value !== undefined && answer.value !== null;
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: form.theme.backgroundColor,
        fontFamily: form.theme.fontFamily,
      }}
    >
      {form.settings.showProgressBar && (
        <div className="w-full h-1 bg-gray-200">
          <div 
            className="h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%`, backgroundColor: form.theme.primaryColor }}
          ></div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {!isCompleted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                {currentQuestionIndex === 0 && (
                  <div className="mb-8 text-center">
                    <h1 
                      className="text-2xl font-bold mb-4"
                      style={{ color: form.theme.primaryColor }}
                    >
                      {form.title}
                    </h1>
                    {form.description && (
                      <p className="text-gray-600">{form.description}</p>
                    )}
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">{currentQuestion.title}</h2>
                  {currentQuestion.description && (
                    <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
                  )}
                  
                  <div className="mt-6">
                    {renderQuestionInput(currentQuestion)}
                  </div>
                </div>

                <div className="flex justify-between">
                  {currentQuestionIndex > 0 ? (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered() || isSubmitting}
                    isLoading={isSubmitting}
                    className={`flex items-center ${
                      form.theme.buttonStyle === 'pill' ? 'rounded-full' : 
                      form.theme.buttonStyle === 'square' ? 'rounded-none' : ''
                    }`}
                    style={{ 
                      backgroundColor: form.theme.primaryColor,
                      opacity: !isCurrentQuestionAnswered() ? 0.7 : 1 
                    }}
                  >
                    {currentQuestionIndex < form.questions.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="h-16 w-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: form.theme.primaryColor }}
                >
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">
                {form.settings.thankYouMessage || 'Thank you for your response!'}
              </h2>
              
              <p className="text-gray-600 mb-8">
                Your submission has been recorded.
              </p>
              
              {form.settings.allowMultipleResponses && (
                <Button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setIsCompleted(false);
                    
                    // Reset answers
                    const initialAnswers = form.questions.map(q => ({
                      questionId: q.id,
                      value: q.type === 'multiple_choice' ? [] : '',
                    }));
                    setAnswers(initialAnswers);
                  }}
                  className={form.theme.buttonStyle === 'pill' ? 'rounded-full' : form.theme.buttonStyle === 'square' ? 'rounded-none' : ''}
                  style={{ backgroundColor: form.theme.primaryColor }}
                >
                  Submit another response
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="py-4 text-center text-sm text-gray-500">
        Powered by <span className="font-semibold text-primary">FormFlow</span>
      </div>
    </div>
  );
}