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

import { useAuth } from '../../utils/context/authContext';
import EventThreadForm from './EventThreadForm';

const EventThreadCard = ({
  id,
  title,
  date,
  isUser,
  event,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const { user } = useAuth();

  const deleteThisThread = () => {
    window.confirm('Delete this Event?');
    console.warn('update delete functionality');
  };

  const handleEditClick = () => {
    const eventData = {
      id,
      title,
      event,
      isUser,
      date,
    };
    setEditData(eventData);
    setShowModal(true);
  };
  console.warn(isUser);
  return (
    <>
      <div>
        <Card className="event-card">
          <Card.Header>Thread {id}</Card.Header>
          <Card.Body>
            <h1>{title}</h1>
            <img src={event.image_url} alt={title} style={{ width: '200px' }} />
            <h2>associated event: {event.title}</h2>

            <Button
              onClick={() => {
                router.push(`/events/threads/${id}`);
              }}
            >
              View
            </Button>

            {user.id === isUser.id ? (
              <>
                <Button onClick={deleteThisThread} className="event-card-button">
                  Delete
                </Button>
                <Button
                  onClick={handleEditClick}
                  className="event-card-button"
                >
                  Edit
                </Button>
              </>
            ) : (
              ''
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Thread</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {event ? <img src={event.image_url} width="300px" /> : ''}
                <EventThreadForm
                  thread={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer className="text-black">Creator: {isUser.username}</Card.Footer>
        </Card>
      </div>
    </>
  );
};

EventThreadCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  isUser: PropTypes.object.isRequired,
  date: PropTypes.number.isRequired,
};

export default EventThreadCard;
