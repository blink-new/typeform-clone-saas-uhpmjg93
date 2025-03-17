import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load forms from localStorage
    const storedForms = localStorage.getItem('forms');
    if (storedForms) {
      setForms(JSON.parse(storedForms));
    } else {
      // Set some sample forms for demo
      const sampleForms = [
        {
          id: '1',
          title: 'Customer Feedback',
          description: 'Get feedback from your customers',
          questions: [
            {
              id: '1',
              type: 'text',
              title: 'What is your name?',
              required: true,
            },
            {
              id: '2',
              type: 'email',
              title: 'What is your email?',
              required: true,
            },
            {
              id: '3',
              type: 'rating',
              title: 'How would you rate our service?',
              required: true,
              options: {
                scale: 5,
              },
            },
            {
              id: '4',
              type: 'textarea',
              title: 'Any additional feedback?',
              required: false,
            },
          ],
          settings: {
            showProgressBar: true,
            theme: 'default',
          },
          createdAt: new Date().toISOString(),
          responses: [],
        },
      ];
      setForms(sampleForms);
      localStorage.setItem('forms', JSON.stringify(sampleForms));
    }
    setLoading(false);
  }, []);

  const saveForm = (form) => {
    try {
      if (form.id) {
        // Update existing form
        const updatedForms = forms.map(f => f.id === form.id ? form : f);
        setForms(updatedForms);
        localStorage.setItem('forms', JSON.stringify(updatedForms));
        toast.success('Form updated successfully');
      } else {
        // Create new form
        const newForm = {
          ...form,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          responses: [],
        };
        const updatedForms = [...forms, newForm];
        setForms(updatedForms);
        localStorage.setItem('forms', JSON.stringify(updatedForms));
        toast.success('Form created successfully');
        return newForm;
      }
    } catch (error) {
      toast.error('Failed to save form');
      return null;
    }
  };

  const getForm = (formId) => {
    return forms.find(form => form.id === formId) || null;
  };

  const deleteForm = (formId) => {
    try {
      const updatedForms = forms.filter(form => form.id !== formId);
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
      toast.success('Form deleted successfully');
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  const saveResponse = (formId, response) => {
    try {
      const form = forms.find(f => f.id === formId);
      if (!form) {
        toast.error('Form not found');
        return;
      }

      const updatedForm = {
        ...form,
        responses: [...form.responses, {
          id: Date.now().toString(),
          data: response,
          submittedAt: new Date().toISOString(),
        }],
      };

      const updatedForms = forms.map(f => f.id === formId ? updatedForm : f);
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
      toast.success('Response submitted successfully');
    } catch (error) {
      toast.error('Failed to submit response');
    }
  };

  const value = {
    forms,
    loading,
    saveForm,
    getForm,
    deleteForm,
    saveResponse,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};