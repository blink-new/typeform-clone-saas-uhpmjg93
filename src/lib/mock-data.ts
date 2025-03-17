import { Form, Plan, Response, User } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@formflow.com',
    plan: 'free',
  },
];

// Mock Forms
export const mockForms: Form[] = [
  {
    id: 'form-1',
    userId: 'user-1',
    title: 'Customer Feedback Survey',
    description: 'Help us improve our products and services',
    questions: [
      {
        id: 'q-1',
        type: 'short_text',
        title: 'What is your name?',
        required: true,
        placeholder: 'John Doe',
      },
      {
        id: 'q-2',
        type: 'single_choice',
        title: 'How did you hear about us?',
        required: true,
        options: ['Social Media', 'Friend', 'Advertisement', 'Search Engine', 'Other'],
      },
      {
        id: 'q-3',
        type: 'rating',
        title: 'How would you rate our service?',
        required: true,
      },
      {
        id: 'q-4',
        type: 'long_text',
        title: 'Do you have any suggestions for improvement?',
        required: false,
        placeholder: 'Your feedback helps us improve',
      },
    ],
    theme: {
      primaryColor: '#0284c7',
      backgroundColor: '#f0f9ff',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
    },
    settings: {
      showProgressBar: true,
      showThankYouScreen: true,
      thankYouMessage: 'Thank you for your feedback!',
      allowMultipleResponses: false,
    },
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:20:00Z',
    published: true,
    responses: 24,
  },
  {
    id: 'form-2',
    userId: 'user-1',
    title: 'Event Registration',
    description: 'Register for our upcoming webinar',
    questions: [
      {
        id: 'q-1',
        type: 'short_text',
        title: 'Full Name',
        required: true,
        placeholder: 'John Doe',
      },
      {
        id: 'q-2',
        type: 'short_text',
        title: 'Email Address',
        required: true,
        placeholder: 'john@example.com',
      },
      {
        id: 'q-3',
        type: 'single_choice',
        title: 'Which session will you attend?',
        required: true,
        options: ['Morning Session (9 AM)', 'Afternoon Session (2 PM)', 'Evening Session (7 PM)'],
      },
      {
        id: 'q-4',
        type: 'yes_no',
        title: 'Would you like to receive updates about future events?',
        required: false,
      },
    ],
    theme: {
      primaryColor: '#0284c7',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      buttonStyle: 'pill',
    },
    settings: {
      showProgressBar: true,
      redirectUrl: 'https://example.com/thank-you',
      showThankYouScreen: false,
      allowMultipleResponses: false,
    },
    createdAt: '2023-06-01T09:15:00Z',
    updatedAt: '2023-06-02T11:45:00Z',
    published: true,
    responses: 42,
  },
  {
    id: 'form-3',
    userId: 'user-1',
    title: 'Product Survey (Draft)',
    description: 'Get feedback on our new product',
    questions: [
      {
        id: 'q-1',
        type: 'short_text',
        title: 'Name',
        required: true,
        placeholder: 'Your name',
      },
      {
        id: 'q-2',
        type: 'multiple_choice',
        title: 'Which features do you like?',
        required: true,
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
      },
    ],
    theme: {
      primaryColor: '#0284c7',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
    },
    settings: {
      showProgressBar: true,
      showThankYouScreen: true,
      thankYouMessage: 'Thanks for your input!',
      allowMultipleResponses: true,
    },
    createdAt: '2023-06-10T15:20:00Z',
    updatedAt: '2023-06-10T16:30:00Z',
    published: false,
    responses: 0,
  },
];

// Mock Responses
export const mockResponses: Response[] = [
  {
    id: 'resp-1',
    formId: 'form-1',
    answers: [
      { questionId: 'q-1', value: 'Jane Smith' },
      { questionId: 'q-2', value: 'Social Media' },
      { questionId: 'q-3', value: 4 },
      { questionId: 'q-4', value: 'I love your product but would like more color options.' },
    ],
    createdAt: '2023-05-17T09:30:00Z',
    completedAt: '2023-05-17T09:35:00Z',
    completed: true,
  },
  {
    id: 'resp-2',
    formId: 'form-1',
    answers: [
      { questionId: 'q-1', value: 'Mike Johnson' },
      { questionId: 'q-2', value: 'Friend' },
      { questionId: 'q-3', value: 5 },
      { questionId: 'q-4', value: 'Everything is perfect!' },
    ],
    createdAt: '2023-05-18T14:20:00Z',
    completedAt: '2023-05-18T14:23:00Z',
    completed: true,
  },
  {
    id: 'resp-3',
    formId: 'form-2',
    answers: [
      { questionId: 'q-1', value: 'Alex Brown' },
      { questionId: 'q-2', value: 'alex@example.com' },
      { questionId: 'q-3', value: 'Morning Session (9 AM)' },
      { questionId: 'q-4', value: true },
    ],
    createdAt: '2023-06-03T10:15:00Z',
    completedAt: '2023-06-03T10:18:00Z',
    completed: true,
  },
];

// Subscription Plans
export const subscriptionPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 forms',
      'Maximum 100 responses per month',
      'Basic question types',
      'Basic analytics',
    ],
    limits: {
      forms: 3,
      responsesPerMonth: 100,
      questionTypes: ['short_text', 'long_text', 'yes_no'],
      customBranding: false,
      teamMembers: 1,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    features: [
      'Unlimited forms',
      'Up to 1,000 responses per month',
      'All question types',
      'Advanced analytics',
      'Custom branding',
      'Logic jumps',
    ],
    limits: {
      forms: Infinity,
      responsesPerMonth: 1000,
      questionTypes: ['short_text', 'long_text', 'multiple_choice', 'single_choice', 'rating', 'yes_no'],
      customBranding: true,
      teamMembers: 1,
    },
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    features: [
      'Everything in Pro',
      'Unlimited responses',
      'Team collaboration',
      'Priority support',
      'Custom domains',
      'Advanced integrations',
    ],
    limits: {
      forms: Infinity,
      responsesPerMonth: Infinity,
      questionTypes: ['short_text', 'long_text', 'multiple_choice', 'single_choice', 'rating', 'yes_no'],
      customBranding: true,
      teamMembers: 5,
    },
  },
];