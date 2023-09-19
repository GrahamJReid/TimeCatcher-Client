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
import threadStyle from '../../styles/threads/viewSingleThread.module.css';
import commentCardStyle from '../../styles/cards/commentCard.module.css';

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
      onUpdate,
    };
    setEditData(eventData);
    setShowModal(true);
  };
  console.warn(thread.user, 'this is the user you are looking for?');
  return (
    <>
      <div>
        <Card className={commentCardStyle.Card}>
          <Card.Header><></></Card.Header>
          <Card.Body>

            <p> {content}</p>

            {(user.id === isUser.id || user.id === thread.user) && (
            <>
              <Button onClick={deleteThisComment} className={commentCardStyle.Button}>
                Delete
              </Button>
              {user.id === isUser.id && (
              <Button onClick={handleEditClick} className={commentCardStyle.Button}>
                Edit
              </Button>
              )}
            </>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton className={threadStyle.ModalBody}>
                <Modal.Title>Edit Comment</Modal.Title>
              </Modal.Header>
              <Modal.Body className={threadStyle.ModalBody}>
                <ThreadCommentForm
                  comment={editData}
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer className={commentCardStyle.CardFooter}>Creator: {isUser.username}</Card.Footer>
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
