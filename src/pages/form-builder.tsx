import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Question, QuestionType, Form, FormTheme, FormSettings } from '@/lib/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ArrowLeft, Settings, Palette, Eye, Save, Plus, Trash, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const questionTypes: { type: QuestionType; label: string; icon: React.ReactNode }[] = [
  { type: 'short_text', label: 'Short Text', icon: <span className="text-lg">Aa</span> },
  { type: 'long_text', label: 'Long Text', icon: <span className="text-lg">Aa+</span> },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: <span className="text-lg">☑</span> },
  { type: 'single_choice', label: 'Single Choice', icon: <span className="text-lg">◉</span> },
  { type: 'rating', label: 'Rating', icon: <span className="text-lg">★</span> },
  { type: 'yes_no', label: 'Yes/No', icon: <span className="text-lg">✓✗</span> },
];

export function FormBuilderPage() {
  const [activeTab, setActiveTab] = useState('build');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  
  const [form, setForm] = useState<Form>({
    id: `form-${Date.now()}`,
    userId: 'user-1',
    title: 'Untitled Form',
    description: '',
    questions: [],
    theme: {
      primaryColor: '#0284c7',
      backgroundColor: '#f0f9ff',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
    },
    settings: {
      showProgressBar: true,
      showThankYouScreen: true,
      thankYouMessage: 'Thank you for your response!',
      allowMultipleResponses: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    responses: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      title: `Question ${form.questions.length + 1}`,
      required: true,
      options: type === 'multiple_choice' || type === 'single_choice' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    
    const updatedQuestions = [...form.questions, newQuestion];
    setForm({ ...form, questions: updatedQuestions });
    setSelectedQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = updatedQuestion;
    setForm({ ...form, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: updatedQuestions });
    setSelectedQuestionIndex(null);
  };

  const updateFormDetails = (key: keyof Form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const updateTheme = (key: keyof FormTheme, value: string) => {
    setForm({ ...form, theme: { ...form.theme, [key]: value } });
  };

  const updateSettings = (key: keyof FormSettings, value: boolean | string) => {
    setForm({ ...form, settings: { ...form.settings, [key]: value } });
  };

  const renderQuestionEditor = () => {
    if (selectedQuestionIndex === null || !form.questions[selectedQuestionIndex]) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No question selected</h3>
          <p className="text-gray-500 mb-4">Select a question to edit or add a new one</p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            {questionTypes.map((qType) => (
              <Button
                key={qType.type}
                variant="outline"
                className="flex items-center justify-center h-16"
                onClick={() => addQuestion(qType.type)}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-1">{qType.icon}</div>
                  <span className="text-xs">{qType.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      );
    }

    const question = form.questions[selectedQuestionIndex];

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Question</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeQuestion(selectedQuestionIndex)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={question.type}
              onChange={(e) => {
                const newType = e.target.value as QuestionType;
                const updatedQuestion: Question = {
                  ...question,
                  type: newType,
                  options: newType === 'multiple_choice' || newType === 'single_choice' 
                    ? question.options || ['Option 1', 'Option 2', 'Option 3'] 
                    : undefined,
                };
                updateQuestion(selectedQuestionIndex, updatedQuestion);
              }}
            >
              {questionTypes.map((qType) => (
                <option key={qType.type} value={qType.type}>
                  {qType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <Input
              value={question.title}
              onChange={(e) => {
                updateQuestion(selectedQuestionIndex, { ...question, title: e.target.value });
              }}
              placeholder="Enter your question"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <Input
              value={question.description || ''}
              onChange={(e) => {
                updateQuestion(selectedQuestionIndex, { ...question, description: e.target.value });
              }}
              placeholder="Add a description"
            />
          </div>

          {(question.type === 'multiple_choice' || question.type === 'single_choice') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[optionIndex] = e.target.value;
                        updateQuestion(selectedQuestionIndex, { ...question, options: newOptions });
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newOptions = question.options?.filter((_, i) => i !== optionIndex);
                        updateQuestion(selectedQuestionIndex, { ...question, options: newOptions });
                      }}
                      className="ml-2"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                    updateQuestion(selectedQuestionIndex, { ...question, options: newOptions });
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {(question.type === 'short_text' || question.type === 'long_text') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
              <Input
                value={question.placeholder || ''}
                onChange={(e) => {
                  updateQuestion(selectedQuestionIndex, { ...question, placeholder: e.target.value });
                }}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={question.required}
              onChange={(e) => {
                updateQuestion(selectedQuestionIndex, { ...question, required: e.target.checked });
              }}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
              Required question
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{form.title || 'Untitled Form'}</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                      <Input
                        value={form.title}
                        onChange={(e) => updateFormDetails('title', e.target.value)}
                        placeholder="Enter form title"
                        className="text-lg font-medium"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Form Description (Optional)</label>
                      <Input
                        value={form.description || ''}
                        onChange={(e) => updateFormDetails('description', e.target.value)}
                        placeholder="Enter form description"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                      
                      {form.questions.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                          <p className="text-gray-500 mb-4">Add your first question to get started</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {questionTypes.map((qType) => (
                              <Button
                                key={qType.type}
                                variant="outline"
                                size="sm"
                                onClick={() => addQuestion(qType.type)}
                              >
                                {qType.icon}
                                <span className="ml-1">{qType.label}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                        >
                          <div className="space-y-3">
                            {form.questions.map((question, index) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`border rounded-md p-4 cursor-pointer ${
                                  selectedQuestionIndex === index ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
                                }`}
                                onClick={() => setSelectedQuestionIndex(index)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">{question.title}</h4>
                                      <p className="text-sm text-gray-500">
                                        {questionTypes.find(q => q.type === question.type)?.label}
                                        {question.required && ' • Required'}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeQuestion(index);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </DndContext>
                      )}

                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => setSelectedQuestionIndex(null)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-0 h-[calc(100vh-180px)] overflow-y-auto">
                    {renderQuestionEditor()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center min-h-[500px] border rounded-md">
                      <div 
                        className="w-full max-w-lg p-8 rounded-lg shadow-sm"
                        style={{ 
                          backgroundColor: form.theme.backgroundColor,
                          fontFamily: form.theme.fontFamily,
                        }}
                      >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: form.theme.primaryColor }}>
                          {form.title || 'Untitled Form'}
                        </h2>
                        {form.description && <p className="text-gray-600 mb-6">{form.description}</p>}
                        
                        {form.questions.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">{form.questions[0].title}</h3>
                            {form.questions[0].description && (
                              <p className="text-gray-600 mb-4">{form.questions[0].description}</p>
                            )}
                            
                            {form.questions[0].type === 'short_text' && (
                              <input
                                type="text"
                                placeholder={form.questions[0].placeholder || 'Type your answer here'}
                                className="w-full p-2 border rounded-md"
                              />
                            )}
                            
                            {form.questions[0].type === 'long_text' && (
                              <textarea
                                placeholder={form.questions[0].placeholder || 'Type your answer here'}
                                className="w-full p-2 border rounded-md"
                                rows={4}
                              />
                            )}
                            
                            {(form.questions[0].type === 'single_choice' || form.questions[0].type === 'multiple_choice') && (
                              <div className="space-y-2">
                                {form.questions[0].options?.map((option, i) => (
                                  <div key={i} className="flex items-center">
                                    <input
                                      type={form.questions[0].type === 'single_choice' ? 'radio' : 'checkbox'}
                                      name={`question-${form.questions[0].id}`}
                                      className="h-4 w-4 text-primary"
                                    />
                                    <label className="ml-2">{option}</label>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {form.questions[0].type === 'rating' && (
                              <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {form.questions[0].type === 'yes_no' && (
                              <div className="flex space-x-4">
                                <button
                                  className={`px-4 py-2 rounded-md border ${
                                    form.theme.buttonStyle === 'pill' ? 'rounded-full' : 
                                    form.theme.buttonStyle === 'square' ? 'rounded-none' : 'rounded-md'
                                  }`}
                                  style={{ borderColor: form.theme.primaryColor }}
                                >
                                  Yes
                                </button>
                                <button
                                  className={`px-4 py-2 rounded-md border ${
                                    form.theme.buttonStyle === 'pill' ? 'rounded-full' : 
                                    form.theme.buttonStyle === 'square' ? 'rounded-none' : 'rounded-md'
                                  }`}
                                  style={{ borderColor: form.theme.primaryColor }}
                                >
                                  No
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <button
                            className={`px-4 py-2 text-white ${
                              form.theme.buttonStyle === 'pill' ? 'rounded-full' : 
                              form.theme.buttonStyle === 'square' ? 'rounded-none' : 'rounded-md'
                            }`}
                            style={{ backgroundColor: form.theme.primaryColor }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Theme Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={form.theme.primaryColor}
                            onChange={(e) => updateTheme('primaryColor', e.target.value)}
                            className="h-8 w-8 rounded-md border border-gray-300 mr-2"
                          />
                          <Input
                            value={form.theme.primaryColor}
                            onChange={(e) => updateTheme('primaryColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={form.theme.backgroundColor}
                            onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                            className="h-8 w-8 rounded-md border border-gray-300 mr-2"
                          />
                          <Input
                            value={form.theme.backgroundColor}
                            onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                        <select
                          value={form.theme.fontFamily}
                          onChange={(e) => updateTheme('fontFamily', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            className={`p-2 border rounded-md flex items-center justify-center ${
                              form.theme.buttonStyle === 'rounded' ? 'border-primary bg-primary-50' : 'border-gray-300'
                            }`}
                            onClick={() => updateTheme('buttonStyle', 'rounded')}
                          >
                            <div className="h-6 w-16 bg-primary rounded-md"></div>
                          </button>
                          <button
                            type="button"
                            className={`p-2 border rounded-md flex items-center justify-center ${
                              form.theme.buttonStyle === 'square' ? 'border-primary bg-primary-50' : 'border-gray-300'
                            }`}
                            onClick={() => updateTheme('buttonStyle', 'square')}
                          >
                            <div className="h-6 w-16 bg-primary"></div>
                          </button>
                          <button
                            type="button"
                            className={`p-2 border rounded-md flex items-center justify-center ${
                              form.theme.buttonStyle === 'pill' ? 'border-primary bg-primary-50' : 'border-gray-300'
                            }`}
                            onClick={() => updateTheme('buttonStyle', 'pill')}
                          >
                            <div className="h-6 w-16 bg-primary rounded-full"></div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo (Optional)</label>
                        <Input
                          type="file"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Form Settings
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-2">Progress Indicator</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showProgressBar"
                            checked={form.settings.showProgressBar}
                            onChange={(e) => updateSettings('showProgressBar', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="showProgressBar" className="ml-2 block text-sm text-gray-900">
                            Show progress bar
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Display a progress bar to show respondents how far they are in the form.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-2">Completion</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showThankYouScreen"
                            checked={form.settings.showThankYouScreen}
                            onChange={(e) => updateSettings('showThankYouScreen', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="showThankYouScreen" className="ml-2 block text-sm text-gray-900">
                            Show thank you screen
                          </label>
                        </div>
                        
                        {form.settings.showThankYouScreen && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                            <Input
                              value={form.settings.thankYouMessage || ''}
                              onChange={(e) => updateSettings('thankYouMessage', e.target.value)}
                              placeholder="Enter thank you message"
                            />
                          </div>
                        )}

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL (Optional)</label>
                          <Input
                            value={form.settings.redirectUrl || ''}
                            onChange={(e) => updateSettings('redirectUrl', e.target.value)}
                            placeholder="https://example.com/thank-you"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Redirect respondents to this URL after form submission.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-2">Responses</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="allowMultipleResponses"
                            checked={form.settings.allowMultipleResponses}
                            onChange={(e) => updateSettings('allowMultipleResponses', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="allowMultipleResponses" className="ml-2 block text-sm text-gray-900">
                            Allow multiple responses from the same device
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          If disabled, respondents can only submit the form once per device.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Form Status</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={form.published ? 'published' : 'draft'}
                          onChange={(e) => setForm({ ...form, published: e.target.value === 'published' })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div>
                        <Button className="w-full">
                          <Save className="h-4 w-4 mr-1" />
                          Save Form
                        </Button>
                      </div>

                      {form.published && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Share Form</h4>
                          <div className="flex">
                            <Input
                              value={`https://formflow.com/f/${form.id}`}
                              readOnly
                              className="flex-1"
                            />
                            <Button variant="outline" className="ml-2">
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}