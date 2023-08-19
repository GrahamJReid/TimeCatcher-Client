/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import TimelineCard from '../../components/timelines/TimelineCard';
import { getSingleUser } from '../../API/userData';
import { getUserPublicTimelines } from '../../API/timelineData';

export default function UserTimelines() {
  const router = useRouter();
  const { id } = router.query;

  const [timelines, setTimelines] = useState([]);
  const [singleUser, setSingleUser] = useState({});

  const defineUser = () => {
    getSingleUser(id)
      .then((Data) => {
        setSingleUser(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    defineUser();
  }, [singleUser.id]);

  const displayUserTimelines = () => {
    getUserPublicTimelines(singleUser.id)
      .then((Data) => {
        setTimelines(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };
  displayUserTimelines();
  return (

    <div>
      <h1>{singleUser.username}</h1>
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
