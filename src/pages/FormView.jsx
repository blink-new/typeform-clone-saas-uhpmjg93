import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from '../contexts/FormContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const FormView = () => {
  return (
    <FormProvider>
      <FormViewContent />
    </FormProvider>
  );
};

const FormViewContent = () => {
  const { formId } = useParams();
  const { getForm, saveResponse } = useForm();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    if (formId) {
      const formData = getForm(formId);
      if (formData) {
        setForm(formData);
        // Initialize answers object
        const initialAnswers = {};
        formData.questions.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } else {
        navigate('/');
      }
    }
  }, [formId, getForm, navigate]);
  
  if (!form) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const currentQuestion = form.questions[currentQuestionIndex];
  
  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('This question is required');
      return;
    }
    
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      saveResponse(formId, answers);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const progress = ((currentQuestionIndex + 1) / form.questions.length) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {form.settings.showProgressBar && !isCompleted && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
              <Button onClick={() => navigate('/')} className="mx-auto">
                Back to Home
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestion.title}
                </h2>
                
                <div className="mb-8">
                  <QuestionInput
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onChange={(value) => handleChange(currentQuestion.id, value)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Previous
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {currentQuestionIndex < form.questions.length - 1 ? (
                      <>
                        Next <ArrowRight size={16} className="ml-1" />
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {form.questions.length}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionInput = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'text':
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here"
          className="w-full"
        />
      );
      
    case 'textarea':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      );
      
    case 'email':
      return (
        <Input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your email"
          className="w-full"
        />
      );
      
    case 'number':
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a number"
          className="w-full"
        />
      );
      
    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option</option>
          {question.options?.choices?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      
    case 'radio':
      return (
        <div className="space-y-2">
          {question.options?.choices?.map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      );
      
    case 'checkbox':
      return (
        <div className="space-y-2">
          {question.options?.choices?.map((option, index) => {
            const values = value ? (Array.isArray(value) ? value : [value]) : [];
            return (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={values.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...values, option]
                      : values.filter(v => v !== option);
                    onChange(newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">{option}</span>
              </label>
            );
          })}
        </div>
      );
      
    case 'rating':
      const scale = question.options?.scale || 5;
      return (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: scale }).map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                value === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
      
    case 'date':
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );
      
    case 'yesno':
      return (
        <div className="flex space-x-4">
          <Button
            variant={value === 'Yes' ? 'primary' : 'outline'}
            onClick={() => onChange('Yes')}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            variant={value === 'No' ? 'primary' : 'outline'}
            onClick={() => onChange('No')}
            className="flex-1"
          >
            No
          </Button>
        </div>
      );
      
    default:
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here"
          className="w-full"
        />
      );
  }
};

export default FormView;