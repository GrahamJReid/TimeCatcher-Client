/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CollaborativeTimelineForm from './CollaborativeTimelineForm';
import collaborativeTimelineStyle from '../../styles/timelines/collaborativeTimeline.module.css';

function CollaborativeTimelineFormModal() {
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
        <Button key={idx} className={collaborativeTimelineStyle.CreateButton} onClick={() => handleShow(v)}>
          Create Collaborative Timeline
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Collaborative Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body><CollaborativeTimelineForm /> </Modal.Body>
      </Modal>
    </>
  );
}

export default CollaborativeTimelineFormModal;
