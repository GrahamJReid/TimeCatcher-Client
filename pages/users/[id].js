/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import TimelineCard from '../../components/timelines/TimelineCard';
import { getSingleUser } from '../../API/userData';
import { getUserPublicTimelines } from '../../API/timelineData';
import { getUserPublicEvents } from '../../API/eventData';
import EventCard from '../../components/events/EventCard';
import {
  createFollowUser, deleteFollowUser, getFollowUser, getUserFollowUser,
} from '../../API/followUserData';
import { useAuth } from '../../utils/context/authContext';

export default function ViewSingleUser() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [timelines, setTimelines] = useState([]);
  const [events, setEvents] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [count, setCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

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

  useEffect(() => {
    const integerId = parseInt(id, 10);
    async function checkIfFollowing() {
      try {
        const isCurrentlyFollowing = await getUserFollowUser(user.id);
        console.warn(isCurrentlyFollowing[0].followedUser.id, id);
        if (isCurrentlyFollowing.length > 0 && isCurrentlyFollowing[0].followedUser.id === integerId) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error('Error checking if following:', error);
      }
    }

    checkIfFollowing();
  }, [user.id, id]);

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
    getUserPublicEvents(singleUser.id)
      .then((Data) => {
        setEvents(Data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const toggleFollow = async () => {
    const integerId = parseInt(id, 10);
    try {
      // Check if the user is already following
      const isCurrentlyFollowing = await getUserFollowUser(user.id);
      console.warn(isCurrentlyFollowing);

      // Find the followUser object with the matching followedUser.id
      const existingFollowUser = isCurrentlyFollowing.find((followUser) => followUser.followedUser.id === integerId);

      if (existingFollowUser) {
        // If already following, unfollow the user
        await deleteFollowUser(existingFollowUser.id);
        setIsFollowing(false);
      } else {
        // If not following, follow the user
        const payload = {
          followingUser: user.id,
          followedUser: id,
        };

        await createFollowUser(payload);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  useEffect(() => {
    if (singleUser.id) {
      displayUserTimelines();
      displayUserEvents();

      // Fetch follower count from your API and update `followerCount` state
      const integerId = parseInt(id, 10);
      getFollowUser().then((data) => {
        const filteredData = data.filter((item) => item.followedUser.id === integerId);
        const followerCount = filteredData.length;
        console.warn('count count ', followerCount);
        setFollowerCount(followerCount);
      });
    }
  }, [singleUser, id, isFollowing]);

  return (
    <div>
      <h1>{singleUser.username}</h1>
      <Button onClick={toggleFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      <p>Follower Count: {followerCount}</p>

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
                isPrivate={event.isPrivate}
                onUpdate={displayUserEvents}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
