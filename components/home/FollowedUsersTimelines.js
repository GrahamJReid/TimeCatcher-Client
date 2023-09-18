/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/context/authContext';
import TimelineCard from '../timelines/TimelineCard';
import { getUserFollowUser } from '../../API/followUserData';
import { getUserPublicTimelines } from '../../API/timelineData';

export default function FollowedUsersTimelines() {
  const [timelines, setTimelines] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch the followUser nodes for the current user
    getUserFollowUser(user.id)
      .then((followUsers) => {
        // Extract the followedUser IDs from the followUser nodes
        const followedUserIds = followUsers.map((followUser) => followUser.followedUser.id);

        // Fetch the public timelines of the followed users
        const promises = followedUserIds.map((followedUserId) => getUserPublicTimelines(followedUserId));
        console.warn(promises);
        Promise.all(promises)
          .then((results) => {
            console.warn(results);
            // Flatten the array of timelines into a single array
            const allTimelines = [].concat(...results);
            setTimelines(allTimelines);
          })
          .catch((error) => {
            console.error('Error fetching timelines:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching followUser nodes:', error);
      });
  }, [user]);

  return (
    <div className="followed-timeline-container">
      <h1 className="followed-timeline-title">Public Timelines of Followed Users</h1>
      <div className="followed-timeline-card-div">
        {timelines.map((timeline) => (
          <div className="followed-timeline-card" key={timeline.id}>
            <TimelineCard
              key={timeline.id}
              id={timeline.id}
              title={timeline.title}
              imageUrl={timeline.image_url}
              ispublic={timeline.public}
              gallery={timeline.gallery}
              dateAdded={timeline.date_added}
              userId={timeline.user_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
