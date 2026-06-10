// import { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router';

// import { Form } from '@/components/ui/form';
// import { Button } from '@/components/ui/button';
// import { ControlledFormField } from '@/components/controlled-form-field';

// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';

// import { Loader2, KeyRound, MailCheck } from 'lucide-react';
// import { toast } from 'sonner';

// const emailSchema = z.object({
//     email: z.string().email('Correo inválido'),
// });

// const resetSchema = z
//     .object({
//         code: z.string().min(6, 'Código requerido'),
//         password: z.string().min(6, 'Mínimo 6 caracteres'),
//         repassword: z.string(),
//     })
//     .refine((data) => data.password === data.repassword, {
//         message: 'Las contraseñas no coinciden',
//         path: ['repassword'],
//     });

// export function ForgotPasswordForm() {
//     const navigate = useNavigate();

//     const [emailSent, setEmailSent] = useState(false);
//     const [email, setEmail] = useState('');

//     const emailForm = useForm<z.infer<typeof emailSchema>>({
//         resolver: zodResolver(emailSchema),
//         defaultValues: {
//             email: '',
//         },
//     });

//     const resetForm = useForm<z.infer<typeof resetSchema>>({
//         resolver: zodResolver(resetSchema),
//         defaultValues: {
//             code: '',
//             password: '',
//             repassword: '',
//         },
//     });

//     async function onRequestCode(values: z.infer<typeof emailSchema>) {
//         try {
//             const requestReset = async () => {
//                 const res = await fetch(
//                     `${import.meta.env.VITE_XAPITY_API_URL}/auth/forgot-password`,
//                     {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             email: values.email,
//                         }),
//                     }
//                 );

//                 if (!res.ok) {
//                     throw new Error('No fue posible iniciar la recuperación');
//                 }

//                 return await res.json();
//             };

//             await toast.promise(requestReset, {
//                 loading: 'Enviando código...',
//                 success: () => {
//                     setEmail(values.email);
//                     setEmailSent(true);

//                     return {
//                         message: 'Código enviado',
//                         description:
//                             'Si el correo existe, recibirás un código de recuperación.',
//                     };
//                 },
//                 error: () => ({
//                     message: 'Error',
//                     description: 'No fue posible iniciar la recuperación',
//                 }),
//             });
//         } catch {
//             return null;
//         }
//     }

//     async function onResetPassword(values: z.infer<typeof resetSchema>) {
//         try {
//             const resetPassword = async () => {
//                 const res = await fetch(
//                     `${import.meta.env.VITE_XAPITY_API_URL}/auth/reset-password`,
//                     {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             email,
//                             code: values.code,
//                             password: values.password,
//                         }),
//                     }
//                 );

//                 if (!res.ok) {
//                     const errorData = await res.json().catch(() => null);

//                     throw new Error(
//                         errorData?.detail || 'Código inválido o expirado'
//                     );
//                 }

//                 return await res.json();
//             };

//             await toast.promise(resetPassword, {
//                 loading: 'Actualizando contraseña...',
//                 success: () => {
//                     navigate('/login');

//                     return {
//                         message: 'Contraseña actualizada',
//                         description:
//                             'Ya puedes iniciar sesión con tu nueva contraseña.',
//                     };
//                 },
//                 error: (error) => ({
//                     message: 'Error',
//                     description:
//                         error.message || 'No fue posible actualizar la contraseña',
//                 }),
//             });
//         } catch {
//             return null;
//         }
//     }

//     if (emailSent) {
//         return (
//             <div className="flex flex-col gap-7 px-4">
//                 <div className="flex flex-col items-center text-center">
//                     <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
//                         <MailCheck className="h-3.5 w-3.5" />
//                         Recuperación de contraseña
//                     </div>

//                     <h1 className="text-2xl font-bold">
//                         Ingresa tu código
//                     </h1>

//                     <p className="text-muted-foreground">
//                         Revisa tu correo:
//                         <br />
//                         <span className="font-medium text-foreground">
//                             {email}
//                         </span>
//                     </p>
//                 </div>

//                 <Form {...resetForm}>
//                     <form
//                         onSubmit={resetForm.handleSubmit(onResetPassword)}
//                         className="flex flex-col gap-5"
//                     >
//                         <div className="flex flex-col gap-2">
//                             <label className="text-sm font-medium">Código</label>

//                             <input
//                                 {...resetForm.register('code')}
//                                 autoComplete="one-time-code"
//                                 inputMode="numeric"
//                                 placeholder="123456"
//                                 className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
//                             />

//                             {resetForm.formState.errors.code && (
//                                 <p className="text-sm text-destructive">
//                                     {resetForm.formState.errors.code.message}
//                                 </p>
//                             )}
//                         </div>

//                         <ControlledFormField
//                             name="password"
//                             label="Nueva contraseña"
//                             placeholder="Nueva contraseña"
//                             type="password"
//                         />

//                         <ControlledFormField
//                             name="repassword"
//                             label="Repetir contraseña"
//                             placeholder="Repite tu contraseña"
//                             type="password"
//                         />

//                         <Button
//                             type="submit"
//                             className="w-full"
//                             disabled={resetForm.formState.isSubmitting}
//                         >
//                             {resetForm.formState.isSubmitting && (
//                                 <Loader2 className="animate-spin" />
//                             )}
//                             Actualizar contraseña
//                         </Button>
//                     </form>
//                 </Form>

//                 <Button
//                     variant="outline"
//                     type="button"
//                     onClick={() => {
//                         setEmailSent(false);
//                         resetForm.reset();
//                     }}
//                 >
//                     Volver
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col gap-7 px-4">
//             <div className="flex flex-col items-center text-center">
//                 <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
//                     <KeyRound className="h-3.5 w-3.5" />
//                     Recuperación de acceso
//                 </div>

//                 <h1 className="text-2xl font-bold">
//                     Recuperar contraseña
//                 </h1>

//                 <p className="text-muted-foreground">
//                     Ingresa tu correo y te enviaremos un código.
//                 </p>
//             </div>

//             <Form {...emailForm}>
//                 <form
//                     onSubmit={emailForm.handleSubmit(onRequestCode)}
//                     className="flex flex-col gap-5"
//                 >
//                     <ControlledFormField
//                         name="email"
//                         label="Correo"
//                         placeholder="correo@empresa.cl"
//                         type="email"
//                     />

//                     <Button
//                         type="submit"
//                         className="w-full"
//                         disabled={emailForm.formState.isSubmitting}
//                     >
//                         {emailForm.formState.isSubmitting && (
//                             <Loader2 className="animate-spin" />
//                         )}
//                         Enviar código
//                     </Button>
//                 </form>
//             </Form>

//             <div className="text-center text-sm">
//                 ¿Recordaste tu contraseña?{' '}
//                 <NavLink
//                     to="/login"
//                     className="underline underline-offset-4"
//                 >
//                     Iniciar sesión
//                 </NavLink>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ControlledFormField } from '@/components/controlled-form-field';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Loader2, KeyRound, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

const emailSchema = z.object({
    email: z.string().email('Correo inválido'),
});

const resetSchema = z
    .object({
        code: z.string().min(6, 'Código requerido'),
        password: z.string().min(6, 'Mínimo 6 caracteres'),
        repassword: z.string(),
    })
    .refine((data) => data.password === data.repassword, {
        message: 'Las contraseñas no coinciden',
        path: ['repassword'],
    });

export function ForgotPasswordForm() {
    const navigate = useNavigate();

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
        },
    });

    const resetForm = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            code: '',
            password: '',
            repassword: '',
        },
    });

    async function onRequestCode(values: z.infer<typeof emailSchema>) {
        try {
            const requestReset = async () => {
                const res = await fetch(
                    `${import.meta.env.VITE_XAPITY_API_URL}/auth/forgot-password`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: values.email,
                        }),
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);

                    const detail =
                        typeof errorData?.detail === 'string'
                            ? errorData.detail
                            : 'No fue posible iniciar la recuperación';

                    throw new Error(detail);
                }

                return await res.json();
            };

            await toast.promise(requestReset, {
                loading: 'Enviando código...',
                success: () => {
                    setEmail(values.email);
                    setEmailSent(true);

                    return {
                        message: 'Código enviado',
                        description:
                            'Si el correo existe, recibirás un código de recuperación.',
                    };
                },
                error: (error) => ({
                    message: 'Error',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'No fue posible iniciar la recuperación',
                }),
            });
        } catch {
            return null;
        }
    }

    async function onResetPassword(values: z.infer<typeof resetSchema>) {
        try {
            const resetPassword = async () => {
                const res = await fetch(
                    `${import.meta.env.VITE_XAPITY_API_URL}/auth/reset-password`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            code: values.code,
                            newPassword: values.password,
                        }),
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);

                    const detail =
                        typeof errorData?.detail === 'string'
                            ? errorData.detail
                            : 'Código inválido o expirado';

                    throw new Error(detail);
                }

                return await res.json();
            };

            await toast.promise(resetPassword, {
                loading: 'Actualizando contraseña...',
                success: () => {
                    navigate('/login');

                    return {
                        message: 'Contraseña actualizada',
                        description:
                            'Ya puedes iniciar sesión con tu nueva contraseña.',
                    };
                },
                error: (error) => ({
                    message: 'Error',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'No fue posible actualizar la contraseña',
                }),
            });
        } catch {
            return null;
        }
    }

    if (emailSent) {
        return (
            <div className="flex flex-col gap-7 px-4">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                        <MailCheck className="h-3.5 w-3.5" />
                        Recuperación de contraseña
                    </div>

                    <h1 className="text-2xl font-bold">Ingresa tu código</h1>

                    <p className="text-muted-foreground">
                        Revisa tu correo:
                        <br />
                        <span className="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                <Form {...resetForm}>
                    <form
                        onSubmit={resetForm.handleSubmit(onResetPassword)}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Código</label>

                            <input
                                {...resetForm.register('code')}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                placeholder="123456"
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />

                            {resetForm.formState.errors.code && (
                                <p className="text-sm text-destructive">
                                    {resetForm.formState.errors.code.message}
                                </p>
                            )}
                        </div>

                        <ControlledFormField
                            name="password"
                            label="Nueva contraseña"
                            placeholder="Nueva contraseña"
                            type="password"
                        />

                        <ControlledFormField
                            name="repassword"
                            label="Repetir contraseña"
                            placeholder="Repite tu contraseña"
                            type="password"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={resetForm.formState.isSubmitting}
                        >
                            {resetForm.formState.isSubmitting && (
                                <Loader2 className="animate-spin" />
                            )}
                            Actualizar contraseña
                        </Button>
                    </form>
                </Form>

                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                        setEmailSent(false);
                        resetForm.reset();
                    }}
                >
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-7 px-4">
            <div className="flex flex-col items-center text-center">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <KeyRound className="h-3.5 w-3.5" />
                    Recuperación de acceso
                </div>

                <h1 className="text-2xl font-bold">Recuperar contraseña</h1>

                <p className="text-muted-foreground">
                    Ingresa tu correo y te enviaremos un código.
                </p>
            </div>

            <Form {...emailForm}>
                <form
                    onSubmit={emailForm.handleSubmit(onRequestCode)}
                    className="flex flex-col gap-5"
                >
                    <ControlledFormField
                        name="email"
                        label="Correo"
                        placeholder="correo@empresa.cl"
                        type="email"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={emailForm.formState.isSubmitting}
                    >
                        {emailForm.formState.isSubmitting && (
                            <Loader2 className="animate-spin" />
                        )}
                        Enviar código
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm">
                ¿Recordaste tu contraseña?{' '}
                <NavLink to="/login" className="underline underline-offset-4">
                    Iniciar sesión
                </NavLink>
            </div>
        </div>
    );
}