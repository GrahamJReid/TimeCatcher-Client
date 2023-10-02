/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimelineForm from './TimelineForm';
import TimelineFormStyle from '../../styles/forms/timelineForm.module.css';
import myTimelineStyle from '../../styles/timelines/myTimelines.module.css';

function TimelineFormModal() {
  const [show, setShow] = useState(false);

  const toggleModal = () => {
    setShow(!show);
  };

  return (
    <>
      <Button className={myTimelineStyle.CreateButton} onClick={toggleModal}>
        Create Timeline
      </Button>

      <Modal show={show} fullscreen={false} onHide={toggleModal}>
        <Modal.Header closeButton className={TimelineFormStyle.ModalHeader}>
          <Modal.Title>Create Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={TimelineFormStyle.ModalBody}
        >
          <TimelineForm />
        </Modal.Body>
        <Modal.Footer className={TimelineFormStyle.ModalFooter} />
      </Modal>
    </>
  );
}

export default TimelineFormModal;
