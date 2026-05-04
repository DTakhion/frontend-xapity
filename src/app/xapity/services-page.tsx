import { useEffect, useState } from "react"
import { Plus, Pencil, Trash } from "lucide-react"

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

interface Service {
  id: string
  name: string
  description: string
  category?: string
  durationMinutes?: number
  basePrice?: number
  beforeCareInstructions?: string | null
  afterCareInstructions?: string | null
  isBookableOnline?: boolean
  includes?: string[]
  products?: string[]
}

const emptyForm = {
  name: "",
  description: "",
  category: "",
  durationMinutes: 60,
  basePrice: 0,
  beforeCareInstructions: "",
  afterCareInstructions: "",
  isBookableOnline: true,
  includes: "",
  products: "",
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [formData, setFormData] = useState(emptyForm)
  const [editFormData, setEditFormData] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services`)
      const data = await res.json()

      setServices(
        data.items.map((s: any) => ({
          id: s.serviceId,
          name: s.name,
          description: s.description,
          category: s.category,
          durationMinutes: s.durationMinutes,
          basePrice: s.basePrice,
          beforeCareInstructions: s.beforeCareInstructions,
          afterCareInstructions: s.afterCareInstructions,
          isBookableOnline: s.isBookableOnline,
          includes: s.includes || [],
          products: s.products || [],
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

  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.category) return

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      durationMinutes: Number(formData.durationMinutes),
      basePrice: Number(formData.basePrice),
      beforeCareInstructions: formData.beforeCareInstructions || null,
      afterCareInstructions: formData.afterCareInstructions || null,
      isBookableOnline: formData.isBookableOnline,
      includes: splitCommaValues(formData.includes),
      products: splitCommaValues(formData.products),
    }

    try {
      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Error creating service:", errorData)
        return
      }

      await fetchServices()
      setFormData(emptyForm)
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating service:", error)
    }
  }

  const handleUpdate = async () => {
    if (!editFormData) return

    try {
      const res = await fetch(`${API_URL}/services/${editFormData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          category: editFormData.category,
          durationMinutes: Number(editFormData.durationMinutes || 60),
          basePrice: Number(editFormData.basePrice || 0),
          beforeCareInstructions: editFormData.beforeCareInstructions || null,
          afterCareInstructions: editFormData.afterCareInstructions || null,
          isBookableOnline: editFormData.isBookableOnline ?? true,
          includes: editFormData.includes || [],
          products: editFormData.products || [],
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Error updating service:", errorData)
        return
      }

      await fetchServices()
      setShowEditDialog(false)
      setEditFormData(null)
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este servicio?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        console.error("Error deleting service")
        return
      }

      setServices((prev) => prev.filter((service) => service.id !== id))
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los servicios disponibles en tu negocio
          </p>
        </div>

        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Servicio
        </Button>
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay servicios creados
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear primer servicio
            </Button>
          </CardContent>
        </Card>
      )}

      {services.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {s.description}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {s.category || "Sin categoría"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {s.durationMinutes ? `${s.durationMinutes} min` : "-"}
                    </TableCell>

                    <TableCell>
                      {s.basePrice ? `$${s.basePrice.toLocaleString()}` : "Gratis"}
                    </TableCell>

                    <TableCell>
                      {s.isBookableOnline ? (
                        <Badge className="bg-green-500">Online</Badge>
                      ) : (
                        <Badge variant="outline">Offline</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditFormData(s)
                          setShowEditDialog(true)
                        }}
                      >
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
            <DialogTitle>Crear Servicio</DialogTitle>
            <DialogDescription>
              Configura la información comercial, operativa y de agendamiento del servicio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-xl border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Información principal</h3>
                <p className="text-sm text-muted-foreground">
                  Datos visibles para el equipo y futuros clientes.
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
                    placeholder="Ej: Examen morfofisiopatológico"
                  />
                </div>

                <div>
                  <Label>Categoría</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Ej: Tecnología médica"
                  />
                </div>
              </div>

              <div>
                <Label>Descripción</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe brevemente el servicio"
                />
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Agenda y precio</h3>
                <p className="text-sm text-muted-foreground">
                  Define duración, precio base y disponibilidad online.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Duración (min)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Precio base</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant={formData.isBookableOnline ? "default" : "outline"}
                    className="w-full"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isBookableOnline: !formData.isBookableOnline,
                      })
                    }
                  >
                    {formData.isBookableOnline
                      ? "Disponible online"
                      : "No disponible online"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Indicaciones</h3>
                <p className="text-sm text-muted-foreground">
                  Instrucciones antes y después del servicio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Antes del servicio</Label>
                  <Input
                    value={formData.beforeCareInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        beforeCareInstructions: e.target.value,
                      })
                    }
                    placeholder="Ej: Ayuno de 6 horas"
                  />
                </div>

                <div>
                  <Label>Después del servicio</Label>
                  <Input
                    value={formData.afterCareInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        afterCareInstructions: e.target.value,
                      })
                    }
                    placeholder="Ej: Mantener hidratación"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Incluye y productos</h3>
                <p className="text-sm text-muted-foreground">
                  Escribe valores separados por coma. Ej: Informe, toma de muestra.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Incluye</Label>
                  <Input
                    value={formData.includes}
                    onChange={(e) =>
                      setFormData({ ...formData, includes: e.target.value })
                    }
                    placeholder="Informe, evaluación, seguimiento"
                  />
                </div>

                <div>
                  <Label>Productos asociados</Label>
                  <Input
                    value={formData.products}
                    onChange={(e) =>
                      setFormData({ ...formData, products: e.target.value })
                    }
                    placeholder="Kit muestra, reactivos, insumos"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Crear Servicio</Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>


      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Actualiza la información comercial, operativa y de agendamiento del servicio.
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <div className="space-y-6">
              <div className="rounded-xl border p-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Información principal</h3>
                  <p className="text-sm text-muted-foreground">
                    Datos visibles para el equipo y futuros clientes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Categoría</Label>
                    <Input
                      value={editFormData.category || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Input
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="rounded-xl border p-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Agenda y precio</h3>
                  <p className="text-sm text-muted-foreground">
                    Define duración, precio base y disponibilidad online.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Duración (min)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={editFormData.durationMinutes || 60}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          durationMinutes: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Precio base</Label>
                    <Input
                      type="number"
                      min={0}
                      value={editFormData.basePrice || 0}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          basePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant={editFormData.isBookableOnline ? "default" : "outline"}
                      className="w-full"
                      onClick={() =>
                        setEditFormData({
                          ...editFormData,
                          isBookableOnline: !editFormData.isBookableOnline,
                        })
                      }
                    >
                      {editFormData.isBookableOnline
                        ? "Disponible online"
                        : "No disponible online"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Indicaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Instrucciones antes y después del servicio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Antes del servicio</Label>
                    <Input
                      value={editFormData.beforeCareInstructions || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          beforeCareInstructions: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Después del servicio</Label>
                    <Input
                      value={editFormData.afterCareInstructions || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          afterCareInstructions: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Incluye y productos</h3>
                  <p className="text-sm text-muted-foreground">
                    Escribe valores separados por coma.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Incluye</Label>
                    <Input
                      value={(editFormData.includes || []).join(", ")}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          includes: splitCommaValues(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Productos asociados</Label>
                    <Input
                      value={(editFormData.products || []).join(", ")}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          products: splitCommaValues(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}