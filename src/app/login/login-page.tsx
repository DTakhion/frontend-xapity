import { LoginForm } from '@/app/login/components/login-form';
import { AppLogo } from '@/components/app-logo';

export const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="flex items-center gap-2 font-medium absolute top-5 left-5 md:top-6 md:left-6">
        <AppLogo />
      </div>
      <LoginForm />
    </div>
  );
};
