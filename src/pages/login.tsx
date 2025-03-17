import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Or start your 14-day free trial"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-700">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <Button
              variant="outline"
              className="w-full"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9313 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 17.523 6.47731 22 12.0003 22C17.5233 22 22.0003 17.523 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2ZM16.9503 9.8H14.0703C13.9303 9.17 13.7403 8.54 13.5003 7.92C14.2803 7.43 14.9403 6.73 15.4003 5.82C16.4403 6.74 17.2303 7.95 17.6103 9.33C17.4003 9.53 17.1803 9.68 16.9503 9.8ZM12.0003 4C12.9303 4 13.8303 4.19 14.6503 4.54C14.3303 5.19 13.8403 5.73 13.2403 6.13C12.9403 5.43 12.5903 4.75 12.2003 4.09C12.1303 4.06 12.0703 4.03 12.0003 4ZM7.47031 7.5C8.02031 8.07 8.70031 8.5 9.44031 8.74C9.74031 9.42 9.98031 10.16 10.1603 10.94H6.05031C6.16031 9.72 6.69031 8.6 7.47031 7.5ZM4.00031 12C4.00031 11.72 4.02031 11.44 4.06031 11.17H10.4503C10.4003 11.5 10.3603 11.84 10.3603 12.19C10.3603 12.59 10.4003 12.97 10.4703 13.34H4.11031C4.04031 12.9 4.00031 12.45 4.00031 12ZM7.47031 16.5C6.72031 15.45 6.20031 14.18 6.07031 12.83H10.5903C10.5003 13.27 10.3603 13.69 10.1803 14.08C9.40031 14.25 8.65031 14.61 8.00031 15.13C7.81031 15.27 7.63031 15.38 7.47031 16.5ZM12.0003 20C11.0603 20 10.1603 19.81 9.33031 19.46C9.53031 19.07 9.77031 18.71 10.0403 18.38C10.6903 17.73 11.4603 17.3 12.2903 17.09C12.5603 17.73 12.8603 18.36 13.1903 18.95C12.8003 19 12.4003 20 12.0003 20ZM15.5803 15.56C15.0003 15.15 14.3603 14.84 13.6903 14.66C13.4903 14.24 13.3303 13.79 13.2103 13.32H17.8903C17.7803 14.25 17.4603 15.12 17.0003 15.9C16.5703 15.78 16.0703 15.68 15.5803 15.56ZM13.0903 12.19C13.0903 11.92 13.1103 11.65 13.1503 11.39H17.9403C17.9803 11.59 18.0003 11.79 18.0003 12C18.0003 12.38 17.9703 12.74 17.9103 13.1H13.2003C13.1303 12.8 13.0903 12.5 13.0903 12.19Z" />
              </svg>
              Google
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}