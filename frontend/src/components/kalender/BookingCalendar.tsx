import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventApi } from '@fullcalendar/core';
import { erstelleReservierung, getReservierungen } from './funktionen';
import BookingDialog from './BookingDialog';
import EventCard from './EventCard';

interface BookingCalendarProps {
  isAdmin: boolean;
  userId: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ isAdmin, userId }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const fetchedReservierungen = await getReservierungen();
      const mappedEvents = fetchedReservierungen.map((r) => ({
        id: r.id,
        title: isAdmin
          ? r.title
          : r.userId === userId
          ? r.title
          : r.status === 'gebucht'
          ? 'Gebucht'
          : r.status === 'reserviert'
          ? 'Reserviert'
          : '',
        date: r.date,
        color: isAdmin
          ? r.status === 'gebucht'
            ? '#9c27b0'
            : '#ffeb3b'
          : r.userId === userId
          ? '#4caf50'
          : r.status === 'gebucht'
          ? '#e53935'
          : '#ffeb3b',
        extendedProps: {
          category: r.status,
          info: r.info,
          equipment: r.equipment,
          address: r.address,
          customer: r.userId,
        },
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Fehler beim Laden der Reservierungen:', error);
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      setSelectedDate(info.dateStr);
    }
  };

  const handleEventClick = (info: { event: EventApi }) => {
    if (isAdmin) {
      setSelectedEvent(info.event);
    }
  };

  const handleEventClose = () => {
    setSelectedEvent(null);
  };

  const handleBooking = async () => {
    if (!selectedDate) return;

    try {
      await erstelleReservierung(selectedDate, userId);
      alert('Reservierung wurde erfolgreich eingetragen.');
      setSelectedDate(null);
      fetchEvents();
    } catch (error) {
      console.error('Fehler beim Erstellen der Reservierung:', error);
      alert('Es gab einen Fehler bei der Reservierung.');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        selectable={false}
        editable={false}
      />
      <BookingDialog
        selectedDate={selectedDate}
        onClose={() => setSelectedDate(null)}
        onConfirm={handleBooking}
        isAdmin={isAdmin}
      />
      {isAdmin && selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={handleEventClose}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default BookingCalendar;
