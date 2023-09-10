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
import ThreadCommentForm from './ThreadCommentForm';
import { deleteThreadComment } from '../../API/threadCommentData';

const ThreadCommentCard = ({
  id,
  content,
  thread,
  isUser,
  date,
  onUpdate,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const { user } = useAuth();

  const deleteThisComment = () => {
    window.confirm('Delete this comment?');
    console.warn('update delete functionality');
    deleteThreadComment(id).then(() => onUpdate());
  };

  const handleEditClick = () => {
    const eventData = {
      id,
      content,
      thread,
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
          <Card.Header>comment {id}</Card.Header>
          <Card.Body>

            <h2> {content}</h2>

            {user.id === isUser.id ? (
              <>
                <Button onClick={deleteThisComment} className="event-card-button">
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
                <Modal.Title>Edit Comment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ThreadCommentForm
                  comment={editData}
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

ThreadCommentCard.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  thread: PropTypes.object.isRequired,
  isUser: PropTypes.object.isRequired,
  date: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ThreadCommentCard;
