/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EventForm from './EventForm';
import myEventsStyle from '../../styles/events/myEvents.module.css';
import eventFormStyle from '../../styles/forms/eventForm.module.css';
import singleTimelineStyle from '../../styles/timelines/viewSingleTimeline.module.css';

function EventFormModal() {
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button key={idx} className={myEventsStyle.CreateButton} id={singleTimelineStyle.CreateButton} onClick={() => handleShow(v)}>
          Create Event
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={false} onHide={() => setShow(false)}>
        <Modal.Header closeButton className={eventFormStyle.ModalHeader}>
          <Modal.Title>Create Events</Modal.Title>
        </Modal.Header>
        <Modal.Body className={eventFormStyle.ModalBody}><EventForm /> </Modal.Body>
      </Modal>
    </>
  );
}

export default EventFormModal;
