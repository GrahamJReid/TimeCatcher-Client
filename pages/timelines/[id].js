/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useRouter } from 'next/router';
import { Button, Dropdown } from 'react-bootstrap';
import {
  createTimelineEvent, deleteTimelineEvent, getSingleTimelineEvents, getTimelineEventsByEventId,
} from '../../API/timelineEvent';
import { createEvent, getUserEvents } from '../../API/eventData';
import { useAuth } from '../../utils/context/authContext';
import { createTimeline, getSingleTimeline } from '../../API/timelineData';
import EventFormModal from '../../components/events/EventFormModal';

function Timeline() {
  const [sortedEventArray, setSortedEventArray] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [timeline, setTimeline] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;

  useEffect(() => {
    getSingleTimeline(id).then((data) => {
      setTimeline(data);
    });
    // Create a copy of the eventArray and sort it by date
  }, []);

  const updateEvents = () => {
    getSingleTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
      setSortedEventArray(sortedEvents);
    });
  };

  useEffect(() => {
    getSingleTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
      setSortedEventArray(sortedEvents);
    });
    // Create a copy of the eventArray and sort it by date
  }, []);

  useEffect(() => {
    getUserEvents(user.id).then((data) => {
      setUserEvents(data);
    });
    // Create a copy of the eventArray and sort it by date
  }, []);

  const handleEventSelection = async (event) => {
    const timelineEvent = {
      timelineId: parseInt(id, 10),
      eventId: event.id,
    };
    console.warn(timelineEvent);
    await createTimelineEvent(timelineEvent).then(() => {
      updateEvents();
    });
  };
  const handleRemoveEvent = async (eventId) => {
    // Assuming getTimelineEventsByEventId returns an array of objects with a 'timeline_id' property
    getTimelineEventsByEventId(eventId).then((data) => {
      // Filter the objects that have 'timeline_id' equal to the 'id' from the router query
      const filteredData = data.filter((item) => item.timeline_id.id === parseInt(id, 10));
      console.warn(filteredData[0].id);
      deleteTimelineEvent(parseInt(filteredData[0].id, 10)).then(() => {
        updateEvents();
      });
      // Now, 'filteredData' contains the objects you need
      // You can perform further operations on this filtered data
    });
  };
  const handleAddToCollection = async () => {
    try {
      // Create a new timeline with the current user as the owner
      const newTimeline = {
        title: timeline.title,
        imageUrl: timeline.image_url,
        public: timeline.public,
        gallery: timeline.gallery,
        dateAdded: timeline.date_added,
        userId: user.id, // Set the owner to the current user
      };

      // Create the new timeline
      const createdTimeline = await createTimeline(newTimeline);

      // Use Promise.all to duplicate events asynchronously
      const eventPromises = sortedEventArray.map(async (event) => {
        const newEvent = {
          title: event.title,
          description: event.description,
          date: event.date,
          color: event.color,
          imageUrl: event.image_url,
          userId: user.id, // Set the owner to the current user
        };

        // Create the new event for the new timeline and return the promise
        return createEvent(newEvent);
      });

      // Wait for all event creation promises to resolve
      const createdEvents = await Promise.all(eventPromises);

      // Use Promise.all to create timeline events linking events to the timeline
      const timelineEventPromises = createdEvents.map(async (createdEvent) => {
        const timelineEvent = {
          timelineId: createdTimeline.id,
          eventId: createdEvent.id, // Use the ID of the newly created event
        };

        // Create the timeline event and return the promise
        return createTimelineEvent(timelineEvent);
      });

      // Wait for all timeline event creation promises to resolve
      await Promise.all(timelineEventPromises);

      // Optionally, you can redirect the user to their collection of timelines
      router.push('/timelines/MyTimelines');

      // Log the result
      console.warn('Timeline and events successfully added to the collection:', createdTimeline);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding timeline to the collection:', error);
    }
  };

  console.warn('are these equal', user.id, timeline.user_id);
  return (
    <div>
      {timeline.user_id && timeline.user_id.id === user.id ? (
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
          <EventFormModal />
        </>
      ) : (
        <Button
          onClick={handleAddToCollection}
          className="event-card-button"
        >
          Add
        </Button>
      )}
      <VerticalTimeline>
        <h1>{timeline.title}</h1>
        <div>
          {sortedEventArray.map((event) => (
            <VerticalTimelineElement
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" />
              <h5>description: {event.description}</h5>

              <p>
                {event.date}
              </p>
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

export default Timeline;
