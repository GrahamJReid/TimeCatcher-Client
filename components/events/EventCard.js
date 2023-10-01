/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { useRouter } from 'next/router';
import EventForm from './EventForm';
import { useAuth } from '../../utils/context/authContext';
import { createEvent, deleteEvent } from '../../API/eventData';
import { deleteTimelineEvent, getTimelineEventsByEventId } from '../../API/timelineEvent';
import eventFormStyle from '../../styles/forms/eventForm.module.css';
import eventCardStyle from '../../styles/cards/eventCard.module.css';

const EventCard = ({
  id,
  title,
  imageUrl,
  description,
  date,
  color,
  userId,
  BCE,
  isPrivate,
  onUpdate,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  const deleteThisEvent = () => {
    if (window.confirm('Delete this Event?')) {
      getTimelineEventsByEventId(id)
        .then((timelineEvents) => {
          const deleteTimelineEventPromises = timelineEvents.map((event) => deleteTimelineEvent(event.id));

          Promise.all(deleteTimelineEventPromises)
            .then(() => {
              deleteEvent(id)
                .then(() => onUpdate());
            });
        });
    }
  };

  const handleEditClick = () => {
    const eventData = {
      id,
      title,
      imageUrl,
      description,
      date,
      color,
      userId,
      BCE,
      isPrivate,
    };
    setEditData(eventData);
    setShowModal(true);
  };
  const handleAddEvent = () => {
    const eventData = {
      title,
      imageUrl,
      description,
      date,
      color,
      BCE,
      isPrivate,
      userId: user.id,
    };
    createEvent(eventData);
    window.alert('event added');
  };

  return (
    <>
      <div>
        <Card className={eventCardStyle.Card}>
          <Card.Header className={eventCardStyle.CardHeader}>{title}</Card.Header>
          <Card.Body className={eventCardStyle.CardBody}>
            <img className={eventCardStyle.CardImage} src={imageUrl} alt={title} style={{ width: '200px' }} />
            <div className={eventCardStyle.CardDate}>Date: {date}</div>
            <div className={eventCardStyle.CardBCE}>{BCE === true ? 'BCE' : 'CE'}</div>
            <div className={eventCardStyle.CardPrivatePublic}>{isPrivate === true ? 'Private' : 'Public'}</div>
            <div className={eventCardStyle.CardColor}>Color: <span style={{ color }}>{color}</span></div>

            <Button
              className={eventCardStyle.Button}
              onClick={() => {
                router.push(`/events/${id}`);
              }}
            >
              View
            </Button>

            {user.id === userId.id ? (
              <>
                <Button onClick={deleteThisEvent} className={eventCardStyle.Button}>
                  Delete
                </Button>
                <Button
                  onClick={handleEditClick}
                  className={eventCardStyle.Button}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddEvent}
                className={eventCardStyle.Button}
              >
                Add
              </Button>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={eventFormStyle.ModalHeader}>
                <Modal.Title>Edit Event</Modal.Title>
              </Modal.Header>
              <Modal.Body className={eventFormStyle.ModalBody}>
                {imageUrl ? <img src={imageUrl} className={eventFormStyle.Image} /> : ''}
                <EventForm
                  obj={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
              <Modal.Footer className={eventFormStyle.ModalFooter} />
            </Modal>
          </Card.Body>
          <Card.Footer className={eventFormStyle.CardFooter}>Creator: {userId.username}</Card.Footer>
        </Card>
      </div>
    </>
  );
};

EventCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  userId: PropTypes.object.isRequired,
  BCE: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isPrivate: PropTypes.bool.isRequired,
};

export default EventCard;
