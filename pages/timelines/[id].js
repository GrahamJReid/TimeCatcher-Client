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
import { getSingleTimeline } from '../../API/timelineData';
import EventFormModal from '../../components/events/EventFormModal';
import addTimeline from '../../API/addTimelineData';

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
    document.title = 'View Timeline';
  }, []);

  const updateEvents = () => {
    getSingleTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => {
        const dateA = a.BCE ? -new Date(a.date) : new Date(a.date);
        const dateB = b.BCE ? -new Date(b.date) : new Date(b.date);
        return dateA - dateB;
      });
      setSortedEventArray(sortedEvents);
    });
  };

  useEffect(() => {
    getSingleTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => {
        const dateA = a.BCE ? -new Date(a.date) : new Date(a.date);
        const dateB = b.BCE ? -new Date(b.date) : new Date(b.date);
        return dateA - dateB;
      });
      setSortedEventArray(sortedEvents);
    });
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
    await createTimelineEvent(timelineEvent).then(() => {
      updateEvents();
    });
  };
  const handleRemoveEvent = async (eventId) => {
    getTimelineEventsByEventId(eventId).then((data) => {
      const filteredData = data.filter((item) => item.timeline_id.id === parseInt(id, 10));

      deleteTimelineEvent(parseInt(filteredData[0].id, 10)).then(() => {
        updateEvents();
      });
    });
  };
  const handleAddToCollection = async () => {
    const payload = {
      userId: user.id,
      timeline: {
        title: timeline.title,
        image_url: timeline.image_url,
        public: timeline.public,
        gallery: timeline.gallery,
        date_added: timeline.date_added,
      },
      events: sortedEventArray.map((event) => ({
        title: event.title,
        description: event.description,
        date: event.date,
        color: event.color,
        image_url: event.image_url,
        BCE: event.BCE,
      })),
    };

    await addTimeline(payload);
    router.push('/timelines/MyTimelines');
  };

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
              key={event.id}
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" />
              <h5>description: {event.description}</h5>
              <h3>{event.BCE === true ? 'BCE' : 'CE'}</h3>

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

export default Timeline;
