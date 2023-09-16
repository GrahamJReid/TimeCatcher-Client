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
        <Card className="event-card">
          <Card.Header>Event {id}</Card.Header>
          <Card.Body>
            <h1>{title}</h1>
            <img src={imageUrl} alt={title} style={{ width: '200px' }} />
            <p>{description}</p>
            <div>Date: {date}</div>
            <div>{BCE === true ? 'BCE' : 'CE'}</div>
            <div>{isPrivate === true ? 'Private' : 'Public'}</div>
            <div>Color: <span style={{ color }}>{color}</span></div>

            <Button
              onClick={() => {
                router.push(`/events/${id}`);
              }}
            >
              View
            </Button>

            {user.id === userId.id ? (
              <>
                <Button onClick={deleteThisEvent} className="event-card-button">
                  delete
                </Button>
                <Button
                  onClick={handleEditClick}
                  className="event-card-button"
                >
                  Edit
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddEvent}
                className="event-card-button"
              >
                Add
              </Button>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={eventFormStyle.ModalHeader}>
                <Modal.Title>Edit Event</Modal.Title>
              </Modal.Header>
              <Modal.Body className={eventFormStyle.ModalBody}>
                {imageUrl ? <img src={imageUrl} width="300px" /> : ''}
                <EventForm
                  obj={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer className="text-black">Creator: {userId.username}</Card.Footer>
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
