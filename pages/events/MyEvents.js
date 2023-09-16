import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import EventFormModal from '../../components/events/EventFormModal';
import EventCard from '../../components/events/EventCard';
import { getUserEventsWithSearch } from '../../API/eventData';
import myEventsStyle from '../../styles/events/myEvents.module.css';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Step 1: State for search query

  const displayUserEvents = () => {
    // Step 4: Pass the searchQuery to getUserEvents
    getUserEventsWithSearch(user.id, searchQuery)
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
  }, [user.id, searchQuery]); // Step 4: Include searchQuery in dependencies

  // Step 3: Event handler to update searchQuery
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={myEventsStyle.MyEventsContainer}>
      <h1 className={myEventsStyle.Title}>My Events</h1>
      <EventFormModal />

      {/* Step 2: Input field for search */}
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={myEventsStyle.SearchBar}
      />

      <div className={myEventsStyle.MyEventsDiv}>
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
              BCE={event.BCE}
              isPrivate={event.isPrivate}
              onUpdate={displayUserEvents}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
