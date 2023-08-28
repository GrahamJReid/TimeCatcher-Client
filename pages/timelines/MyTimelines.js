/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import TimelineFormModal from '../../components/timelines/TimeLineFormModal';
import { getUserTimelinesWithSearch } from '../../API/timelineData';
import TimelineCard from '../../components/timelines/TimelineCard';

export default function MyTimelines() {
  const { user } = useAuth();
  const [timelines, setTimelines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const displayUserTimelines = () => {
    getUserTimelinesWithSearch(user.id, searchQuery)
      .then((Data) => {
        setTimelines(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    displayUserTimelines();
    document.title = 'My Timelines';
  }, [user.id, searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (

    <div>

      <h1>My Timelines</h1>
      <TimelineFormModal />
      <input
        type="text"
        placeholder="Search timelines..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="SearchInput"
      />

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
