/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import React from 'react';

import { Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { deleteTimeline } from '../../API/timelineData';
import { useAuth } from '../../utils/context/authContext';

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
  const deletethisTimeline = () => {
    if (window.confirm('Delete this Timeline?')) {
      deleteTimeline(id).then(() => onUpdate());
    }
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
                    onClick={() => {
                      router.push(`/products/edit/${id}`);
                    }}
                  >
                    Edit Product
                  </Button>
                </>
              ) : ''}
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
