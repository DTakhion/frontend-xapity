import { useNavigate, useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { applyActionCode, Auth } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '@/config/firebase.config';
import { Loader } from 'lucide-react';

export function SignupLoading() {
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();

  const handleEmailVerification = (auth: Auth, oobCode: string) => {
    applyActionCode(auth, oobCode)
      .then(() => {
        toast.success('Correo exitosamente verificado');
        navigate('/auth-flow/signup-continue', { replace: true });
      })
      .catch((_error) => {
        // setError(error.code);
        toast.error('No se pudo verificar el correo', {
          onAutoClose: () => {
            // if (!currentUser?.emailVerified) {
            // }
            toast.info('Intenta reenviar el correo nuevamente');
            navigate('/auth-flow/signup-resend-email-verification', { replace: true });
          }
        });
      });
  };

  // handles email verification and password reset
  useEffect(() => {
    const oobCode = urlParams.get('oobCode') ?? '';
    const mode = urlParams.get('mode') ?? '';
    if (!oobCode && !mode) {
      // if user is authenticated, redirect to home
      navigate('/auth-flow/signup', { replace: true });
      return;
    }
    if (mode === 'resetPassword' && oobCode) {
      navigate(`/auth-flow/password-reset?mode=${mode}&oobCode=${oobCode}`, { replace: true });
      return;
    }
    if (mode === 'verifyEmail' && oobCode) {
      handleEmailVerification(auth, oobCode);
      return;
    }
  }, []);

  return (
    <div className="flex flex-col space-y-3">
      <Loader size={34} className="mx-auto animate-spin" />
    </div>
  );
};
