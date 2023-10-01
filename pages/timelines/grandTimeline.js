/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useRouter } from 'next/router';
// Make sure to import createTimeline from your API
import { getSingleTimelineEvents } from '../../API/timelineEvent';
import { useAuth } from '../../utils/context/authContext';
import GrandTimelineForm from '../../components/timelines/GrandTimelineForm';
import { getUserTimelines } from '../../API/timelineData';
import grandTimelineStyle from '../../styles/timelines/grandTimeline.module.css';
import timelineFormStyle from '../../styles/forms/timelineForm.module.css';

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
    <div className={grandTimelineStyle.GrandTimelineContainer}>
      <h1 className={grandTimelineStyle.Title}>GrandTimeline</h1>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={grandTimelineStyle.SingleTimelineAddEventButton}>
          Select Timelines
        </Dropdown.Toggle>
        <Dropdown.Menu className={grandTimelineStyle.SingleTimelineDropDownMenu}>
          {userTimelines.map((timeline) => (
            <Dropdown.Item key={timeline.id} onClick={() => handleTimelineSelect(timeline)} className={grandTimelineStyle.DropDownMenuItem}>
              {timeline.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Button onClick={handleCreateTimeline} className={grandTimelineStyle.SingleTimelineAddTimelineButton}>Create Timeline</Button>
      <VerticalTimeline>

        {selectedTimelinesEvents.map((event, index) => (
          <VerticalTimelineElement
            key={`${event.id}-${index}`}
            contentStyle={{ background: `${event.color}`, color: '#fff' }}
            contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
            date={event.date}
            iconStyle={{ background: `${event.color}`, color: '#fff' }}
          >
            <div className={grandTimelineStyle.TimelineEventContainer}>
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" alt={`Event ${index}`} className={grandTimelineStyle.Image} />
              <Accordion className={grandTimelineStyle.Accordion}>
                <Accordion.Item className={grandTimelineStyle.AccordionItem} eventKey="0">
                  <Accordion.Header className={grandTimelineStyle.AccordionHeader}>Description</Accordion.Header>
                  <Accordion.Body className={grandTimelineStyle.AccordionBody}>
                    <div>{event.description}</div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <h3>{event.BCE === true ? 'BCE' : 'CE'}</h3>
              <h3>{event.isPrivate === true ? 'Private' : 'Public'}</h3>
              <p>
                {event.date}
              </p>
              <Button
                className={grandTimelineStyle.TimelineEventButton}
                onClick={() => {
                  router.push(`/events/${event.id}`);
                }}
              >
                View
              </Button>
            </div>
          </VerticalTimelineElement>
        ))}

      </VerticalTimeline>

      <Modal show={showModal} onHide={handleCloseModal} className={timelineFormStyle.GrandTimelineModal}>
        <Modal.Header closeButton className={timelineFormStyle.ModalHeader}>
          <Modal.Title>Create Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body className={timelineFormStyle.ModalBody}>
          <GrandTimelineForm
            events={selectedTimelinesEvents}
          />
        </Modal.Body>
        <Modal.Footer className={timelineFormStyle.ModalFooter} />
      </Modal>
    </div>
  );
}

export default GrandTimeline;
