/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import EventFormModal from '../../components/events/EventFormModal';
import EventCard from '../../components/events/EventCard';
import { getUserEvents } from '../../API/eventData';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  const displayUserEvents = () => {
    getUserEvents(user.id)
      .then((Data) => {
        setEvents(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    displayUserEvents();
    document.title = 'My Events';
  }, [user.id]);

  return (

    <div>

      <h1>My Events</h1>
      <EventFormModal />

      <div className="text-center my-4 d-flex">
        {events.map((event) => (
          <section
            key={`event--${event.id}`}
            className="event"
            style={{ margin: '40px' }}
            id="event-section"
          >
            <EventCard
              id={event.id}
              title={event.title}
              imageUrl={event.image_url}
              description={event.description}
              date={event.date}
              color={event.color}
              userId={event.user_id}
              onUpdate={displayUserEvents}
            />
          </section>
        ))}
      </div>
    </div>

  );
}
