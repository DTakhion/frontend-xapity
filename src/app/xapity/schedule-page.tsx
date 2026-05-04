import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API_URL = import.meta.env.VITE_XAPITY_API_URL

interface Appointment {
  appointmentId: string
  businessId: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName?: string | null
  customerName: string
  customerPhone?: string | null
  customerEmail?: string | null
  date: string
  start: string
  end: string
  status: string
  notes?: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getCalendarDays(currentMonth: Date) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const firstDayIndex = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const days: Date[] = []

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i))
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1]
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
  }

  return days
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/appointments`)
      const data = await res.json()

      setAppointments(data.items || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  )

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>((acc, appt) => {
      if (appt.isDeleted) return acc

      if (!acc[appt.date]) {
        acc[appt.date] = []
      }

      acc[appt.date].push(appt)
      acc[appt.date].sort((a, b) => a.start.localeCompare(b.start))

      return acc
    }, {})
  }, [appointments])

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const todayKey = formatDateKey(new Date())

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Visualiza las reservas programadas por día, servicio, cliente y staff.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAppointments} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>

          <Button variant="outline" onClick={goToToday}>
            Hoy
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
            </div>

            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 border rounded-xl overflow-hidden">
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-muted/50 p-3 text-center text-sm font-medium border-b"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const dateKey = formatDateKey(day)
              const dayAppointments = appointmentsByDate[dateKey] || []
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isToday = dateKey === todayKey

              return (
                <div
                  key={dateKey}
                  className={`min-h-36 border-r border-b p-2 space-y-2 ${
                    !isCurrentMonth ? "bg-muted/20 text-muted-foreground" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        isToday
                          ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
                          : ""
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {dayAppointments.length > 0 && (
                      <Badge variant="secondary">
                        {dayAppointments.length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.map((appt) => (
                      <div
                        key={appt.appointmentId}
                        className="rounded-lg border bg-background p-2 text-xs space-y-1 shadow-sm"
                      >
                        <div className="font-semibold">
                          {appt.start} - {appt.end}
                        </div>

                        <div className="truncate">
                          {appt.serviceName}
                        </div>

                        <div className="text-muted-foreground truncate">
                          Cliente: {appt.customerName}
                        </div>

                        <div className="text-muted-foreground truncate">
                          Staff: {appt.staffName || "Sin asignar"}
                        </div>

                        <Badge
                          variant={appt.status === "scheduled" ? "secondary" : "outline"}
                        >
                          {appt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}