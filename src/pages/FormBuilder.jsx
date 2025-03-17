import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormProvider, useForm } from '../contexts/FormContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Save, ArrowLeft, Settings, Trash2, GripVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const questionTypes = [
  { id: 'text', label: 'Short Text' },
  { id: 'textarea', label: 'Long Text' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
  { id: 'select', label: 'Dropdown' },
  { id: 'radio', label: 'Single Choice' },
  { id: 'checkbox', label: 'Multiple Choice' },
  { id: 'rating', label: 'Rating' },
  { id: 'date', label: 'Date' },
  { id: 'yesno', label: 'Yes/No' },
];

const FormBuilder = () => {
  return (
    <FormProvider>
      <FormBuilderContent />
    </FormProvider>
  );
};

const FormBuilderContent = () => {
  const { formId } = useParams();
  const { getForm, saveForm } = useForm();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [],
    settings: {
      showProgressBar: true,
      theme: 'default',
    },
  });
  
  const [activeTab, setActiveTab] = useState('questions');
  
  useEffect(() => {
    if (formId) {
      const existingForm = getForm(formId);
      if (existingForm) {
        setFormData(existingForm);
      } else {
        toast.error('Form not found');
        navigate('/');
      }
    }
  }, [formId, getForm, navigate]);
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };
  
  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      title: `New ${questionTypes.find(t => t.id === type)?.label || 'Question'}`,
      required: false,
    };
    
    // Add options for choice-based questions
    if (['select', 'radio', 'checkbox'].includes(type)) {
      newQuestion.options = {
        choices: ['Option 1', 'Option 2', 'Option 3']
      };
    } else if (type === 'rating') {
      newQuestion.options = {
        scale: 5
      };
    }
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };
  
  const updateQuestion = (id, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    }));
  };
  
  const removeQuestion = (id) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.questions.findIndex(q => q.id === active.id);
        const newIndex = prev.questions.findIndex(q => q.id === over.id);
        
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex)
        };
      });
    }
  };
  
  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }
    
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    const savedForm = saveForm({
      ...formData,
      id: formId
    });
    
    if (savedForm && !formId) {
      navigate(`/forms/${savedForm.id}`);
    }
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {formId ? 'Edit Form' : 'Create Form'}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/forms/${formId}/view`)}
              disabled={!formId}
              className="flex items-center"
            >
              <Eye size={16} className="mr-1" /> Preview
            </Button>
            <Button 
              onClick={handleSave}
              className="flex items-center"
            >
              <Save size={16} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Form Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter form title"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter form description"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('questions')}
              >
                Questions
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'questions' ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add Question</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {questionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => addQuestion(type.id)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-center"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                  
                  {formData.questions.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                      <p className="text-gray-500">No questions yet. Add your first question above.</p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={formData.questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {formData.questions.map((question, index) => (
                          <QuestionItem
                            key={question.id}
                            question={question}
                            index={index}
                            updateQuestion={updateQuestion}
                            removeQuestion={removeQuestion}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Form Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showProgressBar"
                      name="showProgressBar"
                      checked={formData.settings.showProgressBar}
                      onChange={handleSettingsChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showProgressBar" className="ml-2 block text-sm text-gray-900">
                      Show progress bar
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={formData.settings.theme}
                      onChange={handleSettingsChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="colorful">Colorful</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const QuestionItem = ({ question, index, updateQuestion, removeQuestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateQuestion(question.id, {
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleOptionChange = (e, optionIndex) => {
    const { value } = e.target;
    const updatedOptions = { ...question.options };
    updatedOptions.choices[optionIndex] = value;
    
    updateQuestion(question.id, {
      options: updatedOptions
    });
  };
  
  const addOption = () => {
    const updatedOptions = { ...question.options };
    updatedOptions.choices = [...(updatedOptions.choices || []), `Option ${(updatedOptions.choices?.length || 0) + 1}`];
    
    updateQuestion(question.id, {
      options: updatedOptions
    });
  };
  
  const removeOption = (optionIndex) => {
    const updatedOptions = { ...question.options };
    updatedOptions.choices = updatedOptions.choices.filter((_, i) => i !== optionIndex);
    
    updateQuestion(question.id, {
      options: updatedOptions
    });
  };
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <GripVertical size={16} />
          </div>
          <CardTitle className="text-base font-medium">
            {index + 1}. {question.title}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {questionTypes.find(t => t.id === question.type)?.label || question.type}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeQuestion(question.id);
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 pt-0 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label htmlFor={`title-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <Input
                id={`title-${question.id}`}
                name="title"
                value={question.title}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            {['select', 'radio', 'checkbox'].includes(question.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options?.choices?.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(e, i)}
                        className="w-full"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(i)}
                        disabled={question.options.choices.length <= 1}
                        className="ml-2 text-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> Add Option
                  </Button>
                </div>
              </div>
            )}
            
            {question.type === 'rating' && (
              <div>
                <label htmlFor={`scale-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Rating Scale
                </label>
                <select
                  id={`scale-${question.id}`}
                  value={question.options?.scale || 5}
                  onChange={(e) => updateQuestion(question.id, { 
                    options: { ...question.options, scale: parseInt(e.target.value) } 
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={5}>5 Stars</option>
                  <option value={10}>10 Points</option>
                </select>
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${question.id}`}
                name="required"
                checked={question.required}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-900">
                Required
              </label>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FormBuilder;