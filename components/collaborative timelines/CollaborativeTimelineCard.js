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
import { deleteTimelineEvent, getTimelineEventsByTimelineId } from '../../API/timelineEvent';
import TimelineForm from '../timelines/TimelineForm';
import CollaborativeTimelineForm from './CollaborativeTimelineForm';
import { deleteCollaborativeTimeline } from '../../API/collaborativeTimelineData';
import { deleteCollaborativeTimelineEvent, getCollaborativeTimelineEventsByTimelineId } from '../../API/collaborativeTimelineEvents';
import collaborativeTimelineFormStyle from '../../styles/forms/collaborativeForm.module.css';
import collaborativeCardStyle from '../../styles/cards/collaborativeCard.module.css';

const CollaborativeTimelineCard = ({
  id,
  title,
  imageUrl,
  ispublic,
  gallery,
  dateAdded,
  user1,
  user2,
  onUpdate,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  // still need to get this functional
  const deletethisTimeline = () => {
    if (window.confirm('Delete this Timeline?')) {
      getCollaborativeTimelineEventsByTimelineId(id)
        .then((timelineEvents) => {
          const deleteTimelineEventPromises = timelineEvents.map((event) => deleteCollaborativeTimelineEvent(event.id));

          Promise.all(deleteTimelineEventPromises)
            .then(() => {
              deleteCollaborativeTimeline(id)
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
      user1,
      user2,
      onUpdate,
    };
    setEditData(timeline); // Set the data to be edited
    setShowModal(true);
  };

  return (
    <>
      <div>
        <Card className={collaborativeCardStyle.Card}>
          <Card.Header className={collaborativeCardStyle.CardHeader}> {user1.username} & {user2.username}</Card.Header>
          <Card.Body className={collaborativeCardStyle.CardBody}>
            <h1 className={collaborativeCardStyle.CardTitle}>{title}</h1>
            <img className={collaborativeCardStyle.CardImage} src={imageUrl} style={{ width: '200px' }} />
            <div>{ispublic === true ? 'Public' : 'Private'}</div>

            <Button
              className={collaborativeCardStyle.Button}
              onClick={() => {
                router.push(`/collaborativeTimelines/${id}`);
              }}
            >
              View
            </Button>

            {user.id === user1.id || user.id === user2.id
              ? (
                <>
                  <Button
                    onClick={deletethisTimeline}
                    className={collaborativeCardStyle.Button}
                  >
                    Delete
                  </Button>
                  <Button
                    className={collaborativeCardStyle.Button}
                    onClick={handleEditClick}

                  >
                    Edit
                  </Button>
                </>
              ) : ''}
            {showModal && Object.keys(editData).length > 0 && (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={collaborativeTimelineFormStyle.ModalHeader}>
                <Modal.Title>Edit Timeline</Modal.Title>
              </Modal.Header>
              <Modal.Body className={collaborativeTimelineFormStyle.ModalBody}>
                <CollaborativeTimelineForm
                  obj={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
            )}
          </Card.Body>
          <Card.Footer className={collaborativeCardStyle.CardFooter}>creator:{user1.username} </Card.Footer>
        </Card>
      </div>
    </>
  );
};

CollaborativeTimelineCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  ispublic: PropTypes.bool.isRequired,
  gallery: PropTypes.bool.isRequired,
  dateAdded: PropTypes.number.isRequired,
  user1: PropTypes.object.isRequired,
  user2: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,

};

export default CollaborativeTimelineCard;
