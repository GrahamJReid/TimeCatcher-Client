/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ThreadCommentForm from './ThreadCommentForm';
import threadStyle from '../../styles/threads/viewSingleThread.module.css';

function ThreadCommentFormModal() {
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
        <Button key={idx} className={threadStyle.CreateButton} onClick={() => handleShow(v)}>
          Add Comment
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={false} onHide={() => setShow(false)}>
        <Modal.Header closeButton className={threadStyle.ModalHeader}>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body className={threadStyle.ModalBody}><ThreadCommentForm /> </Modal.Body>
        <Modal.Footer className={threadStyle.ModalFooter} />
      </Modal>
    </>
  );
}

export default ThreadCommentFormModal;
