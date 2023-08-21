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
      deleteTimeline(id).then(() => onUpdate());
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
    };
    console.warn(timeline);
    setEditData(timeline); // Set the data to be edited
    setShowModal(true);
  };

  return (
    <>
      <div>
        <Card className="timeline-card">
          <Card.Header>Timeline {id}</Card.Header>
          <Card.Body>
            <h1>{title}</h1>
            <img src={imageUrl} style={{ width: '200px' }} />
            <div>{ispublic === true ? 'Public' : 'Private'}</div>
            <div>wowowow</div>

            <Button
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
                    onClick={deletethisTimeline}
                    className="post-card-button"
                  >
                    Delete
                  </Button>
                  <Button
                    className="post-card-button"
                    onClick={handleEditClick}

                  >
                    Edit
                  </Button>
                </>
              ) : ''}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Timeline</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <TimelineForm
                  obj={editData} // Pass the data to the form
                  onClose={() => setShowModal(false)}
                />
              </Modal.Body>
            </Modal>
          </Card.Body>
          <Card.Footer className="text-black">creator:{userId.username} </Card.Footer>
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
