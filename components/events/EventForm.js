/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
// Update with your event data API file
import awsCredentials from '../../.awsCred';
import { createEvent, updateEvent } from '../../API/eventData';
import Loading from '../Loading';
import { createTimelineEvent } from '../../API/timelineEvent';
import eventFormStyle from '../../styles/forms/eventForm.module.css';

function EventForm({ obj }) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: obj ? obj.title : '',
    description: obj ? obj.description : '',
    imageUrl: null,
    date: obj ? obj.date : '',
    color: obj ? obj.color : '',
    BCE: obj ? obj.BCE : false,
    isPrivate: obj ? obj.isPrivate : false,

  });

  useEffect(() => {
    if (obj) {
      setFormData({
        title: obj.title,
        description: obj.description,
        imageUrl: obj.imageUrl,
        date: obj.date,
        color: obj.color,
        BCE: obj.BCE,
        isPrivate: obj.isPrivate,
      });
    }
  }, [obj]);

  const handleInputChange = (e) => {
    const {
      name, value, type, files,
    } = e.target;

    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
        imageName: files[0].name,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const uploadImageToS3 = async (file) => {
    const s3 = new S3Client({
      region: awsCredentials.awsRegion,
      credentials: {
        accessKeyId: awsCredentials.awsAccessKeyId,
        secretAccessKey: awsCredentials.awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'timecatchertestbucket',
      Key: `eventImages/${file.name}`,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let updatedImageUrl = formData.imageUrl;

    if (formData.image) {
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        updatedImageUrl = awsImageUrl;
      }
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      imageUrl: updatedImageUrl,
      date: formData.date,
      color: formData.color,
      BCE: formData.BCE,
      isPrivate: formData.isPrivate,
      userId: user.id,
    };

    if (obj) {
      eventData.id = obj.id;
      await updateEvent(eventData);
    } else {
      const newEvent = await createEvent(eventData);
      if (id) {
        console.warn(newEvent, 'this is the new event that was just created');
        const timelineEventPayload = {
          timelineId: id,
          eventId: newEvent.id,

        };
        await createTimelineEvent(timelineEventPayload);
      }
    }
    setLoading(false);
    window.location.reload(true);
  };
  console.warn(id, 'this should be the timeline you are viewing id');
  return (

    <Form
      onSubmit={handleSubmit}
      className={eventFormStyle.FormContainer}
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          wrap="soft"
          as="textarea"
          style={{ maxHeight: '150px', height: '150px', width: '100%' }}
          required
          value={formData.description}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          name="date"
          type="date"
          required
          value={formData.date}
          onChange={handleInputChange}
        />
        <Form.Check
          type="switch"
          id="BCE"
          name="BCE"
          label="BCE"
          checked={formData.BCE}
          onChange={(e) => {
            setFormData((prevState) => ({
              ...prevState,
              BCE: e.target.checked,
            }));
          }}
        />
        <Form.Check
          type="switch"
          id="isPrivate"
          name="isPrivate"
          label="Private"
          checked={formData.isPrivate}
          onChange={(e) => {
            setFormData((prevState) => ({
              ...prevState,
              isPrivate: e.target.checked,
            }));
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Color</Form.Label>
        <Form.Control
          name="color"
          type="color"
          required
          value={formData.color}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image</Form.Label>
        <Form.Control
          name="image"
          {...obj ? '' : { required: true }}
          type="file"
          onChange={handleInputChange}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        className={eventFormStyle.CreateButton}
        disabled={loading}
      >
        {loading ? (
          <Loading /> // Show the Loading component when loading is true
        ) : (
          obj ? 'Edit Event' : 'Create Event'
        )}
      </Button>
    </Form>
  );
}

EventForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    color: PropTypes.string,
    userId: PropTypes.object,
    BCE: PropTypes.bool,
    isPrivate: PropTypes.bool,
  }),
};

export default EventForm;
