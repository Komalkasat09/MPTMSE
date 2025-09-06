// /app/dashboard/events/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/mockApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

// Define a type for our event data
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  extendedProps: {
    description: string;
    category: string;
    venue: string;
    slots: number;
    attendees: string[];
    committeeId: string;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const eventData = await api.getEvents();
      // We need to format the data to what FullCalendar expects
      const formattedEvents = eventData.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.color,
        extendedProps: {
          description: event.description,
          category: event.category,
          venue: event.venue,
          slots: event.slots,
          attendees: event.attendees,
          committeeId: event.committeeId,
        }
      }));
      setEvents(formattedEvents);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events Calendar</h1>
          <p className="text-muted-foreground">Stay up-to-date with all campus happenings.</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="p-4 bg-card rounded-xl border">
          {isLoading ? (
            <p>Loading calendar...</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              // Add some modern styling
              dayHeaderClassNames="text-muted-foreground font-semibold"
              eventClassNames="cursor-pointer border-none p-1 rounded-md text-sm"
            />
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="pt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {selectedEvent.extendedProps.category}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p>{selectedEvent.extendedProps.description}</p>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(selectedEvent.start), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(selectedEvent.start), 'p')} - {format(new Date(selectedEvent.end), 'p')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.extendedProps.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.extendedProps.attendees.length} / {selectedEvent.extendedProps.slots} attending</span>
                </div>
              </div>
              <div className="pt-4">
                  <Button className="w-full">RSVP for this Event</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}