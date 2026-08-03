import { useEffect, useState } from 'react';
import {
    BadgeCheck,
    Building2,
    Loader2,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from 'lucide-react';

type AccountUser = {
    userId: string;
    businessId: string;
    name: string;
    email: string;
    phone?: string | null;
    organizationName: string;
    role: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

type MeResponse = {
    user: AccountUser;
};

type SubscriptionUsage = {
    businessId: string;
    planCode: string;
    status: string;
    quota: {
        limit: number;
        used: number;
        reserved: number;
        remaining: number;
    };
    periodType: string;
    periodStart: string;
    periodEnd: string | null;
};

const API_URL =
    import.meta.env.VITE_XAPITY_API_URL ?? 'http://127.0.0.1:8000';

function getAccessToken() {
    return (
        localStorage.getItem('accessToken') ??
        localStorage.getItem('token') ??
        localStorage.getItem('xapity_access_token') ??
        ''
    );
}

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    staff: 'Colaborador',
    customer: 'Cliente',
    user: 'Usuario',
};

const planLabels: Record<string, string> = {
    trial: 'Prueba',
};

const subscriptionStatusLabels: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    suspended: 'Suspendido',
    expired: 'Expirado',
};

const periodTypeLabels: Record<string, string> = {
    lifetime_trial: 'Periodo de prueba',
    monthly: 'Mensual',
    annual: 'Anual',
};

export default function AccountPage() {
    const [accountUser, setAccountUser] = useState<AccountUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [subscription, setSubscription] =
        useState<SubscriptionUsage | null>(null);

    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [subscriptionError, setSubscriptionError] = useState('');

    useEffect(() => {
        const loadAccount = async () => {
            const token = getAccessToken();

            if (!token) {
                setError('No se encontró una sesión activa. Inicia sesión nuevamente.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    throw new Error('unauthorized');
                }

                if (response.status === 403) {
                    throw new Error('forbidden');
                }

                if (!response.ok) {
                    throw new Error('server_error');
                }

                const data: MeResponse = await response.json();

                setAccountUser(data.user);
            } catch (err) {
                if (err instanceof Error && err.message === 'unauthorized') {
                    setError('Tu sesión expiró o no es válida. Inicia sesión nuevamente.');
                } else if (err instanceof Error && err.message === 'forbidden') {
                    setError('Tu usuario no está autorizado para consultar esta cuenta.');
                } else {
                    setError(
                        'No fue posible obtener la información de tu cuenta. Inténtalo nuevamente.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadAccount();
    }, []);

    useEffect(() => {
        const loadSubscriptionUsage = async () => {
            const token = getAccessToken();

            if (!token) {
                setSubscriptionError(
                    'No se encontró una sesión activa. Inicia sesión nuevamente.'
                );
                setSubscriptionLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/subscriptions/usage`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    throw new Error('unauthorized');
                }

                if (response.status === 403) {
                    throw new Error('forbidden');
                }

                if (!response.ok) {
                    throw new Error('server_error');
                }

                const data: SubscriptionUsage = await response.json();

                setSubscription(data);
            } catch (err) {
                if (err instanceof Error && err.message === 'unauthorized') {
                    setSubscriptionError(
                        'Tu sesión expiró o no es válida. Inicia sesión nuevamente.'
                    );
                } else if (err instanceof Error && err.message === 'forbidden') {
                    setSubscriptionError(
                        'Tu usuario no está autorizado para consultar el uso del servicio.'
                    );
                } else {
                    setSubscriptionError(
                        'No fue posible obtener la información de uso de Xapity.'
                    );
                }
            } finally {
                setSubscriptionLoading(false);
            }
        };

        loadSubscriptionUsage();
    }, []);

    const usagePercentage =
        subscription && subscription.quota.limit > 0
            ? Math.min(
                (subscription.quota.used / subscription.quota.limit) * 100,
                100
            )
            : 0;

    const periodStart = subscription
        ? new Date(subscription.periodStart).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '';

    return (
        <div className="min-h-[calc(100vh-2rem)] bg-slate-50 px-4 py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <section className="rounded-3xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                            <BadgeCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                                Mi cuenta
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Consulta la información de tu cuenta y el uso de Xapity.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-950">
                            Información personal
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Datos asociados a tu cuenta de Xapity.
                        </p>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cargando información de la cuenta...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && accountUser && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <User className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Nombre
                                    </div>
                                    <div className="mt-1 font-medium text-slate-950">
                                        {accountUser.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <Mail className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div className="min-w-0">
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Correo
                                    </div>
                                    <div className="mt-1 truncate font-medium text-slate-950">
                                        {accountUser.email}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <Phone className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Teléfono
                                    </div>
                                    <div className="mt-1 font-medium text-slate-950">
                                        {accountUser.phone || 'No registrado'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <Building2 className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Organización
                                    </div>
                                    <div className="mt-1 font-medium text-slate-950">
                                        {accountUser.organizationName}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Rol
                                    </div>
                                    <div className="mt-1 font-medium text-slate-950">
                                        {roleLabels[accountUser.role] || accountUser.role}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                                <BadgeCheck className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Estado
                                    </div>

                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${accountUser.isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-600'
                                                }`}
                                        >
                                            {accountUser.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-950">
                            Uso de Xapity
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Información del plan y consumo disponible para tu organización.
                        </p>
                    </div>

                    {subscriptionLoading && (
                        <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cargando información de uso...
                        </div>
                    )}

                    {!subscriptionLoading && subscriptionError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {subscriptionError}
                        </div>
                    )}

                    {!subscriptionLoading && !subscriptionError && subscription && (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Plan
                                    </div>

                                    <div className="mt-2 text-lg font-semibold text-slate-950">
                                        {planLabels[subscription.planCode] || subscription.planCode}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Estado
                                    </div>

                                    <div className="mt-2">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${subscription.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-600'
                                                }`}
                                        >
                                            {subscriptionStatusLabels[subscription.status] ||
                                                subscription.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Tipo de plan
                                    </div>

                                    <div className="mt-2 text-lg font-semibold text-slate-950">
                                        {periodTypeLabels[subscription.periodType] ||
                                            subscription.periodType}
                                    </div>

                                    <div className="mt-2 text-sm text-slate-500">
                                        Vigente desde el {periodStart}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-slate-50 p-5">
                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                                    <div>
                                        <div className="text-sm font-medium text-slate-500">
                                            Consultas utilizadas
                                        </div>

                                        <div className="mt-1 text-3xl font-bold text-slate-950">
                                            {subscription.quota.used}
                                            <span className="text-lg font-medium text-slate-400">
                                                {' '}
                                                / {subscription.quota.limit}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm font-medium text-slate-600">
                                        {subscription.quota.remaining} consultas disponibles
                                    </div>
                                </div>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-slate-950 transition-all duration-500"
                                        style={{ width: `${usagePercentage}%` }}
                                    />
                                </div>

                                <div className="mt-2 flex justify-between text-xs text-slate-500">
                                    <span>{Math.round(usagePercentage)}% utilizado</span>

                                    {subscription.quota.reserved > 0 && (
                                        <span>
                                            {subscription.quota.reserved} reservadas
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}