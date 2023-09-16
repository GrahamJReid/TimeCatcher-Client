/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EventThreadForm from './EventThreadForm';
import threadPageStyle from '../../styles/threads/eventThreadPage.module.css';

function EventThreadFormModal() {
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
        <Button key={idx} className={threadPageStyle.CreateButton} onClick={() => handleShow(v)}>
          Create Thread
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body><EventThreadForm /> </Modal.Body>
      </Modal>
    </>
  );
}

export default EventThreadFormModal;
