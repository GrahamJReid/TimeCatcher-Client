/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useRouter } from 'next/router';
import { Button, Dropdown } from 'react-bootstrap';
import { createEvent, getUserEvents } from '../../API/eventData';
import { useAuth } from '../../utils/context/authContext';
import { getSingleCollaborativeTimeline } from '../../API/collaborativeTimelineData';
import {
  createCollaborativeTimelineEvent, deleteCollaborativeTimelineEvent, getCollaborativeTimelineEventsByEventId, getSingleCollaborativeTimelineEvents,
} from '../../API/collaborativeTimelineEvents';
import { createTimelineEvent } from '../../API/timelineEvent';
import { createTimeline } from '../../API/timelineData';

import singleCollaborativeTimelineStyle from '../../styles/timelines/viewSingleCollaborativeTimeline.module.css';

function CollaborativeTimeline() {
  const [sortedEventArray, setSortedEventArray] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [timeline, setTimeline] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;

  useEffect(() => {
    getSingleCollaborativeTimeline(id).then((data) => {
      setTimeline(data);
    });
    document.title = 'View Timeline';
  }, []);

  const updateEvents = () => {
    getSingleCollaborativeTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => {
        const dateA = a.BCE ? -new Date(a.date) : new Date(a.date);
        const dateB = b.BCE ? -new Date(b.date) : new Date(b.date);

        // Compare BCE and CE events
        if (dateA === dateB) {
          return 0; // Events have the same date
        } if (a.BCE && !b.BCE) {
          return -1; // a (BCE) comes before b (CE)
        } if (!a.BCE && b.BCE) {
          return 1; // b (BCE) comes before a (CE)
        }
        return dateA - dateB; // Both BCE or both CE, sort by date
      });

      const filteredEvents = sortedEvents.filter((event) => {
        if (user.id === event.user_id.id) {
          // Show all events if the user is the owner
          return true;
        // eslint-disable-next-line no-else-return
        } else if (!event.isPrivate) {
          // Show non-private events if the user is not the owner
          return true;
        }
        return false; // Hide private events if the user is not the owner
      });

      setSortedEventArray(filteredEvents);
    });
  };

  useEffect(() => {
    updateEvents();
  }, []);

  useEffect(() => {
    getUserEvents(user.id).then((data) => {
      setUserEvents(data);
    });
  }, []);

  const handleEventSelection = async (event) => {
    const timelineEvent = {
      timelineId: parseInt(id, 10),
      eventId: event.id,
    };
    await createCollaborativeTimelineEvent(timelineEvent).then(() => {
      updateEvents();
    });
  };
  const handleRemoveEvent = async (eventId) => {
    getCollaborativeTimelineEventsByEventId(eventId).then((data) => {
      const filteredData = data.filter((item) => item.timeline_id.id === parseInt(id, 10));

      deleteCollaborativeTimelineEvent(parseInt(filteredData[0].id, 10)).then(() => {
        updateEvents();
      });
    });
  };
  const handleAddToCollection = async () => {
    try {
      const timelinePayload = {
        userId: user.id,
        title: timeline.title,
        public: timeline.public,
        gallery: timeline.gallery,
        imageUrl: timeline.image_url,
        dateAdded: timeline.date_added,
      };

      // Create the timeline
      const createdTimeline = await createTimeline(timelinePayload);

      if (createdTimeline) {
        const { id: timelineId } = createdTimeline; // Extract the timelineId

        // Prepare an array to store new events created during the process
        const newEvents = [];

        // Iterate through the sortedEventArray
        for (const event of sortedEventArray) {
          // Check if the event's user_id is not the current user's
          if (event.user_id.id !== user.id) {
            // Create a new event based on the current event
            const newEventPayload = {
              userId: user.id, // Assign the current user as the owner
              title: event.title,
              description: event.description,
              date: event.date,
              color: event.color,
              imageUrl: event.image_url,
              BCE: event.BCE,
              isPrivate: event.isPrivate,
            };

            // Create the new event
            const newEvent = await createEvent(newEventPayload);

            if (newEvent) {
              // Store the new event in the array
              newEvents.push(newEvent);

              // Create a timelineEvent based on the new event
              const timelineEventPayload = {
                timelineId,
                eventId: newEvent.id,
              };

              // Create the timelineEvent
              await createTimelineEvent(timelineEventPayload);
            }
          } else {
            // Create a timelineEvent for the current user's event
            const timelineEventPayload = {
              timelineId,
              eventId: event.id,
            };

            // Create the timelineEvent
            await createTimelineEvent(timelineEventPayload);
          }
        }

        // After processing all events, you can use the newEvents array for any further actions if needed

        // Redirect to the desired page
        router.push('/timelines/MyTimelines');
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  };

  console.warn(timeline);
  return (
    <div className={singleCollaborativeTimelineStyle.SingleCollaborativeTimelineContainer}>

      <>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Add Event
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {userEvents.map((event) => (
              <Dropdown.Item key={event.id} onClick={() => handleEventSelection(event)}>
                {event.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

      </>

      {timeline.public === false ? '' : (
        <Button
          onClick={handleAddToCollection}
          className="event-card-button"
        >
          Add to Personal Collection
        </Button>
      ) }
      <h1>
        {timeline && timeline.title} by {timeline && timeline.user1?.username} & {timeline && timeline.user2?.username}
      </h1>

      <VerticalTimeline>
        <div>
          {sortedEventArray.map((event, index) => (
            <VerticalTimelineElement
              key={`${event.id}-${index}`}
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" />
              <h5>description: {event.description}</h5>
              <h3>{event.BCE === true ? 'BCE' : 'CE'}</h3>
              <h3>{event.isPrivate === true ? 'Private' : 'Public'}</h3>
              <h3>creator: {event.user_id.username}</h3>

              <p>
                {event.date}
              </p>
              <Button
                onClick={() => {
                  router.push(`/events/${event.id}`);
                }}
              >
                View
              </Button>
              {user.id === event.user_id.id ? (
                <Button onClick={() => handleRemoveEvent(event.id)} className="event-card-button">
                  Remove
                </Button>
              ) : ''}
            </VerticalTimelineElement>

          ))}
        </div>
      </VerticalTimeline>

    </div>
  );
}

export default CollaborativeTimeline;
