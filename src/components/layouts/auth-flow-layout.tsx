import peopleImage from '@/assets/images/company_04.png';
import businessImage from '@/assets/images/company_06.png';
import { AppLogo } from '../app-logo';
import { Outlet } from 'react-router';

export function AuthFlowLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <AppLogo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={
            ['/auth-flow/signup-continue'].includes(window.location.pathname) ?
              businessImage
              : peopleImage
          }
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
