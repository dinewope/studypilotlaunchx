
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import type { Event, EventType } from '@/context/EventsContext';

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // Set the date on the client-side to avoid hydration errors
  React.useEffect(() => {
    setDate(new Date());
  }, []);

  const { events, addEvent, deleteEvent } = useEvents();

  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventTime, setNewEventTime] = React.useState('');
  const [newEventType, setNewEventType] = React.useState<EventType>('school');

  const selectedDateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const eventsForSelectedDay = selectedDateKey ? events[selectedDateKey] || [] : [];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !newEventTitle || !newEventTime) {
      alert('Please fill out all fields for the new event.');
      return;
    }

    const newEvent: Event = {
      title: newEventTitle,
      time: newEventTime,
      type: newEventType,
    };

    addEvent(date, newEvent);

    // Reset form
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventType('school');
  };

  const handleDeleteEvent = (eventIndex: number) => {
    if (date) {
        deleteEvent(date, eventIndex);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Calendar</h1>
        <p className="text-muted-foreground">Plan your weeks, see your deadlines, and never miss an event.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3"
                        classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 flex-1",
                        caption_label: "text-lg font-medium",
                        head_row: "flex justify-between",
                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                        row: "flex w-full mt-2 justify-between",
                        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 rounded-full",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        }}
                    />
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Add New Event</CardTitle>
                <CardDescription>Select a day on the calendar to add an event to it.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="e.g., Math Homework" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} disabled={!date} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input id="event-time" type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} disabled={!date} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Type</Label>
                     <Select value={newEventType} onValueChange={(value) => setNewEventType(value as EventType)} disabled={!date}>
                      <SelectTrigger id="event-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="fun">Fun</SelectItem>
                        <SelectItem value="chore">Chore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={!date}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                </form>
              </CardContent>
            </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {date ? format(date, 'MMMM d') : '...'}
              </CardTitle>
              <CardDescription>
                {eventsForSelectedDay.length > 0
                  ? `You have ${eventsForSelectedDay.length} event(s) today.`
                  : 'No events scheduled for this day.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {eventsForSelectedDay.map((event, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-muted-foreground w-20">{event.time}</div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant={event.type === 'school' ? 'default' : event.type === 'fun' ? 'outline' : 'secondary'} className={event.type === 'school' ? 'bg-primary/80 text-primary-foreground' : event.type === 'fun' ? 'border-accent text-accent-foreground' : ''}>
                        {event.type}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(index)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
