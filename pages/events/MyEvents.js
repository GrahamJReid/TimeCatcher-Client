/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import { getUserTimelines } from '../../API/timelineData';
import TimelineCard from '../../components/timelines/TimelineCard';
import EventFormModal from '../../components/events/EventFormModal';

export default function MyEvents() {
  const { user } = useAuth();
  const [timelines, setTimelines] = useState([]);

  const displayUserTimelines = () => {
    getUserTimelines(user.id)
      .then((Data) => {
        setTimelines(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    displayUserTimelines();
  }, [user.id]);

  return (

    <div>

      <h1>My Events</h1>
      <EventFormModal />

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
    </div>

  );
}
