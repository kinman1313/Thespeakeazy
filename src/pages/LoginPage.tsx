// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 px-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

// src/pages/SignupPage.tsx
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 px-4">
      <SignupForm />
    </div>
  );
};

export default SignupPage;