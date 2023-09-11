/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { createThreadComment, getSingleThreadComment, updateThreadComment } from '../../API/threadCommentData';

function ThreadCommentForm({ comment }) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    content: comment ? comment.content : '',
  });

  useEffect(() => {
    // If a comment is provided, fetch and populate the form with the comment data
    if (comment) {
      getSingleThreadComment(comment.id)
        .then((data) => {
          setFormData({
            content: data.content,
          });
        })
        .catch((error) => {
          console.error('Error fetching comment data:', error);
        });
    }
  }, [comment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      content: formData.content,
      date: Date.now(),
      user: user.id,
      thread: id,
    };

    if (comment) {
      // If commentId is provided, update the existing comment
      commentData.id = comment.id;
      commentData.date = comment.date;
      updateThreadComment(commentData)
        .then(() => {
          window.location.reload(true);
        })
        .catch((error) => {
          console.error('Error updating comment:', error);
        });
    } else {
      // If no commentId is provided, create a new comment
      createThreadComment(commentData)
        .then(() => {
          // Handle successful creation (e.g., redirect or display a success message)
          window.location.reload(true);
        })
        .catch((error) => {
          console.error('Error creating comment:', error);
        });
    }
  };
  console.warn('this is the id that corresponds to the thread id', id);
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          type="text"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        {comment ? 'Update Comment' : 'Create Comment '}
      </Button>
    </Form>
  );
}
ThreadCommentForm.propTypes = {
  comment: PropTypes.shape({

    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    thread: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,

  }),
};

export default ThreadCommentForm;
