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
import { deleteThreadComment, getThreadComments } from '../../API/threadCommentData';
import { deleteFollowThread, getFollowThreads } from '../../API/followThreadsData';
import { deleteThread } from '../../API/threadsData';
import threadFormStyle from '../../styles/forms/threadForm.module.css';
import threadCardStyle from '../../styles/cards/threadCard.module.css';

const EventThreadCard = ({
  id,
  title,
  date,
  isUser,
  event,
  description,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const { user } = useAuth();

  const deleteThisThread = async () => {
    // Confirm deletion
    const confirmDelete = window.confirm('Delete this Event?');
    if (!confirmDelete) {
      return;
    }

    try {
      // Fetch and delete all thread comments associated with the thread
      const threadComments = await getThreadComments(id);
      const commentIds = threadComments.map((comment) => deleteThreadComment(comment.id));

      // Fetch and delete all followThread data associated with the thread
      const followThreads = await getFollowThreads();
      const followThreadToDelete = followThreads.find((followThread) => followThread.thread.id === id);
      if (followThreadToDelete) {
        await deleteFollowThread(followThreadToDelete.id);
      }

      // Finally, delete the thread itself
      await deleteThread(id);

      // Redirect to a different page or update the UI as needed
      window.location.reload(true); // Redirect to the events page
    } catch (error) {
      console.error('Error deleting thread and associated data:', error);
    }
  };

  const handleEditClick = () => {
    const eventData = {
      id,
      title,
      event,
      isUser,
      date,
      description,
    };
    setEditData(eventData);
    setShowModal(true);
  };
  console.warn(isUser);
  return (
    <>
      <div>
        <Card className={threadCardStyle.Card}>
          <Card.Header className={threadCardStyle.CardTitle}>{title}</Card.Header>
          <Card.Body className={threadCardStyle.CardBody}>
            <img className={threadCardStyle.CardImage} src={event.image_url} alt={title} style={{ width: '200px' }} />
            <h2>associated event: {event.title}</h2>

            <Button
              className={threadCardStyle.Button}
              onClick={() => {
                router.push(`/events/threads/${id}`);
              }}
            >
              View
            </Button>

            {user.id === isUser.id ? (
              <>
                <Button onClick={deleteThisThread} className={threadCardStyle.Button}>
                  Delete
                </Button>
                <Button
                  onClick={handleEditClick}
                  className={threadCardStyle.Button}
                >
                  Edit
                </Button>
              </>
            ) : (
              ''
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={threadFormStyle.ModalHeader}>
                <Modal.Title>Edit Thread</Modal.Title>
              </Modal.Header>
              <Modal.Body className={threadFormStyle.ModalBody}>
                {event ? <img src={event.image_url} width="300px" /> : ''}
                <EventThreadForm
                  thread={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer className={threadCardStyle.CardFooter}>Creatorz: {isUser.username}</Card.Footer>
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
  description: PropTypes.string.isRequired,
};

export default EventThreadCard;
