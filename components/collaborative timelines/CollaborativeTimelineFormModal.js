/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CollaborativeTimelineForm from './CollaborativeTimelineForm';
import collaborativeTimelineStyle from '../../styles/timelines/collaborativeTimeline.module.css';
import collaborativeTimelineFormStyle from '../../styles/forms/collaborativeForm.module.css';

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
        </Button>
      ))}
      <Modal show={show} fullscreen={false} onHide={() => setShow(false)}>
        <Modal.Header closeButton className={collaborativeTimelineFormStyle.ModalHeader}>
          <Modal.Title>Create Collaborative Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body className={collaborativeTimelineFormStyle.ModalBody}><CollaborativeTimelineForm /> </Modal.Body>
      </Modal>
    </>
  );
}

export default CollaborativeTimelineFormModal;
