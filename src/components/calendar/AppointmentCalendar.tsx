// components/AppointmentCalendar.tsx
import React, { useContext, useState } from "react";
import { CitaContext, Cita } from "@/contexts/CitasContext";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  Event,
} from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentForm from "./AppointmentForm";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AppointmentCalendar: React.FC = () => {
  const { citas, agregarCita, actualizarCita, eliminarCita } =
    useContext(CitaContext);
  const [selectedAppointment, setSelectedAppointment] = useState<Cita | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    setSelectedAppointment({
      id: "",
      title: "",
      start,
      end,
      estado: "Pendiente",
    });
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedAppointment(event as Cita);
    setIsDialogOpen(true);
  };

  const handleSaveAppointment = (appointment: any) => {
    if (appointment.id) {
      actualizarCita(appointment);
    } else {
      const newAppointment: Cita = {
        ...appointment,
        id: Date.now().toString(),
      };
      agregarCita(newAppointment);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    eliminarCita(id);
    setIsDialogOpen(false);
  };

  const moveAppointment = ({
    event,
    start,
    end,
  }: any) => {
    const updatedAppointment: Cita = { ...(event as Cita), start, end };
    actualizarCita(updatedAppointment);
  };

  const resizeAppointment = ({
    event,
    start,
    end,
  }: any
  ) => {
    const updatedAppointment: Cita = { ...(event as Cita), start, end };
    actualizarCita(updatedAppointment);
  };

  return (
    <div className="h-[85svh] relative">
      <DragAndDropCalendar
        localizer={localizer}
        events={citas}
        onEventDrop={moveAppointment}
        onEventResize={resizeAppointment}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        resizable
        className="h-full"
      />
      {selectedAppointment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment.id ? "Editar Cita" : "Crear Cita"}
              </DialogTitle>
            </DialogHeader>
            <AppointmentForm
              appointment={selectedAppointment}
              onSave={handleSaveAppointment}
              onDelete={handleDeleteAppointment}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentCalendar;
