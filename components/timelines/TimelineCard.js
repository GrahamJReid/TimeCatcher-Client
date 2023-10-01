/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Button, Card, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { deleteTimeline } from '../../API/timelineData';
import { useAuth } from '../../utils/context/authContext';
import TimelineForm from './TimelineForm';
import { deleteTimelineEvent, getTimelineEventsByTimelineId } from '../../API/timelineEvent';
import timelineFormStyle from '../../styles/forms/timelineForm.module.css';
import timelineCardStyle from '../../styles/cards/timelineCard.module.css';

const TimelineCard = ({
  id,
  title,
  imageUrl,
  ispublic,
  gallery,
  dateAdded,
  userId,
  onUpdate,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  const deletethisTimeline = () => {
    if (window.confirm('Delete this Timeline?')) {
      getTimelineEventsByTimelineId(id)
        .then((timelineEvents) => {
          const deleteTimelineEventPromises = timelineEvents.map((event) => deleteTimelineEvent(event.id));

          Promise.all(deleteTimelineEventPromises)
            .then(() => {
              deleteTimeline(id)
                .then(() => onUpdate());
            });
        });
    }
  };
  const handleEditClick = () => {
    const timeline = {
      id,
      title,
      imageUrl,
      ispublic,
      gallery,
      dateAdded,
      userId,
      onUpdate,
    };
    setEditData(timeline); // Set the data to be edited
    setShowModal(true);
  };

  return (
    <>
      <div>
        <Card className={timelineCardStyle.Card}>
          <Card.Header className={timelineCardStyle.CardTitle}>{title}</Card.Header>
          <Card.Body className={timelineCardStyle.TimelineCardBody}>
            <img className={timelineCardStyle.CardImage} src={imageUrl} style={{ width: '200px' }} />
            <div className={timelineCardStyle.CardPublicPrivate}>{ispublic === true ? 'Public' : 'Private'}</div>

            <Button
              className={timelineCardStyle.Button}
              onClick={() => {
                router.push(`/timelines/${id}`);
              }}
            >
              View
            </Button>

            {user.id === userId.id
              ? (
                <>
                  <Button
                    className={timelineCardStyle.Button}
                    onClick={deletethisTimeline}
                  >
                    Delete
                  </Button>
                  <Button
                    className={timelineCardStyle.Button}
                    onClick={handleEditClick}

                  >
                    Edit
                  </Button>
                </>
              ) : ''}
            {showModal && Object.keys(editData).length > 0 && (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={timelineFormStyle.ModalHeader}>
                <Modal.Title>Edit Timeline</Modal.Title>
              </Modal.Header>
              <Modal.Body className={timelineFormStyle.ModalBody}>
                <TimelineForm
                  obj={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
              <Modal.Footer className={timelineFormStyle.ModalFooter} />
            </Modal>
            )}
          </Card.Body>
          <Card.Footer className={timelineCardStyle.CardFooter}>Creator: {userId.username} </Card.Footer>
        </Card>
      </div>
    </>
  );
};

TimelineCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  ispublic: PropTypes.bool.isRequired,
  gallery: PropTypes.bool.isRequired,
  dateAdded: PropTypes.number.isRequired,
  userId: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,

};

export default TimelineCard;
