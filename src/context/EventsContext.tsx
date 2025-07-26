
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { mockEvents as initialMockEvents } from '@/lib/events';

export type EventType = 'school' | 'fun' | 'chore';
export interface Event {
  time: string;
  title: string;
  type: EventType;
}
export type Events = Record<string, Event[]>;

interface EventsContextType {
  events: Events;
  addEvent: (date: Date, newEvent: Event) => void;
  deleteEvent: (date: Date, eventIndex: number) => void;
}

const EventsContext = React.createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = React.useState<Events>(initialMockEvents);

  const addEvent = (date: Date, newEvent: Event) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setEvents(prevEvents => {
      const updatedEventsForDay = [...(prevEvents[dateKey] || []), newEvent];
      updatedEventsForDay.sort((a, b) => a.time.localeCompare(b.time));
      return {
        ...prevEvents,
        [dateKey]: updatedEventsForDay,
      };
    });
  };

  const deleteEvent = (date: Date, eventIndex: number) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setEvents(prevEvents => {
      const dayEvents = prevEvents[dateKey] || [];
      const updatedEventsForDay = dayEvents.filter((_, index) => index !== eventIndex);
      return {
        ...prevEvents,
        [dateKey]: updatedEventsForDay,
      };
    });
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = React.useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
