// User types
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'business';
}

// Form types
export interface Form {
  id: string;
  userId: string;
  title: string;
  description?: string;
  questions: Question[];
  theme: FormTheme;
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  responses: number;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  logoUrl?: string;
}

export interface FormSettings {
  showProgressBar: boolean;
  redirectUrl?: string;
  showThankYouScreen: boolean;
  thankYouMessage?: string;
  allowMultipleResponses: boolean;
}

// Question types
export type QuestionType = 
  | 'short_text' 
  | 'long_text' 
  | 'multiple_choice' 
  | 'single_choice' 
  | 'rating' 
  | 'yes_no';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

// Response types
export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  createdAt: string;
  completedAt?: string;
  completed: boolean;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number | boolean;
}

// Subscription plans
export interface Plan {
  id: 'free' | 'pro' | 'business';
  name: string;
  price: number;
  features: string[];
  limits: {
    forms: number;
    responsesPerMonth: number;
    questionTypes: QuestionType[];
    customBranding: boolean;
    teamMembers: number;
  };
}