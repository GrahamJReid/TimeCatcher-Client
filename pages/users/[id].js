/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'react-bootstrap';
import TimelineCard from '../../components/timelines/TimelineCard';
import { getSingleUser } from '../../API/userData';
import { getUserPublicTimelines } from '../../API/timelineData';
import { getUserEvents } from '../../API/eventData';
import EventCard from '../../components/events/EventCard';

export default function UserTimelines() {
  const router = useRouter();
  const { id } = router.query;

  const [timelines, setTimelines] = useState([]);
  const [events, setEvents] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [count, setCount] = useState(0);

  const defineUser = () => {
    getSingleUser(id)
      .then((Data) => {
        setSingleUser(Data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  useEffect(() => {
    defineUser();
    document.title = 'View User';
  }, [id]);

  const displayUserTimelines = () => {
    getUserPublicTimelines(singleUser.id)
      .then((Data) => {
        setTimelines(Data);
      })
      .catch((error) => {
        console.error('Error fetching timelines:', error);
      });
  };

  const displayUserEvents = () => {
    getUserEvents(singleUser.id)
      .then((Data) => {
        setEvents(Data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };
  useEffect(() => {
    if (singleUser.id) {
      displayUserTimelines();
      displayUserEvents();
    }
  }, [singleUser]);
  return (
    <div>

      <h1>{singleUser.username}</h1>
      <h2>{count === 0 ? 'Timelines' : 'Events'}</h2>
      <Button
        onClick={() => setCount(count === 0 ? 1 : 0)}
        className="event-card-button"
      >
        {count === 0 ? 'Events' : 'Timelines'}
      </Button>
      {count === 0 ? (
        <div className="text-center my-4 d-flex">
          {timelines.map((timeline) => (
            <section
              key={`timeline--${timeline.id}`}
              className="timeline"
              style={{ margin: '40px' }}
              id="timeline-section"
            >
              <TimelineCard
                id={timeline.id}
                title={timeline.title}
                imageUrl={timeline.image_url}
                ispublic={timeline.public}
                gallery={timeline.gallery}
                dateAdded={timeline.date_added}
                userId={timeline.user_id}
                onUpdate={displayUserTimelines}
              />
            </section>
          ))}
        </div>
      ) : (
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
                BCE={event.BCE}
                onUpdate={displayUserEvents}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
