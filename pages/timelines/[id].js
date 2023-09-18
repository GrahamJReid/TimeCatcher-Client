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
import Accordion from 'react-bootstrap/Accordion';
import {
  createTimelineEvent, deleteTimelineEvent, getSingleTimelineEvents, getTimelineEventsByEventId,
} from '../../API/timelineEvent';
import { getUserEvents } from '../../API/eventData';
import { useAuth } from '../../utils/context/authContext';
import { getSingleTimeline } from '../../API/timelineData';
import EventFormModal from '../../components/events/EventFormModal';
import addTimeline from '../../API/addTimelineData';
import viewSingleTimelineStyle from '../../styles/timelines/viewSingleTimeline.module.css';

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
        } if (user.id === event.user_id.id && event.isPrivate) {
          // Show private events of the current user
          return true;
        } if (!event.isPrivate) {
          // Show non-private events if the user is not the owner
          return true;
        }
        return false; // Hide other private events // Hide private events if the user is not the owner
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
  console.warn(sortedEventArray);
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
        isPrivate: event.isPrivate,
      })),
    };

    await addTimeline(payload);
    router.push('/timelines/MyTimelines');
  };
  return (
    <div className={viewSingleTimelineStyle.SingleTimelineContainer}>
      <h1 className={viewSingleTimelineStyle.Title}>{timeline.title}</h1>

      {timeline.user_id && timeline.user_id.id === user.id ? (
        <>
          <Dropdown>
            <Dropdown.Toggle className={viewSingleTimelineStyle.SingleTimelineAddEventButton} id="dropdown-basic">
              Add Event
            </Dropdown.Toggle>
            <Dropdown.Menu className={viewSingleTimelineStyle.SingleTimelineDropDownMenu}>
              {userEvents.map((event) => (
                <Dropdown.Item className={viewSingleTimelineStyle.DropDownMenuItem} key={event.id} onClick={() => handleEventSelection(event)}>
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
          className={viewSingleTimelineStyle.SingleTimelineAddTimelineButton}
        >
          Add
        </Button>
      )}
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
              <Accordion className={viewSingleTimelineStyle.Accordion}>
                <Accordion.Item className={viewSingleTimelineStyle.AccordionItem} eventKey="0">
                  <Accordion.Header className={viewSingleTimelineStyle.AccordionHeader}>Description</Accordion.Header>
                  <Accordion.Body className={viewSingleTimelineStyle.AccordionBody}>
                    <div>{event.description}</div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <h3>{event.isPrivate === true ? 'Private' : 'Public'}</h3>

              <h3>
                {event.date}
              </h3>
              <h3>{event.BCE === true ? 'BCE' : 'CE'}</h3>
              <Button
                className={viewSingleTimelineStyle.TimelineEventButton}
                onClick={() => {
                  router.push(`/events/${event.id}`);
                }}
              >
                View
              </Button>
              {user.id === event.user_id.id ? (
                <Button onClick={() => handleRemoveEvent(event.id)} className={viewSingleTimelineStyle.TimelineEventButton}>
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
