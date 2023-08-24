/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getUserTimelines } from '../../API/eventData'; // Make sure to import createTimeline from your API
import { getSingleTimelineEvents } from '../../API/timelineEvent';
import { useAuth } from '../../utils/context/authContext';
import GrandTimelineForm from '../../components/timelines/GrandTimelineForm';

function GrandTimeline() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTimelines, setSelectedTimelines] = useState([]);
  const [userTimelines, setUserTimelines] = useState([]);
  const [selectedTimelinesEvents, setSelectedTimelinesEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUserTimelines(user.id).then(setUserTimelines);
  }, []);

  const handleTimelineSelect = async (timeline) => {
    const timelineIds = selectedTimelines.map((t) => t.id);
    if (!timelineIds.includes(timeline.id)) {
      setSelectedTimelines([...selectedTimelines, timeline]);

      const events = await getSingleTimelineEvents(timeline.id);

      const sortedEvents = [...selectedTimelinesEvents, ...events].sort((a, b) => {
        const dateA = a.BCE ? -new Date(a.date) : new Date(a.date);
        const dateB = b.BCE ? -new Date(b.date) : new Date(b.date);
        return dateA - dateB;
      });

      setSelectedTimelinesEvents(sortedEvents);
    }
  };

  const handleCreateTimeline = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={handleCreateTimeline}>Create Timeline</Button>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Select Timelines
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {userTimelines.map((timeline) => (
            <Dropdown.Item key={timeline.id} onClick={() => handleTimelineSelect(timeline)}>
              {timeline.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <VerticalTimeline>
        <div>
          {selectedTimelinesEvents.map((event, index) => (
            <VerticalTimelineElement
              key={`${event.id}-${index}`}
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" alt={`Event ${index}`} />
              <h5>description: {event.description}</h5>

              <p>
                <h3>{event.BCE === true ? 'BCE' : 'CE'}</h3>
                {event.date}
              </p>
              <Button
                onClick={() => {
                  router.push(`/events/${event.id}`);
                }}
              >
                View
              </Button>
            </VerticalTimelineElement>
          ))}
        </div>
      </VerticalTimeline>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GrandTimelineForm
            events={selectedTimelinesEvents}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* Modify the "Save" Button to Trigger handleSaveNewTimeline */}
          <Button variant="primary">
            Save Timeline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GrandTimeline;
