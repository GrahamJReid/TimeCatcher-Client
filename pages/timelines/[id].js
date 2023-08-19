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
import { getUserEvents } from '../../API/eventData';
import { useAuth } from '../../utils/context/authContext';

function Timeline() {
  const [sortedEventArray, setSortedEventArray] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;

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
    // window.location.reload(true);

    // Here, you can create a new timeline event using the selected event data.
    // You might need to implement this logic based on your data structure.
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
  return (
    <div>
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
      <VerticalTimeline>

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
