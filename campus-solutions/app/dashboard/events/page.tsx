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
  CheckCircle,
  XCircle,
  Heart,
  Grid3X3,
  CalendarDays,
} from 'lucide-react';

// Define types
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
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

// Category configuration with proper colors
const categoryConfig: Record<string, { icon: any; color: string; bgColor: string; calendarColor: string }> = {
  "Hackathon": { 
    icon: Code, 
    color: "text-blue-600 dark:text-blue-400", 
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    calendarColor: "#3b82f6"
  },
  "Competition": { 
    icon: Trophy, 
    color: "text-yellow-600 dark:text-yellow-400", 
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    calendarColor: "#eab308"
  },
  "Recruitment": { 
    icon: Briefcase, 
    color: "text-green-600 dark:text-green-400", 
    bgColor: "bg-green-50 dark:bg-green-900/20",
    calendarColor: "#22c55e"
  },
  "Workshop": { 
    icon: GraduationCap, 
    color: "text-purple-600 dark:text-purple-400", 
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    calendarColor: "#a855f7"
  },
  "Career": { 
    icon: Briefcase, 
    color: "text-indigo-600 dark:text-indigo-400", 
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    calendarColor: "#6366f1"
  },
  "Entertainment": { 
    icon: Music, 
    color: "text-pink-600 dark:text-pink-400", 
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    calendarColor: "#ec4899"
  },
  "Panel": { 
    icon: Users, 
    color: "text-orange-600 dark:text-orange-400", 
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    calendarColor: "#f97316"
  },
  "Creative": { 
    icon: Camera, 
    color: "text-red-600 dark:text-red-400", 
    bgColor: "bg-red-50 dark:bg-red-900/20",
    calendarColor: "#ef4444"
  },
  "Exhibition": { 
    icon: Eye, 
    color: "text-cyan-600 dark:text-cyan-400", 
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    calendarColor: "#06b6d4"
  },
  "Wellness": { 
    icon: Heart, 
    color: "text-rose-600 dark:text-rose-400", 
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    calendarColor: "#f43f5e"
  },
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
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const savedApplied = JSON.parse(localStorage.getItem('applied-events') || '[]');
    setAppliedEvents(savedApplied);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const eventData = await api.getEvents();
        
        const formattedEvents: CalendarEvent[] = eventData.map(event => {
          const config = categoryConfig[event.category] || categoryConfig["Workshop"];
          return {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            color: config.calendarColor,
            featured: event.featured || false,
            extendedProps: {
              description: event.description,
              category: event.category,
              venue: event.venue,
              slots: event.slots,
              attendees: event.attendees || [],
              committeeId: event.committeeId,
            }
          };
        });

        setEvents(formattedEvents);

        const now = new Date();
        const upcomingCount = formattedEvents.filter(e => new Date(e.start) > now).length;
        const featuredCount = formattedEvents.filter(e => e.featured).length;
        const totalAttendees = formattedEvents.reduce((sum, e) => sum + (e.extendedProps?.attendees?.length || 0), 0);
        setStats({ 
          totalEvents: formattedEvents.length, 
          totalAttendees, 
          upcomingEvents: upcomingCount, 
          featuredEvents: featuredCount 
        });
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = (eventId: string) => {
    let newAppliedEvents;
    if (appliedEvents.includes(eventId)) {
      newAppliedEvents = appliedEvents.filter(id => id !== eventId);
      setPopupMessage("Application withdrawn successfully!");
    } else {
      newAppliedEvents = [...appliedEvents, eventId];
      setPopupMessage("Applied successfully!");
    }
    setAppliedEvents(newAppliedEvents);
    localStorage.setItem('applied-events', JSON.stringify(newAppliedEvents));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };
  
  const filteredEvents = events.filter(event => 
    (selectedCategory === 'all' || event.extendedProps.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (event.extendedProps.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (event.extendedProps.venue || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [...new Set(events.map(event => event.extendedProps?.category).filter(Boolean))];
  const upcomingEventsList = events
    .filter(event => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 6);
  const featuredEventsList = events.filter(event => event.featured).slice(0, 3);
  const myAppliedEventsList = events.filter(event => appliedEvents.includes(event.id));

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) setSelectedEvent(event);
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => {
    const { extendedProps } = event;
    const config = categoryConfig[extendedProps.category] || categoryConfig["Workshop"];
    const IconComponent = config.icon;
    const attendanceRate = (extendedProps.attendees?.length / extendedProps.slots) * 100 || 0;
    const isApplied = appliedEvents.includes(event.id);
    
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-card"
        onClick={() => setSelectedEvent(event)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center rounded-xl h-12 w-12 ${config.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${config.color}`} />
              </div>
              <div className="space-y-1">
                <Badge 
                  variant="secondary" 
                  className={`${config.bgColor} ${config.color} border-0 font-medium`}
                >
                  {extendedProps.category}
                </Badge>
                {event.featured && (
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-white-800 dark:text-blue-200 border-0 ml-5">
                    <Star className="h-3 w-3" />
                  </Badge>
                )}
                {isApplied && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Applied
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">{getEventTimeLabel(event)}</div>
              <div className="text-xs text-muted-foreground/70">{formatTime(new Date(event.start))}</div>
            </div>
          </div>
          <CardTitle className="text-lg font-semibold mt-3 group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {extendedProps.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{extendedProps.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{extendedProps.attendees?.length || 0} / {extendedProps.slots} registered</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Registration Progress</span>
              <span>{Math.round(attendanceRate)}% full</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-700 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" 
                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatsCard = ({ icon: Icon, title, value, description }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    description: string; 
  }) => (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Discover and participate in amazing campus events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={calendarView === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setCalendarView('grid')}
            className="gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid View
          </Button>
          <Button 
            variant={calendarView === 'calendar' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setCalendarView('calendar')}
            className="gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={Calendar} 
          title="Total Events" 
          value={stats.totalEvents} 
          description="All registered events" 
        />
        <StatsCard 
          icon={TrendingUp} 
          title="Upcoming Events" 
          value={stats.upcomingEvents} 
          description="In the next 30 days" 
        />
        <StatsCard 
          icon={Users} 
          title="Total Attendees" 
          value={stats.totalAttendees} 
          description="Across all events" 
        />
        <StatsCard 
          icon={Star} 
          title="Featured Events" 
          value={stats.featuredEvents} 
          description="Special highlights" 
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search events by title, description, or venue..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              {filteredEvents.length} events
            </div>
          </div>
        </CardContent>
      </Card>
      
      {calendarView === 'grid' ? (
        <div className="space-y-12">
          {myAppliedEventsList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">My Applied Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAppliedEventsList.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          {featuredEventsList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Featured Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEventsList.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEventsList.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-6">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                  today: 'today',
                  month: 'month',
                  week: 'week',
                  day: 'day'
                }}
                events={filteredEvents}
                eventClick={handleEventClick}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={3}
                eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                eventDidMount={(info) => {
                  // Custom styling for events
                  info.el.style.border = 'none';
                  info.el.style.borderRadius = '6px';
                  info.el.style.padding = '4px 8px';
                  info.el.style.fontSize = '12px';
                  info.el.style.fontWeight = '500';
                  info.el.style.backgroundColor = info.event.backgroundColor || '#3b82f6';
                  info.el.style.color = 'white';
                }}
                dayCellClassNames="hover:bg-muted/50 transition-colors"
                dayHeaderClassNames="text-muted-foreground font-semibold py-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          {selectedEvent && (
            <>
              <div className="px-6 pt-6">
                <DialogHeader>
                  <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-0">
                          {selectedEvent.extendedProps.category}
                        </Badge>
                        {selectedEvent.featured && (
                          <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-0">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {appliedEvents.includes(selectedEvent.id) && (
                          <Badge className="bg-green-500 text-white border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedEvent.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                      {selectedEvent.extendedProps.description}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(new Date(selectedEvent.start))}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {formatTime(new Date(selectedEvent.start))} - {formatTime(new Date(selectedEvent.end))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Venue</p>
                        <p className="font-medium">{selectedEvent.extendedProps.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className="font-medium">
                          {selectedEvent.extendedProps.attendees?.length || 0} / {selectedEvent.extendedProps.slots} registered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Registration Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(((selectedEvent.extendedProps.attendees?.length || 0) / selectedEvent.extendedProps.slots) * 100)}% full
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700 rounded-full bg-primary" 
                      style={{ 
                        width: `${((selectedEvent.extendedProps.attendees?.length || 0) / selectedEvent.extendedProps.slots) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <Button 
                    onClick={() => handleApply(selectedEvent.id)} 
                    size="lg" 
                    className={`flex-1 font-medium ${
                      appliedEvents.includes(selectedEvent.id) 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {appliedEvents.includes(selectedEvent.id) ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Withdraw Application
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Apply for this Event
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="lg">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Success/Error Popup */}
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-primary text-primary-foreground py-3 px-6 rounded-lg shadow-lg flex items-center animate-in fade-in slide-in-from-bottom duration-300 z-50">
          <CheckCircle className="h-5 w-5 mr-2" />
          {popupMessage}
        </div>
      )}
    </div>
  );
}
