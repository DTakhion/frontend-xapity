import { useEffect, useState } from "react"
import { Plus, Pencil, Trash, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_URL = import.meta.env.VITE_XAPITY_API_URL

interface WorkingHourBlock {
    start: string
    end: string
}

interface WorkingDay {
    isWorking: boolean
    blocks: WorkingHourBlock[]
}

interface WorkingHours {
    monday?: WorkingDay
    tuesday?: WorkingDay
    wednesday?: WorkingDay
    thursday?: WorkingDay
    friday?: WorkingDay
    saturday?: WorkingDay
    sunday?: WorkingDay
}

interface Staff {
    id: string
    name: string
    role: string
    email?: string | null
    phone?: string | null
    specialties?: string[]
    serviceIds?: string[]
    notes?: string | null
    workingHours?: WorkingHours
    isActive?: boolean
    isDeleted?: boolean
}

interface ServiceOption {
    id: string
    name: string
}

// ============================================================
// Días de la semana soportados por el formulario.
// Importante:
// - Las keys deben coincidir con las esperadas por el backend.
// - Usamos nombres en inglés para mantener consistencia con schemas/staff.py.
// ============================================================
const weekDays = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
] as const

type WeekDayKey = (typeof weekDays)[number]["key"]

// ============================================================
// Disponibilidad por defecto para creación de staff.
// Observación:
// - Lunes a viernes activos.
// - Sábado y domingo desactivados, pero con horas base listas.
// - Si un día está desactivado, se enviará con blocks: [].
// ============================================================
const defaultWorkingHoursForm: Record<
    WeekDayKey,
    { isWorking: boolean; start: string; end: string }
> = {
    monday: { isWorking: true, start: "09:00", end: "18:00" },
    tuesday: { isWorking: true, start: "09:00", end: "18:00" },
    wednesday: { isWorking: true, start: "09:00", end: "18:00" },
    thursday: { isWorking: true, start: "09:00", end: "18:00" },
    friday: { isWorking: true, start: "09:00", end: "18:00" },
    saturday: { isWorking: false, start: "09:00", end: "14:00" },
    sunday: { isWorking: false, start: "09:00", end: "14:00" },
}

const emptyForm = {
    name: "",
    role: "",
    email: "",
    phone: "",
    specialties: "",
    serviceIds: [] as string[],
    notes: "",
    workingHours: defaultWorkingHoursForm,
}

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([])
    const [services, setServices] = useState<ServiceOption[]>([])
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [formData, setFormData] = useState(emptyForm)

    useEffect(() => {
        fetchStaff()
        fetchServices()
    }, [])

    const fetchStaff = async () => {
        try {
            const res = await fetch(`${API_URL}/staff`)
            const data = await res.json()

            setStaff(
                data.items.map((s: any) => ({
                    id: s.staffId,
                    name: s.name,
                    role: s.role,
                    email: s.email,
                    phone: s.phone,
                    specialties: s.specialties || [],
                    serviceIds: s.serviceIds || [],
                    notes: s.notes,
                    workingHours: s.workingHours || {},
                    isActive: s.isActive,
                    isDeleted: s.isDeleted,
                }))
            )
        } catch (error) {
            console.error("Error fetching staff:", error)
        }
    }

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/services`)
            const data = await res.json()

            setServices(
                data.items.map((s: any) => ({
                    id: s.serviceId,
                    name: s.name,
                }))
            )
        } catch (error) {
            console.error("Error fetching services:", error)
        }
    }

    const splitCommaValues = (value: string) =>
        value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)

    const getServiceNameById = (serviceId: string) => {
        return services.find((service) => service.id === serviceId)?.name || serviceId
    }

    const handleAddService = (serviceId: string) => {
        if (!serviceId) return
        if (formData.serviceIds.includes(serviceId)) return

        setFormData({
            ...formData,
            serviceIds: [...formData.serviceIds, serviceId],
        })
    }

    const handleRemoveService = (serviceId: string) => {
        setFormData({
            ...formData,
            serviceIds: formData.serviceIds.filter((id) => id !== serviceId),
        })
    }

    // ============================================================
    // Actualiza un día específico de la disponibilidad semanal.
    // Esto permite activar/desactivar días y modificar sus horas.
    // ============================================================
    const updateWorkingDay = (
        day: WeekDayKey,
        field: "isWorking" | "start" | "end",
        value: boolean | string
    ) => {
        setFormData({
            ...formData,
            workingHours: {
                ...formData.workingHours,
                [day]: {
                    ...formData.workingHours[day],
                    [field]: value,
                },
            },
        })
    }

    const handleCreate = async () => {
        if (!formData.name || !formData.role) return

        const payload = {
            name: formData.name,
            role: formData.role,
            email: formData.email || null,
            phone: formData.phone || null,
            specialties: splitCommaValues(formData.specialties),
            serviceIds: formData.serviceIds,
            notes: formData.notes || null,

            // =====================================================
            // Payload compatible con backend:
            // workingHours: {
            //   monday: {
            //     isWorking: true,
            //     blocks: [{ start: "09:00", end: "18:00" }]
            //   },
            //   saturday: {
            //     isWorking: false,
            //     blocks: []
            //   }
            // }
            // =====================================================
            workingHours: Object.fromEntries(
                weekDays.map(({ key }) => {
                    const day = formData.workingHours[key]

                    return [
                        key,
                        {
                            isWorking: day.isWorking,
                            blocks: day.isWorking
                                ? [
                                    {
                                        start: day.start,
                                        end: day.end,
                                    },
                                ]
                                : [],
                        },
                    ]
                })
            ),
        }

        try {
            const res = await fetch(`${API_URL}/staff`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const errorData = await res.json()
                console.error("Error creating staff:", errorData)
                return
            }

            await fetchStaff()
            setFormData(emptyForm)
            setShowCreateDialog(false)
        } catch (error) {
            console.error("Error creating staff:", error)
        }
    }

    const handleDelete = async (staffId: string) => {
        const confirmed = window.confirm(
            "¿Seguro que deseas eliminar este miembro del staff?"
        )

        if (!confirmed) return

        try {
            const res = await fetch(`${API_URL}/staff/${staffId}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const errorData = await res.json()
                console.error("Error deleting staff:", errorData)
                return
            }

            await fetchStaff()
        } catch (error) {
            console.error("Error deleting staff:", error)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Staff</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestiona el equipo disponible para atender servicios y futuras reservas
                    </p>
                </div>

                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Staff
                </Button>
            </div>

            {staff.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">
                            No hay miembros del staff creados
                        </p>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear primer staff
                        </Button>
                    </CardContent>
                </Card>
            )}

            {staff.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Staff</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Especialidades</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {staff.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{s.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {s.notes || "Sin notas registradas"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="secondary">{s.role}</Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{s.email || "Sin email"}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {s.phone || "Sin teléfono"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {s.specialties && s.specialties.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {s.specialties.map((specialty) => (
                                                        <Badge key={specialty} variant="outline">
                                                            {specialty}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    Sin especialidades
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {s.isActive ? (
                                                <Badge className="bg-green-500">Activo</Badge>
                                            ) : (
                                                <Badge variant="outline">Inactivo</Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Button size="icon" variant="outline" disabled>
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Crear Staff</DialogTitle>
                        <DialogDescription>
                            Registra un nuevo integrante del equipo para asociarlo luego a servicios y disponibilidad.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="rounded-xl border p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold">Información principal</h3>
                                <p className="text-sm text-muted-foreground">
                                    Datos básicos del integrante del equipo.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nombre</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>

                                <div>
                                    <Label>Rol</Label>
                                    <Input
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                        placeholder="Ej: Barbero, Terapeuta, Profesional"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold">Contacto</h3>
                                <p className="text-sm text-muted-foreground">
                                    Información opcional para comunicación interna o futura agenda.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        placeholder="Ej: juan@correo.cl"
                                    />
                                </div>

                                <div>
                                    <Label>Teléfono</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        placeholder="Ej: +56912345678"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold">Especialidades y servicios</h3>
                                <p className="text-sm text-muted-foreground">
                                    Escribe especialidades separadas por coma y selecciona los servicios asociados.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Especialidades</Label>
                                    <Input
                                        value={formData.specialties}
                                        onChange={(e) =>
                                            setFormData({ ...formData, specialties: e.target.value })
                                        }
                                        placeholder="Corte, barba, coloración"
                                    />
                                </div>

                                <div>
                                    <Label>Servicios asociados</Label>

                                    <select
                                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value=""
                                        onChange={(e) => handleAddService(e.target.value)}
                                    >
                                        <option value="">Selecciona un servicio</option>

                                        {services.map((service) => (
                                            <option
                                                key={service.id}
                                                value={service.id}
                                                disabled={formData.serviceIds.includes(service.id)}
                                            >
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>

                                    {formData.serviceIds.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {formData.serviceIds.map((serviceId) => (
                                                <Badge
                                                    key={serviceId}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {getServiceNameById(serviceId)}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveService(serviceId)}
                                                        className="ml-1 rounded-full hover:opacity-70"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {services.length === 0 && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            No hay servicios disponibles todavía.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold">Disponibilidad semanal</h3>
                                <p className="text-sm text-muted-foreground">
                                    Define los días y horarios en que este integrante estará disponible para futuras reservas.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {weekDays.map(({ key, label }) => {
                                    const day = formData.workingHours[key]

                                    return (
                                        <div
                                            key={key}
                                            className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-4 items-end rounded-lg border p-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={day.isWorking}
                                                    onChange={(e) =>
                                                        updateWorkingDay(
                                                            key,
                                                            "isWorking",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <Label>{label}</Label>
                                            </div>

                                            <div>
                                                <Label>Inicio</Label>
                                                <Input
                                                    type="time"
                                                    value={day.start}
                                                    disabled={!day.isWorking}
                                                    onChange={(e) =>
                                                        updateWorkingDay(key, "start", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <Label>Fin</Label>
                                                <Input
                                                    type="time"
                                                    value={day.end}
                                                    disabled={!day.isWorking}
                                                    onChange={(e) =>
                                                        updateWorkingDay(key, "end", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold">Notas internas</h3>
                                <p className="text-sm text-muted-foreground">
                                    Comentarios visibles para administración.
                                </p>
                            </div>

                            <Input
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                }
                                placeholder="Ej: Atiende clientes preferentes"
                            />
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreate}>Crear Staff</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}