// // /app/dashboard/events/page.tsx

// /app/dashboard/events/page.tsx
// /app/dashboard/events/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/mockApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Search,
  Eye,
  Star,
  Trophy,
  Code,
  Briefcase,
  GraduationCap,
  Music,
  Camera,
  Share2,
  Bookmark,
  TrendingUp,
  Zap,
  Heart,
  BookOpen,
  Sun,
  Moon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Define types
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string; // Used for border color only
  featured?: boolean;
  extendedProps: {
    description: string;
    category: string;
    venue: string;
    slots: number;
    attendees: string[];
    committeeId: string;
  };
}

interface EventStats {
  totalEvents: number;
  totalAttendees: number;
  upcomingEvents: number;
  featuredEvents: number;
}

// Category configuration
const categoryIcons: Record<string, any> = {
  "Hackathon": Code,
  "Competition": Trophy,
  "Recruitment": Briefcase,
  "Workshop": GraduationCap,
  "Career": Briefcase,
  "Entertainment": Music,
  "Panel": Users,
  "Creative": Camera,
  "Exhibition": Eye,
  "Wellness": Heart,
};

// Date utility functions
const formatDate = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const formatShortDate = (date: Date): string => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const isToday = (date: Date): boolean => new Date().toDateString() === date.toDateString();
const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toDateString() === date.toDateString();
};
const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const weekLater = new Date(new Date().setDate(today.getDate() + 7));
  return date < weekLater && date > new Date();
};
const getEventTimeLabel = (event: CalendarEvent): string => {
  const eventDate = new Date(event.start);
  if (isToday(eventDate)) return "Today";
  if (isTomorrow(eventDate)) return "Tomorrow";
  if (isThisWeek(eventDate)) return "This week";
  return formatShortDate(eventDate);
};

export default function EventsPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calendarView, setCalendarView] = useState<'grid' | 'calendar'>('grid');
  const [stats, setStats] = useState<EventStats>({ totalEvents: 0, totalAttendees: 0, upcomingEvents: 0, featuredEvents: 0 });
  const [theme, setTheme] = useState('light');
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('events-theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    const savedApplied = JSON.parse(localStorage.getItem('applied-events') || '[]');
    setAppliedEvents(savedApplied);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const eventData = await api.getEvents();
        
        const formattedEvents: CalendarEvent[] = eventData.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: '#000000', // Set all event borders to black
          featured: event.featured || false,
          extendedProps: {
            description: event.description,
            category: event.category,
            venue: event.venue,
            slots: event.slots,
            attendees: event.attendees || [],
            committeeId: event.committeeId,
          }
        }));

        setEvents(formattedEvents);

        const now = new Date();
        const upcomingCount = formattedEvents.filter(e => new Date(e.start) > now).length;
        const featuredCount = formattedEvents.filter(e => e.featured).length;
        const totalAttendees = formattedEvents.reduce((sum, e) => sum + (e.extendedProps?.attendees?.length || 0), 0);
        setStats({ totalEvents: formattedEvents.length, totalAttendees, upcomingEvents: upcomingCount, featuredEvents: featuredCount });
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('events-theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleApply = (eventId: string) => {
    let newAppliedEvents;
    if (appliedEvents.includes(eventId)) {
      newAppliedEvents = appliedEvents.filter(id => id !== eventId);
      setPopupMessage("Application withdrawn");
    } else {
      newAppliedEvents = [...appliedEvents, eventId];
      setPopupMessage("Applied successfully!");
    }
    setAppliedEvents(newAppliedEvents);
    localStorage.setItem('applied-events', JSON.stringify(newAppliedEvents));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };
  
  const filteredEvents = events.filter(event => 
    (selectedCategory === 'all' || event.extendedProps.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (event.extendedProps.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (event.extendedProps.venue || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [...new Set(events.map(event => event.extendedProps?.category).filter(Boolean))];
  const upcomingEventsList = events.filter(event => new Date(event.start) > new Date()).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).slice(0, 6);
  const featuredEventsList = events.filter(event => event.featured).slice(0, 3);
  const myAppliedEventsList = events.filter(event => appliedEvents.includes(event.id));

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) setSelectedEvent(event);
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => {
    const { extendedProps } = event;
    const IconComponent = categoryIcons[extendedProps.category] || Calendar;
    const attendanceRate = (extendedProps.attendees?.length / extendedProps.slots) * 100 || 0;
    
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 bg-white dark:bg-gray-800 border-black dark:border-gray-700"
        onClick={() => setSelectedEvent(event)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg text-white dark:text-black bg-black dark:bg-white shadow-sm h-10 w-10">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                    {extendedProps.category}
                </Badge>
                {event.featured && (
                  <Badge className="ml-2 bg-black text-white dark:bg-white dark:text-black">
                      <Star className="h-3 w-3 mr-1" />Featured
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{getEventTimeLabel(event)}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{formatTime(new Date(event.start))}</div>
            </div>
          </div>
          <CardTitle className="transition-colors mt-3 text-lg text-gray-900 dark:text-white">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">{extendedProps.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" /><span className="truncate">{extendedProps.venue}</span></div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-500 dark:text-gray-400" /><span>{extendedProps.attendees?.length || 0} / {extendedProps.slots} attending</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Registration Progress</span>
              <span>{Math.round(attendanceRate)}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-700 rounded-full bg-black dark:bg-white" style={{ width: `${Math.min(attendanceRate, 100)}%` }}/>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatsCard = ({ icon: Icon, title, value, description }: { icon: any; title: string; value: string | number; description: string; }) => (
    <Card className="transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 transition-colors duration-300 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Events Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover and join amazing campus events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={toggleTheme} className="dark:bg-gray-800 dark:text-white dark:border-gray-600"><span className="sr-only">Toggle Theme</span>{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</Button>
          <Button variant="outline" size="sm" onClick={() => setCalendarView(v => v === 'grid' ? 'calendar' : 'grid')} className="dark:bg-gray-800 dark:text-white dark:border-gray-600">{calendarView === 'grid' ? <Calendar className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />} {calendarView === 'grid' ? 'Calendar' : 'Grid'} View</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Calendar} title="Total Events" value={stats.totalEvents} description="All time events" />
        <StatsCard icon={TrendingUp} title="Upcoming Events" value={stats.upcomingEvents} description="Next 30 days" />
        <StatsCard icon={Users} title="Total Attendees" value={stats.totalAttendees} description="Registered participants" />
        <StatsCard icon={Star} title="Featured Events" value={stats.featuredEvents} description="Special highlights" />
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="all">All Categories</option>
                {categories.map(category => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400"><Eye className="h-4 w-4 mr-1" />{filteredEvents.length} events</div>
          </div>
        </CardContent>
      </Card>
      
      {calendarView === 'grid' ? (
        <div className="space-y-12">
          {myAppliedEventsList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4"><CheckCircle className="h-5 w-5 text-gray-900 dark:text-white" /><h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Applied Events</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{myAppliedEventsList.map(event => (<EventCard key={event.id} event={event} />))}</div>
            </div>
          )}
          {featuredEventsList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4"><Zap className="h-5 w-5 text-gray-900 dark:text-white" /><h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Events</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{featuredEventsList.map((event) => (<EventCard key={event.id} event={event} />))}</div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-5 w-5 text-gray-900 dark:text-white" /><h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{upcomingEventsList.map(event => (<EventCard key={event.id} event={event} />))}</div>
          </div>
          <div><h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Events</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredEvents.map(event => (<EventCard key={event.id} event={event} />))}</div></div>
        </div>
      ) : (
        <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth" headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }} events={filteredEvents} eventClick={handleEventClick} height="auto" />
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          {selectedEvent && (
            <>
              <div className="absolute inset-x-0 top-0 h-32 rounded-t-lg bg-black" />
              <div className="relative pt-20">
                <DialogHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-gray-200 text-black dark:bg-gray-600 dark:text-white">{selectedEvent.extendedProps.category}</Badge>
                      {selectedEvent.featured && (<Badge className="bg-white text-black"><Star className="h-3 w-3 mr-1" />Featured</Badge>)}
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</DialogTitle>
                  <DialogDescription className="text-gray-200 text-base">{selectedEvent.extendedProps.description}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 text-gray-900 dark:text-white md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"><Calendar className="h-5 w-5" /></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Date</p><p className="font-medium">{formatDate(new Date(selectedEvent.start))}</p></div></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"><Clock className="h-5 w-5" /></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Time</p><p className="font-medium">{formatTime(new Date(selectedEvent.start))} - {formatTime(new Date(selectedEvent.end))}</p></div></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"><MapPin className="h-5 w-5" /></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Venue</p><p className="font-medium">{selectedEvent.extendedProps.venue}</p></div></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"><Users className="h-5 w-5" /></div><div><p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p><p className="font-medium">{selectedEvent.extendedProps.attendees?.length || 0} / {selectedEvent.extendedProps.slots} registered</p></div></div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-900 dark:text-gray-300">Registration Progress</span><span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(((selectedEvent.extendedProps.attendees?.length || 0) / selectedEvent.extendedProps.slots) * 100)}% full</span></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full transition-all duration-700 rounded-full bg-black dark:bg-white" style={{ width: `${((selectedEvent.extendedProps.attendees?.length || 0) / selectedEvent.extendedProps.slots) * 100}%` }}/></div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button onClick={() => handleApply(selectedEvent.id)} size="lg" className={`flex-1 font-medium ${appliedEvents.includes(selectedEvent.id) ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'}`}>{appliedEvents.includes(selectedEvent.id) ? <XCircle className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}{appliedEvents.includes(selectedEvent.id) ? 'Withdraw Application' : 'Apply for this Event'}</Button>
                  <Button variant="outline" size="lg" className="dark:bg-gray-700 dark:border-gray-600"><Share2 className="h-4 w-4 mr-2" />Share</Button>
                  <Button variant="outline" size="lg" className="dark:bg-gray-700 dark:border-gray-600"><Bookmark className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-gray-900 dark:bg-white text-white dark:text-black py-2 px-5 rounded-lg shadow-lg flex items-center animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle className="h-5 w-5 mr-2" /> {popupMessage}
        </div>
      )}
    </div>
  );
}
// "use client";

// import { useEffect, useState } from 'react';
// import { api } from '@/lib/mockApi';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { format } from 'date-fns';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Calendar, Clock, MapPin, Users } from 'lucide-react';

// // Define a type for our event data
// interface CalendarEvent {
//   id: string;
//   title: string;
//   start: string;
//   end: string;
//   color: string;
//   extendedProps: {
//     description: string;
//     category: string;
//     venue: string;
//     slots: number;
//     attendees: string[];
//     committeeId: string;
//   };
// }

// export default function EventsPage() {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       const eventData = await api.getEvents();
//       // We need to format the data to what FullCalendar expects
//       const formattedEvents = eventData.map(event => ({
//         id: event.id,
//         title: event.title,
//         start: event.start,
//         end: event.end,
//         color: event.color,
//         extendedProps: {
//           description: event.description,
//           category: event.category,
//           venue: event.venue,
//           slots: event.slots,
//           attendees: event.attendees,
//           committeeId: event.committeeId,
//         }
//       }));
//       setEvents(formattedEvents);
//       setIsLoading(false);
//     };
//     fetchData();
//   }, []);

//   const handleEventClick = (clickInfo: any) => {
//     setSelectedEvent(clickInfo.event);
//   };

//   return (
//     <div className="animate-in fade-in duration-500">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Events Calendar</h1>
//           <p className="text-muted-foreground">Stay up-to-date with all campus happenings.</p>
//         </div>
//       </div>

//       <div className="mt-6">
//         <div className="p-4 bg-card rounded-xl border">
//           {isLoading ? (
//             <p>Loading calendar...</p>
//           ) : (
//             <FullCalendar
//               plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               headerToolbar={{
//                 left: 'prev,next today',
//                 center: 'title',
//                 right: 'dayGridMonth,timeGridWeek,timeGridDay'
//               }}
//               events={events}
//               eventClick={handleEventClick}
//               height="auto"
//               // Add some modern styling
//               dayHeaderClassNames="text-muted-foreground font-semibold"
//               eventClassNames="cursor-pointer border-none p-1 rounded-md text-sm"
//             />
//           )}
//         </div>
//       </div>

//       {/* Event Details Modal */}
//       <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
//         <DialogContent className="sm:max-w-[480px]">
//           {selectedEvent && (
//             <>
//               <DialogHeader>
//                 <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
//                 <DialogDescription className="pt-2">
//                   <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
//                     {selectedEvent.extendedProps.category}
//                   </span>
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <p>{selectedEvent.extendedProps.description}</p>
//                 <div className="flex items-center gap-3">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span>{format(new Date(selectedEvent.start), 'PPP')}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span>{format(new Date(selectedEvent.start), 'p')} - {format(new Date(selectedEvent.end), 'p')}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <MapPin className="h-4 w-4 text-muted-foreground" />
//                   <span>{selectedEvent.extendedProps.venue}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                   <span>{selectedEvent.extendedProps.attendees.length} / {selectedEvent.extendedProps.slots} attending</span>
//                 </div>
//               </div>
//               <div className="pt-4">
//                   <Button className="w-full">RSVP for this Event</Button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }