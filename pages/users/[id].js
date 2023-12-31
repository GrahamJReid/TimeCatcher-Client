/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TimelineCard from '../../components/timelines/TimelineCard';
import { getSingleUser } from '../../API/userData';
import { getUserPublicTimelines } from '../../API/timelineData';
import { getUserPublicEvents } from '../../API/eventData';
import EventCard from '../../components/events/EventCard';
import {
  createFollowUser, deleteFollowUser, getFollowUser, getUserFollowUser,
} from '../../API/followUserData';
import { useAuth } from '../../utils/context/authContext';
import { getUserThreads } from '../../API/threadsData';
import EventThreadCard from '../../components/eventThreads/EventThreadCard';
import userPageStyle from '../../styles/users/viewSingleUser.module.css';

export default function ViewSingleUser() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [timelines, setTimelines] = useState([]);
  const [events, setEvents] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [threads, setThreads] = useState([]);
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
        console.warn(isCurrentlyFollowing);

        // Check if there's any followUser object where followedUser.id === integerId
        const isFollowing = isCurrentlyFollowing.some(
          (followUser) => followUser.followedUser.id === integerId,
        );

        setIsFollowing(isFollowing);
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
  const displayUserThreads = () => {
    getUserThreads(singleUser.id)
      .then((Data) => {
        setThreads(Data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const toggleFollow = async () => {
    const integerId = parseInt(id, 10);
    try {
      const isCurrentlyFollowing = await getUserFollowUser(user.id);
      console.warn(isCurrentlyFollowing);

      const existingFollowUser = isCurrentlyFollowing.find((followUser) => followUser.followedUser.id === integerId);

      if (existingFollowUser) {
        await deleteFollowUser(existingFollowUser.id);
        setIsFollowing(false);
      } else {
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
      displayUserThreads();

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
    <div className={userPageStyle.UserPageStyle}>
      <div className={userPageStyle.UserNameImageContainer}>
        <img src={singleUser.image_url} className={userPageStyle.UserImage} />
        <h1 className={userPageStyle.UserName}>{singleUser.username}</h1>
      </div>
      <Button onClick={toggleFollow} className={userPageStyle.FollowButton}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      <p className={userPageStyle.FollowCount}>Follower Count: {followerCount}</p>

      <Tabs
        defaultActiveKey="timelines"
        id="uncontrolled-tab-example"
        className={userPageStyle.TabsContainer}
      >
        <Tab eventKey="timelines" title="Timelines" className={userPageStyle.Tab}>
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
        </Tab>
        <Tab eventKey="events" title="Events" className={userPageStyle.Tab}>
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
        </Tab>
        <Tab eventKey="threads" title="Threads" className={userPageStyle.Tab}>
          <div className="text-center my-4 d-flex">
            {threads.map((thread) => (
              <section
                key={`thread--${thread.id}`}
                style={{ margin: '40px' }}
                id="thread-section"
              >
                <EventThreadCard
                  id={thread.id}
                  title={thread.title}
                  event={thread.event}
                  isUser={thread.user}
                  date={thread.date}
                  description={thread.description}
                />
              </section>
            ))}
          </div>

        </Tab>
      </Tabs>
    </div>
  );
}
