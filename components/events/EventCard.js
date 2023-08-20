/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import EventForm from './EventForm'; // Import the EventForm component
import { useAuth } from '../../utils/context/authContext';
import { createEvent, deleteEvent } from '../../API/eventData'; // Update with your event data API file

const EventCard = ({
  id,
  title,
  imageUrl,
  description,
  date,
  color,
  userId,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  const deleteThisEvent = () => {
    if (window.confirm('Delete this Event?')) {
      deleteEvent(id).then(() => onUpdate());
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
            <div>Color: <span style={{ color }}>{color}</span></div>

            {user.id === userId.id ? (
              <>
                <Button onClick={deleteThisEvent} className="event-card-button">
                  Delete
                </Button>
                <Button
                  onClick={handleEditClick}
                  className="event-card-button"
                >
                  Edit Event
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
              <Modal.Header closeButton>
                <Modal.Title>Edit Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
  onUpdate: PropTypes.func.isRequired,
};

export default EventCard;
