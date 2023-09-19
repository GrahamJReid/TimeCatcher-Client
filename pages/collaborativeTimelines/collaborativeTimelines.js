/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';

import collaborativeTimelineStyle from '../../styles/timelines/collaborativeTimeline.module.css';

import { getUserCollaborativeTimelinesWithSearch } from '../../API/collaborativeTimelineData';
import CollaborativeTimelineCard from '../../components/collaborative timelines/CollaborativeTimelineCard';
import CollaborativeTimelineFormModal from '../../components/collaborative timelines/CollaborativeTimelineFormModal';

export default function CollaborativeTimelines() {
  const { user } = useAuth();
  const [timelines, setTimelines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const displayUserTimelines = () => {
    getUserCollaborativeTimelinesWithSearch(user.id, searchQuery)
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

    <div className={collaborativeTimelineStyle.CollaborativeTimelineContainer}>

      <h1 className={collaborativeTimelineStyle.Title}>Collaborative Timelines</h1>
      <CollaborativeTimelineFormModal />
      <input
        type="text"
        placeholder="Search timelines..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={collaborativeTimelineStyle.SearchBar}
      />

      <div className={collaborativeTimelineStyle.CollaborativeTimelinesDiv}>
        {timelines.map((timeline) => (
          <section
            key={`timeline--${timeline.id}`}
            className="timeline"
            style={{ margin: '40px' }}
            id="timeline-section"
          >
            <CollaborativeTimelineCard
              id={timeline.id}
              title={timeline.title}
              imageUrl={timeline.image_url}
              ispublic={timeline.public}
              gallery={timeline.gallery}
              dateAdded={timeline.date_added}
              user1={timeline.user1}
              user2={timeline.user2}
              onUpdate={displayUserTimelines}
            />
          </section>
        ))}
      </div>
    </div>

  );
}
