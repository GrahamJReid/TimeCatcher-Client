/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createThread, getSingleThread, updateThread } from '../../API/threadsData';
import { useAuth } from '../../utils/context/authContext';
import { getUserPublicEvents } from '../../API/eventData';
import threadFormStyle from '../../styles/forms/threadForm.module.css';

function EventThreadForm({ thread }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: thread ? thread.title : '',
    description: thread ? thread.description : '',
    event: thread ? thread.event.id : false,
  });

  useEffect(() => {
    // If a thread is provided, fetch and populate the form with the thread data
    if (thread) {
      getSingleThread(thread.id)
        .then((data) => {
          setFormData({
            title: data.title,
            event: data.event.id,
            description: data.description, // Assuming data.event is an object with an 'id' property
          });
        })
        .catch((error) => {
          console.error('Error fetching thread data:', error);
        });
    }
  }, [thread]);

  useEffect(() => {
    getUserPublicEvents(user.id).then(setEvents);
  }, [thread]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const threadData = {
      title: formData.title,
      date: Date.now(), // Use formData.date directly
      user: user.id, // Assuming you have access to the user's ID
      event: formData.event,
      description: formData.description, // Replace with the event ID associated with the thread
    };

    if (thread) {
      // If threadId is provided, update the existing thread
      threadData.id = thread.id;
      updateThread(threadData)
        .then(() => {
          window.location.reload(true);
        })
        .catch((error) => {
          console.error('Error updating thread:', error);
        });
    } else {
      // If no threadId is provided, create a new thread
      createThread(threadData)
        .then(() => {
          // Handle successful creation (e.g., redirect or display a success message)
          window.location.reload(true);
        })
        .catch((error) => {
          console.error('Error creating thread:', error);
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={threadFormStyle.FormContainer}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      {thread ? '' : (
        <Form.Group className="mb-3">
          <Form.Label>Select Event</Form.Label>
          <Form.Control
            as="select"
            name="event"
            value={formData.event}
            onChange={handleInputChange}
          >
            <option value={null}>Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      ) }
      <Button type="submit" variant="primary" className={threadFormStyle.CreateButton}>
        {thread ? 'Update Thread' : 'Create Thread'}
      </Button>
    </Form>
  );
}
EventThreadForm.propTypes = {
  thread: PropTypes.shape({

    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    date: PropTypes.number.isRequired,
    isUser: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,

  }),
};

export default EventThreadForm;
